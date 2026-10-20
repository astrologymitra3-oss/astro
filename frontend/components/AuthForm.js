'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '../lib/api';

export default function AuthForm({ mode }) {
  const router = useRouter();
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
      <h2 className="center">{reg ? 'Create Account' : 'Welcome Back'}</h2>
      <p className="center muted">{reg ? 'Create an account to order and access your reports.' : 'Login to view and download your reports.'}</p>
      {reg && <label>Full name<input required value={f.name || ''} onChange={u('name')} /></label>}
      {reg && <label>Mobile (WhatsApp)<input required type="tel" value={f.phone || ''} onChange={u('phone')} placeholder="10-digit number" /></label>}
      <label>Email<input required type="email" value={f.email || ''} onChange={u('email')} /></label>
      <label>Password<input required type="password" minLength={6} value={f.password || ''} onChange={u('password')} /></label>
      {st.err && <div className="alert">{st.err}</div>}
      <button className="btn btn-block" disabled={st.busy}>{st.busy ? 'Please wait…' : reg ? 'Create Account' : 'Login'}</button>
      <p className="center fine" style={{ marginTop: 16 }}>
        {reg ? <>Already have an account? <Link href="/login" style={{ color: 'var(--saf)' }}>Login</Link></> : <>New here? <Link href="/register" style={{ color: 'var(--saf)' }}>Create an account</Link></>}
      </p>
      {!reg && <p className="center fine">Forgot your password? Email us at astrologymitra3@gmail.com from your registered email.</p>}
    </form>
  );
}
