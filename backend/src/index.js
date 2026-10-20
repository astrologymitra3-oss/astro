const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { q, getSettings, setSettings, SECRET_KEYS } = db;
const SERVICES = require('./services');
const { PROBLEMS } = require('./astro/data');
const { sign, verify, optionalUser, requireUser, requireAdmin, wrap, fail, sendMail, geocode } = require('./util');
const jobs = require('./jobs');

const app = express();
app.set('trust proxy', 1);
const origins = (process.env.FRONTEND_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json({ limit: '1mb' }));

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'astrologymitra3@gmail.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const svc = (slug) => SERVICES.find((s) => s.slug === slug);
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
const str = (v, max = 120) => String(v ?? '').trim().slice(0, max);

// ---------- input validation ----------
async function cleanPerson(p, needBirth = true) {
  p = p || {};
  const o = { name: str(p.name, 80), gender: ['Male', 'Female', 'Other'].includes(p.gender) ? p.gender : '', dob: str(p.dob, 10) };
  if (!o.name) throw fail(400, 'Please enter the full name');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.dob) || isNaN(Date.parse(o.dob)) || +o.dob.slice(0, 4) < 1900 || Date.parse(o.dob) > Date.now()) throw fail(400, 'Please enter a valid date of birth');
  if (!needBirth) return o;
  o.tob = str(p.tob, 5);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(o.tob)) throw fail(400, 'Please enter a valid time of birth');
  o.place = str(p.place, 200);
  if (!o.place) throw fail(400, 'Please enter the place of birth');
  o.tz = Number(p.tz ?? 5.5);
  if (!(o.tz >= -12 && o.tz <= 14)) o.tz = 5.5;
  let lat = Number(p.lat), lon = Number(p.lon);
  if (!isFinite(lat) || !isFinite(lon) || (p.lat === undefined || p.lat === '' || p.lat === null)) {
    const g = await geocode(o.place).catch(() => []);
    if (!g.length) throw fail(400, `We could not locate "${o.place}". Please choose the place from the suggestions.`);
    lat = g[0].lat; lon = g[0].lon;
  }
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) throw fail(400, 'Invalid place coordinates');
  return { ...o, lat, lon };
}
async function cleanInput(s, input) {
  input = input || {};
  if (s.form === 'match') return { boy: await cleanPerson(input.boy), girl: await cleanPerson(input.girl) };
  if (s.form === 'numerology') {
    const o = await cleanPerson(input, false);
    if (!/[a-z]/i.test(o.name)) throw fail(400, 'Please write the name in English letters for numerology');
    return o;
  }
  if (s.form === 'tarot') return { ...(await cleanPerson(input, false)), question: str(input.question, 300) };
  const o = await cleanPerson(input);
  if (s.extra?.includes('year')) { const y = Number(input.year); if (y >= 1900 && y <= 2100) o.year = y; }
  if (s.extra?.includes('problem')) { if (!PROBLEMS[input.problem]) throw fail(400, 'Please choose your concern'); o.problem = input.problem; }
  return o;
}

// customer-facing status
function publicStatus(o) {
  if (o.status === 'pending') return 'awaiting_payment';
  if (o.status === 'ready' && new Date(o.release_at) <= new Date()) return 'ready';
  return 'preparing';
}
const subjectName = (o) => o.input.name || (o.input.boy ? `${o.input.boy.name} & ${o.input.girl.name}` : '');

// ---------- Razorpay ----------
const rzpAuth = (s) => 'Basic ' + Buffer.from(`${s.razorpay_key_id}:${s.razorpay_key_secret}`).toString('base64');
async function rzpCreateOrder(s, amount, id) {
  const r = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: rzpAuth(s), 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amount * 100, currency: 'INR', receipt: `AM-${id}`, notes: { order_id: String(id) } }) });
  const j = await r.json();
  if (!r.ok) throw fail(502, `Payment gateway error: ${j.error?.description || r.status}`);
  return j;
}
async function reconcile(o, s) {
  if (o.status !== 'pending' || !o.razorpay_order_id || !s.razorpay_key_secret) return;
  if (Date.now() - new Date(o.created_at) > 3 * 864e5) return;
  const r = await fetch(`https://api.razorpay.com/v1/orders/${o.razorpay_order_id}/payments`, { headers: { Authorization: rzpAuth(s) } }).catch(() => null);
  if (!r || !r.ok) return;
  const j = await r.json();
  const paid = (j.items || []).find((p) => p.status === 'captured' || p.status === 'authorized');
  if (paid) { await jobs.markPaid(o.id, paid.id); o.status = 'paid'; }
}

