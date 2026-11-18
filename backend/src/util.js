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

// Email can go out by SMTP (e.g. Gmail + App Password) or, where SMTP ports are blocked
// (Railway Free/Hobby), by an HTTPS API: Brevo or Resend.
const mailReady = (s) => {
  const p = s.mail_provider || 'smtp';
  return p === 'smtp' ? !!(s.smtp_host && s.smtp_user && s.smtp_pass) : !!(s.mail_api_key && (s.smtp_from || s.smtp_user));
};
function parseFrom(s) {
  const raw = s.smtp_from || `AstrologyMitra <${s.smtp_user}>`;
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].replace(/^"|"$/g, '') || 'AstrologyMitra', email: m[2] } : { name: 'AstrologyMitra', email: raw.trim() };
}
const b64 = (c) => (Buffer.isBuffer(c) ? c : Buffer.from(c)).toString('base64');
async function sendMail(settings, { to, subject, html, attachments = [] }) {
  if (!mailReady(settings)) return false;
  const p = settings.mail_provider || 'smtp', from = parseFrom(settings);
  if (p === 'smtp') {
    const port = Number(settings.smtp_port) || 465;
    const t = nodemailer.createTransport({ host: settings.smtp_host, port, secure: port === 465, auth: { user: settings.smtp_user, pass: settings.smtp_pass }, connectionTimeout: 15000, greetingTimeout: 15000 });
    await t.sendMail({ from: `${from.name} <${from.email}>`, to, subject, html, attachments });
    return true;
  }
  const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 30000);
  try {
    let r;
    if (p === 'brevo') {
      r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', signal: ctrl.signal, headers: { 'api-key': settings.mail_api_key, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ sender: from, to: [{ email: to }], subject, htmlContent: html, ...(attachments.length ? { attachment: attachments.map((a) => ({ name: a.filename, content: b64(a.content) })) } : {}) }) });
    } else {
      r = await fetch('https://api.resend.com/emails', { method: 'POST', signal: ctrl.signal, headers: { Authorization: `Bearer ${settings.mail_api_key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `${from.name} <${from.email}>`, to: [to], subject, html, ...(attachments.length ? { attachments: attachments.map((a) => ({ filename: a.filename, content: b64(a.content) })) } : {}) }) });
    }
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(`${p} ${r.status}: ${j.message || j.error || 'request failed'}`); }
    return true;
  } finally { clearTimeout(tm); }
}

async function geocode(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=0&q=${encodeURIComponent(q)}`, {
    headers: { 'User-Agent': 'AstrologyMitra/1.0 (astrologymitra3@gmail.com)', 'Accept-Language': 'en' },
  });
  if (!r.ok) return [];
  const j = await r.json();
  return j.map((x) => ({ name: x.display_name, lat: Number(x.lat), lon: Number(x.lon) }));
}

module.exports = { sign, verify, optionalUser, requireUser, requireAdmin, wrap, fail, sendMail, mailReady, geocode };
