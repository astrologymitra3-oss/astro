'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SERVICES, findService } from '../lib/services';
import { useConfig, priceOf } from './useConfig';

const SLIDES = [
  { img: '/img/hero-aarti.jpg', slug: 'vedic-kundli', hi: 'जन्म कुंडली', h: 'Your complete Vedic Kundli, written for your chart alone', p: 'Lagna, Navamsa, dasha periods, yogas and doshas explained in plain Hindi or English, with remedies you can actually follow.' },
  { img: '/img/hero-diya.jpg', slug: 'kundli-milan', hi: 'कुंडली मिलान', h: 'Kundli Milan before the rishta is fixed', p: 'All 36 gunas, Manglik check for both and an honest verdict from Pandit ji.' },
  { img: '/img/hero-havan.jpg', slug: 'dosha-report', hi: 'दोष निवारण', h: 'Manglik, Kaal Sarp, Pitru Dosha and Sade Sati', p: 'Find out which doshas are really present in your chart, with exact Sade Sati dates and the right upay.' },
  { img: '/img/hero-temple.jpg', slug: 'lal-kitab-kundli', hi: 'लाल किताब', h: 'Lal Kitab Kundli with simple, low-cost upay', p: 'Planet-wise results, ancestral rin and remedies that fit into your daily routine.' },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const cfg = useConfig();
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6500); return () => clearInterval(t); }, [i]);
  const s = SLIDES[i], svc = findService(s.slug);
  return (
    <section className="hero">
      {SLIDES.map((x, k) => <div key={x.img} className={`hero-slide ${k === i ? 'on' : ''}`}><img src={x.img} alt="" /></div>)}
      <div className="wrap hero-txt">
        <div className="hi">{s.hi}</div>
        <h1>{s.h}</h1>
        <p>{s.p}</p>
        <div className="hero-cta">
          <Link href={`/services/${s.slug}`} className="btn">Order {svc.title} · ₹{priceOf(cfg, s.slug)}</Link>
          <Link href="/services" className="btn btn-ghost">All services</Link>
        </div>
      </div>
      <div className="hero-nav">
        <button aria-label="Previous" onClick={() => setI((i + SLIDES.length - 1) % SLIDES.length)}>‹</button>
        <button aria-label="Next" onClick={() => setI((i + 1) % SLIDES.length)}>›</button>
      </div>
    </section>
  );
}

export function ServiceCard({ s }) {
  const cfg = useConfig();
  return (
    <Link href={`/services/${s.slug}`} className={`scard ${s.slug === 'vedic-kundli' || s.slug === 'kundli-milan' ? 'wide' : ''}`}>
      <div className="scard-img"><img src={`/img/${s.slug}.jpg`} alt={s.title} loading="lazy" /></div>
      <div className="scard-body">
        <span className="hindi">{s.hindi}</span>
        <h3>{s.title}</h3>
        <p>{s.short}</p>
        <div className="scard-foot"><b>₹{priceOf(cfg, s.slug)}</b><span>Order now</span></div>
      </div>
    </Link>
  );
}

export function ServicesGrid() {
  return <div className="sgrid">{SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>;
}

export function Faq({ items }) {
  return <div className="faq">{items.map(([q, a], k) => <details key={k} open={k === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>;
}
