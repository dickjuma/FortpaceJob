import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  PieChart, 
  Users, 
  ArrowUpRight, 
  Zap, 
  Briefcase,
  ChevronRight,
  Wallet,
  Download
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// --- MOCK DATA ---
const MOCK_METRICS = {
  totalEarnings: 84500,
  currentMonth: 4200,
  monthlyGoal: 5000,
  forecast: 5400,
  outstanding: 1850,
  yoyGrowth: "+24%"
};

const MOCK_EARNINGS_TREND = [
  { month: 'Jan', earnings: 3200, label: '3.2k' },
  { month: 'Feb', earnings: 4100, label: '4.1k' },
  { month: 'Mar', earnings: 3800, label: '3.8k' },
  { month: 'Apr', earnings: 4500, label: '4.5k' },
  { month: 'May', earnings: 4200, label: '4.2k' },
  { month: 'Jun', earnings: 6100, label: '6.1k' }
];

const MOCK_CLIENTS = [
  { id: 1, name: 'Acme Corp', amount: 24500, projects: 5, status: 'Active' },
  { id: 2, name: 'Globex Inc', amount: 18400, projects: 3, status: 'Active' },
  { id: 3, name: 'Initech', amount: 12200, projects: 4, status: 'Inactive' },
  { id: 4, name: 'Soylent Corp', amount: 8100, projects: 2, status: 'Active' }
];

