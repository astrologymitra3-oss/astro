import Link from 'next/link';

export default function Banner({ title, sub, crumb, img = '/img/temple.jpg' }) {
  return (
    <section className="pbanner" style={{ backgroundImage: `url(${img})` }}>
      <div className="wrap">
        <div className="crumb"><Link href="/">Home</Link>{crumb ? <> / {crumb}</> : null} / {title}</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  );
}
