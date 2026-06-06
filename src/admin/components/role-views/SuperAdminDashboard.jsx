import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { fetchDashboardMetrics } from '../../api/dashboard.api';
import WidgetGrid from '../widgets/WidgetGrid';
import RevenueChart from '../charts/RevenueChart';
import ActivityFeed from '../panels/ActivityFeed';
import AlertsPanel from '../panels/AlertsPanel';
import TransactionsTable from '../tables/TransactionsTable';
import { Zap, Activity, Users as UsersIcon } from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const config = ROLE_CONFIG.super_admin;
  
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard_metrics_all'],
    queryFn: fetchDashboardMetrics,
  });

  return (
    <div className="space-y-10">
      {/* Header Info */}
      <div>
         <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Platform Command</h1>
         <p className="text-zinc-500 font-medium mt-1">Holistic oversight of the entire Forte ecosystem.</p>
      </div>

      {/* Primary KPI Grid */}
      <WidgetGrid 
        widgets={config.widgets} 
        data={data} 
        loading={isLoading} 
      />

      {/* Real-time Counters Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-dark dark:bg-[#2bb75c] p-8 rounded-[32px] text-white shadow-2xl shadow-[#2bb75c]/25/10 overflow-hidden relative group">
         <div className="absolute inset-0 bg-gradient-to-br from-[#2bb75c]/20 via-transparent to-emerald-500/10 opacity-50"></div>
         
         <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 bg-success/20 rounded-2xl flex items-center justify-center text-success">
               <Activity size={24} className="animate-pulse" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Freelancers</p>
               <h4 className="text-2xl font-black">{data?.onlineFreelancers ?? '0'}</h4>
            </div>
         </div>

         <div className="relative z-10 flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="h-12 w-12 bg-[#2bb75c]/20 rounded-2xl flex items-center justify-center text-[#2bb75c]">
               <UsersIcon size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Sessions</p>
               <h4 className="text-2xl font-black">{data?.onlineClients ?? '0'}</h4>
            </div>
         </div>

         <div className="relative z-10 flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="h-12 w-12 bg-[#2bb75c]/20 rounded-2xl flex items-center justify-center text-emerald-300">
               <Zap size={24} className="animate-bounce" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Health</p>
               <h4 className="text-2xl font-black">{data?.systemHealth ?? '0'}%</h4>
            </div>
         </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 min-h-[450px]">
            <RevenueChart />
         </div>
         <div className="h-full">
            <AlertsPanel />
         </div>
      </div>

      {/* Secondary Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 min-h-[500px]">
            <TransactionsTable />
         </div>
         <div className="h-full">
            <ActivityFeed />
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

