import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

const MarketplaceFooter = () => {
  return (
    <footer className="bg-surface-dark text-zinc-400 py-16 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-black text-white tracking-tighter mb-6 block">
              Fortspace<span className="text-brand-600">.</span>
            </Link>
            <p className="text-zinc-400 mb-6 max-w-sm">
              The world's premium destination for finding top-tier freelance talent and enterprise solutions.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">For Clients</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/find-talent" className="hover:text-brand-400 transition-colors">How to Hire</Link></li>
              <li><Link to="/find-talent" className="hover:text-brand-400 transition-colors">Talent Marketplace</Link></li>
              <li><Link to="/enterprise" className="hover:text-brand-400 transition-colors">Enterprise Solutions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">For Talent</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/find-work" className="hover:text-brand-400 transition-colors">How to Find Work</Link></li>
              <li><Link to="/find-work" className="hover:text-brand-400 transition-colors">Create a Profile</Link></li>
              <li><Link to="/find-work" className="hover:text-brand-400 transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-brand-400 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 Fortspace International Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;