// ================= PUBLIC =================
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/config', wrap(async (_req, res) => {
  const s = await getSettings();
  const { rows } = await q('SELECT slug, price, active FROM services');
  res.json({
    contact: { email: s.admin_email, phone: s.contact_phone, whatsapp: s.admin_whatsapp, address: s.contact_address },
    payment: { bypass: s.payment_bypass === '1', key: s.razorpay_key_id },
    services: SERVICES.map((sv) => { const r = rows.find((x) => x.slug === sv.slug) || {}; return { slug: sv.slug, name: sv.name, price: r.price ?? sv.price, active: r.active !== false }; }),
  });
}));

app.get('/api/geo', wrap(async (req, res) => {
  const qs = str(req.query.q, 120);
  if (qs.length < 3) return res.json([]);
  res.json(await geocode(qs));
}));

app.post('/api/contact', wrap(async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!str(name) || !emailOk(email) || str(message, 2000).length < 5) throw fail(400, 'Please fill name, a valid email and your message');
  await q('INSERT INTO messages(name,email,phone,message) VALUES($1,$2,$3,$4)', [str(name), str(email), str(phone, 20), str(message, 2000)]);
  const s = await getSettings();
  sendMail(s, { to: s.admin_email, subject: `New enquiry from ${str(name)}`, html: `<p><b>${str(name)}</b> (${str(email)}, ${str(phone, 20)})</p><p>${str(message, 2000).replace(/</g, '&lt;')}</p>` }).catch(() => {});
  res.json({ ok: true });
}));

// ---------- customer auth ----------
const userOut = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone });
async function register({ name, email, phone, password }) {
  email = str(email, 120).toLowerCase();
  if (!str(name)) throw fail(400, 'Please enter your name');
  if (!emailOk(email)) throw fail(400, 'Please enter a valid email');
  if (!/^\+?\d{10,13}$/.test(str(phone, 20).replace(/[\s-]/g, ''))) throw fail(400, 'Please enter a valid mobile number');
  if (String(password || '').length < 6) throw fail(400, 'Password must be at least 6 characters');
  const ex = await q('SELECT id FROM users WHERE email=$1', [email]);
  if (ex.rows.length) throw fail(409, 'An account with this email already exists. Please login.');
  const { rows: [u] } = await q('INSERT INTO users(name,email,phone,password_hash) VALUES($1,$2,$3,$4) RETURNING *', [str(name, 80), email, str(phone, 20).replace(/[\s-]/g, ''), await bcrypt.hash(password, 10)]);
  return u;
}
async function login({ email, password }) {
  const { rows: [u] } = await q('SELECT * FROM users WHERE email=$1', [str(email, 120).toLowerCase()]);
  if (!u || !(await bcrypt.compare(String(password || ''), u.password_hash))) throw fail(401, 'Invalid email or password');
  return u;
}
app.post('/api/auth/register', wrap(async (req, res) => { const u = await register(req.body || {}); res.json({ token: sign({ uid: u.id }), user: userOut(u) }); }));
app.post('/api/auth/login', wrap(async (req, res) => { const u = await login(req.body || {}); res.json({ token: sign({ uid: u.id }), user: userOut(u) }); }));
app.get('/api/auth/me', requireUser, wrap(async (req, res) => {
  const { rows: [u] } = await q('SELECT * FROM users WHERE id=$1', [req.user.uid]);
  if (!u) throw fail(401, 'Please login again');
  res.json({ user: userOut(u) });
}));

