import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Users, 
  Briefcase, 
  CircleDollarSign, 
  Gavel, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Activity
} from "lucide-react";
import apiClient, { unwrapAdminResponse } from "../api/apiClient";

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, trend, icon: Icon, isDark = false, loading = false }) => (
  <div className={`p-6 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] ${
    isDark 
      ? 'bg-[#222222] border-white/10 text-white' 
      : 'bg-white border-zinc-100 text-zinc-900'
  }`}>
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${
        isDark ? 'bg-success/20 text-success' : 'bg-zinc-50 text-success'
      }`}>
        <Icon size={24} />
      </div>
      {!loading && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
          trend === 'up' 
            ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
            : (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600')
        }`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : '—'}
        </div>
      )}
    </div>
    <div className="mt-5">
      <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {title}
      </p>
      {loading ? (
        <div className="h-9 mt-1 w-28 animate-pulse rounded-xl bg-zinc-800/40" />
      ) : (
        <h3 className="text-3xl font-black mt-1 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value ?? '—'}
        </h3>
      )}
    </div>
  </div>
);

// ─── Activity Item from Audit Log ──────────────────────────────────────────────
const ActivityItem = ({ title, time, type, status }) => (
  <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-white/5 last:border-0 group cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 px-2 -mx-2 rounded-xl transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        type === 'user' ? 'bg-success/10 text-success' : 
        type === 'finance' ? 'bg-emerald-500/10 text-emerald-500' : 
        'bg-amber-500/10 text-amber-500'
      }`}>
        {type === 'user' ? <Users size={18} /> : type === 'finance' ? <CircleDollarSign size={18} /> : <Gavel size={18} />}
      </div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-success transition-colors truncate max-w-[180px]">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {typeof time === 'string' && time.includes('T') 
            ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : time}
        </p>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
      status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 
      status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 
      'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
    }`}>
      {status}
    </span>
  </div>
);

