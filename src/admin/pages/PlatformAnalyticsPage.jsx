import React from 'react';
import { 
  BarChart2, TrendingUp, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function PlatformAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 text-[#4C1D95] rounded-xl shadow-sm">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Platform Analytics</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Deep dive into revenue trends, user growth, and core platform metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (MTD)', value: 'KES 4.2M', trend: '+14.2%', up: true, icon: DollarSign, color: 'emerald' },
          { label: 'Active Users', value: '24,591', trend: '+5.4%', up: true, icon: Users, color: 'blue' },
          { label: 'Platform Fees', value: 'KES 630K', trend: '+12.1%', up: true, icon: TrendingUp, color: 'violet' },
          { label: 'Avg Escrow Time', value: '4.2 Days', trend: '-0.5%', up: false, icon: Activity, color: 'amber' }
        ].map((stat, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
               <div className={cn(
                 "p-2 rounded-lg",
                 stat.color === 'emerald' ? 'bg-emerald-50 text-success dark:bg-emerald-900/20' :
                 stat.color === 'blue' ? 'bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/20' :
                 stat.color === 'violet' ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/20' :
                 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
               )}>
                 <stat.icon size={18} />
               </div>
               <span className={cn(
                 "flex items-center text-xs font-bold",
                 stat.up ? "text-success" : "text-rose-600"
               )}>
                 {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
               </span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-96 flex flex-col">
           <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Revenue Growth (Last 6 Months)</h3>
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-surface dark:bg-zinc-800/50">
             <span className="text-zinc-400 font-bold">Chart Component Pending Data Integration</span>
           </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-96 flex flex-col">
           <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Fee Distribution</h3>
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-surface dark:bg-zinc-800/50">
             <span className="text-zinc-400 font-bold">Chart Component Pending Data Integration</span>
           </div>
        </div>
      </div>
    </div>
  );
}


