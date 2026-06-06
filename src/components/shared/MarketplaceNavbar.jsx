import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Users,
  Briefcase,
  Store,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../common/authStore';
import { getDashboardPathForRole } from '../../auth/utils/authRouting';

const NAV_LINKS = [
  { name: 'Find Talent', path: '/find-talent', icon: Users },
  { name: 'Find Work', path: '/find-work/search?type=all', icon: Briefcase },
  { name: 'Gigs', path: '/gigs', icon: Store },
  { name: 'Pricing', path: '/pricing', icon: Sparkles },
];

const MarketplaceNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isGreenHero =
    (location.pathname === '/' || location.pathname.startsWith('/find-work')) && !isScrolled;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = event.target.search?.value?.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const dashboardPath = user?.role ? getDashboardPathForRole(user.role) : '/auth/login';
  const profilePath =
    String(user?.role || '').toUpperCase() === 'CLIENT'
      ? '/client/profile'
      : String(user?.role || '').toUpperCase() === 'FREELANCER'
        ? '/freelancer/profile'
        : '/auth/profile-completion';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-sm border-b border-gray-100 py-3'
          : isGreenHero
            ? 'bg-transparent py-5'
            : 'bg-white border-b border-gray-100 py-3'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
<Link to="/" className="flex items-center gap-2 shrink-0">
              <div
                className={`font-bold text-2xl tracking-tighter ${isGreenHero ? 'text-white' : 'text-zinc-900'}`}
              >
                ForteSpace
              </div>
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className={`hidden lg:flex items-center flex-1 max-w-md rounded-full border px-4 py-2 transition-colors ${
                isGreenHero
                  ? 'border-white/20 bg-white/10 focus-within:bg-white/15'
                  : 'border-zinc-200 bg-white hover:border-[#4C1D95]/30 focus-within:ring-2 focus-within:ring-[#4C1D95]/20'
              }`}
            >
              <Search className={`w-4 h-4 shrink-0 ${isGreenHero ? 'text-white/70' : 'text-zinc-400'}`} />
              <input
                type="search"
                name="search"
                placeholder="Find services, skills, or professionals..."
                className={`w-full bg-transparent border-none outline-none px-3 text-sm ${
                  isGreenHero ? 'placeholder:text-white/70 text-white' : 'placeholder:text-zinc-400 text-zinc-800'
                }`}
              />
            </form>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <ul className="flex items-center gap-5">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`text-sm font-medium transition-colors flex items-center gap-1.5 hover:text-[#4C1D95] ${
                        isGreenHero ? 'text-white/90 hover:text-white' : 'text-zinc-600'
                      } ${location.pathname.startsWith(link.path) ? 'text-[#4C1D95]' : ''}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className={`h-6 w-px ${isGreenHero ? 'bg-white/20' : 'bg-zinc-200'}`} />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardPath}
                  className={`text-sm font-medium flex items-center gap-1.5 hover:text-[#4C1D95] ${
                    isGreenHero ? 'text-white' : 'text-zinc-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to={profilePath}
                  className={`text-sm font-medium hover:text-[#4C1D95] ${isGreenHero ? 'text-white/90' : 'text-zinc-600'}`}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => logout().then(() => navigate('/'))}
                  className={`p-2 rounded-lg transition-colors ${
                    isGreenHero ? 'text-white hover:bg-white/10' : 'text-zinc-500 hover:bg-zinc-100'
                  }`}
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className={`text-sm font-medium hover:text-[#4C1D95] ${isGreenHero ? 'text-white' : 'text-zinc-700'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                    isGreenHero
                      ? 'bg-white text-[#4C1D95] hover:bg-white/90'
                      : 'bg-[#222222] text-white hover:bg-zinc-800'
                  }`}
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${isGreenHero ? 'text-white' : 'text-zinc-800'}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <form onSubmit={handleSearchSubmit} className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="search"
                  name="search"
                  placeholder="Search..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                />
              </form>

              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base font-medium text-zinc-700 hover:text-[#4C1D95] flex items-center gap-2"
                      >
                        <Icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="h-px bg-zinc-100 my-1" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center font-medium text-zinc-700 py-2 border border-zinc-200 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={profilePath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center font-medium text-zinc-700 py-2 border border-zinc-200 rounded-lg"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout().then(() => navigate('/'));
                    }}
                    className="text-center font-medium text-red-600 py-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center font-medium text-zinc-700 py-2 border border-zinc-200 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center font-medium text-white bg-[#4C1D95] py-2 rounded-lg hover:bg-[#22C55E]"
                  >
                    Join ForteSpace
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MarketplaceNavbar;


