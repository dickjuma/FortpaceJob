import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart2, PieChart as PieChartIcon, 
  Activity, DollarSign, Target, Users, Download, Calendar
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Mock Data
const revenueData = [
  { month: 'Jan', revenue: 15000, profit: 12000 },
  { month: 'Feb', revenue: 18000, profit: 14000 },
  { month: 'Mar', revenue: 16000, profit: 11000 },
  { month: 'Apr', revenue: 24000, profit: 19000 },
  { month: 'May', revenue: 22000, profit: 18000 },
  { month: 'Jun', revenue: 30000, profit: 25000 },
  { month: 'Jul', revenue: 28000, profit: 23000 },
  { month: 'Aug', revenue: 35000, profit: 29000 }
];

const categoryData = [
  { name: 'Web Development', value: 45 },
  { name: 'Mobile Apps', value: 25 },
  { name: 'UI/UX Design', value: 20 },
  { name: 'Consulting', value: 10 }
];
const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'];

const activityData = [
  { day: 'Mon', proposals: 12, views: 45, invites: 3 },
  { day: 'Tue', proposals: 19, views: 60, invites: 5 },
  { day: 'Wed', proposals: 15, views: 55, invites: 4 },
  { day: 'Thu', proposals: 22, views: 80, invites: 8 },
  { day: 'Fri', proposals: 18, views: 65, invites: 6 },
  { day: 'Sat', proposals: 5, views: 20, invites: 1 },
  { day: 'Sun', proposals: 8, views: 30, invites: 2 }
];

const performanceMetrics = [
  { label: 'Conversion Rate', value: '24.8%', trend: '+2.4%', color: 'text-green-500' },
  { label: 'Avg Contract Size', value: '$4,250', trend: '+12.5%', color: 'text-[#14a800]' },
  { label: 'Client Retention', value: '85%', trend: 'Stable', color: 'text-zinc-500' },
  { label: 'Profile Views', value: '1,240', trend: '+45%', color: 'text-green-500' }
];

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('Last 6 Months');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-[#14a800]" /> Intelligence & Analytics
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Deep-dive BI reporting on your marketplace performance.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#14a800] outline-none appearance-none"
            >
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <button className="px-5 py-2 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* 1. Top KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1">{kpi.label}</div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{kpi.value}</div>
            <div className={`text-xs font-bold px-2 py-1 rounded bg-surface dark:bg-surface-dark/50 inline-block ${kpi.color}`}>
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 2. Primary Revenue Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" /> Revenue vs. Profit Analytics
            </h2>
          </div>
          <div className="flex-1 min-h-[300px]">
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
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Distribution (Pie Chart) */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#14a800]" /> Revenue by Category
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Distribution of your earnings across service types.</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text overlay */}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 4. Activity Trends (Multi-line / Bar Hybrid) */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Pipeline Activity
            </h2>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="views" name="Profile Views" stroke="#94A3B8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="proposals" name="Proposals Sent" stroke="#2563EB" strokeWidth={3} dot={{r: 3}} />
                <Line type="monotone" dataKey="invites" name="Invites Received" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Dense Heatmap Mock / Ranking Analytics */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#14a800]" /> Weekly Productivity Heatmap
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mb-6">Darker blocks indicate higher billable hours and commits logged.</p>
          
          {/* Mock Heatmap Grid */}
          <div className="flex-1 flex flex-col gap-2">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
               <div key={day} className="flex items-center gap-3">
                 <div className="w-8 text-xs font-bold text-zinc-400">{day}</div>
                 <div className="flex-1 flex gap-1.5">
                   {Array.from({ length: 24 }).map((_, i) => {
                     // Generate pseudo-random intensity for mock
                     const intensity = Math.random();
                     let bgClass = 'bg-zinc-100 dark:bg-zinc-700/50'; // level 0
                     if (intensity > 0.8) bgClass = 'bg-[#14a800]'; // level 4
                     else if (intensity > 0.6) bgClass = 'bg-[#14a800]'; // level 3
                     else if (intensity > 0.4) bgClass = 'bg-[#14a800]'; // level 2
                     else if (intensity > 0.2) bgClass = 'bg-[#14a800]'; // level 1

                     return (
                       <div key={i} className={`h-6 flex-1 rounded-sm ${bgClass} transition-colors hover:ring-2 hover:ring-[#14a800] cursor-pointer`} title={`Hour: ${i}:00`} />
                     );
                   })}
                 </div>
               </div>
             ))}
             <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-bold text-zinc-500">
               Less <div className="flex gap-1"><span className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-zinc-700/50" /><span className="w-3 h-3 rounded-sm bg-[#14a800]" /><span className="w-3 h-3 rounded-sm bg-[#14a800]" /><span className="w-3 h-3 rounded-sm bg-[#14a800]" /></div> More
             </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;
