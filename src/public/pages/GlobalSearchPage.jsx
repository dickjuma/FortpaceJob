import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import FreelancerCard from '../../components/marketplace/FreelancerCard';
import { useGlobalSearch } from '../../common/hooks/useGlobalSearch';

const TABS = [
  { id: 'freelancers', label: 'Freelancers' },
  { id: 'services', label: 'Services (Gigs)' },
  { id: 'agencies', label: 'Jobs' },
];

function mapFreelancer(row) {
  const id = row.id || row._id || row.userId;
  return {
    id,
    name: row.name || [row.firstName, row.lastName].filter(Boolean).join(' ') || row.username,
    title: row.title || row.professionalTitle,
    rating: row.rating,
    reviews: row.reviewCount || row.reviews,
    hourlyRate: row.hourlyRate,
    location: row.location || row.city,
    avatar: row.avatar || row.image,
    description: row.bio || row.description,
    skills: row.skills,
    workMode: row.workMode,
  };
}

function mapGig(row) {
  const id = row.id || row._id;
  return {
    id,
    title: row.title,
    slug: row.slug || id,
    price: row.price || row.minPrice,
    rating: row.rating,
    image: row.coverImage || row.thumbnail,
    freelancer: row.freelancer || row.seller,
  };
}

export default function GlobalSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'freelancers';

  const [query, setQuery] = useState(initialQ);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const { freelancers, gigs, jobs, isLoading } = useGlobalSearch(query, activeTab, true);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    next.set('tab', activeTab);
    setSearchParams(next);
  };

  const setTab = (id) => {
    setActiveTab(id);
    const next = new URLSearchParams(searchParams);
    next.set('tab', id);
    if (query.trim()) next.set('q', query.trim());
    setSearchParams(next);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col pt-[88px]">
      <div className="bg-white border-b border-zinc-200 sticky top-[72px] z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-0 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search talent, gigs, or jobs…"
                className="w-full pl-12 pr-4 py-3.5 text-sm font-medium text-zinc-900 outline-none"
              />
            </div>
            <button type="submit" className="px-8 bg-[#14a800] hover:bg-[#118a00] text-white font-bold text-sm">
              Search
            </button>
          </form>
          <div className="flex gap-6 mt-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id)}
                className={cn(
                  'pb-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'border-[#14a800] text-[#14a800]'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {!hasQuery && (
          <p className="text-zinc-500 text-center py-16">
            Enter a search term to find freelancers, gigs, and jobs from the live marketplace API.
          </p>
        )}

        {hasQuery && isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
          </div>
        )}

        {hasQuery && !isLoading && activeTab === 'freelancers' && (
          <>
            {freelancers.length === 0 ? (
              <EmptyState label="freelancers" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {freelancers.map((row) => (
                  <FreelancerCard key={row.id || row._id} freelancer={mapFreelancer(row)} />
                ))}
              </div>
            )}
          </>
        )}

        {hasQuery && !isLoading && activeTab === 'services' && (
          <>
            {gigs.length === 0 ? (
              <EmptyState label="gigs" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gigs.map((row) => {
                  const g = mapGig(row);
                  return (
                    <Link
                      key={g.id}
                      to={`/gigs/gig/${g.slug || g.id}`}
                      className="block bg-white border border-zinc-200 rounded-xl p-4 hover:border-[#14a800]/40 hover:shadow-sm transition-all"
                    >
                      {g.image && (
                        <img src={g.image} alt="" className="w-full h-36 object-cover rounded-lg mb-3" />
                      )}
                      <h3 className="font-bold text-zinc-900 text-sm line-clamp-2">{g.title}</h3>
                      {g.price != null && (
                        <p className="text-xs text-zinc-500 mt-2">From KES {Number(g.price).toLocaleString()}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {hasQuery && !isLoading && activeTab === 'agencies' && (
          <>
            {jobs.length === 0 ? (
              <EmptyState label="jobs" />
            ) : (
              <div className="space-y-3">
                {jobs.map((row) => {
                  const id = row.id || row._id;
                  return (
                    <Link
                      key={id}
                      to={`/find-work/work/${id}`}
                      className="block bg-white border border-zinc-200 rounded-xl p-5 hover:border-[#14a800]/40"
                    >
                      <h3 className="font-bold text-zinc-900">{row.title}</h3>
                      {row.description && (
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{row.description}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <p className="text-center text-zinc-500 py-16">
      No {label} matched your search. Try different keywords or browse{' '}
      <Link to="/find-talent" className="text-[#14a800] font-bold">
        Find Talent
      </Link>{' '}
      /{' '}
      <Link to="/find-work" className="text-[#14a800] font-bold">
        Find Work
      </Link>
      .
    </p>
  );
}
