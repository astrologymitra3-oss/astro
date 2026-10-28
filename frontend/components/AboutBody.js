'use client';
import { useLang } from './Lang';

const C = {
  en: {
    h1: 'Why we started AstrologyMitra',
    p1: 'Most families in India have someone they go to for kundli and muhurat. Many people today live far from that person, or get answers that are too short to understand. We started AstrologyMitra in New Delhi so that anyone can get a proper written report, in Hindi or English, prepared from their own birth details.',
    p2: 'We do not write sun-sign predictions. Every report starts with your chart, calculated for the minute and place of your birth.',
    h2: 'What we prepare',
    p3: 'Janam Kundli, Lal Kitab Kundli, Varshphal, Numerology, Kundli Milan, Dosha reports (Manglik, Kaal Sarp, Pitru, Sade Sati), Gemstone and Yantra suggestions, Tarot readings and KP Kundli. Each one is a 10 to 15 page PDF with charts, tables and a full written reading.',
    h3: 'The methods we follow',
    m: ['Lahiri (Chitrapaksha) ayanamsa, the same standard used by Indian panchangs.', 'Parashari system for Vedic kundli, the original rules of Lal Kitab, and Krishnamurti Paddhati with Placidus cusps for KP.', 'Chaldean and Pythagorean values for name numerology, Lo Shu grid for birth date numbers.', 'Remedies that are simple and affordable: mantra, daan, Lal Kitab upay, and gemstones only where the chart supports them.'],
    h4: 'What you can expect from us',
    e: ['Your birth details stay private and are used only for your report.', 'Doshas and difficult periods are explained honestly, without creating fear.', 'Your reports stay in your account. Download them whenever you need.'],
  },
  hi: {
    h1: 'हमने AstrologyMitra क्यों शुरू किया',
    p1: 'भारत के ज़्यादातर परिवारों में कोई न कोई होता है जिनसे कुंडली और मुहूर्त पूछा जाता है। आज बहुत से लोग उनसे दूर रहते हैं, या उन्हें इतने छोटे जवाब मिलते हैं कि बात समझ नहीं आती। इसलिए हमने नई दिल्ली में AstrologyMitra शुरू किया, ताकि कोई भी अपने जन्म विवरण से बनी पूरी लिखित रिपोर्ट हिन्दी या English में पा सके।',
    p2: 'हम राशि वाला आम भविष्यफल नहीं लिखते। हर रिपोर्ट आपकी अपनी कुंडली से शुरू होती है, जो आपके जन्म के मिनट और जगह के हिसाब से बनती है।',
    h2: 'हम क्या तैयार करते हैं',
    p3: 'जन्म कुंडली, लाल किताब कुंडली, वर्षफल, अंक ज्योतिष, कुंडली मिलान, दोष रिपोर्ट (मांगलिक, काल सर्प, पितृ, साढ़ेसाती), रत्न और यंत्र सुझाव, टैरो रीडिंग और KP कुंडली। हर रिपोर्ट 10 से 15 पेज की PDF होती है, जिसमें कुंडली, तालिकाएँ और पूरा लिखित फल होता है।',
    h3: 'हमारी पद्धति',
    m: ['लाहिड़ी (चित्रपक्ष) अयनांश, वही जो भारतीय पंचांगों में इस्तेमाल होता है।', 'वैदिक कुंडली के लिए पाराशरी पद्धति, लाल किताब के मूल नियम, और KP के लिए प्लेसिडस भाव संधि के साथ कृष्णमूर्ति पद्धति।', 'नाम के अंकों के लिए कैल्डियन और पाइथागोरियन पद्धति, जन्म तारीख के लिए लो शू ग्रिड।', 'आसान और सस्ते उपाय: मंत्र, दान, लाल किताब के उपाय, और रत्न सिर्फ़ तब जब कुंडली इजाज़त दे।'],
    h4: 'आप हमसे क्या उम्मीद कर सकते हैं',
    e: ['आपका जन्म विवरण सुरक्षित रहता है और सिर्फ़ आपकी रिपोर्ट के लिए इस्तेमाल होता है।', 'दोष और मुश्किल समय ईमानदारी से समझाए जाते हैं, डराया नहीं जाता।', 'आपकी रिपोर्ट आपके अकाउंट में रहती हैं। जब चाहें डाउनलोड करें।'],
  },
};

export default function AboutBody() {
  const { lang } = useLang();
  const c = C[lang] || C.en;
  return (
    <div className="prose">
      <div className="about-top">
        <div><h2 style={{ marginTop: 0 }}>{c.h1}</h2><p>{c.p1}</p><p>{c.p2}</p></div>
        <div className="photo"><img src="/img/ganesha.jpg" alt="" /></div>
      </div>
      <h2>{c.h2}</h2><p>{c.p3}</p>
      <h2>{c.h3}</h2><ul className="ticks">{c.m.map((x) => <li key={x}>{x}</li>)}</ul>
      <h2>{c.h4}</h2><ul className="ticks">{c.e.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}
