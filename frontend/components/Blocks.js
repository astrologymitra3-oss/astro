'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ServiceArt } from './Art';
import { SERVICES } from '../lib/services';
import { useConfig, priceOf } from './useConfig';

export function HeroSlider() {
  const [i, setI] = useState(0);
  const cfg = useConfig();
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % SERVICES.length), 5000); return () => clearInterval(t); }, []);
  const s = SERVICES[i];
  return (
    <section className="hero">
      <div className="stars" />
      <div className="wrap hero-in">
        <div className="hero-txt" key={s.slug}>
          <span className="eyebrow">{s.hindi}</span>
          <h1>{s.title}</h1>
          <p className="lead">{s.tagline}. {s.short}</p>
          <div className="hero-cta">
            <Link href={`/services/${s.slug}`} className="btn">Get Your Report · ₹{priceOf(cfg, s.slug)}</Link>
            <Link href="/services" className="btn btn-ghost">Explore all services</Link>
          </div>
          <div className="dots">{SERVICES.map((x, k) => <button key={x.slug} aria-label={x.title} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
        </div>
        <div className="hero-art fade" key={s.slug + 'a'}><ServiceArt slug={s.slug} /></div>
      </div>
      <div className="marquee"><div className="mq-track">{[...SERVICES, ...SERVICES].map((x, k) => <Link key={k} href={`/services/${x.slug}`}>✦ {x.title}</Link>)}</div></div>
    </section>
  );
}

export function ServiceCard({ s }) {
  const cfg = useConfig();
  return (
    <Link href={`/services/${s.slug}`} className="scard">
      <div className="scard-art"><ServiceArt slug={s.slug} /></div>
      <div className="scard-body">
        <span className="hindi">{s.hindi}</span>
        <h3>{s.title}</h3>
        <p>{s.short}</p>
        <div className="scard-foot"><b>₹{priceOf(cfg, s.slug)}</b><span>View details →</span></div>
      </div>
    </Link>
  );
}

export function ServicesGrid() {
  return <div className="sgrid">{SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>;
}

export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map(([q, a], k) => (
        <div key={k} className={`faq-i ${open === k ? 'open' : ''}`}>
          <button onClick={() => setOpen(open === k ? -1 : k)}>{q}<span>{open === k ? '−' : '+'}</span></button>
          {open === k && <p>{a}</p>}
        </div>
      ))}
    </div>
  );
}
