import Link from 'next/link';
import { HeroSlider, ServicesGrid, Faq } from '../components/Blocks';

const FAQ = [
  ['What details do I need to give?', 'Date of birth, exact time of birth and place of birth. Numerology and Tarot need only your name and date of birth. For Kundli Milan, keep the birth details of both the boy and the girl ready.'],
  ['Can I get the report in Hindi?', 'Yes. Choose हिन्दी or English in the form before payment. The full report, including charts and tables, comes in the language you choose.'],
  ['How will I receive the report?', 'As a PDF in your AstrologyMitra account (My Dashboard) and on your email. You can download it as many times as you want.'],
  ['I do not know my exact birth time. What should I do?', 'Enter the closest time you know, for example from your birth certificate or what your family remembers. Numerology and Tarot do not need a birth time at all.'],
  ['Which ayanamsa and system do you use?', 'Lahiri (Chitrapaksha) ayanamsa with the Parashari system for Vedic reports, Placidus cusps for KP, and Chaldean values for name numerology.'],
  ['Is my information kept private?', 'Yes. Your details are used only to prepare your report and are never shared. Payments go through Razorpay, so we never see your card or UPI details.'],
];

export default function Home() {
  return (
    <>
      <HeroSlider />
      <div className="facts">
        <div className="wrap">
          <div><b>Lahiri ayanamsa</b>Same standard as Indian panchangs</div>
          <div><b>हिन्दी & English</b>Choose the report language</div>
          <div><b>10-15 page PDF</b>Charts, tables and full reading</div>
          <div><b>Razorpay</b>UPI, cards and netbanking</div>
        </div>
      </div>

      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-title"><div className="hi">हमारी सेवाएँ</div><h2>Choose your report</h2><p>Every report is prepared from your own birth details. Nothing is copied from sun-sign columns.</p></div>
          <ServicesGrid />
        </div>
      </section>

      <section className="sec sec-white">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: '4/3' }}><img src="/img/ritual.jpg" alt="Lighting the sacred fire during a puja" loading="lazy" /></div>
          <div>
            <h2>How your report is prepared</h2>
            <p className="muted">Once you place the order, this is what happens:</p>
            <ol className="olist">
              <li><b>Your chart is calculated</b>Planet positions are worked out for the exact minute and place of your birth.</li>
              <li><b>Pandit ji studies the chart</b>Lagna, dasha, yogas, doshas and transits are read together, not one by one.</li>
              <li><b>The report is written for you</b>In Hindi or English, with the charts and tables you would get from a traditional jyotishi.</li>
              <li><b>Delivered to your account and email</b>Download it from My Dashboard whenever you need it.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-title"><div className="hi">नमूना रिपोर्ट</div><h2>Pages from a real report</h2><p>This is what your PDF looks like. These pages are from a sample Kundli and a Kundli Milan report.</p></div>
          <div className="samples">
            <figure><img src="/img/sample-vedic-kundli-hi-0.jpg" alt="Report cover" loading="lazy" /><figcaption>Cover page (Hindi)</figcaption></figure>
            <figure><img src="/img/sample-vedic-kundli-hi-1.jpg" alt="Birth details and panchang" loading="lazy" /><figcaption>Birth details, panchang, avakahada</figcaption></figure>
            <figure><img src="/img/sample-vedic-kundli-en-2.jpg" alt="Planetary positions" loading="lazy" /><figcaption>Planetary positions (English)</figcaption></figure>
            <figure><img src="/img/sample-kundli-milan-en-4.jpg" alt="Ashtakoot guna milan" loading="lazy" /><figcaption>Ashtakoot guna milan</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="sec sec-white">
        <div className="wrap split">
          <div>
            <div className="sec-title" style={{ marginBottom: 20 }}><div className="hi">अक्सर पूछे जाने वाले प्रश्न</div><h2>Questions people ask us</h2></div>
            <Faq items={FAQ} />
          </div>
          <div className="photo" style={{ aspectRatio: '3/4' }}><img src="/img/ganesha.jpg" alt="Ganesha idol" loading="lazy" /></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap"><div className="cta"><div><h2>Start with your Janam Kundli</h2><p>The most detailed report, and the base for every other reading.</p></div><Link href="/services/vedic-kundli" className="btn">Order Vedic Kundli</Link></div></div>
      </section>
    </>
  );
}
