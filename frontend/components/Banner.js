import Link from 'next/link';

export default function Banner({ title, sub, crumb, icon }) {
  return (
    <section className="pbanner">
      <div className="wrap pbanner-in">
        {icon && <span className="pb-ic">{icon}</span>}
        <div>
          <div className="crumb"><Link href="/">Home</Link>{crumb ? <> / {crumb}</> : null} / {title}</div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
      </div>
    </section>
  );
}
