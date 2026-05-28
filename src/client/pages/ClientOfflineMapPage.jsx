import React, { useState } from 'react';
import { 
  MapPin, Compass, Search, Navigation, UserCheck, 
  Truck, ShieldCheck, Activity, PhoneCall 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientOfflineMapPage() {
  const [radius, setRadius] = useState(15);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const workers = [
    { id: 1, name: 'Kiprotich Arap', role: 'Concrete Inspector', lat: 120, lng: 180, distance: 4.2, rate: 'KES 2,500/hr', status: 'Available', transportCost: 800, phone: '+254711002233' },
    { id: 2, name: 'Grace Mutua', role: 'Fiber Splicer Onsite', lat: 240, lng: 150, distance: 9.8, rate: 'KES 3,200/hr', status: 'On Route', transportCost: 1500, phone: '+254722334455' },
    { id: 3, name: 'Abebe Bekele', role: 'Structural Engineer', lat: 160, lng: 320, distance: 12.5, rate: 'KES 4,500/hr', status: 'Available', transportCost: 2000, phone: '+254733445566' },
    { id: 4, name: 'Hassan Farah', role: 'Survey Assistant', lat: 80, lng: 280, distance: 1.8, rate: 'KES 1,800/hr', status: 'Checked In', transportCost: 400, phone: '+254744556677' }
  ];

  const handleAssign = (worker) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Assigning ${worker.name} to site coordinates...`,
        success: () => {
          setSelectedWorker(prev => prev ? { ...prev, status: 'On Route' } : null);
          return `${worker.name} assigned successfully! M-Pesa escrow travel allowance dispatched. 🚚`;
        },
        error: 'Assignment failed.'
      }
    );
  };

  const filteredWorkers = workers.filter(w => 
    w.distance <= radius && 
    (w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Nearby Field Workforce Map</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Locate certified onsite contractors, deploy emergency surveyors, and audit travel fees via GPS coordinate grid.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-light-gray/60 uppercase">Search Radius:</span>
            <input 
              type="range" 
              min="5" 
              max="25" 
              value={radius} 
              onChange={e => setRadius(parseInt(e.target.value))}
              className="w-24 accent-accent-purple" 
            />
            <span className="text-xs font-mono font-bold text-accent-purple">{radius} KM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Filter Sidebar and Worker List */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-light-gray/40 absolute left-3.5 top-1/2 -tranzinc-y-1/2" />
              <input 
                type="text" 
                placeholder="Search skills, role, or name..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-light-gray/40 outline-none focus:border-accent-purple"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              <h3 className="text-[10px] font-black text-light-gray/40 uppercase tracking-widest">Active Providers within {radius}km ({filteredWorkers.length})</h3>
              
              {filteredWorkers.map(w => (
                <div 
                  key={w.id}
                  onClick={() => setSelectedWorker(w)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedWorker?.id === w.id 
                      ? 'border-accent-purple bg-accent-purple/10' 
                      : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{w.name}</h4>
                      <p className="text-[10px] text-light-gray/60 font-semibold mt-0.5">{w.role}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-accent-purple">{w.distance} KM</span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5 text-[10px] font-bold text-light-gray/50">
                    <span className="text-white">{w.rate}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      w.status === 'Available' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-orange-400/20 text-orange-400'
                    }`}>
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center: Vector Coordinate Map System */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 rounded-3xl p-4 overflow-hidden relative min-h-[480px] flex items-center justify-center">
            
            {/* Compass and Coordinates Grid overlay UI */}
            <div className="absolute top-4 left-4 z-20 bg-zinc-900/80 border border-white/10 rounded-xl p-3 flex items-center gap-2 text-[10px] font-mono text-light-gray/60">
              <Compass className="w-4 h-4 text-accent-purple animate-pulse" />
              <span>Nairobi Site Command Index • GPS ACTIVE</span>
            </div>

            {/* Custom interactive SVG coordinates map */}
            <svg className="absolute inset-0 w-full h-full text-white/5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Simulated worker pins */}
            {filteredWorkers.map(w => (
              <button 
                key={w.id}
                onClick={() => setSelectedWorker(w)}
                className="absolute transition-transform hover:scale-125 z-10"
                style={{ left: `${w.lat}px`, top: `${w.lng}px` }}
              >
                <div className="relative group">
                  <MapPin className={`w-8 h-8 ${
                    selectedWorker?.id === w.id 
                      ? 'text-accent-red filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                      : 'text-accent-purple'
                  }`} />
                  <div className="absolute -top-1.5 -right-1 w-3 h-3 bg-success rounded-full border border-zinc-950"></div>
                </div>
              </button>
            ))}

            {/* SVG Interactive hover Tooltip card overlay */}
            {selectedWorker && (
              <div className="absolute bottom-4 right-4 z-20 w-80 bg-zinc-900 border border-white/15 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-black text-white">{selectedWorker.name}</h3>
                    <p className="text-[10px] text-light-gray/60 font-semibold">{selectedWorker.role}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded">
                    {selectedWorker.distance} km away
                  </span>
                </div>

                <div className="space-y-2 text-xs font-bold text-light-gray/60 mb-4">
                  <div className="flex justify-between"><span>Base Rate:</span> <span className="text-white">{selectedWorker.rate}</span></div>
                  <div className="flex justify-between"><span>Transport Allowance:</span> <span className="text-white">KES {selectedWorker.transportCost}</span></div>
                  <div className="flex justify-between"><span>Contact Direct:</span> <span className="text-accent-purple flex items-center gap-1"><PhoneCall size={10} /> {selectedWorker.phone}</span></div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAssign(selectedWorker)}
                    className="flex-1 bg-accent-purple border-none rounded-xl text-[10px] font-black py-2 shadow-lg"
                  >
                    Deploy to Coordinates
                  </Button>
                  <Button 
                    onClick={() => setSelectedWorker(null)}
                    variant="outline"
                    className="border-white/10 text-white rounded-xl text-[10px] font-black py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
