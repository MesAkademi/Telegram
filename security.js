/**
 * MESA SECURITY - Güvenlik ve Memnuniyet Modülü
 * Zero-trust güvenlik + Mükemmel kullanıcı deneyimi
 */

const crypto = require('crypto');

// ==========================================
// GÜVENLİK YAPILANDIRMASI
// ==========================================

const SECURITY_CONFIG = {
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 dakika
    maxRequests: 100, // IP başına
    maxMessages: 30, // Kullanıcı başına
    maxLogins: 5 // Başarısız giriş denemesi
  },
  
  // Şifreleme
  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotation: 24 * 60 * 60 * 1000 // 24 saat
  },
  
  // Oturum
  session: {
    timeout: 30 * 60 * 1000, // 30 dakika
    maxConcurrent: 3 // Aynı anda max 3 cihaz
  },
  
  // Veri saklama
  dataRetention: {
    logs: 90 * 24 * 60 * 60 * 1000, // 90 gün
    messages: 365 * 24 * 60 * 60 * 1000, // 1 yıl
    inactiveUsers: 180 * 24 * 60 * 60 * 1000 // 6 ay
  }
};

// ==========================================
// GÜVENLİK SINIFI
// ==========================================

class SecurityManager {
  constructor(pool) {
    this.pool = pool;
    this.rateLimits = new Map();
    this.sessions = new Map();
    this.blockedIPs = new Set();
  }

