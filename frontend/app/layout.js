import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  metadataBase: new URL('https://astrologymitra.com'),
  title: { default: 'AstrologyMitra — Vedic Kundli, Lal Kitab, Numerology & Tarot Reports', template: '%s | AstrologyMitra' },
  description: 'Personalised Vedic Kundli, Lal Kitab, Varshphal, Numerology, Kundli Milan, Dosha, Gemstone, Yantra, Tarot and KP reports in Hindi & English. Accurate calculations, prepared by Pandit ji, delivered as a detailed PDF.',
  keywords: ['kundli', 'vedic astrology', 'lal kitab', 'numerology', 'kundli milan', 'tarot reading', 'kp astrology', 'gemstone', 'yantra', 'varshphal', 'manglik dosha', 'sade sati'],
  openGraph: { siteName: 'AstrologyMitra', type: 'website', locale: 'en_IN' },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#1b1440' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Poppins:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
