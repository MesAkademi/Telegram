/**
 * MESA BOTS - 16 Sektör Botu Yönetimi
 * Tüm bot token'ları ve yönetim fonksiyonları
 */

const TelegramBot = require('node-telegram-bot-api');

// ==========================================
// 16 MESA BOTU - TOKEN'LAR
// ==========================================

const MESA_BOTS = [
  {
    id: 'egitim',
    name: 'MESA Eğitim',
    username: '@MesaEgitimBot',
    sector: 'Eğitim',
    icon: '🎓',
    color: '#6366f1',
    token: '8212700834:AAFxVKW9rUoqEkj29PY-ZXmAvzZ9-SnxsNw',
    description: 'K-12 öğrencileri için kitap bazlı AI eğitim asistanı',
    services: ['Ödev Yardımı', 'Konu Anlatımı', 'Soru Çözümü', 'Kitap Önerileri']
  },
  {
    id: 'saglik',
    name: 'MESA Sağlık',
    username: '@MesaSaglikBot',
    sector: 'Sağlık',
    icon: '🩺',
    color: '#10b981',
    token: '8161143511:AAHTC9id6RFHhO-XjTgvSQrsM0XIeqSxeNc',
    description: 'Sağlık çalışanları ve tıp öğrencileri için tıbbi bilgi asistanı',
    services: ['Tıbbi Danışmanlık', 'Hastalık Bilgisi', 'İlaç Bilgisi', 'Sağlık Önerileri']
  },
  {
    id: 'hukuk',
    name: 'MESA Hukuk',
    username: '@MesaHukukBot',
    sector: 'Hukuk',
    icon: '⚖️',
    color: '#ef4444',
    token: '8519596332:AAF0rBB51aDmK3c0TOvll1JfN2RyrnonbeA',
    description: 'Avukatlar ve hukuk öğrencileri için hukuki bilgi asistanı',
    services: ['Mevzuat Sorgulama', 'Dava Takibi', 'Hukuki Danışmanlık', 'Sözleşme Taslağı']
  },
  {
    id: 'finans',
    name: 'MESA Finans',
    username: '@MesaFinansBot',
    sector: 'Finans',
    icon: '💰',
    color: '#f59e0b',
    token: '8215909476:AAHn9YmZ5RVCdHnhfeP6cxMu29TUWOQWVUA',
    description: 'Muhasebeciler ve mali müşavirler için finans asistanı',
    services: ['Muhasebe Danışmanlık', 'Vergi Hesaplama', 'Beyanname Yardımı', 'Finansal Raporlama']
  },
  {
    id: 'muhendislik',
    name: 'MESA Mühendislik',
    username: '@MesaMuhendisBot',
    sector: 'Mühendislik',
    icon: '🔧',
    color: '#0ea5e9',
    token: '8491998160:AAFR0iJLm9jpnLtKa702W5k-H3Z3L4Ujf-U',
    description: 'Mühendisler ve teknikerler için teknik bilgi asistanı',
    services: ['Teknik Hesaplama', 'Proje Danışmanlık', 'Standart Sorgulama', 'Materyal Seçimi']
  },
  {
    id: 'tarim',
    name: 'MESA Tarım',
    username: '@MesaTarimBot',
    sector: 'Tarım',
    icon: '🌾',
    color: '#84cc16',
    token: '8326466961:AAHs7ol5ac38kxG0NAPgZlc_CSUR4izoSJM',
    description: 'Çiftçiler ve ziraat mühendisleri için tarım asistanı',
    services: ['Bitki Hastalık Tanı', 'Gübre Önerisi', 'Hasat Zamanı', 'Tarım Destekleri']
  },
  {
    id: 'turizm',
    name: 'MESA Turizm',
    username: '@MesaTurizmBot',
    sector: 'Turizm',
    icon: '✈️',
    color: '#8b5cf6',
    token: '8291223922:AAElYxWxxGXN7miizmxcV6bDQznabVVeY30',
    description: 'Tur Operatörleri ve rehberler için turizm asistanı',
    services: ['Tur Programı', 'Rehberlik Bilgisi', 'Otel Önerisi', 'Vize Bilgisi']
  },
  {
    id: 'gayrimenkul',
    name: 'MESA Gayrimenkul',
    username: '@MesaGayrimenkulBot',
    sector: 'Gayrimenkul',
    icon: '🏠',
    color: '#14b8a6',
    token: '8258876471:AAF5Yktd3vlFVhM6O_oLNRQwFAHHaMgLBRQ',
    description: 'Emlakçılar ve yatırımcılar için gayrimenkul asistanı',
    services: ['Emlak Değerleme', 'Kira Sözleşmesi', 'Tapu İşlemleri', 'Yatırım Analizi']
  },
  {
    id: 'enerji',
    name: 'MESA Enerji',
    username: '@MesaEnerjiBot',
    sector: 'Enerji',
    icon: '⚡',
    color: '#eab308',
    token: '8573709800:AAFtvzaZ2e7tYAmCFNF_dz80W0HVrDI5PfU',
    description: 'Enerji şirketleri ve mühendisler için enerji asistanı',
    services: ['Enerji Verimliliği', 'Fatura Analizi', 'Yenilenebilir Enerji', 'Tüketim Raporu']
  },
  {
    id: 'medya',
    name: 'MESA Medya',
    username: '@MesaMedyaBot',
    sector: 'Medya',
    icon: '📺',
    color: '#f97316',
    token: '7528780351:AAE74JVNpdWuVhlEx793DArFH41SP3vtrdk',
    description: 'Gazeteciler ve içerik üreticileri için medya asistanı',
    services: ['Haber Yazımı', 'İçerik Fikri', 'SEO Analizi', 'Sosyal Medya Planı']
  },
  {
    id: 'lojistik',
    name: 'MESA Lojistik',
    username: '@MesaLojistikBot',
    sector: 'Lojistik',
    icon: '🚚',
    color: '#64748b',
    token: '8053649301:AAELqQCcVBWcLOaDx47DWyustVZ4QgtSHQk',
    description: 'Lojistik şirketleri ve ihracatçılar için lojistik asistanı',
    services: ['Gümrük İşlemleri', 'Nakliye Hesaplama', 'Evrak Takibi', 'Rota Optimizasyonu']
  },
  {
    id: 'perakende',
    name: 'MESA Perakende',
    username: '@MesaPerakendeBot',
    sector: 'Perakende',
    icon: '🛒',
    color: '#db2777',
    token: '8588528944:AAF3dzcCFWBWK3tX0ewyHb1DJ94vMaoNMRo',
    description: 'Mağaza sahipleri ve e-ticaret için perakende asistanı',
    services: ['Stok Yönetimi', 'Fiyatlandırma', 'Kampanya Fikirleri', 'Müşteri Analizi']
  },
  {
    id: 'uretim',
    name: 'MESA Üretim',
    username: '@MesaUretimBot',
    sector: 'Üretim',
    icon: '🏭',
    color: '#7c3aed',
    token: '7686176749:AAEYEceBak0hxaR0ahmG5te4imazlzQ6_XE',
    description: 'Fabrika yöneticileri için üretim ve endüstri asistanı',
    services: ['Üretim Planlama', 'Kalite Kontrol', 'Bakım Yönetimi', 'Verimlilik Analizi']
  },
  {
    id: 'insaat',
    name: 'MESA İnşaat',
    username: '@MesaInsaatBot',
    sector: 'İnşaat',
    icon: '🏗️',
    color: '#dc2626',
    token: '8278000430:AAGwkGEpPFmPG1yKRzgzvWDlQPz7nIEihL0',
    description: 'Müteahhitler ve inşaat mühendisleri için yapı asistanı',
    services: ['Metraj Hesaplama', 'İş Programı', 'Malzeme Listesi', 'Yapı Ruhsatı']
  },
  {
    id: 'teknoloji',
    name: 'MESA Teknoloji',
    username: '@MesaTeknolojiBot',
    sector: 'Teknoloji',
    icon: '💻',
    color: '#06b6d4',
    token: '8213833732:AAHM71jIc1zR88-JjJ6UkGXag8mZytOjAuA',
    description: 'Yazılımcılar ve IT yöneticileri için teknoloji asistanı',
    services: ['Kod İnceleme', 'Sistem Yönetimi', 'Güvenlik Analizi', 'Cloud Danışmanlık']
  },
  {
    id: 'sanat',
    name: 'MESA Sanat',
    username: '@MesaSanatBot',
    sector: 'Sanat',
    icon: '🎨',
    color: '#ec4899',
    token: '8516343086:AAFrHIst6tEum7Snam-w6nIn0-u7NpNW76E',
    description: 'Sanatçılar ve kültür meraklıları için sanat & kültür asistanı',
    services: ['Eser Analizi', 'Sanat Tarihi', 'Etkinlik Önerisi', 'Koleksiyon Yönetimi']
  }
];

