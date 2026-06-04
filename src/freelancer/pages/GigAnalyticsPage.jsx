import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Download, Eye, MousePointerClick, 
  ShoppingCart, DollarSign, Users, RefreshCw, Sparkles,
  ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Mock Data
const TRAFFIC_DATA = [
  { date: 'Mon', impressions: 4000, clicks: 240 },
  { date: 'Tue', impressions: 3000, clicks: 139 },
  { date: 'Wed', impressions: 2000, clicks: 980 },
  { date: 'Thu', impressions: 2780, clicks: 390 },
  { date: 'Fri', impressions: 1890, clicks: 480 },
  { date: 'Sat', impressions: 2390, clicks: 380 },
  { date: 'Sun', impressions: 3490, clicks: 430 },
];

const DEMOGRAPHICS_DATA = [
  { name: 'United States', value: 45, color: '#3b82f6' },
  { name: 'United Kingdom', value: 25, color: '#8b5cf6' },
  { name: 'Canada', value: 15, color: '#10b981' },
  { name: 'Australia', value: 15, color: '#f59e0b' },
];

export default function GigAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-4 sm:p-8 w-full font-sans max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Gig Analytics</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Track your performance and identify growth opportunities.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 flex items-center shadow-sm">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '3m', label: '3 Months' },
            ].map(tr => (
              <button
                key={tr.id}
                onClick={() => setTimeRange(tr.id)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  timeRange === tr.id ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                {tr.label}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 hover:bg-surface dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-xl shadow-sm transition-all">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Impressions', value: '18.4K', trend: '+12%', isUp: true, icon: Eye, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10' },
          { label: 'Clicks', value: '1,240', trend: '+8%', isUp: true, icon: MousePointerClick, color: 'text-#2bb75c]', bg: 'bg-violet-50 dark:bg-#2bb75c]/10' },
          { label: 'Conv. Rate', value: '2.8%', trend: '-0.4%', isUp: false, icon: Filter, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Orders', value: '32', trend: '+24%', isUp: true, icon: ShoppingCart, color: 'text-success', bg: 'bg-emerald-50 dark:bg-success/10' },
          { label: 'Revenue', value: '$8,450', trend: '+18%', isUp: true, icon: DollarSign, color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10' },
          { label: 'Repeat Buyers', value: '45%', trend: '+5%', isUp: true, icon: RefreshCw, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className={cn("p-1.5 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
                stat.isUp ? "text-success bg-emerald-50 dark:bg-success/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
              )}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {stat.trend}
              </span>
            </div>
            <div>
              <h4 className="text-xl font-black text-zinc-900 dark:text-white">{stat.value}</h4>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Traffic Trends */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Traffic & Engagement Trends</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="impressions" name="Impressions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorImpressions)" />
                  <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2bb75c]" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Impressions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-#2bb75c]" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Clicks</span>
              </div>
            </div>
          </div>

          {/* Revenue Growth Bar Chart */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Revenue Growth (USD)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="impressions" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sidebar - Demographics & AI Insights */}
        <div className="space-y-8">
          
          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-[#2bb75c] to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-[#2bb75c]/25/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2bb75c]" />
                <h3 className="font-bold text-[#2bb75c]">AI Recommendations</h3>
              </div>
              <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-black uppercase tracking-wider">3 Insights</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <h4 className="text-sm font-bold mb-1 flex items-center gap-2"><Filter className="w-4 h-4 text-amber-300" /> Improve Conversion</h4>
                <p className="text-xs text-[#2bb75c] leading-relaxed">
                  Your conversion rate dropped to 2.8%. Adding a promotional video could increase it by up to 22%.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <h4 className="text-sm font-bold mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-300" /> Upsell Opportunity</h4>
                <p className="text-xs text-[#2bb75c] leading-relaxed">
                  35% of your buyers ask for 'Extra Fast Delivery'. Consider adding this as a $40 Premium Add-on.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <h4 className="text-sm font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-sky-300" /> Keyword Ranking</h4>
                <p className="text-xs text-[#2bb75c] leading-relaxed">
                  You are ranking #4 for 'React JS'. Updating your description with 'TailwindCSS' could push you to #1.
                </p>
              </div>
            </div>
          </div>

          {/* Demographics Pie Chart */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2bb75c]" /> Top Buyer Countries
            </h3>
            
            <div className="h-48 w-full relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMOGRAPHICS_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {DEMOGRAPHICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">32</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Total Orders</span>
              </div>
            </div>

            <div className="space-y-3">
              {DEMOGRAPHICS_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

