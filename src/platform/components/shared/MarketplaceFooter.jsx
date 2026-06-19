import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { useSiteSettings } from '../../common/hooks/useSiteSettings';

const ICON_MAP = {
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

const FOOTER_LINKS = {
  clients: [
    { label: 'Find Talent', to: '/find-talent' },
    { label: 'Post a Job', to: '/auth/register' },
    { label: 'Browse Gigs', to: '/gigs' },
  ],
  talent: [
    { label: 'Find Work', to: '/find-work/search?type=all' },
    { label: 'Create Profile', to: '/auth/register' },
    { label: 'Sell a Gig', to: '/freelancer/gigs/create' },
  ],
  company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '/careers' },
  ],
  legal: [
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
    { label: 'Accessibility', to: '/accessibility' },
  ],
};

const MarketplaceFooter = () => {
  const { data } = useSiteSettings();
  const company = data?.company || {};
  const socialLinks = (data?.socialLinks || []).filter((l) => l.url && l.enabled !== false);

  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="text-xl font-black text-white tracking-tight block mb-3">
              Fortspace<span className="text-[#4C1D95]">.</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              {company.footerMessage ||
                'Hire talent, sell services, and run contracts with escrow and admin oversight.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socialLinks.map((link) => {
                  const Icon = ICON_MAP[link.icon] || ICON_MAP[link.id] || Twitter;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label || link.id}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-[#4C1D95] hover:bg-zinc-700 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">For Clients</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.clients.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-[#4C1D95] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">For Talent</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.talent.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-[#4C1D95] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-[#4C1D95] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-[#4C1D95] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Fortspace. All rights reserved.</p>
          <p className="text-center sm:text-right">Built for online, on-site, and hybrid work.</p>
        </div>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;