// ---------- orders ----------
app.post('/api/orders', optionalUser, wrap(async (req, res) => {
  const { service, language, input, account } = req.body || {};
  const s = svc(service);
  if (!s) throw fail(400, 'Unknown service');
  const { rows: [sr] } = await q('SELECT price, active FROM services WHERE slug=$1', [s.slug]);
  if (sr && sr.active === false) throw fail(400, 'This service is currently unavailable');
  const clean = await cleanInput(s, input);
  let uid = req.user?.uid, token = null;
  if (!uid) {
    if (!account) throw fail(401, 'Please login or create an account');
    const u = account.mode === 'login' ? await login(account) : await register(account);
    uid = u.id; token = sign({ uid });
  }
  const amount = sr?.price ?? s.price;
  const { rows: [o] } = await q('INSERT INTO orders(user_id,service,language,input,amount) VALUES($1,$2,$3,$4,$5) RETURNING id', [uid, s.slug, language === 'hi' ? 'hi' : 'en', clean, amount]);
  const st = await getSettings();
  if (st.payment_bypass === '1' || amount <= 0) {
    await jobs.markPaid(o.id, 'TEST-BYPASS');
    return res.json({ orderId: o.id, token, paid: true });
  }
  if (!st.razorpay_key_id || !st.razorpay_key_secret) throw fail(503, 'Online payment is not configured yet. Please contact us.');
  const rz = await rzpCreateOrder(st, amount, o.id);
  await q('UPDATE orders SET razorpay_order_id=$2 WHERE id=$1', [o.id, rz.id]);
  res.json({ orderId: o.id, token, paid: false, razorpay: { key: st.razorpay_key_id, orderId: rz.id, amount: rz.amount, currency: rz.currency } });
}));

