import Link from 'next/link';

export const metadata = { title: 'About Us', description: 'AstrologyMitra brings authentic Vedic, Lal Kitab, KP astrology, numerology and tarot guidance in Hindi and English.' };

export default function About() {
  return (
    <>
      <section className="pbanner"><div className="wrap"><div className="crumb">Home / About Us</div><h1>About AstrologyMitra</h1><p>Your trusted friend (mitra) for authentic astrological guidance.</p></div></section>
      <div className="prose">
        <p>AstrologyMitra was started in New Delhi with a simple purpose — to make authentic, personalised astrology available to every family in a language they are comfortable with. Too often, people receive generic predictions that have nothing to do with their own chart. We believe every person deserves guidance based on the actual position of the planets at the moment of their birth.</p>
        <h2>What we do</h2>
        <p>We prepare detailed, personalised reports across ten services — Complete Vedic Kundli, Lal Kitab Kundli, Varshphal, Numerology, Kundli Milan, Dosha analysis, Gemstone and Yantra recommendations, Tarot reading and KP Kundli. Every report is available in both Hindi and English and is delivered as a beautifully designed PDF that you can keep and refer to for years.</p>
        <h2>How your report is prepared</h2>
        <ul>
          <li><b>Precise calculations:</b> planetary positions are computed with a high-precision astronomical ephemeris using the Lahiri (Chitrapaksha) ayanamsa, the standard adopted by the Government of India.</li>
          <li><b>Classical methods:</b> interpretation follows the Parashari system for Vedic astrology, the original principles of Lal Kitab, Krishnamurti Paddhati for KP, and Chaldean & Pythagorean systems for numerology.</li>
          <li><b>Personal guidance:</b> each report is prepared by Pandit ji specifically for your chart, with practical remedies — mantras, gemstones, yantras and Lal Kitab upay — that fit into everyday life.</li>
        </ul>
        <h2>Our promise</h2>
        <ul>
          <li>Your birth details are kept private and used only to prepare your report.</li>
          <li>No fear-mongering — doshas and difficult periods are explained honestly, along with what you can do about them.</li>
          <li>Secure payments through Razorpay and permanent access to your reports from your dashboard.</li>
        </ul>
        <p style={{ marginTop: 30 }}><Link href="/services" className="btn">Explore our services</Link></p>
      </div>
    </>
  );
}
