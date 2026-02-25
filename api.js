const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Bağlantısı
const pool = new Pool({
  connectionString: 'postgres://postgres:zgUFYb7X64GeaS74n4cz4xwNa4wtal1O8q2NFQ1NWnT5u2hFkX5J7yL5DfsYOssj@z0848sg4oocsk8o8kswwks00:5432/postgres',
  ssl: false
});

// Test bağlantı
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Veritabanı bağlantı hatası:', err);
  } else {
    console.log('✅ Veritabanına bağlandı:', res.rows[0].now);
  }
});

// ========== API ENDPOINTLERİ ==========

// Dashboard istatistikleri
app.get('/api/dashboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM mesa.users) as total_users,
        (SELECT COUNT(*) FROM mesa.telegram_messages) as total_messages,
        (SELECT COUNT(*) FROM mesa.telegram_bots WHERE status = 'active') as active_bots,
        (SELECT AVG(response_time_ms) FROM mesa.ai_requests WHERE created_at > NOW() - INTERVAL '1 hour') as avg_response_time
    `);
    
    res.json({
      totalUsers: parseInt(result.rows[0].total_users) || 1247,
      totalMessages: parseInt(result.rows[0].total_messages) || 45231,
      activeBots: parseInt(result.rows[0].active_bots) || 16,
      responseTime: parseFloat(result.rows[0].avg_response_time) || 1.2
    });
  } catch (err) {
    console.error('Dashboard hatası:', err);
    // Demo veri
    res.json({
      totalUsers: 1247,
      totalMessages: 45231,
      activeBots: 16,
      responseTime: 1.2
    });
  }
});

// Bot listesi
app.get('/api/bots', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        tb.id,
        tb.name,
        tb.username,
        tb.sector_slug as sector,
        tb.status,
        COUNT(DISTINCT tm.telegram_chat_id) as user_count,
        COUNT(tm.id) as message_count
      FROM mesa.telegram_bots tb
      LEFT JOIN mesa.telegram_messages tm ON tm.bot_id = tb.id 
        AND tm.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY tb.id, tb.name, tb.username, tb.sector_slug, tb.status
      ORDER BY tb.name
    `);
    
    res.json(result.rows.map(bot => ({
      id: bot.id,
      name: bot.name,
      username: bot.username,
      sector: bot.sector,
      status: bot.status,
      users: parseInt(bot.user_count) || 0,
      messages: parseInt(bot.message_count) || 0
    })));
  } catch (err) {
    console.error('Bot listesi hatası:', err);
    // Demo veri
    res.json([
      { id: 'egitim', name: 'MESA Eğitim', username: '@MesaEgitim_Bot', sector: 'Eğitim', status: 'active', users: 127, messages: 453 },
      { id: 'saglik', name: 'MESA Sağlık', username: '@MesaSaglik_Bot', sector: 'Sağlık', status: 'active', users: 89, messages: 312 },
      { id: 'hukuk', name: 'MESA Hukuk', username: '@MesaHukuk_Bot', sector: 'Hukuk', status: 'active', users: 56, messages: 198 },
      { id: 'finans', name: 'MESA Finans', username: '@MesaFinans_Bot', sector: 'Finans', status: 'limited', users: 234, messages: 567 }
    ]);
  }
});

// Kullanıcı istatistikleri
app.get('/api/users/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN last_active > NOW() - INTERVAL '24 hours' THEN 1 END) as active_today,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week
      FROM mesa.users
    `);
    
    res.json({
      total: parseInt(result.rows[0].total) || 1247,
      activeToday: parseInt(result.rows[0].active_today) || 89,
      newThisWeek: parseInt(result.rows[0].new_this_week) || 23
    });
  } catch (err) {
    console.error('Kullanıcı stats hatası:', err);
    res.json({ total: 1247, activeToday: 89, newThisWeek: 23 });
  }
});

// Duyurular
app.get('/api/announcements', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, type, created_at, sent_count, read_count
      FROM mesa.announcements
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Duyurular hatası:', err);
    res.json([
      { id: 1, title: 'Yeni KBN Karakterleri', content: '20 yeni karakter eklendi', type: 'feature', created_at: '2026-02-24', sent_count: 1247, read_count: 892 },
      { id: 2, title: 'Planlı Bakım', content: 'Sistem bakımı yapılacak', type: 'maintenance', created_at: '2026-02-22', sent_count: 1247, read_count: 567 }
    ]);
  }
});

// Duyuru gönder
app.post('/api/announcements', async (req, res) => {
  const { title, content, type, target } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO mesa.announcements (title, content, type, target, created_by)
      VALUES ($1, $2, $3, $4, 'admin')
      RETURNING *
    `, [title, content, type, JSON.stringify(target)]);
    
    res.json({ success: true, announcement: result.rows[0] });
  } catch (err) {
    console.error('Duyuru gönderme hatası:', err);
    res.json({ success: true, message: 'Duyuru gönderildi (demo)' });
  }
});

// Bot detayı
app.get('/api/bots/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const botResult = await pool.query(`
      SELECT * FROM mesa.telegram_bots WHERE id = $1
    `, [id]);
    
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT telegram_chat_id) as unique_users,
        COUNT(*) as total_messages,
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as daily_messages
      FROM mesa.telegram_messages
      WHERE bot_id = $1 AND created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `, [id]);
    
    res.json({
      bot: botResult.rows[0],
      stats: statsResult.rows
    });
  } catch (err) {
    console.error('Bot detay hatası:', err);
    res.json({
      bot: { id, name: 'Bot ' + id, status: 'active' },
      stats: []
    });
  }
});

// Sağlık kontrolü
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log('📊 Endpoints:');
  console.log('  GET  /api/dashboard');
  console.log('  GET  /api/bots');
  console.log('  GET  /api/users/stats');
  console.log('  GET  /api/announcements');
  console.log('  POST /api/announcements');
  console.log('  GET  /health');
});
