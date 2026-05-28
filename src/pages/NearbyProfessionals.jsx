import React, { useState } from 'react';
import { MapPin, Search, Navigation, Filter, Map, List, AlertTriangle, ShieldCheck, Star, Truck } from 'lucide-react';

const MOCK_ONSITE = [
  { id: 1, name: 'Marcus T.', role: 'Master Electrician', distance: '1.2 km', travel: 'Up to 20 km', rating: 4.9, rate: '$120/hr', availableNow: true },
  { id: 2, name: 'Sarah W.', role: 'IT Support Tech', distance: '3.5 km', travel: 'Up to 10 km', rating: 5.0, rate: '$85/hr', availableNow: false },
  { id: 3, name: 'David C.', role: 'HVAC Specialist', distance: '4.8 km', travel: 'Up to 50 km', rating: 4.8, rate: '$150/hr', availableNow: true },
  { id: 4, name: 'Elena R.', role: 'Event Photographer', distance: '8.1 km', travel: 'Up to 100 km', rating: 4.9, rate: '$200/hr', availableNow: false },
];

const NearbyProfessionals = () => {
  const [viewMode, setViewMode] = useState('map');
  const [radius, setRadius] = useState('10km');
  const [urgentOnly, setUrgentOnly] = useState(false);

  return (
    <>
      <div className="bg-surface-dark text-white pt-16 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6">Find Local Onsite Talent</h1>
            <p className="text-lg text-zinc-300 mb-8">
              Discover verified professionals ready to travel to your location. Ideal for physical services, IT setups, photography, and emergency repairs.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center bg-white/10 rounded-xl px-4 py-3 border border-transparent">
                <Search className="w-5 h-5 text-zinc-300 mr-3" />
                <input type="text" placeholder="What service do you need?" className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-400" />
              </div>
              <div className="flex-1 flex items-center bg-white/10 rounded-xl px-4 py-3 border border-transparent">
                <Navigation className="w-5 h-5 text-brand-400 mr-3" />
                <input type="text" defaultValue="San Francisco, CA" className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-400" />
              </div>
              <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap">
                Search Local
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-20 pb-20">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-600">Radius:</span>
              <select 
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="bg-surface border border-zinc-200 rounded-lg px-3 py-1.5 text-sm outline-none font-medium text-zinc-700"
              >
                <option value="5km">Within 5 km</option>
                <option value="10km">Within 10 km</option>
                <option value="25km">Within 25 km</option>
                <option value="50km">Within 50 km</option>
              </select>
            </div>
            
            <div className="w-px h-6 bg-zinc-200 hidden md:block"></div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-rose-500 focus:ring-rose-500/20" 
              />
              <span className="text-sm font-medium text-zinc-700 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                Available Onsite Now
              </span>
            </label>
            
            <button className="flex items-center gap-1 text-sm font-medium text-zinc-600 bg-surface px-3 py-1.5 rounded-lg border border-zinc-200">
              <Filter className="w-4 h-4" /> More Filters
            </button>
          </div>
          
          <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200 w-full md:w-auto">
            <button onClick={() => setViewMode('map')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-brand-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
              <Map className="w-4 h-4" /> Map View
            </button>
            <button onClick={() => setViewMode('list')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
              <List className="w-4 h-4" /> List View
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
          
          {/* List/Sidebar Area */}
          <div className={`w-full ${viewMode === 'map' ? 'lg:w-96' : ''} flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar h-full`}>
            
            {/* Emergency CTA */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
                <AlertTriangle className="w-5 h-5" /> Emergency Services
              </div>
              <p className="text-sm text-rose-800 mb-4">Need immediate onsite assistance? Our emergency responders are on standby.</p>
              <button className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                Request Emergency Hire
              </button>
            </div>

            <div className="text-sm font-bold text-zinc-900 px-1">{MOCK_ONSITE.length} Professionals found</div>

            {MOCK_ONSITE.map((pro) => (
              <div key={pro.id} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-brand-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=random`} alt={pro.name} className="w-12 h-12 rounded-full border border-zinc-200" />
                      {pro.availableNow && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 group-hover:text-brand-600 transition-colors flex items-center gap-1">
                        {pro.name} <ShieldCheck className="w-4 h-4 text-brand-500" />
                      </h3>
                      <p className="text-sm text-zinc-500">{pro.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-zinc-900">{pro.rate}</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-500 mt-1">
                      <Star className="w-3 h-3 fill-current" /> {pro.rating}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600 mb-4">
                  <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded">
                    <MapPin className="w-3 h-3 text-zinc-400" /> {pro.distance} away
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded">
                    <Truck className="w-3 h-3 text-zinc-400" /> Travels {pro.travel}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-lg transition-colors">
                    View Profile
                  </button>
                  {pro.availableNow ? (
                    <button className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition-colors">
                      Dispatch Now
                    </button>
                  ) : (
                    <button className="flex-1 py-2 bg-surface-dark hover:bg-zinc-800 text-white text-sm font-bold rounded-lg transition-colors">
                      Book Time
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map Area */}
          {viewMode === 'map' && (
            <div className="flex-1 bg-zinc-200 rounded-2xl overflow-hidden border border-zinc-300 relative">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Map View" className="w-full h-full object-cover opacity-80" />
              
              {/* Mock Map Overlay UI */}
              <div className="absolute inset-0 bg-surface-dark/10">
                {/* Radar Circle */}
                <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-96 h-96 border-2 border-brand-500/30 bg-brand-500/10 rounded-full flex items-center justify-center">
                   <div className="w-3 h-3 bg-brand-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] border border-white relative z-10">
                     <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping"></div>
                   </div>
                </div>

                {/* Mock Pins */}
                <div className="absolute top-[40%] left-[45%] w-10 h-10 bg-white rounded-full shadow-lg border-2 border-rose-500 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform group">
                   <img src="https://ui-avatars.com/api/?name=Marcus+T&background=random" className="w-8 h-8 rounded-full" />
                   <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-dark text-white text-xs font-bold px-3 py-1.5 rounded shadow-xl whitespace-nowrap">
                     Marcus T. ($120/hr)
                   </div>
                </div>

                <div className="absolute top-[60%] left-[55%] w-10 h-10 bg-white rounded-full shadow-lg border-2 border-zinc-200 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform group">
                   <img src="https://ui-avatars.com/api/?name=David+C&background=random" className="w-8 h-8 rounded-full" />
                   <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-dark text-white text-xs font-bold px-3 py-1.5 rounded shadow-xl whitespace-nowrap">
                     David C. ($150/hr)
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default NearbyProfessionals;