// Ana botlar (ekstra)
const MAIN_BOTS = [
  {
    id: 'mesakedemi',
    name: 'MesAkedemi',
    username: '@MesAkedemibot',
    sector: 'Genel',
    icon: '🤖',
    color: '#3b82f6',
    token: '8261663647:AAEn57FbM9uTnXwWwo0uRFeU8X9JdW38LCo',
    description: 'MESA Akademi Genel Bot'
  },
  {
    id: 'akademimes',
    name: 'MESA Akademi Eğitim Asistanı',
    username: '@AkademiMesbot',
    sector: 'Eğitim',
    icon: '👑',
    color: '#1e293b',
    token: '8230507686:AAHw3vjvV6rvkdOvlT0SPS6qUANJnA6Dtmg',
    description: 'MESA Akademi Eğitim Asistanı'
  }
];

// Tüm botlar
const ALL_BOTS = [...MESA_BOTS, ...MAIN_BOTS];

// ==========================================
// BOT YÖNETİM SINIFI
// ==========================================

class BotManager {
  constructor() {
    this.bots = new Map();
    this.stats = new Map();
  }

  // Tüm botları başlat
  async startAll() {
    console.log('🤖 16 MESA Botu başlatılıyor...');
    
    for (const botConfig of MESA_BOTS) {
      try {
        const bot = new TelegramBot(botConfig.token, { polling: false });
        this.bots.set(botConfig.id, { bot, config: botConfig });
        console.log(`✅ ${botConfig.name} hazır`);
      } catch (err) {
        console.error(`❌ ${botConfig.name} hatası:`, err.message);
      }
    }
    
    console.log(`🤖 ${this.bots.size} bot hazır`);
  }

