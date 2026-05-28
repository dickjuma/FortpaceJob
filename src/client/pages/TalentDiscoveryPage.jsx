import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShieldCheck, Zap, TrendingUp, Sparkles, MapPin, CheckCircle, ChevronDown, BarChart2 } from 'lucide-react';

export default function TalentDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const recommendedTalent = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior React Engineer', match: 98, trust: 99, rate: '$85/hr', skills: ['React', 'Node.js', 'AWS'], location: 'San Francisco, CA', tags: ['Best Match', 'Top Rated Plus', 'Fast Responder'], avatar: 'bg-brand-500' },
    { id: 2, name: 'David Chen', role: 'Full Stack Developer', match: 92, trust: 95, rate: '$65/hr', skills: ['Vue.js', 'Python', 'Docker'], location: 'Toronto, Canada', tags: ['Rising Talent', 'Available Now'], avatar: 'bg-brand-500' },
    { id: 3, name: 'Elena Rodriguez', role: 'UI/UX Engineer', match: 88, trust: 92, rate: '$75/hr', skills: ['Figma', 'React', 'Tailwind'], location: 'Madrid, Spain', tags: ['Design Expert', 'High Success Rate'], avatar: 'bg-success' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans bg-surface-tertiary dark:bg-surface-dark-secondary min-h-screen">
      
      {/* Header & Smart Search */}
      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-dark dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-brand-600" /> Talent Intelligence Discovery
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered matchmaking to find the perfect freelancer for your next enterprise project.</p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-4 shadow-card flex flex-col md:flex-row gap-4 relative z-20">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -tranzinc-y-1/2 text-brand-500" />
            <input 
              type="text" 
              placeholder="Describe what you need built (e.g. 'I need a React developer who knows Stripe')..." 
              className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-surface-dark-secondary border-none rounded-xl text-surface-dark dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -tranzinc-y-1/2 px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-bold rounded-md">
              AI Search
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-xl text-sm font-bold text-surface-dark dark:text-white hover:bg-surface dark:hover:bg-surface-dark-tertiary flex items-center transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
            <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center transition-all">
              Find Matches
            </button>
          </div>
        </div>
        
        {/* Smart Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-bold shrink-0 cursor-pointer shadow-md">All Recommended</span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-brand-300 cursor-pointer transition-colors flex items-center">Available Now <CheckCircle className="w-4 h-4 ml-2 text-success" /></span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-brand-300 cursor-pointer transition-colors">US Only</span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-brand-300 cursor-pointer transition-colors">Top Rated Plus</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Analytics/Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-secondary rounded-2xl p-6 shadow-card text-white relative overflow-hidden border border-surface-dark-border">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-500 rounded-full opacity-20 blur-3xl"></div>
            <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-brand-400" /> Market Insights</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Avg. React Dev Rate</p>
                <p className="font-bold text-xl">$75 - $120/hr</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Availability Demand</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-danger h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-danger mt-1">High Demand (85%)</p>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <button className="text-brand-400 font-bold hover:text-brand-300 flex items-center text-xs uppercase tracking-wider">
                  View Full Report <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-bold text-surface-dark dark:text-white">AI Recommended Matches <span className="text-gray-400 font-normal ml-2">Based on your project history</span></h2>
            <span className="text-sm text-brand-600 font-bold cursor-pointer">Sort by: Match Score</span>
          </div>

          <div className="space-y-4">
            {recommendedTalent.map((freelancer, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={freelancer.id} 
                className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border hover:border-brand-300 dark:hover:border-brand-700 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar & Core Scores */}
                  <div className="flex flex-col items-center gap-3 w-full md:w-48 shrink-0 border-r border-transparent md:border-gray-100 dark:md:border-surface-dark-border pr-0 md:pr-6">
                    <div className={`w-24 h-24 rounded-full ${freelancer.avatar} border-4 border-white dark:border-surface-dark shadow-sm relative`}>
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-2 border-white dark:border-surface-dark"></div>
                    </div>
                    
                    <div className="w-full space-y-2 mt-2">
                      <div className="flex justify-between items-center bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-lg border border-brand-100 dark:border-brand-900/50">
                        <span className="text-xs font-bold text-brand-700 dark:text-brand-400 flex items-center"><Zap className="w-3 h-3 mr-1" /> Match</span>
                        <span className="text-sm font-black text-brand-600 dark:text-brand-400">{freelancer.match}%</span>
                      </div>
                      <div className="flex justify-between items-center bg-success/10 px-3 py-1.5 rounded-lg border border-success/20">
                        <span className="text-xs font-bold text-success flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Trust</span>
                        <span className="text-sm font-black text-success">{freelancer.trust}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-black text-surface-dark dark:text-white flex items-center gap-2">
                          {freelancer.name} <CheckCircle className="w-5 h-5 text-brand-500" />
                        </h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">{freelancer.role} • {freelancer.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-surface-dark dark:text-white">{freelancer.rate}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-surface-tertiary dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-md text-xs font-bold flex items-center gap-1">
                          {tag === 'Best Match' && <Sparkles className="w-3 h-3 text-brand-500" />}
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Top Skills</p>
                      <div className="flex gap-2">
                        {freelancer.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 rounded-full text-xs font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Explainable AI block */}
                    <div className="bg-surface dark:bg-surface-dark-secondary rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 border border-gray-100 dark:border-surface-dark-border opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <p><strong>AI Insight:</strong> Sarah has successfully completed 4 enterprise projects utilizing the exact tech stack you searched for. She has a 100% on-time delivery rate for tasks matching this complexity.</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-3 justify-center w-full md:w-32 shrink-0 border-t border-transparent md:border-gray-100 dark:md:border-surface-dark-border pt-4 md:pt-0 pl-0 md:pl-6 border-l">
                    <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors">
                      Invite
                    </button>
                    <button className="w-full py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border hover:bg-surface dark:hover:bg-surface-dark-secondary text-surface-dark dark:text-white rounded-lg text-sm font-bold transition-colors">
                      Compare
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
