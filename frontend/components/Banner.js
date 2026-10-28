import Link from 'next/link';
import { T } from './Lang';

// Page banner over a darkened temple/aarti photo. title/sub may be strings or <T/> elements.
export default function Banner({ title, sub, crumb, icon, img = '/img/aarti.jpg' }) {
  return (
    <section className="pbanner" style={{ backgroundImage: `url(${img})` }}>
      <div className="wrap pbanner-in">
        {icon && <span className="pb-ic">{icon}</span>}
        <div>
          <div className="crumb"><Link href="/"><T en="Home" hi="होम" /></Link>{crumb ? <> / {crumb}</> : null} / {title}</div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
      </div>
    </section>
  );
}
