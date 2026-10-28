'use client';
import { useLang } from './Lang';

// en / hi: [title, [[heading, text], ...]]
export default function PolicyView({ en, hi, updated }) {
  const { lang } = useLang();
  const p = lang === 'hi' && hi ? hi : en;
  return (
    <>
      <section className="pbanner" style={{ backgroundImage: 'url(/img/temple.jpg)' }}><div className="wrap"><div className="crumb">{lang === 'hi' ? 'होम' : 'Home'} / {p[0]}</div><h1>{p[0]}</h1><p>{lang === 'hi' ? `अंतिम अपडेट: ${updated.replace('October', 'अक्टूबर')}` : `Last updated: ${updated}`}</p></div></section>
      <div className="prose">{p[1].map(([h, t]) => <div key={h}><h2>{h}</h2><p>{t}</p></div>)}</div>
    </>
  );
}
