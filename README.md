# MESA KIMI - Telegram Bot Yönetim Sistemi

## 📋 Proje Özeti

**MESA KIMI**, 16 farklı sektör botunu tek bir panelden yönetmeyi sağlayan premium bir Telegram bot yönetim sistemidir.

### 🎯 Projenin Amacı

- **Tek Noktadan Yönetim**: 16 farklı botu tek bir yerden kontrol etme
- **Toplu Duyuru**: Tüm botlara aynı anda mesaj gönderme
- **Kullanıcı Takibi**: Tüm botların kullanıcılarını tek panelde görme
- **İstatistikler**: Gerçek zamanlı kullanıcı ve mesaj istatistikleri

---

## 🏗️ Sistem Mimarisi

### 1. Ana Bileşenler

```
┌─────────────────────────────────────────────────────────────┐
│                    MESA KIMI SİSTEMİ                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Web App    │    │   API Server │    │  PostgreSQL  │  │
│  │  (React)     │◄──►│   (Node.js)  │◄──►│   (pg17)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                              │                              │
│                              ▼                              │
│                    ┌──────────────────┐                     │
│                    │  16 Telegram Bot │                     │
│                    │  (Her Sektör İçin│                     │
│                    │   Ayrı Bot)      │                     │
│                    └──────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Teknoloji Stack

| Katman | Teknoloji | Amaç |
|--------|-----------|------|
| **Frontend** | HTML/CSS/JS | Web yönetim paneli |
| **Backend** | Node.js + Express | API ve bot yönetimi |
| **Database** | PostgreSQL 17 | Kullanıcı ve mesaj verileri |
| **Bot Framework** | node-telegram-bot-api | Telegram bot entegrasyonu |
| **Deployment** | Coolify + Docker | Container orchestration |

---

## 🤖 Bot Sistemi Detayları

### 1. 16 Sektör Botu

Her sektör için ayrı bir Telegram botu vardır:

| # | Bot Adı | Kullanıcı Adı | Sektör | Token |
|---|---------|---------------|--------|-------|
| 1 | MESA Eğitim | @MesaEgitimBot | Eğitim | `8212700834:AAFx...` |
| 2 | MESA Sağlık | @MesaSaglikBot | Sağlık | `8161143511:AAHT...` |
| 3 | MESA Hukuk | @MesaHukukBot | Hukuk | `8519596332:AAF0...` |
| 4 | MESA Finans | @MesaFinansBot | Finans | `8215909476:AAHn...` |
| 5 | MESA Mühendislik | @MesaMuhendisBot | Mühendislik | `8491998160:AAFR...` |
| 6 | MESA Tarım | @MesaTarimBot | Tarım | `8326466961:AAHs...` |
| 7 | MESA Turizm | @MesaTurizmBot | Turizm | `8291223922:AAEl...` |
| 8 | MESA Gayrimenkul | @MesaGayrimenkulBot | Gayrimenkul | `8258876471:AAF5...` |
| 9 | MESA Enerji | @MesaEnerjiBot | Enerji | `8573709800:AAFtv...` |
| 10 | MESA Medya | @MesaMedyaBot | Medya | `7528780351:AAE74...` |
| 11 | MESA Lojistik | @MesaLojistikBot | Lojistik | `8053649301:AAEL...` |
| 12 | MESA Perakende | @MesaPerakendeBot | Perakende | `8588528944:AAF3...` |
| 13 | MESA Üretim | @MesaUretimBot | Üretim | `7686176749:AAEYE...` |
| 14 | MESA İnşaat | @MesaInsaatBot | İnşaat | `8278000430:AAGwk...` |
| 15 | MESA Teknoloji | @MesaTeknolojiBot | Teknoloji | `8213833732:AAHM...` |
| 16 | MESA Sanat | @MesaSanatBot | Sanat | `8516343086:AAFrH...` |

### 2. Ana Yönetim Botu

- **Bot Adı**: MESA KIMI
- **Kullanıcı Adı**: @MesAkademi_Bot
- **Token**: `8568828893:AAGSNh5FYXx-Y1khFtHlEQLDGikVLesC1Wg`
- **Görev**: Tüm botları yönetmek, toplu duyuru yapmak

---

## 💾 Veritabanı Şeması

### 1. Tablolar

#### `mesa.users` - Kullanıcılar
```sql
CREATE TABLE mesa.users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  sector VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);
```

**Amaç**: Tüm botların kullanıcılarını tek yerde tutmak

#### `mesa.telegram_bots` - Botlar
```sql
CREATE TABLE mesa.telegram_bots (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  token VARCHAR(500) NOT NULL,
  sector VARCHAR(100),
  icon VARCHAR(10) DEFAULT '🤖',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Amaç**: 16 botun bilgilerini saklamak

#### `mesa.announcements` - Duyurular
```sql
CREATE TABLE mesa.announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500),
  content TEXT,
  type VARCHAR(50) DEFAULT 'general',
  sent_to INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Amaç**: Yapılan duyuruları kaydetmek

---

## 🔧 API Endpoint'leri

### 1. Dashboard
```
GET /api/dashboard
```

### 2. Bot Listesi
```
GET /api/bots
```

### 3. Toplu Duyuru
```
POST /api/broadcast
Body: { "message": "Duyuru metni" }
```

---

## 🚀 Deployment

### Coolify Ortam Değişkenleri

| Değişken | Değer | Açıklama |
|----------|-------|----------|
| `DATABASE_URL` | `postgres://...` | PostgreSQL bağlantı URL |
| `BOT_TOKEN` | `8568828893:...` | Ana bot token |
| `WEBAPP_URL` | `https://...` | Web panel URL |
| `PORT` | `3000` | Uygulama portu |

---

## 📁 Dosya Yapısı

```
webapp/
├── api.js              # Ana API ve bot kodu
├── index.html          # Web panel
├── package.json        # Bağımlılıklar
└── README.md           # Bu dosya
```

---

## 📝 Geliştirme Notları

### Yapılanlar
- ✅ 16 bot entegrasyonu
- ✅ Toplu duyuru sistemi
- ✅ SQL şema tasarımı
- ✅ Web panel temeli
- ✅ Inline menü sistemi

### Yapılacaklar
- 🔄 SQL bağlantısı düzeltme
- 🔄 Bot instance kontrolü
- 🔄 Kullanıcı listesi çekme
- 🔄 Gerçek zamanlı istatistikler
