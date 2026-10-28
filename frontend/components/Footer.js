'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brand, Icon } from './Art';
import { SERVICES, localize } from '../lib/services';
import { useConfig } from './useConfig';
import { useLang, useT } from './Lang';

export default function Footer() {
  const path = usePathname();
  const c = useConfig().contact;
  const { lang } = useLang();
  const t = useT();
  if (path.startsWith('/admin')) return null;
  const link = (s) => <Link key={s.slug} href={`/services/${s.slug}`}>{localize(s, lang).title}</Link>;
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div>
          <Link href="/"><Brand /></Link>
          <p>{t('Kundli, Lal Kitab, KP, numerology and tarot reports prepared by Pandit ji from your exact birth details. Available in Hindi and English.', 'आपके सही जन्म विवरण से पंडित जी द्वारा तैयार कुंडली, लाल किताब, KP, अंक ज्योतिष और टैरो रिपोर्ट। हिन्दी और English दोनों में।')}</p>
        </div>
        <div><h4>{t('Services', 'सेवाएँ')}</h4>{SERVICES.slice(0, 5).map(link)}</div>
        <div><h4>{t('More Services', 'और सेवाएँ')}</h4>{SERVICES.slice(5).map(link)}</div>
        <div>
          <h4>{t('Information', 'जानकारी')}</h4>
          <Link href="/about">{t('About Us', 'हमारे बारे में')}</Link><Link href="/contact">{t('Contact Us', 'संपर्क करें')}</Link>
          <Link href="/policies/privacy-policy">{t('Privacy Policy', 'प्राइवेसी पॉलिसी')}</Link><Link href="/policies/terms-and-conditions">{t('Terms & Conditions', 'नियम और शर्तें')}</Link>
          <Link href="/policies/refund-policy">{t('Refund & Cancellation', 'रिफंड और कैंसलेशन')}</Link><Link href="/policies/shipping-and-delivery">{t('Delivery Policy', 'डिलीवरी पॉलिसी')}</Link><Link href="/policies/disclaimer">{t('Disclaimer', 'अस्वीकरण')}</Link>
        </div>
        <div>
          <h4>{t('Contact', 'संपर्क')}</h4>
          <a href={`mailto:${c.email}`} className="ic"><Icon name="mail" size={17} />{c.email}</a>
          {c.phone && <a href={`tel:${c.phone}`} className="ic"><Icon name="phone" size={17} />{c.phone}</a>}
          <span className="ic"><Icon name="pin" size={17} />{c.address}</span>
        </div>
      </div>
      <div className="wrap ftr-bot"><span>© {new Date().getFullYear()} AstrologyMitra, New Delhi. {t('All rights reserved.', 'सर्वाधिकार सुरक्षित।')}</span><span>{t('Payments secured by Razorpay', 'Razorpay से सुरक्षित पेमेंट')}</span></div>
    </footer>
  );
}
