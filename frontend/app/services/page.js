import { ServicesGrid } from '../../components/Blocks';
import Banner from '../../components/Banner';

export const metadata = { title: 'All Astrology Services', description: 'Vedic Kundli, Lal Kitab, Varshphal, Numerology, Kundli Milan, Dosha, Gemstone, Yantra, Tarot and KP reports in Hindi and English.' };

export default function Services() {
  return (
    <>
      <Banner title="All Services" sub="Ten reports, each prepared from your own birth details." img="/img/hero-diya.jpg" />
      <section className="sec"><div className="wrap"><ServicesGrid /></div></section>
    </>
  );
}
