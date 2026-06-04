import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Target, TrendingUp, AlertCircle, ChevronRight, Eye, CheckCircle } from 'lucide-react';

export default function RankingDashboard() {
  const scores = [
    { label: 'Overall Rank Score', value: 94, max: 100, color: 'brand' },
    { label: 'Visibility Index', value: 88, max: 100, color: 'accent' },
    { label: 'Trust Score', value: 99, max: 100, color: 'success' },
    { label: 'Match Rate', value: 76, max: 100, color: 'warning' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 font-sans">
      <div className="mb-8 border-b border-gray-200 dark:border-surface-dark-border pb-6">
        <h1 className="text-3xl font-bold text-surface-dark dark:text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-[#2bb75c]" /> Ranking & Visibility Center
        </h1>
        <p className="text-sm text-gray-500 mt-1">Understand your algorithm placement, trust rating, and discover actionable AI insights to win more enterprise contracts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Ranking Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-surface-dark to-surface-dark-secondary rounded-2xl p-8 shadow-card text-white relative overflow-hidden border border-surface-dark-border">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#2bb75c] rounded-full opacity-10 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Circular Progress (Mock) */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-dark-tertiary" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * 0.94)} className="text-[#2bb75c]" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">94</span>
                <span className="text-xs font-bold text-[#2bb75c] uppercase tracking-widest">Top 5%</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">Excellent Marketplace Position</h2>
                <p className="text-gray-400 mt-1">Your profile is highly optimized. You appear on page 1 for 85% of relevant enterprise searches.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-3 py-1.5 bg-success/20 border border-success/30 text-success rounded-lg text-sm font-bold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1.5" /> Rank +2 points this week
                </div>
                <div className="px-3 py-1.5 bg-[#2bb75c]/20 border border-[#2bb75c]/20/30 text-[#2bb75c] rounded-lg text-sm font-bold flex items-center">
                  <Eye className="w-4 h-4 mr-1.5" /> 1,204 Impressions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Action Items */}
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-surface-dark-border bg-surface-secondary dark:bg-surface-dark-secondary">
            <h3 className="font-bold text-surface-dark dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" /> AI Optimization Engine
            </h3>
          </div>
          <div className="p-5 space-y-4 flex-1">
            <div className="p-3 border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/50 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 rounded-xl">
              <p className="text-sm font-bold text-surface-dark dark:text-white mb-1">+5 Score Potential</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Adding "Next.js 14" to your skills matches current high-demand searches.</p>
              <button className="text-xs font-bold text-[#2bb75c] dark:text-[#2bb75c] hover:underline">Update Profile →</button>
            </div>
            <div className="p-3 border border-gray-200 dark:border-surface-dark-border bg-surface-tertiary dark:bg-surface-dark-secondary rounded-xl">
              <p className="text-sm font-bold text-surface-dark dark:text-white mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Response Rate Optimal</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Your average response time of 15 mins keeps you favored in the matching engine.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Metrics Breakdown */}
      <h2 className="text-xl font-bold text-surface-dark dark:text-white mb-4">Score Decomposition</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scores.map((score, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-500">{score.label}</h3>
              <span className={`text-2xl font-black text-${score.color}-600 dark:text-${score.color}-500`}>{score.value}</span>
            </div>
            <div className="w-full bg-surface-tertiary dark:bg-surface-dark-secondary rounded-full h-2">
              <div className={`bg-${score.color}-500 h-2 rounded-full`} style={{ width: `${score.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

