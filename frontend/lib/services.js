export const SITE = { name: 'AstrologyMitra', domain: 'astrologymitra.com', url: 'https://astrologymitra.com', email: 'astrologymitra3@gmail.com', address: 'New Delhi, Delhi, India' };

export const PROBLEMS = [
  ['career', 'Career growth & recognition'], ['wealth', 'Wealth & financial stability'], ['marriage', 'Marriage & relationship harmony'],
  ['health', 'Health & vitality'], ['education', 'Education, focus & intellect'], ['business', 'Business & trade growth'],
  ['legal', 'Court cases, enemies & debts'], ['peace', 'Mental peace & emotional balance'], ['children', 'Children & family blessings'],
  ['obstacles', 'Delays & obstacles'], ['protection', 'Protection from negativity'],
];

export const SERVICES = [
  {
    slug: 'vedic-kundli', title: 'Complete Vedic Kundli', hindi: 'सम्पूर्ण वैदिक कुंडली', price: 499, form: 'birth',
    tagline: 'Your complete birth chart, decoded the Parashari way',
    short: 'Lagna, Chandra & Navamsa charts, planets, yogas, doshas, dasha timeline and remedies in one detailed report.',
    about: 'A Vedic Kundli is the map of the sky at the exact moment you were born. Using your date, time and place of birth we calculate every planetary position with the Lahiri ayanamsa and interpret them through the classical Parashari system. The report explains your personality, career, wealth, marriage, health and education, shows which yogas and doshas are active, and lays out your Vimshottari dasha so you know which period you are living through and what comes next.',
    benefits: ['Understand your strengths, nature and life purpose', 'Know the right career direction and wealth potential', 'See marriage and relationship indications clearly', 'Find out which dasha you are in and what it brings', 'Identify yogas and doshas present in your chart', 'Get practical remedies, lucky colours, days and gemstone'],
    includes: ['Birth details, Panchang & Avakahada Chakra', 'Planetary positions with nakshatra and pada', 'Lagna (D1), Chandra and Navamsa (D9) charts', 'Ascendant & planet-by-planet analysis', 'Career, finance, marriage, health & education', 'Yogas & doshas table', 'Vimshottari Mahadasha & Antardasha timeline', 'Remedies & lucky factors'],
  },
  {
    slug: 'lal-kitab-kundli', title: 'Complete Lal Kitab Kundli', hindi: 'सम्पूर्ण लाल किताब कुंडली', price: 499, form: 'birth',
    tagline: 'Simple, powerful Lal Kitab upay for every planet',
    short: 'Lal Kitab chart, planet-wise results, ancestral debts (Rin) and easy totke that fit into daily life.',
    about: 'Lal Kitab is a unique branch of Indian astrology known for its simple and inexpensive remedies. Your planets are placed in fixed houses (Aries in the first house) and each placement is read for its specific result. The report checks your chart for the eight types of Rin (ancestral karmic debts), explains what every planet is doing for you, and gives clear upay, do’s and don’ts so that weak planets are strengthened through everyday actions.',
    benefits: ['Easy remedies that need no expensive rituals', 'Know the result of every planet in its house', 'Find out which ancestral debts (Rin) affect you', 'Guidance on career, family and health', 'Clear do’s and don’ts for daily life', 'Ideal for quick practical relief'],
    includes: ['Birth details & planetary positions', 'Lal Kitab chart with Pakka Ghar status', 'Planet-wise Lal Kitab results', 'Rin (Pitri, Matri, Stri and more) analysis', 'Career, family & health guidance', '10 personalised Lal Kitab upay', 'Do’s & don’ts'],
  },
  {
    slug: 'varshphal', title: 'Varshphal (Annual Horoscope)', hindi: 'वर्षफल - लाल किताब + वैदिक', price: 399, form: 'birth', extra: ['year'],
    tagline: 'Your year ahead, month by month',
    short: 'Solar return chart, Muntha, dasha periods, key transits and a 12-month forecast with Lal Kitab and Vedic remedies.',
    about: 'Varshphal is the annual horoscope cast for the exact moment the Sun returns to its birth position each year. We calculate your Varsh Pravesh, year lagna and Muntha, combine them with the dasha periods running during the year and the transits of Jupiter, Saturn and Rahu-Ketu, and give a month-by-month forecast. Both Lal Kitab and Vedic remedies are included so you can make the most of the good months and stay protected in difficult ones.',
    benefits: ['Plan the year with a month-by-month forecast', 'Know the best months for career and money moves', 'Be prepared for challenging periods in advance', 'Understand which dasha runs during the year', 'Lal Kitab + Vedic remedies for the year', 'Great as a birthday-time guide'],
    includes: ['Natal chart & planetary positions', 'Varsh Pravesh date & time, year lagna', 'Muntha and its lord', 'Varsh chart and planetary positions', 'Dasha periods within the year', 'Key transits through the year', '12-month forecast', 'Lal Kitab & Vedic remedies'],
  },
  {
    slug: 'numerology-report', title: 'Complete Numerology Report', hindi: 'सम्पूर्ण अंक ज्योतिष रिपोर्ट', price: 299, form: 'numerology',
    tagline: 'The hidden power of your numbers',
    short: 'Mulank, Bhagyank, name number, Lo Shu grid, personal year forecast, lucky numbers and remedies.',
    about: 'Numbers carry the vibration of the planets. From your date of birth we calculate your Mulank (psychic number) and Bhagyank (destiny number), and from your name the Chaldean and Pythagorean name numbers, soul urge and personality numbers. The Lo Shu grid reveals strong, repeated and missing numbers, while your personal year shows the theme of the current year. The report closes with name advice, lucky numbers, colours, days and simple remedies.',
    benefits: ['Know your Mulank, Bhagyank and name number', 'Check whether your name supports your destiny', 'Discover missing numbers and how to balance them', 'Plan with your personal year forecast', 'Lucky numbers, days, colours and gemstone', 'Better choices for career and relationships'],
    includes: ['Core numbers summary', 'Mulank & Bhagyank analysis', 'Chaldean letter-by-letter name analysis', 'Soul urge & personality numbers', 'Lo Shu grid with missing numbers', 'Personal year forecast', 'Career, relationships & health', 'Lucky factors & remedies'],
  },
  {
    slug: 'kundli-milan', title: 'Kundli Milan (Matchmaking)', hindi: 'कुंडली मिलान', price: 599, form: 'match',
    tagline: 'Ashtakoot Guna Milan with Manglik check',
    short: '36-point Guna Milan, koot-wise analysis, Manglik comparison, dasha comparison and an honest verdict.',
    about: 'Kundli Milan compares the birth charts of the bride and groom before marriage. We calculate both charts and score the eight koots, Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi, for a total out of 36. Each score is explained in plain language, Manglik dosha is checked for both, the current dasha periods are compared, and you get a clear final verdict along with remedies wherever needed.',
    benefits: ['Accurate 36-point Ashtakoot Guna Milan', 'Every koot explained in simple language', 'Manglik dosha check for both partners', 'Emotional, family and financial compatibility', 'Dasha comparison for the coming years', 'Honest verdict with remedies'],
    includes: ['Birth details of both', 'Planetary positions of both', 'Lagna and Navamsa charts of both', 'Ashtakoot table with total score', 'Koot-wise analysis', 'Manglik comparison', 'Married life compatibility', 'Dasha comparison, verdict & remedies'],
  },
  {
    slug: 'dosha-report', title: 'Dosha Report', hindi: 'दोष रिपोर्ट - मंगल, काल सर्प, पितृ, साढ़ेसाती', price: 349, form: 'birth',
    tagline: 'Manglik, Kaal Sarp, Pitru Dosha & Sade Sati',
    short: 'A complete check of every major dosha with exact Sade Sati dates and remedies for each.',
    about: 'Doshas are planetary combinations that can create delays and obstacles. This report checks your chart for Manglik (Kuja) dosha from Lagna, Moon and Venus, Kaal Sarp dosha and its type, Pitru dosha, Grahan, Guru Chandal, Shrapit and Kemadruma. Saturn’s transit over your Moon is calculated to give the exact dates of your Sade Sati and Dhaiya phases, past, present and future, with clear remedies for every dosha found.',
    benefits: ['Know exactly which doshas are present', 'Exact Sade Sati & Dhaiya dates', 'Understand the real impact, no fear-mongering', 'Remedies targeted to each dosha', 'Useful before marriage and big decisions', 'Peace of mind with clear answers'],
    includes: ['Birth details & charts', 'Dosha summary table', 'Manglik dosha analysis', 'Kaal Sarp dosha & type', 'Pitru dosha', 'Sade Sati & Dhaiya timeline', 'Grahan, Guru Chandal, Shrapit, Kemadruma', 'Dosha remedies'],
  },
  {
    slug: 'gemstone-suggestion', title: 'Gemstone Recommendation', hindi: 'रत्न सुझाव', price: 249, form: 'birth',
    tagline: 'The right stone, and the ones to avoid',
    short: 'Life stone, lucky stone and Bhagya stone with weight, finger, metal, day, mantra and stones to avoid.',
    about: 'A gemstone strengthens the planet it belongs to, so the wrong stone can do harm. We study the functional nature of every planet for your ascendant and recommend your Life stone (ascendant lord), Lucky stone (5th lord) and Bhagya stone (9th lord), with the weight in ratti, the finger, metal, day and mantra for wearing. The report also tells you whether to wear your current dasha lord’s stone and which stones you should avoid.',
    benefits: ['Wear the right gemstone with confidence', 'Avoid stones that can work against you', 'Exact finger, metal, weight and day', 'Mantra to energise the stone', 'Affordable substitutes (uparatna)', 'Care and quality tips'],
    includes: ['Planetary strength & functional nature', 'Recommendation table', 'Life stone details', 'Lucky stone details', 'Bhagya stone details', 'Dasha stone guidance', 'Stones to avoid', 'Wearing ritual & care'],
  },
  {
    slug: 'yantra-suggestion', title: 'Yantra Recommendation', hindi: 'यंत्र सुझाव', price: 249, form: 'birth', extra: ['problem'],
    tagline: 'Sacred geometry for your life problem',
    short: 'Yantras chosen for your concern, birth number and ascendant lord, with installation and japa method.',
    about: 'A yantra is a sacred diagram that holds the energy of a deity or planet. Based on your date of birth, your ascendant lord and the life problem you want to address, we recommend three yantras, a primary yantra for your concern, your birth number yantra and your ascendant lord yantra. Each comes with its numerical grid, the day, direction and material for installation, the mantra and japa count, and step-by-step pran-pratishtha instructions.',
    benefits: ['Yantra chosen for your specific problem', 'Birth number and ascendant lord yantras', 'Exact grid of numbers for each yantra', 'Correct day, direction and material', 'Step-by-step installation procedure', 'Mantra and japa guidance'],
    includes: ['Birth details & charts', 'Yantra recommendation table', 'Primary yantra for your concern', 'Birth number yantra', 'Ascendant lord yantra', 'Installation procedure', 'Mantra japa method', 'Do’s & don’ts'],
  },
  {
    slug: 'tarot-reading', title: 'Tarot Reading', hindi: 'टैरो रीडिंग', price: 299, form: 'tarot',
    tagline: 'Clear answers through the Celtic Cross',
    short: 'A 10-card Celtic Cross reading for your question, with card-by-card meanings, birth card and guidance.',
    about: 'Tarot reading gives insight into a specific question or situation. Your reading uses the classic 10-card Celtic Cross spread from the full 78-card deck, covering your present situation, challenge, root cause, past, future, attitude, environment, hopes and the final outcome. Every card is interpreted in its position for your question, your Tarot birth card is revealed from your date of birth, and you receive a combined reading with practical advice and timing.',
    benefits: ['Clarity on one specific question', 'Full 10-card Celtic Cross spread', 'Card-by-card meaning in context', 'Your personal Tarot birth card', 'Practical advice and timing', 'Ideal for love, career or decisions'],
    includes: ['Reading details', 'Visual spread layout', 'Meaning of all 10 cards', 'Tarot birth card', 'Complete combined reading', 'Timing', 'Guidance & advice'],
  },
  {
    slug: 'kp-kundli', title: 'KP Kundli Report', hindi: 'के.पी. कुंडली रिपोर्ट', price: 599, form: 'birth',
    tagline: 'Krishnamurti Paddhati, precise and event focused',
    short: 'Placidus cusps with star, sub and sub-sub lords, significators, ruling planets and cusp-wise verdicts.',
    about: 'KP (Krishnamurti Paddhati) astrology is known for its precision in predicting events. It uses Placidus house cusps and divides every nakshatra into nine sub-divisions ruled by the Vimshottari lords. Your report lists the sign, star, sub and sub-sub lord of every cusp and planet, the four-level house significators and the ruling planets, followed by a cusp-wise verdict and detailed analysis of career, marriage, finance and health.',
    benefits: ['Precise, event-oriented predictions', 'Sub-lord of every cusp and planet', 'Four-level significators for each house', 'Ruling planets at the time of analysis', 'Career, marriage, finance & health via KP', 'Dasha analysis per KP significations'],
    includes: ['Birth details', 'KP cusps (Placidus) table', 'KP planetary positions', 'Lagna & Bhava Chalit charts', 'House significators & ruling planets', 'Cusp-wise analysis', 'Career, marriage, finance, health', 'Dasha & remedies'],
  },
];

export const findService = (slug) => SERVICES.find((s) => s.slug === slug);
