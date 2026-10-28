export const SITE = { name: 'AstrologyMitra', domain: 'astrologymitra.com', url: 'https://astrologymitra.com', email: 'astrologymitra3@gmail.com', address: 'New Delhi, Delhi, India' };

export const PROBLEMS = [
  ['career', 'Career growth & recognition'], ['wealth', 'Wealth & financial stability'], ['marriage', 'Marriage & relationship harmony'],
  ['health', 'Health & vitality'], ['education', 'Education, focus & intellect'], ['business', 'Business & trade growth'],
  ['legal', 'Court cases, enemies & debts'], ['peace', 'Mental peace & emotional balance'], ['children', 'Children & family blessings'],
  ['obstacles', 'Delays & obstacles'], ['protection', 'Protection from negativity'],
];

// tagline: one-line promise. short: card text. points: 3 card bullets. questions: what the report answers.
export const SERVICES = [
  {
    slug: 'vedic-kundli', title: 'Complete Vedic Kundli', hindi: 'सम्पूर्ण वैदिक कुंडली', price: 499, form: 'birth',
    tagline: 'Know what your stars have already decided, and what is still in your hands',
    short: 'Your complete janam kundli read in detail: nature, career, money, marriage, health and the dasha you are living through right now.',
    points: ['Which dasha is running and what it will bring', 'Career, money and marriage indications', 'Yogas, doshas and remedies that suit your chart'],
    questions: ['Which period of life am I in right now, and when will things improve?', 'Which line of work will give me growth and money?', 'When are the strong yogas for marriage and property?', 'Is there any dosha in my chart that I should take care of?', 'Which gemstone, mantra and colour actually suit me?'],
    about: 'A janam kundli is the map of the sky at the exact minute you were born. Every planet sits in a sign and a house, and together they explain why some things come easily to you and others keep getting stuck. This report reads your chart the traditional Parashari way and puts it in plain words. You will see your Lagna, Chandra and Navamsa charts, every planet with its nakshatra, the yogas and doshas present, and your full Vimshottari dasha timeline with the current Mahadasha and Antardasha explained. Most people keep this report for years and come back to it before every big decision.',
    benefits: ['Clarity about your own nature, strengths and weak spots', 'Direction for career and business choices', 'Know the good and difficult periods in advance', 'Honest view of marriage and family life', 'Remedies matched to your chart, not generic ones', 'Lucky colour, day, number, direction and gemstone'],
    includes: ['Birth details, Panchang & Avakahada Chakra', 'Planetary positions with nakshatra and pada', 'Lagna (D1), Chandra and Navamsa (D9) charts', 'Ascendant & planet-by-planet analysis', 'Career, finance, marriage, health & education', 'Yogas & doshas table', 'Vimshottari Mahadasha & Antardasha timeline', 'Remedies & lucky factors'],
  },
  {
    slug: 'lal-kitab-kundli', title: 'Complete Lal Kitab Kundli', hindi: 'सम्पूर्ण लाल किताब कुंडली', price: 499, form: 'birth',
    tagline: 'Simple totke that fix weak planets without costly pujas',
    short: 'Planet-by-planet Lal Kitab results, ancestral rin in your chart and easy upay you can do at home with everyday things.',
    points: ['Which planets are troubling you and why', 'Pitri rin and other ancestral debts checked', '10 low-cost upay you can start today'],
    questions: ['Why does money come but not stay?', 'Is there a pitri rin or any ancestral debt in my chart?', 'Which planet is causing delays in my work?', 'What simple upay can I do at home?', 'What should I avoid doing so planets do not turn against me?'],
    about: 'Lal Kitab is known for one thing: remedies that are simple, cheap and work in daily life. Feeding a cow, keeping a silver square, flowing something in water. In this report your planets are placed in Lal Kitab houses and each placement is read for its effect on money, family, health and work. We also check your chart for eight types of rin (karmic debts carried from ancestors), because these often explain problems that nothing else does. You get clear upay for the planets that need help, and a list of do\'s and don\'ts so you stop doing things that weaken them.',
    benefits: ['Remedies with everyday items, no expensive rituals', 'Find the planet behind repeated problems', 'Know which ancestral rin affects you', 'Guidance on money, family and health', 'Clear do\'s and don\'ts for daily life', 'Start the upay the same day you read it'],
    includes: ['Birth details & planetary positions', 'Lal Kitab chart with Pakka Ghar status', 'Planet-wise Lal Kitab results', 'Rin (Pitri, Matri, Stri and more) analysis', 'Career, family & health guidance', '10 personalised Lal Kitab upay', 'Do\'s & don\'ts'],
  },
  {
    slug: 'varshphal', title: 'Varshphal (Annual Horoscope)', hindi: 'वर्षफल - लाल किताब + वैदिक', price: 399, form: 'birth', extra: ['year'],
    tagline: 'Your next 12 months, month by month',
    short: 'A forecast for your year from birthday to birthday: the good months to act, the months to be careful, and remedies for the year.',
    points: ['Month-by-month forecast for 12 months', 'Best time for job change, investment, travel', 'Lal Kitab + Vedic upay for this year'],
    questions: ['Will this year be good for my job or business?', 'Which months are best for big decisions?', 'When should I avoid investments or travel?', 'What does Saturn and Jupiter\'s movement mean for me this year?', 'Which remedies should I do for this year?'],
    about: 'Varshphal is the yearly chart cast for the exact moment the Sun returns to its birth position on your birthday. It shows the theme of your coming year. We combine your Varsh chart and Muntha with the dasha periods running during the year and the movement of Jupiter, Saturn and Rahu-Ketu, then write a forecast for each of the 12 months. You will know in advance when to push ahead and when to wait, and you get both Lal Kitab and Vedic remedies to make the year smoother.',
    benefits: ['Plan the year instead of guessing', 'Pick the right months for important moves', 'Be prepared for difficult phases in advance', 'Know which dasha runs during the year', 'Remedies for the year, Lal Kitab and Vedic', 'Perfect to read around your birthday'],
    includes: ['Natal chart & planetary positions', 'Varsh Pravesh date & time, year lagna', 'Muntha and its lord', 'Varsh chart and planetary positions', 'Dasha periods within the year', 'Key transits through the year', '12-month forecast', 'Lal Kitab & Vedic remedies'],
  },
  {
    slug: 'numerology-report', title: 'Complete Numerology Report', hindi: 'सम्पूर्ण अंक ज्योतिष रिपोर्ट', price: 299, form: 'numerology',
    tagline: 'Is your name working for you, or against you?',
    short: 'Your Mulank, Bhagyank and name number checked together. Find out if your name spelling supports your destiny and what to change.',
    points: ['Mulank, Bhagyank and name number', 'Lo Shu grid with missing numbers', 'Lucky numbers, days and colours'],
    questions: ['Does my name number match my date of birth?', 'Which numbers are missing in my birth date and what does that cause?', 'Which mobile number, vehicle number or date is lucky for me?', 'What will this personal year bring?', 'Which careers suit my numbers?'],
    about: 'Every number carries the energy of a planet. Your date of birth gives you a Mulank (how you think) and a Bhagyank (where life takes you). Your name has its own number, and when it does not match the other two, people often feel they work hard without getting the result. This report checks all three together using the Chaldean system, maps your Lo Shu grid to show strong and missing numbers, and explains your personal year. You also get lucky numbers, days and colours to use for dates, phone numbers and decisions.',
    benefits: ['Know if your name supports your destiny', 'Understand the numbers missing in your birth date', 'Pick lucky dates, phone and vehicle numbers', 'Plan with your personal year forecast', 'Career and relationship guidance by numbers', 'Simple number-based remedies'],
    includes: ['Core numbers summary', 'Mulank & Bhagyank analysis', 'Chaldean letter-by-letter name analysis', 'Soul urge & personality numbers', 'Lo Shu grid with missing numbers', 'Personal year forecast', 'Career, relationships & health', 'Lucky factors & remedies'],
  },
  {
    slug: 'kundli-milan', title: 'Kundli Milan (Matchmaking)', hindi: 'कुंडली मिलान', price: 599, form: 'match',
    tagline: 'Check the match properly before you say yes',
    short: 'All 36 gunas with each koot explained, Manglik check for both and an honest verdict on whether this rishta is right.',
    points: ['36 guna milan with every koot explained', 'Manglik dosha checked for both', 'Clear verdict with remedies if needed'],
    questions: ['How many gunas match, and is that enough?', 'Is either of us Manglik, and does it cancel out?', 'Is there Nadi or Bhakoot dosha?', 'How will we get along emotionally and financially?', 'If the match is weak, are there remedies?'],
    about: 'A rishta is one of the biggest decisions a family makes, and "18 out of 36" alone does not tell you enough. This report calculates both kundlis and scores all eight koots: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi. Each score is explained in plain language so you understand what it means for daily married life. Manglik dosha is checked for both from Lagna and Moon, Nadi and Bhakoot doshas are highlighted, the current dashas of both are compared, and you get an honest final verdict with remedies wherever they help.',
    benefits: ['Decide with full information, not just a number', 'Every koot explained in simple language', 'Manglik check and cancellation for both', 'Emotional, family and money compatibility', 'Dasha comparison for the coming years', 'Remedies if the match needs support'],
    includes: ['Birth details of both', 'Planetary positions of both', 'Lagna and Navamsa charts of both', 'Ashtakoot table with total score', 'Koot-wise analysis', 'Manglik comparison', 'Married life compatibility', 'Dasha comparison, verdict & remedies'],
  },
  {
    slug: 'dosha-report', title: 'Dosha Report', hindi: 'दोष रिपोर्ट - मंगल, काल सर्प, पितृ, साढ़ेसाती', price: 349, form: 'birth',
    tagline: 'Find out which doshas are real in your chart, and which are not',
    short: 'Manglik, Kaal Sarp, Pitru dosha and Sade Sati checked properly, with exact Sade Sati dates and the right remedy for each.',
    points: ['Manglik, Kaal Sarp, Pitru dosha checked', 'Exact Sade Sati and Dhaiya dates', 'Remedy for every dosha found'],
    questions: ['Am I really Manglik, or only partially?', 'Is there Kaal Sarp dosha, and which type?', 'Is my Sade Sati running now, and when does it end?', 'Is there Pitru dosha behind the problems at home?', 'What remedy should I do, and for how long?'],
    about: 'Many people are told they have a dosha and live in fear for years, while others never find out about one that is really affecting them. This report checks your chart for every major dosha: Manglik from Lagna, Moon and Venus, Kaal Sarp and its exact type, Pitru dosha, Grahan, Guru Chandal, Shrapit and Kemadruma. Saturn\'s movement over your Moon is calculated to give the real dates of your Sade Sati and Dhaiya, past, present and future. Each dosha that is present comes with a clear remedy, and the ones that are not present are clearly marked so you can stop worrying.',
    benefits: ['Clear yes or no for every major dosha', 'Exact start and end dates of Sade Sati', 'No fear, only facts from your chart', 'Remedy matched to each dosha', 'Useful before marriage and big decisions', 'Peace of mind'],
    includes: ['Birth details & charts', 'Dosha summary table', 'Manglik dosha analysis', 'Kaal Sarp dosha & type', 'Pitru dosha', 'Sade Sati & Dhaiya timeline', 'Grahan, Guru Chandal, Shrapit, Kemadruma', 'Dosha remedies'],
  },
  {
    slug: 'gemstone-suggestion', title: 'Gemstone Recommendation', hindi: 'रत्न सुझाव', price: 249, form: 'birth',
    tagline: 'Wear the right stone. Avoid the one that can harm you',
    short: 'Your life stone, lucky stone and bhagya stone chosen from your chart, with weight, finger, metal, day and mantra.',
    points: ['3 stones chosen from your own chart', 'Exact weight, finger, metal and day', 'Stones you must not wear'],
    questions: ['Which gemstone is actually right for my chart?', 'Can I wear Neelam or Pukhraj safely?', 'How many ratti, which finger and which metal?', 'On which day and with which mantra should I wear it?', 'Is there a cheaper substitute that works?'],
    about: 'A gemstone makes its planet stronger. That is why the right stone helps and the wrong one can make problems worse. Many people buy stones only by their rashi, which is a common mistake. In this report every planet is judged for your ascendant, and you get your Life stone (ascendant lord), Lucky stone (5th lord) and Bhagya stone (9th lord) with the exact weight in ratti, finger, metal, day and mantra. We also tell you whether your current dasha lord\'s stone suits you, which stones to avoid, and affordable substitutes.',
    benefits: ['Spend on the right stone only once', 'Avoid stones that can work against you', 'Exact finger, metal, weight and day', 'Mantra to energise the stone', 'Affordable substitutes (uparatna)', 'How to check quality before buying'],
    includes: ['Planetary strength & functional nature', 'Recommendation table', 'Life stone details', 'Lucky stone details', 'Bhagya stone details', 'Dasha stone guidance', 'Stones to avoid', 'Wearing ritual & care'],
  },
  {
    slug: 'yantra-suggestion', title: 'Yantra Recommendation', hindi: 'यंत्र सुझाव', price: 249, form: 'birth', extra: ['problem'],
    tagline: 'The right yantra for the problem you are facing',
    short: 'Yantras chosen for your concern, your birth number and your ascendant lord, with the correct way to install and energise them.',
    points: ['Yantra matched to your problem', 'Birth number and lagna lord yantras', 'Step-by-step sthapana and japa'],
    questions: ['Which yantra will help with my problem?', 'Where in the house and which direction should it be placed?', 'Which day and time is right to install it?', 'Which mantra and how many times?', 'What mistakes make a yantra ineffective?'],
    about: 'A yantra works only when it is the right one and is installed correctly. Tell us the problem you want help with, such as money, career, marriage, health, court cases or peace of mind, and we choose three yantras for you: one for your concern, one for your birth number and one for your ascendant lord. Each comes with its exact number grid, the day, direction and material for installation, the mantra and japa count, and simple step-by-step pran-pratishtha instructions you can follow at home.',
    benefits: ['Yantra chosen for your exact problem', 'Supports your birth number and lagna lord', 'Correct grid of numbers for each yantra', 'Right day, direction and material', 'Easy installation steps at home', 'Mantra and japa guidance'],
    includes: ['Birth details & charts', 'Yantra recommendation table', 'Primary yantra for your concern', 'Birth number yantra', 'Ascendant lord yantra', 'Installation procedure', 'Mantra japa method', 'Do\'s & don\'ts'],
  },
  {
    slug: 'tarot-reading', title: 'Tarot Reading', hindi: 'टैरो रीडिंग', price: 299, form: 'tarot',
    tagline: 'One question. Ten cards. A clear answer',
    short: 'Ask the question that is on your mind about love, career or a decision. A 10-card Celtic Cross reading with a clear answer and advice.',
    points: ['Answer to your specific question', '10-card Celtic Cross spread', 'Practical advice and likely timing'],
    questions: ['Will this relationship work out?', 'Should I take this job or wait?', 'What is blocking me right now?', 'What is likely to happen in the next few months?', 'What should I do next?'],
    about: 'Some questions cannot wait for a full kundli reading. Tarot looks at one situation in depth. Your reading uses the classic 10-card Celtic Cross from the full 78-card deck, covering where you stand, what is in your way, the root cause, what just passed, what is coming, how you see it, the people around you, your hopes and fears, and the likely outcome. Every card is explained for your question, your Tarot birth card is revealed from your date of birth, and the reading ends with a clear answer, practical advice and timing.',
    benefits: ['Clarity on the one thing troubling you', 'Full 10-card Celtic Cross spread', 'Each card explained for your question', 'Your personal Tarot birth card', 'Practical next steps and timing', 'Good for love, career and decisions'],
    includes: ['Reading details', 'Visual spread layout', 'Meaning of all 10 cards', 'Tarot birth card', 'Complete combined reading', 'Timing', 'Guidance & advice'],
  },
  {
    slug: 'kp-kundli', title: 'KP Kundli Report', hindi: 'के.पी. कुंडली रिपोर्ट', price: 599, form: 'birth',
    tagline: 'Will it happen or not? KP gives a direct answer',
    short: 'Krishnamurti Paddhati reading with sub-lords of every house: precise answers on job, marriage, money and health.',
    points: ['Sub-lord of all 12 houses', 'Direct yes / no style verdicts', 'Career, marriage, money, health'],
    questions: ['Will I get a government or private job?', 'Is marriage promised in my chart, and when?', 'Will I settle abroad?', 'Will I own a house?', 'Which dasha will bring the result?'],
    about: 'KP (Krishnamurti Paddhati) astrology is preferred when you want a direct answer to "will it happen?". It uses Placidus house cusps and divides every nakshatra into nine sub-parts, and the sub-lord of each house decides whether that house\'s results are promised. Your report lists the sign, star, sub and sub-sub lord of every cusp and planet, the four-level significators of each house and the ruling planets, followed by a clear verdict for all 12 houses and detailed analysis of career, marriage, finance and health with the dasha that will deliver them.',
    benefits: ['Direct answers on important life events', 'Sub-lord verdict for every house', 'Know which dasha brings the result', 'Ruling planets at the time of analysis', 'Career, marriage, money and health', 'Precise and event-focused'],
    includes: ['Birth details', 'KP cusps (Placidus) table', 'KP planetary positions', 'Lagna & Bhava Chalit charts', 'House significators & ruling planets', 'Cusp-wise analysis', 'Career, marriage, finance, health', 'Dasha & remedies'],
  },
];

export const findService = (slug) => SERVICES.find((s) => s.slug === slug);

// Service text in the chosen language. `alt` is the name in the other language (shown as a small label).
import { SERVICES_HI } from './servicesHi';
export const localize = (s, lang) => (lang === 'hi' ? { ...s, ...SERVICES_HI[s.slug], alt: s.title } : { ...s, alt: s.hindi });
