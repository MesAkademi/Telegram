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
// 18 MESA BOTU
// ==========================================

const MESA_BOTS = [
  { id: 'egitim', name: 'MESA Eğitim', username: '@MesaEgitim_Bot', sector: 'Eğitim', icon: '🎓', color: '#6366f1', users: 127, messages: 453 },
  { id: 'saglik', name: 'MESA Sağlık', username: '@MesaSaglik_Bot', sector: 'Sağlık', icon: '🩺', color: '#10b981', users: 89, messages: 312 },
  { id: 'hukuk', name: 'MESA Hukuk', username: '@MesaHukuk_Bot', sector: 'Hukuk', icon: '⚖️', color: '#ef4444', users: 56, messages: 198 },
  { id: 'finans', name: 'MESA Finans', username: '@MesaFinans_Bot', sector: 'Finans', icon: '💰', color: '#f59e0b', users: 234, messages: 567 },
  { id: 'muhendislik', name: 'MESA Mühendislik', username: '@MesaMuhendis_Bot', sector: 'Mühendislik', icon: '🔧', color: '#0ea5e9', users: 78, messages: 245 },
  { id: 'tarim', name: 'MESA Tarım', username: '@MesaTarim_Bot', sector: 'Tarım', icon: '🌾', color: '#84cc16', users: 45, messages: 123 },
  { id: 'turizm', name: 'MESA Turizm', username: '@MesaTurizm_Bot', sector: 'Turizm', icon: '✈️', color: '#8b5cf6', users: 92, messages: 189 },
  { id: 'sanat', name: 'MESA Sanat', username: '@MesaSanat_Bot', sector: 'Sanat', icon: '🎨', color: '#ec4899', users: 67, messages: 156 },
  { id: 'teknoloji', name: 'MESA Teknoloji', username: '@MesaTeknoloji_Bot', sector: 'Teknoloji', icon: '💻', color: '#06b6d4', users: 156, messages: 423 },
  { id: 'enerji', name: 'MESA Enerji', username: '@MesaEnerji_Bot', sector: 'Enerji', icon: '⚡', color: '#eab308', users: 34, messages: 89 },
  { id: 'gayrimenkul', name: 'MESA Gayrimenkul', username: '@MesaGayrimenkul_Bot', sector: 'Gayrimenkul', icon: '🏠', color: '#14b8a6', users: 88, messages: 234 },
  { id: 'medya', name: 'MESA Medya', username: '@MesaMedya_Bot', sector: 'Medya', icon: '📺', color: '#f97316', users: 112, messages: 345 },
  { id: 'lojistik', name: 'MESA Lojistik', username: '@MesaLojistik_Bot', sector: 'Lojistik', icon: '🚚', color: '#64748b', users: 43, messages: 98 },
  { id: 'perakende', name: 'MESA Perakende', username: '@MesaPerakende_Bot', sector: 'Perakende', icon: '🛒', color: '#db2777', users: 76, messages: 187 },
  { id: 'uretim', name: 'MESA Üretim', username: '@MesaUretim_Bot', sector: 'Üretim', icon: '🏭', color: '#7c3aed', users: 54, messages: 134 },
  { id: 'insaat', name: 'MESA İnşaat', username: '@MesaInsaat_Bot', sector: 'İnşaat', icon: '🏗️', color: '#dc2626', users: 38, messages: 76 },
  { id: 'genel', name: 'MESA Genel', username: '@MesAkademi_Bot', sector: 'Genel', icon: '🤖', color: '#3b82f6', users: 245, messages: 678 },
  { id: 'yonetim', name: 'MESA Yönetim', username: '@AkademiMes_Bot', sector: 'Yönetim', icon: '👑', color: '#1e293b', users: 12, messages: 45 }
];

// Demo veriler
const DASHBOARD_DATA = {
  totalUsers: 1247,
  activeUsers: 89,
  totalMessages: 45231,
  activeBots: 16,
  responseTime: 1.2,
  todayMessages: 453
};

// ==========================================
// API ENDPOINTLERİ
// ==========================================

app.get('/api/dashboard', (req, res) => {
  res.json({ success: true, data: DASHBOARD_DATA });
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
  res.json({ 
    success: true, 
    data: { total: 1247, activeToday: 89, newThisWeek: 23, banned: 3 }
  });
});

app.get('/api/announcements', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      { id: 1, title: 'Yeni KBN Karakterleri', content: '20 yeni karakter', type: 'feature', created_at: '2026-02-24' },
      { id: 2, title: 'Planlı Bakım', content: 'Sistem bakımı', type: 'maintenance', created_at: '2026-02-22' }
    ]
  });
});

app.get('/api/telegram/commands', (req, res) => {
  res.json({
    success: true,
    data: [
      { command: 'start', description: '🤖 Botu başlat' },
      { command: 'dashboard', description: '📊 Dashboard' },
      { command: 'bots', description: '🤖 18 bot listele' },
      { command: 'help', description: '🆘 Yardım' }
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
  
  const text = `Merhaba ${name}! 👋\n\n🤖 MESA KIMI - Premium Yönetim\n\n📊 Dashboard\n🤖 18 sektör botu\n📢 Duyurular\n👥 Kullanıcılar`;
  
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['📊 Dashboard', '🤖 Botlar'],
        ['📢 Duyurular', '👥 Kullanıcılar'],
        ['📈 İstatistikler', '⚙️ Ayarlar']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, text, keyboard);
});

// /dashboard
bot.onText(/\/dashboard/, (msg) => {
  bot.sendMessage(msg.chat.id, `📊 Dashboard\n\n👥 Kullanıcı: 1,247\n💬 Mesaj: 45,231\n🤖 Bot: 16 aktif`);
});

// /bots
bot.onText(/\/bots/, (msg) => {
  let text = '🤖 Sektör Botları:\n\n';
  MESA_BOTS.forEach(b => {
    text += `${b.icon} ${b.name}\n`;
  });
  bot.sendMessage(msg.chat.id, text);
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `🆘 Yardım\n\n/start - Ana menü\n/dashboard - Dashboard\n/bots - Bot listesi\n/help - Yardım`);
});

// Butonlar
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (text === '📊 Dashboard') {
    bot.sendMessage(chatId, `📊 Dashboard\n\n👥 1,247 kullanıcı\n💬 453 mesaj bugün`);
  }
  else if (text === '🤖 Botlar') {
    bot.sendMessage(chatId, `🤖 18 bot aktif!\n\nEn çok kullanılan:\n1. 🎓 Eğitim\n2. 🩺 Sağlık\n3. 💰 Finans`);
  }
  else if (text === '📢 Duyurular') {
    bot.sendMessage(chatId, `📢 Duyurular:\n\n1. 🎉 Yeni KBN Karakterleri\n2. 🔧 Planlı Bakım`);
  }
  else if (text === '👥 Kullanıcılar') {
    bot.sendMessage(chatId, `👥 Kullanıcılar:\n\n• Toplam: 1,247\n• Bugün aktif: 89`);
  }
  else if (text === '📈 İstatistikler') {
    bot.sendMessage(chatId, `📈 İstatistikler:\n\n• Bu ay: 12,456 mesaj\n• Ort. yanıt: 1.2s`);
  }
  else if (text === '⚙️ Ayarlar') {
    bot.sendMessage(chatId, `⚙️ Ayarlar:\n\n🔐 2FA: ✅ Aktif\n🤖 AI: Claude 3.5`);
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
  console.log('📊 SQL kullanılmıyor - Demo veriler aktif');
});
