import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart2, PieChart as PieChartIcon, 
  Activity, DollarSign, Target, Download, Calendar
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { api } from '../../common/services/api';

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.get('/analytics_reports/dashboard/freelancer');
      setMetrics(data.data || data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const performanceMetrics = [
    { label: 'Conversion Rate', value: `${metrics?.proposals?.successRate || 0}%`, trend: '+2.4%', color: 'text-green-500' },
    { label: 'Avg Contract Size', value: `KES ${(metrics?.contracts?.total || 0).toLocaleString()}`, trend: '+12.5%', color: 'text-[#4C1D95]' },
    { label: 'Client Retention', value: `${metrics?.overview?.repeatClients || 0}%`, trend: 'Stable', color: 'text-zinc-500' },
    { label: 'Profile Views', value: metrics?.overview?.totalEarnings?.toLocaleString() || '0', trend: '+45%', color: 'text-green-500' }
  ];

  const categoryData = [
    { name: 'Web Development', value: 45 },
    { name: 'Mobile Apps', value: 25 },
    { name: 'UI/UX Design', value: 20 },
    { name: 'Consulting', value: 10 }
  ];
  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'];

  const revenueData = (metrics?.earningsTrend || []).map(t => ({
    month: t.month?.slice(5) || t.month,
    revenue: t.amount || 0,
    profit: t.amount * 0.85 || 0
  }));

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-[#4C1D95]" /> Intelligence & Analytics
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Deep-dive BI reporting on your marketplace performance.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#4C1D95]">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <button className="px-5 py-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((kpi, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1">{kpi.label}</div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{kpi.value}</div>
            <div className={`text-xs font-bold px-2 py-1 rounded bg-surface dark:bg-surface-dark inline-block ${kpi.color}`}>
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" /> Revenue Analytics
            </h2>
          </div>
          <div className="flex-1 min-h-[300px]">
            {revenueData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">No revenue data available yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#4C1D95]" /> Revenue by Category
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Distribution of your earnings across service types.</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">100%</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
             {categoryData.map((item, i) => (
               <div key={i} className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                 <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                 <span className="truncate">{item.name}</span>
                 <span className="ml-auto font-bold text-zinc-900 dark:text-white">{item.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};