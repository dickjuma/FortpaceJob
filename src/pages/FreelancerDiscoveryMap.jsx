import React from 'react';
import { Map, Star, Loader2 } from 'lucide-react';
import { usePublicFreelancers } from '../common/hooks/usePublicDiscovery';

const FreelancerDiscoveryMap = () => {
  const { talent, loading } = usePublicFreelancers({ limit: 30 });

  return (
    <>
      <div className="bg-white border-b border-zinc-200 py-10 pt-24">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-black text-zinc-900 mb-2 flex items-center gap-2">
            <Map className="w-8 h-8 text-[#4C1D95]" /> Talent Discovery Map
          </h1>
          <p className="text-zinc-600">Browse freelancers by location and availability.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="bg-zinc-100 border border-zinc-200 rounded-3xl h-64 mb-8 flex items-center justify-center text-zinc-500 font-medium">
          Map view loads talent from the platform directory below.
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
          </div>
        ) : talent.length === 0 ? (
          <p className="text-center text-zinc-500 font-medium py-12">No talent to display on the map yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {talent.map((pro) => (
              <div key={pro.id} className="bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="font-bold text-zinc-900">{pro.name}</div>
                <div className="text-sm text-zinc-500 mb-2">{pro.title}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{pro.location}</span>
                  <span className="flex items-center gap-1 font-bold"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {pro.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FreelancerDiscoveryMap;


