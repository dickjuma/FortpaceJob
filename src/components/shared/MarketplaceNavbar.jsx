import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bell, User, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MarketplaceNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Find Talent', path: '/find-talent' },
    { name: 'Find Work', path: '/find-work' },
    { name: 'Gigs', path: '/gigs' },
    { name: 'Enterprise', path: '/enterprise' },
  ];

  const isDarkNav = location.pathname === '/' && !isScrolled;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm border-b border-gray-100 py-3' : 
        location.pathname === '/' ? 'bg-transparent py-5' : 'bg-white border-b border-gray-100 py-3'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Search */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2">
              <div className={`font-bold text-2xl tracking-tighter ${isDarkNav ? 'text-white' : 'text-zinc-900'}`}>
                Fortspace<span className="text-brand-600">.</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className={`hidden lg:flex items-center flex-1 max-w-md bg-white rounded-full border ${isDarkNav ? 'border-white/20 bg-white/10 text-white placeholder:text-white/60' : 'border-zinc-200'} px-4 py-2 hover:border-brand-500 transition-colors focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500`}>
              <Search className={`w-4 h-4 ${isDarkNav ? 'text-white/70' : 'text-zinc-400'}`} />
              <input 
                type="text" 
                placeholder="Find services, skills, or professionals..." 
                className={`w-full bg-transparent border-none outline-none px-3 text-sm ${isDarkNav ? 'placeholder:text-white/70 text-white' : 'placeholder:text-zinc-400 text-zinc-800'}`}
              />
              <button className="bg-surface-dark text-white rounded-full p-1.5 hover:bg-zinc-800 transition-colors">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`text-sm font-medium transition-colors hover:text-brand-600 ${isDarkNav ? 'text-white/90 hover:text-white' : 'text-zinc-600'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={`h-6 w-px ${isDarkNav ? 'bg-white/20' : 'bg-zinc-200'} mx-2`}></div>

            <div className="flex items-center gap-4">
              <Link to="/auth/login" className={`text-sm font-medium transition-colors hover:text-brand-600 ${isDarkNav ? 'text-white hover:text-white/80' : 'text-zinc-700'}`}>
                Sign In
              </Link>
              <Link to="/auth/register" className={`text-sm font-medium px-5 py-2 rounded-full transition-all ${
                isDarkNav 
                  ? 'bg-white text-zinc-900 hover:bg-white/90' 
                  : 'bg-surface-dark text-white hover:bg-zinc-800 shadow-md shadow-zinc-900/10'
              }`}>
                Join
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${isDarkNav ? 'text-white' : 'text-zinc-800'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Find services, skills, or professionals..." 
                  className="w-full bg-surface border border-zinc-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-medium text-zinc-700 hover:text-brand-600 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="h-px bg-zinc-100 my-2"></div>
              
              <div className="flex flex-col gap-3">
                <Link to="/auth/login" className="text-center font-medium text-zinc-700 py-2 border border-zinc-200 rounded-lg hover:bg-surface">
                  Sign In
                </Link>
                <Link to="/auth/register" className="text-center font-medium text-white bg-surface-dark py-2 rounded-lg hover:bg-zinc-800">
                  Join Fortspace
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MarketplaceNavbar;
