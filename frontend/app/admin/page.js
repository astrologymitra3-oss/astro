'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, getToken, setToken, downloadPdf } from '../../lib/api';
import { Logo } from '../../components/Art';
import './admin.css';

const A = 'am_admin';
const aapi = (p, o = {}) => api(p, { ...o, auth: A });
const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-');
const STATUS = { pending: 'Form filled · Not paid', paid: 'Paid · Queued', generating: 'Generating', ready: 'Report ready', failed: 'Failed' };
const waNum = (p) => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 ? '91' + d : d; };

function Login({ onIn }) {
  const [f, setF] = useState({});
  const [err, setErr] = useState('');
  const go = async (e) => { e.preventDefault(); setErr(''); try { const r = await api('/api/admin/login', { method: 'POST', body: f, auth: null }); setToken(r.token, A); onIn(); } catch (ex) { setErr(ex.message); } };
  return (
    <div className="ad-login"><form onSubmit={go}>
      <div className="ad-brand"><Logo size={44} /><b>AstrologyMitra Admin</b></div>
      <label>Email<input required type="email" onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Password<input required type="password" onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
      {err && <div className="alert">{err}</div>}<button className="btn btn-block">Login</button>
    </form></div>
  );
}

function Overview({ go }) {
  const [s, setS] = useState(null);
  useEffect(() => { aapi('/api/admin/stats').then(setS).catch(() => {}); }, []);
  if (!s) return <p>Loading…</p>;
  const cards = [['Paid orders', s.paid_orders, 'all'], ['Revenue (₹)', s.revenue], ['Forms not paid', s.unpaid_forms, 'pending'], ['Reports ready', s.delivered, 'ready'], ['In progress', s.in_progress, 'generating'], ['Failed', s.failed, 'failed'], ['Orders today', s.today], ['Customers', s.users], ['Messages', s.messages]];
  return (
    <>
      <div className="ad-cards">{cards.map(([l, v, f]) => <button key={l} className="ad-card" onClick={() => f && go(f)}><span>{l}</span><b>{v}</b></button>)}</div>
      <div className="ad-box"><h3>Orders by service</h3><table className="ad-t"><tbody>{s.byService.map((r) => <tr key={r.service}><td>{r.service}</td><td>{r.n}</td></tr>)}</tbody></table></div>
    </>
  );
}

