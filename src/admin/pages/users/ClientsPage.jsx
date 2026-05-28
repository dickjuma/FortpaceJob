import React from 'react';
import { 
  Download, 
  Users, 
  ShieldCheck, 
  CircleDollarSign, 
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useClients } from '../../hooks/users/useClients';
import UserTable from '../../components/users/table/UserTable';
import UserTableFilters from '../../components/users/table/UserTableFilters';
import TablePagination from '../../components/users/table/TablePagination';
import BulkActionsBar from '../../components/users/table/BulkActionsBar';
import Button from '../../components/ui/Button';

// Premium Local StatCard Component
const StatCard = ({ title, value, change, trend, icon: Icon, isDark = false }) => (
  <div className={`p-6 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] ${
    isDark 
      ? 'bg-navy border-white/10 text-white' 
      : 'bg-white border-zinc-100 text-zinc-900'
  }`}>
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${
        isDark ? 'bg-accent-purple/20 text-accent-purple' : 'bg-zinc-50 text-accent-purple'
      }`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
        trend === 'up' 
          ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
          : (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600')
      }`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div className="mt-5">
      <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {title}
      </p>
      <h3 className="text-3xl font-black mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

/**
 * Specialized directory for Client accounts.
 */
const ClientsPage = () => {
  const { data, isLoading, error } = useClients();
  
  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Title & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Clients Directory</h1>
          <p className="text-zinc-500 font-medium mt-1">Monitor organization spending, contract health, and hiring trends.</p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={18} />}>Export Client List</Button>
      </div>

      {/* Premium KPI Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clients" 
          value="4,210" 
          change="+8.2%" 
          trend="up" 
          icon={Users} 
          isDark={true}
        />
        <StatCard 
          title="Corporate Verified" 
          value="96.1%" 
          change="+1.8%" 
          trend="up" 
          icon={ShieldCheck} 
        />
        <StatCard 
          title="Platform GTV (Spending)" 
          value="KES 340.8M" 
          change="+22.4%" 
          trend="up" 
          icon={CircleDollarSign} 
        />
        <StatCard 
          title="Contract Health" 
          value="98.9%" 
          change="+0.4%" 
          trend="up" 
          icon={Star} 
        />
      </div>

      {/* Main Directory Table Control Container */}
      <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <UserTableFilters section="clients" />
            <BulkActionsBar />
         </div>
         <div className="overflow-x-auto custom-scrollbar">
           <UserTable users={data?.data} loading={isLoading} error={error} section="clients" />
         </div>
         <TablePagination section="clients" totalCount={data?.total || 0} />
      </div>
    </div>
  );
};

export default ClientsPage;
