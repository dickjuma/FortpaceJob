import React, { useState } from 'react';
import { 
  Search, Grid, List, ChevronDown, Filter, 
  MapPin, Star, Clock, CheckCircle, Heart,
  SlidersHorizontal, X, ArrowUpRight
} from 'lucide-react';

export default function ClientTalentSearchPage() {
  const [viewMode, setViewMode] = useState('grid');
  
  // Dummy data based on the PRD
  const freelancers = [
    { id: 1, name: 'John Developer', title: 'React Expert Dev', rating: 5.0, reviews: 42, rate: '$85/hr', location: 'Philippines', available: true, success: 98, response: '2 hours', skills: ['React', 'Node.js', 'TypeScript'] },
    { id: 2, name: 'Sarah Designer', title: 'UI/UX Specialist', rating: 4.9, reviews: 38, rate: '$65/hr', location: 'United Kingdom', available: false, success: 100, response: '1 hour', skills: ['Figma', 'UI Design', 'Wireframing'] },
    { id: 3, name: 'Mike Engineer', title: 'Full Stack Python', rating: 4.7, reviews: 15, rate: '$50/hr', location: 'India', available: true, success: 92, response: '4 hours', skills: ['Python', 'Django', 'AWS'] },
    { id: 4, name: 'Elena Copywriter', title: 'B2B Tech Writer', rating: 5.0, reviews: 89, rate: '$45/hr', location: 'United States', available: true, success: 99, response: '30 mins', skills: ['Copywriting', 'SEO', 'B2B'] },
    { id: 5, name: 'David Marketer', title: 'Growth Hacker', rating: 4.6, reviews: 22, rate: '$75/hr', location: 'Canada', available: false, success: 88, response: '5 hours', skills: ['Growth', 'Ads', 'Analytics'] },
    { id: 6, name: 'Chen Mobile', title: 'iOS Native Dev', rating: 4.8, reviews: 54, rate: '$95/hr', location: 'Singapore', available: true, success: 95, response: '2 hours', skills: ['Swift', 'iOS', 'Objective-C'] }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans flex flex-col md:flex-row overflow-hidden h-screen custom-scrollbar">
      
      {/* LEFT SIDEBAR: FILTERS */}
      <aside className="w-full md:w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar h-full hidden md:flex">
        <div className="p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Filter className="w-5 h-5 text-vivid-lavender" /> Filters</h2>
          <button className="text-xs font-bold text-vivid-lavender hover:text-white transition-colors">Clear All</button>
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* Experience Level */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Experience Level</h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-zinc-600 group-hover:border-vivid-lavender flex items-center justify-center bg-zinc-800"></div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Beginner <span className="text-xs text-zinc-600">(12)</span></span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-zinc-600 group-hover:border-vivid-lavender flex items-center justify-center bg-zinc-800"></div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Intermediate <span className="text-xs text-zinc-600">(45)</span></span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-vivid-lavender bg-vivid-lavender flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>
                <span className="text-sm text-white font-medium">Expert <span className="text-xs text-zinc-600">(89)</span></span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-zinc-600 group-hover:border-vivid-lavender flex items-center justify-center bg-zinc-800"></div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Top Rated <span className="text-xs text-zinc-600">(24)</span></span>
              </label>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Skills</h3>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Search skills..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-vivid-lavender focus:outline-none text-white" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-vivid-lavender/10 border border-vivid-lavender/30 text-vivid-lavender text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-vivid-lavender/20">React <X className="w-3 h-3" /></span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer hover:bg-zinc-700">Node.js</span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer hover:bg-zinc-700">Vue.js</span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer hover:bg-zinc-700">Python</span>
            </div>
            <button className="text-xs text-vivid-lavender font-bold mt-3 hover:text-white transition-colors">View more</button>
          </div>

          {/* Hourly Rate */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Hourly Rate</h3>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mb-4 relative">
              <div className="absolute left-[20%] right-[40%] top-0 bottom-0 bg-vivid-lavender rounded-full"></div>
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-vivid-lavender cursor-pointer shadow-lg"></div>
              <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-vivid-lavender cursor-pointer shadow-lg"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 flex items-center">
                <span className="text-zinc-500 text-sm mr-1">$</span>
                <input type="text" value="15" className="w-full bg-transparent outline-none text-sm text-white" readOnly />
              </div>
              <span className="text-zinc-500">-</span>
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 flex items-center">
                <span className="text-zinc-500 text-sm mr-1">$</span>
                <input type="text" value="150" className="w-full bg-transparent outline-none text-sm text-white" readOnly />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Availability</h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded-full border border-vivid-lavender flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-vivid-lavender"></div></div>
                <span className="text-sm text-white font-medium">Available Now</span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded-full border border-zinc-600 group-hover:border-vivid-lavender flex items-center justify-center bg-zinc-800"></div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">1-2 weeks</span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded-full border border-zinc-600 group-hover:border-vivid-lavender flex items-center justify-center bg-zinc-800"></div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Not available</span>
              </label>
            </div>
          </div>

        </div>
      </aside>

      {/* RIGHT SIDE: CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Search Header (Sticky) */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-4 md:p-6 sticky top-0 z-20 shrink-0">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[60%]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search by name, skill, or specialty..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-vivid-lavender text-white shadow-inner"
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Sort */}
              <div className="flex items-center gap-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 cursor-pointer hover:border-zinc-700 flex-1 md:flex-none justify-between">
                <span className="text-zinc-400">Sort by:</span>
                <span className="text-white font-bold ml-1">Recommended</span>
                <ChevronDown className="w-4 h-4 text-zinc-500 ml-2" />
              </div>

              {/* View Toggles */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1 shrink-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="font-bold text-white flex items-center gap-3">
              Showing 24 freelancers
              <div className="hidden md:flex items-center gap-2">
                <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs border border-zinc-700 flex items-center gap-1">React <X className="w-3 h-3 cursor-pointer" /></span>
                <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs border border-zinc-700 flex items-center gap-1">Expert <X className="w-3 h-3 cursor-pointer" /></span>
              </div>
            </div>
            <div className="text-zinc-500 font-medium">Page 1 of 5</div>
          </div>
        </div>

        {/* Results Grid/List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-zinc-950/50">
          
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            
            {freelancers.map(f => (
              <div 
                key={f.id} 
                className={`bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-vivid-lavender/50 hover:shadow-lg hover:shadow-vivid-lavender/5 transition-all duration-300 group ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-5'}`}
              >
                
                {/* Header Section */}
                <div className={`${viewMode === 'list' ? 'w-64 shrink-0 flex items-center gap-4' : 'text-center mb-5 relative'}`}>
                  {viewMode === 'grid' && (
                    <button className="absolute top-0 right-0 p-2 text-zinc-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  )}
                  <div className={`rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden ${viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mx-auto mb-3'}`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.name}`} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-vivid-lavender transition-colors">{f.name}</h3>
                    <p className="text-sm text-zinc-400 italic mt-0.5">{f.title}</p>
                    
                    {viewMode === 'list' && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-white">{f.rating}</span>
                        <span className="text-xs text-zinc-500">({f.reviews})</span>
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === 'grid' && (
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-lg font-bold text-white">{f.rating}</span>
                    <span className="text-sm text-zinc-500">({f.reviews} reviews)</span>
                  </div>
                )}

                {/* Skills Section */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'mb-5'}`}>
                  {viewMode === 'grid' && <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Top Skills:</p>}
                  <div className="flex flex-wrap gap-2">
                    {f.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-zinc-800 text-vivid-lavender text-xs font-bold rounded-md border border-zinc-700">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Key Info */}
                <div className={`${viewMode === 'list' ? 'w-48 shrink-0 border-l border-zinc-800 pl-6' : 'mb-5 space-y-2'}`}>
                  <div className="text-xl font-bold text-vivid-lavender mb-1">{f.rate}</div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" /> {f.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <div className={`w-2 h-2 rounded-full ${f.available ? 'bg-vivid-green' : 'bg-zinc-600'}`}></div>
                    <span className={f.available ? 'text-vivid-green font-medium' : 'text-zinc-500'}>
                      {f.available ? 'Available Now' : 'Available in 2 wks'}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-zinc-800/50">
                    <div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5 mb-1"><CheckCircle className="w-3 h-3" /> Success Rate</div>
                      <div className="text-sm font-bold text-white">{f.success}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5 mb-1"><Clock className="w-3 h-3" /> Response Time</div>
                      <div className="text-sm font-bold text-white">~{f.response}</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className={`${viewMode === 'list' ? 'w-40 shrink-0 flex flex-col gap-2' : 'space-y-3 mt-auto'}`}>
                  {viewMode === 'grid' && (
                    <div className="flex gap-3">
                      <button className="flex-1 py-2 rounded-xl border border-zinc-700 text-white text-sm font-bold hover:bg-zinc-800 transition-colors">View Profile</button>
                    </div>
                  )}
                  <button className="w-full py-2.5 rounded-xl bg-vivid-lavender hover:bg-dark-purple text-white text-sm font-bold transition-colors shadow-lg shadow-vivid-lavender/20 flex items-center justify-center gap-2">
                    Invite to Project <ArrowUpRight className="w-4 h-4" />
                  </button>
                  {viewMode === 'list' && (
                    <button className="w-full py-2 rounded-xl border border-zinc-700 text-white text-sm font-bold hover:bg-zinc-800 transition-colors">View Profile</button>
                  )}
                </div>

              </div>
            ))}
            
          </div>

          {/* Load More */}
          <div className="mt-8 flex justify-center pb-8">
            <button className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-vivid-lavender text-white rounded-full text-sm font-bold transition-all hover:bg-zinc-800 shadow-lg">
              Load More Freelancers
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