app.post('/api/orders/:id/verify', requireUser, wrap(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const { rows: [o] } = await q('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [req.params.id, req.user.uid]);
  if (!o) throw fail(404, 'Order not found');
  if (o.status !== 'pending') return res.json({ ok: true });
  const s = await getSettings();
  const expected = crypto.createHmac('sha256', s.razorpay_key_secret).update(`${o.razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (razorpay_order_id !== o.razorpay_order_id || !razorpay_signature || expected.length !== String(razorpay_signature).length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(razorpay_signature)))) throw fail(400, 'Payment verification failed');
  await jobs.markPaid(o.id, razorpay_payment_id);
  res.json({ ok: true });
}));

// retry payment for a pending order
app.post('/api/orders/:id/pay', requireUser, wrap(async (req, res) => {
  const { rows: [o] } = await q("SELECT * FROM orders WHERE id=$1 AND user_id=$2 AND status='pending'", [req.params.id, req.user.uid]);
  if (!o) throw fail(404, 'Order not found');
  const st = await getSettings();
  if (st.payment_bypass === '1') { await jobs.markPaid(o.id, 'TEST-BYPASS'); return res.json({ paid: true }); }
  const rz = await rzpCreateOrder(st, o.amount, o.id);
  await q('UPDATE orders SET razorpay_order_id=$2 WHERE id=$1', [o.id, rz.id]);
  res.json({ paid: false, razorpay: { key: st.razorpay_key_id, orderId: rz.id, amount: rz.amount, currency: rz.currency } });
}));

app.get('/api/my/orders', requireUser, wrap(async (req, res) => {
  const { rows } = await q('SELECT id, service, language, input, amount, status, release_at, paid_at, created_at, razorpay_order_id FROM orders WHERE user_id=$1 ORDER BY id DESC', [req.user.uid]);
  const s = await getSettings();
  for (const o of rows) await reconcile(o, s).catch(() => {});
  res.json(rows.map((o) => ({ id: o.id, service: o.service, name: svc(o.service)?.name, language: o.language, for: subjectName(o), amount: o.amount, status: publicStatus(o), release_at: o.release_at, created_at: o.created_at })));
}));

async function sendPdf(res, o) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="AstrologyMitra-${o.service}-AM${o.id}.pdf"`);
  res.send(o.pdf);
}
app.get('/api/my/orders/:id/pdf', requireUser, wrap(async (req, res) => {
  const { rows: [o] } = await q('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [req.params.id, req.user.uid]);
  if (!o) throw fail(404, 'Report not found');
  if (publicStatus(o) !== 'ready' || !o.pdf) throw fail(425, 'Pandit ji is still preparing your report');
  sendPdf(res, o);
}));
app.get('/api/dl/:token', wrap(async (req, res) => {
  const p = verify(req.params.token);
  if (!p || !p.dl) throw fail(403, 'This download link is invalid or has expired');
  const { rows: [o] } = await q('SELECT * FROM orders WHERE id=$1', [p.oid]);
  if (!o || publicStatus(o) !== 'ready' || !o.pdf) throw fail(425, 'The report is not available yet');
  sendPdf(res, o);
}));

// ================= ADMIN =================
app.post('/api/admin/login', wrap(async (req, res) => {
  const { email, password } = req.body || {};
  if (!ADMIN_PASSWORD) throw fail(503, 'ADMIN_PASSWORD is not set on the server');
  const ok = str(email).toLowerCase() === ADMIN_EMAIL && String(password || '').length === ADMIN_PASSWORD.length && crypto.timingSafeEqual(Buffer.from(String(password)), Buffer.from(ADMIN_PASSWORD));
  if (!ok) throw fail(401, 'Invalid admin credentials');
  res.json({ token: sign({ role: 'admin' }, '7d') });
}));
const admin = express.Router();
admin.use(requireAdmin);

admin.get('/stats', wrap(async (_req, res) => {
  const { rows: [r] } = await q(`SELECT
    COUNT(*) FILTER (WHERE status<>'pending')::int AS paid_orders,
    COUNT(*) FILTER (WHERE status='pending')::int AS unpaid_forms,
    COALESCE(SUM(amount) FILTER (WHERE status<>'pending' AND razorpay_payment_id IS DISTINCT FROM 'TEST-BYPASS'),0)::int AS revenue,
    COUNT(*) FILTER (WHERE status='ready')::int AS delivered,
    COUNT(*) FILTER (WHERE status IN ('paid','generating'))::int AS in_progress,
    COUNT(*) FILTER (WHERE status='failed')::int AS failed,
    COUNT(*) FILTER (WHERE created_at > now() - interval '1 day')::int AS today
    FROM orders`);
  const { rows: [u] } = await q('SELECT COUNT(*)::int AS users FROM users');
  const { rows: m } = await q('SELECT COUNT(*)::int AS messages FROM messages');
  const { rows: bySvc } = await q("SELECT service, COUNT(*)::int AS n FROM orders WHERE status<>'pending' GROUP BY service ORDER BY n DESC");
  res.json({ ...r, users: u.users, messages: m[0].messages, byService: bySvc });
}));

admin.get('/orders', wrap(async (req, res) => {
  const where = [], params = [];
  if (req.query.status) { params.push(req.query.status); where.push(`o.status=$${params.length}`); }
  if (req.query.q) { params.push(`%${str(req.query.q)}%`); where.push(`(u.email ILIKE $${params.length} OR u.name ILIKE $${params.length} OR u.phone ILIKE $${params.length} OR o.input::text ILIKE $${params.length} OR ('AM-' || o.id::text) ILIKE $${params.length})`); }
  const { rows } = await q(`SELECT o.id, o.service, o.language, o.input, o.amount, o.status, o.paid_at, o.release_at, o.generated_at, o.emailed, o.error, o.pdf_pages, o.created_at, o.razorpay_payment_id,
    u.name AS user_name, u.email AS user_email, u.phone AS user_phone FROM orders o LEFT JOIN users u ON u.id=o.user_id ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY o.id DESC LIMIT 500`, params);
  res.json(rows.map((o) => ({ ...o, service_name: svc(o.service)?.name, for: subjectName(o), customer_status: publicStatus(o) })));
}));

const getOrder = async (id) => { const { rows: [o] } = await q('SELECT o.*, u.email, u.name AS user_name, u.phone AS user_phone FROM orders o LEFT JOIN users u ON u.id=o.user_id WHERE o.id=$1', [id]); if (!o) throw fail(404, 'Order not found'); return o; };
admin.post('/orders/:id/regenerate', wrap(async (req, res) => {
  const o = await getOrder(req.params.id);
  if (o.status === 'pending') throw fail(400, 'Order is not paid yet');
  await q("UPDATE orders SET status='paid', updated_at=now() WHERE id=$1", [o.id]);
  jobs.enqueue(o.id);
  res.json({ ok: true });
}));
admin.post('/orders/:id/mark-paid', wrap(async (req, res) => { await getOrder(req.params.id); res.json({ ok: await jobs.markPaid(Number(req.params.id), 'MANUAL') }); }));
admin.post('/orders/:id/release', wrap(async (req, res) => { await q('UPDATE orders SET release_at=now() WHERE id=$1', [req.params.id]); jobs.deliverDue().catch(() => {}); res.json({ ok: true }); }));
admin.post('/orders/:id/email', wrap(async (req, res) => {
  const o = await getOrder(req.params.id);
  if (!o.pdf) throw fail(400, 'Report is not generated yet');
  const s = await getSettings();
  if (!(await jobs.sendReportEmail(o, s))) throw fail(400, 'SMTP email is not configured in Settings');
  await q('UPDATE orders SET emailed=true WHERE id=$1', [o.id]);
  res.json({ ok: true });
}));
admin.get('/orders/:id/pdf', wrap(async (req, res) => { const o = await getOrder(req.params.id); if (!o.pdf) throw fail(404, 'Report is not generated yet'); sendPdf(res, o); }));
admin.get('/orders/:id/share', wrap(async (req, res) => {
  const o = await getOrder(req.params.id);
  res.json({ url: `${process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`}/api/dl/${jobs.downloadToken(o.id)}`, released: new Date(o.release_at) <= new Date() });
}));
admin.delete('/orders/:id', wrap(async (req, res) => { await q('DELETE FROM orders WHERE id=$1', [req.params.id]); res.json({ ok: true }); }));

admin.get('/users', wrap(async (_req, res) => {
  const { rows } = await q("SELECT u.id, u.name, u.email, u.phone, u.created_at, COUNT(o.id) FILTER (WHERE o.status<>'pending')::int AS orders, COALESCE(SUM(o.amount) FILTER (WHERE o.status<>'pending'),0)::int AS spent FROM users u LEFT JOIN orders o ON o.user_id=u.id GROUP BY u.id ORDER BY u.id DESC LIMIT 1000");
  res.json(rows);
}));
admin.get('/messages', wrap(async (_req, res) => res.json((await q('SELECT * FROM messages ORDER BY id DESC LIMIT 500')).rows)));
admin.delete('/messages/:id', wrap(async (req, res) => { await q('DELETE FROM messages WHERE id=$1', [req.params.id]); res.json({ ok: true }); }));

admin.get('/settings', wrap(async (_req, res) => {
  const s = await getSettings();
  for (const k of SECRET_KEYS) s[k] = s[k] ? `••••••${s[k].slice(-4)}` : '';
  res.json(s);
}));
admin.put('/settings', wrap(async (req, res) => { await setSettings(req.body || {}); res.json({ ok: true }); }));
admin.get('/services', wrap(async (_req, res) => {
  const { rows } = await q('SELECT * FROM services');
  res.json(SERVICES.map((s) => ({ ...s, ...(rows.find((r) => r.slug === s.slug) || {}) })));
}));
admin.put('/services/:slug', wrap(async (req, res) => {
  if (!svc(req.params.slug)) throw fail(404, 'Unknown service');
  const price = Math.max(0, Math.round(Number(req.body.price) || 0));
  await q('INSERT INTO services(slug,price,active) VALUES($1,$2,$3) ON CONFLICT(slug) DO UPDATE SET price=EXCLUDED.price, active=EXCLUDED.active', [req.params.slug, price, req.body.active !== false]);
  res.json({ ok: true });
}));
admin.post('/test/openai', wrap(async (_req, res) => {
  const s = await getSettings();
  if (!s.openai_key) throw fail(400, 'OpenAI key is empty');
  const r = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${s.openai_key}` } });
  if (!r.ok) throw fail(400, `OpenAI rejected the key (${r.status})`);
  res.json({ ok: true, message: 'OpenAI key is working' });
}));
admin.post('/test/smtp', wrap(async (_req, res) => {
  const s = await getSettings();
  try {
    if (!(await sendMail(s, { to: s.admin_email, subject: 'AstrologyMitra SMTP test', html: '<p>SMTP is configured correctly.</p>' }))) throw new Error('SMTP host, user and password are required');
  } catch (e) { throw fail(400, `Email failed: ${e.message}`); }
  res.json({ ok: true, message: `Test email sent to ${s.admin_email}` });
}));
admin.post('/test/razorpay', wrap(async (_req, res) => {
  const s = await getSettings();
  const r = await fetch('https://api.razorpay.com/v1/orders?count=1', { headers: { Authorization: rzpAuth(s) } });
  if (!r.ok) throw fail(400, `Razorpay rejected the keys (${r.status})`);
  res.json({ ok: true, message: 'Razorpay keys are working' });
}));
app.use('/api/admin', admin);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 8080;
db.migrate().then(() => {
  app.listen(PORT, () => console.log(`AstrologyMitra API on :${PORT}`));
  jobs.start();
}).catch((e) => { console.error('Database init failed:', e.message); process.exit(1); });
