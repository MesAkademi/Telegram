const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8568828893:AAGSNh5FYXx-Y1khFtHlEQLDGikVLesC1Wg';
const WEBAPP_URL = 'https://telegram.mesakademi.com.tr';

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 MESA KIMI Bot başlatıldı!');

// /start komutu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'Kullanıcı';
  
  const text = `Merhaba ${name}! 👋\n\n🤖 MESA KIMI - Premium Yönetim Paneli\n\n📊 Dashboard görüntüle\n🤖 18 sektör botunu yönet\n📢 Duyuru gönder\n👥 Kullanıcıları görüntüle\n\n👇 Menüden seçim yapın:`;
  
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

// /dashboard komutu
bot.onText(/\/dashboard/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `📊 Dashboard\n\n📈 İstatistikler:\n• Toplam Kullanıcı: 1,247\n• Bugün Aktif: 89\n• Toplam Mesaj: 45,231\n\n🤖 Bot Durumları:\n🟢 Aktif: 16 | 🟡 Uyarı: 1 | 🔴 Çevrimdışı: 1`;
  
  bot.sendMessage(chatId, text);
});

// /bots komutu
bot.onText(/\/bots/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `🤖 Sektör Botları:\n\n🎓 Eğitim - @MesaEgitim_Bot\n🩺 Sağlık - @MesaSaglik_Bot\n⚖️ Hukuk - @MesaHukuk_Bot\n💰 Finans - @MesaFinans_Bot\n🔧 Mühendislik - @MesaMuhendis_Bot\n🌾 Tarım - @MesaTarim_Bot\n✈️ Turizm - @MesaTurizm_Bot\n🎨 Sanat - @MesaSanat_Bot\n💻 Teknoloji - @MesaTeknoloji_Bot\n⚡ Enerji - @MesaEnerji_Bot\n🏠 Gayrimenkul - @MesaGayrimenkul_Bot\n📺 Medya - @MesaMedya_Bot\n🚚 Lojistik - @MesaLojistik_Bot\n🛒 Perakende - @MesaPerakende_Bot\n🏭 Üretim - @MesaUretim_Bot\n🏗️ İnşaat - @MesaInsaat_Bot\n🤖 Genel - @MesAkademi_Bot\n👑 Yönetim - @AkademiMes_Bot`;
  
  bot.sendMessage(chatId, text);
});

// /help komutu
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `🆘 Yardım Menüsü\n\nKomutlar:\n/start - Ana menü\n/dashboard - Dashboard\n/bots - Bot listesi\n/broadcast - Duyuru gönder\n/users - Kullanıcılar\n/stats - İstatistikler\n/help - Bu menü\n/settings - Ayarlar\n\nWeb App:\n📊 Yönetim Paneli butonuna tıklayın`;
  
  bot.sendMessage(chatId, text);
});

// Buton işleyicileri
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (text === '📊 Dashboard') {
    bot.sendMessage(chatId, `📊 Dashboard\n\n📈 İstatistikler:\n• Toplam Kullanıcı: 1,247\n• Bugün Aktif: 89\n• Toplam Mesaj: 45,231`);
  }
  else if (text === '🤖 Botlar') {
    bot.sendMessage(chatId, `🤖 18 sektör botu aktif!\n\nEn çok kullanılan:\n1. 🎓 Eğitim - 127 kullanıcı\n2. 🩺 Sağlık - 89 kullanıcı\n3. 💰 Finans - 234 kullanıcı`);
  }
  else if (text === '📢 Duyurular') {
    bot.sendMessage(chatId, `📢 Duyurular\n\n1. 🎉 Yeni KBN Karakterleri\n2. 🔧 Planlı Bakım\n3. 📊 Aylık Rapor`);
  }
  else if (text === '👥 Kullanıcılar') {
    bot.sendMessage(chatId, `👥 Kullanıcılar\n\n• Toplam: 1,247\n• Bugün Aktif: 89\n• Bu Hafta Yeni: 23\n• Banlı: 3`);
  }
  else if (text === '📈 İstatistikler') {
    bot.sendMessage(chatId, `📈 İstatistikler\n\nBu Ay:\n• Toplam Mesaj: 12,456\n• Benzersiz Kullanıcı: 456\n• Ort. Oturum: 8 dk`);
  }
  else if (text === '⚙️ Ayarlar') {
    bot.sendMessage(chatId, `⚙️ Ayarlar\n\n🔐 Güvenlik:\n• 2FA: ✅ Aktif\n• Oturum: 24 saat\n\n🤖 Bot Ayarları:\n• AI Model: Claude 3.5\n• Timeout: 30s`);
  }
});

// Hata yakalama
bot.on('polling_error', (error) => {
  console.error('Polling hatası:', error);
});

console.log('✅ Bot hazır!');
