import React, { useState } from 'react';
import { MapPin, Search, Navigation, Filter, Map, List, Star, Loader2 } from 'lucide-react';
import { usePublicFreelancers } from '../common/hooks/usePublicDiscovery';

const NearbyProfessionals = () => {
  const [viewMode, setViewMode] = useState('map');
  const { talent, loading } = usePublicFreelancers({ workMode: 'onsite', limit: 24 });

  const onsitePros = talent.filter((p) => p.type === 'onsite' || p.type === 'hybrid');

  return (
    <>
      <div className="bg-surface-dark text-white pt-16 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6">Find Local Onsite Talent</h1>
            <p className="text-lg text-zinc-300 mb-8">
              Discover verified professionals ready to travel to your location.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${viewMode === 'map' ? 'bg-[#14a800] text-white' : 'bg-zinc-100 text-zinc-600'}`}>
              <Map className="w-4 h-4" /> Map
            </button>
            <button type="button" onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${viewMode === 'list' ? 'bg-[#14a800] text-white' : 'bg-zinc-100 text-zinc-600'}`}>
              <List className="w-4 h-4" /> List
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
          </div>
        ) : onsitePros.length === 0 ? (
          <p className="text-center text-zinc-500 font-medium py-16 bg-white rounded-2xl border border-zinc-200">
            No onsite professionals found in your area yet.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="text-sm font-bold text-zinc-900 px-1">{onsitePros.length} Professionals found</div>
            {onsitePros.map((pro) => (
              <div key={pro.id} className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {pro.imageUrl ? (
                    <img src={pro.imageUrl} alt={pro.name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600">{pro.name[0]}</div>
                  )}
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg">{pro.name}</h3>
                    <p className="text-sm text-zinc-500">{pro.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm font-bold text-zinc-700">
                      <Star className="w-4 h-4 text-amber-500 fill-current" /> {pro.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-zinc-900">${pro.hourlyRate}/hr</div>
                  <div className="text-xs text-zinc-500 flex items-center justify-end gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {pro.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NearbyProfessionals;
