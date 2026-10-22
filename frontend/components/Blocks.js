'use client';
import Link from 'next/link';
import { SERVICES } from '../lib/services';
import { useConfig, priceOf } from './useConfig';
import { ServiceIcon, HeroChart } from './Icons';

export function Hero() {
  const cfg = useConfig();
  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-txt">
          <div className="hi">॥ श्री गणेशाय नमः ॥</div>
          <h1>Stop guessing. Read what your kundli actually says.</h1>
          <p>Career stuck, shaadi getting delayed, money not staying, or just want to know what the next few years hold? Get a detailed report prepared by Pandit ji from your exact birth time and place, in Hindi or English.</p>
          <div className="hero-cta">
            <Link href="/services/vedic-kundli" className="btn">Get My Kundli · ₹{priceOf(cfg, 'vedic-kundli')}</Link>
            <Link href="#services" className="btn btn-line">See all 10 reports</Link>
          </div>
          <ul className="hero-ticks">
            <li>10-15 page PDF</li><li>हिन्दी या English</li><li>Remedies included</li>
          </ul>
        </div>
        <div className="hero-art"><HeroChart /></div>
      </div>
    </section>
  );
}

export function ServiceCard({ s }) {
  const cfg = useConfig();
  return (
    <Link href={`/services/${s.slug}`} className={`scard ${s.slug === 'vedic-kundli' ? 'feat' : ''}`}>
      <div className="scard-top"><span className="scard-ic"><ServiceIcon slug={s.slug} /></span><span className="hindi">{s.hindi}</span></div>
      {s.slug === 'vedic-kundli' && <span className="feat-tag">Start here if you are not sure</span>}
      <h3>{s.title}</h3>
      <p className="scard-tag">{s.tagline}</p>
      <ul className="scard-pts">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <div className="scard-foot"><b>₹{priceOf(cfg, s.slug)}</b><span className="btn btn-sm">Order now</span></div>
    </Link>
  );
}

export function ServicesGrid() {
  return <div className="sgrid">{SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>;
}

export function Faq({ items }) {
  return <div className="faq">{items.map(([q, a], k) => <details key={k} open={k === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>;
}
