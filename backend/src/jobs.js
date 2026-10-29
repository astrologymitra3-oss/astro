// Report generation queue + scheduled delivery (release_at) emails
const { q, getSettings } = require('./db');
const { buildReport } = require('./report/build');
const { sendMail, sign } = require('./util');
const SERVICES = require('./services');

const queue = [];
let busy = false;
const svcName = (slug) => (SERVICES.find((s) => s.slug === slug) || {}).name || slug;
// Public website URL for email links: SITE_URL, else the first FRONTEND_URL entry
const SITE = () => {
  const u = (process.env.SITE_URL || (process.env.FRONTEND_URL || '').split(',')[0] || 'https://astrologymitra.com').trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');
  return /^https?:\/\//.test(u) ? u : `https://${u}`;
};

function enqueue(id) {
  if (!queue.includes(id)) queue.push(id);
  run();
}
async function run() {
  if (busy) return;
  busy = true;
  while (queue.length) {
    const id = queue.shift();
    try { await generate(id); } catch (e) { console.error('[gen]', id, e); }
  }
  busy = false;
}

async function generate(id) {
  const { rows: [o] } = await q('SELECT * FROM orders WHERE id=$1', [id]);
  if (!o || o.status === 'pending') return;
  await q("UPDATE orders SET status='generating', error=NULL, updated_at=now() WHERE id=$1", [id]);
  const s = await getSettings();
  try {
    const r = await buildReport(o, s);
    await q("UPDATE orders SET status='ready', pdf=$2, pdf_pages=$3, generated_at=now(), emailed=false, updated_at=now() WHERE id=$1", [id, r.pdf, r.pages]);
    console.log(`[gen] order ${id} ready (${r.pages} pages, tokens ${r.usage?.total_tokens ?? '-'})`);
    await deliverDue();
  } catch (e) {
    console.error('[gen] failed', id, e.message);
    await q("UPDATE orders SET status='failed', error=$2, updated_at=now() WHERE id=$1", [id, String(e.message || e).slice(0, 500)]);
    sendMail(s, { to: s.admin_email, subject: `Report generation failed - Order AM-${id}`, html: `<p>Order AM-${id} (${svcName(o.service)}) failed to generate.</p><p>Error: ${String(e.message).replace(/</g, '&lt;')}</p><p>Open the admin dashboard and click Regenerate after fixing the issue.</p>` }).catch(() => {});
  }
}

const mailShell = (body, s = {}) => `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden">
<div style="background:#1b1440;padding:18px 24px;color:#fff;font-size:20px;font-weight:bold">Astrology<span style="color:#f39220">Mitra</span></div>
<div style="padding:24px;color:#333;line-height:1.6">${body}</div><div style="background:#fff7ef;padding:12px 24px;font-size:12px;color:#888">AstrologyMitra · astrologymitra.com · ${s.contact_email || 'support@astrologymitra.com'}</div></div>`;

async function sendReportEmail(o, s) {
  const name = (o.input.name || o.input.boy?.name || 'Customer').replace(/</g, '');
  const link = `${SITE()}/dashboard`;
  return sendMail(s, {
    to: o.email,
    subject: `Your ${svcName(o.service)} report is ready - AstrologyMitra`,
    html: mailShell(`<p>Namaste ${name} ji,</p><p>Your <b>${svcName(o.service)}</b> report (Order AM-${o.id}) has been prepared by Pandit ji and is attached to this email.</p><p>You can also download it any time from <a href="${link}">your dashboard</a>.</p><p>With blessings,<br/>Team AstrologyMitra</p>`, s),
    attachments: [{ filename: `AstrologyMitra-${o.service}-AM${o.id}.pdf`, content: o.pdf }],
  });
}

let delivering = false;
async function deliverDue() {
  if (delivering) return;
  delivering = true;
  try {
    const s = await getSettings();
    if (!s.smtp_host || !s.smtp_user || !s.smtp_pass) return;
    const { rows } = await q("SELECT o.*, u.email FROM orders o JOIN users u ON u.id=o.user_id WHERE o.status='ready' AND o.emailed=false AND o.release_at <= now() ORDER BY o.id LIMIT 10");
    for (const o of rows) {
      try { if (await sendReportEmail(o, s)) await q('UPDATE orders SET emailed=true WHERE id=$1', [o.id]); } catch (e) { console.error('[mail]', o.id, e.message); }
    }
  } finally { delivering = false; }
}

async function markPaid(id, paymentId) {
  const s = await getSettings();
  const delay = Math.max(0, Number(s.delivery_delay_minutes) || 0);
  const { rows: [o] } = await q(
    `UPDATE orders SET status='paid', razorpay_payment_id=COALESCE($2, razorpay_payment_id), paid_at=now(), release_at=now() + ($3::text || ' minutes')::interval, updated_at=now()
     WHERE id=$1 AND status='pending' RETURNING *`, [id, paymentId || null, String(delay)]);
  if (!o) return false;
  enqueue(id);
  const { rows: [u] } = await q('SELECT name,email,phone FROM users WHERE id=$1', [o.user_id]);
  const who = o.input.name || `${o.input.boy?.name} & ${o.input.girl?.name}`;
  sendMail(s, { to: s.admin_email, subject: `New order AM-${id}: ${svcName(o.service)} (₹${o.amount})`,
    html: mailShell(`<p><b>New paid order</b></p><p>Order: AM-${id}<br/>Service: ${svcName(o.service)}<br/>Language: ${o.language === 'hi' ? 'Hindi' : 'English'}<br/>Amount: ₹${o.amount}<br/>For: ${who}<br/>Customer: ${u?.name} · ${u?.email} · ${u?.phone || '-'}<br/>Release to customer: ${o.release_at.toISOString()}</p>`) }).catch(() => {});
  return true;
}

function start() {
  q("SELECT id FROM orders WHERE status IN ('paid','generating') ORDER BY id").then(({ rows }) => rows.forEach((r) => enqueue(r.id))).catch(console.error);
  setInterval(() => deliverDue().catch(console.error), 60000);
}

const downloadToken = (id) => sign({ oid: id, dl: 1 }, '60d');

module.exports = { enqueue, markPaid, deliverDue, start, sendReportEmail, downloadToken };
