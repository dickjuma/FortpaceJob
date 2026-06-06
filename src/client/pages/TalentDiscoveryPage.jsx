import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldCheck, Zap, Sparkles, CheckCircle, ChevronDown, BarChart2, AlertCircle, Building2 } from 'lucide-react';
import { useFreelancers } from '../services/clientHooks';

export default function TalentDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [talentType, setTalentType] = useState('');
  
  const filters = {
    limit: 10,
    sort: 'rankingScore',
    ...(searchQuery && { q: searchQuery }),
    ...(talentType && { accountType: talentType }),
  };

  const { data, isLoading, error } = useFreelancers(filters);
  const recommendedTalent = data?.items || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans bg-surface-tertiary dark:bg-surface-dark-secondary min-h-screen">
      
      {/* Header & Smart Search */}
      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-dark dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-success" /> Talent Intelligence Discovery
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered matchmaking to find the perfect freelancer for your next enterprise project.</p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-4 shadow-card flex flex-col md:flex-row gap-4 relative z-20">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-success" />
            <input 
              type="text" 
              placeholder="Describe what you need built (e.g. 'I need a React developer who knows Stripe')..." 
              className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-surface-dark-secondary border-none rounded-xl text-surface-dark dark:text-white outline-none focus:ring-2 focus:ring-success transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#4C1D95]/10 text-success text-xs font-bold rounded-md">
              AI Search
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-xl text-sm font-bold text-surface-dark dark:text-white hover:bg-surface dark:hover:bg-surface-dark-tertiary flex items-center transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
            <select
              value={talentType}
              onChange={(e) => setTalentType(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-xl text-sm font-bold text-surface-dark dark:text-white hover:bg-surface dark:hover:bg-surface-dark-tertiary transition-colors outline-none"
            >
              <option value="">All talent types</option>
              <option value="INDIVIDUAL">Individuals</option>
              <option value="SME">SMEs / Studios</option>
              <option value="CORPORATE">Corporate teams</option>
            </select>
            <button className="px-6 py-3 bg-success hover:bg-[#22C55E] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#4C1D95]/25 flex items-center transition-all">
              Find Matches
            </button>
          </div>
        </div>
        
        {/* Smart Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="px-4 py-2 bg-success text-white rounded-full text-sm font-bold shrink-0 cursor-pointer shadow-md">All Recommended</span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-[#4C1D95]/50 cursor-pointer transition-colors flex items-center">Available Now <CheckCircle className="w-4 h-4 ml-2 text-success" /></span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-[#4C1D95]/50 cursor-pointer transition-colors">US Only</span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-[#4C1D95]/50 cursor-pointer transition-colors">Top Rated Plus</span>
          <span className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium shrink-0 hover:border-[#4C1D95]/50 cursor-pointer transition-colors flex items-center gap-1">
            <Building2 className="w-4 h-4" /> {talentType || 'All Providers'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Analytics/Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-secondary rounded-2xl p-6 shadow-card text-white relative overflow-hidden border border-surface-dark-border">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-success rounded-full opacity-20 blur-3xl"></div>
            <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-success" /> Market Insights</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Avg. React Dev Rate</p>
                <p className="font-bold text-xl">$75 - $120/hr</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Availability Demand</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-success mt-1">High Demand (85%)</p>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <button className="text-[#4C1D95] font-bold hover:text-[#22C55E] flex items-center text-xs uppercase tracking-wider">
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
            <span className="text-sm text-[#4C1D95] font-bold cursor-pointer">Sort by: Match Score</span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl">
                <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Failed to load recommendations.</p>
              </div>
            ) : recommendedTalent.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl">
                <Search className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No freelancers found. Try adjusting your search.</p>
              </div>
            ) : (
              recommendedTalent.map((freelancer, idx) => {
                const name = freelancer.name || 
                             (freelancer.actor?.user ? `${freelancer.actor.user.firstName || ''} ${freelancer.actor.user.lastName || ''}`.trim() : null) || 
                             `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim() || 
                             'Freelancer';
                const role = freelancer.title || freelancer.headline || 'Freelancer';
                const rate = freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : (freelancer.rate ? `$${freelancer.rate}/hr` : 'Negotiable');
                const skills = freelancer.skills ? (Array.isArray(freelancer.skills) ? freelancer.skills.map(s => typeof s === 'object' ? s.name : s) : freelancer.skills.split(',')) : [];
                const match = Math.round((freelancer.rankingScore || 0.85) * 100);
                const trust = Math.round((freelancer.ratingAverage || freelancer.rating || 4.5) * 20);
                const location = freelancer.location || 'Remote';
                const avatarUrl = freelancer.avatar || freelancer.profilePicture;
                const providerType = (freelancer.accountType || freelancer.businessStructure || 'INDIVIDUAL').toUpperCase();
                
                // Derive some smart tags for the UI demo based on real data
                const tags = [];
                if (match > 90) tags.push('Best Match');
                if (trust >= 95) tags.push('Top Rated Plus');
                if (freelancer.availability === 'FULL_TIME') tags.push('Available Now');
                if (providerType === 'CORPORATE') tags.push('Corporate');
                if (providerType === 'SME') tags.push('SME / Studio');
                if (tags.length === 0) tags.push('Rising Talent');

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={freelancer.id || freelancer.userId || idx} 
                    className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border hover:border-success rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar & Core Scores */}
                      <div className="flex flex-col items-center gap-3 w-full md:w-48 shrink-0 border-r border-transparent md:border-gray-100 dark:md:border-surface-dark-border pr-0 md:pr-6">
                        <div className={`w-24 h-24 rounded-full ${!avatarUrl ? 'bg-success' : 'bg-surface-tertiary'} border-4 border-white dark:border-surface-dark shadow-sm relative flex items-center justify-center overflow-hidden`}>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-bold text-white">{name[0]?.toUpperCase()}</span>
                          )}
                          <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-2 border-white dark:border-surface-dark"></div>
                        </div>
                        
                        <div className="w-full space-y-2 mt-2">
                          <div className="flex justify-between items-center bg-[#4C1D95]/10 px-3 py-1.5 rounded-lg border border-[#4C1D95]/20">
                            <span className="text-xs font-bold text-success flex items-center"><Zap className="w-3 h-3 mr-1" /> Match</span>
                            <span className="text-sm font-black text-success">{match}%</span>
                          </div>
                          <div className="flex justify-between items-center bg-success/10 px-3 py-1.5 rounded-lg border border-success/20">
                            <span className="text-xs font-bold text-success flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Trust</span>
                            <span className="text-sm font-black text-success">{trust}</span>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-black text-surface-dark dark:text-white flex items-center gap-2">
                              {name} <CheckCircle className="w-5 h-5 text-success" />
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">{role} • {location}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-surface-dark dark:text-white">{rate}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-success/20 bg-[#4C1D95]/10 text-success">
                            {providerType.replace('_', ' ')}
                          </span>
                          {tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-surface-tertiary dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border text-gray-600 dark:text-gray-300 rounded-md text-xs font-bold flex items-center gap-1">
                              {tag === 'Best Match' && <Sparkles className="w-3 h-3 text-success" />}
                              {tag}
                            </span>
                          ))}
                        </div>

                        {skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Top Skills</p>
                            <div className="flex gap-2 flex-wrap">
                              {skills.slice(0, 5).map(skill => (
                                <span key={skill} className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Explainable AI block */}
                        <div className="bg-surface dark:bg-surface-dark-secondary rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 border border-gray-100 dark:border-surface-dark-border opacity-0 group-hover:opacity-100 transition-opacity">
                          <Sparkles className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <p><strong>AI Insight:</strong> {name} matches your search profile with high confidence. Based on recent successful contracts, they deliver quality work in this domain.</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-3 justify-center w-full md:w-32 shrink-0 border-t border-transparent md:border-gray-100 dark:md:border-surface-dark-border pt-4 md:pt-0 pl-0 md:pl-6 border-l">
                        <button className="w-full py-2.5 bg-success hover:bg-[#22C55E] text-white rounded-lg text-sm font-bold shadow-md transition-colors">
                          Invite
                        </button>
                        <button className="w-full py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border hover:bg-surface dark:hover:bg-surface-dark-secondary text-surface-dark dark:text-white rounded-lg text-sm font-bold transition-colors">
                          Compare
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


