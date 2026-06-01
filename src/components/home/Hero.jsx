import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, Users } from 'lucide-react';
import Container from '../common/Container';
import { useTrendingCategories } from '../../common/services/publicHooks';
import { useTrustedClients } from '../../common/services/publicHooks';

export default function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('hire'); // 'hire' | 'work'
  const [talentQuery, setTalentQuery] = useState('');
  
  // Replace mock data with real API data
  const { data: trendingCategories = [], isLoading: categoriesLoading } = useTrendingCategories();
  const { data: trustedClients = [], isLoading: clientsLoading, isError: clientsError } = useTrustedClients();
  
  // Derive popular searches from trending categories or use fallback
  const POPULAR_SEARCHES = trendingCategories
    .map(category => category.name || category.title)
    .filter(Boolean)
    .slice(0, 6) || ['Website Design', 'WordPress', 'Logo Design', 'AI Services', 'Video Editing', 'SEO'];
  
  // Replace category quick links with real categories
  const CATEGORY_QUICK_LINKS = trendingCategories
    .map(category => ({
      label: category.name || category.title || 'Service',
      path: `/categories/${category.slug || (category.name || category.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    }))
    .slice(0, 6) || [
    { label: 'Graphics & Design', path: '/categories/design' },
    { label: 'Programming & Tech', path: '/categories/tech' },
    { label: 'Digital Marketing', path: '/categories/marketing' },
    { label: 'Video & Animation', path: '/categories/video' },
    { label: 'Writing & Translation', path: '/categories/writing' },
  ];
  
  // Replace trust brands with real trusted clients
  const TRUST_BRANDS = trustedClients
    .map(client => client.name || client.title || client.company || 'Client')
    .filter(Boolean)
    .slice(0, 6) || ['META', 'GOOGLE', 'NETFLIX', 'P&G', 'PAYPAL'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTalentSearch = (e) => {
    e.preventDefault();
    if (talentQuery.trim()) {
      navigate(`/find-work?q=${encodeURIComponent(talentQuery)}`);
    }
  };

  return (
    <section className="relative pt-32 pb-0 lg:pt-40 bg-[#013914] text-white overflow-hidden">
      <Container className="relative z-10 w-full pb-10">
        <div className="max-w-3xl mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-bold tracking-tight mb-8 leading-[1.1]">
              Find the perfect{' '}
              <i className="font-serif font-light text-emerald-400">freelance</i>{' '}
              services for your business
            </h1>

            {/* Primary Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl mt-8">
              <div className="flex bg-white rounded-md overflow-hidden p-1 shadow-lg">
                <div className="flex items-center pl-4 pr-2">
                  <Search className="w-5 h-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 w-full bg-transparent border-none focus:ring-0 text-zinc-900 text-lg placeholder:text-zinc-500 py-3 px-2 outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 font-bold text-lg rounded transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-3 mt-5 text-sm font-semibold">
              <span className="text-zinc-300">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="border border-white/40 hover:bg-white hover:text-[#013914] rounded-full px-4 py-1 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Category Quick Links */}
            <div className="flex flex-wrap items-center gap-2 mt-5 text-xs">
              <span className="text-zinc-400 uppercase font-bold tracking-wider mr-1">Browse:</span>
              {CATEGORY_QUICK_LINKS.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => navigate(cat.path)}
                  className="text-emerald-300 hover:text-white underline underline-offset-2 transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Find Talent / Find Work split bar */}
      <div className="relative z-10 bg-[#012810] border-t border-emerald-900 mt-6">
        <Container>
          <div className="flex gap-0 border-b border-emerald-800">
            <button
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'hire'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
              onClick={() => setActiveTab('hire')}
            >
              <Users className="w-4 h-4" />
              Find Talent
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'work'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
              onClick={() => setActiveTab('work')}
            >
              <Briefcase className="w-4 h-4" />
              Find Work
            </button>
          </div>

          <div className="py-5">
            {activeTab === 'hire' ? (
              <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl">
                <div className="flex-1 flex bg-white/10 border border-white/20 rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search for freelancers by skill or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-400 px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search Talent
                </button>
              </form>
            ) : (
              <form onSubmit={handleTalentSearch} className="flex items-center gap-3 max-w-xl">
                <div className="flex-1 flex bg-white/10 border border-white/20 rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search for jobs, gigs, or projects..."
                    value={talentQuery}
                    onChange={(e) => setTalentQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-400 px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find Work
                </button>
              </form>
            )}
          </div>
        </Container>
      </div>

      {/* Trust Badges */}
      <div className="relative z-10 bg-white/5 border-t border-white/10">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-start gap-6 py-4">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest shrink-0">
              Trusted by:
            </span>
            <div className="flex flex-wrap items-center gap-8 opacity-50 hover:opacity-80 transition-opacity duration-500">
              {TRUST_BRANDS.map((brand) => (
                <span key={brand} className="text-xl font-black text-white tracking-tight">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Decorative shape */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-emerald-400 fill-current"
        >
          <path
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,80.6,-46.1C89.4,-33.1,94,-16.5,92.5,-0.9C91,14.8,83.4,29.5,74.1,42.5C64.8,55.5,53.8,66.8,40.7,75.1C27.6,83.4,13.8,88.7,0.4,87.9C-12.9,87.2,-25.9,80.5,-37.9,71.9C-49.9,63.3,-61,52.8,-70.5,40.5C-80,28.2,-87.8,14.1,-89.5,-0.9C-91.1,-15.9,-86.6,-31.8,-77.7,-44.6C-68.8,-57.4,-55.5,-67,-41.8,-74.3C-28.1,-81.6,-14,-86.6,0.3,-87.1C14.7,-87.6,29.3,-83.7,44.7,-76.4Z"
            transform="translate(100 100) scale(1.1)"
          />
        </svg>
      </div>
    </section>
  );
}
