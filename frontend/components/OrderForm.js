'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, setToken, payWithRazorpay } from '../lib/api';
import { PROBLEMS } from '../lib/services';
import { PROBLEMS_HI } from '../lib/servicesHi';
import { useLang, useT } from './Lang';
import { useConfig, priceOf } from './useConfig';

const TZ = [];
for (let v = -12; v <= 14; v += 0.5) TZ.push(v);
TZ.push(5.75); TZ.sort((a, b) => a - b);
const tzLabel = (v) => `UTC ${v < 0 ? '-' : '+'}${String(Math.floor(Math.abs(v))).padStart(2, '0')}:${String(Math.round((Math.abs(v) % 1) * 60)).padStart(2, '0')}${v === 5.5 ? ' (India)' : ''}`;
const today = () => new Date().toISOString().slice(0, 10);

function PlaceInput({ value, onChange }) {
  const tr = useT();
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
      <input required value={value.place || ''} onChange={(e) => type(e.target.value)} onFocus={() => setShow(true)} onBlur={() => setTimeout(() => setShow(false), 200)} placeholder={tr('Start typing your city / village', 'अपना शहर / गाँव लिखना शुरू करें')} autoComplete="off" />
      {value.lat !== '' && value.lat != null && <span className="ok-tick" title={tr('Location found', 'जगह मिल गई')}>✓</span>}
      {show && list.length > 0 && (
        <div className="place-list">{list.map((p, k) => <button type="button" key={k} onMouseDown={() => { onChange({ place: p.name, lat: p.lat, lon: p.lon }); setShow(false); }}>{p.name}</button>)}</div>
      )}
    </div>
  );
}

