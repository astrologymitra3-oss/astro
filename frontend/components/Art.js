// Logo and per-service SVG artwork (self-made, no external images)
export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb347" /><stop offset="1" stopColor="#ee7d14" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#1b1440" stroke="url(#lg)" strokeWidth="2.5" />
      <path d="M38 14a18 18 0 1 0 12 30A15 15 0 0 1 38 14z" fill="url(#lg)" />
      <path d="M27 20l2.2 5.2 5.6.4-4.3 3.6 1.4 5.4L27 31.7l-4.9 2.9 1.4-5.4-4.3-3.6 5.6-.4z" fill="#fff4e0" />
      <circle cx="20" cy="42" r="1.6" fill="#fff4e0" /><circle cx="44" cy="22" r="1.2" fill="#fff4e0" />
    </svg>
  );
}

const G = ({ children }) => (
  <svg viewBox="0 0 200 200" className="art" aria-hidden="true">
    <defs>
      <radialGradient id="bgg" cx="50%" cy="40%" r="65%"><stop offset="0" stopColor="#3a2a7a" /><stop offset="1" stopColor="#140f33" /></radialGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd27a" /><stop offset="1" stopColor="#ee7d14" /></linearGradient>
    </defs>
    <circle cx="100" cy="100" r="96" fill="url(#bgg)" />
    <circle cx="100" cy="100" r="88" fill="none" stroke="url(#gold)" strokeWidth="1" strokeDasharray="2 5" opacity=".8" />
    {[[40, 45], [160, 50], [150, 160], [45, 150], [100, 22], [175, 105], [25, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 1.4 : 2} fill="#fff4e0" opacity=".85" />)}
    <g fill="none" stroke="url(#gold)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">{children}</g>
  </svg>
);

const ARTS = {
  'vedic-kundli': <><rect x="55" y="55" width="90" height="90" /><path d="M55 55l90 90M145 55l-90 90M100 55l45 45-45 45-45-45z" /><circle cx="100" cy="100" r="6" fill="#ffd27a" /></>,
  'lal-kitab-kundli': <><path d="M100 62c-15-10-35-10-48-6v76c13-4 33-4 48 6 15-10 35-10 48-6V56c-13-4-33-4-48 6z" /><path d="M100 62v76" /><path d="M66 80h22M66 94h22M112 80h22M112 94h22M66 108h18M112 108h18" strokeWidth="2" /></>,
  varshphal: <><circle cx="100" cy="100" r="22" /><path d="M100 60v-12M100 152v-12M60 100H48M152 100h-12M72 72l-8-8M136 136l-8-8M128 72l8-8M64 136l8-8" /><circle cx="100" cy="100" r="48" strokeWidth="1.5" strokeDasharray="4 4" /></>,
  'numerology-report': <><rect x="58" y="58" width="84" height="84" rx="6" /><path d="M86 58v84M114 58v84M58 86h84M58 114h84" strokeWidth="1.5" /><g fill="#ffd27a" stroke="none" fontSize="18" fontFamily="serif" textAnchor="middle"><text x="72" y="78">4</text><text x="100" y="78">9</text><text x="128" y="78">2</text><text x="72" y="106">3</text><text x="100" y="106">5</text><text x="128" y="106">7</text><text x="72" y="134">8</text><text x="100" y="134">1</text><text x="128" y="134">6</text></g></>,
  'kundli-milan': <><circle cx="82" cy="100" r="28" /><circle cx="118" cy="100" r="28" /><path d="M100 80c-6-8-18-6-18 4 0 8 18 18 18 18s18-10 18-18c0-10-12-12-18-4z" fill="#ffd27a" stroke="none" /></>,
  'dosha-report': <><path d="M100 52l38 14v30c0 26-17 44-38 52-21-8-38-26-38-52V66z" /><path d="M82 92c6-10 14-10 18 0s12 10 18 0M82 112c6-10 14-10 18 0s12 10 18 0" strokeWidth="2.5" /></>,
  'gemstone-suggestion': <><path d="M70 72h60l18 22-48 54-48-54z" /><path d="M52 94h96M85 72l-10 22 25 54 25-54-10-22" strokeWidth="2" /></>,
  'yantra-suggestion': <><rect x="54" y="54" width="92" height="92" /><circle cx="100" cy="100" r="38" strokeWidth="2" /><path d="M100 70l26 45H74zM100 130L74 85h52z" strokeWidth="2" /><circle cx="100" cy="100" r="4" fill="#ffd27a" /></>,
  'tarot-reading': <><rect x="60" y="64" width="40" height="64" rx="5" transform="rotate(-14 80 96)" /><rect x="80" y="58" width="40" height="64" rx="5" fill="#241a55" /><rect x="100" y="64" width="40" height="64" rx="5" transform="rotate(14 120 96)" /><path d="M100 76l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#ffd27a" stroke="none" /></>,
  'kp-kundli': <><circle cx="100" cy="100" r="50" /><circle cx="100" cy="100" r="30" strokeWidth="1.5" />{Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return <path key={i} d={`M${100 + 30 * Math.cos(a)} ${100 + 30 * Math.sin(a)}L${100 + 50 * Math.cos(a)} ${100 + 50 * Math.sin(a)}`} strokeWidth="1.5" />; })}<path d="M100 84l4 10 10 2-8 6 3 10-9-6-9 6 3-10-8-6 10-2z" fill="#ffd27a" stroke="none" /></>,
};

export function ServiceArt({ slug }) {
  return <G>{ARTS[slug] || ARTS['vedic-kundli']}</G>;
}

const ICONS = {
  calc: <path d="M4 4h16v16H4zM8 8h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h4" />,
  lang: <path d="M3 5h10M8 3v2M5 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5" />,
  lock: <path d="M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3M12 15v2" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6" />,
  doc: <path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" />,
  pay: <path d="M3 6h18v12H3zM3 10h18M7 15h3" />,
  form: <path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />,
  mail: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  pin: <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  phone: <path d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  star: <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L3.3 9.2l6.1-.6z" />,
};
export function Icon({ name, size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>;
}
