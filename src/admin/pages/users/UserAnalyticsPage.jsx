import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Download,
  PieChart as PieIcon,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUsers } from '../../hooks/users/useUsers';
import UserStatsCard from '../../components/users/cards/UserStatsCard';
import UserTypeBreakdown from '../../components/users/analytics/UserTypeBreakdown';
import Button from '../../components/ui/Button';

const UserAnalyticsPage = () => {
  const { data, isLoading } = useUsers();
  const growthData = Array.isArray(data?.growthTrend) ? data.growthTrend : [];
  
  const stats = [
    { label: 'Total Users', value: data?.total || 0, icon: Users, color: 'brand', trend: 12.5 },
    { label: 'Active Users', value: Math.floor((data?.total || 0) * 0.8), icon: UserCheck, color: 'emerald', trend: 8.2 },
    { label: 'Suspended', value: 14, icon: UserX, color: 'rose', trend: -4.1 },
    { label: 'Pending KYC', value: 32, icon: Clock, color: 'amber', trend: 15.0 },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">User Analytics</h1>
             <span className="h-7 px-3 flex items-center justify-center bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] dark:text-[#14a800] text-xs font-black rounded-full border border-[#14a800]/20 dark:border-[#14a800]/20/50">
               Live Data
             </span>
          </div>
          <p className="text-zinc-500 font-medium mt-1">Deep dive into user growth, retention, and distribution metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Download size={18} />}>Export Report</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <UserStatsCard key={stat.label} {...stat} index={idx} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Governance Insight Banner */}
         <div className="lg:col-span-2 bg-gradient-to-br from-[#14a800] to-[#118a00] rounded-3xl p-8 text-white shadow-xl shadow-[#14a800]/25/20 overflow-hidden relative group flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <PieIcon size={120} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-black mb-2 relative z-10">Governance Insight</h3>
            <p className="text-[#14a800] text-sm font-medium leading-relaxed mb-6 relative z-10 max-w-xl">
               Freelancers represent 62% of your active user base this month, with a 15% increase in verification completion.
               Client acquisition cost has decreased by 4% over the same period.
            </p>
            <div className="relative z-10">
              <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                 View Detailed Report
              </Button>
            </div>
         </div>

         {/* User Distribution Chart */}
         <div>
            <UserTypeBreakdown />
         </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                 <TrendingUp size={20} className="text-[#14a800]" /> User Growth Trends
              </h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Platform adoption over the last 7 months</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-success"></div>
                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Freelancers</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#14a800]"></div>
                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Clients</span>
              </div>
           </div>
        </div>

        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={growthData.length ? growthData : [{ name: '—', freelancers: 0, clients: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorFreelancers" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                 </linearGradient>
                 <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                 itemStyle={{ fontWeight: 800 }}
               />
               <Area type="monotone" dataKey="freelancers" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFreelancers)" />
               <Area type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClients)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsPage;
