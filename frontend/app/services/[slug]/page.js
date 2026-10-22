import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES, findService } from '../../../lib/services';
import OrderForm from '../../../components/OrderForm';
import Banner from '../../../components/Banner';
import { ServiceIcon } from '../../../components/Icons';

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }) {
  const s = findService((await params).slug);
  return s ? { title: `${s.title} Report`, description: `${s.tagline}. ${s.short}` } : {};
}

export default async function ServicePage({ params }) {
  const s = findService((await params).slug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);
  const birth = s.form === 'birth' || s.form === 'match';
  return (
    <>
      <Banner title={s.title} sub={`${s.hindi} · ${s.tagline}`} crumb={<Link href="/services">Services</Link>} icon={<ServiceIcon slug={s.slug} size={64} />} />
      <div className="wrap svc">
        <div className="svc-intro">
          <p className="lead-p">{s.short}</p>
          <div className="box qbox">
            <h3>This report answers questions like</h3>
            <ul className="qlist">{s.questions.map((q) => <li key={q}>{q}</li>)}</ul>
          </div>
        </div>
        <div className="svc-rest">
          <div className="box"><h3>About this report</h3><p style={{ margin: 0 }}>{s.about}</p></div>
          <div className="box"><h3>What you get from it</h3><ul className="ticks grid2">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div className="box"><h3>Inside the report</h3><ul className="ticks grid2">{s.includes.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div className="box">
            <h3>Ordering steps</h3>
            <ol className="olist">
              <li>Fill the form{birth ? ' with the date, exact time and place of birth' : ''} and choose Hindi or English.</li>
              <li>Pay through Razorpay (UPI, card or netbanking).</li>
              <li>Pandit ji prepares your report. You can see its status in My Dashboard.</li>
              <li>Download the PDF from your dashboard. A copy also comes to your email.</li>
            </ol>
          </div>
          <div className="box"><h3>Other reports</h3><ul className="ticks grid2">{others.map((o) => <li key={o.slug}><Link href={`/services/${o.slug}`} style={{ color: 'var(--saf)', fontWeight: 500 }}>{o.title}</Link></li>)}</ul></div>
        </div>
        <OrderForm service={s} />
      </div>
    </>
  );
}
