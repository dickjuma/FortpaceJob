import React from 'react';
import Container from '../common/Container';
import { Twitter, Linkedin, Instagram, Github } from 'lucide-react';

const FOOTER_LINKS = {
  "For Clients": [
    "How to Hire",
    "Talent Marketplace",
    "Project Catalog",
    "Enterprise Solutions",
    "Payroll Services",
    "Hire an Agency"
  ],
  "For Freelancers": [
    "How to Find Work",
    "Direct Contracts",
    "Find Freelance Jobs",
    "Create a Profile",
    "Freelancer Success"
  ],
  "Resources": [
    "Help & Support",
    "Success Stories",
    "Forte Reviews",
    "Blog",
    "Community",
    "Affiliate Program"
  ],
  "Company": [
    "About Us",
    "Leadership",
    "Investor Relations",
    "Careers",
    "Trust, Safety & Security",
    "Contact Us"
  ]
};

export default function Footer() {
  return (
    <footer className="bg-surface-dark pt-20 pb-10 border-t border-zinc-800">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-success flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">F</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Forte<span className="text-success">.</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Connect with skilled professionals trusted by startups, businesses, and enterprises around the world.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-400 hover:text-success transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Forte Marketplace Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
