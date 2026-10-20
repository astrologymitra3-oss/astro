const { Pool } = require('pg');
const SERVICES = require('./services');

const url = process.env.DATABASE_URL || '';
const pool = new Pool({
  connectionString: url,
  ssl: /sslmode=require/.test(url) || process.env.PGSSL === '1' ? { rejectUnauthorized: false } : false,
});

const DEFAULT_SETTINGS = {
  openai_key: '', openai_model: 'gpt-4o-mini',
  razorpay_key_id: '', razorpay_key_secret: '', payment_bypass: '1',
  delivery_delay_minutes: '0',
  smtp_host: '', smtp_port: '465', smtp_user: '', smtp_pass: '', smtp_from: '',
  admin_email: 'astrologymitra3@gmail.com', admin_whatsapp: '', contact_phone: '',
  contact_address: 'New Delhi, Delhi, India',
};
const SECRET_KEYS = ['openai_key', 'razorpay_key_secret', 'smtp_pass'];

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE NOT NULL, phone TEXT, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS services (slug TEXT PRIMARY KEY, price INTEGER NOT NULL, active BOOLEAN DEFAULT true);
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, service TEXT NOT NULL, language TEXT NOT NULL DEFAULT 'en',
      input JSONB NOT NULL, amount INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
      razorpay_order_id TEXT, razorpay_payment_id TEXT, paid_at TIMESTAMPTZ, release_at TIMESTAMPTZ, generated_at TIMESTAMPTZ,
      emailed BOOLEAN DEFAULT false, error TEXT, pdf BYTEA, pdf_pages INTEGER, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
    CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);
    CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
    CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, name TEXT, email TEXT, phone TEXT, message TEXT, created_at TIMESTAMPTZ DEFAULT now());
  `);
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) await pool.query('INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT DO NOTHING', [k, v]);
  for (const s of SERVICES) await pool.query('INSERT INTO services(slug,price) VALUES($1,$2) ON CONFLICT DO NOTHING', [s.slug, s.price]);
}

async function getSettings() {
  const { rows } = await pool.query('SELECT key, value FROM settings');
  const s = { ...DEFAULT_SETTINGS };
  rows.forEach((r) => (s[r.key] = r.value ?? ''));
  return s;
}
async function setSettings(obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (!(k in DEFAULT_SETTINGS)) continue;
    if (SECRET_KEYS.includes(k) && (v === undefined || v === null || String(v).includes('••'))) continue;
    await pool.query('INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value', [k, String(v ?? '')]);
  }
}

module.exports = { pool, q: (text, params) => pool.query(text, params), migrate, getSettings, setSettings, SECRET_KEYS };