function Orders({ initial }) {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState(initial === 'all' ? '' : initial || '');
  const [q, setQ] = useState('');
  const [view, setView] = useState(null);
  const [msg, setMsg] = useState({});
  const [cfg, setCfg] = useState({});
  const load = useCallback(() => aapi(`/api/admin/orders?status=${status}&q=${encodeURIComponent(q)}`).then(setRows).catch((e) => setMsg({ err: e.message })), [status, q]);
  useEffect(() => { load(); }, [status]); // eslint-disable-line
  useEffect(() => { aapi('/api/admin/settings').then(setCfg).catch(() => {}); const t = setInterval(load, 20000); return () => clearInterval(t); }, [load]);
  const act = async (o, a, method = 'POST') => {
    setMsg({});
    if (a === 'delete' && !confirm(`Delete order AM-${o.id}?`)) return;
    try { await aapi(`/api/admin/orders/${o.id}${a === 'delete' ? '' : '/' + a}`, { method: a === 'delete' ? 'DELETE' : method }); setMsg({ ok: `Done: ${a} for AM-${o.id}` }); setView(null); load(); } catch (e) { setMsg({ err: e.message }); }
  };
  const share = async (o, to) => {
    const w = window.open('', '_blank');
    try {
      const r = await aapi(`/api/admin/orders/${o.id}/share`);
      const cust = `Namaste ${o.user_name || ''} ji 🙏\nYour *${o.service_name}* report (Order AM-${o.id}) from AstrologyMitra is ready.\nDownload: ${r.url}\n\nRegards,\nAstrologyMitra`;
      const self = `Order AM-${o.id} · ${o.service_name}\nFor: ${o.for}\nCustomer: ${o.user_name} · ${o.user_phone} · ${o.user_email}\nStatus: ${STATUS[o.status]}\nPDF: ${r.url}`;
      const num = to === 'me' ? waNum(cfg.admin_whatsapp) : waNum(o.user_phone);
      w.location.href = `https://wa.me/${num}?text=${encodeURIComponent(to === 'me' ? self : cust)}`;
    } catch (e) { w.close(); setMsg({ err: e.message }); }
  };
  return (
    <>
      <div className="ad-filter">
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <form onSubmit={(e) => { e.preventDefault(); load(); }}><input placeholder="Search name, email, phone, AM-12…" value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn btn-sm">Search</button></form>
      </div>
      {msg.err && <div className="alert">{msg.err}</div>}{msg.ok && <div className="note">{msg.ok}</div>}
      {!rows ? <p>Loading…</p> : (
        <div className="ad-scroll"><table className="ad-t">
          <thead><tr><th>Order</th><th>Service</th><th>For</th><th>Customer</th><th>₹</th><th>Status</th><th>Customer sees from</th><th>Actions</th></tr></thead>
          <tbody>{rows.map((o) => (
            <tr key={o.id}>
              <td><b>AM-{o.id}</b><br /><small>{fmt(o.created_at)}</small></td>
              <td>{o.service_name}<br /><small>{o.language === 'hi' ? 'Hindi' : 'English'}{o.pdf_pages ? ` · ${o.pdf_pages} pages` : ''}</small></td>
              <td>{o.for}</td>
              <td>{o.user_name}<br /><small>{o.user_email}<br />{o.user_phone}</small></td>
              <td>{o.amount}{o.razorpay_payment_id === 'TEST-BYPASS' && <><br /><small>test</small></>}</td>
              <td><span className={`st st-${o.status}`}>{STATUS[o.status]}</span>{o.status === 'ready' && <><br /><small>{o.emailed ? 'Emailed ✓' : 'Not emailed'}</small></>}{o.error && <><br /><small className="err">{o.error}</small></>}</td>
              <td><small>{o.status === 'pending' ? '-' : fmt(o.release_at)}</small>{o.status !== 'pending' && new Date(o.release_at) > Date.now() && <><br /><small className="err">Hidden from customer till then</small></>}</td>
              <td className="ad-act">
                <button onClick={() => setView(o)}>View</button>
                {o.status === 'ready' && <button onClick={() => downloadPdf(`/api/admin/orders/${o.id}/pdf`, `AM${o.id}-${o.service}.pdf`, A).catch((e) => setMsg({ err: e.message }))}>{new Date(o.release_at) > Date.now() ? 'Preview PDF (not yet released)' : 'PDF'}</button>}
                {o.status === 'ready' && <button className="wa" onClick={() => share(o, 'cust')}>WhatsApp customer</button>}
                <button className="wa" onClick={() => share(o, 'me')}>WhatsApp me</button>
                {o.status === 'ready' && <button onClick={() => act(o, 'email')}>Email</button>}
                {o.status !== 'pending' && new Date(o.release_at) > Date.now() && <button onClick={() => act(o, 'release')}>Release now</button>}
                {o.status !== 'pending' && <button onClick={() => act(o, 'regenerate')}>Regenerate</button>}
                {o.status === 'pending' && <button onClick={() => act(o, 'mark-paid')}>Mark paid</button>}
                <button className="del" onClick={() => act(o, 'delete')}>Delete</button>
              </td>
            </tr>))}
            {rows.length === 0 && <tr><td colSpan={8}>No orders found.</td></tr>}
          </tbody>
        </table></div>
      )}
      {view && (
        <div className="ad-modal" onClick={() => setView(null)}><div onClick={(e) => e.stopPropagation()}>
          <h3>Order AM-{view.id} · {view.service_name}</h3>
          <p><b>Customer:</b> {view.user_name} · {view.user_email} · {view.user_phone}</p>
          <p><b>Status:</b> {STATUS[view.status]} · <b>Paid:</b> {fmt(view.paid_at)} · <b>Generated:</b> {fmt(view.generated_at)} · <b>Release:</b> {fmt(view.release_at)}</p>
          <table className="ad-t"><tbody>{Object.entries(view.input).flatMap(([k, v]) => (v && typeof v === 'object' ? Object.entries(v).map(([k2, v2]) => [`${k}.${k2}`, v2]) : [[k, v]])).map(([k, v]) => <tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
          <button className="btn btn-sm" onClick={() => setView(null)}>Close</button>
        </div></div>
      )}
    </>
  );
}

function List({ path, cols, del }) {
  const [rows, setRows] = useState(null);
  const load = useCallback(() => aapi(path).then(setRows).catch(() => setRows([])), [path]);
  useEffect(() => { load(); }, [load]);
  if (!rows) return <p>Loading…</p>;
  return (
    <div className="ad-scroll"><table className="ad-t">
      <thead><tr>{cols.map((c) => <th key={c[0]}>{c[1]}</th>)}{del && <th />}</tr></thead>
      <tbody>{rows.map((r) => <tr key={r.id}>{cols.map((c) => <td key={c[0]}>{c[2] ? c[2](r[c[0]], r) : String(r[c[0]] ?? '')}</td>)}{del && <td className="ad-act"><button className="del" onClick={() => aapi(`${path}/${r.id}`, { method: 'DELETE' }).then(load)}>Delete</button></td>}</tr>)}
        {rows.length === 0 && <tr><td colSpan={cols.length + 1}>Nothing here yet.</td></tr>}</tbody>
    </table></div>
  );
}

function Services() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(() => { aapi('/api/admin/services').then(setRows); }, []);
  const save = async (r) => { await aapi(`/api/admin/services/${r.slug}`, { method: 'PUT', body: { price: r.price, active: r.active } }); setMsg(`Saved ${r.name}`); };
  const up = (i, k, v) => setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="ad-box">{msg && <div className="note">{msg}</div>}
      <table className="ad-t"><thead><tr><th>Service</th><th>Price (₹)</th><th>Active</th><th /></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={r.slug}><td>{r.name}</td><td><input type="number" min="0" value={r.price} onChange={(e) => up(i, 'price', e.target.value)} style={{ width: 110 }} /></td><td><input type="checkbox" checked={r.active !== false} onChange={(e) => up(i, 'active', e.target.checked)} style={{ width: 'auto' }} /></td><td><button className="btn btn-sm" onClick={() => save(r)}>Save</button></td></tr>)}</tbody>
      </table>
    </div>
  );
}

