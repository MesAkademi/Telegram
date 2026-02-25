/**
 * MESA MAIL - Mail Entegrasyon Modülü
 * IMAP/SMTP ile iki yönlü mail yönetimi
 */

const imap = require('imap');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');

// ==========================================
// MAIL KONFİGÜRASYONU
// ==========================================

const MAIL_CONFIG = {
  // Gelen mail (IMAP)
  imap: {
    user: process.env.MAIL_USER || 'destek@mesakademi.com.tr',
    password: process.env.MAIL_PASS || 'mail_sifre',
    host: process.env.MAIL_IMAP_HOST || 'mail.mesakademi.com.tr',
    port: parseInt(process.env.MAIL_IMAP_PORT) || 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  },
  // Giden mail (SMTP)
  smtp: {
    host: process.env.MAIL_SMTP_HOST || 'mail.mesakademi.com.tr',
    port: parseInt(process.env.MAIL_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER || 'destek@mesakademi.com.tr',
      pass: process.env.MAIL_PASS || 'mail_sifre'
    }
  }
};

// ==========================================
// GELEN MAİLLERİ OKU (IMAP)
// ==========================================

class MailReceiver {
  constructor(bot, pool) {
    this.bot = bot;
    this.pool = pool;
    this.connection = null;
  }

  connect() {
    this.connection = new imap(MAIL_CONFIG.imap);
    
    this.connection.once('ready', () => {
      console.log('📧 IMAP bağlandı');
      this.openInbox();
    });
    
    this.connection.once('error', (err) => {
      console.error('📧 IMAP hatası:', err.message);
    });
    
    this.connection.once('end', () => {
      console.log('📧 IMAP bağlantısı kapandı');
    });
    
    this.connection.connect();
  }

  openInbox() {
    this.connection.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('📧 Inbox hatası:', err);
        return;
      }
      
      console.log('📧 Inbox açıldı:', box.messages.total, 'mesaj');
      
      // Yeni mailleri dinle
      this.connection.on('mail', (numNewMsgs) => {
        console.log('📧 Yeni mail:', numNewMsgs);
        this.fetchNewEmails();
      });
      
      // Mevcut mailleri kontrol et
      this.fetchNewEmails();
    });
  }

  fetchNewEmails() {
    // Son 10 okunmamış maili al
    this.connection.search(['UNSEEN'], (err, results) => {
      if (err || !results || results.length === 0) return;
      
      const fetch = this.connection.fetch(results, { bodies: '' });
      
      fetch.on('message', (msg, seqno) => {
        let buffer = '';
        
        msg.on('body', (stream) => {
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });
        });
        
        msg.once('end', async () => {
          try {
            const parsed = await simpleParser(buffer);
            await this.processEmail(parsed);
          } catch (err) {
            console.error('📧 Parse hatası:', err);
          }
        });
      });
    });
  }

  async processEmail(mail) {
    const from = mail.from?.text || 'Bilinmiyor';
    const subject = mail.subject || '(Konu yok)';
    const text = mail.text || '(İçerik yok)';
    const date = mail.date;
    
    console.log('📧 Mail işleniyor:', subject);
    
    // Veritabanına kaydet
    if (this.pool) {
      try {
        await this.pool.query(`
          INSERT INTO mesa.emails (from_address, subject, content, received_at, status)
          VALUES ($1, $2, $3, $4, 'unread')
        `, [from, subject, text, date]);
      } catch (err) {
        console.error('📧 DB kayıt hatası:', err);
      }
    }
    
    // Admin'e Telegram'dan bildir
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (adminChatId && this.bot) {
      const message = `📧 **Yeni Mail Geldi!**\n\n` +
        `👤 **Gönderen:** ${from}\n` +
        `📋 **Konu:** ${subject}\n` +
        `📅 **Tarih:** ${date.toLocaleString('tr-TR')}\n\n` +
        `📝 **Önizleme:**\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n\n` +
        `💡 Yanıtlamak için: /mail_yanitla`;
      
      this.bot.sendMessage(adminChatId, message, { parse_mode: 'Markdown' });
    }
  }
}

