'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Brand } from './Art';
import { SERVICES, localize } from '../lib/services';
import { getToken } from '../lib/api';
import { useConfig } from './useConfig';
import { useLang, useT, LangSwitch } from './Lang';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [authed, setAuthed] = useState(false);
  const path = usePathname();
  const c = useConfig().contact;
  const { lang } = useLang();
  const t = useT();
  useEffect(() => { setOpen(false); setDrop(false); setAuthed(!!getToken()); }, [path]);
  if (path.startsWith('/admin')) return null;
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>{t('Reports in Hindi & English · PDF delivered to your email', 'हिन्दी और English में रिपोर्ट · PDF आपके ईमेल पर')}</span>
          <span className="tb-r"><a href={`mailto:${c.email}`}>{c.email}</a>{c.phone && <span><a href={`tel:${c.phone}`}>{c.phone}</a></span>}</span>
        </div>
      </div>
      <header className="hdr">
        <div className="wrap hdr-in">
          <Link href="/"><Brand /></Link>
          <div className="hdr-r">
            <LangSwitch className="ls-mobile" />
            <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /><span /></button>
          </div>
          <nav className={`nav ${open ? 'show' : ''}`}>
            <Link href="/" className={path === '/' ? 'act' : ''}>{t('Home', 'होम')}</Link>
            <div className={`dd ${drop ? 'open' : ''}`} onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
              <button className={path.startsWith('/services') ? 'act' : ''} onClick={() => setDrop(!drop)}>{t('All Services', 'सभी सेवाएँ')} ▾</button>
              <div className="dd-menu">
                {SERVICES.map((s) => <Link key={s.slug} href={`/services/${s.slug}`}>{localize(s, lang).title}</Link>)}
                <Link href="/services" className="dd-all">{t('View all services', 'सभी सेवाएँ देखें')}</Link>
              </div>
            </div>
            <Link href="/about" className={path === '/about' ? 'act' : ''}>{t('About Us', 'हमारे बारे में')}</Link>
            <Link href="/contact" className={path === '/contact' ? 'act' : ''}>{t('Contact Us', 'संपर्क करें')}</Link>
            <LangSwitch className="ls-desk" />
            <Link href={authed ? '/dashboard' : '/login'} className="btn btn-sm">{authed ? t('My Dashboard', 'मेरा डैशबोर्ड') : t('Login', 'लॉगिन')}</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
