import Link from 'next/link';
import { Hero, ServicesGrid, Faq } from '../components/Blocks';
import { ServiceIcon, MiniIcon } from '../components/Icons';

const NEEDS = [
  ['Shaadi mein deri ho rahi hai?', 'Check Manglik dosha, the 7th house and the right time for marriage. Already have a rishta? Match both kundlis first.', 'kundli-milan', 'Kundli Milan'],
  ['Mehnat poori, result aadha?', 'See which dasha you are in, which planet is holding you back and what helps it.', 'vedic-kundli', 'Vedic Kundli'],
  ['Sade Sati chal rahi hai?', 'Know the exact start and end dates, and what to do in each phase.', 'dosha-report', 'Dosha Report'],
  ['Paisa aata hai, rukta nahi?', 'Lal Kitab shows the planet and the ancestral rin behind it, with simple upay.', 'lal-kitab-kundli', 'Lal Kitab Kundli'],
  ['Kaunsa ratna pehnein?', 'Get the stone that suits your lagna, with ratti, finger, metal and day.', 'gemstone-suggestion', 'Gemstone Report'],
  ['Naam ka spelling sahi hai?', 'Check if your name number supports your date of birth.', 'numerology-report', 'Numerology'],
];
const INSIDE = [
  ['calc', 'Calculated, not copied', 'Planets are worked out for the exact minute and place you were born. Two people with the same rashi get different reports.'],
  ['pen', 'Written in plain language', 'No heavy jargon. Every chart and table is explained so you know what it means for your life.'],
  ['lang', 'हिन्दी or English', 'Choose your language before payment. The full report, including tables, comes in that language.'],
  ['doc', 'Yours to keep', 'A 10-15 page PDF in your account and on your email. Download it whenever you need it again.'],
];
const FAQ = [
  ['What details do I need to give?', 'Date of birth, exact time of birth and place of birth. Numerology and Tarot need only your name and date of birth. For Kundli Milan, keep the birth details of both the boy and the girl ready.'],
  ['Can I get the report in Hindi?', 'Yes. Choose हिन्दी or English in the form before payment. The full report, including charts and tables, comes in the language you choose.'],
  ['How will I receive the report?', 'As a PDF in your AstrologyMitra account (My Dashboard) and on your email. You can download it as many times as you want.'],
  ['I do not know my exact birth time. What should I do?', 'Enter the closest time you know, for example from your birth certificate or what your family remembers. Numerology and Tarot do not need a birth time at all.'],
  ['Which system do you follow?', 'Lahiri (Chitrapaksha) ayanamsa with the Parashari system for Vedic reports, the original rules of Lal Kitab, Placidus cusps for KP, and Chaldean values for name numerology.'],
  ['Is my information kept private?', 'Yes. Your details are used only to prepare your report and are never shared. Payments go through Razorpay, so we never see your card or UPI details.'],
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">आपकी चिंता, हमारा समाधान</div><h2>What is on your mind right now?</h2><p>Pick the question closest to yours. Each one leads to the report that answers it.</p></div>
          <div className="needs">
            {NEEDS.map(([q, a, slug, name]) => (
              <Link key={q} href={`/services/${slug}`} className="need">
                <span className="need-ic"><ServiceIcon slug={slug} size={40} /></span>
                <span><b>{q}</b><span>{a}</span><em>{name} →</em></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">हमारी सेवाएँ</div><h2>Choose your report</h2><p>Every report is prepared from your own birth details. One-time payment, no subscription.</p></div>
          <ServicesGrid />
        </div>
      </section>

      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">रिपोर्ट में क्या खास है</div><h2>Why people order from AstrologyMitra</h2></div>
          <div className="inside">{INSIDE.map(([i, t, d]) => <div key={t}><span className="in-ic"><MiniIcon name={i} size={26} /></span><b>{t}</b><p>{d}</p></div>)}</div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">नमूना रिपोर्ट</div><h2>See what you will receive</h2><p>Real pages from a sample Kundli and Kundli Milan report.</p></div>
          <div className="samples">
            <figure><img src="/img/sample-vedic-kundli-hi-0.jpg" alt="Report cover" loading="lazy" /><figcaption>Cover page (Hindi)</figcaption></figure>
            <figure><img src="/img/sample-vedic-kundli-hi-1.jpg" alt="Birth details and panchang" loading="lazy" /><figcaption>Birth details, panchang, avakahada</figcaption></figure>
            <figure><img src="/img/sample-vedic-kundli-en-2.jpg" alt="Planetary positions" loading="lazy" /><figcaption>Planetary positions (English)</figcaption></figure>
            <figure><img src="/img/sample-kundli-milan-en-4.jpg" alt="Ashtakoot guna milan" loading="lazy" /><figcaption>Ashtakoot guna milan</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">कैसे काम करता है</div><h2>Your report in 4 simple steps</h2></div>
          <ol className="steps4">
            <li><b>Choose a report</b>Pick the one that answers your question.</li>
            <li><b>Fill your details</b>Date, time and place of birth. Takes one minute.</li>
            <li><b>Pay securely</b>UPI, card or netbanking through Razorpay.</li>
            <li><b>Get your PDF</b>In your dashboard and on your email.</li>
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap faq-wrap">
          <div className="sec-title"><div className="hi">अक्सर पूछे जाने वाले प्रश्न</div><h2>Questions people ask us</h2><p>Still unsure? <Link href="/contact" style={{ color: 'var(--saf)' }}>Write to us</Link> and we will help you pick the right report.</p></div>
          <Faq items={FAQ} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap"><div className="cta"><div><h2>Not sure where to start? Start with your Janam Kundli.</h2><p>It covers every area of life and is the base for every other reading.</p></div><Link href="/services/vedic-kundli" className="btn">Order Vedic Kundli</Link></div></div>
      </section>
    </>
  );
}
