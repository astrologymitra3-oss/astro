'use client';
import Link from 'next/link';
import { Hero, ServicesGrid, Faq } from '../components/Blocks';
import { ServiceIcon, MiniIcon } from '../components/Icons';
import { useLang } from '../components/Lang';

const C = {
  en: {
    needsHi: 'What is on your mind right now?', needsSub: 'Pick the question closest to yours. Each one leads to the report that answers it.',
    needs: [
      ['Marriage getting delayed?', 'Check Manglik dosha, the 7th house and the right time for marriage. Already have a rishta? Match both kundlis first.', 'kundli-milan', 'Kundli Milan'],
      ['Working hard, but results are half?', 'See which dasha you are in, which planet is holding you back and what helps it.', 'vedic-kundli', 'Vedic Kundli'],
      ['Is Sade Sati running?', 'Know the exact start and end dates, and what to do in each phase.', 'dosha-report', 'Dosha Report'],
      ['Money comes but does not stay?', 'Lal Kitab shows the planet and the ancestral rin behind it, with simple upay.', 'lal-kitab-kundli', 'Lal Kitab Kundli'],
      ['Which gemstone should I wear?', 'Get the stone that suits your lagna, with ratti, finger, metal and day.', 'gemstone-suggestion', 'Gemstone Report'],
      ['Is my name spelling right?', 'Check if your name number supports your date of birth.', 'numerology-report', 'Numerology'],
    ],
    svcH: 'Choose your report', svcSub: 'Every report is prepared from your own birth details. One-time payment, no subscription.',
    tradH: 'Rooted in tradition, prepared with care', tradP: 'Every report follows the classical methods taught in our parampara: the Parashari system, the original rules of Lal Kitab and Krishnamurti Paddhati. Pandit ji reads your chart as a whole, the way it is done in a temple or at home with the family jyotishi, and writes it in a language you can understand.',
    tradPts: ['Lahiri ayanamsa, same as Indian panchangs', 'Remedies that are simple and affordable', 'Doshas explained honestly, without fear'],
    whyH: 'Why people order from AstrologyMitra',
    inside: [['calc', 'Calculated, not copied', 'Planets are worked out for the exact minute and place you were born. Two people with the same rashi get different reports.'], ['pen', 'Written in plain language', 'No heavy jargon. Every chart and table is explained so you know what it means for your life.'], ['lang', 'Hindi or English', 'Choose your language before payment. The full report, including tables, comes in that language.'], ['doc', 'Yours to keep', 'A 10-15 page PDF in your account and on your email. Download it whenever you need it again.']],
    smpH: 'See what you will receive', smpSub: 'Real pages from a sample Kundli and Kundli Milan report.',
    smp: ['Cover page (Hindi)', 'Birth details, panchang, avakahada', 'Planetary positions (English)', 'Ashtakoot guna milan'],
    stepsH: 'Your report in 4 simple steps',
    steps: [['Choose a report', 'Pick the one that answers your question.'], ['Fill your details', 'Date, time and place of birth. Takes one minute.'], ['Pay securely', 'UPI, card or netbanking through Razorpay.'], ['Get your PDF', 'In your dashboard and on your email.']],
    faqH: 'Questions people ask us', faqSub: 'Still unsure?', faqLink: 'Write to us', faqSub2: 'and we will help you pick the right report.',
    faq: [
      ['What details do I need to give?', 'Date of birth, exact time of birth and place of birth. Numerology and Tarot need only your name and date of birth. For Kundli Milan, keep the birth details of both the boy and the girl ready.'],
      ['Can I get the report in Hindi?', 'Yes. Choose Hindi or English in the form before payment. The full report, including charts and tables, comes in the language you choose.'],
      ['How will I receive the report?', 'As a PDF in your AstrologyMitra account (My Dashboard) and on your email. You can download it as many times as you want.'],
      ['I do not know my exact birth time. What should I do?', 'Enter the closest time you know, for example from your birth certificate or what your family remembers. Numerology and Tarot do not need a birth time at all.'],
      ['Which system do you follow?', 'Lahiri (Chitrapaksha) ayanamsa with the Parashari system for Vedic reports, the original rules of Lal Kitab, Placidus cusps for KP, and Chaldean values for name numerology.'],
      ['Is my information kept private?', 'Yes. Your details are used only to prepare your report and are never shared. Payments go through Razorpay, so we never see your card or UPI details.'],
    ],
    ctaH: 'Not sure where to start? Start with your Janam Kundli.', ctaP: 'It covers every area of life and is the base for every other reading.', ctaB: 'Order Vedic Kundli',
  },
  hi: {
    needsHi: 'अभी आपके मन में क्या सवाल है?', needsSub: 'अपने सवाल से मिलता-जुलता सवाल चुनिए। हर सवाल आपको सही रिपोर्ट तक ले जाएगा।',
    needs: [
      ['शादी में देरी हो रही है?', 'मांगलिक दोष, सातवाँ भाव और शादी का सही समय जानिए। रिश्ता आ गया है? पहले दोनों की कुंडली मिलाइए।', 'kundli-milan', 'कुंडली मिलान'],
      ['मेहनत पूरी, नतीजा आधा?', 'जानिए कौन सी दशा चल रही है, कौन सा ग्रह रोक रहा है और उसका उपाय क्या है।', 'vedic-kundli', 'वैदिक कुंडली'],
      ['साढ़ेसाती चल रही है?', 'शुरू और खत्म होने की सही तारीख, और हर चरण में क्या करें।', 'dosha-report', 'दोष रिपोर्ट'],
      ['पैसा आता है, टिकता नहीं?', 'लाल किताब से जानिए कौन सा ग्रह और कौन सा ऋण इसके पीछे है, आसान उपायों के साथ।', 'lal-kitab-kundli', 'लाल किताब कुंडली'],
      ['कौन सा रत्न पहनें?', 'आपके लग्न के हिसाब से सही रत्न, रत्ती, उँगली, धातु और दिन के साथ।', 'gemstone-suggestion', 'रत्न सुझाव'],
      ['नाम की स्पेलिंग सही है?', 'जाँचिए कि आपका नामांक आपकी जन्म तारीख का साथ देता है या नहीं।', 'numerology-report', 'अंक ज्योतिष'],
    ],
    svcH: 'अपनी रिपोर्ट चुनिए', svcSub: 'हर रिपोर्ट आपके अपने जन्म विवरण से बनती है। एक बार पेमेंट, कोई सब्सक्रिप्शन नहीं।',
    tradH: 'परंपरा से जुड़ी, पूरे मन से तैयार', tradP: 'हर रिपोर्ट उन्हीं शास्त्रीय तरीकों से बनती है जो हमारी परंपरा में सिखाए गए हैं: पाराशरी पद्धति, लाल किताब के मूल नियम और कृष्णमूर्ति पद्धति। पंडित जी आपकी कुंडली को पूरा पढ़ते हैं, जैसे मंदिर में या घर के ज्योतिषी जी पढ़ते हैं, और ऐसी भाषा में लिखते हैं जो आप आसानी से समझ सकें।',
    tradPts: ['लाहिड़ी अयनांश, भारतीय पंचांग वाला', 'आसान और सस्ते उपाय', 'दोषों की सच्ची बात, बिना डर के'],
    whyH: 'लोग AstrologyMitra से ही क्यों मँगवाते हैं',
    inside: [['calc', 'गणना से बनी, कॉपी नहीं', 'ग्रह आपके जन्म के सही मिनट और जगह के हिसाब से निकाले जाते हैं। एक ही राशि वाले दो लोगों की रिपोर्ट भी अलग होती है।'], ['pen', 'आसान भाषा में', 'भारी-भरकम शब्द नहीं। हर कुंडली और तालिका समझाई जाती है ताकि आप जानें कि आपकी ज़िंदगी पर इसका क्या असर है।'], ['lang', 'हिन्दी या English', 'पेमेंट से पहले भाषा चुनिए। पूरी रिपोर्ट, तालिकाओं के साथ, उसी भाषा में आती है।'], ['doc', 'हमेशा आपके पास', '10-15 पेज की PDF आपके अकाउंट और ईमेल पर। जब चाहें दोबारा डाउनलोड करें।']],
    smpH: 'देखिए आपको क्या मिलेगा', smpSub: 'एक नमूना कुंडली और कुंडली मिलान रिपोर्ट के असली पेज।',
    smp: ['कवर पेज (हिन्दी)', 'जन्म विवरण, पंचांग, अवकहड़ा', 'ग्रह स्थिति (English)', 'अष्टकूट गुण मिलान'],
    stepsH: '4 आसान कदमों में आपकी रिपोर्ट',
    steps: [['रिपोर्ट चुनिए', 'वह रिपोर्ट चुनिए जो आपके सवाल का जवाब दे।'], ['जानकारी भरिए', 'जन्म तारीख, समय और स्थान। बस एक मिनट।'], ['सुरक्षित पेमेंट', 'Razorpay से UPI, कार्ड या नेटबैंकिंग।'], ['PDF पाइए', 'आपके डैशबोर्ड और ईमेल पर।']],
    faqH: 'लोग हमसे क्या पूछते हैं', faqSub: 'अब भी उलझन है?', faqLink: 'हमें लिखिए', faqSub2: ', हम सही रिपोर्ट चुनने में मदद करेंगे।',
    faq: [
      ['मुझे कौन सी जानकारी देनी होगी?', 'जन्म तारीख, जन्म का सही समय और जन्म स्थान। अंक ज्योतिष और टैरो के लिए सिर्फ़ नाम और जन्म तारीख चाहिए। कुंडली मिलान के लिए लड़के और लड़की दोनों का जन्म विवरण तैयार रखें।'],
      ['क्या रिपोर्ट हिन्दी में मिल सकती है?', 'हाँ। पेमेंट से पहले फ़ॉर्म में हिन्दी या English चुनिए। पूरी रिपोर्ट, कुंडली और तालिकाओं के साथ, उसी भाषा में मिलती है।'],
      ['रिपोर्ट मुझे कैसे मिलेगी?', 'PDF के रूप में आपके AstrologyMitra अकाउंट (मेरा डैशबोर्ड) में और आपके ईमेल पर। आप इसे जितनी बार चाहें डाउनलोड कर सकते हैं।'],
      ['मुझे जन्म का सही समय नहीं पता, क्या करूँ?', 'जो सबसे करीब समय पता हो वही डालिए, जैसे जन्म प्रमाणपत्र से या परिवार को जो याद हो। अंक ज्योतिष और टैरो के लिए जन्म समय की ज़रूरत ही नहीं है।'],
      ['आप कौन सी पद्धति अपनाते हैं?', 'वैदिक रिपोर्ट के लिए लाहिड़ी (चित्रपक्ष) अयनांश और पाराशरी पद्धति, लाल किताब के मूल नियम, KP के लिए प्लेसिडस भाव संधि, और नाम के अंकों के लिए कैल्डियन पद्धति।'],
      ['क्या मेरी जानकारी सुरक्षित रहती है?', 'हाँ। आपकी जानकारी सिर्फ़ आपकी रिपोर्ट बनाने में इस्तेमाल होती है और किसी से शेयर नहीं की जाती। पेमेंट Razorpay से होता है, इसलिए हम आपके कार्ड या UPI की जानकारी कभी नहीं देखते।'],
    ],
    ctaH: 'कहाँ से शुरू करें, समझ नहीं आ रहा? अपनी जन्म कुंडली से शुरू कीजिए।', ctaP: 'इसमें ज़िंदगी का हर पहलू आता है, और यही बाकी हर रिपोर्ट का आधार है।', ctaB: 'वैदिक कुंडली मँगवाएँ',
  },
};
const IMGS = ['sample-vedic-kundli-hi-0.jpg', 'sample-vedic-kundli-hi-1.jpg', 'sample-vedic-kundli-en-2.jpg', 'sample-kundli-milan-en-4.jpg'];