// ─── Classify audit log into an activity type ──────────────────────────────────
const classifyLog = (log) => {
  const action = log.action || '';
  const type = action.includes('USER') || action.includes('KYC') ? 'user'
    : action.includes('ESCROW') || action.includes('WALLET') || action.includes('WITHDRAWAL') || action.includes('REFUND') || action.includes('FEE') ? 'finance'
    : 'dispute';
  const status = action.includes('RESOLVED') || action.includes('APPROVED') || action.includes('RELEASED') ? 'completed'
    : action.includes('REJECTED') || action.includes('FLAGGED') ? 'failed'
    : 'pending';
  return { type, status };
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { data: metricsData, isLoading: metricsLoading, error: metricsError, refetch } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/dashboard');
      return unwrapAdminResponse(response).data;
    },
    refetchInterval: 60000, // refresh every 60 seconds
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-governance-feed'],
    queryFn: async () => {
      const response = await apiClient.get('/notifications');
      return unwrapAdminResponse(response).data || [];
    },
    refetchInterval: 30000,
  });

  const { data: fraudData } = useQuery({
    queryKey: ['admin-fraud-alerts-count'],
    queryFn: async () => {
      const response = await apiClient.get('/fraud/reports');
      const d = unwrapAdminResponse(response).data;
      return Array.isArray(d) ? d.filter(r => r.status === 'ACTIVE') : [];
    },
  });

  const m = metricsData || {};
  const activityFeed = (activityData || []).slice(0, 6);
  const fraudAlerts = fraudData || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">System Overview</h1>
          <p className="text-zinc-500 mt-1 font-medium">Real-time platform performance and governance metrics.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={metricsLoading}
          className="hidden sm:flex items-center gap-2 bg-[#222222] dark:bg-white text-white dark:text-[#222222] px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg disabled:opacity-60"
        >
          <RefreshCw size={18} className={metricsLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {metricsError && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
          <strong>Analytics Service:</strong> {metricsError.message || 'Could not load live metrics. Ensure the backend analytics module is running.'}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={m.totalUsers?.value}
          change={m.totalUsers?.trend}
          trend={m.totalUsers?.trend >= 0 ? 'up' : 'down'}
          icon={Users} 
          isDark={true}
          loading={metricsLoading}
        />
        <StatCard 
          title="Platform Revenue" 
          value={m.totalRevenue?.value ? `$${Number(m.totalRevenue.value / 100).toLocaleString()}` : undefined}
          change={m.totalRevenue?.trend}
          trend={m.totalRevenue?.trend >= 0 ? 'up' : 'down'}
          icon={CircleDollarSign} 
          loading={metricsLoading}
        />
        <StatCard 
          title="Active Jobs" 
          value={m.activeJobs?.value}
          change={m.activeJobs?.trend}
          trend={m.activeJobs?.trend >= 0 ? 'up' : 'down'}
          icon={Briefcase}
          loading={metricsLoading}
        />
        <StatCard 
          title="Open Disputes" 
          value={m.activeDisputes?.value}
          change={m.activeDisputes?.trend}
          trend={m.activeDisputes?.trend >= 0 ? 'up' : 'down'}
          icon={Gavel}
          loading={metricsLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Escrow Balance" 
          value={m.escrowBalance?.value ? `$${Number(m.escrowBalance.value / 100).toLocaleString()}` : undefined}
          change={m.escrowBalance?.trend}
          trend={m.escrowBalance?.trend >= 0 ? 'up' : 'down'}
          icon={CircleDollarSign}
          loading={metricsLoading}
        />
        <StatCard 
          title="Fraud Alerts" 
          value={m.fraudAlerts?.value}
          change={m.fraudAlerts?.trend}
          trend={m.fraudAlerts?.trend <= 0 ? 'up' : 'down'}
          icon={AlertTriangle}
          loading={metricsLoading}
        />
        <StatCard 
          title="Online Freelancers" 
          value={m.onlineFreelancers?.value}
          change={m.onlineFreelancers?.trend}
          trend={m.onlineFreelancers?.trend >= 0 ? 'up' : 'down'}
          icon={Activity}
          loading={metricsLoading}
        />
        <StatCard 
          title="System Health" 
          value={m.systemHealth?.value ? `${m.systemHealth.value}%` : undefined}
          change={m.systemHealth?.trend}
          trend="up"
          icon={ShieldCheck}
          loading={metricsLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* System Health Cards */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#222222] p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">System Health</h2>
                <p className="text-sm text-zinc-500 font-medium">Infrastructure and service status</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-500/20">
                <ShieldCheck size={18} />
                All Systems Operational
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              {[
                { label: "Redis Cluster", status: "Healthy", ping: "4ms", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Escrow Ledger", status: "Synchronized", ping: "99.9%", icon: ShieldCheck, color: "text-success", bg: "bg-success/10" },
                { label: "Notification Queue", status: "Processing", ping: "12/m", icon: TrendingUp, color: "text-[#4C1D95]", bg: "bg-[#4C1D95]/10" }
              ].map((service) => (
                <div key={service.label} className="p-5 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 hover:border-zinc-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl ${service.bg} ${service.color}`}>
                      <service.icon size={18} />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{service.label}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">{service.status}</span>
                    <span className="text-xs font-bold text-zinc-400">{service.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Visualization */}
          <div className="bg-[#222222] p-8 rounded-[24px] text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black tracking-tight">Revenue Intelligence</h2>
              <p className="text-zinc-400 text-sm mt-1 font-medium">Live platform metrics at a glance.</p>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-success uppercase font-bold tracking-widest mb-2">Total Revenue</p>
                  {metricsLoading ? (
                    <div className="h-8 w-24 animate-pulse rounded-xl bg-white/10" />
                  ) : (
                    <p className="text-2xl font-black">
                      ${m.totalRevenue?.value ? Number(m.totalRevenue.value / 100).toLocaleString() : '0'}
                    </p>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-success uppercase font-bold tracking-widest mb-2">Escrow Balance</p>
                  {metricsLoading ? (
                    <div className="h-8 w-24 animate-pulse rounded-xl bg-white/10" />
                  ) : (
                    <p className="text-2xl font-black">
                      ${m.escrowBalance?.value ? Number(m.escrowBalance.value / 100).toLocaleString() : '0'}
                    </p>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-success uppercase font-bold tracking-widest mb-2">Fraud Alerts</p>
                  {metricsLoading ? (
                    <div className="h-8 w-16 animate-pulse rounded-xl bg-white/10" />
                  ) : (
                    <p className="text-2xl font-black text-rose-400">{m.fraudAlerts?.value ?? 0}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 pt-6 gap-4">
                <p className="text-sm text-zinc-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
                <Link
                  to="/admin/analytics/revenue"
                  className="bg-white text-[#222222] px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-lg inline-block text-center"
                >
                  Full Analytics Report
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-success/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          </div>
        </div>

        {/* Live Governance Feed */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#222222] p-6 sm:p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Governance Feed</h2>
              <Link to="/admin/audit" className="text-success text-xs font-bold hover:underline">View All</Link>
            </div>
            <div className="space-y-1">
              {activityLoading ? (
                [0, 1, 2, 3].map(i => (
                  <div key={i} className="h-14 animate-pulse rounded-2xl bg-zinc-100 dark:bg-white/5 mb-2" />
                ))
              ) : activityFeed.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">No recent activity yet.</p>
              ) : (
                activityFeed.map(log => {
                  const { type, status } = classifyLog(log);
                  return (
                    <ActivityItem
                      key={log.id}
                      title={log.title || log.action?.replace(/_/g, ' ')}
                      time={log.time || log.createdAt}
                      type={type}
                      status={status}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Live Fraud Alerts Panel */}
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-6 sm:p-8 rounded-[24px] relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <AlertTriangle size={120} />
            </div>
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3 relative z-10">
              <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-xl">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-black tracking-tight">
                Security Alerts
                {fraudAlerts.length > 0 && (
                  <span className="ml-2 text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    {fraudAlerts.length}
                  </span>
                )}
              </h3>
            </div>
            <p className="text-sm text-rose-700/80 dark:text-rose-300/80 leading-relaxed font-medium mt-4 relative z-10">
              {fraudAlerts.length > 0
                ? `${fraudAlerts.length} active fraud record${fraudAlerts.length > 1 ? 's' : ''} flagged and awaiting review.`
                : 'No active fraud alerts. System is clean.'}
            </p>
            <Link
              to="/admin/fraud/alerts"
              className="mt-6 block w-full bg-rose-600 dark:bg-rose-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 relative z-10 text-center"
            >
              Investigate Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


