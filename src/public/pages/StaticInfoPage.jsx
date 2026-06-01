import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms and Conditions',
    body: 'You must be at least 18 years old to use Fortespace. By creating an account, you represent that you have read, understood, and agree to these Terms.',
  },
  {
    title: '2. User Accounts and Verification (KYC)',
    body: 'Account Types: You may register as a Client/Job Poster or a Provider (either an Independent Professional (P-IP) or an SME Provider). Mandatory Verification: All Providers must complete the mandatory Know Your Customer (KYC) verification by submitting a valid National ID. Accounts failing verification will not be able to offer paid services. Fortescore Integrity: You agree not to manipulate or attempt to unfairly influence your Fortescore rating. Violation will result in immediate account termination.',
  },
  {
    title: '3. Financial Terms and Escrow',
    body: 'Escrow Service: All payments for services must be made through the Fortespace platform via the Escrow system. This protects the funds until the Client approves the work. Fees and Subscriptions: Providers: Fortespace charges a service fee (8%-15%) taken from the Provider\'s payout. Subscription Tiers (Non-Refundable): P-IPs can upgrade to a Pro/Premium Plan for $2/month. SMEs can subscribe for $5/month. Enterprise plans are $100/month. Clients: Posting a job is free. Payment Release: Funds are released from Escrow only when the Client clicks "Approve Job" or automatically after a pre-determined dispute resolution period expires. Instant Payouts: Providers are responsible for ensuring their linked Mobile Money wallets are accurate and active.',
  },
  {
    title: '4. Dispute Resolution',
    body: 'In the event of a dispute over service quality or payment, Fortespace reserves the right to review all Escrow transactions, communications, and evidence to make a final, binding decision regarding the release or return of funds.',
  },
  {
    title: '5. Termination',
    body: 'Fortespace may suspend or terminate your account immediately if you breach these Terms, including but not limited to fraudulent activity, failure to complete KYC, or confirmed manipulation of the Fortescore.',
  },
  {
    title: '6. Disclaimer of Warranty',
    body: 'Fortespace provides the platform "as is" and makes no warranties regarding the quality or performance of any specific Provider\'s work. Our role is limited to connecting verified talent and ensuring secure payment via Escrow.',
  },
];

const PRIVACY_SECTIONS = [
  {
    title: '1. Data We Collect',
    body: 'We collect data necessary to operate our secure marketplace and comply with legal requirements: Identity Data: Full legal name, date of birth, and National ID (as required for KYC verification). This is secured with industry-standard encryption and is never shared publicly. Contact Data: Email address, phone number (required for Mobile Money payout linking), and geographical location (for local service matching). Payment Data: Transaction history, Escrow details, and Mobile Money information. We do not store full credit card numbers. Usage Data: Fortescore ratings, transaction volumes, search activity, and interactions with other users.',
  },
  {
    title: '2. How We Use Your Data',
    body: 'Verification: To perform mandatory KYC checks and issue the KYC Verified Badge on profiles, thereby building the foundational trust of our platform. Transaction Security: To manage the Escrow process, process instant Mobile Money payouts, and resolve payment disputes. Service Matching: To use location and skill data to match Clients with the closest and most relevant Providers. Improvement: To analyze Fortescore data and platform usage to enhance security features and service quality.',
  },
  {
    title: '3. Data Security and Sharing',
    body: 'Your trust is our foundation. We use advanced encryption (SSL/TLS) and strict access controls to protect all data. Sharing: We only share necessary profile information (Name, Title, Fortescore, Location) publicly. We do not sell your personal data. We may share data with legal and financial authorities if required by law. Storage: Data is stored on secure servers and protected by robust cybersecurity protocols.',
  },
  {
    title: '4. Your Consent',
    body: 'By using Fortespace, you consent to the collection and use of your data as described in this policy.',
  },
];

const PAGE_CONTENT = {
  about: {
    title: 'About Fortspace',
    body: 'Fortspace connects clients and freelancers across online, on-site, and hybrid work — with escrow, contracts, and admin oversight built in.',
    rich: false,
  },
  careers: {
    title: 'Careers',
    body: 'We are growing our product, marketplace, and operations teams. Send your CV to careers@fortspace.com to be considered for upcoming roles.',
    rich: false,
  },
  contact: {
    title: 'Contact us',
    body: 'For support, partnerships, or enterprise sales, email hello@fortspace.com. We typically respond within one business day.',
    rich: false,
  },
  terms: {
    title: 'Terms of Service',
    body: null,
    rich: true,
    sections: TERMS_SECTIONS,
  },
  privacy: {
    title: 'Privacy Policy',
    body: null,
    rich: true,
    sections: PRIVACY_SECTIONS,
  },
  accessibility: {
    title: 'Accessibility',
    body: 'We aim for WCAG-aligned experiences across marketplace and dashboards. Report barriers via hello@fortspace.com.',
    rich: false,
  },
};

export default function StaticInfoPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').split('/')[0] || 'about';
  const content = PAGE_CONTENT[slug] || PAGE_CONTENT.about;

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#14a800] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <h1 className="text-3xl font-black text-zinc-900 mb-6">{content.title}</h1>

        {content.rich ? (
          <div className="space-y-6">
            {content.sections.map((section) => (
              <section key={section.title} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900 mb-3">{section.title}</h2>
                <p className="text-zinc-700 leading-relaxed">{section.body}</p>
              </section>
            ))}
            <p className="text-sm text-zinc-500 mt-4">Effective Date: January 1, 2026. By using Fortespace, you agree to the terms above.</p>
          </div>
        ) : (
          <>
            <p className="text-zinc-700 leading-relaxed mb-8">{content.body}</p>
            {slug === 'contact' && (
              <a
                href="mailto:hello@fortspace.com"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#14a800] text-white font-bold rounded-lg hover:bg-[#118a00]"
              >
                <Mail className="w-4 h-4" /> hello@fortspace.com
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