const MOCK_RECOMMENDATIONS = [
  { id: 1, title: 'Propose Retainer', desc: 'Acme Corp has completed 5 projects. A $3k/mo retainer fits their usage pattern.', icon: Zap, colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 2, title: 'Rate Increase', desc: 'High demand detected in your React skill category. Suggested rate: $95/hr (+15%).', icon: TrendingUp, colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' }
];

const MOCK_CATEGORIES = [
  { name: 'Web Development', percentage: 65, color: 'bg-accent-purple' },
  { name: 'UI/UX Design', percentage: 25, color: 'bg-blue-400' },
  { name: 'Consulting', percentage: 10, color: 'bg-emerald-400' }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function GoalsEarningsTrackerPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const goalProgress = Math.min((MOCK_METRICS.currentMonth / MOCK_METRICS.monthlyGoal) * 100, 100);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-purple/20 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
              <Target size={24} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Goals & Earnings</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Track your income, forecasts, and top clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
            <Download size={18} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-accent-purple/20 transition-all">
            <Wallet size={18} /> Withdraw Funds
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-navy border border-white/10 rounded-[24px] p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-emerald-500/20 blur-[40px] rounded-full pointer-events-none group-hover:bg-emerald-500/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-widest">
              <ArrowUpRight size={12} /> {MOCK_METRICS.yoyGrowth} YoY
            </span>
          </div>
          <div className="relative z-10 mt-6">
            <h4 className="text-3xl font-black text-white tracking-tight">{formatCurrency(MOCK_METRICS.totalEarnings)}</h4>
            <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Total Earnings</p>
          </div>
        </div>

        <div className="bg-white dark:bg-navy border border-zinc-200 dark:border-white/10 rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-accent-purple/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent-purple/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-accent-purple/20 border border-accent-purple/20 text-accent-purple rounded-xl">
              <Target size={20} />
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <h4 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{formatCurrency(MOCK_METRICS.currentMonth)}</h4>
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">
              <span>Goal: {formatCurrency(MOCK_METRICS.monthlyGoal)}</span>
              <span className="text-accent-purple">{Math.round(goalProgress)}%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="h-1.5 rounded-full bg-accent-purple" style={{ width: `${goalProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy border border-zinc-200 dark:border-white/10 rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <h4 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{formatCurrency(MOCK_METRICS.forecast)}</h4>
            <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Projected Forecast</p>
          </div>
        </div>

        <div className="bg-white dark:bg-navy border border-zinc-200 dark:border-white/10 rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/20 text-amber-500 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <h4 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{formatCurrency(MOCK_METRICS.outstanding)}</h4>
            <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest flex items-center gap-1 justify-between">
              Outstanding Invoices
              <ChevronRight size={12} className="text-amber-500 cursor-pointer" />
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">Earnings Trend</h2>
            <div className="flex bg-zinc-100 dark:bg-white/5 rounded-xl p-1 border border-zinc-200 dark:border-white/5">
              {['1m', '3m', '6m', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors",
                    timeRange === range ? "bg-white dark:bg-navy text-accent-purple shadow-sm border border-zinc-200 dark:border-white/10" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 relative z-10">
            {MOCK_EARNINGS_TREND.map((data, i) => {
              const max = Math.max(...MOCK_EARNINGS_TREND.map(d => d.earnings));
              const height = `${(data.earnings / max) * 100}%`;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="w-full flex justify-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-800 dark:bg-white/10 text-white dark:text-white px-2 py-1 rounded-md">
                      {formatCurrency(data.earnings)}
                    </span>
                  </div>
                  <div 
                    className="w-full max-w-[3rem] bg-zinc-100 dark:bg-white/5 rounded-t-xl group-hover:bg-accent-purple/20 dark:group-hover:bg-accent-purple/20 transition-colors relative overflow-hidden"
                    style={{ height }}
                  >
                    <div className="absolute bottom-0 w-full bg-zinc-300 dark:bg-white/20 group-hover:bg-accent-purple transition-colors" style={{ height: '40%' }} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mt-3 uppercase tracking-widest">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Categories */}
        <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl">
              <PieChart size={20} />
            </div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Revenue by Skill</h2>
          </div>
          
          <div className="space-y-6">
            {MOCK_CATEGORIES.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                  <span className="text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                  <span className="text-zinc-900 dark:text-white">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className={cn("h-1.5 rounded-full", cat.color)} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase tracking-widest">
              <span className="text-accent-purple mr-1">Tip:</span> Diversifying your skills can lead to a 15% increase in total revenue stability.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Clients */}
        <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/10 flex justify-between items-center bg-zinc-50/50 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Users size={20} />
              </div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Best Clients</h2>
            </div>
            <button className="text-xs font-bold text-accent-purple hover:text-accent-purple/80 uppercase tracking-widest flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <ul className="divide-y divide-zinc-100 dark:divide-white/5">
            {MOCK_CLIENTS.map((client) => (
              <li key={client.id} className="p-6 md:px-8 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center font-black text-zinc-700 dark:text-zinc-300 group-hover:bg-accent-purple/20 group-hover:text-accent-purple transition-colors">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{client.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={12} /> {client.projects} Projects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-zinc-900 dark:text-white">{formatCurrency(client.amount)}</div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg mt-1.5 inline-block",
                    client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                  )}>
                    {client.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Growth Recommendations */}
        <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-accent-purple/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-2.5 bg-accent-purple/20 border border-accent-purple/20 text-accent-purple rounded-xl">
              <Zap size={20} />
            </div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Growth Recommendations</h2>
          </div>
          
          <div className="space-y-4 relative z-10">
            {MOCK_RECOMMENDATIONS.map((rec) => (
              <div key={rec.id} className="p-5 border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-accent-purple/50 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border", rec.colorClass)}>
                    <rec.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-accent-purple transition-colors">{rec.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-3 leading-relaxed">{rec.desc}</p>
                    <button className="text-[10px] font-black text-accent-purple uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Take Action <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 p-6 md:p-8 bg-accent-purple rounded-2xl text-white shadow-xl shadow-accent-purple/20 relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none tranzinc-x-1/4 tranzinc-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <Target size={120} />
              </div>
              <h4 className="font-black text-xl mb-3 relative z-10 tracking-tight">Premium Insights</h4>
              <p className="text-white/90 text-sm font-medium mb-6 relative z-10 max-w-[80%] leading-relaxed">
                Unlock deep market analysis, rate optimization, and automated proposal generation with Forte Pro.
              </p>
              <button className="bg-white text-accent-purple px-5 py-2.5 rounded-xl text-xs font-black shadow-sm hover:bg-zinc-50 transition-colors relative z-10 uppercase tracking-widest">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
