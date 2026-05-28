import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Search, Sparkles, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import {
  formatCompactNumber,
  getFeaturedTalent,
  getMarketplaceStats,
  getRecentMarketplaceActivity,
  getTalentCategories,
} from './find-talent/talentMarketplaceData';

const FindTalentLanding = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('all');
  const stats = getMarketplaceStats();
  const featuredTalent = getFeaturedTalent();
  const categories = getTalentCategories('all').slice(0, 6);
  const activity = getRecentMarketplaceActivity();

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    if (mode !== 'all') {
      params.set('mode', mode);
    }
    navigate(`/search-results${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <>
      <section className="bg-surface-dark text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.16),_transparent_30%)]" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 text-brand-300" />
                Premium talent marketplace for remote, onsite, and hybrid hiring
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                Build your team with vetted talent that is actually ready to ship.
              </h1>
              <p className="text-lg text-zinc-300 max-w-2xl mb-8">
                Search specialists, compare profiles, invite shortlisted talent, and move directly into hiring without leaving the marketplace flow.
              </p>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-3 shadow-2xl max-w-4xl">
                <div className="grid md:grid-cols-[1fr,220px,160px] gap-3">
                  <label className="flex items-center bg-surface rounded-xl px-4 py-3 border border-zinc-200">
                    <Search className="w-5 h-5 text-zinc-400 mr-3" />
                    <input
                      className="w-full bg-transparent border-none outline-none text-zinc-900"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search by skill, title, service, or category"
                      value={query}
                    />
                  </label>
                  <select
                    className="bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 font-medium outline-none"
                    onChange={(event) => setMode(event.target.value)}
                    value={mode}
                  >
                    <option value="all">Remote, onsite, and hybrid</option>
                    <option value="online">Remote only</option>
                    <option value="onsite">Onsite only</option>
                    <option value="hybrid">Hybrid ready</option>
                  </select>
                  <button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-6 py-3 font-bold transition-colors" type="submit">
                    Find Talent
                  </button>
                </div>
              </form>

              <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-4xl">
                <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black">{formatCompactNumber(stats.totalTalent)}</div>
                  <div className="text-sm text-zinc-300">Active marketplace talent profiles</div>
                </div>
                <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black">{formatCompactNumber(stats.verifiedTalent)}</div>
                  <div className="text-sm text-zinc-300">Verified professionals and agencies</div>
                </div>
                <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black">{stats.categories}</div>
                  <div className="text-sm text-zinc-300">Core hiring categories across online and onsite work</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl text-zinc-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">Live Market</div>
                  <h2 className="text-2xl font-black mt-2">Hiring signal snapshot</h2>
                </div>
                <Users className="w-8 h-8 text-brand-600" />
              </div>

              <div className="space-y-4 mb-6">
                {activity.map((entry) => (
                  <div key={entry.actor} className="rounded-2xl bg-surface p-4 border border-zinc-200">
                    <div className="font-semibold text-zinc-900">{entry.actor}</div>
                    <div className="text-sm text-zinc-600">{entry.action}</div>
                    <div className="text-xs text-zinc-400 mt-1">{entry.time}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link to="/recommended-talent" className="rounded-2xl border border-zinc-200 p-4 hover:border-brand-300 hover:bg-brand-50/50 transition-colors">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">AI Match</div>
                  <div className="font-bold">Get matched instantly</div>
                </Link>
                <Link to="/shortlist" className="rounded-2xl border border-zinc-200 p-4 hover:border-brand-300 hover:bg-brand-50/50 transition-colors">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">Shortlist</div>
                  <div className="font-bold">Review saved candidates</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-zinc-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-zinc-900">Browse by hiring lane</h2>
              <p className="text-zinc-600 mt-2">Every card below routes into live category and marketplace views.</p>
            </div>
            <Link to="/categories" className="hidden md:inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700">
              View all categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 18 }}
                key={category.id}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link
                  className="block h-full rounded-3xl border border-zinc-200 bg-surface p-6 hover:border-brand-300 hover:bg-white hover:shadow-xl transition-all"
                  to={`/categories/${category.kind}/${category.id}`}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">{category.kind}</div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-3">{category.name}</h3>
                  <p className="text-zinc-600 mb-4">{category.description}</p>
                  <div className="text-sm font-semibold text-brand-600">{category.hourlyRange}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-zinc-900">Featured marketplace talent</h2>
              <p className="text-zinc-600 mt-2">Top rated specialists, agencies, and hybrid operators from the shared marketplace model.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/top-rated" className="px-5 py-3 rounded-xl bg-white border border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-50">
                Top Rated
              </Link>
              <Link to="/verified" className="px-5 py-3 rounded-xl bg-surface-dark text-white font-semibold hover:bg-zinc-800">
                Verified Talent
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredTalent.map((talent) => (
              <FreelancerCard freelancer={talent} key={talent.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-700 opacity-70 blur-3xl" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                Fortspace Enterprise Hiring
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Run sourcing, evaluation, and outreach from one hiring surface.</h2>
              <p className="text-brand-100 text-lg mb-8">
                The marketplace now connects discovery, profile review, invite flows, compare flows, and hiring setup as one journey instead of isolated pages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/enterprise" className="px-8 py-4 bg-white text-brand-600 hover:bg-surface font-semibold rounded-xl transition-colors shadow-lg">
                  Explore Enterprise
                </Link>
                <Link to="/search-results?mode=hybrid" className="px-8 py-4 bg-transparent border border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-colors">
                  Browse Hybrid Talent
                </Link>
              </div>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="font-black text-zinc-900 text-xl mb-5">Marketplace readiness checklist</h3>
              <div className="space-y-4">
                {[
                  'Shared data across search, profile, compare, shortlist, and invite flows',
                  'Dynamic profile and hiring routes tied to selected talent',
                  'Functional category, trust, rate, and availability filtering',
                ].map((item) => (
                  <div className="flex items-start gap-3" key={item}>
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                    <div className="text-zinc-700">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FindTalentLanding;
