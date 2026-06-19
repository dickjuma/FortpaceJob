import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CategoryNavBar from '../components/marketplace/CategoryNavBar';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import CategoryTile from '../components/marketplace/CategoryTile';
import {
  useTalentCategories,
  useFeaturedTalent,
  useTalentStats,
} from '../common/services/talentHooks';

const FindTalentLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('all');
  const sectionSlug = new URLSearchParams(location.search).get('section');

  const { data: categories = [], isLoading: categoriesLoading } = useTalentCategories(mode);
  const { data: featuredTalent = [], isLoading: talentLoading } = useFeaturedTalent(8, {
    sectionSlug: sectionSlug || undefined,
    mode: mode !== 'all' ? mode : undefined,
  });
  const { data: stats } = useTalentStats();

  const currentBasePath = location.pathname.startsWith('/talent') ? '/talent' : '/find-talent';
  const displayCategories = categories.slice(0, 8);
  const totalProfiles = stats?.totalTalent ?? 0;
  const categoryCount = stats?.categories ?? 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (mode !== 'all') params.set('mode', mode);
    navigate(`/search-results${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <>
      <section className="bg-[#001e00] text-white pt-24 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2850)',
          }}
        />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Find the perfect <i className="font-serif font-light text-[#4C1D95]">freelance</i> talent
            </h1>
            <p className="text-lg text-zinc-300 max-w-3xl mx-auto mb-8">
              Discover curated professionals, verified profiles, and talent categories linked directly to the marketplace search experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-300 font-semibold mb-2">Talent profiles</div>
                <div className="text-3xl font-black text-white">{totalProfiles.toLocaleString()}</div>
              </div>
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-300 font-semibold mb-2">Categories</div>
                <div className="text-3xl font-black text-white">{categoryCount}</div>
              </div>
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-300 font-semibold mb-2">Delivery modes</div>
                <div className="text-3xl font-black text-white">4</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-2 shadow-2xl grid gap-3 md:grid-cols-[1fr_auto] max-w-3xl mx-auto mb-6">
              <input
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 px-4 py-4 placeholder-zinc-500 font-medium"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search skills, roles, or categories…"
                value={query}
              />
              <button
                className="bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-3xl px-8 py-4 font-bold transition-colors flex items-center justify-center gap-2"
                type="submit"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                { id: 'all', label: 'All' },
                { id: 'online', label: 'Online' },
                { id: 'onsite', label: 'On-site' },
                { id: 'hybrid', label: 'Hybrid' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                    mode === item.id
                      ? 'bg-white text-[#001e00] border-white'
                      : 'border-white/40 text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {stats && (stats.totalTalent > 0 || stats.categories > 0) && (
              <p className="text-sm text-zinc-300 font-medium">
                {stats.totalTalent > 0 && <span>{stats.totalTalent} professionals</span>}
                {stats.totalTalent > 0 && stats.categories > 0 && ' · '}
                {stats.categories > 0 && <span>{stats.categories} categories</span>}
              </p>
            )}
          </div>
        </div>
      </section>

      <CategoryNavBar
        categories={categories}
        loading={categoriesLoading}
        basePath={currentBasePath}
      />

      {(categoriesLoading || displayCategories.length > 0) && (
        <section className="py-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-zinc-100">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">Browse categories</h2>
                <p className="text-zinc-600 mt-1 text-sm">Live taxonomy from the marketplace API.</p>
              </div>
              <Link
                to={currentBasePath}
                className="hidden md:inline-flex items-center gap-2 text-[#4C1D95] font-bold text-sm hover:underline"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {categoriesLoading && displayCategories.length === 0 && (
              <p className="text-zinc-500 text-sm">Loading categories…</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {displayCategories.map((category) => (
                <CategoryTile
                  key={category.id}
                  title={category.name}
                  subtitle={category.description}
                  count={category.stats?.talentCount ?? category.stats?.count}
                  countLabel="profiles"
                  badge={category.kind}
                  to={`${currentBasePath}?section=${encodeURIComponent(category.slug || category.id)}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {(talentLoading || featuredTalent.length > 0) && (
        <section className="py-16 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">Featured talent</h2>
                <p className="text-zinc-600 mt-1 text-sm">Profiles synced from search — no placeholder listings.</p>
              </div>
              <Link
                to="/search-results"
                className="text-[#4C1D95] font-bold text-sm hover:underline self-start"
              >
                View all results
              </Link>
            </div>

            {talentLoading && featuredTalent.length === 0 && (
              <p className="text-zinc-500 text-sm">Loading talent…</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {featuredTalent.map((talent) => (
                <FreelancerCard freelancer={talent} key={talent.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FindTalentLanding;


