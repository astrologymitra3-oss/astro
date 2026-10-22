// Line icons for each service. Animated parts use classes defined in globals.css (.a-spin, .a-flick, .a-pulse, .a-shine, .a-draw, .a-float)
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const ICONS = {
  'vedic-kundli': (
    <>
      <rect x="12" y="12" width="40" height="40" {...P} />
      <path className="a-draw" d="M12 12l40 40M52 12L12 52M32 12l20 20-20 20-20-20z" {...P} />
      <circle className="a-pulse" cx="32" cy="32" r="3" fill="currentColor" />
    </>
  ),
  'lal-kitab-kundli': (
    <>
      <path d="M32 18c-6-4-14-4-20-2v32c6-2 14-2 20 2 6-4 14-4 20-2V16c-6-2-14-2-20 2z" {...P} />
      <path d="M32 18v32" {...P} />
      <path className="a-draw" d="M17 25h9M17 31h9M38 25h9M38 31h9M17 37h7M38 37h7" {...P} strokeWidth="1.8" />
    </>
  ),
  varshphal: (
    <>
      <circle cx="32" cy="32" r="9" {...P} />
      <g className="a-spin">{Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45} 32 32)`} d="M32 14v-5" {...P} />)}</g>
      <circle cx="32" cy="32" r="20" {...P} strokeDasharray="3 4" strokeWidth="1.5" />
    </>
  ),
  'numerology-report': (
    <>
      <rect x="12" y="12" width="40" height="40" rx="3" {...P} />
      <path d="M25.3 12v40M38.6 12v40M12 25.3h40M12 38.6h40" {...P} strokeWidth="1.4" />
      <g className="a-pulse" fill="currentColor" fontSize="9" fontFamily="Hind, sans-serif" textAnchor="middle" fontWeight="600">
        <text x="18.6" y="22">4</text><text x="32" y="22">9</text><text x="45.3" y="22">2</text>
        <text x="18.6" y="35.3">3</text><text x="32" y="35.3">5</text><text x="45.3" y="35.3">7</text>
        <text x="18.6" y="48.6">8</text><text x="32" y="48.6">1</text><text x="45.3" y="48.6">6</text>
      </g>
    </>
  ),
  'kundli-milan': (
    <>
      <circle cx="25" cy="34" r="13" {...P} />
      <circle cx="39" cy="34" r="13" {...P} />
      <path className="a-pulse" d="M32 22c-2.5-3.5-8-3-8 1.5 0 4 8 8.5 8 8.5s8-4.5 8-8.5c0-4.5-5.5-5-8-1.5z" fill="currentColor" />
    </>
  ),
  'dosha-report': (
    <>
      <path d="M32 10l18 7v13c0 12-8 20-18 24-10-4-18-12-18-24V17z" {...P} />
      <path className="a-flick" d="M32 26c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="currentColor" />
    </>
  ),
  'gemstone-suggestion': (
    <>
      <path d="M20 18h24l8 10-20 24-20-24z" {...P} />
      <path d="M12 28h40M26 18l-4 10 10 24 10-24-4-10" {...P} strokeWidth="1.6" />
      <path className="a-shine" d="M47 8l1.5 3.5L52 13l-3.5 1.5L47 18l-1.5-3.5L42 13l3.5-1.5z" fill="currentColor" />
    </>
  ),
  'yantra-suggestion': (
    <>
      <rect x="10" y="10" width="44" height="44" {...P} />
      <g className="a-spin-slow">
        <circle cx="32" cy="32" r="16" {...P} strokeWidth="1.6" />
        <path d="M32 18l12 21H20zM32 46L20 25h24z" {...P} strokeWidth="1.6" />
      </g>
      <circle cx="32" cy="32" r="2.2" fill="currentColor" />
    </>
  ),
  'tarot-reading': (
    <>
      <rect x="10" y="16" width="20" height="32" rx="2.5" transform="rotate(-12 20 32)" {...P} />
      <rect x="34" y="16" width="20" height="32" rx="2.5" transform="rotate(12 44 32)" {...P} />
      <g className="a-float">
        <rect x="22" y="12" width="20" height="32" rx="2.5" fill="#fff" {...P} />
        <path d="M32 21l2 4.3 4.6.5-3.4 3.1 1 4.6-4.2-2.4-4.2 2.4 1-4.6-3.4-3.1 4.6-.5z" fill="currentColor" />
      </g>
    </>
  ),
  'kp-kundli': (
    <>
      <circle cx="32" cy="32" r="22" {...P} />
      <g className="a-spin">
        <circle cx="32" cy="32" r="13" {...P} strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30} 32 32)`} d="M32 10v9" {...P} strokeWidth="1.5" />)}
      </g>
      <circle className="a-pulse" cx="32" cy="32" r="3" fill="currentColor" />
    </>
  ),
};

export function ServiceIcon({ slug, size = 56 }) {
  return <svg className="sicon" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">{ICONS[slug] || ICONS['vedic-kundli']}</svg>;
}

// Hero: North Indian kundli that draws itself, with a slowly turning ring of rashi names
const RASHI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];
const PLANETS = [['सू', 150, 112], ['चं', 92, 150], ['मं', 208, 150], ['बु', 150, 190], ['गु', 118, 92], ['शु', 182, 92], ['श', 118, 208], ['रा', 182, 208], ['के', 150, 150]];
export function HeroChart() {
  return (
    <svg viewBox="0 0 300 300" className="hero-chart" aria-hidden="true">
      <g className="ring">
        <circle cx="150" cy="150" r="140" fill="none" stroke="#e6cfa8" strokeWidth="1" />
        <circle cx="150" cy="150" r="118" fill="none" stroke="#e6cfa8" strokeWidth="1" />
        {RASHI.map((r, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          return (
            <g key={r}>
              <path d={`M${150 + 118 * Math.cos(a - 0.26)} ${150 + 118 * Math.sin(a - 0.26)}L${150 + 140 * Math.cos(a - 0.26)} ${150 + 140 * Math.sin(a - 0.26)}`} stroke="#e6cfa8" />
              <text x={150 + 129 * Math.cos(a)} y={150 + 129 * Math.sin(a) + 4} textAnchor="middle" fontSize="10.5" fill="#a0521f" fontFamily="'Noto Sans Devanagari',Hind,sans-serif">{r}</text>
            </g>
          );
        })}
      </g>
      <g fill="none" stroke="#7a1d1d" strokeWidth="2" className="kchart">
        <rect x="70" y="70" width="160" height="160" fill="#fffaf2" />
        <path d="M70 70L230 230M230 70L70 230M150 70L230 150L150 230L70 150Z" />
      </g>
      {PLANETS.map(([t, x, y], i) => (
        <text key={t} x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill="#d4651a" className="pl" style={{ animationDelay: `${1.6 + i * 0.15}s` }} fontFamily="'Noto Sans Devanagari',Hind,sans-serif">{t}</text>
      ))}
    </svg>
  );
}

const SMALL = {
  calc: <path d="M5 4h14v16H5zM8 8h8M8 12h2M12 12h2M8 16h2M12 16h4" />,
  pen: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
  mail: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  lock: <path d="M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3" />,
  lang: <path d="M3 5h10M8 3v2M5 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5" />,
  doc: <path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" />,
};
export function MiniIcon({ name, size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SMALL[name]}</svg>;
}
