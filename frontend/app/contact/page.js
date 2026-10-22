'use client';
import { useState } from 'react';
import { Icon } from '../../components/Art';
import { useConfig } from '../../components/useConfig';
import { api } from '../../lib/api';

export default function Contact() {
  const c = useConfig().contact;
  const [f, setF] = useState({});
  const [st, setSt] = useState({});
  const u = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = async (e) => {
    e.preventDefault(); setSt({ busy: true });
    try { await api('/api/contact', { method: 'POST', body: f, auth: null }); setSt({ ok: 'Thank you! Your message has been received. We will reply on your email shortly.' }); setF({}); }
    catch (ex) { setSt({ err: ex.message }); }
  };
  const wa = (c.whatsapp || '').replace(/\D/g, '');
  return (
    <>
      <section className="pbanner"><div className="wrap"><div className="crumb">Home / Contact Us</div><h1>Contact Us</h1><p>Questions about a report or an order? Write to us.</p></div></section>
      <div className="wrap cgrid">
        <div className="cinfo">
          <a href={`mailto:${c.email}`}><span className="ti"><Icon name="mail" /></span><span><small>Email</small>{c.email}</span></a>
          {c.phone && <a href={`tel:${c.phone}`}><span className="ti"><Icon name="phone" /></span><span><small>Phone</small>{c.phone}</span></a>}
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><span className="ti"><Icon name="phone" /></span><span><small>WhatsApp</small>+{wa}</span></a>}
          <div><span className="ti"><Icon name="pin" /></span><span><small>Address</small>{c.address}</span></div>
          <div><span className="ti"><Icon name="clock" /></span><span><small>Order related queries</small>Please mention your order number (for example AM-25) so we can check it quickly.</span></div>
        </div>
        <form className="box" onSubmit={send} style={{ margin: 0 }}>
          <h3>Send us a message</h3>
          <div className="row2"><label>Name<input required value={f.name || ''} onChange={u('name')} /></label><label>Phone<input value={f.phone || ''} onChange={u('phone')} /></label></div>
          <label>Email<input required type="email" value={f.email || ''} onChange={u('email')} /></label>
          <label>Message<textarea required rows={5} value={f.message || ''} onChange={u('message')} /></label>
          {st.err && <div className="alert">{st.err}</div>}{st.ok && <div className="note">{st.ok}</div>}
          <button className="btn" disabled={st.busy}>{st.busy ? 'Sending…' : 'Send Message'}</button>
        </form>
      </div>
    </>
  );
}
