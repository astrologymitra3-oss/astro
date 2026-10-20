const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

if (!process.env.JWT_SECRET) console.warn('[warn] JWT_SECRET not set - using a random secret (logins reset on restart)');
const SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

const sign = (payload, exp = '30d') => jwt.sign(payload, SECRET, { expiresIn: exp });
const verify = (t) => { try { return jwt.verify(t, SECRET); } catch { return null; } };
const bearer = (req) => verify((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));

const optionalUser = (req, _res, next) => { const p = bearer(req); req.user = p && p.uid ? p : null; next(); };
const requireUser = (req, res, next) => { const p = bearer(req); if (!p || !p.uid) return res.status(401).json({ error: 'Please login to continue' }); req.user = p; next(); };
const requireAdmin = (req, res, next) => { const p = bearer(req); if (!p || p.role !== 'admin') return res.status(401).json({ error: 'Admin login required' }); next(); };

const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => {
  console.error(e);
  res.status(e.status || 500).json({ error: e.status ? e.message : 'Something went wrong. Please try again.' });
});
const fail = (status, message) => Object.assign(new Error(message), { status });

async function sendMail(settings, { to, subject, html, attachments }) {
  if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) return false;
  const port = Number(settings.smtp_port) || 465;
  const t = nodemailer.createTransport({ host: settings.smtp_host, port, secure: port === 465, auth: { user: settings.smtp_user, pass: settings.smtp_pass } });
  await t.sendMail({ from: settings.smtp_from || `AstrologyMitra <${settings.smtp_user}>`, to, subject, html, attachments });
  return true;
}

async function geocode(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=0&q=${encodeURIComponent(q)}`, {
    headers: { 'User-Agent': 'AstrologyMitra/1.0 (astrologymitra3@gmail.com)', 'Accept-Language': 'en' },
  });
  if (!r.ok) return [];
  const j = await r.json();
  return j.map((x) => ({ name: x.display_name, lat: Number(x.lat), lon: Number(x.lon) }));
}

module.exports = { sign, verify, optionalUser, requireUser, requireAdmin, wrap, fail, sendMail, geocode };
