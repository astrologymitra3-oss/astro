'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('am_lang'); } catch {}
    if (saved === 'hi' || saved === 'en') setLang(saved);
    else if ((navigator.language || '').toLowerCase().startsWith('hi')) setLang('hi');
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('am_lang', lang); } catch {}
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
// t('English text', 'हिन्दी टेक्स्ट')
export const useT = () => { const { lang } = useLang(); return (en, hi) => (lang === 'hi' && hi != null ? hi : en); };
export function T({ en, hi }) { return useT()(en, hi); }

export function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-sw ${className}`} role="group" aria-label="Language">
      <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
      <button type="button" className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')}>हिन्दी</button>
    </div>
  );
}
