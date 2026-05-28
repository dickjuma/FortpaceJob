import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, TrendingUp, Search, DollarSign, Target, 
  ArrowUpRight, AlertCircle, CheckCircle2, ChevronRight,
  Zap, BarChart3, Users
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

export default function GigPerformanceInsightsPage() {
  return (
    <div className="p-4 sm:p-8 w-full font-sans max-w-7xl mx-auto min-h-screen bg-surface dark:bg-surface-dark">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Performance Insights</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Smart recommendations to boost your ranking and revenue.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Top AI Summary Alert */}
          <div className="bg-gradient-to-r from-violet-600 to-brand-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <h2 className="text-lg font-bold">Optimization Opportunity</h2>
                </div>
                <p className="text-brand-50 leading-relaxed font-medium mb-6">
                  Your "React JS Development" gig is performing well in search, but dropping off at the pricing page. Aligning your Premium package with market averages could increase your monthly revenue by an estimated <strong className="text-white text-lg">$1,200</strong>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-surface shadow-sm transition-colors text-sm">
                    Review Pricing
                  </button>
                  <button className="px-6 py-2.5 bg-brand-700/50 hover:bg-brand-700 border border-brand-400/30 text-white font-bold rounded-xl transition-colors text-sm">
                    Dismiss
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-48 bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center shrink-0">
                <span className="text-xs font-bold text-brand-200 uppercase tracking-wider block mb-1">Growth Potential</span>
                <span className="text-4xl font-black text-white block mb-1">+24%</span>
                <span className="text-xs font-medium text-brand-100 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> in Conversion
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SEO Analysis Card */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm group hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl text-brand-600 dark:text-brand-400">
                  <Search className="w-6 h-6" />
                </div>
                <span className="bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Needs Attention
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">SEO & Keyword Analysis</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium leading-relaxed">
                You are currently ranking #12 for "React Developer". Adding "Next.js" and "TailwindCSS" to your tags and description is highly recommended based on current search trends.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-semibold p-3 bg-surface dark:bg-zinc-800/50 rounded-xl">
                  <span className="text-zinc-600 dark:text-zinc-400">Current Ranking Score</span>
                  <span className="text-amber-500">72/100</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl border border-brand-100 dark:border-brand-500/20">
                  <span className="text-brand-700 dark:text-brand-400">Predicted Score</span>
                  <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1">94/100 <TrendingUp className="w-3.5 h-3.5" /></span>
                </div>
              </div>

              <div className="flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 group-hover:underline">
                Update Keywords <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Pricing Suggestions Card */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-emerald-50 dark:bg-success/10 rounded-xl text-success dark:text-success">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 dark:bg-success/10 text-success dark:text-success px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Good Standing
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Pricing Strategy</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium leading-relaxed">
                Your Basic ($50) and Standard ($120) packages are perfectly aligned with the market. However, 45% of buyers in your category purchase a Premium package averaging $350. Yours is currently $250.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-zinc-400 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="text-xs font-bold text-zinc-500 shrink-0">Your Avg: $185</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-emerald-100 dark:bg-success/20 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-xs font-bold text-success shrink-0">Market: $240</span>
                </div>
              </div>

              <div className="flex items-center text-sm font-bold text-success dark:text-success group-hover:underline">
                Adjust Pricing <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Competitor Comparison Card */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Competitor Benchmarking</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">How you compare to top 10% sellers in "Web Development".</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Metric</th>
                      <th className="pb-3 px-4">You</th>
                      <th className="pb-3 px-4">Top 10% Sellers</th>
                      <th className="pb-3 pl-4 text-right">Insight</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                      <td className="py-4 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Click-through Rate</td>
                      <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">4.2%</td>
                      <td className="py-4 px-4 font-bold text-zinc-500">6.8%</td>
                      <td className="py-4 pl-4 text-right text-rose-500 font-medium text-xs">Add a video to improve</td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                      <td className="py-4 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Conversion Rate</td>
                      <td className="py-4 px-4 font-bold text-success">2.8%</td>
                      <td className="py-4 px-4 font-bold text-zinc-500">2.5%</td>
                      <td className="py-4 pl-4 text-right text-success font-medium text-xs">You're doing great</td>
                    </tr>
                    <tr>
                      <td className="py-4 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Response Time</td>
                      <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">2 Hrs</td>
                      <td className="py-4 px-4 font-bold text-zinc-500">&lt; 1 Hr</td>
                      <td className="py-4 pl-4 text-right text-amber-500 font-medium text-xs">Download mobile app</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar - Visibility Score */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-surface-dark rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-400" /> Visibility Score
              </h3>
              <span className="text-xs font-bold text-success flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Top 15%
              </span>
            </div>

            <div className="flex justify-center mb-6 relative z-10">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                  <motion.circle 
                    cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className="text-brand-500"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${(85 / 100) * 251.2} 251.2` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-3xl font-black">85</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">/100</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-medium mb-6 relative z-10 text-center">
              Your gig appears on page 2 for most primary keywords. Completing our AI suggestions will push you to page 1.
            </p>

            <button className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl shadow-sm transition-colors relative z-10">
              Auto-Apply AI Fixes
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-400" /> Projected Impact
            </h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4">
              If you apply the 3 recommended changes today, our ML model predicts:
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-success/10 rounded-xl">
                <span className="text-xs font-bold text-emerald-700 dark:text-success">Search Impressions</span>
                <span className="text-sm font-black text-success dark:text-emerald-300">+45%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
                <span className="text-xs font-bold text-brand-700 dark:text-brand-400">Monthly Revenue</span>
                <span className="text-sm font-black text-brand-600 dark:text-brand-300">+$1.2K</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
