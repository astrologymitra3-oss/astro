'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '../lib/api';
import { useT } from './Lang';
import { useConfig } from './useConfig';

// Passwordless login: email only. If Admin turns on OTP, a 6-digit code is emailed first.
export default function AuthForm() {
  const router = useRouter();
  const t = useT();
  const mail = useConfig().contact.email;
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState(false);
  const [st, setSt] = useState({});
  const go = async (e) => {
    e.preventDefault(); setSt({ busy: true });
    try {
      const r = await api('/api/auth/login', { method: 'POST', body: { email, code: otp ? code : undefined }, auth: null });
      if (r.otp) { setOtp(true); setSt({ ok: t('We have sent a 6-digit code to your email.', 'आपके ईमेल पर 6 अंकों का कोड भेजा गया है।') }); return; }
      setToken(r.token); router.push('/dashboard');
    } catch (ex) { setSt({ err: ex.message }); }
  };
  return (
    <form className="authbox" onSubmit={go}>
      <h2 className="center">{t('View Your Reports', 'अपनी रिपोर्ट देखें')}</h2>
      <p className="center muted">{t('Enter the email you used while ordering.', 'वही ईमेल डालें जिससे आपने ऑर्डर किया था।')}</p>
      <label>{t('Email', 'ईमेल')}<input required type="email" value={email} onChange={(e) => { setEmail(e.target.value); setOtp(false); }} placeholder="name@gmail.com" /></label>
      {otp && <label>{t('Login code', 'लॉगिन कोड')}<input required inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="123456" /></label>}
      {st.err && <div className="alert">{st.err}</div>}{st.ok && !st.err && <div className="note">{st.ok}</div>}
      <button className="btn btn-block" disabled={st.busy}>{st.busy ? t('Please wait…', 'कृपया रुकें…') : otp ? t('Verify & Login', 'कोड डालकर लॉगिन करें') : t('Continue', 'आगे बढ़ें')}</button>
      <p className="center fine" style={{ marginTop: 16 }}>{t('No password needed.', 'पासवर्ड की ज़रूरत नहीं।')} {t('New here?', 'नए हैं?')} <Link href="/services" style={{ color: 'var(--saf)' }}>{t('Order a report', 'रिपोर्ट मँगवाएँ')}</Link></p>
      <p className="center fine">{t(`Need help? Write to ${mail}`, `मदद चाहिए? ${mail} पर लिखें`)}</p>
    </form>
  );
}