  // Rate limit kontrolü
  checkRateLimit(key, type = 'default') {
    const now = Date.now();
    const limits = SECURITY_CONFIG.rateLimit;
    let max = limits.maxRequests;
    
    if (type === 'message') max = limits.maxMessages;
    if (type === 'login') max = limits.maxLogins;
    
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, { count: 1, firstRequest: now });
      return { allowed: true, remaining: max - 1 };
    }
    
    const record = this.rateLimits.get(key);
    
    // Süre doldu mu?
    if (now - record.firstRequest > limits.windowMs) {
      this.rateLimits.set(key, { count: 1, firstRequest: now });
      return { allowed: true, remaining: max - 1 };
    }
    
    // Limit aşıldı mı?
    if (record.count >= max) {
      return { 
        allowed: false, 
        remaining: 0,
        resetIn: Math.ceil((record.firstRequest + limits.windowMs - now) / 1000)
      };
    }
    
    record.count++;
    return { allowed: true, remaining: max - record.count };
  }

  // IP bloklama kontrolü
  isBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  // IP blokla
  blockIP(ip, duration = 3600000) { // 1 saat default
    this.blockedIPs.add(ip);
    setTimeout(() => this.blockedIPs.delete(ip), duration);
    console.log(`🚫 IP bloklandı: ${ip}`);
  }

  // Şifreleme
  encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      SECURITY_CONFIG.encryption.algorithm,
      Buffer.from(key.padEnd(32).slice(0, 32)),
      iv
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  // Şifre çöz
  decrypt(encryptedData, key) {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    const decipher = crypto.createDecipheriv(
      SECURITY_CONFIG.encryption.algorithm,
      Buffer.from(key.padEnd(32).slice(0, 32)),
      Buffer.from(ivHex, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Hassas veriyi maskele
  maskSensitive(data, type) {
    if (type === 'email') {
      const [local, domain] = data.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    }
    if (type === 'phone') {
      return data.slice(0, 4) + '****' + data.slice(-2);
    }
    if (type === 'card') {
      return '**** **** **** ' + data.slice(-4);
    }
    return data;
  }

  // Güvenlik logu
  async logSecurity(event, details, userId = null) {
    if (!this.pool) return;
    
    try {
      await this.pool.query(`
        INSERT INTO mesa.security_logs (event, details, user_id, ip_address, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [event, JSON.stringify(details), userId, details.ip]);
    } catch (err) {
      console.error('Güvenlik log hatası:', err);
    }
  }
}

// ==========================================
// MÜŞTERİ MEMNUNİYETİ SINIFI
// ==========================================

class CustomerSatisfaction {
  constructor(pool, bot) {
    this.pool = pool;
    this.bot = bot;
    this.feedbackCache = new Map();
  }

  // Hızlı yanıt sistemi
  async quickResponse(userId, query) {
    const responses = {
      'yardım': '💡 Yardım menüsüne hoş geldiniz!\n\n📊 /dashboard\n🤖 /botlar\n📧 /mailler\n❓ /yardim',
      'fiyat': '💰 Fiyatlandırma bilgisi için: https://mesakademi.com.tr/fiyatlar',
      'iletişim': '📞 İletişim:\n📧 destek@mesakademi.com.tr\n📱 +90 555 123 4567',
      'şikayet': '📝 Şikayetinizi dinliyorum. Lütfen detayları yazın.',
      'teşekkür': '🙏 Rica ederiz! Başka bir konuda yardımcı olabilir miyim?'
    };
    
    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return response;
      }
    }
    
    return null;
  }

  // Kişiselleştirilmiş karşılama
  async personalizedGreeting(userId) {
    if (!this.pool) return 'Merhaba! 👋';
    
    try {
      const result = await this.pool.query(`
        SELECT first_name, last_active, message_count
        FROM mesa.users
        WHERE telegram_id = $1
      `, [userId]);
      
      if (result.rows.length === 0) {
        return 'Hoş geldiniz! 🎉 İlk kez buradasınız. Size nasıl yardımcı olabilirim?';
      }
      
      const user = result.rows[0];
      const lastActive = new Date(user.last_active);
      const daysSince = Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24));
      
      if (daysSince > 7) {
        return `Tekrar hoş geldiniz ${user.first_name}! 👋 ${daysSince} gündür görüşmemiştik. Neler oldu?';
      }
      
      if (user.message_count > 100) {
        return `Merhaba ${user.first_name}! 🌟 ${user.message_count} mesajla VIP kullanıcımızsınız!`;
      }
      
      return `Merhaba ${user.first_name}! 👋 Bugün size nasıl yardımcı olabilirim?`;
    } catch (err) {
      return 'Merhaba! 👋';
    }
  }

  // Memnuniyet anketi
  async sendSatisfactionSurvey(userId) {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '⭐', callback_data: 'rating_1' },
           { text: '⭐⭐', callback_data: 'rating_2' },
           { text: '⭐⭐⭐', callback_data: 'rating_3' },
           { text: '⭐⭐⭐⭐', callback_data: 'rating_4' },
           { text: '⭐⭐⭐⭐⭐', callback_data: 'rating_5' }]
        ]
      }
    };
    
    this.bot.sendMessage(userId, 
      '📊 Hizmetimizi değerlendirir misiniz?\n\n' +
      'Deneyiminiz nasıldı?', 
      keyboard
    );
  }

  // Geri bildirim kaydet
  async saveFeedback(userId, rating, comment = null) {
    if (!this.pool) return;
    
    try {
      await this.pool.query(`
        INSERT INTO mesa.feedback (user_id, rating, comment, created_at)
        VALUES ($1, $2, $3, NOW())
      `, [userId, rating, comment]);
      
      // Düşük puan bildirimi
      if (rating <= 2) {
        const adminChatId = process.env.ADMIN_CHAT_ID;
        if (adminChatId) {
          this.bot.sendMessage(adminChatId,
            `⚠️ Düşük memnuniyet puanı!\n\n` +
            `👤 Kullanıcı: ${userId}\n` +
            `⭐ Puan: ${rating}/5\n` +
            `📝 Yorum: ${comment || 'Yok'}`
          );
        }
      }
    } catch (err) {
      console.error('Feedback kayıt hatası:', err);
    }
  }

  // Proaktif bildirim
  async proactiveNotification(userId, type) {
    const notifications = {
      'welcome_back': '👋 Tekrar hoş geldiniz! Yeni özelliklerimizi gördünüz mü?',
      'feature_update': '🎉 Yeni özellik: Artık sesli komutlarla işlem yapabilirsiniz!',
      'inactive': '💤 Uzun süredir görüşmedik. Size nasıl yardımcı olabilirim?',
      'birthday': '🎂 Doğum gününüz kutlu olsun! Size özel indirim kodu: MESA2026'
    };
    
    const message = notifications[type];
    if (message) {
      this.bot.sendMessage(userId, message);
    }
  }

  // Özelleştirilmiş öneriler
  async getRecommendations(userId) {
    if (!this.pool) return [];
    
    try {
      // Kullanıcının sektörünü bul
      const result = await this.pool.query(`
        SELECT sector, interests
        FROM mesa.users
        WHERE telegram_id = $1
      `, [userId]);
      
      if (result.rows.length === 0) return [];
      
      const user = result.rows[0];
      const recommendations = [];
      
      // Sektöre göre bot öner
      if (user.sector) {
        recommendations.push(`🤖 ${user.sector} sektörü için özel botumuzu deneyin!`);
      }
      
      // İlgi alanlarına göre içerik
      if (user.interests) {
        recommendations.push(`📚 İlgi alanlarınıza göre yeni içerikler eklendi!`);
      }
      
      return recommendations;
    } catch (err) {
      return [];
    }
  }
}

// ==========================================
// SQL TABLOLARI
// ==========================================

const SECURITY_TABLES_SQL = `
-- Güvenlik logları
CREATE TABLE IF NOT EXISTS mesa.security_logs (
  id SERIAL PRIMARY KEY,
  event VARCHAR(100) NOT NULL,
  details JSONB,
  user_id BIGINT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kullanıcı oturumları
CREATE TABLE IF NOT EXISTS mesa.user_sessions (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- Erişim denemeleri
CREATE TABLE IF NOT EXISTS mesa.access_attempts (
  id SERIAL PRIMARY KEY,
  ip_address INET NOT NULL,
  username VARCHAR(255),
  success BOOLEAN DEFAULT false,
  attempt_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memnuniyet geri bildirimleri
CREATE TABLE IF NOT EXISTS mesa.feedback (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kullanıcı tercihleri
CREATE TABLE IF NOT EXISTS mesa.user_preferences (
  id SERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  language VARCHAR(10) DEFAULT 'tr',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON mesa.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event ON mesa.security_logs(event);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON mesa.security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON mesa.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON mesa.feedback(rating);
`;

module.exports = {
  SecurityManager,
  CustomerSatisfaction,
  SECURITY_CONFIG,
  SECURITY_TABLES_SQL
};