function Person({ p, set, birth = true, title }) {
  const t = useT();
  const u = (k) => (e) => set({ ...p, [k]: e.target.value });
  return (
    <fieldset className="fs">
      {title && <legend>{title}</legend>}
      <div className="row2">
        <label>{t('Full name', 'पूरा नाम')}<input required value={p.name || ''} onChange={u('name')} placeholder={t('As per records', 'रिकॉर्ड के अनुसार')} maxLength={80} /></label>
        <label>{t('Gender', 'लिंग')}<select required value={p.gender || ''} onChange={u('gender')}><option value="">{t('Select', 'चुनें')}</option><option value="Male">{t('Male', 'पुरुष')}</option><option value="Female">{t('Female', 'स्त्री')}</option><option value="Other">{t('Other', 'अन्य')}</option></select></label>
      </div>
      <div className="row2">
        <label>{t('Date of birth', 'जन्म तारीख')}<input required type="date" max={today()} min="1900-01-01" value={p.dob || ''} onChange={u('dob')} /></label>
        {birth && <label>{t('Time of birth', 'जन्म समय')}<input required type="time" value={p.tob || ''} onChange={u('tob')} /></label>}
      </div>
      {birth && (
        <>
          <label>{t('Place of birth', 'जन्म स्थान')}<PlaceInput value={p} onChange={(v) => set({ ...p, ...v })} /></label>
          <label className="small-l">{t('Time zone at birth', 'जन्म के समय का टाइम ज़ोन')}<select value={p.tz ?? 5.5} onChange={(e) => set({ ...p, tz: Number(e.target.value) })}>{TZ.map((v) => <option key={v} value={v}>{tzLabel(v)}</option>)}</select></label>
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
  const site = useLang().lang;
  const t = useT();
  const [lang, setLang] = useState(site);
  useEffect(() => setLang(site), [site]);
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
      <div className="oform-head"><h3>{t('Get your report', 'अपनी रिपोर्ट पाएँ')}</h3><div className="price">₹{price}<small>{t('one-time', 'एक बार')}</small></div></div>
      <div className="lang-pick">
        <span>{t('Report language', 'रिपोर्ट की भाषा')}</span>
        <div className="seg">
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
          <button type="button" className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')}>हिन्दी</button>
        </div>
      </div>
      {service.form === 'match' ? (
        <><Person title={t("Boy's details", 'लड़के का विवरण')} p={boy} set={setBoy} /><Person title={t("Girl's details", 'लड़की का विवरण')} p={girl} set={setGirl} /></>
      ) : (
        <Person p={p} set={setP} birth={service.form === 'birth'} />
      )}
      {service.extra?.includes('year') && (
        <label>{t('Varshphal year', 'वर्षफल का साल')}<select value={p.year || ''} onChange={(e) => setP({ ...p, year: e.target.value })}><option value="">{t('Current running year', 'अभी चल रहा साल')}</option>{[0, 1, 2].map((k) => { const y = new Date().getFullYear() + k; return <option key={y} value={y}>{y} - {y + 1}</option>; })}</select></label>
      )}
      {service.extra?.includes('problem') && (
        <label>{t('Your main concern', 'आपकी मुख्य समस्या')}<select required value={p.problem || ''} onChange={(e) => setP({ ...p, problem: e.target.value })}><option value="">{t('Select your concern', 'अपनी समस्या चुनें')}</option>{PROBLEMS.map(([k, v]) => <option key={k} value={k}>{t(v, PROBLEMS_HI[k])}</option>)}</select></label>
      )}
      {service.form === 'tarot' && (
        <label>{t('Your question', 'आपका सवाल')}<textarea required rows={3} maxLength={300} value={p.question || ''} onChange={(e) => setP({ ...p, question: e.target.value })} placeholder={t('e.g. Will my new business succeed this year?', 'जैसे: क्या इस साल मेरा नया बिज़नेस चलेगा?')} /></label>
      )}
      {!authed && (
        <fieldset className="fs acc">
          <legend>{t('Your account', 'आपका अकाउंट')} <small>{t('(to access your reports)', '(रिपोर्ट देखने के लिए)')}</small></legend>
          <div className="seg small">
            <button type="button" className={acc.mode === 'register' ? 'on' : ''} onClick={() => setAcc({ ...acc, mode: 'register' })}>{t('New customer', 'नया ग्राहक')}</button>
            <button type="button" className={acc.mode === 'login' ? 'on' : ''} onClick={() => setAcc({ ...acc, mode: 'login' })}>{t('I have an account', 'मेरा अकाउंट है')}</button>
          </div>
          {acc.mode === 'register' && <div className="row2"><label>{t('Your name', 'आपका नाम')}<input required value={acc.name || ''} onChange={ua('name')} /></label><label>{t('Mobile (WhatsApp)', 'मोबाइल (WhatsApp)')}<input required type="tel" pattern="\+?[0-9\s-]{10,15}" value={acc.phone || ''} onChange={ua('phone')} placeholder={t('10-digit number', '10 अंकों का नंबर')} /></label></div>}
          <div className="row2"><label>{t('Email', 'ईमेल')}<input required type="email" value={acc.email || ''} onChange={ua('email')} /></label><label>{t('Password', 'पासवर्ड')}<input required type="password" minLength={6} value={acc.password || ''} onChange={ua('password')} placeholder={t('Min 6 characters', 'कम से कम 6 अक्षर')} /></label></div>
        </fieldset>
      )}
      {err && <div className="alert">{err}</div>}
      <button className="btn btn-block" disabled={busy || !active}>{!active ? t('Currently unavailable', 'अभी उपलब्ध नहीं') : busy ? t('Please wait…', 'कृपया रुकें…') : t(`Proceed to Pay ₹${price}`, `₹${price} पेमेंट करें`)}</button>
      <p className="fine">🔒 {t('Secure payment via Razorpay', 'Razorpay से सुरक्षित पेमेंट')} · {t('Report in', 'रिपोर्ट')} {lang === 'hi' ? t('Hindi', 'हिन्दी में') : t('English', 'English में')} · {t('10-15 page PDF delivered to your dashboard & email', '10-15 पेज की PDF डैशबोर्ड और ईमेल पर')}</p>
    </form>
  );
}