  // Belirli bir botu al
  getBot(botId) {
    return this.bots.get(botId);
  }

  // Tüm botlara duyuru gönder
  async broadcast(message, options = {}) {
    const results = [];
    
    for (const [id, { bot, config }] of this.bots) {
      try {
        // Botun kendi kanalı/grubu varsa oraya gönder
        // Şimdilik bot bilgisi olarak logla
        console.log(`📢 ${config.name}: ${message.substring(0, 50)}...`);
        results.push({ bot: id, status: 'ok' });
      } catch (err) {
        console.error(`❌ ${config.name} duyuru hatası:`, err.message);
        results.push({ bot: id, status: 'error', error: err.message });
      }
    }
    
    return results;
  }

  // Bot bilgilerini getir
  getBotInfo(botId) {
    const bot = MESA_BOTS.find(b => b.id === botId);
    if (!bot) return null;
    
    return {
      ...bot,
      stats: this.stats.get(botId) || { users: 0, messages: 0 }
    };
  }

  // Tüm bot istatistikleri
  getAllStats() {
    const stats = [];
    for (const bot of MESA_BOTS) {
      stats.push({
        ...bot,
        stats: this.stats.get(bot.id) || { users: 0, messages: 0 }
      });
    }
    return stats;
  }

  // Günlük rapor oluştur
  generateDailyReport() {
    const date = new Date().toLocaleDateString('tr-TR');
    let report = `📊 MESA Botları Günlük Rapor - ${date}\n\n`;
    
    for (const bot of MESA_BOTS) {
      const stats = this.stats.get(bot.id) || { users: 0, messages: 0 };
      report += `${bot.icon} ${bot.name}\n`;
      report += `   👥 Kullanıcı: ${stats.users}\n`;
      report += `   💬 Mesaj: ${stats.messages}\n\n`;
    }
    
    return report;
  }
}

