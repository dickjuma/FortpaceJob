import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, Search, Bell, Settings, 
  Trash2, Play, Pause, ChevronDown, Filter,
  Users, Star, ChevronRight
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const SAVED_SEARCHES = [
  {
    id: 'S-01',
    name: 'Senior React Devs (US)',
    filters: ['React', 'Next.js', '$40-$80/hr', 'United States', 'Top Rated'],
    frequency: 'Daily',
    isActive: true,
    newMatches: 4,
    lastRun: '2 hours ago'
  },
  {
    id: 'S-02',
    name: 'UI Designers (Framer)',
    filters: ['UI/UX', 'Framer', 'Portfolio Required', '< $50/hr'],
    frequency: 'Weekly',
    isActive: true,
    newMatches: 12,
    lastRun: '1 day ago'
  },
  {
    id: 'S-03',
    name: 'Backend Node Experts',
    filters: ['Node.js', 'PostgreSQL', '5+ yrs exp'],
    frequency: 'Never',
    isActive: false,
    newMatches: 0,
    lastRun: '1 month ago'
  }
];

const SUGGESTED = [
  { name: 'Sarah Mitchell', title: 'React Expert', match: '98%', avatar: 'https://i.pravatar.cc/150?u=s1' },
  { name: 'David Kim', title: 'Senior Frontend Engineer', match: '95%', avatar: 'https://i.pravatar.cc/150?u=d2' },
  { name: 'Alex Rivera', title: 'Fullstack React Dev', match: '92%', avatar: 'https://i.pravatar.cc/150?u=a3' }
];

export default function ClientSavedSearchesPage() {
  const [searches, setSearches] = useState(SAVED_SEARCHES);

  const toggleActive = (id) => {
    setSearches(searches.map(s => {
      if(s.id === id) return { ...s, isActive: !s.isActive };
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[#2bb75c]" /> Saved Searches & Alerts
            </h1>
            <p className="text-zinc-500 font-medium">Automate your sourcing and get notified when new talent matches your criteria.</p>
          </div>
          <button className="px-6 py-3 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
            <Search className="w-5 h-5" /> New Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Saved Searches List */}
        <div className="flex-1 space-y-6">
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Automated Searches</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-700">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {searches.map(search => (
              <div 
                key={search.id}
                className={cn(
                  "bg-white dark:bg-surface-dark rounded-2xl border shadow-sm p-6 transition-colors flex flex-col sm:flex-row gap-6 justify-between",
                  search.isActive ? "border-[#2bb75c]/20 dark:border-[#2bb75c]/20/50" : "border-zinc-200 dark:border-zinc-800 opacity-75"
                )}
              >
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{search.name}</h3>
                    {search.newMatches > 0 && search.isActive && (
                      <span className="bg-[#2bb75c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        {search.newMatches} New Matches
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {search.filters.map(f => (
                      <span key={f} className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                    <span className="flex items-center gap-1"><Bell className="w-3.5 h-3.5" /> Alerts: {search.frequency}</span>
                    <span className="flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Last run: {search.lastRun}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-6 shrink-0">
                  <button 
                    onClick={() => toggleActive(search.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                      search.isActive ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-success"
                    )}
                  >
                    {search.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {search.isActive ? 'Pause Alerts' : 'Resume Alerts'}
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 text-zinc-400 hover:text-[#2bb75c] transition-colors bg-surface dark:bg-zinc-800/50 rounded-lg"><Settings className="w-4 h-4" /></button>
                    <button className="p-2 text-zinc-400 hover:text-rose-600 transition-colors bg-surface dark:bg-zinc-800/50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Suggestions & Analytics */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          
          {/* New Matches Preview */}
          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10"><Users className="w-5 h-5" /> Fresh Candidates</h3>
            
            <p className="text-sm font-medium text-[#2bb75c] mb-6 relative z-10">We found 4 new freelancers matching your "Senior React Devs" search criteria in the last 24 hours.</p>

            <div className="space-y-3 relative z-10">
              {SUGGESTED.map(s => (
                <div key={s.name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 flex justify-between items-center hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-[10px] font-medium text-[#2bb75c]">{s.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-300">{s.match} Match</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-white text-[#2bb75c] font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
              View All Matches <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search Analytics */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Market Insights</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Avg Hourly Rate</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">$55/hr</span>
                  <span className="text-xs font-bold text-success">For React Developers</span>
                </div>
              </div>
              
              <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Availability Trend</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">High</span>
                  <span className="text-xs font-bold text-zinc-500">45 available now</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

