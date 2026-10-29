import { notFound } from 'next/navigation';
import PolicyView from '../../../components/PolicyView';

const UPDATED = 'October 2026';
const C = 'support@astrologymitra.com';
const P = {
  'privacy-policy': ['Privacy Policy', [
    ['Information we collect', 'When you order a report we collect your name, email address, mobile number and the details needed to prepare the report, such as date, time and place of birth, gender, your question (for tarot) or your concern (for yantra). For Kundli Milan we collect the birth details of both persons. Payment is processed by Razorpay; we do not receive or store your card, UPI or bank details.'],
    ['How we use your information', 'Your information is used only to calculate your chart, prepare and deliver your report, send you order and delivery emails, and respond to your queries. We do not sell, rent or share your personal information with third parties for marketing.'],
    ['Service providers', 'To deliver the service we use trusted providers: Razorpay for payments, a secure cloud server and database for hosting, an email provider for delivery, OpenStreetMap for locating your place of birth, and an AI language service that helps Pandit ji draft the written interpretation of your computed chart. Only the minimum data required is shared with them.'],
    ['Data security', 'Your account is protected by an encrypted password and all communication with our website takes place over a secure HTTPS connection. Reports are available only to you through your login, or through a private download link we share with you.'],
    ['Your rights', `You may ask us to correct or delete your account and reports at any time by writing to ${C}. We will process the request within 7 working days.`],
    ['Cookies & storage', 'We use your browser’s local storage only to keep you logged in. We do not use advertising cookies.'],
    ['Contact', `For any privacy question, email ${C}. AstrologyMitra, New Delhi, Delhi, India.`],
  ]],
  'terms-and-conditions': ['Terms & Conditions', [
    ['Acceptance', 'By using astrologymitra.com and purchasing a report you agree to these terms. If you do not agree, please do not use the website.'],
    ['Our service', 'AstrologyMitra provides personalised astrology, numerology and tarot reports delivered as digital PDF documents. Each report is prepared from the details you provide; accuracy depends on the correctness of your birth date, time and place.'],
    ['Your account', 'You are responsible for keeping your password confidential and for the accuracy of the details you submit. Please check your details carefully before payment.'],
    ['Pricing & payment', 'Prices are shown in Indian Rupees (INR) on each service page and are payable in advance through Razorpay. Prices may change from time to time; the price shown at checkout applies to your order.'],
    ['Intellectual property', 'The website, design and report formats belong to AstrologyMitra. Your purchased report is for your personal, non-commercial use and may not be resold or republished.'],
    ['Nature of guidance', 'Astrology is a traditional system of guidance. Our reports are not a substitute for professional medical, legal, financial or psychological advice. Decisions you take are your own responsibility. Please also read our Disclaimer.'],
    ['Limitation of liability', 'To the extent permitted by law, AstrologyMitra’s liability for any claim related to a report is limited to the amount you paid for that report.'],
    ['Governing law', 'These terms are governed by the laws of India, and courts at New Delhi shall have exclusive jurisdiction.'],
    ['Contact', `Questions about these terms can be sent to ${C}.`],
  ]],
  'refund-policy': ['Refund & Cancellation Policy', [
    ['Digital product', 'Every report is a personalised digital product prepared specifically for the details you submit. Once preparation has started, the order cannot be cancelled.'],
    ['When you are eligible for a refund', 'You will receive a full refund if: (a) your payment was deducted but no order was created; (b) you were charged twice for the same order; or (c) we are unable to deliver your report within 72 hours of payment.'],
    ['Wrong details', 'If you entered incorrect birth details, write to us within 24 hours of the order with the correct details and we will prepare a corrected report once, free of charge.'],
    ['How to request', `Email ${C} with your order number (e.g. AM-123), registered email and the reason. We respond within 2 working days.`],
    ['Refund timeline', 'Approved refunds are processed to the original payment method through Razorpay within 5-7 working days.'],
  ]],
  'shipping-and-delivery': ['Delivery Policy', [
    ['No physical shipping', 'All our products are digital PDF reports. Nothing is shipped physically.'],
    ['Delivery method', 'After successful payment your report appears in “My Dashboard” on astrologymitra.com, and a copy is sent to your registered email address.'],
    ['Delivery time', 'Reports are normally delivered within a few minutes to a few hours of payment. In rare cases of high demand it may take up to 24 hours. The dashboard shows the status of your report while Pandit ji is preparing it.'],
    ['Not received?', `If you have not received your report within 24 hours, please write to ${C} with your order number.`],
  ]],
  disclaimer: ['Disclaimer', [
    ['Guidance, not guarantee', 'Astrology, numerology, tarot and related remedies are traditional systems of guidance. Predictions are interpretations of planetary positions and are not guarantees of future events.'],
    ['Not professional advice', 'Our reports do not replace the advice of a qualified doctor, lawyer, financial adviser or counsellor. Please consult the appropriate professional for medical, legal, financial or mental-health matters.'],
    ['Remedies', 'Gemstones, yantras, mantras and upay suggested in reports should be followed with care. Wear gemstones only after a trial period, buy from trusted certified sources, and stop any remedy that causes discomfort.'],
    ['Accuracy of input', 'The accuracy of a report depends on the accuracy of the birth details provided. AstrologyMitra is not responsible for results based on incorrect information.'],
    ['Age', 'Our services are intended for users aged 18 and above, or minors with the consent of a parent or guardian.'],
  ]],
};

