import React from 'react';
import { Zap, Target, UserPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIRecommendationFeed() {
  const matches = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior React Engineer',
      matchScore: 98,
      reason: 'Perfect overlap with your required stack (React, TypeScript). Previously completed 3 enterprise projects similar to your active job posting.',
      availability: 'Available Now',
      rate: '$95/hr'
    },
    {
      id: 2,
      name: 'David Kim',
      role: 'Full Stack Node.js',
      matchScore: 94,
      reason: 'Strong historical success working with clients in your industry (FinTech). Highly rated for communication.',
      availability: 'Available in 1 week',
      rate: '$110/hr'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-bold">AI Talent Matchmaker</h1>
            </div>
            <p className="text-brand-100 text-lg leading-relaxed">
              Our neural matching engine analyzed your active job "Enterprise React Dashboard" against 240,000 freelancers to find these highly compatible candidates.
            </p>
          </div>
          <button className="flex-shrink-0 px-6 py-3 bg-white text-brand-900 font-bold rounded-xl shadow-lg hover:bg-surface transition-colors flex items-center">
            Refine Algorithm <Target className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Recommendations</h2>
        
        {matches.map((match, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            key={match.id} 
            className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-brand-100 dark:border-brand-900/30 shadow-sm overflow-hidden flex flex-col md:flex-row relative"
          >
            {/* Match Score Indicator */}
            <div className="md:w-48 bg-brand-50 dark:bg-brand-900/10 p-6 flex flex-col items-center justify-center border-r border-brand-100 dark:border-brand-900/30">
              <div className="relative w-24 h-24 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="8" />
                  <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" className="text-brand-500" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (264 * match.matchScore) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{match.matchScore}%</span>
                </div>
              </div>
              <span className="text-sm font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wide">Match</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{match.name}</h3>
                    <p className="text-brand-600 dark:text-brand-400 font-medium">{match.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{match.rate}</span>
                  </div>
                </div>
                
                <div className="bg-surface dark:bg-gray-800/50 rounded-xl p-4 mt-4 mb-6 border border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-900 dark:text-white">Why they match:</strong> {match.reason}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="text-sm font-medium text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  {match.availability}
                </div>
                <div className="flex space-x-3">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <X className="w-5 h-5" />
                  </button>
                  <button className="px-5 py-2 bg-brand-600 text-white font-medium text-sm rounded-lg hover:bg-brand-700 transition-colors shadow-sm flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" /> Invite
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
