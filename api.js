/**
 * MESA KIMI - BASİT & ÇALIŞAN SÜRÜM
 * Sadece temel özellikler - hatasız çalışır
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==========================================
// KONFİGÜRASYON
// ==========================================

const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN || '8568828893:AAGSNh5FYXx-Y1khFtHlEQLDGikVLesC1Wg',
  WEBAPP_URL: process.env.WEBAPP_URL || 'https://telegram.mesakademi.com.tr',
  PORT: process.env.PORT || 3000
};

// ==========================================
// 16 MESA BOTU
// ==========================================

const MESA_BOTS = [
  { id: 'egitim', name: 'MESA Eğitim', username: '@MesaEgitimBot', sector: 'Eğitim', icon: '🎓', color: '#6366f1' },
  { id: 'saglik', name: 'MESA Sağlık', username: '@MesaSaglikBot', sector: 'Sağlık', icon: '🩺', color: '#10b981' },
  { id: 'hukuk', name: 'MESA Hukuk', username: '@MesaHukukBot', sector: 'Hukuk', icon: '⚖️', color: '#ef4444' },
  { id: 'finans', name: 'MESA Finans', username: '@MesaFinansBot', sector: 'Finans', icon: '💰', color: '#f59e0b' },
  { id: 'muhendislik', name: 'MESA Mühendislik', username: '@MesaMuhendisBot', sector: 'Mühendislik', icon: '🔧', color: '#0ea5e9' },
  { id: 'tarim', name: 'MESA Tarım', username: '@MesaTarimBot', sector: 'Tarım', icon: '🌾', color: '#84cc16' },
  { id: 'turizm', name: 'MESA Turizm', username: '@MesaTurizmBot', sector: 'Turizm', icon: '✈️', color: '#8b5cf6' },
  { id: 'gayrimenkul', name: 'MESA Gayrimenkul', username: '@MesaGayrimenkulBot', sector: 'Gayrimenkul', icon: '🏠', color: '#14b8a6' },
  { id: 'enerji', name: 'MESA Enerji', username: '@MesaEnerjiBot', sector: 'Enerji', icon: '⚡', color: '#eab308' },
  { id: 'medya', name: 'MESA Medya', username: '@MesaMedyaBot', sector: 'Medya', icon: '📺', color: '#f97316' },
  { id: 'lojistik', name: 'MESA Lojistik', username: '@MesaLojistikBot', sector: 'Lojistik', icon: '🚚', color: '#64748b' },
  { id: 'perakende', name: 'MESA Perakende', username: '@MesaPerakendeBot', sector: 'Perakende', icon: '🛒', color: '#db2777' },
  { id: 'uretim', name: 'MESA Üretim', username: '@MesaUretimBot', sector: 'Üretim', icon: '🏭', color: '#7c3aed' },
  { id: 'insaat', name: 'MESA İnşaat', username: '@MesaInsaatBot', sector: 'İnşaat', icon: '🏗️', color: '#dc2626' },
  { id: 'teknoloji', name: 'MESA Teknoloji', username: '@MesaTeknolojiBot', sector: 'Teknoloji', icon: '💻', color: '#06b6d4' },
  { id: 'sanat', name: 'MESA Sanat', username: '@MesaSanatBot', sector: 'Sanat', icon: '🎨', color: '#ec4899' }
];

// ==========================================
// API ENDPOINTLERİ
// ==========================================

app.get('/api/dashboard', (req, res) => {
  res.json({ 
    success: true, 
    data: { total_users: 1247, active_users: 89, total_messages: 45231, active_bots: 16 }
  });
});

app.get('/api/bots', (req, res) => {
  res.json({ success: true, data: MESA_BOTS });
});

app.get('/api/bots/:id', (req, res) => {
  const bot = MESA_BOTS.find(b => b.id === req.params.id);
  if (!bot) return res.status(404).json({ success: false, error: 'Bot bulunamadı' });
  res.json({ success: true, data: bot });
});

app.get('/api/users/stats', (req, res) => {
  res.json({ success: true, data: { total: 1247, active_today: 89 } });
});

app.get('/api/announcements', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      { id: 1, title: 'Yeni KBN Karakterleri', content: '20 yeni karakter', type: 'feature', created_at: '2026-02-24' }
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// TELEGRAM BOT
// ==========================================

const bot = new TelegramBot(CONFIG.BOT_TOKEN, { polling: true });

console.log('🤖 Telegram Bot başlatıldı!');

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'Kullanıcı';
  
  const text = `Merhaba ${name}! 👋\n\n🤖 MESA KIMI - Premium Yönetim\n\n📊 Dashboard\n🤖 16 sektör botu\n📢 Duyurular`;
  
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['📊 Dashboard', '🤖 Botlar'],
        ['📢 Duyurular', '👥 Kullanıcılar']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, text, keyboard);
});

// /botlar
bot.onText(/\/botlar/, (msg) => {
  let text = '🤖 **MESA Sektör Botları**\n\n';
  MESA_BOTS.forEach((b, i) => {
    text += `${i + 1}. ${b.icon} ${b.name}\n   👤 ${b.username}\n\n`;
  });
  bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
});

// Butonlar
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (text === '📊 Dashboard') {
    bot.sendMessage(chatId, `📊 Dashboard\n\n👥 1,247 kullanıcı\n💬 453 mesaj bugün`);
  }
  else if (text === '🤖 Botlar') {
    bot.sendMessage(chatId, `🤖 16 bot aktif!`);
  }
  else if (text === '📢 Duyurular') {
    bot.sendMessage(chatId, `📢 Son Duyurular`);
  }
  else if (text === '👥 Kullanıcılar') {
    bot.sendMessage(chatId, `👥 Kullanıcılar`);
  }
});

bot.on('polling_error', (err) => {
  console.error('Bot hatası:', err.message);
});

console.log('✅ Bot hazır!');

// ==========================================
// SUNUCUYU BAŞLAT
// ==========================================

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 API çalışıyor: http://localhost:${CONFIG.PORT}`);
  console.log(`🤖 16 MESA Botu hazır`);
});
