import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, SlidersHorizontal, ChevronDown,
  Clock, Heart, Building2, Globe
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';


const JOBS = [
  { id: 1, title: 'Build a Next.js Enterprise Dashboard', company: 'TechNova', type: 'Hourly', budget: '$40 - $70/hr', locationType: 'online', location: 'Remote (Worldwide)', postedAt: '2 hours ago', description: 'We are looking for an experienced Next.js developer to build a high-performance enterprise dashboard. You must be highly proficient with Tailwind CSS, React Query, and modern UI/UX principles.', skills: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'], proposals: '10 to 15' },
  { id: 2, title: 'Senior UI/UX Designer for FinTech Mobile App', company: 'PayFlow Inc.', type: 'Fixed-Price', budget: '$3,000', locationType: 'online', location: 'Remote (US Preferred)', postedAt: '5 hours ago', description: 'Need a senior product designer to redesign our core mobile banking flows. Experience in FinTech is a huge plus. We need wireframes, high-fidelity mockups, and a clickable prototype in Figma.', skills: ['Figma', 'UI/UX Design', 'Mobile Design', 'FinTech'], proposals: '20 to 50' },
  { id: 3, title: 'Onsite React Native Developer', company: 'HealthSync', type: 'Hourly', budget: '$60 - $90/hr', locationType: 'onsite', location: 'San Francisco, CA', postedAt: '1 day ago', description: 'We need an onsite React Native developer in our SF office to work alongside our hardware team to integrate Bluetooth Medical devices with our cross-platform mobile application.', skills: ['React Native', 'Bluetooth (BLE)', 'Mobile App Development'], proposals: 'Less than 5' },
];

export default function GlobalJobsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [jobTypeFilter, setJobTypeFilter] = useState('online'); // 'online', 'onsite', 'all'

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
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-l-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50"
              />
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-r-2xl font-bold transition-all shrink-0">
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
                <button className="text-xs font-bold text-brand-600 hover:underline">Clear All</button>
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
                          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
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
                          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded-full peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
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
            <p className="text-sm font-bold text-zinc-500">Showing <span className="text-zinc-900 dark:text-white">4,521</span> results for "React Developer"</p>
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
                className={cn("flex-1 py-3 px-4 sm:px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all", jobTypeFilter === 'online' ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 shadow-sm" : "text-zinc-500 hover:bg-surface dark:hover:bg-zinc-800")}
              >
                <Globe className="w-4 h-4 shrink-0" /> <span className="truncate">Online Jobs (Remote)</span>
              </button>
              <button 
                onClick={() => setJobTypeFilter('onsite')}
                className={cn("flex-1 py-3 px-4 sm:px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all", jobTypeFilter === 'onsite' ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 shadow-sm" : "text-zinc-500 hover:bg-surface dark:hover:bg-zinc-800")}
              >
                <Building2 className="w-4 h-4 shrink-0" /> <span className="truncate">Onsite Jobs (Local)</span>
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {JOBS.filter(j => jobTypeFilter === 'all' || j.locationType === jobTypeFilter).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors cursor-pointer mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                        <span>{job.company}</span>
                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.postedAt}</span>
                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <span className="flex items-center gap-1">
                          {job.locationType === 'online' ? <Globe className="w-3.5 h-3.5 text-brand-500" /> : <Building2 className="w-3.5 h-3.5 text-amber-500" />}
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    <span>{job.type}</span>
                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                    <span className="text-zinc-900 dark:text-white font-black">{job.budget}</span>
                  </div>

                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-5 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs font-bold text-zinc-500">
                      Proposals: <span className="text-zinc-900 dark:text-white">{job.proposals}</span>
                    </div>
                    <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">
                      Submit Proposal
                    </button>
                  </div>
                </motion.div>
              ))}
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
