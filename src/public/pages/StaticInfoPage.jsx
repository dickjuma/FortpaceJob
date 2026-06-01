import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

const PAGE_COPY = {
  about: {
    title: 'About Fortspace',
    body: 'Fortspace connects clients and freelancers across online, on-site, and hybrid work — with escrow, contracts, and admin oversight built in.',
  },
  careers: {
    title: 'Careers',
    body: 'We are growing our product, marketplace, and operations teams. Send your CV to careers@fortspace.com to be considered for upcoming roles.',
  },
  contact: {
    title: 'Contact us',
    body: 'For support, partnerships, or enterprise sales, email hello@fortspace.com. We typically respond within one business day.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'Use of Fortspace is subject to our platform terms covering accounts, payments, disputes, and acceptable use. Contact us for a full legal copy.',
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'We process account, payment, and usage data to operate the marketplace. You may request access or deletion subject to legal and escrow obligations.',
  },
  accessibility: {
    title: 'Accessibility',
    body: 'We aim for WCAG-aligned experiences across marketplace and dashboards. Report barriers via hello@fortspace.com.',
  },
};

export default function StaticInfoPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').split('/')[0] || 'about';
  const content = PAGE_COPY[slug] || PAGE_COPY.about;

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#14a800] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 mb-4">{content.title}</h1>
        <p className="text-zinc-600 leading-relaxed mb-8">{content.body}</p>
        {slug === 'contact' && (
          <a
            href="mailto:hello@fortspace.com"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#14a800] text-white font-bold rounded-lg hover:bg-[#118a00]"
          >
            <Mail className="w-4 h-4" /> hello@fortspace.com
          </a>
        )}
      </div>
    </div>
  );
}
