'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Art';
import { SERVICES } from '../lib/services';
import { getToken } from '../lib/api';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [authed, setAuthed] = useState(false);
  const path = usePathname();
  useEffect(() => { setOpen(false); setDrop(false); setAuthed(!!getToken()); }, [path]);
  if (path.startsWith('/admin')) return null;
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand"><Logo size={42} /><span>Astrology<b>Mitra</b></span></Link>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /><span /></button>
        <nav className={`nav ${open ? 'show' : ''}`}>
          <Link href="/" className={path === '/' ? 'act' : ''}>Home</Link>
          <div className={`dd ${drop ? 'open' : ''}`} onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
            <button className={path.startsWith('/services') ? 'act' : ''} onClick={() => setDrop(!drop)}>All Services ▾</button>
            <div className="dd-menu">
              {SERVICES.map((s) => <Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>)}
              <Link href="/services" className="dd-all">View all services →</Link>
            </div>
          </div>
          <Link href="/about" className={path === '/about' ? 'act' : ''}>About Us</Link>
          <Link href="/contact" className={path === '/contact' ? 'act' : ''}>Contact Us</Link>
          <Link href={authed ? '/dashboard' : '/login'} className="btn btn-sm">{authed ? 'My Dashboard' : 'Login'}</Link>
        </nav>
      </div>
    </header>
  );
}
