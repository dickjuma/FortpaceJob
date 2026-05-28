import React, { useState } from 'react';
import { Search, MapPin, Filter, Star, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_TALENT = [
  { id: 1, name: 'Sarah W.', role: 'React Dev', loc: 'New York, NY', lat: 40.7128, lng: -74.0060, rate: '$85/hr', rating: 4.9, onsite: true },
  { id: 2, name: 'Marcus T.', role: 'Electrician', loc: 'Brooklyn, NY', lat: 40.6782, lng: -73.9442, rate: '$95/hr', rating: 5.0, onsite: true, urgent: true },
  { id: 3, name: 'TechFlow Agency', role: 'Dev Team', loc: 'Jersey City, NJ', lat: 40.7178, lng: -74.0431, rate: '$150/hr', rating: 4.8, onsite: false }
];

const FreelancerDiscoveryMap = () => {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row relative">
        
        {/* Left Sidebar (List View) */}
        <div className="w-full md:w-96 bg-white border-r border-zinc-200 h-full flex flex-col z-10">
          
          <div className="p-4 border-b border-zinc-200">
            <h1 className="font-bold text-xl text-zinc-900 mb-4">Talent Map</h1>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                <input type="text" placeholder="Search by skill or name..." className="w-full bg-surface border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-brand-500 focus:outline-none font-medium" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                <input type="text" defaultValue="New York, NY" className="w-full bg-surface border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-brand-500 focus:outline-none font-medium" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                <button className="px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold whitespace-nowrap">Onsite Only</button>
                <button className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold whitespace-nowrap">Available Now</button>
                <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1"><Filter className="w-3 h-3" /> More Filters</button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
            {MOCK_TALENT.map(pro => (
              <div 
                key={pro.id} 
                onMouseEnter={() => setActiveCard(pro.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-colors ${activeCard === pro.id ? 'border-brand-500 shadow-md ring-1 ring-brand-500/20' : 'border-zinc-200 shadow-sm hover:border-brand-300'}`}
              >
                {pro.urgent && (
                  <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Available Immediately
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=random`} className="w-10 h-10 rounded-full" alt="avatar" />
                    <div>
                      <h3 className="font-bold text-zinc-900 flex items-center gap-1 text-sm">{pro.name} <ShieldCheck className="w-3 h-3 text-brand-500" /></h3>
                      <p className="text-xs text-zinc-500">{pro.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-zinc-900">{pro.rate}</div>
                    <div className="flex items-center gap-0.5 text-xs text-zinc-500"><Star className="w-3 h-3 text-amber-500 fill-current" /> {pro.rating}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                  <span className="text-xs font-medium text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {pro.loc}</span>
                  <Link to="/profile" className="text-brand-600 text-xs font-bold hover:underline">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Map Area (Simulated) */}
        <div className="flex-1 bg-zinc-200 relative h-full">
          {/* Simulated Map Background */}
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover opacity-50 grayscale" alt="Map" />
          <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay"></div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center font-bold text-xl hover:bg-surface">+</button>
            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center font-bold text-xl hover:bg-surface">-</button>
          </div>

          {/* Simulated Map Pins */}
          <div className="absolute top-[40%] left-[45%] group">
            <div className="relative">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                <span className="font-bold text-xs">SW</span>
              </div>
              <div className="absolute top-10 left-1/2 -tranzinc-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-200">
                Sarah W. ($85/hr)
              </div>
            </div>
          </div>
          
          <div className="absolute top-[55%] left-[60%] group">
            <div className="relative">
              <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xl group-hover:scale-110 transition-transform cursor-pointer animate-pulse">
                <span className="font-bold text-sm">MT</span>
              </div>
              <div className="absolute top-12 left-1/2 -tranzinc-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-200">
                Marcus T. (Available Now)
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default FreelancerDiscoveryMap;
