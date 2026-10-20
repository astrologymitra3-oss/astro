import { notFound } from 'next/navigation';

const UPDATED = 'October 2026';
const C = 'astrologymitra3@gmail.com';
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

export const generateStaticParams = () => Object.keys(P).map((slug) => ({ slug }));
export async function generateMetadata({ params }) { const p = P[(await params).slug]; return p ? { title: p[0] } : {}; }

export default async function Policy({ params }) {
  const p = P[(await params).slug];
  if (!p) notFound();
  return (
    <>
      <section className="pbanner" style={{ backgroundImage: 'url(/img/temple.jpg)' }}><div className="wrap"><div className="crumb">Home / {p[0]}</div><h1>{p[0]}</h1><p>Last updated: {UPDATED}</p></div></section>
      <div className="prose">{p[1].map(([h, t]) => <div key={h}><h2>{h}</h2><p>{t}</p></div>)}</div>
    </>
  );
}
