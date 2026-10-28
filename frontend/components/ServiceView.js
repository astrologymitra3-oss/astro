'use client';
import Link from 'next/link';
import { SERVICES, findService, localize } from '../lib/services';
import OrderForm from './OrderForm';
import Banner from './Banner';
import { ServiceIcon } from './Icons';
import { useLang, useT } from './Lang';

export default function ServiceView({ slug }) {
  const { lang } = useLang();
  const t = useT();
  const base = findService(slug);
  const s = localize(base, lang);
  const others = SERVICES.filter((x) => x.slug !== slug).slice(0, 4).map((o) => localize(o, lang));
  const birth = s.form === 'birth' || s.form === 'match';
  return (
    <>
      <Banner title={s.title} sub={`${s.alt} · ${s.tagline}`} crumb={<Link href="/services">{t('Services', 'सेवाएँ')}</Link>} icon={<ServiceIcon slug={slug} size={64} />} />
      <div className="wrap svc">
        <div className="svc-intro">
          <p className="lead-p">{s.short}</p>
          <div className="box qbox">
            <h3>{t('This report answers questions like', 'यह रिपोर्ट ऐसे सवालों के जवाब देती है')}</h3>
            <ul className="qlist">{s.questions.map((q) => <li key={q}>{q}</li>)}</ul>
          </div>
        </div>
        <div className="svc-rest">
          <div className="box"><h3>{t('About this report', 'इस रिपोर्ट के बारे में')}</h3><p style={{ margin: 0 }}>{s.about}</p></div>
          <div className="box"><h3>{t('What you get from it', 'आपको इससे क्या मिलेगा')}</h3><ul className="ticks grid2">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div className="box"><h3>{t('Inside the report', 'रिपोर्ट में क्या-क्या है')}</h3><ul className="ticks grid2">{s.includes.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div className="box">
            <h3>{t('Ordering steps', 'ऑर्डर कैसे करें')}</h3>
            <ol className="olist">
              <li>{birth ? t('Fill the form with the date, exact time and place of birth, and choose Hindi or English.', 'फ़ॉर्म में जन्म तारीख, सही समय और जन्म स्थान भरें, और हिन्दी या English चुनें।') : t('Fill the form and choose Hindi or English.', 'फ़ॉर्म भरें और हिन्दी या English चुनें।')}</li>
              <li>{t('Pay through Razorpay (UPI, card or netbanking).', 'Razorpay से पेमेंट करें (UPI, कार्ड या नेटबैंकिंग)।')}</li>
              <li>{t('Pandit ji prepares your report. You can see its status in My Dashboard.', 'पंडित जी आपकी रिपोर्ट तैयार करते हैं। इसकी स्थिति आप मेरा डैशबोर्ड में देख सकते हैं।')}</li>
              <li>{t('Download the PDF from your dashboard. A copy also comes to your email.', 'डैशबोर्ड से PDF डाउनलोड करें। एक कॉपी आपके ईमेल पर भी आती है।')}</li>
            </ol>
          </div>
          <div className="box"><h3>{t('Other reports', 'दूसरी रिपोर्ट')}</h3><ul className="ticks grid2">{others.map((o) => <li key={o.slug}><Link href={`/services/${o.slug}`} style={{ color: 'var(--saf)', fontWeight: 500 }}>{o.title}</Link></li>)}</ul></div>
        </div>
        <OrderForm service={base} />
      </div>
    </>
  );
}