// ==========================================
// TELEGRAM KOMUTLARI
// ==========================================

function setupBotCommands(mainBot, botManager, mailSender) {
  // /botlar - Tüm botları listele
  mainBot.onText(/\/botlar/, (msg) => {
    const chatId = msg.chat.id;
    
    let text = '🤖 **MESA Sektör Botları**\n\n';
    MESA_BOTS.forEach((bot, i) => {
      text += `${i + 1}. ${bot.icon} **${bot.name}**\n`;
      text += `   👤 ${bot.username}\n`;
      text += `   📝 ${bot.description}\n\n`;
    });
    
    text += '\n💡 Detaylı bilgi: /botinfo [isim]';
    mainBot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  });

  // /botinfo - Bot detayları
  mainBot.onText(/\/botinfo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1].toLowerCase();
    
    const bot = MESA_BOTS.find(b => 
      b.id === query || 
      b.name.toLowerCase().includes(query) ||
      b.username.toLowerCase().includes(query)
    );
    
    if (!bot) {
      mainBot.sendMessage(chatId, '❌ Bot bulunamadı. /botlar ile listeyi gör.');
      return;
    }
    
    const info = botManager.getBotInfo(bot.id);
    
    let text = `${bot.icon} **${bot.name}**\n\n`;
    text += `👤 Kullanıcı Adı: ${bot.username}\n`;
    text += `🏢 Sektör: ${bot.sector}\n`;
    text += `📝 Açıklama: ${bot.description}\n\n`;
    text += `🛠️ **Hizmetler:**\n`;
    bot.services.forEach(s => {
      text += `   • ${s}\n`;
    });
    text += `\n📊 Kullanıcı: ${info.stats.users}\n`;
    text += `💬 Mesaj: ${info.stats.messages}`;
    
    mainBot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  });

  // /toplu_duyuru - Tüm botlara duyuru
  mainBot.onText(/\/toplu_duyuru (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const message = match[1];
    
    mainBot.sendMessage(chatId, `📢 Toplu duyuru gönderiliyor...\n\n${message}`);
    
    const results = await botManager.broadcast(message);
    const success = results.filter(r => r.status === 'ok').length;
    const failed = results.filter(r => r.status === 'error').length;
    
    mainBot.sendMessage(chatId, 
      `✅ Duyuru tamamlandı!\n\n` +
      `✓ Başarılı: ${success}\n` +
      `✗ Başarısız: ${failed}`
    );
  });

  // /bot_rapor - Günlük bot raporu
  mainBot.onText(/\/bot_rapor/, async (msg) => {
    const chatId = msg.chat.id;
    
    const report = botManager.generateDailyReport();
    mainBot.sendMessage(chatId, report);
    
    // Mail olarak da gönder
    if (mailSender) {
      const html = report.replace(/\n/g, '<br>');
      await mailSender.send(
        process.env.ADMIN_EMAIL || 'admin@mesakademi.com.tr',
        '📊 MESA Botları Günlük Rapor',
        html
      );
    }
  });

  // /servisler - Bot hizmetleri
  mainBot.onText(/\/servisler/, (msg) => {
    const chatId = msg.chat.id;
    
    let text = '🛠️ **MESA Bot Hizmetleri**\n\n';
    
    const allServices = {};
    MESA_BOTS.forEach(bot => {
      bot.services.forEach(service => {
        if (!allServices[service]) allServices[service] = [];
        allServices[service].push(bot.icon);
      });
    });
    
    Object.entries(allServices).forEach(([service, icons]) => {
      text += `${icons.join('')} ${service}\n`;
    });
    
    mainBot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  });
}

module.exports = {
  MESA_BOTS,
  MAIN_BOTS,
  ALL_BOTS,
  BotManager,
  setupBotCommands
};
