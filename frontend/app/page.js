import Link from 'next/link';
import { HeroSlider, ServicesGrid, Faq } from '../components/Blocks';
import { Icon } from '../components/Art';

const TRUST = [
  ['calc', 'Precise Calculations', 'Lahiri ayanamsa, high-precision ephemeris'],
  ['user', 'Prepared by Pandit ji', 'Classical Parashari, Lal Kitab & KP'],
  ['lang', 'Hindi & English', 'Choose your report language'],
  ['lock', 'Secure Payments', 'Razorpay — UPI, cards, netbanking'],
  ['shield', '100% Private', 'Your birth details stay confidential'],
  ['doc', '10-15 Page PDF', 'Download anytime from your dashboard'],
];
const STEPS = [
  ['form', 'Choose a service', 'Pick the report you need and fill in your birth details in under a minute.'],
  ['pay', 'Pay securely', 'Complete the payment through Razorpay using UPI, card or netbanking.'],
  ['star', 'Pandit ji prepares it', 'Your chart is calculated and your personalised report is prepared.'],
  ['download', 'Download your PDF', 'Get the report in your dashboard and on your email — keep it forever.'],
];
const FAQ = [
  ['What details do I need?', 'For most reports you need your date of birth, exact time of birth and place of birth. Numerology and Tarot need only your name and date of birth. Kundli Milan needs the birth details of both the boy and the girl.'],
  ['Can I get the report in Hindi?', 'Yes. Every report is available in Hindi and English — simply choose the language before you pay.'],
  ['How will I receive my report?', 'Your report is delivered as a PDF to your AstrologyMitra dashboard and to your registered email. You can download it as many times as you like.'],
  ['How accurate are the calculations?', 'Planetary positions are computed with a high-precision astronomical ephemeris using the Lahiri (Chitrapaksha) ayanamsa, the standard used by the Government of India. An accurate birth time gives the most precise results.'],
  ['What if I do not know my exact birth time?', 'Use the closest time you know. Numerology and Tarot reports do not need a birth time at all. For time-sensitive reports such as KP, a precise time matters most.'],
  ['Is my data safe?', 'Yes. Your details are used only to prepare your report, are never shared with anyone, and payments are processed securely by Razorpay — we never see your card details.'],
];

export default function Home() {
  return (
    <>
      <HeroSlider />
      <div className="wrap"><div className="trust">{TRUST.map(([i, t, s]) => <div key={t}><span className="ti"><Icon name={i} /></span><b>{t}</b><span>{s}</span></div>)}</div></div>

      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-head"><span className="kick">Our Services</span><h2>Personalised Reports for Every Question of Life</h2><p className="muted">Ten detailed reports covering Vedic, Lal Kitab and KP astrology, numerology, matchmaking, doshas, gemstones, yantras and tarot.</p></div>
          <ServicesGrid />
        </div>
      </section>

      <section className="sec sec-dark">
        <div className="wrap">
          <div className="sec-head"><span className="kick">How It Works</span><h2>Your Report in Four Simple Steps</h2></div>
          <div className="steps">{STEPS.map(([i, t, d]) => <div className="step" key={t}><div className="ti"><Icon name={i} size={26} /></div><h3>{t}</h3><p>{d}</p></div>)}</div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="wrap split">
          <div>
            <span className="hindi">॥ श्री गणेशाय नमः ॥</span>
            <h2>A Report You Will Actually Read</h2>
            <p className="muted">Every report is a beautifully designed 10 to 15 page PDF — charts, tables and clear explanations written specifically for your chart, not generic sun-sign text.</p>
            <ul className="ticks">
              <li>North Indian Lagna, Chandra and Navamsa charts</li>
              <li>Planetary positions with nakshatra, pada and lordship</li>
              <li>Panchang and Avakahada Chakra at birth</li>
              <li>Vimshottari dasha timeline with current periods</li>
              <li>Yogas, doshas and Sade Sati with exact dates</li>
              <li>Practical remedies — mantra, gemstone, upay and lucky factors</li>
            </ul>
            <Link href="/services/vedic-kundli" className="btn" style={{ marginTop: 22 }}>Get Your Kundli</Link>
          </div>
          <div className="pdfmock" aria-hidden="true">
            <div className="om">ॐ</div><div className="gn">॥ श्री गणेशाय नमः ॥</div>
            <div className="bd">COMPLETE VEDIC KUNDLI<small>Your Name · Date · Place</small></div>
            <div className="ft">ASTROLOGY<b>MITRA</b></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><span className="kick">FAQ</span><h2>Frequently Asked Questions</h2></div>
          <Faq items={FAQ} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap"><div className="cta"><div><h2>Begin with your complete Kundli</h2><p style={{ margin: 0 }}>Detailed, personalised and available in Hindi & English.</p></div><Link href="/services" className="btn">Explore Services</Link></div></div>
      </section>
    </>
  );
}