function Settings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState({});
  useEffect(() => { aapi('/api/admin/settings').then(setS); }, []);
  if (!s) return <p>Loading…</p>;
  const u = (k) => (e) => setS({ ...s, [k]: e.target.type === 'checkbox' ? (e.target.checked ? '1' : '0') : e.target.value });
  const save = async (e) => { e?.preventDefault(); setMsg({}); try { await aapi('/api/admin/settings', { method: 'PUT', body: s }); setMsg({ ok: 'Settings saved' }); setS(await aapi('/api/admin/settings')); } catch (ex) { setMsg({ err: ex.message }); } };
  const test = async (k) => { setMsg({}); try { await aapi('/api/admin/settings', { method: 'PUT', body: s }); const r = await aapi(`/api/admin/test/${k}`, { method: 'POST' }); setMsg({ ok: r.message }); } catch (ex) { setMsg({ err: ex.message }); } };
  const F = (k, label, type = 'text', ph = '') => <label>{label}<input type={type} value={s[k] ?? ''} onChange={u(k)} placeholder={ph} /></label>;
  return (
    <form onSubmit={save}>
      {msg.err && <div className="alert">{msg.err}</div>}{msg.ok && <div className="note">{msg.ok}</div>}
      <div className="ad-grid">
        <div className="ad-box"><h3>AI Report Content (OpenAI)</h3>
          {F('openai_key', 'OpenAI API key', 'password', 'sk-...')}
          <label>Model<select value={s.openai_model} onChange={u('openai_model')}>{['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4o', 'gpt-4.1'].map((m) => <option key={m}>{m}</option>)}{!['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4o', 'gpt-4.1'].includes(s.openai_model) && <option>{s.openai_model}</option>}</select></label>
          <p className="hint">gpt-4o-mini is the most economical (one call per report). Leave the key field unchanged to keep the saved key.</p>
          <button type="button" className="btn btn-sm btn-line" onClick={() => test('openai')}>Test key</button>
        </div>
        <div className="ad-box"><h3>Payments (Razorpay)</h3>
          {F('razorpay_key_id', 'Key ID', 'text', 'rzp_live_...')}{F('razorpay_key_secret', 'Key Secret', 'password')}
          <label className="chk"><input type="checkbox" checked={s.payment_bypass === '1'} onChange={u('payment_bypass')} /> Testing mode — bypass payment (orders are marked paid without Razorpay)</label>
          <button type="button" className="btn btn-sm btn-line" onClick={() => test('razorpay')}>Test keys</button>
        </div>
        <div className="ad-box"><h3>Report Delivery</h3>
          <label>Show report to customer after<select value={s.delivery_delay_minutes} onChange={u('delivery_delay_minutes')}>{[[0, 'Immediately'], [10, '10 minutes'], [30, '30 minutes'], [60, '1 hour'], [120, '2 hours'], [180, '3 hours'], [360, '6 hours'], [720, '12 hours'], [1440, '24 hours']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}{![0, 10, 30, 60, 120, 180, 360, 720, 1440].includes(Number(s.delivery_delay_minutes)) && <option value={s.delivery_delay_minutes}>{s.delivery_delay_minutes} minutes</option>}</select></label>
          {F('delivery_delay_minutes', 'Or custom minutes', 'number')}
          <p className="hint">The PDF is generated right after payment. Until this time the customer sees “Pandit ji is preparing your report”; the email is sent when it is released.</p>
        </div>
        <div className="ad-box"><h3>Email (SMTP)</h3>
          {F('smtp_host', 'SMTP host', 'text', 'smtp.gmail.com')}{F('smtp_port', 'Port', 'number', '465')}{F('smtp_user', 'Username', 'text', 'astrologymitra3@gmail.com')}{F('smtp_pass', 'Password / App password', 'password')}{F('smtp_from', 'From name & email', 'text', 'AstrologyMitra <astrologymitra3@gmail.com>')}
          <p className="hint">For Gmail use smtp.gmail.com, port 465 and a Google App Password.</p>
          <button type="button" className="btn btn-sm btn-line" onClick={() => test('smtp')}>Send test email</button>
        </div>
        <div className="ad-box"><h3>Notifications & Contact</h3>
          {F('admin_email', 'Admin email (order notifications)', 'email')}{F('contact_email', 'Support email shown on website', 'email', 'support@astrologymitra.com')}{F('admin_whatsapp', 'Admin WhatsApp number', 'tel', '91XXXXXXXXXX')}{F('contact_phone', 'Public phone (optional)', 'tel')}{F('contact_address', 'Address')}
        </div>
      </div>
      <button className="btn">Save Settings</button>
    </form>
  );
}

