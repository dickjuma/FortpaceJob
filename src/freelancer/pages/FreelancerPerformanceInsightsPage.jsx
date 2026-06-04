import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Eye, MousePointerClick, Star, 
  Clock, Zap, Trophy, Target, Award, Sparkles,
  BarChart3, PieChart
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

export default function FreelancerPerformanceInsightsPage() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#2bb75c]" /> Performance Insights
            </h1>
            <p className="text-zinc-500 font-medium">Advanced analytics and AI recommendations to grow your business.</p>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            {['This Week', 'This Month', 'Last 3 Months', 'All Time'].map((p, i) => (
              <button key={p} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", i === 1 ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Profile Views', value: '3,240', trend: '+12%', icon: Eye, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10' },
            { label: 'Proposal Success', value: '28%', trend: '+4%', icon: MousePointerClick, color: 'text-success', bg: 'bg-emerald-50 dark:bg-success/10' },
            { label: 'Response Time', value: '1.2 hr', trend: '-0.5h', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Client Satisfaction', value: '4.9/5', trend: 'Top 5%', icon: Star, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10' }
          ].map(kpi => (
            <div key={kpi.label} className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between group hover:border-[#2bb75c]/50 transition-colors cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", kpi.bg)}>
                  <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                </div>
                <span className="text-xs font-bold text-success bg-emerald-50 dark:bg-success/10 px-2 py-1 rounded-md">{kpi.trend}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{kpi.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Ranking Score */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-amber-500" /> Platform Ranking Score
                  </h2>
                  <p className="text-sm font-medium text-zinc-500">Your visibility score in the marketplace algorithm.</p>
                </div>
                <div className="text-right">
                  <h3 className="text-4xl font-black text-zinc-900 dark:text-white">94<span className="text-xl text-zinc-400 font-bold">/100</span></h3>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Job Success Score', score: 98, weight: '40%' },
                  { label: 'Profile Completeness', score: 100, weight: '20%' },
                  { label: 'Responsiveness', score: 85, weight: '20%' },
                  { label: 'Recent Earnings', score: 90, weight: '20%' }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">{item.label} <span className="text-zinc-400 font-medium ml-1">({item.weight} weight)</span></span>
                      <span className={item.score > 90 ? "text-success" : "text-amber-500"}>{item.score}/100</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 1, ease: 'easeOut' }} className={cn("h-full rounded-full", item.score > 90 ? "bg-success" : "bg-amber-500")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Trends Mock Chart */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
              <BarChart3 className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mb-4" />
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Earnings Trend Chart</h3>
              <p className="text-sm text-zinc-500">Historical revenue graph will be rendered here.</p>
            </div>

          </div>

          {/* Right Column: AI & Competition */}
          <div className="space-y-8">
            
            {/* AI Insights */}
            <div className="bg-gradient-to-br from-[#2bb75c] to-zinc-900 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2bb75c]" /> AI Recommendations
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-bold text-[#2bb75c] uppercase tracking-wider mb-2">Pricing Strategy</p>
                    <p className="text-sm font-medium leading-relaxed">
                      Your current rate of <strong className="text-white">$45/hr</strong> is 15% below the top performers in your category. Consider raising your rate to <strong className="text-white">$55/hr</strong> for new clients.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Skill Demand</p>
                    <p className="text-sm font-medium leading-relaxed">
                      "Next.js App Router" searches have increased by 40% this week. Add this keyword to your React Developer gig title to boost impressions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Competition */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" /> Market Competition
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase">React Developers</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">Your Win Rate</p>
                    </div>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">28%</span>
                  </div>
                  <div className="text-xs text-zinc-500 font-medium">
                    You win 28% of the proposals you submit in this category. The top 10% average is 35%.
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Why you lose proposals (AI Analysis)</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      40% due to higher price than competitors
                    </li>
                    <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      25% due to slower initial response time
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

