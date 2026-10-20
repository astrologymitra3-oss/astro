'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, Icon } from './Art';
import { SERVICES } from '../lib/services';
import { useConfig } from './useConfig';

export default function Footer() {
  const path = usePathname();
  const cfg = useConfig();
  if (path.startsWith('/admin')) return null;
  const c = cfg.contact;
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div>
          <Link href="/" className="brand light"><Logo size={40} /><span>Astrology<b>Mitra</b></span></Link>
          <p className="muted">Personalised Vedic astrology, Lal Kitab, KP, numerology and tarot reports in Hindi and English — calculated precisely and prepared by Pandit ji for you.</p>
        </div>
        <div>
          <h4>Services</h4>
          {SERVICES.slice(0, 5).map((s) => <Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>)}
        </div>
        <div>
          <h4>More Services</h4>
          {SERVICES.slice(5).map((s) => <Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>)}
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about">About Us</Link><Link href="/contact">Contact Us</Link>
          <Link href="/policies/privacy-policy">Privacy Policy</Link><Link href="/policies/terms-and-conditions">Terms & Conditions</Link>
          <Link href="/policies/refund-policy">Refund & Cancellation</Link><Link href="/policies/shipping-and-delivery">Delivery Policy</Link><Link href="/policies/disclaimer">Disclaimer</Link>
        </div>
        <div>
          <h4>Reach Us</h4>
          <a href={`mailto:${c.email}`} className="ic"><Icon name="mail" size={18} />{c.email}</a>
          {c.phone && <a href={`tel:${c.phone}`} className="ic"><Icon name="phone" size={18} />{c.phone}</a>}
          <span className="ic"><Icon name="pin" size={18} />{c.address}</span>
        </div>
      </div>
      <div className="wrap ftr-bot">© {new Date().getFullYear()} AstrologyMitra · astrologymitra.com · All rights reserved. <span>Secure payments by Razorpay</span></div>
    </footer>
  );
}
