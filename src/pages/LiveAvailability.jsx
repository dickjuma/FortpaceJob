import React from 'react';
import { Clock, MapPin, Search, Filter, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_LIVE = [
  { id: 1, name: 'Elena R.', role: 'UI/UX Designer', location: 'London, UK (GMT)', status: 'Online Now', capacity: '10 hrs/wk available', rating: 5.0, rate: '$85/hr' },
  { id: 2, name: 'TechFlow Agency', role: 'Dev Team', location: 'Remote (EST)', status: 'Online Now', capacity: 'Full squad available', rating: 4.8, rate: '$150/hr' },
  { id: 3, name: 'David C.', role: 'Backend Engineer', location: 'San Francisco', status: 'Online Now', capacity: '20 hrs/wk available', rating: 4.9, rate: '$100/hr' }
];

const LiveAvailability = () => {
  return (
    <>
      <div className="bg-surface-dark text-white py-12 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Live Status
            </div>
            <h1 className="text-3xl font-black mb-2">Available Right Now</h1>
            <p className="text-zinc-400">Hire professionals currently online and ready to start immediately.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="Search skills..." className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500 text-sm font-medium" />
            </div>
            <button className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {MOCK_LIVE.map(pro => (
              <div key={pro.id} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-lg transition-all relative">
                
                <div className="absolute top-6 right-6">
                  <div className="w-3 h-3 bg-success rounded-full border-2 border-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=random`} className="w-16 h-16 rounded-full border border-zinc-200" alt="avatar" />
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-1">
                      {pro.name} <ShieldCheck className="w-4 h-4 text-brand-500" />
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">{pro.role}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 bg-surface px-3 py-2 rounded-lg border border-zinc-100">
                    <MapPin className="w-4 h-4 text-zinc-400" /> {pro.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 bg-surface px-3 py-2 rounded-lg border border-zinc-100">
                    <Clock className="w-4 h-4 text-zinc-400" /> {pro.capacity}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div>
                    <div className="font-black text-zinc-900">{pro.rate}</div>
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                      <Star className="w-3 h-3 text-amber-500 fill-current" /> {pro.rating}
                    </div>
                  </div>
                  <Link to="/invite" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
                    Message Now
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default LiveAvailability;