// ==========================================
// MAİL GÖNDER (SMTP)
// ==========================================

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport(MAIL_CONFIG.smtp);
  }

  async send(to, subject, html, attachments = []) {
    try {
      const info = await this.transporter.sendMail({
        from: `"MESA KIMI" <${MAIL_CONFIG.smtp.auth.user}>`,
        to,
        subject,
        html,
        attachments
      });
      
      console.log('📧 Mail gönderildi:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('📧 Mail gönderme hatası:', err);
      return { success: false, error: err.message };
    }
  }

  // Günlük rapor gönder
  async sendDailyReport(to, data) {
    const html = `
      <h2>📊 MESA KIMI - Günlük Rapor</h2>
      <p>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
      <hr>
      <ul>
        <li>👥 Toplam Kullanıcı: ${data.totalUsers}</li>
        <li>💬 Bugünkü Mesaj: ${data.todayMessages}</li>
        <li>🤖 Aktif Bot: ${data.activeBots}</li>
        <li>📧 Yeni Mailler: ${data.newEmails}</li>
      </ul>
      <hr>
      <p>🤖 MESA KIMI Otomatik Raporlama</p>
    `;
    
    return this.send(to, `📊 MESA KIMI Günlük Rapor - ${new Date().toLocaleDateString('tr-TR')}`, html);
  }

  // Haftalık rapor gönder
  async sendWeeklyReport(to, data) {
    const html = `
      <h2>📊 MESA KIMI - Haftalık Rapor</h2>
      <p>Hafta: ${data.week}</p>
      <hr>
      <h3>📈 İstatistikler</h3>
      <ul>
        <li>👥 Yeni Kullanıcı: ${data.newUsers}</li>
        <li>💬 Toplam Mesaj: ${data.totalMessages}</li>
        <li>📧 Gelen Mail: ${data.totalEmails}</li>
        <li>📢 Duyuru: ${data.announcements}</li>
      </ul>
      <hr>
      <p>🤖 MESA KIMI Otomatik Raporlama</p>
    `;
    
    return this.send(to, `📊 MESA KIMI Haftalık Rapor`, html);
  }
}

// ==========================================
// TELEGRAM BOT MAİL KOMUTLARI
// ==========================================

function setupMailCommands(bot, pool, mailSender) {
  // /mail_gonder - Mail gönder
  bot.onText(/\/mail_gonder (.+)\|(.+)\|(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const to = match[1].trim();
    const subject = match[2].trim();
    const content = match[3].trim();
    
    bot.sendMessage(chatId, `📧 Mail gönderiliyor...\n\nKime: ${to}\nKonu: ${subject}`);
    
    const result = await mailSender.send(to, subject, `<p>${content}</p>`);
    
    if (result.success) {
      bot.sendMessage(chatId, `✅ Mail gönderildi!\n\nID: ${result.messageId}`);
    } else {
      bot.sendMessage(chatId, `❌ Hata: ${result.error}`);
    }
  });
  
  // /mail_rapor - Günlük rapor gönder
  bot.onText(/\/mail_rapor/, async (msg) => {
    const chatId = msg.chat.id;
    
    // Demo veri
    const reportData = {
      totalUsers: 1247,
      todayMessages: 453,
      activeBots: 16,
      newEmails: 12
    };
    
    const result = await mailSender.sendDailyReport(msg.from.email || 'admin@mesakademi.com.tr', reportData);
    
    if (result.success) {
      bot.sendMessage(chatId, `✅ Günlük rapor mail olarak gönderildi!`);
    } else {
      bot.sendMessage(chatId, `❌ Rapor gönderilemedi: ${result.error}`);
    }
  });
  
  // /mailler - Son mailleri listele
  bot.onText(/\/mailler/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!pool) {
      bot.sendMessage(chatId, `📧 Son 5 mail:\n\n1. destek@ornek.com - Yardım talebi\n2. info@sirket.com.tr - İşbirliği teklifi`);
      return;
    }
    
    try {
      const result = await pool.query(`
        SELECT from_address, subject, received_at, status
        FROM mesa.emails
        ORDER BY received_at DESC
        LIMIT 5
      `);
      
      let text = '📧 **Son 5 Mail:**\n\n';
      result.rows.forEach((mail, i) => {
        text += `${i + 1}. 👤 ${mail.from_address}\n`;
        text += `   📋 ${mail.subject}\n`;
        text += `   📅 ${new Date(mail.received_at).toLocaleString('tr-TR')}\n`;
        text += `   ${mail.status === 'unread' ? '🔴 Okunmamış' : '✅ Okundu'}\n\n`;
      });
      
      bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (err) {
      bot.sendMessage(chatId, `❌ Mail listesi alınamadı: ${err.message}`);
    }
  });
}

// ==========================================
// SQL TABLOSU
// ==========================================

const EMAIL_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS mesa.emails (
  id SERIAL PRIMARY KEY,
  from_address VARCHAR(255) NOT NULL,
  to_address VARCHAR(255) DEFAULT 'destek@mesakademi.com.tr',
  subject VARCHAR(500),
  content TEXT,
  received_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied, archived
  telegram_forwarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

module.exports = {
  MailReceiver,
  MailSender,
  setupMailCommands,
  EMAIL_TABLE_SQL
};
