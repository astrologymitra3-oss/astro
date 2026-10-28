'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceIcon } from '../../components/Icons';
import { useT } from '../../components/Lang';
import { api, getToken, setToken, downloadPdf, payWithRazorpay } from '../../lib/api';

const left = (d, t) => {
  const m = Math.max(0, Math.ceil((new Date(d) - Date.now()) / 60000));
  return m >= 60 ? `${Math.floor(m / 60)} ${t('hr', 'घंटे')} ${m % 60} ${t('min', 'मिनट')}` : `${m} ${t('min', 'मिनट')}`;
};

export default function Dashboard() {
  const router = useRouter();
  const t = useT();
  const [me, setMe] = useState(null);
  const [orders, setOrders] = useState(null);
  const [msg, setMsg] = useState({});
  const [isNew, setIsNew] = useState(null);

  const load = useCallback(() => api('/api/my/orders').then(setOrders).catch((e) => { if (e.status === 401) { setToken(null); router.replace('/login'); } }), [router]);
  useEffect(() => {
    if (!getToken()) return router.replace('/login');
    setIsNew(new URLSearchParams(window.location.search).get('new'));
    api('/api/auth/me').then((r) => setMe(r.user)).catch(() => {});
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load, router]);

  const dl = async (o) => {
    setMsg({});
    try { await downloadPdf(`/api/my/orders/${o.id}/pdf`, `AstrologyMitra-${o.service}-AM${o.id}.pdf`); } catch (e) { setMsg({ err: e.message }); }
  };
  const pay = async (o) => {
    setMsg({});
    try {
      const r = await api(`/api/orders/${o.id}/pay`, { method: 'POST' });
      if (!r.paid) await payWithRazorpay({ orderId: o.id, razorpay: r.razorpay, user: me, description: o.name });
      setMsg({ ok: t('Payment received. Pandit ji has started preparing your report.', 'पेमेंट मिल गया। पंडित जी ने आपकी रिपोर्ट बनानी शुरू कर दी है।') }); load();
    } catch (e) { setMsg({ err: e.message }); }
  };
  const logout = () => { setToken(null); router.push('/'); };

  return (
    <>
      <section className="pbanner" style={{ backgroundImage: 'url(/img/diyas.jpg)' }}><div className="wrap"><div className="crumb">{t('Home / My Dashboard', 'होम / मेरा डैशबोर्ड')}</div><h1>{t('Namaste', 'नमस्ते')}{me ? `, ${me.name}` : ''}</h1><p>{me ? `${me.email} · ${me.phone || ''}` : t('Your reports and orders', 'आपकी रिपोर्ट और ऑर्डर')}</p></div></section>
      <div className="wrap dash">
        <div className="dash-head"><h2 style={{ margin: 0 }}>{t('My Reports', 'मेरी रिपोर्ट')}</h2><div style={{ display: 'flex', gap: 10 }}><Link href="/services" className="btn btn-sm">{t('Order a new report', 'नई रिपोर्ट मँगवाएँ')}</Link><button className="btn btn-sm btn-line" onClick={logout}>{t('Logout', 'लॉगआउट')}</button></div></div>
        {isNew && <div className="note">{t(`Thank you! Your order AM-${isNew} is confirmed. Pandit ji is preparing your report, it will appear here and on your email.`, `धन्यवाद! आपका ऑर्डर AM-${isNew} कन्फ़र्म हो गया है। पंडित जी आपकी रिपोर्ट बना रहे हैं, यह यहाँ और आपके ईमेल पर आ जाएगी।`)}</div>}
        {msg.err && <div className="alert">{msg.err}</div>}{msg.ok && <div className="note">{msg.ok}</div>}
        {!orders ? <p className="muted">{t('Loading…', 'लोड हो रहा है…')}</p> : orders.length === 0 ? (
          <div className="empty"><h3>{t('No reports yet', 'अभी कोई रिपोर्ट नहीं')}</h3><p className="muted">{t('Choose a service to get your first personalised report.', 'अपनी पहली रिपोर्ट के लिए कोई सेवा चुनें।')}</p><Link href="/services" className="btn">{t('Browse Services', 'सेवाएँ देखें')}</Link></div>
        ) : (
          <div className="orders">
            {orders.map((o) => (
              <div className="ocard" key={o.id}>
                <span className="oc-ic"><ServiceIcon slug={o.service} size={44} /></span>
                <div>
                  <h3>{o.name}</h3>
                  <div className="meta">{t('Order', 'ऑर्डर')} AM-{o.id} · {t('For', 'किसके लिए:')} {o.for} · {o.language === 'hi' ? t('Hindi', 'हिन्दी') : 'English'} · ₹{o.amount} · {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  {o.status === 'preparing' && <div className="prep"><span className="spinner" />{t('Pandit ji is preparing your report', 'पंडित जी आपकी रिपोर्ट बना रहे हैं')}{o.release_at && new Date(o.release_at) > Date.now() ? t(`, expected in about ${left(o.release_at, t)}`, `, लगभग ${left(o.release_at, t)} में`) : t(', almost ready', ', लगभग तैयार')}</div>}
                </div>
                <div>
                  {o.status === 'ready' && <button className="btn btn-sm" onClick={() => dl(o)}>{t('Download PDF', 'PDF डाउनलोड करें')}</button>}
                  {o.status === 'preparing' && <span className="pill preparing">{t('Preparing', 'तैयार हो रही है')}</span>}
                  {o.status === 'awaiting_payment' && <button className="btn btn-sm" onClick={() => pay(o)}>{t('Complete Payment', 'पेमेंट पूरा करें')}</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