const P_HI = {
  'privacy-policy': ['प्राइवेसी पॉलिसी', [
    ['हम कौन सी जानकारी लेते हैं', 'रिपोर्ट ऑर्डर करते समय हम आपका नाम, ईमेल, मोबाइल नंबर और रिपोर्ट बनाने के लिए ज़रूरी जानकारी लेते हैं, जैसे जन्म तारीख, समय और स्थान, लिंग, आपका सवाल (टैरो के लिए) या आपकी समस्या (यंत्र के लिए)। कुंडली मिलान में दोनों लोगों का जन्म विवरण लिया जाता है। पेमेंट Razorpay से होता है; हम आपके कार्ड, UPI या बैंक की जानकारी न लेते हैं, न रखते हैं।'],
    ['जानकारी का इस्तेमाल', 'आपकी जानकारी सिर्फ़ आपकी कुंडली बनाने, रिपोर्ट तैयार करके भेजने, ऑर्डर और डिलीवरी के ईमेल भेजने और आपके सवालों का जवाब देने में इस्तेमाल होती है। हम आपकी निजी जानकारी किसी को बेचते, किराए पर देते या मार्केटिंग के लिए शेयर नहीं करते।'],
    ['सेवा देने वाले पार्टनर', 'सेवा देने के लिए हम भरोसेमंद पार्टनर इस्तेमाल करते हैं: पेमेंट के लिए Razorpay, होस्टिंग के लिए सुरक्षित क्लाउड सर्वर और डेटाबेस, डिलीवरी के लिए ईमेल सेवा, जन्म स्थान ढूँढने के लिए OpenStreetMap, और एक AI भाषा सेवा जो पंडित जी को आपकी गणना की गई कुंडली का लिखित फल तैयार करने में मदद करती है। उनके साथ सिर्फ़ ज़रूरी जानकारी ही शेयर होती है।'],
    ['डेटा सुरक्षा', 'आपका अकाउंट एन्क्रिप्टेड पासवर्ड से सुरक्षित है और वेबसाइट से सारी बातचीत सुरक्षित HTTPS कनेक्शन पर होती है। रिपोर्ट सिर्फ़ आपके लॉगिन से, या हमारे द्वारा भेजे गए निजी डाउनलोड लिंक से ही मिलती है।'],
    ['आपके अधिकार', `आप कभी भी ${C} पर लिखकर अपना अकाउंट और रिपोर्ट ठीक करवाने या हटवाने के लिए कह सकते हैं। हम 7 कामकाजी दिनों में यह कर देंगे।`],
    ['कुकीज़ और स्टोरेज', 'हम आपके ब्राउज़र का लोकल स्टोरेज सिर्फ़ आपको लॉगिन रखने और भाषा याद रखने के लिए इस्तेमाल करते हैं। हम विज्ञापन वाली कुकीज़ इस्तेमाल नहीं करते।'],
    ['संपर्क', `प्राइवेसी से जुड़े किसी भी सवाल के लिए ${C} पर ईमेल करें। AstrologyMitra, नई दिल्ली, भारत।`],
  ]],
  'terms-and-conditions': ['नियम और शर्तें', [
    ['स्वीकृति', 'astrologymitra.com इस्तेमाल करके और रिपोर्ट खरीदकर आप इन शर्तों से सहमत होते हैं। अगर आप सहमत नहीं हैं, तो कृपया वेबसाइट का इस्तेमाल न करें।'],
    ['हमारी सेवा', 'AstrologyMitra डिजिटल PDF के रूप में व्यक्तिगत ज्योतिष, अंक ज्योतिष और टैरो रिपोर्ट देता है। हर रिपोर्ट आपकी दी गई जानकारी से बनती है; उसकी सटीकता आपकी जन्म तारीख, समय और स्थान के सही होने पर निर्भर करती है।'],
    ['आपका अकाउंट', 'अपना पासवर्ड गोपनीय रखना और सही जानकारी भरना आपकी ज़िम्मेदारी है। पेमेंट से पहले अपनी जानकारी ध्यान से जाँच लें।'],
    ['कीमत और पेमेंट', 'हर सेवा पेज पर कीमत भारतीय रुपये (INR) में दी गई है और Razorpay से पहले भुगतान करना होता है। कीमतें समय-समय पर बदल सकती हैं; चेकआउट पर दिखाई गई कीमत ही आपके ऑर्डर पर लागू होगी।'],
    ['बौद्धिक संपदा', 'वेबसाइट, डिज़ाइन और रिपोर्ट का फ़ॉर्मेट AstrologyMitra का है। खरीदी गई रिपोर्ट आपके निजी इस्तेमाल के लिए है, इसे दोबारा बेचा या प्रकाशित नहीं किया जा सकता।'],
    ['मार्गदर्शन का स्वरूप', 'ज्योतिष मार्गदर्शन की एक पारंपरिक पद्धति है। हमारी रिपोर्ट डॉक्टर, वकील, वित्तीय सलाहकार या मनोवैज्ञानिक की सलाह की जगह नहीं है। आपके फैसले आपकी अपनी ज़िम्मेदारी हैं। कृपया हमारा अस्वीकरण भी पढ़ें।'],
    ['ज़िम्मेदारी की सीमा', 'कानून के दायरे में, किसी रिपोर्ट से जुड़े दावे पर AstrologyMitra की ज़िम्मेदारी उस रिपोर्ट के लिए चुकाई गई राशि तक सीमित है।'],
    ['लागू कानून', 'ये शर्तें भारत के कानून के अधीन हैं, और इनसे जुड़े मामले नई दिल्ली की अदालतों में ही सुने जाएँगे।'],
    ['संपर्क', `इन शर्तों के बारे में सवाल ${C} पर भेजें।`],
  ]],
  'refund-policy': ['रिफंड और कैंसलेशन पॉलिसी', [
    ['डिजिटल प्रोडक्ट', 'हर रिपोर्ट आपकी दी गई जानकारी के लिए खास तौर पर बनाया गया डिजिटल प्रोडक्ट है। रिपोर्ट बनना शुरू होने के बाद ऑर्डर कैंसल नहीं हो सकता।'],
    ['रिफंड कब मिलेगा', 'पूरा रिफंड मिलेगा अगर: (क) आपका पैसा कट गया पर ऑर्डर नहीं बना; (ख) एक ही ऑर्डर के लिए दो बार पैसा कटा; या (ग) हम पेमेंट के 72 घंटे के अंदर रिपोर्ट नहीं दे पाए।'],
    ['गलत जानकारी', 'अगर आपने जन्म विवरण गलत भर दिया, तो ऑर्डर के 24 घंटे के अंदर सही जानकारी के साथ हमें लिखें। हम एक बार मुफ़्त में सही रिपोर्ट बना देंगे।'],
    ['रिफंड कैसे माँगें', `${C} पर अपना ऑर्डर नंबर (जैसे AM-123), रजिस्टर्ड ईमेल और कारण लिखकर भेजें। हम 2 कामकाजी दिनों में जवाब देते हैं।`],
    ['रिफंड का समय', 'मंज़ूर रिफंड 5-7 कामकाजी दिनों में Razorpay के ज़रिए उसी पेमेंट तरीके में वापस आ जाता है।'],
  ]],
  'shipping-and-delivery': ['डिलीवरी पॉलिसी', [
    ['कोई फ़िज़िकल शिपिंग नहीं', 'हमारे सभी प्रोडक्ट डिजिटल PDF रिपोर्ट हैं। कुछ भी डाक या कूरियर से नहीं भेजा जाता।'],
    ['डिलीवरी कैसे होती है', 'पेमेंट के बाद आपकी रिपोर्ट astrologymitra.com पर "मेरा डैशबोर्ड" में आ जाती है, और एक कॉपी आपके रजिस्टर्ड ईमेल पर भेजी जाती है।'],
    ['डिलीवरी का समय', 'रिपोर्ट आमतौर पर पेमेंट के कुछ मिनटों से कुछ घंटों के अंदर मिल जाती है। ज़्यादा ऑर्डर होने पर कभी-कभी 24 घंटे तक लग सकते हैं। जब तक पंडित जी रिपोर्ट बना रहे हैं, डैशबोर्ड पर उसकी स्थिति दिखती रहती है।'],
    ['रिपोर्ट नहीं मिली?', `अगर 24 घंटे में रिपोर्ट नहीं मिली, तो अपने ऑर्डर नंबर के साथ ${C} पर लिखें।`],
  ]],
  disclaimer: ['अस्वीकरण', [
    ['मार्गदर्शन, गारंटी नहीं', 'ज्योतिष, अंक ज्योतिष, टैरो और उनसे जुड़े उपाय मार्गदर्शन की पारंपरिक पद्धतियाँ हैं। भविष्यवाणियाँ ग्रहों की स्थिति की व्याख्या हैं, आने वाली घटनाओं की गारंटी नहीं।'],
    ['पेशेवर सलाह नहीं', 'हमारी रिपोर्ट डॉक्टर, वकील, वित्तीय सलाहकार या काउंसलर की सलाह की जगह नहीं है। सेहत, कानूनी, पैसे या मानसिक स्वास्थ्य के मामलों में सही विशेषज्ञ से सलाह लें।'],
    ['उपाय', 'रिपोर्ट में बताए गए रत्न, यंत्र, मंत्र और उपाय सावधानी से करें। रत्न ट्रायल के बाद ही पहनें, भरोसेमंद और प्रमाणित जगह से खरीदें, और जिस उपाय से परेशानी हो उसे बंद कर दें।'],
    ['जानकारी की सटीकता', 'रिपोर्ट की सटीकता दिए गए जन्म विवरण के सही होने पर निर्भर करती है। गलत जानकारी पर आधारित नतीजों के लिए AstrologyMitra ज़िम्मेदार नहीं है।'],
    ['उम्र', 'हमारी सेवाएँ 18 साल और उससे ज़्यादा उम्र के लोगों के लिए हैं, या माता-पिता/अभिभावक की सहमति से नाबालिगों के लिए।'],
  ]],
};

export const generateStaticParams = () => Object.keys(P).map((slug) => ({ slug }));
export async function generateMetadata({ params }) { const p = P[(await params).slug]; return p ? { title: p[0] } : {}; }

export default async function Policy({ params }) {
  const { slug } = await params;
  const p = P[slug];
  if (!p) notFound();
  return <PolicyView en={p} hi={P_HI[slug]} updated={UPDATED} />;
}
