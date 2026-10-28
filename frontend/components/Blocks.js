'use client';
import Link from 'next/link';
import { SERVICES, localize } from '../lib/services';
import { useConfig, priceOf } from './useConfig';
import { ServiceIcon, HeroChart } from './Icons';
import { useLang, useT } from './Lang';

export function Hero() {
  const cfg = useConfig();
  const t = useT();
  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-txt">
          <div className="hi">॥ श्री गणेशाय नमः ॥</div>
          <h1>{t('Stop guessing. Read what your kundli actually says.', 'अंदाज़े छोड़िए। पढ़िए आपकी कुंडली सच में क्या कहती है।')}</h1>
          <p>{t('Career stuck, shaadi getting delayed, money not staying, or just want to know what the next few years hold? Get a detailed report prepared by Pandit ji from your exact birth time and place, in Hindi or English.',
            'करियर रुका है, शादी में देरी हो रही है, पैसा टिकता नहीं, या बस जानना है कि आने वाले साल कैसे होंगे? आपके सही जन्म समय और स्थान से पंडित जी द्वारा तैयार विस्तृत रिपोर्ट पाइए, हिन्दी या English में।')}</p>
          <div className="hero-cta">
            <Link href="/services/vedic-kundli" className="btn">{t('Get My Kundli', 'मेरी कुंडली बनवाएँ')} · ₹{priceOf(cfg, 'vedic-kundli')}</Link>
            <Link href="#services" className="btn btn-line">{t('See all 10 reports', 'सभी 10 रिपोर्ट देखें')}</Link>
          </div>
          <ul className="hero-ticks">
            <li>{t('10-15 page PDF', '10-15 पेज की PDF')}</li><li>{t('Hindi or English', 'हिन्दी या English')}</li><li>{t('Remedies included', 'उपाय शामिल')}</li>
          </ul>
        </div>
        <div className="hero-art">
          <div className="arch"><img src="/img/temple.jpg" alt={t('Temple at dusk', 'संध्या के समय मंदिर')} /></div>
          <div className="chart-badge"><HeroChart /></div>
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ s: base }) {
  const cfg = useConfig();
  const { lang } = useLang();
  const t = useT();
  const s = localize(base, lang);
  return (
    <Link href={`/services/${s.slug}`} className={`scard ${s.slug === 'vedic-kundli' ? 'feat' : ''}`}>
      <div className="scard-top"><span className="scard-ic"><ServiceIcon slug={s.slug} /></span><span className="hindi">{s.alt}</span></div>
      {s.slug === 'vedic-kundli' && <span className="feat-tag">{t('Start here if you are not sure', 'समझ न आए तो यहीं से शुरू करें')}</span>}
      <h3>{s.title}</h3>
      <p className="scard-tag">{s.tagline}</p>
      <ul className="scard-pts">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <div className="scard-foot"><b>₹{priceOf(cfg, s.slug)}</b><span className="btn btn-sm">{t('Order now', 'अभी ऑर्डर करें')}</span></div>
    </Link>
  );
}

export function ServicesGrid() {
  return <div className="sgrid">{SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>;
}

export function Faq({ items }) {
  return <div className="faq">{items.map(([q, a], k) => <details key={k} open={k === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>;
}
