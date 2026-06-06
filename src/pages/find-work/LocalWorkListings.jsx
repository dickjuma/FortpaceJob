import React, { useEffect, useState } from 'react';
import { Clock, Filter, MapPin, Search, Sparkles, Star, Zap, Loader2 } from 'lucide-react';
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
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white border border-zinc-200 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#0f766e] p-8 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold tracking-wide mb-4">
                    <Sparkles className="w-4 h-4 text-amber-200" /> Local gigs with premium client briefs
                  </div>
                  <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black leading-tight">Find the best local work in your region</h1>
                      <p className="mt-4 max-w-2xl text-zinc-100 text-lg">Search verified local jobs, urgent dispatches, and specialty services that match your skills and availability.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="rounded-3xl bg-white/10 p-4">
                        <div className="text-sm uppercase tracking-[0.2em] font-bold text-white/70">Matches</div>
                        <div className="mt-2 text-3xl font-black">{localJobs.length}</div>
                      </div>
                      <div className="rounded-3xl bg-white/10 p-4">
                        <div className="text-sm uppercase tracking-[0.2em] font-bold text-white/70">Specialties</div>
                        <div className="mt-2 text-3xl font-black">{Math.max(specializations.length - 1, 0)}</div>
                      </div>
                      <div className="rounded-3xl bg-white/10 p-4">
                        <div className="text-sm uppercase tracking-[0.2em] font-bold text-white/70">Sync status</div>
                        <div className="mt-2 text-3xl font-black flex items-center justify-center gap-2">
                          {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : '✓'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <form onSubmit={handleSearchSubmit} className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                      <label className="block">
                        <span className="text-sm font-semibold text-zinc-700">Search local work</span>
                        <div className="relative mt-2 rounded-3xl border border-zinc-200 bg-white shadow-sm focus-within:border-[#2bb75c]">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search local services or job titles..."
                            className="w-full rounded-3xl border-0 bg-transparent py-4 pl-12 pr-4 text-sm text-zinc-900 focus:outline-none"
                          />
                        </div>
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-zinc-700">Location</span>
                        <div className="relative mt-2 rounded-3xl border border-zinc-200 bg-white shadow-sm focus-within:border-[#2bb75c]">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="text"
                            value={locationQuery}
                            onChange={(event) => setLocationQuery(event.target.value)}
                            className="w-full rounded-3xl border-0 bg-transparent py-4 pl-12 pr-4 text-sm text-zinc-900 focus:outline-none"
                          />
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => setUrgentOnly((current) => !current)}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                          urgentOnly
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        <Zap className="w-4 h-4" /> Urgent Only
                      </button>
                      <span className="text-sm text-zinc-500">Specialty filters:</span>
                      <div className="flex flex-wrap gap-2">
                        {specializations.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setSelectedSpecialization(item)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                              selectedSpecialization === item
                                ? 'bg-[#2bb75c] text-white'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                            }`}
                          >
                            {item === 'all' ? 'All Specialties' : item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                      <button type="submit" className="rounded-3xl bg-[#2bb75c] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#1d8d38] transition-colors">
                        Refresh local matches
                      </button>
                      <span className="inline-flex items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
                        {localJobs.length} gigs found • {selectedSpecialization === 'all' ? 'all specialties' : selectedSpecialization}
                      </span>
                    </div>
                  </form>
                </div>
              </div>

              <div className="grid gap-4">
                {localJobs.map((job) => (
                  <div
                    key={job.id}
                    onMouseEnter={() => setActiveCard(job.id)}
                    onMouseLeave={() => setActiveCard(null)}
                    className={`group rounded-[1.75rem] border p-6 transition-all ${
                      featuredJob && featuredJob.id === job.id
                        ? 'border-emerald-500 shadow-2xl ring-1 ring-emerald-500/20'
                        : 'border-zinc-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-black text-zinc-900 mb-2">{job.title}</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">{job.summary}</p>
                      </div>
                      <div className="rounded-3xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700">{job.budgetLabel}</div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-zinc-600 mb-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-2">{job.specialization}</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-2">{job.locationLabel}</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-2">{job.durationLabel}</span>
                    </div>

                    <div className="flex flex-wrap justify-between gap-3 items-center pt-4 border-t border-zinc-100 text-sm">
                      <span className="font-semibold text-zinc-900">{job.client.name}</span>
                      <Link to={job.detailPath} className="rounded-full bg-[#2bb75c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d8d38]">
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[2rem] overflow-hidden border border-zinc-200 shadow-2xl bg-zinc-900 text-white min-h-[720px]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                alt="City map backdrop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="space-y-5 max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Local-first discovery
                  </span>
                  <h2 className="text-4xl font-black leading-tight">A beautifully designed local work hub that feels premium, fast, and curated.</h2>
                  <p className="max-w-2xl text-sm text-zinc-200/90">Track urgent dispatches, compare nearby clients, and connect with local opportunities that reward speed, quality, and trust.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/10 p-5">
                      <div className="text-sm uppercase tracking-[0.2em] text-zinc-300">Best nearby</div>
                      <div className="mt-3 text-2xl font-black">{featuredJob ? featuredJob.locationLabel : 'Nairobi'}</div>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-5">
                      <div className="text-sm uppercase tracking-[0.2em] text-zinc-300">Next to hire</div>
                      <div className="mt-3 text-2xl font-black">{featuredJob ? featuredJob.client.name : 'Top clients'}</div>
                    </div>
                  </div>
                </div>

                {featuredJob ? (
                  <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-emerald-200 font-semibold">Featured urgent gig</div>
                        <h3 className="mt-3 text-2xl font-black leading-tight">{featuredJob.title}</h3>
                      </div>
                      {featuredJob.urgent && (
                        <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-200">Urgent</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-200 mb-5">{featuredJob.summary}</p>
                    <div className="grid gap-4 sm:grid-cols-3 text-sm text-zinc-200 mb-5">
                      <div>
                        <div className="text-zinc-400 uppercase tracking-[0.2em] text-[10px] font-semibold">Budget</div>
                        <div className="mt-2 font-black text-white">{featuredJob.budgetLabel}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 uppercase tracking-[0.2em] text-[10px] font-semibold">Location</div>
                        <div className="mt-2 font-black text-white">{featuredJob.locationLabel}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 uppercase tracking-[0.2em] text-[10px] font-semibold">Client</div>
                        <div className="mt-2 font-black text-white">{featuredJob.client.name}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link to={featuredJob.detailPath} className="rounded-3xl bg-[#2bb75c] px-5 py-3 text-center text-sm font-bold text-zinc-950 transition hover:bg-[#1d8d38]">
                        View Details
                      </Link>
                      <Link to={featuredJob.proposalPath} className="rounded-3xl border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                        Submit Proposal
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-white/15 p-6 bg-white/5 text-sm text-zinc-200">
                    No featured local gig selected yet. Explore the listings on the left to preview urgent opportunities and client briefs.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
