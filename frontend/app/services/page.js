import { ServicesGrid } from '../../components/Blocks';
import Banner from '../../components/Banner';
import { T } from '../../components/Lang';

export const metadata = { title: 'All Astrology Services', description: 'Vedic Kundli, Lal Kitab, Varshphal, Numerology, Kundli Milan, Dosha, Gemstone, Yantra, Tarot and KP reports in Hindi and English.' };

export default function Services() {
  return (
    <>
      <Banner title={<T en="All Services" hi="सभी सेवाएँ" />} sub={<T en="Ten reports, each prepared from your own birth details. Pick the one that answers your question." hi="दस रिपोर्ट, हर एक आपके अपने जन्म विवरण से तैयार। वह चुनिए जो आपके सवाल का जवाब दे।" />} img="/img/diyas.jpg" />
      <section className="sec"><div className="wrap"><ServicesGrid /></div></section>
    </>
  );
}
