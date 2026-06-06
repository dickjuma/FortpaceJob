import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, Briefcase, Users, Search, 
  MapPin, Star, DollarSign, ArrowRight,
  Sparkles, CheckCircle2, Clock
} from 'lucide-react';

// Mock Data
const savedJobs = [
  { id: 1, title: 'Senior React Developer for Fintech Dashboard', company: 'Enterprise Corp', budget: '$80/hr', type: 'Hourly', time: 'Saved 2 days ago', match: 98, skills: ['React', 'TypeScript', 'Redux'] },
  { id: 2, title: 'Figma UI/UX Design System', company: 'HealthTech Startup', budget: '$60/hr', type: 'Fixed', time: 'Saved 1 week ago', match: 91, skills: ['Figma', 'UI Design', 'Wireframing'] },
];

const savedFreelancers = [
  { id: 1, name: 'Elena R.', title: 'Senior Frontend Engineer', rate: '$85/hr', rating: 4.9, match: 98, location: 'United States', skills: ['React', 'TypeScript', 'TailwindCSS'] },
  { id: 2, name: 'David M.', title: 'Backend Systems Architect', rate: '$120/hr', rating: 5.0, match: 92, location: 'United Kingdom', skills: ['Node.js', 'Go', 'AWS'] },
];

const savedSearches = [
  { id: 1, query: 'React Native Expert', filters: ['US Only', '$50+/hr', 'Top Rated'], count: 124 },
  { id: 2, query: 'Smart Contract Auditor', filters: ['Verified History'], count: 45 },
];

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState('Jobs');
  const [itemsList, setItemsList] = useState({
    jobs: savedJobs,
    freelancers: savedFreelancers,
    searches: savedSearches
  });

  const removeJob = (id) => {
    setItemsList({ ...itemsList, jobs: itemsList.jobs.filter(j => j.id !== id) });
  };

  const removeFreelancer = (id) => {
    setItemsList({ ...itemsList, freelancers: itemsList.freelancers.filter(f => f.id !== id) });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-[#4C1D95] fill-blue-600" /> Saved Items
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your bookmarked opportunities and top talent.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 mb-6 custom-scrollbar">
        {[
          { id: 'Jobs', icon: Briefcase, count: itemsList.jobs.length },
          { id: 'Freelancers', icon: Users, count: itemsList.freelancers.length },
          { id: 'Searches', icon: Search, count: itemsList.searches.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-[#4C1D95]/20 text-[#4C1D95] dark:text-[#4C1D95]' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.id} 
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-[#4C1D95]/10 text-[#4C1D95] dark:bg-[#4C1D95]/30' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Feed Content */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            
            {/* JOBS TAB */}
            {activeTab === 'Jobs' && itemsList.jobs.map((job) => (
              <motion.div 
                layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                key={job.id} 
                className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-[#4C1D95]/50 dark:hover:border-[#4C1D95]/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white hover:text-[#4C1D95] cursor-pointer transition-colors mb-1">{job.title}</h3>
                    <p className="text-sm font-semibold text-zinc-500">{job.company}</p>
                  </div>
                  <button onClick={() => removeJob(job.id)} className="p-2 text-[#4C1D95] hover:bg-[#4C1D95]/5 dark:hover:bg-[#4C1D95]/20 rounded-full transition-colors">
                    <Bookmark className="w-5 h-5 fill-blue-600" />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-4">
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.budget}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                  <span className="text-zinc-400">{job.time}</span>
                  <span className="px-2 py-0.5 rounded text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 ml-auto">{job.match}% Match</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map(s => <span key={s} className="px-2.5 py-1 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-lg">{s}</span>)}
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-#4C1D95]/20">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}

            {/* FREELANCERS TAB */}
            {activeTab === 'Freelancers' && itemsList.freelancers.map((f) => (
               <motion.div 
                 layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                 key={f.id} 
                 className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-[#4C1D95]/50 dark:hover:border-[#4C1D95]/50 transition-colors flex flex-col sm:flex-row gap-6"
               >
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-#4C1D95] to-[#22C55E] flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
                    {f.name[0]}
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <h3 className="font-bold text-lg text-zinc-900 dark:text-white hover:text-[#4C1D95] cursor-pointer transition-colors mb-1">{f.name}</h3>
                       <p className="text-sm font-semibold text-zinc-500">{f.title}</p>
                     </div>
                     <button onClick={() => removeFreelancer(f.id)} className="p-2 text-[#4C1D95] hover:bg-[#4C1D95]/5 dark:hover:bg-[#4C1D95]/20 rounded-full transition-colors shrink-0">
                       <Bookmark className="w-5 h-5 fill-blue-600" />
                     </button>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-4">
                     <span className="flex items-center gap-1 text-zinc-900 dark:text-white"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {f.rating}</span>
                     <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {f.location}</span>
                     <span className="flex items-center gap-1 text-zinc-900 dark:text-white"><DollarSign className="w-3.5 h-3.5" /> {f.rate}</span>
                   </div>

                   <div className="flex flex-wrap gap-2 mb-4">
                     {f.skills.map(s => <span key={s} className="px-2.5 py-1 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-lg">{s}</span>)}
                   </div>

                   <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                     <button className="w-full sm:w-auto px-6 py-2.5 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-xl transition-colors">
                       Invite to Job
                     </button>
                   </div>
                 </div>
               </motion.div>
            ))}

            {/* SEARCHES TAB */}
            {activeTab === 'Searches' && itemsList.searches.map((s) => (
              <motion.div 
                 layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                 key={s.id} 
                 className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm"
               >
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                     <Search className="w-4 h-4 text-zinc-400" /> {s.query}
                   </h3>
                   <button className="text-[#4C1D95] hover:text-[#4C1D95] text-sm font-bold">Run Search</button>
                 </div>
                 <div className="flex flex-wrap items-center gap-2 mb-4">
                   <span className="text-xs font-semibold text-zinc-500">Filters Applied:</span>
                   {s.filters.map(f => <span key={f} className="px-2 py-0.5 bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/30 dark:text-[#4C1D95] text-[10px] font-bold rounded uppercase">{f}</span>)}
                 </div>
                 <div className="text-xs text-green-600 font-bold">{s.count} new results since last viewed</div>
               </motion.div>
            ))}

            {/* Empty State */}
            {itemsList[activeTab.toLowerCase()].length === 0 && (
              <motion.div layout className="p-12 text-center bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 border-dashed">
                <Bookmark className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Saved {activeTab}</h3>
                <p className="text-zinc-500">You haven't bookmarked any {activeTab.toLowerCase()} yet. Start exploring the marketplace to save your favorites.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sidebar: AI Recommendations */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#4C1D95] to-zinc-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <Sparkles className="w-5 h-5 text-amber-400" /> Suggested for you
            </h3>
            <p className="text-sm text-zinc-300 mb-6 relative z-10">Based on your saved items, we think you'll like these matches.</p>
            
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                <h4 className="font-bold text-sm mb-1 group-hover:text-amber-300 transition-colors line-clamp-1">Senior React Engineer Needed</h4>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>$90/hr</span>
                  <span className="text-green-400 font-bold">99% Match</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                <h4 className="font-bold text-sm mb-1 group-hover:text-amber-300 transition-colors line-clamp-1">Anna M. - DevOps Expert</h4>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 5.0</span>
                  <span className="text-green-400 font-bold">95% Match</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-xl transition-colors backdrop-blur-sm flex justify-center items-center gap-2">
              View All Suggestions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SavedItems;


