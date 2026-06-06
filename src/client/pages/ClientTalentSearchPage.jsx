import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Heart, MessageSquare, Building2,
  Grid, List, SlidersHorizontal, X, ShieldCheck
} from 'lucide-react';
import { useFreelancers, useAddToShortlist } from '../services/clientHooks';
import { useStartConversation } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = ['All', 'Software & Tech', 'Design & Creative', 'Writing & Content', 'Marketing', 'Finance', 'Engineering', 'Other'];
const EXPERIENCE = ['', 'BEGINNER', 'INTERMEDIATE', 'EXPERT'];
const TALENT_TYPES = [
  { value: '', label: 'All Talent' },
  { value: 'INDIVIDUAL', label: 'Individuals' },
  { value: 'SME', label: 'SMEs / Studios' },
  { value: 'CORPORATE', label: 'Corporate Teams' },
];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'rate_low', label: 'Rate: Low to High' },
  { value: 'rate_high', label: 'Rate: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function ClientTalentSearchPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [experience, setExperience] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [rateMin, setRateMin] = useState('');
  const [rateMax, setRateMax] = useState('');
  const [sellerType, setSellerType] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  const filters = {
    page, limit: 12,
    ...(search && { q: search }),
    ...(category !== 'All' && { category }),
    ...(experience && { experience }),
    ...(sortBy && { sort: sortBy }),
    ...(rateMin && { rateMin }),
    ...(rateMax && { rateMax }),
    ...(sellerType && { accountType: sellerType }),
  };

  const { data, isLoading, error, refetch } = useFreelancers(filters);
  const addToShortlist = useAddToShortlist();
  const startConversation = useStartConversation();

  const freelancers = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  const handleSave = async (e, freelancerId) => {
    e.stopPropagation();
    const isSaved = savedIds.has(freelancerId);
    if (isSaved) {
      setSavedIds(prev => { const n = new Set(prev); n.delete(freelancerId); return n; });
      toast.success('Removed from shortlist');
      return;
    }
    try {
      await addToShortlist.mutateAsync(freelancerId);
      setSavedIds(prev => new Set(prev).add(freelancerId));
      toast.success('Saved to shortlist!');
    } catch (_) {}
  };

  const handleMessage = async (e, freelancerId) => {
    e.stopPropagation();
    try {
      await startConversation.mutateAsync({ participantId: freelancerId });
      navigate(`/client/messages`);
    } catch (_) { navigate('/client/messages'); }
  };

  // Generate a random gradient pattern for the cover image placeholder based on user ID string
  const getGradient = (str = '') => {
    const gradients = [
      'from-success/40 to-success/40',
      'from-#4C1D95]/40 to-[#22C55E]/40',
      'from-success/40 to-emerald-600/40',
      'from-orange-400/40 to-red-500/40',
      'from-pink-500/40 to-rose-600/40'
    ];
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  const renderFreelancerCard = (f) => {
    const fId = f.id || f.userId;
    const isSaved = savedIds.has(fId);
    const name = f.name || (f.actor?.user ? `${f.actor.user.firstName || ''} ${f.actor.user.lastName || ''}`.trim() : null) || `${f.firstName || ''} ${f.lastName || ''}`.trim() || 'Freelancer';
    const initial = name[0]?.toUpperCase();
    const avatar = f.avatar || f.profilePicture;
    const rating = Number(f.rating || f.ratingAverage || f.averageRating || 0);
    const rate = Number(f.hourlyRate || f.rate || 0);
    const talentType = (f.accountType || f.businessStructure || 'INDIVIDUAL').toUpperCase();

    return (
      <div 
        key={fId} 
        onClick={() => navigate(`/client/freelancers/${fId}`)}
        className={`group bg-white border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer overflow-hidden ${viewMode === 'list' ? 'flex items-start rounded-xl h-48' : 'flex flex-col rounded-xl h-[420px] hover:shadow-xl hover:-translate-y-1'}`}
      >
        {/* Cover / Banner */}
        <div className={`${viewMode === 'list' ? 'w-64 h-full shrink-0' : 'w-full h-44'} relative bg-zinc-100 overflow-hidden`}>
          {f.portfolioBanner || f.coverImage ? (
            <img src={f.portfolioBanner || f.coverImage} alt="Portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(name)} group-hover:scale-105 transition-transform duration-500 flex items-center justify-center`}>
            </div>
          )}
          {f.isPro && (
             <div className="absolute top-3 left-3 bg-white text-[#4C1D95] px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider shadow-sm border border-zinc-100 flex items-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Pro
             </div>
          )}
        </div>

        {/* Content Body */}
        <div className={`flex flex-col flex-1 ${viewMode === 'list' ? 'p-6' : 'p-4'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-sm font-bold text-zinc-700 overflow-hidden shrink-0 relative">
              {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : initial}
              {f.isOnline && <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#4C1D95] border border-white rounded-full"></span>}
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 text-sm truncate group-hover:underline">{name}</h3>
              <p className="text-[10px] text-[#4C1D95] font-bold bg-[#4C1D95]/10 px-1.5 py-0.5 rounded">{f.level || 'Level 1'}</p>
            </div>
          </div>

          <p className="text-zinc-700 font-medium text-sm leading-snug line-clamp-2 hover:text-[#4C1D95] transition-colors mb-2 flex-1">
            {f.title || f.headline || `I will provide professional ${f.category || 'freelance'} services for your project`}
          </p>

          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-zinc-900 text-sm">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
            {f.reviewsCount > 0 && <span className="text-zinc-500 text-xs ml-1">({f.reviewsCount})</span>}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button onClick={(e) => handleSave(e, fId)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors">
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button onClick={(e) => handleMessage(e, fId)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#4C1D95] transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Starting at</p>
              <p className="font-black text-zinc-900 text-base">KES {rate.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-zinc-900 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* Hero Section */}
        <div className="bg-[#4C1D95] rounded-xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2850)' }}></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-black text-white mb-6">Find the perfect freelance services</h1>
            
            <form onSubmit={handleSearch} className="flex bg-white rounded-md overflow-hidden shadow-2xl max-w-xl mx-auto p-1">
              <div className="flex items-center pl-4">
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="What service are you looking for today?"
                className="w-full bg-transparent px-4 py-3 text-sm font-semibold text-zinc-900 placeholder-zinc-500 focus:outline-none"
              />
              <button type="submit" className="px-8 bg-[#4C1D95] hover:bg-[#22C55E] rounded text-white text-sm font-black transition-colors">
                Search
              </button>
            </form>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm font-semibold text-white/90">
              <span className="text-white/70">Popular:</span>
              {['Website Design', 'React Native', 'SEO', 'Logo Design'].map(term => (
                <button key={term} onClick={() => { setSearchInput(term); setSearch(term); }} className="px-4 py-1.5 rounded-full border border-white/40 hover:bg-white hover:text-[#4C1D95] transition-colors">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 bg-white px-6 rounded-xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-bold transition-colors ${showFilters ? 'bg-[#4C1D95]/10 text-[#4C1D95] border-[#4C1D95]/20' : 'bg-transparent text-zinc-700 border-zinc-300 hover:border-zinc-400'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <span className="text-sm font-bold text-zinc-500">{total.toLocaleString()} services available</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-1 bg-zinc-100 rounded-md p-1 border border-zinc-200">
               <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'text-zinc-900 bg-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}><Grid className="w-4 h-4" /></button>
               <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'text-zinc-900 bg-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 shadow-sm">
            <div>
              <label className="text-xs font-bold text-zinc-700 mb-2 block">Category</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#4C1D95] transition-colors">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 mb-2 block">Talent Type</label>
              <select value={sellerType} onChange={(e) => { setSellerType(e.target.value); setPage(1); }} className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#4C1D95] transition-colors">
                {TALENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 mb-2 block">Seller Level</label>
              <select value={experience} onChange={(e) => { setExperience(e.target.value); setPage(1); }} className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#4C1D95] transition-colors">
                <option value="">Any Level</option>
                {EXPERIENCE.filter(Boolean).map(e => <option key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 mb-2 block">Budget Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-bold">KES</span>
                <input type="number" value={rateMin} onChange={(e) => { setRateMin(e.target.value); setPage(1); }} placeholder="Min" className="w-full bg-white border border-zinc-300 rounded-md pl-10 pr-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#4C1D95] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 mb-2 block">Budget Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-bold">KES</span>
                <input type="number" value={rateMax} onChange={(e) => { setRateMax(e.target.value); setPage(1); }} placeholder="Max" className="w-full bg-white border border-zinc-300 rounded-md pl-10 pr-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#4C1D95] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 mb-2 block">Sort By</label>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#4C1D95] transition-colors">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            
            <div className="col-span-full flex justify-end mt-2 pt-4 border-t border-zinc-100">
              <button onClick={() => { setCategory('All'); setExperience(''); setSellerType(''); setRateMin(''); setRateMax(''); setSortBy('rating'); setSearch(''); setSearchInput(''); setPage(1); }} className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors">
                <X className="w-4 h-4" /> Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' : 'space-y-4'}>
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className={`bg-white border border-zinc-200 rounded-xl overflow-hidden ${viewMode === 'list' ? 'flex h-48' : 'h-[420px]'}`}>
                <div className={`${viewMode === 'list' ? 'w-64 h-full' : 'w-full h-44'} bg-zinc-200 animate-pulse`} />
                <div className="flex-1 p-4 space-y-4">
                  <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" /><div className="flex-1"><div className="w-24 h-3 bg-zinc-200 animate-pulse mb-2 rounded" /><div className="w-16 h-2 bg-zinc-200 animate-pulse rounded" /></div></div>
                  <div className="space-y-2"><div className="w-full h-4 bg-zinc-200 animate-pulse rounded" /><div className="w-3/4 h-4 bg-zinc-200 animate-pulse rounded" /></div>
                  <div className="w-16 h-4 bg-zinc-200 animate-pulse rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"><X className="w-8 h-8 text-red-500" /></div>
            <p className="text-zinc-800 font-bold">Oops! Something went wrong.</p>
            <button onClick={refetch} className="px-5 py-2 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors text-sm font-bold text-zinc-900">Try Again</button>
          </div>
        ) : freelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-zinc-900">No services found</h3>
              <p className="text-zinc-500 mt-1 text-sm font-medium">Try adjusting your filters or searching for something else.</p>
            </div>
            <button onClick={() => { setCategory('All'); setExperience(''); setRateMin(''); setRateMax(''); setSortBy('rating'); setSearch(''); setSearchInput(''); setPage(1); }} className="px-6 py-2.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-md text-sm font-bold transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' : 'space-y-4'}>
            {freelancers.map(renderFreelancerCard)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8 pb-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2 border border-zinc-300 rounded-md text-sm font-bold text-zinc-700 disabled:opacity-40 hover:bg-zinc-50 transition-colors bg-white">Previous</button>
            <div className="px-4 py-2 text-sm font-bold text-zinc-500">Page <span className="text-zinc-900">{page}</span> of {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-5 py-2 border border-zinc-300 rounded-md text-sm font-bold text-zinc-700 disabled:opacity-40 hover:bg-zinc-50 transition-colors bg-white">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}


