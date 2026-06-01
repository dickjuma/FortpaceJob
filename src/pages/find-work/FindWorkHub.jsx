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
      <div className="bg-[#14a800] text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#118a00] via-[#14a800] to-[#0d7a00]" />
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
                      ? 'bg-white shadow-sm text-[#14a800] border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
            <button type="submit" className="px-8 py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl transition-colors md:ml-2 text-center">
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

      <CategoryNavBar
        categories={categories}
        loading={categoriesLoading}
        basePath="/find-work"
      />

      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <div className="flex justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Browse Categories</h2>
                <p className="text-zinc-600">Real categories, consistent counts, and working detail pages.</p>
              </div>
              <Link to="/find-work/categories" className="text-[#14a800] font-bold text-sm hover:underline">
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
              <Link to="/find-work/search?type=all" className="text-[#14a800] font-bold text-sm hover:underline">
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
