import React from 'react';
import { Zap, Star, Clock, Loader2 } from 'lucide-react';
import { usePublicFreelancers } from '../common/hooks/usePublicDiscovery';

const LiveAvailability = () => {
  const { talent, loading } = usePublicFreelancers({ availableNow: true, limit: 24 });

  return (
    <>
      <div className="bg-[#4C1D95] text-white py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-amber-300" />
          <h1 className="text-4xl font-black mb-4">Available Now</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">Professionals ready to start immediately.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
          </div>
        ) : talent.length === 0 ? (
          <p className="text-center text-zinc-500 font-medium py-16">No professionals are marked available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talent.map((pro) => (
              <div key={pro.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  {pro.imageUrl ? (
                    <img src={pro.imageUrl} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center font-bold">{pro.name[0]}</div>
                  )}
                  <div>
                    <h3 className="font-bold text-zinc-900">{pro.name}</h3>
                    <p className="text-sm text-zinc-500">{pro.title}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 font-bold"><Star className="w-4 h-4 text-amber-500 fill-current" /> {pro.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-1 text-zinc-500"><Clock className="w-4 h-4" /> ${pro.hourlyRate}/hr</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LiveAvailability;


