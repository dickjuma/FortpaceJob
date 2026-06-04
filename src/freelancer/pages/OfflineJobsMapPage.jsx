import React, { useState, useMemo } from 'react';
import { 
  MapPin, Star, Laptop, DollarSign, Clock, X, Navigation, Award, Briefcase, Eye, ChevronRight, SlidersHorizontal, Search
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function OfflineJobsMapPage() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(5.0); // in miles
  
  const mapPins = [
    { id: 1, title: 'Server Room Configuration', x: '35%', y: '42%', client: 'Apex Holdings', distance: 1.2, budget: 1500, type: 'Fixed Price', duration: '2 days' },
    { id: 2, title: 'On-site Commercial Photography', x: '65%', y: '30%', client: 'Cloudfront Media', distance: 3.4, budget: 2800, type: 'Fixed Price', duration: '3 days' },
    { id: 3, title: 'Cybersecurity System Hardening', x: '48%', y: '68%', client: 'Bay Area Cyberlabs', distance: 0.5, budget: 140, type: 'Hourly Rate', duration: '15 hours' },
    { id: 4, title: 'Retail LAN Network Deployment', x: '20%', y: '72%', client: 'Downtown Retailers', distance: 6.8, budget: 3200, type: 'Fixed Price', duration: '5 days' },
    { id: 5, title: 'Fibre Optic Splice Inspection', x: '80%', y: '50%', client: 'Symmetric Telecom', distance: 8.5, budget: 450, type: 'Hourly Rate', duration: '5 hours' }
  ];

  // Dynamic filter based on query and radius slider value
  const filteredPins = useMemo(() => {
    return mapPins.filter(pin => {
      const matchesSearch = pin.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            pin.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = pin.distance <= maxDistance;
      return matchesSearch && matchesDistance;
    });
  }, [searchQuery, maxDistance]);

  const handleApplySimulate = (title) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Submitting mapping application...',
        success: `Applied to "${title}" successfully! 🚀`,
        error: 'Failed to submit proposal.'
      }
    );
    setSelectedPin(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Navigation className="w-8 h-8 text-success animate-pulse" />
            Offline Contracts Map
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse in-person and offline job vacancies mapped strictly by relative distance metrics.
          </p>
        </div>
      </div>

      {/* Control Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search keywords or client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-white text-xs font-bold text-text-primary focus:border-success outline-none shadow-sm transition-all"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-4 bg-white border border-border p-3 rounded-2xl shadow-sm">
          <SlidersHorizontal className="w-4 h-4 text-success shrink-0" />
          <div className="flex-1 flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-text-secondary">Search Radius:</span>
            <input 
              type="range" 
              min="0.5" 
              max="10.0" 
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="flex-1 accent-success h-1 bg-light-gray rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-black text-success shrink-0 min-w-[50px] text-right">
              {maxDistance.toFixed(1)} miles
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        
        {/* Map Explorer Area (2 Columns) */}
        <div className="lg:col-span-2 relative rounded-[32px] overflow-hidden border border-border bg-zinc-900 shadow-xl flex items-center justify-center">
          {/* Simulated geocoded map grid design */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>
          <div className="absolute w-[300px] h-[300px] bg-success/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          {/* Pins mapping */}
          {filteredPins.map(pin => (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className={cn(
                "absolute p-3 rounded-full shadow-xl hover:scale-115 border-2 border-white transition-all z-20 group",
                selectedPin?.id === pin.id ? "bg-white text-success" : "bg-success text-white"
              )}
              style={{ left: pin.x, top: pin.y }}
            >
              <MapPin size={18} className="group-hover:animate-bounce" />
              <span className="absolute left-1/2 -tranzinc-x-1/2 -top-9 bg-[#222222] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                ${pin.budget.toLocaleString()} ({pin.distance}m)
              </span>
            </button>
          ))}

          <span className="absolute bottom-4 left-4 bg-[#222222]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black text-white/80 flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
            Geocoding Engine Live ({filteredPins.length} targets found)
          </span>
        </div>

        {/* Selected Details Sidebar Panel */}
        <div className="lg:col-span-1 h-full">
          {selectedPin ? (
            <Card className="bg-white border border-border p-6 rounded-3xl shadow-xl h-full flex flex-col justify-between animate-in slide-in-from-right-4 duration-200">
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-border pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-success/10 text-success border-success/20">
                      {selectedPin.distance} miles away
                    </span>
                    <h3 className="font-black text-lg text-text-primary mt-2">{selectedPin.title}</h3>
                    <p className="text-xs text-text-secondary font-bold">Client: {selectedPin.client}</p>
                  </div>
                  <button onClick={() => setSelectedPin(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
                </div>

                <div className="space-y-3 font-bold text-text-secondary text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-success" />
                    <span>Duration: {selectedPin.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span>Project Budget: ${selectedPin.budget.toLocaleString()} ({selectedPin.type})</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <button 
                  onClick={() => handleApplySimulate(selectedPin.title)}
                  className="w-full py-3 bg-success hover:bg-success/95 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-[#2bb75c]/20 flex items-center justify-center gap-1.5"
                >
                  Apply On-site Contract
                </button>
              </div>
            </Card>
          ) : (
            <Card className="bg-white border border-border p-8 rounded-3xl shadow-md h-full flex flex-col items-center justify-center text-center">
              <Navigation className="w-12 h-12 text-text-secondary mb-3 animate-pulse" />
              <h4 className="font-black text-text-primary text-base">Select Map Pin</h4>
              <p className="text-xs text-text-secondary mt-1 max-w-[200px] leading-relaxed font-semibold">
                Click on any geocoded location marker pin on the map to review in-person contract scopes.
              </p>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}

