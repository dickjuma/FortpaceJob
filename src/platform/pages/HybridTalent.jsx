import React, { useState } from 'react';
import { Globe, Layers, MapPin, Search, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import OnsiteWorkerCard from '../components/marketplace/OnsiteWorkerCard';
import { useMarketplaceTalent } from '../common/services/talentHooks';

const HybridTalent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const { data: talent = [], isLoading } = useMarketplaceTalent({
    query,
    mode: activeTab === 'all' ? 'all' : activeTab,
    location,
    sortBy: 'recommended',
  });

  const filtered = talent.filter((entry) => entry.modes.includes('hybrid') || activeTab !== 'hybrid');

  const renderCard = (entry) =>
    entry.modes.includes('onsite') ? <OnsiteWorkerCard key={entry.id} worker={entry} /> : <FreelancerCard freelancer={entry} key={entry.id} />;

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    if (location.trim()) {
      params.set('location', location.trim());
    }
    params.set('mode', activeTab === 'all' ? 'hybrid' : activeTab);
    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-surface-dark pt-8 pb-12 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C1D95]/10 border border-[#4C1D95]/50/20 text-[#4C1D95] text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Hybrid Talent Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">The complete workforce for distributed teams</h1>
            <p className="text-zinc-400 text-lg mb-8">
              Combine remote specialists, onsite experts, and hybrid operators into one marketplace-ready hiring workflow.
            </p>

            <form className="bg-white rounded-xl p-2 shadow-lg flex flex-col md:flex-row gap-2 max-w-4xl" onSubmit={submitSearch}>
              <div className="flex-1 flex items-center px-4 py-2.5 bg-surface rounded-lg">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  className="w-full bg-transparent border-none outline-none text-zinc-800"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="What roles or services do you need?"
                  value={query}
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-2.5 bg-surface rounded-lg">
                <MapPin className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  className="w-full bg-transparent border-none outline-none text-zinc-800"
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location (optional)"
                  value={location}
                />
              </div>
              <button className="bg-[#4C1D95] hover:bg-[#22C55E] text-white px-8 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm shadow-#4C1D95]/20" type="submit">
                Match Talent
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-zinc-100 p-1.5 rounded-xl inline-flex shadow-inner flex-wrap">
            <button
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
              onClick={() => setActiveTab('all')}
              type="button"
            >
              <Layers className="w-4 h-4" /> All Talent
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'online' ? 'bg-white text-[#4C1D95] shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
              onClick={() => setActiveTab('online')}
              type="button"
            >
              <Globe className="w-4 h-4" /> Online Only
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'onsite' ? 'bg-white text-success shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
              onClick={() => setActiveTab('onsite')}
              type="button"
            >
              <MapPin className="w-4 h-4" /> Onsite Only
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'hybrid' ? 'bg-white text-[#4C1D95] shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
              onClick={() => setActiveTab('hybrid')}
              type="button"
            >
              <Sparkles className="w-4 h-4" /> Hybrid Ready
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Recommended hybrid-ready matches</h3>
          <p className="text-zinc-600 mb-6">These results combine mode, location, and role coverage from the shared marketplace dataset.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white border border-zinc-200 rounded-2xl p-6 animate-pulse h-72" />
              ))
            : filtered.length === 0 ? (
                <div className="col-span-full bg-white border border-dashed border-zinc-300 rounded-2xl p-10 text-center text-zinc-600">
                  No hybrid professionals match your search yet. Try broadening the role query or switching tabs.
                </div>
              )
            : filtered.map((entry) => renderCard(entry))}
        </div>
      </div>
    </>
  );
};

export default HybridTalent;


