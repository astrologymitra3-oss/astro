'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, setToken, payWithRazorpay } from '../lib/api';
import { PROBLEMS } from '../lib/services';
import { useConfig, priceOf } from './useConfig';

const TZ = [];
for (let v = -12; v <= 14; v += 0.5) TZ.push(v);
TZ.push(5.75); TZ.sort((a, b) => a - b);
const tzLabel = (v) => `UTC ${v < 0 ? '-' : '+'}${String(Math.floor(Math.abs(v))).padStart(2, '0')}:${String(Math.round((Math.abs(v) % 1) * 60)).padStart(2, '0')}${v === 5.5 ? ' (India)' : ''}`;
const today = () => new Date().toISOString().slice(0, 10);

function PlaceInput({ value, onChange }) {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const t = useRef();
  const type = (v) => {
    onChange({ place: v, lat: '', lon: '' });
    clearTimeout(t.current);
    if (v.trim().length < 3) return setList([]);
    t.current = setTimeout(() => api(`/api/geo?q=${encodeURIComponent(v)}`, { auth: null }).then((r) => { setList(r); setShow(true); }).catch(() => {}), 450);
  };
  return (
    <div className="place">
      <input required value={value.place || ''} onChange={(e) => type(e.target.value)} onFocus={() => setShow(true)} onBlur={() => setTimeout(() => setShow(false), 200)} placeholder="Start typing your city / village" autoComplete="off" />
      {value.lat !== '' && value.lat != null && <span className="ok-tick" title="Location found">✓</span>}
      {show && list.length > 0 && (
        <div className="place-list">{list.map((p, k) => <button type="button" key={k} onMouseDown={() => { onChange({ place: p.name, lat: p.lat, lon: p.lon }); setShow(false); }}>{p.name}</button>)}</div>
      )}
    </div>
  );
}

function Person({ p, set, birth = true, title }) {
  const u = (k) => (e) => set({ ...p, [k]: e.target.value });
  return (
    <fieldset className="fs">
      {title && <legend>{title}</legend>}
      <div className="row2">
        <label>Full name<input required value={p.name || ''} onChange={u('name')} placeholder="As per records" maxLength={80} /></label>
        <label>Gender<select required value={p.gender || ''} onChange={u('gender')}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
      </div>
      <div className="row2">
        <label>Date of birth<input required type="date" max={today()} min="1900-01-01" value={p.dob || ''} onChange={u('dob')} /></label>
        {birth && <label>Time of birth<input required type="time" value={p.tob || ''} onChange={u('tob')} /></label>}
      </div>
      {birth && (
        <>
          <label>Place of birth<PlaceInput value={p} onChange={(v) => set({ ...p, ...v })} /></label>
          <label className="small-l">Time zone at birth<select value={p.tz ?? 5.5} onChange={(e) => set({ ...p, tz: Number(e.target.value) })}>{TZ.map((v) => <option key={v} value={v}>{tzLabel(v)}</option>)}</select></label>
        </>
      )}
    </fieldset>
  );
}

export default function OrderForm({ service }) {
  const cfg = useConfig();
  const router = useRouter();
  const price = priceOf(cfg, service.slug);
  const active = cfg.services.find((s) => s.slug === service.slug)?.active !== false;
  const [lang, setLang] = useState('en');
  const [p, setP] = useState({ tz: 5.5 });
  const [boy, setBoy] = useState({ tz: 5.5, gender: 'Male' });
  const [girl, setGirl] = useState({ tz: 5.5, gender: 'Female' });
  const [acc, setAcc] = useState({ mode: 'register' });
  const [authed, setAuthed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => setAuthed(!!getToken()), []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const input = service.form === 'match' ? { boy, girl } : p;
      const r = await api('/api/orders', { method: 'POST', body: { service: service.slug, language: lang, input, account: authed ? undefined : acc } });
      if (r.token) { setToken(r.token); setAuthed(true); }
      if (!r.paid) {
        const me = await api('/api/auth/me').catch(() => ({}));
        await payWithRazorpay({ orderId: r.orderId, razorpay: r.razorpay, user: me.user, description: service.title });
      }
      router.push(`/dashboard?new=${r.orderId}`);
    } catch (ex) {
      if (ex.status === 401 && authed) { setToken(null); setAuthed(false); }
      setErr(ex.message);
      setBusy(false);
    }
  };
  const ua = (k) => (e) => setAcc({ ...acc, [k]: e.target.value });

  return (
    <form className="oform" id="order" onSubmit={submit}>
      <div className="oform-head"><h3>Get your report</h3><div className="price">₹{price}<small>one-time</small></div></div>
      <div className="lang-pick">
        <span>Report language</span>
        <div className="seg">
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
          <button type="button" className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')}>हिन्दी</button>
        </div>
      </div>
      {service.form === 'match' ? (
        <><Person title="Boy's details" p={boy} set={setBoy} /><Person title="Girl's details" p={girl} set={setGirl} /></>
      ) : (
        <Person p={p} set={setP} birth={service.form === 'birth'} />
      )}
      {service.extra?.includes('year') && (
        <label>Varshphal year<select value={p.year || ''} onChange={(e) => setP({ ...p, year: e.target.value })}><option value="">Current running year</option>{[0, 1, 2].map((k) => { const y = new Date().getFullYear() + k; return <option key={y} value={y}>{y} - {y + 1}</option>; })}</select></label>
      )}
      {service.extra?.includes('problem') && (
        <label>Your main concern<select required value={p.problem || ''} onChange={(e) => setP({ ...p, problem: e.target.value })}><option value="">Select your concern</option>{PROBLEMS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      )}
      {service.form === 'tarot' && (
        <label>Your question<textarea required rows={3} maxLength={300} value={p.question || ''} onChange={(e) => setP({ ...p, question: e.target.value })} placeholder="e.g. Will my new business succeed this year?" /></label>
      )}
      {!authed && (
        <fieldset className="fs acc">
          <legend>Your account <small>(to access your reports)</small></legend>
          <div className="seg small">
            <button type="button" className={acc.mode === 'register' ? 'on' : ''} onClick={() => setAcc({ ...acc, mode: 'register' })}>New customer</button>
            <button type="button" className={acc.mode === 'login' ? 'on' : ''} onClick={() => setAcc({ ...acc, mode: 'login' })}>I have an account</button>
          </div>
          {acc.mode === 'register' && <div className="row2"><label>Your name<input required value={acc.name || ''} onChange={ua('name')} /></label><label>Mobile (WhatsApp)<input required type="tel" pattern="\+?[0-9\s-]{10,15}" value={acc.phone || ''} onChange={ua('phone')} placeholder="10-digit number" /></label></div>}
          <div className="row2"><label>Email<input required type="email" value={acc.email || ''} onChange={ua('email')} /></label><label>Password<input required type="password" minLength={6} value={acc.password || ''} onChange={ua('password')} placeholder="Min 6 characters" /></label></div>
        </fieldset>
      )}
      {err && <div className="alert">{err}</div>}
      <button className="btn btn-block" disabled={busy || !active}>{!active ? 'Currently unavailable' : busy ? 'Please wait…' : `Proceed to Pay ₹${price}`}</button>
      <p className="fine">🔒 Secure payment via Razorpay · Report in {lang === 'hi' ? 'Hindi' : 'English'} · 10-15 page PDF delivered to your dashboard & email</p>
    </form>
  );
}
