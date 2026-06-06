import React, { useState } from 'react';
import {
  Briefcase,
  Globe,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useFindWorkCategories,
  useFeaturedFindWorkJobs,
  useFindWorkStats,
} from '../../common/services/findWorkHooks';
import CategoryTile from '../../components/marketplace/CategoryTile';
import JobCard from '../../components/marketplace/JobCard';
import CategoryNavBar from '../../components/marketplace/CategoryNavBar';

export default function FindWorkHub() {
  const navigate = useNavigate();
  const [workType, setWorkType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories = [], isLoading: categoriesLoading } = useFindWorkCategories();
  const { data: featuredJobs = [], isLoading: jobsLoading } = useFeaturedFindWorkJobs(3);
  const { data: stats = { onlineJobs: 0, localJobs: 0, verifiedJobs: 0, urgentJobs: 0 } } = useFindWorkStats();

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
      <div className="bg-[#4C1D95] text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E] via-[#4C1D95] to-[#0d7a00]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-6xl text-white">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-bold tracking-wide mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" /> Marketplace-ready work discovery
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Find serious work, faster.</h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Explore high-signal remote contracts and local gigs with better classification, verified clients, and proposal-ready detail pages.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Remote jobs', value: stats.onlineJobs, icon: Globe },
                { label: 'Local gigs', value: stats.localJobs, icon: MapPin },
                { label: 'Verified clients', value: stats.verifiedJobs, icon: Briefcase },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-3xl bg-white/10 border border-white/15 px-5 py-4">
                  <div className="flex items-center gap-3 text-[#d7f9e3] mb-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-[#4C1D95]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-sm uppercase tracking-[0.21em] font-semibold">{label}</span>
                  </div>
                  <div className="text-3xl font-black text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="bg-white rounded-3xl p-3 md:p-4 shadow-2xl flex flex-col md:flex-row gap-3 max-w-5xl mx-auto">
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
                      ? 'bg-white shadow-sm text-[#4C1D95] border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
            <button type="submit" className="px-8 py-4 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors md:ml-2 text-center">
              Find Work
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto">
            {[
              { label: 'Online Jobs', value: stats.onlineJobs, accent: 'from-[#58d47b] to-[#4C1D95]' },
              { label: 'Local Gigs', value: stats.localJobs, accent: 'from-[#0ea5e9] to-[#6366f1]' },
              { label: 'Verified Clients', value: stats.verifiedJobs, accent: 'from-[#facc15] to-[#f97316]' },
              { label: 'Urgent Dispatches', value: stats.urgentJobs, accent: 'from-[#f43f5e] to-[#ec4899]' },
            ].map(({ label, value, accent }) => (
              <div key={label} className={`rounded-[2rem] bg-gradient-to-br ${accent} p-5 text-white shadow-2xl`}>
                <div className="text-xs uppercase tracking-[0.28em] font-semibold text-white/80 mb-3">{label}</div>
                <div className="text-3xl font-black">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryNavBar
        categories={categories}
        loading={categoriesLoading}
        basePath="/find-work"
      />

      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-2">Browse categories designed for discovery</h2>
                <p className="text-zinc-600 max-w-xl">Explore work categories that map directly to client briefs, role taxonomies, and search-ready job filters.</p>
              </div>
              <Link to="/find-work/categories" className="text-[#4C1D95] font-bold text-sm uppercase tracking-[0.18em] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {categoriesLoading && categories.length === 0 && (
                <p className="text-zinc-500 col-span-full">Loading categories…</p>
              )}
              {!categoriesLoading && categories.length === 0 && (
                <p className="text-zinc-500 col-span-full">No categories available yet.</p>
              )}
              {categories.map((category) => (
                <CategoryTile
                  key={category.id}
                  title={category.name}
                  subtitle={category.description}
                  count={category.openJobs}
                  countLabel="jobs"
                  to={category.path}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Featured Opportunities</h2>
                <p className="text-zinc-600">Prioritized by verified clients, urgency, and current hiring momentum.</p>
              </div>
              <Link to="/find-work/search?type=all" className="text-[#4C1D95] font-bold text-sm hover:underline">
                Explore All Results
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobsLoading && featuredJobs.length === 0 && (
                <p className="text-zinc-500 col-span-full">Loading opportunities…</p>
              )}
              {!jobsLoading && featuredJobs.length === 0 && (
                <p className="text-zinc-500 col-span-full">No featured jobs yet. Check back soon or browse all results.</p>
              )}
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


