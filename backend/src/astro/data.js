// Static Vedic astrology tables
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGNS_HI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];
const SIGN_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PL_HI = { Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु' };
const PL_AB = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const PL_AB_HI = { Sun: 'सू', Moon: 'चं', Mars: 'मं', Mercury: 'बु', Jupiter: 'गु', Venus: 'शु', Saturn: 'श', Rahu: 'रा', Ketu: 'के' };
const NAKS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const NAKS_HI = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती'];
const SYLLABLES = 'Chu Che Cho La Li Lu Le Lo A I U E O Va Vi Vu Ve Vo Ka Ki Ku Gha Ng Chha Ke Ko Ha Hi Hu He Ho Da Di Du De Do Ma Mi Mu Me Mo Ta Ti Tu Te To Pa Pi Pu Sha Na Tha Pe Po Ra Ri Ru Re Ro Ta Ti Tu Te To Na Ni Nu Ne No Ya Yi Yu Ye Yo Bha Bhi Bhu Dha Pha Dha Bhe Bho Ja Ji Khi Khu Khe Kho Ga Gi Gu Ge Go Sa Si Su Se So Da Di Du Tha Jha Na De Do Cha Chi'.split(' ');
const SYLLABLES_HI = 'चु चे चो ला ली लू ले लो अ इ उ ए ओ वा वी वू वे वो का की कु घ ङ छ के को हा ही हु हे हो डा डी डू डे डो मा मी मू मे मो टा टी टू टे टो पा पी पू ष ण ठ पे पो रा री रू रे रो ता ती तू ते तो ना नी नू ने नो या यी यू ये यो भा भी भू धा फा ढा भे भो जा जी खी खू खे खो गा गी गू गे गो सा सी सू से सो दा दी दू थ झ ञ दे दो चा ची'.split(' ');
const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
const EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 };
const OWN = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [], Ketu: [] };
const MOOLA = { Sun: 4, Moon: 1, Mars: 0, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 10 };
const FRIENDS = {
  Sun: { f: ['Moon', 'Mars', 'Jupiter'], e: ['Venus', 'Saturn'] },
  Moon: { f: ['Sun', 'Mercury'], e: [] },
  Mars: { f: ['Sun', 'Moon', 'Jupiter'], e: ['Mercury'] },
  Mercury: { f: ['Sun', 'Venus'], e: ['Moon'] },
  Jupiter: { f: ['Sun', 'Moon', 'Mars'], e: ['Mercury', 'Venus'] },
  Venus: { f: ['Mercury', 'Saturn'], e: ['Sun', 'Moon'] },
  Saturn: { f: ['Mercury', 'Venus'], e: ['Sun', 'Moon', 'Mars'] },
};
const COMBUST = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };
const TITHIS = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi'];
const TITHIS_HI = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी'];
const YOGAS = ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
const YOGAS_HI = ['विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'];
const KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
const KARANAS_HI = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const DAY_LORD = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_DAY = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 6, Ketu: 2 };
// Avakahada
const YONI = ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'];
const YONI_HI = ['अश्व', 'गज', 'मेष', 'सर्प', 'श्वान', 'मार्जार', 'मूषक', 'गौ', 'महिष', 'व्याघ्र', 'मृग', 'वानर', 'नकुल', 'सिंह'];
const NAK_YONI = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
const YONI_MATRIX = [
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1], [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0], [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2], [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1], [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2], [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1], [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1], [3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1], [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
  [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2], [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4],
];
const GANA = ['Deva', 'Manushya', 'Rakshasa'];
const GANA_HI = ['देव', 'मनुष्य', 'राक्षस'];
const NAK_GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
const NADI = ['Adi', 'Madhya', 'Antya'];
const NADI_HI = ['आदि', 'मध्य', 'अन्त्य'];
const NAK_NADI = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
const VARNA = ['Kshatriya', 'Vaishya', 'Shudra', 'Brahmin']; // by sign % 4
const VARNA_HI = ['क्षत्रिय', 'वैश्य', 'शूद्र', 'ब्राह्मण'];
const VARNA_RANK = [3, 2, 1, 4];
const VASHYA = ['Chatushpad', 'Manav', 'Jalchar', 'Vanchar', 'Keet'];
const VASHYA_HI = ['चतुष्पद', 'मानव', 'जलचर', 'वनचर', 'कीट'];
const TATVA = ['Fire', 'Earth', 'Air', 'Water'];
const TATVA_HI = ['अग्नि', 'पृथ्वी', 'वायु', 'जल'];
// Remedies
const GEMS = { Sun: ['Ruby (Manik)', 'माणिक्य'], Moon: ['Pearl (Moti)', 'मोती'], Mars: ['Red Coral (Moonga)', 'मूंगा'], Mercury: ['Emerald (Panna)', 'पन्ना'], Jupiter: ['Yellow Sapphire (Pukhraj)', 'पुखराज'], Venus: ['Diamond / White Sapphire', 'हीरा / सफ़ेद पुखराज'], Saturn: ['Blue Sapphire (Neelam)', 'नीलम'], Rahu: ['Hessonite (Gomed)', 'गोमेद'], Ketu: ["Cat's Eye (Lehsunia)", 'लहसुनिया'] };
const SUBSTITUTES = { Sun: ['Red Garnet, Red Spinel', 'गार्नेट, लाल स्पिनेल'], Moon: ['Moonstone', 'चन्द्रकान्त मणि'], Mars: ['Carnelian', 'कार्नेलियन'], Mercury: ['Green Tourmaline, Peridot', 'हरा टूर्मलीन, पेरिडॉट'], Jupiter: ['Citrine, Yellow Topaz', 'सुनहला, पीला टोपाज़'], Venus: ['Opal, Zircon', 'ओपल, ज़िरकॉन'], Saturn: ['Amethyst, Blue Spinel', 'जामुनिया, नीला स्पिनेल'], Rahu: ['Orange Zircon', 'नारंगी ज़िरकॉन'], Ketu: ['Tiger Eye', 'टाइगर आई'] };
const GEM_WEAR = {
  Sun: { finger: ['Ring finger', 'अनामिका'], metal: ['Gold or Copper', 'सोना या तांबा'], ratti: '3 - 5' },
  Moon: { finger: ['Little finger', 'कनिष्ठा'], metal: ['Silver', 'चांदी'], ratti: '4 - 6' },
  Mars: { finger: ['Ring finger', 'अनामिका'], metal: ['Gold or Copper', 'सोना या तांबा'], ratti: '5 - 7' },
  Mercury: { finger: ['Little finger', 'कनिष्ठा'], metal: ['Gold or Silver', 'सोना या चांदी'], ratti: '4 - 6' },
  Jupiter: { finger: ['Index finger', 'तर्जनी'], metal: ['Gold', 'सोना'], ratti: '4 - 6' },
  Venus: { finger: ['Middle or Little finger', 'मध्यमा या कनिष्ठा'], metal: ['Silver or Platinum', 'चांदी या प्लैटिनम'], ratti: '0.5 - 1 (Diamond) / 4 - 6' },
  Saturn: { finger: ['Middle finger', 'मध्यमा'], metal: ['Silver or Panchdhatu', 'चांदी या पंचधातु'], ratti: '4 - 6' },
  Rahu: { finger: ['Middle finger', 'मध्यमा'], metal: ['Silver or Ashtadhatu', 'चांदी या अष्टधातु'], ratti: '5 - 8' },
  Ketu: { finger: ['Little or Middle finger', 'कनिष्ठा या मध्यमा'], metal: ['Silver or Panchdhatu', 'चांदी या पंचधातु'], ratti: '4 - 6' },
};
const MANTRA = {
  Sun: ['Om Hraam Hreem Hraum Sah Suryaya Namah', 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', 7000],
  Moon: ['Om Shraam Shreem Shraum Sah Chandramase Namah', 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः', 11000],
  Mars: ['Om Kraam Kreem Kraum Sah Bhaumaya Namah', 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', 10000],
  Mercury: ['Om Braam Breem Braum Sah Budhaya Namah', 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', 9000],
  Jupiter: ['Om Graam Greem Graum Sah Gurave Namah', 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', 19000],
  Venus: ['Om Draam Dreem Draum Sah Shukraya Namah', 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', 16000],
  Saturn: ['Om Praam Preem Praum Sah Shanaischaraya Namah', 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', 23000],
  Rahu: ['Om Bhraam Bhreem Bhraum Sah Rahave Namah', 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', 18000],
  Ketu: ['Om Sraam Sreem Sraum Sah Ketave Namah', 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', 17000],
};
const COLORS = { Sun: ['Saffron, Golden, Copper', 'केसरिया, सुनहरा, तांबई'], Moon: ['White, Cream, Silver', 'सफ़ेद, क्रीम, चांदी'], Mars: ['Red, Coral', 'लाल, मूंगिया'], Mercury: ['Green, Light green', 'हरा, हल्का हरा'], Jupiter: ['Yellow, Golden', 'पीला, सुनहरा'], Venus: ['White, Pastel blue, Pink', 'सफ़ेद, हल्का नीला, गुलाबी'], Saturn: ['Navy blue, Black, Grey', 'गहरा नीला, काला, स्लेटी'], Rahu: ['Smoky grey, Electric blue', 'धुएँ जैसा स्लेटी, नीला'], Ketu: ['Brown, Multi-colour', 'भूरा, चितकबरा'] };
const PLANET_NUM = { Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9 };
const NUM_PLANET = [null, 'Sun', 'Moon', 'Jupiter', 'Rahu', 'Mercury', 'Venus', 'Ketu', 'Saturn', 'Mars'];
const DIRECTION = { Sun: ['East', 'पूर्व'], Moon: ['North-West', 'वायव्य'], Mars: ['South', 'दक्षिण'], Mercury: ['North', 'उत्तर'], Jupiter: ['North-East', 'ईशान'], Venus: ['South-East', 'आग्नेय'], Saturn: ['West', 'पश्चिम'], Rahu: ['South-West', 'नैऋत्य'], Ketu: ['North-West', 'वायव्य'] };
// Yantra: 3x3 Lo Shu based squares, base number per planet
const LOSHU = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
const YANTRA_BASE = { Sun: 6, Moon: 7, Mars: 8, Mercury: 9, Jupiter: 10, Venus: 11, Saturn: 12, Rahu: 13, Ketu: 14 };
const KUBER = [[27, 20, 25], [22, 24, 26], [23, 28, 21]];
const PROBLEMS = {
  career: { planet: 'Sun', en: 'Career growth & recognition', hi: 'करियर उन्नति और मान-सम्मान', yantra: ['Surya Yantra', 'सूर्य यंत्र'] },
  wealth: { planet: 'Kuber', en: 'Wealth & financial stability', hi: 'धन और आर्थिक स्थिरता', yantra: ['Kuber Yantra', 'कुबेर यंत्र'] },
  marriage: { planet: 'Venus', en: 'Marriage & relationship harmony', hi: 'विवाह और दाम्पत्य सुख', yantra: ['Shukra Yantra', 'शुक्र यंत्र'] },
  health: { planet: 'Sun', en: 'Health & vitality', hi: 'स्वास्थ्य और ऊर्जा', yantra: ['Surya Yantra', 'सूर्य यंत्र'] },
  education: { planet: 'Mercury', en: 'Education, focus & intellect', hi: 'शिक्षा, एकाग्रता और बुद्धि', yantra: ['Budh Yantra', 'बुध यंत्र'] },
  business: { planet: 'Mercury', en: 'Business & trade growth', hi: 'व्यापार वृद्धि', yantra: ['Budh Yantra', 'बुध यंत्र'] },
  legal: { planet: 'Mars', en: 'Court cases, enemies & debts', hi: 'कोर्ट-कचहरी, शत्रु और ऋण', yantra: ['Mangal Yantra', 'मंगल यंत्र'] },
  peace: { planet: 'Moon', en: 'Mental peace & emotional balance', hi: 'मानसिक शांति और भावनात्मक संतुलन', yantra: ['Chandra Yantra', 'चन्द्र यंत्र'] },
  children: { planet: 'Jupiter', en: 'Children & family blessings', hi: 'संतान और पारिवारिक सुख', yantra: ['Guru Yantra', 'गुरु यंत्र'] },
  obstacles: { planet: 'Saturn', en: 'Delays, obstacles & hard work rewards', hi: 'विलम्ब, बाधाएँ और परिश्रम का फल', yantra: ['Shani Yantra', 'शनि यंत्र'] },
  protection: { planet: 'Rahu', en: 'Protection from negativity & confusion', hi: 'नकारात्मकता और भ्रम से रक्षा', yantra: ['Rahu Yantra', 'राहु यंत्र'] },
};
const KAAL_SARP = ['Anant', 'Kulik', 'Vasuki', 'Shankhpal', 'Padma', 'Mahapadma', 'Takshak', 'Karkotak', 'Shankhachud', 'Ghatak', 'Vishdhar', 'Sheshnag'];
const KAAL_SARP_HI = ['अनंत', 'कुलिक', 'वासुकी', 'शंखपाल', 'पद्म', 'महापद्म', 'तक्षक', 'कर्कोटक', 'शंखचूड़', 'घातक', 'विषधर', 'शेषनाग'];
// Lal Kitab permanent houses (pakka ghar)
const LK_PAKKA = { Sun: [1], Moon: [4], Mars: [3, 8], Mercury: [7], Jupiter: [2, 5, 9, 12], Venus: [7], Saturn: [8, 10], Rahu: [12], Ketu: [6] };

module.exports = {
  SIGNS, SIGNS_HI, SIGN_LORD, PLANETS, PL_HI, PL_AB, PL_AB_HI, NAKS, NAKS_HI, SYLLABLES, SYLLABLES_HI, DASHA_ORDER, DASHA_YEARS,
  EXALT, OWN, MOOLA, FRIENDS, COMBUST, TITHIS, TITHIS_HI, YOGAS, YOGAS_HI, KARANAS, KARANAS_HI, DAYS, DAYS_HI, DAY_LORD, PLANET_DAY,
  YONI, YONI_HI, NAK_YONI, YONI_MATRIX, GANA, GANA_HI, NAK_GANA, NADI, NADI_HI, NAK_NADI, VARNA, VARNA_HI, VARNA_RANK, VASHYA, VASHYA_HI,
  TATVA, TATVA_HI, GEMS, SUBSTITUTES, GEM_WEAR, MANTRA, COLORS, PLANET_NUM, NUM_PLANET, DIRECTION, LOSHU, YANTRA_BASE, KUBER, PROBLEMS,
  KAAL_SARP, KAAL_SARP_HI, LK_PAKKA,
};
