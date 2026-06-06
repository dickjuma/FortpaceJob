import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '../common/Button';
import Container from '../common/Container';
import Button from '../common/Button';

const NAV_LINKS = [
  { name: 'Find Talent', href: '/find-talent' },
  { name: 'Find Work', href: '/find-work/search?type=all' },
  { name: 'Enterprise', href: '/enterprise' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm py-3",
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg leading-none">F</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                ForteSpace
              </span>
            </Link>

            {/* Desktop Links / Search */}
            <div className="hidden md:flex items-center gap-8 flex-1">
              <div className="flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm font-medium text-zinc-600 hover:text-emerald-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <form
                className="flex-1 max-w-xl ml-4 relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = e.target.search.value;
                  if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
                }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    className="block w-full pl-10 pr-24 py-2 border border-zinc-200 rounded-lg leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                    placeholder="Search services, skills, or talent"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-1 right-1 px-4 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {!isScrolled && (
              <Link
                to="/search"
                className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>
            )}
            <div className="w-px h-5 bg-zinc-200 mx-1"></div>
            <Link
              to="/auth/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-2"
            >
              Log In
            </Link>
            <Button size="sm" onClick={() => navigate('/auth/register')}>
              Sign Up
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-zinc-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-zinc-700 py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
                <Button variant="outline" fullWidth onClick={() => { setMobileMenuOpen(false); navigate('/auth/login'); }}>
                  Log In
                </Button>
                <Button fullWidth onClick={() => { setMobileMenuOpen(false); navigate('/auth/register'); }}>
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
