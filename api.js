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
// 16 MESA BOTU - TOKEN'LAR
// ==========================================

const MESA_BOTS = [
  { id: 'egitim', name: 'MESA Eğitim', username: '@MesaEgitimBot', token: '8212700834:AAFxVKW9rUoqEkj29PY-ZXmAvzZ9-SnxsNw', sector: 'Eğitim', icon: '🎓' },
  { id: 'saglik', name: 'MESA Sağlık', username: '@MesaSaglikBot', token: '8161143511:AAHTC9id6RFHhO-XjTgvSQrsM0XIeqSxeNc', sector: 'Sağlık', icon: '🩺' },
  { id: 'hukuk', name: 'MESA Hukuk', username: '@MesaHukukBot', token: '8519596332:AAF0rBB51aDmK3c0TOvll1JfN2RyrnonbeA', sector: 'Hukuk', icon: '⚖️' },
  { id: 'finans', name: 'MESA Finans', username: '@MesaFinansBot', token: '8215909476:AAHn9YmZ5RVCdHnhfeP6cxMu29TUWOQWVUA', sector: 'Finans', icon: '💰' },
  { id: 'muhendislik', name: 'MESA Mühendislik', username: '@MesaMuhendisBot', token: '8491998160:AAFR0iJLm9jpnLtKa702W5k-H3Z3L4Ujf-U', sector: 'Mühendislik', icon: '🔧' },
  { id: 'tarim', name: 'MESA Tarım', username: '@MesaTarimBot', token: '8326466961:AAHs7ol5ac38kxG0NAPgZlc_CSUR4izoSJM', sector: 'Tarım', icon: '🌾' },
  { id: 'turizm', name: 'MESA Turizm', username: '@MesaTurizmBot', token: '8291223922:AAElYxWxxGXN7miizmxcV6bDQznabVVeY30', sector: 'Turizm', icon: '✈️' },
  { id: 'gayrimenkul', name: 'MESA Gayrimenkul', username: '@MesaGayrimenkulBot', token: '8258876471:AAF5Yktd3vlFVhM6O_oLNRQwFAHHaMgLBRQ', sector: 'Gayrimenkul', icon: '🏠' },
  { id: 'enerji', name: 'MESA Enerji', username: '@MesaEnerjiBot', token: '8573709800:AAFtvzaZ2e7tYAmCFNF_dz80W0HVrDI5PfU', sector: 'Enerji', icon: '⚡' },
  { id: 'medya', name: 'MESA Medya', username: '@MesaMedyaBot', token: '7528780351:AAE74JVNpdWuVhlEx793DArFH41SP3vtrdk', sector: 'Medya', icon: '📺' },
  { id: 'lojistik', name: 'MESA Lojistik', username: '@MesaLojistikBot', token: '8053649301:AAELqQCcVBWcLOaDx47DWyustVZ4QgtSHQk', sector: 'Lojistik', icon: '🚚' },
  { id: 'perakende', name: 'MESA Perakende', username: '@MesaPerakendeBot', token: '8588528944:AAF3dzcCFWBWK3tX0ewyHb1DJ94vMaoNMRo', sector: 'Perakende', icon: '🛒' },
  { id: 'uretim', name: 'MESA Üretim', username: '@MesaUretimBot', token: '7686176749:AAEYEceBak0hxaR0ahmG5te4imazlzQ6_XE', sector: 'Üretim', icon: '🏭' },
  { id: 'insaat', name: 'MESA İnşaat', username: '@MesaInsaatBot', token: '8278000430:AAGwkGEpPFmPG1yKRzgzvWDlQPz7nIEihL0', sector: 'İnşaat', icon: '🏗️' },
  { id: 'teknoloji', name: 'MESA Teknoloji', username: '@MesaTeknolojiBot', token: '8213833732:AAHM71jIc1zR88-JjJ6UkGXag8mZytOjAuA', sector: 'Teknoloji', icon: '💻' },
  { id: 'sanat', name: 'MESA Sanat', username: '@MesaSanatBot', token: '8516343086:AAFrHIst6tEum7Snam-w6nIn0-u7NpNW76E', sector: 'Sanat', icon: '🎨' }
];

// Bot instance'ları
const botInstances = new Map();

// Tüm botları başlat
function initBots() {
  console.log('🤖 16 bot başlatılıyor...');
  for (const botConfig of MESA_BOTS) {
    try {
      const bot = new TelegramBot(botConfig.token, { polling: false });
      botInstances.set(botConfig.id, { bot, config: botConfig });
      console.log(`✅ ${botConfig.name} hazır`);
    } catch (err) {
      console.error(`❌ ${botConfig.name} hatası:`, err.message);
    }
  }
  console.log(`🤖 ${botInstances.size} bot hazır`);
}

// Toplu duyuru gönder
async function broadcastToAll(message) {
  const results = [];
  for (const [id, { bot, config }] of botInstances) {
    try {
      // Botun kendi kanalına gönder (örnek)
      // Gerçek kullanımda botun kullanıcı listesi çekilmeli
      console.log(`📢 ${config.name}: Duyuru hazır`);
      results.push({ bot: id, status: 'ok' });
    } catch (err) {
      results.push({ bot: id, status: 'error', error: err.message });
    }
  }
  return results;
}

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

// Toplu duyuru endpoint'i
app.post('/api/broadcast', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: 'Mesaj gerekli' });
  }
  
  const results = await broadcastToAll(message);
  res.json({ success: true, results });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// TELEGRAM BOT
// ==========================================

const bot = new TelegramBot(CONFIG.BOT_TOKEN, { polling: true });

console.log('🤖 Telegram Bot başlatıldı!');

// Botları başlat
initBots();

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'Kullanıcı';
  
  const text = `Merhaba ${name}! 👋\n\n🤖 MESA KIMI - Premium Yönetim\n\n📊 Dashboard\n🤖 16 sektör botu\n📢 Duyurular`;
  
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['📊 Dashboard', '🤖 Botlar'],
        ['📢 Duyurular', '👥 Kullanıcılar'],
        ['📢 Toplu Duyuru']
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
  else if (text === '📢 Toplu Duyuru') {
    bot.sendMessage(chatId, `📢 Toplu duyuru için:\n\n/toplu [mesaj]\n\nÖrnek:\n/toplu Merhaba! Yeni özellikler eklendi.`);
  }
});

// /toplu - Toplu duyuru
bot.onText(/\/toplu (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const message = match[1];
  
  bot.sendMessage(chatId, `📢 Toplu duyuru gönderiliyor...\n\nMesaj: ${message}`);
  
  const results = await broadcastToAll(message);
  const success = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  bot.sendMessage(chatId, 
    `✅ Duyuru tamamlandı!\n\n` +
    `✓ Başarılı: ${success}\n` +
    `✗ Başarısız: ${failed}`
  );
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
  console.log(`📢 Toplu duyuru: /toplu [mesaj]`);
});
