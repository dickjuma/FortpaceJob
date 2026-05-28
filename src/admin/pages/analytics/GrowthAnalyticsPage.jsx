import React from 'react';
import { 
  TrendingUp, Users, UserPlus, Target, 
  ArrowUpRight, ArrowDownRight, Zap, Download, Calendar
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function GrowthAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Growth Intelligence</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor user acquisition, retention rates, and platform scaling metrics.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Exporting growth metrics...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export Data
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-2xl">
              <Users size={24} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Users</span>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">124,500</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-success">
            <ArrowUpRight size={14} /> +5.2% WoW growth
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-2xl">
              <UserPlus size={24} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">New Signups</span>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">1,204</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-success">
            <ArrowUpRight size={14} /> +12% vs last 7d
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-success rounded-2xl">
              <Zap size={24} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Retention Rate</span>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">74.2%</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <ArrowDownRight size={14} /> -0.8% churn alert
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Active User Trends</h3>
            <p className="text-sm text-zinc-500 font-medium">Daily and Monthly Active Users (DAU/MAU)</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-500" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">MAU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-400" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">DAU</span>
            </div>
          </div>
        </div>
        <div className="h-[250px] flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
             <div key={i} className="flex-1 flex flex-col gap-1">
                <div className="w-full bg-brand-500 rounded-t-sm" style={{ height: `${30 + Math.random() * 50}%` }} />
                <div className="w-full bg-brand-400 rounded-t-sm" style={{ height: `${10 + Math.random() * 20}%` }} />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
