import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, SlidersHorizontal, ChevronDown,
  Heart, Building2, Globe, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../admin/utils/cn';
import { getFindWorkJobs, subscribeToFindWorkData, syncJobsWithBackend, loadFindWorkCategories } from '../../pages/find-work/findWorkData';

export default function GlobalJobsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [jobTypeFilter, setJobTypeFilter] = useState('online');
  const [, setDataVersion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToFindWorkData(() => setDataVersion((v) => v + 1));
    Promise.all([loadFindWorkCategories(), syncJobsWithBackend({})]).finally(() => setLoading(false));
    return unsub;
  }, []);

  const jobs = getFindWorkJobs({
    workMode: jobTypeFilter === 'onsite' ? 'local' : 'online',
    sortBy: 'newest',
  });

  return (
    <div className="min-h-screen bg-transparent font-sans flex flex-col">
      <div className="flex-1 pt-[88px]">
        {/* Search Header */}
        <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 z-30">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center gap-4">
            
            <div className="flex-1 w-full flex items-center relative">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4" />
              <input 
                type="text" 
                placeholder="Search for any service, skill, or professional..." 
                defaultValue="React Developer"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-l-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95]/50"
              />
              <button className="bg-[#4C1D95] hover:bg-[#22C55E] text-white px-8 py-3.5 rounded-r-2xl font-bold transition-all shrink-0">
                Search
              </button>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden shrink-0 px-4 py-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 flex gap-8">
        
        {/* Filters Sidebar */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-72 shrink-0 space-y-6 hidden md:block">
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" /> Filters
                </h3>
                <button className="text-xs font-bold text-[#4C1D95] hover:underline">Clear All</button>
              </div>

              {/* Sidebar Filters */}
              <>
                <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                    Job Category <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="space-y-3">
                    {['Web, Mobile & Software Dev', 'IT & Networking', 'Data Science & Analytics', 'Engineering & Architecture', 'Design & Creative', 'Writing & Translation', 'Sales & Marketing', 'Admin Support', 'Customer Service', 'Accounting & Consulting', 'Legal'].map((cat, i) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" defaultChecked={i===0} className="peer sr-only" />
                          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded peer-checked:border-[#4C1D95]/20 peer-checked:bg-[#4C1D95] transition-colors"></div>
                          <CheckIcon className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                    Job Type <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="space-y-3">
                    {['Any Job Type', 'Hourly', 'Fixed-Price'].map((type, i) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="radio" name="jobtype" defaultChecked={i===0} className="peer sr-only" />
                          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded-full peer-checked:border-[#4C1D95]/20 peer-checked:bg-[#4C1D95] transition-colors"></div>
                          <div className="w-2 h-2 bg-white rounded-full absolute opacity-0 peer-checked:opacity-100"></div>
                        </div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        <div className="flex-1 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-bold text-zinc-500">
              Showing <span className="text-zinc-900 dark:text-white">{jobs.length}</span> {jobTypeFilter === 'onsite' ? 'on-site' : 'online'} jobs
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-zinc-500">Sort by:</span>
              <select className="bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold outline-none cursor-pointer">
                <option>Newest</option>
                <option>Highest Budget</option>
              </select>
            </div>
          </div>

          {/* JOBS FEED */}
          <>
            {/* Online vs Onsite Toggle */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-2 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => setJobTypeFilter('online')}
                className={cn("flex-1 py-3 px-4 sm:px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all", jobTypeFilter === 'online' ? "bg-[#4C1D95]/5 dark:bg-[#4C1D95]/30 text-[#4C1D95] dark:text-[#4C1D95] shadow-sm" : "text-zinc-500 hover:bg-surface dark:hover:bg-zinc-800")}
              >
                <Globe className="w-4 h-4 shrink-0" /> <span className="truncate">Online Jobs (Remote)</span>
              </button>
              <button 
                onClick={() => setJobTypeFilter('onsite')}
                className={cn("flex-1 py-3 px-4 sm:px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all", jobTypeFilter === 'onsite' ? "bg-[#4C1D95]/5 dark:bg-[#4C1D95]/30 text-[#4C1D95] dark:text-[#4C1D95] shadow-sm" : "text-zinc-500 hover:bg-surface dark:hover:bg-zinc-800")}
              >
                <Building2 className="w-4 h-4 shrink-0" /> <span className="truncate">Onsite Jobs (Local)</span>
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" /></div>
              ) : jobs.length === 0 ? (
                <p className="text-center text-zinc-500 py-12">No jobs in this category yet.</p>
              ) : (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link to={job.detailPath || `/find-work/work/${job.id}`} className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-[#4C1D95] transition-colors cursor-pointer mb-1 block">
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                        <span>{job.client?.name || job.clientName || 'Client'}</span>
                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <span className="flex items-center gap-1">
                          {job.workMode === 'local' ? <Building2 className="w-3.5 h-3.5 text-amber-500" /> : <Globe className="w-3.5 h-3.5 text-[#4C1D95]" />}
                          {job.locationLabel || job.location || 'Remote'}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    <span>{job.budgetType || job.type || 'Fixed'}</span>
                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                    <span className="text-zinc-900 dark:text-white font-black">{job.budgetLabel || job.budget}</span>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">{job.summary || job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(job.skills || []).slice(0, 5).map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))
              )}
            </div>
          </>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-colors">
              Load More Results
            </button>
          </div>

        </div>

      </div>
    </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}


