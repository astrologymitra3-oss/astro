import Link from 'next/link';
import Banner from '../../components/Banner';

export const metadata = { title: 'About Us', description: 'AstrologyMitra prepares Vedic, Lal Kitab, KP, numerology and tarot reports in Hindi and English from New Delhi.' };

export default function About() {
  return (
    <>
      <Banner title="About Us" sub="ज्योतिष मित्र, New Delhi" />
      <div className="prose" style={{ paddingBottom: 0 }}>
        <div>
          <h2>Why we started AstrologyMitra</h2>
          <p>Most families in India have someone they go to for kundli and muhurat. Many people today live far from that person, or get answers that are too short to understand. We started AstrologyMitra in New Delhi so that anyone can get a proper written report, in Hindi or English, prepared from their own birth details.</p>
          <p>We do not write sun-sign predictions. Every report starts with your chart, calculated for the minute and place of your birth.</p>
        </div>
      </div>
      <div className="prose" style={{ paddingTop: 10 }}>
        <h2>What we prepare</h2>
        <p>Janam Kundli, Lal Kitab Kundli, Varshphal, Numerology, Kundli Milan, Dosha reports (Manglik, Kaal Sarp, Pitru, Sade Sati), Gemstone and Yantra suggestions, Tarot readings and KP Kundli. Each one is a 10 to 15 page PDF with charts, tables and a full written reading.</p>
        <h2>The methods we follow</h2>
        <ul className="ticks">
          <li>Lahiri (Chitrapaksha) ayanamsa, the same standard used by Indian panchangs.</li>
          <li>Parashari system for Vedic kundli, the original rules of Lal Kitab, and Krishnamurti Paddhati with Placidus cusps for KP.</li>
          <li>Chaldean and Pythagorean values for name numerology, Lo Shu grid for birth date numbers.</li>
          <li>Remedies that are simple and affordable: mantra, daan, Lal Kitab upay, and gemstones only where the chart supports them.</li>
        </ul>
        <h2>What you can expect from us</h2>
        <ul className="ticks">
          <li>Your birth details stay private and are used only for your report.</li>
          <li>Doshas and difficult periods are explained honestly, without creating fear.</li>
          <li>Your reports stay in your account. Download them whenever you need.</li>
        </ul>
        <p style={{ marginTop: 26 }}><Link href="/services" className="btn">See all services</Link></p>
      </div>
    </>
  );
}
