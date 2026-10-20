import { ServicesGrid } from '../../components/Blocks';

export const metadata = { title: 'All Astrology Services', description: 'Vedic Kundli, Lal Kitab, Varshphal, Numerology, Kundli Milan, Dosha, Gemstone, Yantra, Tarot and KP reports in Hindi and English.' };

export default function Services() {
  return (
    <>
      <section className="pbanner"><div className="wrap"><div className="crumb">Home / Services</div><h1>All Services</h1><p>Choose a report — each one is personalised to your birth details and delivered as a detailed PDF.</p></div></section>
      <section className="sec"><div className="wrap"><ServicesGrid /></div></section>
    </>
  );
}
