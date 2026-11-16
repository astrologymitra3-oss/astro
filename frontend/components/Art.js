// Logo mark and small line icons
export function Logo({ size = 46 }) {
  return <img src="/logo.png" width={size} height={size} alt="AstrologyMitra" style={{ display: 'block', objectFit: 'contain' }} />;
}

export function Brand({ sub = 'ज्योतिष · लाल किताब · अंक शास्त्र' }) {
  return (
    <span className="brand">
      <Logo size={60} />
      <span className="brand-t"><b>Astrology<i>Mitra</i></b><small>{sub}</small></span>
    </span>
  );
}

const ICONS = {
  mail: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  pin: <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  phone: <path d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />,
};
export function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>;
}
