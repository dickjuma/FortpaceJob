import React from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, ArrowUpRight, 
  ArrowDownRight, PieChart, Calendar, Download, Filter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm">
              <DollarSign size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Revenue Intelligence</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Deep dive into platform earnings, commission trends, and financial forecasting.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Exporting financial report...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-[#14a800] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: 'KES 4.2M', trend: '+12.5%', up: true },
          { label: 'Platform Fees', value: 'KES 840K', trend: '+8.2%', up: true },
          { label: 'Subscriptions', value: 'KES 1.1M', trend: '+15.4%', up: true },
          { label: 'Avg. Order Value', value: 'KES 12.5K', trend: '-2.1%', up: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</h3>
              <div className={cn(
                "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
                stat.up ? "bg-emerald-50 text-success" : "bg-rose-50 text-rose-600"
              )}>
                {stat.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Revenue Growth Curve</h3>
            <select className="bg-surface dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] flex items-end justify-between gap-2 px-4">
            {[45, 52, 48, 70, 65, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div 
                  className="w-full bg-[#14a800]/20 group-hover:bg-[#14a800]/40 rounded-t-xl transition-all relative overflow-hidden" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#14a800]" />
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase">Month {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-dark rounded-[32px] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <PieChart className="text-[#14a800] mb-6" size={32} />
            <h3 className="text-xl font-bold mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Project Escrow Fees', percent: 45, color: 'bg-[#14a800]' },
                { label: 'Subscriptions', percent: 35, color: 'bg-success' },
                { label: 'Withdrawal Charges', percent: 20, color: 'bg-[#14a800]' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.label}</span>
                    <span className="text-zinc-400">{item.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#14a800]/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
