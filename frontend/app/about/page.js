import Link from 'next/link';
import Banner from '../../components/Banner';
import AboutBody from '../../components/AboutBody';
import { T } from '../../components/Lang';

export const metadata = { title: 'About Us', description: 'AstrologyMitra prepares Vedic, Lal Kitab, KP, numerology and tarot reports in Hindi and English from New Delhi.' };

export default function About() {
  return (
    <>
      <Banner title={<T en="About Us" hi="हमारे बारे में" />} sub="ज्योतिष मित्र, New Delhi" img="/img/temple.jpg" />
      <AboutBody />
      <div className="prose" style={{ paddingTop: 0 }}><Link href="/services" className="btn"><T en="See all services" hi="सभी सेवाएँ देखें" /></Link></div>
    </>
  );
}