export default function Home() {
  const { lang } = useLang();
  const c = C[lang] || C.en;
  return (
    <>
      <Hero />

      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">आपकी चिंता, हमारा समाधान</div><h2>{c.needsHi}</h2><p>{c.needsSub}</p></div>
          <div className="needs">
            {c.needs.map(([q, a, slug, name]) => (
              <Link key={q} href={`/services/${slug}`} className="need">
                <span className="need-ic"><ServiceIcon slug={slug} size={40} /></span>
                <span><b>{q}</b><span>{a}</span><em>{name} →</em></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">हमारी सेवाएँ</div><h2>{c.svcH}</h2><p>{c.svcSub}</p></div>
          <ServicesGrid />
        </div>
      </section>

      <section className="trad">
        <div className="trad-bg" />
        <div className="wrap trad-in">
          <div className="trad-photo"><img src="/img/aarti-priests.jpg" alt="Ganga aarti" loading="lazy" /></div>
          <div>
            <div className="hi">॥ परंपरा और विश्वास ॥</div>
            <h2>{c.tradH}</h2>
            <p>{c.tradP}</p>
            <ul className="trad-pts">{c.tradPts.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">रिपोर्ट में क्या खास है</div><h2>{c.whyH}</h2></div>
          <div className="inside">{c.inside.map(([i, t, d]) => <div key={t}><span className="in-ic"><MiniIcon name={i} size={26} /></span><b>{t}</b><p>{d}</p></div>)}</div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">नमूना रिपोर्ट</div><h2>{c.smpH}</h2><p>{c.smpSub}</p></div>
          <div className="samples">{IMGS.map((im, i) => <figure key={im}><img src={`/img/${im}`} alt={c.smp[i]} loading="lazy" /><figcaption>{c.smp[i]}</figcaption></figure>)}</div>
        </div>
      </section>

      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-title center-t"><div className="hi">कैसे काम करता है</div><h2>{c.stepsH}</h2></div>
          <ol className="steps4">{c.steps.map(([b, d]) => <li key={b}><b>{b}</b>{d}</li>)}</ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap faq-wrap">
          <div className="sec-title">
            <div className="hi">अक्सर पूछे जाने वाले प्रश्न</div><h2>{c.faqH}</h2>
            <p>{c.faqSub} <Link href="/contact" style={{ color: 'var(--saf)' }}>{c.faqLink}</Link> {c.faqSub2}</p>
            <div className="faq-photo"><img src="/img/ganesha.jpg" alt="" loading="lazy" /></div>
          </div>
          <Faq items={c.faq} key={lang} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap"><div className="cta cta-photo"><div><h2>{c.ctaH}</h2><p>{c.ctaP}</p></div><Link href="/services/vedic-kundli" className="btn">{c.ctaB}</Link></div></div>
      </section>
    </>
  );
}
