// Service catalog. form: birth | match | numerology | tarot ; extra fields listed in `extra`
module.exports = [
  { slug: 'vedic-kundli', name: 'Complete Vedic Kundli', hi: 'सम्पूर्ण वैदिक कुंडली', price: 499, form: 'birth' },
  { slug: 'lal-kitab-kundli', name: 'Complete Lal Kitab Kundli', hi: 'सम्पूर्ण लाल किताब कुंडली', price: 499, form: 'birth' },
  { slug: 'varshphal', name: 'Varshphal (Lal Kitab + Vedic)', hi: 'वर्षफल (लाल किताब + वैदिक)', price: 399, form: 'birth', extra: ['year'] },
  { slug: 'numerology-report', name: 'Complete Numerology Report', hi: 'सम्पूर्ण अंक ज्योतिष रिपोर्ट', price: 299, form: 'numerology' },
  { slug: 'kundli-milan', name: 'Kundli Milan (Matchmaking)', hi: 'कुंडली मिलान', price: 599, form: 'match' },
  { slug: 'dosha-report', name: 'Dosha Report (Manglik, Kaal Sarp, Pitru, Sade Sati)', hi: 'दोष रिपोर्ट (मांगलिक, काल सर्प, पितृ, साढ़ेसाती)', price: 349, form: 'birth' },
  { slug: 'gemstone-suggestion', name: 'Gemstone Recommendation', hi: 'रत्न सुझाव', price: 249, form: 'birth' },
  { slug: 'yantra-suggestion', name: 'Yantra Recommendation', hi: 'यंत्र सुझाव', price: 249, form: 'birth', extra: ['problem'] },
  { slug: 'tarot-reading', name: 'Tarot Reading', hi: 'टैरो रीडिंग', price: 299, form: 'tarot' },
  { slug: 'kp-kundli', name: 'KP Kundli Report', hi: 'के.पी. कुंडली रिपोर्ट', price: 599, form: 'birth' },
];