const TABS = [['overview', 'Overview'], ['orders', 'Orders & Forms'], ['users', 'Customers'], ['messages', 'Messages'], ['services', 'Services & Pricing'], ['settings', 'Settings']];

export default function Admin() {
  const [ok, setOk] = useState(null);
  const [tab, setTab] = useState('overview');
  const [filter, setFilter] = useState('');
  useEffect(() => { setOk(!!getToken(A)); }, []);
  if (ok === null) return null;
  if (!ok) return <Login onIn={() => setOk(true)} />;
  const go = (f) => { setFilter(f); setTab('orders'); };
  return (
    <div className="ad">
      <aside className="ad-side">
        <div className="ad-brand"><Logo size={36} /><b>Admin</b></div>
        {TABS.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setFilter(''); }}>{l}</button>)}
        <a href="/" target="_blank">View website ↗</a>
        <button onClick={() => { setToken(null, A); setOk(false); }}>Logout</button>
      </aside>
      <section className="ad-main">
        <h2>{TABS.find((t) => t[0] === tab)[1]}</h2>
        {tab === 'overview' && <Overview go={go} />}
        {tab === 'orders' && <Orders key={filter} initial={filter} />}
        {tab === 'users' && <List path="/api/admin/users" cols={[['id', '#'], ['name', 'Name'], ['email', 'Email'], ['phone', 'Phone', (v) => v ? <a href={`https://wa.me/${waNum(v)}`} target="_blank" rel="noreferrer">{v}</a> : '-'], ['orders', 'Paid orders'], ['spent', 'Spent ₹'], ['created_at', 'Joined', fmt]]} />}
        {tab === 'messages' && <List path="/api/admin/messages" del cols={[['created_at', 'Date', fmt], ['name', 'Name'], ['email', 'Email', (v) => <a href={`mailto:${v}`}>{v}</a>], ['phone', 'Phone'], ['message', 'Message']]} />}
        {tab === 'services' && <Services />}
        {tab === 'settings' && <Settings />}
      </section>
    </div>
  );
}
