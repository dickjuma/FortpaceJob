import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, SlidersHorizontal, ChevronDown, Star, 
  MapPin, Clock, ShieldCheck, Sparkles, X, Heart
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';


const FREELANCERS = [
  { id: 1, name: 'Alex Rivera', title: 'Senior React Developer', rating: 4.9, reviews: 124, rate: '$45/hr', location: 'United States', available: true, image: 'https://i.pravatar.cc/150?u=a1', tags: ['React', 'Next.js', 'Tailwind'] },
  { id: 2, name: 'Sarah Mitchell', title: 'UX/UI Designer', rating: 5.0, reviews: 89, rate: '$55/hr', location: 'United Kingdom', available: false, image: 'https://i.pravatar.cc/150?u=s1', tags: ['Figma', 'Prototyping', 'User Research'] },
  { id: 3, name: 'David Kim', title: 'Fullstack Node.js Engineer', rating: 4.8, reviews: 210, rate: '$60/hr', location: 'Canada', available: true, image: 'https://i.pravatar.cc/150?u=d2', tags: ['Node.js', 'PostgreSQL', 'AWS'] },
];



const SERVICES = [
  { id: 1, author: 'Alex Rivera', authorImage: 'https://i.pravatar.cc/150?u=a1', title: 'I will build a high-converting React or Next.js website', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=600', rating: 5.0, reviews: 243, startingPrice: '$500', delivery: '3 Days' },
  { id: 2, author: 'Sarah Mitchell', authorImage: 'https://i.pravatar.cc/150?u=s1', title: 'I will design a modern, user-friendly mobile app UX/UI in Figma', image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800&h=600', rating: 4.9, reviews: 128, startingPrice: '$350', delivery: '5 Days' },
  { id: 3, author: 'David Kim', authorImage: 'https://i.pravatar.cc/150?u=d2', title: 'I will create a powerful scalable Node.js backend API', image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800&h=600', rating: 5.0, reviews: 89, startingPrice: '$600', delivery: '7 Days' },
];

const AGENCIES = [
  { id: 1, name: 'Elevate Digital', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150&h=150', tagline: 'Award-winning web and mobile app development agency.', rate: '$80 - $150/hr', earned: '$1M+ Earned', success: '99%', description: 'We are a team of 45 expert engineers and designers specializing in full-stack development, cloud architecture, and enterprise software solutions.', topSkills: ['Web Development', 'Mobile Apps', 'Cloud Architecture', 'UX/UI'] },
  { id: 2, name: 'Creative Spark Studios', logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150&h=150', tagline: 'Strategic branding and product design for startups.', rate: '$60 - $120/hr', earned: '$500k+ Earned', success: '100%', description: 'Helping visionary founders turn complex ideas into beautiful, intuitive products. We handle everything from logo design to complete design systems.', topSkills: ['Brand Identity', 'Product Design', 'Figma', 'Prototyping'] },
];

export default function GlobalSearchPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'freelancers';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showFilters, setShowFilters] = useState(true);

  // Update tab if URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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

        {/* Categories / Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-2 flex gap-8 border-t border-zinc-100 dark:border-zinc-800/50 overflow-x-auto custom-scrollbar">
          {['Freelancers', 'Services (Gigs)', 'Agencies'].map(tab => {
            const id = tab.split(' ')[0].toLowerCase();
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 flex items-center gap-2",
                  activeTab === id ? "border-brand-600 text-brand-600 dark:text-brand-400" : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {tab}
              </button>
            )
          })}
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

              {/* Dynamic Sidebar Filters based on Tab */}


              {activeTab === 'freelancers' && (
                <>
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Category <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      {['Web, Mobile & Software Dev', 'Design & Creative', 'Sales & Marketing', 'Writing & Translation', 'Admin Support'].map((cat, i) => (
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
                      Hourly Rate <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      {['Any hourly rate', '$10 - $30', '$30 - $60', '$60 & Above'].map((rate, i) => (
                        <label key={rate} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" name="rate" defaultChecked={i===2} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded-full peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                            <div className="w-2 h-2 bg-white rounded-full absolute opacity-0 peer-checked:opacity-100"></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{rate}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Skills <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="relative mb-3">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -tranzinc-y-1/2" />
                      <input type="text" placeholder="Search skills" className="w-full bg-surface dark:bg-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-700 outline-none" />
                    </div>
                    <div className="space-y-3">
                      {['React', 'Next.js', 'TypeScript', 'Node.js'].map(skill => (
                        <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" defaultChecked={skill==='React'} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                            <CheckIcon className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100" />
                          </div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Talent Badges <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                          <CheckIcon className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="text-sm font-bold text-success dark:text-success flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Top Rated Plus</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                          <CheckIcon className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Star className="w-4 h-4 fill-amber-600 dark:fill-amber-400" /> Top Rated</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Job Success Score <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      {['Any Job Success', '90% & Up', '80% & Up'].map((score, i) => (
                        <label key={score} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" name="successScore" defaultChecked={i===0} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded-full peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                            <div className="w-2 h-2 bg-white rounded-full absolute opacity-0 peer-checked:opacity-100"></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{score}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'services' && (
                <>
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Delivery Time <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      {['Any Delivery Time', 'Up to 24 hours', 'Up to 3 days', 'Up to 7 days'].map((time, i) => (
                        <label key={time} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" name="delivery" defaultChecked={i===0} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded-full peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                            <div className="w-2 h-2 bg-white rounded-full absolute opacity-0 peer-checked:opacity-100"></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Budget <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="flex gap-4">
                      <input type="number" placeholder="Min" className="w-1/2 bg-surface dark:bg-zinc-800 rounded-lg px-3 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-brand-500/50" />
                      <input type="number" placeholder="Max" className="w-1/2 bg-surface dark:bg-zinc-800 rounded-lg px-3 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'agencies' && (
                <>
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <button className="flex justify-between items-center w-full font-bold text-zinc-900 dark:text-white mb-4">
                      Agency Size <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      {['Any Size', '1 - 10 employees', '10 - 50 employees', '50+ employees'].map((size, i) => (
                        <label key={size} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" name="size" defaultChecked={i===0} className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded-full peer-checked:border-brand-500 peer-checked:bg-brand-500 transition-colors"></div>
                            <div className="w-2 h-2 bg-white rounded-full absolute opacity-0 peer-checked:opacity-100"></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          </motion.div>
        )}

        {/* Search Results */}
        <div className="flex-1 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-bold text-zinc-500">Showing <span className="text-zinc-900 dark:text-white">{activeTab === 'jobs' ? '4,521' : activeTab === 'services' ? '24,103' : activeTab === 'agencies' ? '142' : '1,248'}</span> results for "React Developer"</p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-zinc-500">Sort by:</span>
              <select className="bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold outline-none cursor-pointer">
                <option>{activeTab === 'jobs' ? 'Newest' : 'Best Match (AI)'}</option>
                <option>{activeTab === 'jobs' ? 'Highest Budget' : 'Highest Rated'}</option>
              </select>
            </div>
          </div>


          {/* FREELANCERS FEED */}
          {activeTab === 'freelancers' && (
            <>
              {/* AI Banner */}
              <div className="bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">AI Match Optimization Applied</h4>
                  <p className="text-xs font-medium text-brand-100">Results are re-ranked based on your past hiring preferences and project success rates.</p>
                </div>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {/* Results List - Upwork-Style Horizontal Cards */}
              <div className="space-y-6">
                {FREELANCERS.map((freelancer, index) => (
                  <motion.div
                    key={freelancer.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="shrink-0 relative">
                        <img 
                          src={freelancer.image} 
                          alt={freelancer.name} 
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-zinc-100 dark:border-zinc-800 shadow-sm"
                        />
                        <div className={cn("absolute -bottom-2 -right-2 rounded-full p-1 bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800", freelancer.available ? "text-success" : "text-zinc-400")}>
                          <ShieldCheck className="w-5 h-5" fill="currentColor" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white hover:text-brand-600 transition-colors cursor-pointer">{freelancer.name}</h3>
                            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1">{freelancer.title}</p>
                            <div className="flex items-center gap-1 mt-1.5 text-xs font-bold text-zinc-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {freelancer.location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors hidden sm:block">
                              <Heart className="w-5 h-5" />
                            </button>
                            <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors hidden sm:block">
                              Invite to Job
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 my-4 p-3 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50 text-sm">
                          <div>
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Rate</span>
                            <span className="font-black text-zinc-900 dark:text-white">{freelancer.rate}</span>
                          </div>
                          <div className="w-px bg-zinc-200 dark:bg-zinc-700"></div>
                          <div>
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Total Earned</span>
                            <span className="font-bold text-zinc-900 dark:text-white">$10k+ Earned</span>
                          </div>
                          <div className="w-px bg-zinc-200 dark:bg-zinc-700"></div>
                          <div>
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Job Success</span>
                            <span className="font-bold text-success flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> 100%</span>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-5">
                          Senior professional with extensive experience building scalable solutions. Expert in the required technology stack with a proven track record of delivering high-performance projects on time.
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {freelancer.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-600 dark:text-zinc-300 text-xs rounded-xl font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-6 sm:hidden">
                          <button className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">
                            Invite
                          </button>
                          <button className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm shadow-sm transition-colors">
                            Profile
                          </button>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* SERVICES (GIGS) FEED - Fiverr Style */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={service.authorImage} alt={service.author} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{service.author}</p>
                        <p className="text-xs font-medium text-zinc-500">Level 2 Seller</p>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-zinc-900 dark:text-white leading-tight mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mt-auto mb-4">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-zinc-900 dark:text-white">{service.rating}</span>
                      <span className="text-sm font-medium text-zinc-500">({service.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-zinc-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.delivery}</span>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Starting at</span>
                        <span className="font-black text-lg text-zinc-900 dark:text-white">{service.startingPrice}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* AGENCIES FEED - Upwork Style */}
          {activeTab === 'agencies' && (
            <div className="space-y-6">
              {AGENCIES.map((agency, index) => (
                <motion.div
                  key={agency.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="shrink-0">
                      <img src={agency.logo} alt={agency.name} className="w-24 h-24 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-black text-zinc-900 dark:text-white hover:text-brand-600 transition-colors cursor-pointer">{agency.name}</h3>
                          <p className="text-sm font-bold text-zinc-500 mt-1">{agency.tagline}</p>
                        </div>
                        <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors shrink-0 hidden sm:block">
                          Contact Agency
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-6 my-4 p-3 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50 text-sm">
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Rate</span>
                          <span className="font-bold text-zinc-900 dark:text-white">{agency.rate}</span>
                        </div>
                        <div className="w-px bg-zinc-200 dark:bg-zinc-700"></div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Total Earned</span>
                          <span className="font-bold text-zinc-900 dark:text-white">{agency.earned}</span>
                        </div>
                        <div className="w-px bg-zinc-200 dark:bg-zinc-700"></div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Job Success</span>
                          <span className="font-bold text-success flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> {agency.success}</span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-5">
                        {agency.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {agency.topSkills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-600 dark:text-zinc-300 text-xs rounded-xl font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <button className="w-full mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors sm:hidden">
                        Contact Agency
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

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
