import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, Filter, SlidersHorizontal, 
  MapPin, Star, DollarSign, Briefcase, ChevronDown,
  Users, CheckCircle2, TrendingUp, X
} from 'lucide-react';

// Mock Data
const tabs = ['Freelancers', 'Jobs', 'Projects', 'Companies'];

const suggestions = [
  'React Native Expert', 'Full Stack Developer', 
  'Web3 Auditor', 'Figma UI Designer'
];

const mockResults = [
  {
    id: 1,
    type: 'Freelancer',
    name: 'Elena R.',
    title: 'Senior Frontend Engineer',
    rate: '$85/hr',
    rating: 4.9,
    location: 'United States',
    match: 98,
    skills: ['React', 'TypeScript', 'TailwindCSS'],
    tags: ['Top Rated Plus', 'Available Now']
  },
  {
    id: 2,
    type: 'Freelancer',
    name: 'David M.',
    title: 'Backend Systems Architect',
    rate: '$120/hr',
    rating: 5.0,
    location: 'United Kingdom',
    match: 92,
    skills: ['Node.js', 'Go', 'AWS', 'PostgreSQL'],
    tags: ['Top Rated']
  },
  {
    id: 3,
    type: 'Freelancer',
    name: 'Sarah K.',
    title: 'UX/UI Product Designer',
    rate: '$65/hr',
    rating: 4.8,
    location: 'Canada',
    match: 88,
    skills: ['Figma', 'Prototyping', 'User Research'],
    tags: ['Rising Talent']
  }
];

const GlobalSearch = () => {
  const [activeTab, setActiveTab] = useState('Freelancers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* 1. Massive Search Header Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-900 rounded-[2rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Find the world's best talent.
          </h1>
          <p className="text-brand-100/80 text-lg">AI-powered matchmaking connecting you to elite professionals.</p>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Main Search Bar */}
          <div className={`relative bg-white dark:bg-surface-dark rounded-2xl flex items-center p-2 shadow-2xl transition-all duration-300 ${isFocused ? 'ring-4 ring-brand-500/30 shadow-blue-900/50' : ''}`}>
            <Search className="w-6 h-6 text-zinc-400 ml-4 shrink-0" />
            <input 
              type="text" 
              placeholder={`Search for ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full px-4 py-3 bg-transparent text-zinc-900 dark:text-white outline-none text-lg font-medium placeholder-zinc-400"
            />
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 mx-2 rounded-xl text-sm font-bold transition-colors ${filtersOpen ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 shrink-0">
              <Sparkles className="w-4 h-4" /> Search
            </button>
          </div>

          {/* AI Search Suggestions */}
          <AnimatePresence>
            {isFocused && !searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 z-50"
              >
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => setSearchQuery(s)} className="px-3 py-1.5 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-medium rounded-lg hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Advanced Filter Sidebar */}
        <AnimatePresence>
          {(filtersOpen || window.innerWidth > 1024) && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }} 
              animate={{ width: 300, opacity: 1 }} 
              exit={{ width: 0, opacity: 0 }}
              className="w-full lg:w-[300px] shrink-0 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center bg-surface dark:bg-surface-dark/50">
                <h3 className="font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                <button className="text-xs font-bold text-brand-600 hover:underline">Clear All</button>
              </div>

              <div className="p-5 space-y-6">
                
                {/* Hourly Rate Filter */}
                <div>
                  <h4 className="text-sm font-bold mb-3 flex justify-between">
                    Hourly Rate <ChevronDown className="w-4 h-4 text-zinc-400" />
                  </h4>
                  <div className="space-y-2">
                    {['Any amount', '$10 - $30/hr', '$30 - $60/hr', '$60 & above'].map((rate, i) => (
                      <label key={rate} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${i === 2 ? 'bg-brand-600 border-brand-600' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-brand-500'}`}>
                          {i === 2 && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{rate}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-700" />

                {/* Success Score Filter */}
                <div>
                  <h4 className="text-sm font-bold mb-3 flex justify-between">
                    Job Success Score <ChevronDown className="w-4 h-4 text-zinc-400" />
                  </h4>
                  <div className="space-y-2">
                    {['Any Job Success', '80% & up', '90% & up'].map((score, i) => (
                      <label key={score} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${i === 2 ? 'border-brand-600' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-brand-500'}`}>
                          {i === 2 && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                        </div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{score}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-700" />

                {/* Location Filter */}
                <div>
                  <h4 className="text-sm font-bold mb-3 flex justify-between">
                    Location <ChevronDown className="w-4 h-4 text-zinc-400" />
                  </h4>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                    <input type="text" placeholder="Type a country..." className="w-full pl-9 pr-3 py-2 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Area */}
        <div className="flex-1 min-w-0">
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-zinc-500">
              Showing <span className="font-bold text-zinc-900 dark:text-white">1,245</span> {activeTab.toLowerCase()} for your search
            </div>
            <select className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none">
              <option>Best Match</option>
              <option>Highest Rated</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          <div className="space-y-4">
            {mockResults.map((result) => (
              <div key={result.id} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-6 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group">
                <div className="flex flex-col sm:flex-row gap-6">
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
                    {result.name[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors flex items-center gap-2">
                          {result.name}
                        </h2>
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{result.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                         <div className="text-lg font-extrabold text-zinc-900 dark:text-white">{result.rate}</div>
                         <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded mt-1 inline-block">{result.match}% Match</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {result.location}
                      </span>
                      <span className="flex items-center gap-1 text-zinc-900 dark:text-white">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {result.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> $100k+ earned
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                      <div className="flex gap-2">
                        {result.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-4 py-2 border border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-700 text-sm font-bold rounded-xl transition-colors">
                          Save
                        </button>
                        <button className="flex-1 sm:flex-none px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors">
                          Hire Now
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold rounded-xl hover:bg-surface dark:hover:bg-zinc-700 transition-colors shadow-sm">
              Load More Results
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default GlobalSearch;
