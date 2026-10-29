'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '../lib/api';
import { useT } from './Lang';
import { useConfig } from './useConfig';

export default function AuthForm({ mode }) {
  const router = useRouter();
  const t = useT();
  const mail = useConfig().contact.email;
  const [f, setF] = useState({});
  const [st, setSt] = useState({});
  const u = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async (e) => {
    e.preventDefault(); setSt({ busy: true });
    try { const r = await api(`/api/auth/${mode}`, { method: 'POST', body: f, auth: null }); setToken(r.token); router.push('/dashboard'); }
    catch (ex) { setSt({ err: ex.message }); }
  };
  const reg = mode === 'register';
  return (
    <form className="authbox" onSubmit={go}>
      <h2 className="center">{reg ? t('Create Account', 'नया अकाउंट बनाएँ') : t('Welcome Back', 'फिर से स्वागत है')}</h2>
      <p className="center muted">{reg ? t('Create an account to order and access your reports.', 'ऑर्डर करने और अपनी रिपोर्ट देखने के लिए अकाउंट बनाएँ।') : t('Login to view and download your reports.', 'अपनी रिपोर्ट देखने और डाउनलोड करने के लिए लॉगिन करें।')}</p>
      {reg && <label>{t('Full name', 'पूरा नाम')}<input required value={f.name || ''} onChange={u('name')} /></label>}
      {reg && <label>{t('Mobile (WhatsApp)', 'मोबाइल (WhatsApp)')}<input required type="tel" value={f.phone || ''} onChange={u('phone')} placeholder={t('10-digit number', '10 अंकों का नंबर')} /></label>}
      <label>{t('Email', 'ईमेल')}<input required type="email" value={f.email || ''} onChange={u('email')} /></label>
      <label>{t('Password', 'पासवर्ड')}<input required type="password" minLength={6} value={f.password || ''} onChange={u('password')} /></label>
      {st.err && <div className="alert">{st.err}</div>}
      <button className="btn btn-block" disabled={st.busy}>{st.busy ? t('Please wait…', 'कृपया रुकें…') : reg ? t('Create Account', 'अकाउंट बनाएँ') : t('Login', 'लॉगिन')}</button>
      <p className="center fine" style={{ marginTop: 16 }}>
        {reg ? <>{t('Already have an account?', 'पहले से अकाउंट है?')} <Link href="/login" style={{ color: 'var(--saf)' }}>{t('Login', 'लॉगिन')}</Link></> : <>{t('New here?', 'नए हैं?')} <Link href="/register" style={{ color: 'var(--saf)' }}>{t('Create an account', 'अकाउंट बनाएँ')}</Link></>}
      </p>
      {!reg && <p className="center fine">{t(`Forgot your password? Email us at ${mail} from your registered email.`, `पासवर्ड भूल गए? अपने रजिस्टर्ड ईमेल से ${mail} पर हमें लिखें।`)}</p>}
    </form>
  );
}
