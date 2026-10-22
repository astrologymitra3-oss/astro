'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceIcon } from '../../components/Icons';
import { api, getToken, setToken, downloadPdf, payWithRazorpay } from '../../lib/api';

const left = (t) => {
  const m = Math.max(0, Math.ceil((new Date(t) - Date.now()) / 60000));
  return m >= 60 ? `${Math.floor(m / 60)} hr ${m % 60} min` : `${m} min`;
};

export default function Dashboard() {
  const router = useRouter();
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
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
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
      setMsg({ ok: 'Payment received. Pandit ji has started preparing your report.' }); load();
    } catch (e) { setMsg({ err: e.message }); }
  };
  const logout = () => { setToken(null); router.push('/'); };

  return (
    <>
      <section className="pbanner"><div className="wrap"><div className="crumb">Home / My Dashboard</div><h1>Namaste{me ? `, ${me.name}` : ''}</h1><p>{me ? `${me.email} · ${me.phone || ''}` : 'Your reports and orders'}</p></div></section>
      <div className="wrap dash">
        <div className="dash-head"><h2 style={{ margin: 0 }}>My Reports</h2><div style={{ display: 'flex', gap: 10 }}><Link href="/services" className="btn btn-sm">Order a new report</Link><button className="btn btn-sm btn-line" onClick={logout}>Logout</button></div></div>
        {isNew && <div className="note">Thank you! Your order AM-{isNew} is confirmed. Pandit ji is preparing your report, it will appear here and on your email.</div>}
        {msg.err && <div className="alert">{msg.err}</div>}{msg.ok && <div className="note">{msg.ok}</div>}
        {!orders ? <p className="muted">Loading…</p> : orders.length === 0 ? (
          <div className="empty"><h3>No reports yet</h3><p className="muted">Choose a service to get your first personalised report.</p><Link href="/services" className="btn">Browse Services</Link></div>
        ) : (
          <div className="orders">
            {orders.map((o) => (
              <div className="ocard" key={o.id}>
                <span className="oc-ic"><ServiceIcon slug={o.service} size={44} /></span>
                <div>
                  <h3>{o.name}</h3>
                  <div className="meta">Order AM-{o.id} · For {o.for} · {o.language === 'hi' ? 'Hindi' : 'English'} · ₹{o.amount} · {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  {o.status === 'preparing' && <div className="prep"><span className="spinner" />Pandit ji is preparing your report{o.release_at && new Date(o.release_at) > Date.now() ? `, expected in about ${left(o.release_at)}` : ', almost ready'}</div>}
                </div>
                <div>
                  {o.status === 'ready' && <button className="btn btn-sm" onClick={() => dl(o)}>Download PDF</button>}
                  {o.status === 'preparing' && <span className="pill preparing">Preparing</span>}
                  {o.status === 'awaiting_payment' && <button className="btn btn-sm" onClick={() => pay(o)}>Complete Payment</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
