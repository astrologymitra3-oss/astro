'use client';
import { useState } from 'react';
import { Icon } from '../../components/Art';
import { useConfig } from '../../components/useConfig';
import { api } from '../../lib/api';
import { useT } from '../../components/Lang';

export default function Contact() {
  const c = useConfig().contact;
  const t = useT();
  const [f, setF] = useState({});
  const [st, setSt] = useState({});
  const u = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = async (e) => {
    e.preventDefault(); setSt({ busy: true });
    try { await api('/api/contact', { method: 'POST', body: f, auth: null }); setSt({ ok: t('Thank you! Your message has been received. We will reply on your email shortly.', 'धन्यवाद! आपका संदेश मिल गया है। हम जल्द ही आपके ईमेल पर जवाब देंगे।') }); setF({}); }
    catch (ex) { setSt({ err: ex.message }); }
  };
  const wa = (c.whatsapp || '').replace(/\D/g, '');
  return (
    <>
      <section className="pbanner" style={{ backgroundImage: 'url(/img/aarti.jpg)' }}><div className="wrap"><div className="crumb">{t('Home / Contact Us', 'होम / संपर्क करें')}</div><h1>{t('Contact Us', 'संपर्क करें')}</h1><p>{t('Questions about a report or an order? Write to us.', 'रिपोर्ट या ऑर्डर के बारे में कोई सवाल? हमें लिखिए।')}</p></div></section>
      <div className="wrap cgrid">
        <div className="cinfo">
          <a href={`mailto:${c.email}`}><span className="ti"><Icon name="mail" /></span><span><small>{t('Email', 'ईमेल')}</small>{c.email}</span></a>
          {c.phone && <a href={`tel:${c.phone}`}><span className="ti"><Icon name="phone" /></span><span><small>{t('Phone', 'फ़ोन')}</small>{c.phone}</span></a>}
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><span className="ti"><Icon name="phone" /></span><span><small>WhatsApp</small>+{wa}</span></a>}
          <div><span className="ti"><Icon name="pin" /></span><span><small>{t('Address', 'पता')}</small>{c.address}</span></div>
          <div><span className="ti"><Icon name="clock" /></span><span><small>{t('Order related queries', 'ऑर्डर से जुड़े सवाल')}</small>{t('Please mention your order number (for example AM-25) so we can check it quickly.', 'अपना ऑर्डर नंबर (जैसे AM-25) ज़रूर लिखें ताकि हम जल्दी देख सकें।')}</span></div>
        </div>
        <form className="box" onSubmit={send} style={{ margin: 0 }}>
          <h3>{t('Send us a message', 'हमें संदेश भेजें')}</h3>
          <div className="row2"><label>{t('Name', 'नाम')}<input required value={f.name || ''} onChange={u('name')} /></label><label>{t('Phone', 'फ़ोन')}<input value={f.phone || ''} onChange={u('phone')} /></label></div>
          <label>{t('Email', 'ईमेल')}<input required type="email" value={f.email || ''} onChange={u('email')} /></label>
          <label>{t('Message', 'संदेश')}<textarea required rows={5} value={f.message || ''} onChange={u('message')} /></label>
          {st.err && <div className="alert">{st.err}</div>}{st.ok && <div className="note">{st.ok}</div>}
          <button className="btn" disabled={st.busy}>{st.busy ? t('Sending…', 'भेज रहे हैं…') : t('Send Message', 'संदेश भेजें')}</button>
        </form>
      </div>
    </>
  );
}
