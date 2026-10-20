'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brand, Icon } from './Art';
import { SERVICES } from '../lib/services';
import { useConfig } from './useConfig';

export default function Footer() {
  const path = usePathname();
  const c = useConfig().contact;
  if (path.startsWith('/admin')) return null;
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div>
          <Link href="/"><Brand /></Link>
          <p>Kundli, Lal Kitab, KP, numerology and tarot reports prepared by Pandit ji from your exact birth details. Available in Hindi and English.</p>
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
          <h4>Information</h4>
          <Link href="/about">About Us</Link><Link href="/contact">Contact Us</Link>
          <Link href="/policies/privacy-policy">Privacy Policy</Link><Link href="/policies/terms-and-conditions">Terms & Conditions</Link>
          <Link href="/policies/refund-policy">Refund & Cancellation</Link><Link href="/policies/shipping-and-delivery">Delivery Policy</Link><Link href="/policies/disclaimer">Disclaimer</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${c.email}`} className="ic"><Icon name="mail" size={17} />{c.email}</a>
          {c.phone && <a href={`tel:${c.phone}`} className="ic"><Icon name="phone" size={17} />{c.phone}</a>}
          <span className="ic"><Icon name="pin" size={17} />{c.address}</span>        </div>
      </div>
      <div className="wrap ftr-bot"><span>© {new Date().getFullYear()} AstrologyMitra, New Delhi. All rights reserved.</span><span>Payments secured by Razorpay</span></div>
    </footer>
  );
}
