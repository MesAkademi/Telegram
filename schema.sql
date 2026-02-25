-- MESA SQL YAPISI (Tahmini - Gerçek yapıya göre ayarlanacak)

-- 1. KULLANICILAR TABLOSU
CREATE TABLE IF NOT EXISTS mesa.users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user', -- admin, moderator, user
    status VARCHAR(50) DEFAULT 'active', -- active, banned, suspended
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW()
);

-- 2. TELEGRAM BOT TABLOSU
CREATE TABLE IF NOT EXISTS mesa.telegram_bots (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    token TEXT,
    sector_slug VARCHAR(100),
    sector_name VARCHAR(255),
    description TEXT,
    icon VARCHAR(50) DEFAULT '🤖',
    color VARCHAR(20) DEFAULT '#3b82f6',
    status VARCHAR(50) DEFAULT 'active', -- active, limited, maintenance, offline
    ai_model VARCHAR(100) DEFAULT 'claude-3.5-sonnet',
    webhook_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TELEGRAM MESAJLAR TABLOSU
CREATE TABLE IF NOT EXISTS mesa.telegram_messages (
    id SERIAL PRIMARY KEY,
    bot_id VARCHAR(50) REFERENCES mesa.telegram_bots(id),
    telegram_chat_id BIGINT,
    telegram_message_id BIGINT,
    user_id INTEGER REFERENCES mesa.users(id),
    message_type VARCHAR(50) DEFAULT 'text', -- text, photo, video, voice
    content TEXT,
    response TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. DUYURULAR TABLOSU
CREATE TABLE IF NOT EXISTS mesa.announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general', -- general, maintenance, feature, urgent
    target JSONB, -- ['all'] veya ['egitim', 'saglik']
    sent_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    sent_by INTEGER REFERENCES mesa.users(id),
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. AI İSTEKLER TABLOSU
CREATE TABLE IF NOT EXISTS mesa.ai_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES mesa.users(id),
    bot_id VARCHAR(50) REFERENCES mesa.telegram_bots(id),
    model VARCHAR(100),
    prompt TEXT,
    response TEXT,
    tokens_used INTEGER,
    response_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'success', -- success, error, timeout
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. YÖNETİCİ LOG TABLOSU
CREATE TABLE IF NOT EXISTS mesa.admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES mesa.users(id),
    action VARCHAR(100), -- login, logout, broadcast, settings_change
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ÖRNEK VERİLER
INSERT INTO mesa.telegram_bots (id, name, username, sector_slug, sector_name, icon, color, status) VALUES
('egitim', 'MESA Eğitim', '@MesaEgitim_Bot', 'egitim', 'Eğitim', '🎓', '#6366f1', 'active'),
('saglik', 'MESA Sağlık', '@MesaSaglik_Bot', 'saglik', 'Sağlık', '🩺', '#10b981', 'active'),
('hukuk', 'MESA Hukuk', '@MesaHukuk_Bot', 'hukuk', 'Hukuk', '⚖️', '#ef4444', 'active'),
('finans', 'MESA Finans', '@MesaFinans_Bot', 'finans', 'Finans', '💰', '#f59e0b', 'active'),
('muhendislik', 'MESA Mühendislik', '@MesaMuhendis_Bot', 'muhendislik', 'Mühendislik', '🔧', '#0ea5e9', 'active'),
('tarim', 'MESA Tarım', '@MesaTarim_Bot', 'tarim', 'Tarım', '🌾', '#84cc16', 'active'),
('turizm', 'MESA Turizm', '@MesaTurizm_Bot', 'turizm', 'Turizm', '✈️', '#8b5cf6', 'active'),
('sanat', 'MESA Sanat', '@MesaSanat_Bot', 'sanat', 'Sanat', '🎨', '#ec4899', 'active'),
('teknoloji', 'MESA Teknoloji', '@MesaTeknoloji_Bot', 'teknoloji', 'Teknoloji', '💻', '#06b6d4', 'active'),
('enerji', 'MESA Enerji', '@MesaEnerji_Bot', 'enerji', 'Enerji', '⚡', '#eab308', 'active'),
('gayrimenkul', 'MESA Gayrimenkul', '@MesaGayrimenkul_Bot', 'gayrimenkul', 'Gayrimenkul', '🏠', '#14b8a6', 'active'),
('medya', 'MESA Medya', '@MesaMedya_Bot', 'medya', 'Medya', '📺', '#f97316', 'active'),
('lojistik', 'MESA Lojistik', '@MesaLojistik_Bot', 'lojistik', 'Lojistik', '🚚', '#64748b', 'active'),
('perakende', 'MESA Perakende', '@MesaPerakende_Bot', 'perakende', 'Perakende', '🛒', '#db2777', 'active'),
('uretim', 'MESA Üretim', '@MesaUretim_Bot', 'uretim', 'Üretim', '🏭', '#7c3aed', 'active'),
('insaat', 'MESA İnşaat', '@MesaInsaat_Bot', 'insaat', 'İnşaat', '🏗️', '#dc2626', 'active'),
('genel', 'MESA Genel', '@MesAkademi_Bot', 'genel', 'Genel', '🤖', '#3b82f6', 'active'),
('yonetim', 'MESA Yönetim', '@AkademiMes_Bot', 'yonetim', 'Yönetim', '👑', '#1e293b', 'active')
ON CONFLICT (id) DO NOTHING;
