import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES, findService } from '../../../lib/services';
import { ServiceArt } from '../../../components/Art';
import OrderForm from '../../../components/OrderForm';

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));
export function generateMetadata({ params }) {
  const s = findService(params.slug);
  return s ? { title: `${s.title} Report`, description: `${s.tagline}. ${s.short}` } : {};
}

export default function ServicePage({ params }) {
  const s = findService(params.slug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);
  return (
    <>
      <section className="pbanner"><div className="wrap"><div className="crumb"><Link href="/">Home</Link> / <Link href="/services">Services</Link> / {s.title}</div><h1>{s.title}</h1><p>{s.tagline}</p></div></section>
      <div className="wrap svc">
        <div>
          <div className="svc-top">
            <ServiceArt slug={s.slug} />
            <div><span className="hindi">{s.hindi}</span><h2 style={{ marginTop: 4 }}>{s.title}</h2><p className="muted" style={{ margin: 0 }}>{s.short}</p><a href="#order" className="btn btn-sm jump">Get this report →</a></div>
          </div>
          <div className="box"><h3>About this report</h3><p style={{ margin: 0 }}>{s.about}</p></div>
          <div className="box"><h3>Benefits</h3><ul className="ticks grid2">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div className="box"><h3>What your report includes</h3><ul className="ticks grid2">{s.includes.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div className="box">
            <h3>How it works</h3>
            <ul className="ticks">
              <li>Fill in the details in the form{s.form === 'birth' || s.form === 'match' ? ' — date, exact time and place of birth' : ''} and choose Hindi or English.</li>
              <li>Pay securely through Razorpay.</li>
              <li>Pandit ji prepares your personalised 10-15 page report.</li>
              <li>Download it from your dashboard — a copy is also sent to your email.</li>
            </ul>
          </div>
          <div className="box"><h3>You may also like</h3><ul className="ticks grid2">{others.map((o) => <li key={o.slug}><Link href={`/services/${o.slug}`} style={{ color: 'var(--saf)', fontWeight: 500 }}>{o.title}</Link></li>)}</ul></div>
        </div>
        <OrderForm service={s} />
      </div>
    </>
  );
}
