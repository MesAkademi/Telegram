# MESA KIMI - Premium Yönetim Paneli

## 🚀 Otomatik Deploy (Coolify)

Bu repo Coolify ile otomatik deploy edilebilir.

### Gereksinimler
- Node.js 18+
- PostgreSQL

### Coolify Ayarları

**Build Pack:** Node.js

**Port:** 3000

**Start Command:**
```bash
npm start
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
PORT=3000
```

## 📁 Dosya Yapısı

```
/
├── api.js              # API sunucusu
├── index.html          # Web App (statik)
├── package.json        # Bağımlılıklar
├── Dockerfile          # Docker yapılandırması
├── nginx.conf          # Nginx yapılandırması
└── README.md           # Bu dosya
```

## 🔌 API Endpoints

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/dashboard` | GET | Dashboard istatistikleri |
| `/api/bots` | GET | Bot listesi |
| `/api/users/stats` | GET | Kullanıcı istatistikleri |
| `/api/announcements` | GET | Duyurular |
| `/api/announcements` | POST | Yeni duyuru |
| `/health` | GET | Sağlık kontrolü |

## 🎨 Web App

Web App aynı domain'de `/` altında çalışır.

## 📝 Lisans

© 2026 MESA Akademi
