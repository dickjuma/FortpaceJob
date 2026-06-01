import React from 'react';
import { 
  ShieldAlert, Activity, AlertTriangle, ShieldX, 
  ArrowUpRight, ArrowDownRight, Map, Globe, Download
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function FraudAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl shadow-sm">
              <ShieldAlert size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Fraud Trends & Analytics</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Statistical analysis of threat patterns, prevented losses, and security performance.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Exporting threat landscape report...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-[#14a800] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export Intelligence
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-600 text-white p-8 rounded-[40px] relative overflow-hidden shadow-xl shadow-rose-600/20">
          <div className="relative z-10">
            <ShieldX size={32} className="text-rose-200 mb-4" />
            <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest">Fraud Loss Prevented</span>
            <h3 className="text-4xl font-black mt-2">KES 1.8M</h3>
            <p className="text-xs text-rose-100 font-medium mt-4">Calculated from flagged & blocked suspicious withdrawals this month.</p>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl w-fit mb-6">
            <AlertTriangle size={24} />
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Threat level</span>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">Elevated</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 mt-4">
            <ArrowUpRight size={14} /> +18% increase in bot activity
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="p-3 bg-[#14a800]/5 text-[#14a800] rounded-2xl w-fit mb-6">
            <Activity size={24} />
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rules Accuracy</span>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">99.2%</h3>
          <p className="text-xs text-zinc-500 font-medium mt-4">False positive rate: 0.8%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight mb-8">Top Threat Vectors</h3>
        <div className="space-y-6">
          {[
            { label: 'Account Takeover (ATO)', value: '42%', color: 'bg-rose-500' },
            { label: 'Payment Fraud / Chargebacks', value: '28%', color: 'bg-orange-500' },
            { label: 'Bot-driven Spam', value: '18%', color: 'bg-amber-500' },
            { label: 'Off-platform Solicitation', value: '12%', color: 'bg-[#14a800]' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <span className="text-zinc-900 dark:text-white">{item.value}</span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", item.color)} style={{ width: item.value }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
