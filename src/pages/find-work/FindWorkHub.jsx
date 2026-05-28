import React, { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Code,
  Globe,
  MapPin,
  Monitor,
  Palette,
  Search,
  Sparkles,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getFeaturedFindWorkJobs,
  getFindWorkCategories,
  getFindWorkStats,
} from './findWorkData';

const CATEGORY_ICONS = {
  'web-development': Code,
  'design-creative': Palette,
  'marketing-sales': TrendingUp,
  'data-ai': BrainCircuit,
  'local-services': MapPin,
};

export default function FindWorkHub() {
  const navigate = useNavigate();
  const [workType, setWorkType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = getFindWorkCategories();
  const featuredJobs = getFeaturedFindWorkJobs(3);
  const stats = getFindWorkStats();

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    if (workType === 'online') {
      navigate(`/find-work/online${params.toString() ? `?${params.toString()}` : ''}`);
      return;
    }

    if (workType === 'local') {
      navigate(`/find-work/local${params.toString() ? `?${params.toString()}` : ''}`);
      return;
    }

    params.set('type', 'all');
    navigate(`/find-work/search?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-surface-dark text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-success/20 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-bold tracking-wide mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" /> Marketplace-ready work discovery
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Find serious work, faster.</h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Explore high-signal remote contracts and local gigs with better classification, verified clients, and proposal-ready detail pages.
            </p>
          </div>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2 max-w-5xl mx-auto">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search for jobs, skills, deliverables, or clients..."
                className="w-full pl-12 pr-4 py-4 text-zinc-900 text-lg bg-transparent focus:outline-none placeholder:text-zinc-400 font-medium"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="w-px bg-zinc-200 hidden md:block" />
            <div className="flex gap-2 p-2 bg-surface rounded-xl md:w-auto w-full">
              {[
                { id: 'all', label: 'All', icon: Briefcase },
                { id: 'online', label: 'Online', icon: Globe },
                { id: 'local', label: 'Local', icon: MapPin },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setWorkType(id)}
                  className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                    workType === id
                      ? 'bg-white shadow-sm text-brand-600 border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
            <button type="submit" className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors md:ml-2 text-center">
              Find Work
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left">
              <div className="text-xs uppercase tracking-wider text-zinc-300 mb-1">Online Jobs</div>
              <div className="text-2xl font-black">{stats.onlineJobs}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left">
              <div className="text-xs uppercase tracking-wider text-zinc-300 mb-1">Local Gigs</div>
              <div className="text-2xl font-black">{stats.localJobs}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left">
              <div className="text-xs uppercase tracking-wider text-zinc-300 mb-1">Verified Clients</div>
              <div className="text-2xl font-black">{stats.verifiedJobs}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left">
              <div className="text-xs uppercase tracking-wider text-zinc-300 mb-1">Urgent Dispatches</div>
              <div className="text-2xl font-black">{stats.urgentJobs}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <div className="flex justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Browse Categories</h2>
                <p className="text-zinc-600">Real categories, consistent counts, and working detail pages.</p>
              </div>
              <Link to="/find-work/categories" className="text-brand-600 font-bold text-sm hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
              {categories.map((category) => {
                const Icon = CATEGORY_ICONS[category.id] || Briefcase;
                return (
                  <Link
                    key={category.id}
                    to={category.path}
                    className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-brand-300 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${category.accentClass}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 mb-2 group-hover:text-brand-600 transition-colors">{category.name}</h3>
                    <p className="text-zinc-500 font-medium text-sm mb-3">{category.summary}</p>
                    <div className="text-sm font-black text-zinc-900">{category.openJobs} open jobs</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Featured Opportunities</h2>
                <p className="text-zinc-600">Prioritized by verified clients, urgency, and current hiring momentum.</p>
              </div>
              <Link to="/find-work/search?type=all" className="text-brand-600 font-bold text-sm hover:underline">
                Explore All Results
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col h-full relative">
                  {job.urgent && (
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                      Urgent Need
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className={job.workMode === 'local' ? 'text-amber-600' : 'text-brand-600'}>{job.workModeLabel}</span>
                    <span className="text-zinc-300">/</span>
                    <span className="text-zinc-500">{job.category.name}</span>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 mb-3 line-clamp-2 leading-snug">{job.title}</h3>
                  <p className="text-zinc-600 text-sm mb-4">{job.summary}</p>
                  <div className="font-black text-zinc-900 text-lg mb-4">
                    {job.budgetLabel}
                    <span className="text-sm font-medium text-zinc-500 font-normal ml-2">({job.budgetType})</span>
                  </div>

                  <div className="mt-auto space-y-2 pt-4 border-t border-zinc-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Client</span>
                      <span className="font-bold text-zinc-900">{job.client.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Applicants</span>
                      <span className="font-bold text-zinc-900">{job.applicants}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-2 font-medium">
                      <Monitor className="w-3.5 h-3.5" /> {job.postedLabel}
                    </div>
                  </div>
                  <Link
                    to={job.detailPath}
                    className="mt-6 w-full py-3 bg-surface hover:bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
