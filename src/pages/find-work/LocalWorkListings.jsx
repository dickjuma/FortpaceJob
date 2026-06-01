import React, { useEffect, useState } from 'react';
import { Clock, Filter, MapPin, Search, Star, Zap, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getFindWorkJobs, subscribeToFindWorkData, syncJobsWithBackend, loadFindWorkCategories } from './findWorkData';

export default function LocalWorkListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [locationQuery, setLocationQuery] = useState('Nairobi, Kenya');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [activeCard, setActiveCard] = useState(null);
  const [, setDataVersion] = useState(0);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToFindWorkData(() => setDataVersion((v) => v + 1));
    Promise.all([loadFindWorkCategories(), syncJobsWithBackend({ workMode: 'local' })]).finally(() =>
      setSyncing(false)
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const localJobs = getFindWorkJobs({
    workMode: 'local',
    query,
    locationQuery,
    urgentOnly,
    sortBy: urgentOnly ? 'recommended' : 'newest',
  }).filter((job) => selectedSpecialization === 'all' || job.specialization === selectedSpecialization);

  const featuredJob = localJobs.find((job) => job.id === activeCard) || localJobs[0] || null;
  const specializations = ['all', ...new Set(getFindWorkJobs({ workMode: 'local' }).map((job) => job.specialization))];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) {
      next.set('q', query.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row relative">
        <div className="w-full md:w-[470px] bg-white border-r border-zinc-200 h-full flex flex-col z-10 shadow-xl">
          <div className="p-5 border-b border-zinc-200 bg-surface-dark text-white">
            <h1 className="font-black text-2xl mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-success" /> Local Gigs
            </h1>
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search local services or job titles..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none font-medium placeholder:text-zinc-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none font-medium text-zinc-300"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar mt-2">
                <button
                  type="button"
                  onClick={() => setUrgentOnly((current) => !current)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 border ${
                    urgentOnly
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  <Zap className="w-3 h-3 fill-current" /> Urgent Only
                </button>
                {specializations.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelectedSpecialization(item)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 border ${
                      selectedSpecialization === item
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    <Filter className="w-3 h-3" /> {item === 'all' ? 'All Specialties' : item}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
            <div className="font-bold text-sm text-zinc-500 px-1">Found {localJobs.length} local gigs near your search area</div>
            {localJobs.map((job) => (
              <div
                key={job.id}
                onMouseEnter={() => setActiveCard(job.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all ${
                  featuredJob && featuredJob.id === job.id
                    ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 shadow-sm hover:border-emerald-300'
                }`}
              >
                {job.urgent && (
                  <div className="mb-3 inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Urgent Dispatch
                  </div>
                )}

                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-lg text-zinc-900 leading-tight">{job.title}</h3>
                  <div className="font-black text-zinc-900 text-right shrink-0">{job.budgetLabel}</div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-success mb-4 bg-emerald-50 inline-block px-2 py-1 rounded">
                  {job.specialization}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                    <MapPin className="w-4 h-4 text-zinc-400" /> {job.locationLabel}
                    {job.distanceLabel ? <span className="text-zinc-400 text-xs">({job.distanceLabel})</span> : null}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                    <Clock className="w-4 h-4 text-zinc-400" /> {job.durationLabel}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {job.client.rating} Client Rating
                  </span>
                  <Link to={job.detailPath} className="text-success text-sm font-bold hover:underline">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-zinc-200 relative h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            className="w-full h-full object-cover opacity-60 grayscale"
            alt="City map backdrop"
          />
          <div className="absolute inset-0 bg-success/10 mix-blend-overlay" />

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button type="button" className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center font-bold text-xl hover:bg-surface border border-zinc-200 text-zinc-700">
              +
            </button>
            <button type="button" className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center font-bold text-xl hover:bg-surface border border-zinc-200 text-zinc-700">
              -
            </button>
          </div>

          {featuredJob ? (
            <div className="absolute left-6 right-6 bottom-6 bg-white/95 backdrop-blur border border-zinc-200 rounded-3xl shadow-2xl p-6 max-w-xl">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">{featuredJob.specialization}</div>
                  <h2 className="text-2xl font-black text-zinc-900 leading-tight">{featuredJob.title}</h2>
                </div>
                {featuredJob.urgent ? (
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">Urgent</span>
                ) : null}
              </div>
              <p className="text-zinc-600 mb-4">{featuredJob.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-5">
                <div>
                  <div className="text-zinc-400 uppercase tracking-wider text-[11px] font-bold mb-1">Budget</div>
                  <div className="font-black text-zinc-900">{featuredJob.budgetLabel}</div>
                </div>
                <div>
                  <div className="text-zinc-400 uppercase tracking-wider text-[11px] font-bold mb-1">Location</div>
                  <div className="font-bold text-zinc-900">{featuredJob.locationLabel}</div>
                </div>
                <div>
                  <div className="text-zinc-400 uppercase tracking-wider text-[11px] font-bold mb-1">Client</div>
                  <div className="font-bold text-zinc-900">{featuredJob.client.name}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={featuredJob.detailPath} className="px-6 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl text-center">
                  View Details
                </Link>
                <Link to={featuredJob.proposalPath} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl text-center">
                  Submit Proposal
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
