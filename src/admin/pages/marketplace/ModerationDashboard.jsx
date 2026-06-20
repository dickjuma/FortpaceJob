import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Users,
  DollarSign,
  UserX,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#ef4444', '#f59e0b', '#6366f1', '#3b82f6', '#10b981'];

const ModerationDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Live KPI data
  const { data: kpiData, isLoading: kpiLoading, refetch: refetchKpi } = useQuery({
    queryKey: ['admin', 'moderation-kpis'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/moderation-stats');
      return unwrapAdminResponse(res).data || {};
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  // Fraud trend chart data
  const { data: fraudTrend } = useQuery({
    queryKey: ['admin', 'fraud-trend-weekly'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/trend?days=7');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : [];
    },
    staleTime: 120_000,
  });

  // Attack vectors (pie chart)
  const { data: vectorData } = useQuery({
    queryKey: ['admin', 'fraud-vectors'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/vectors');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : [];
    },
    staleTime: 180_000,
  });

  // Escrow risk exposure chart
  const { data: escrowRisk } = useQuery({
    queryKey: ['admin', 'escrow-risk'],
    queryFn: async () => {
      const res = await apiClient.get('/financial/reports/escrow-risk?days=7');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : [];
    },
    staleTime: 120_000,
  });

  // Live moderation feed
  const { data: liveFeedData, isLoading: feedLoading } = useQuery({
    queryKey: ['admin', 'moderation-feed'],
    queryFn: async () => {
      const res = await apiClient.get('/fraud/reports?limit=10&sort=createdAt:desc');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : Array.isArray(d?.reports) ? d.reports : [];
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const blockMutation = useMutation({
    mutationFn: async (reportId) => {
      const res = await apiClient.post(`/fraud/cases/${reportId}/restrict`, {
        reason: 'Admin moderation block',
        restrictions: ['MARKETPLACE_ACTIONS', 'WITHDRAWALS'],
      });
      return unwrapAdminResponse(res).data;
    },
    onSuccess: () => {
      toast.success('User restricted.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-feed'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-kpis'] });
    },
    onError: (e) => toast.error(e?.message || 'Action failed.'),
  });

  const kpis = [
    {
      label: 'Active Risk Cases',
      value: kpiLoading ? '…' : (kpiData?.activeRiskCases ?? kpiData?.activeCases ?? '—'),
      trend: kpiData?.activeRiskCasesTrend,
      icon: AlertTriangle,
      color: 'warning',
      border: 'border-amber-500',
    },
    {
      label: 'Critical Fraud Alerts',
      value: kpiLoading ? '…' : (kpiData?.criticalAlerts ?? kpiData?.fraudAlerts ?? '—'),
      trend: kpiData?.criticalAlertsTrend,
      icon: ShieldAlert,
      color: 'danger',
      border: 'border-red-500',
    },
    {
      label: 'Flagged Users',
      value: kpiLoading ? '…' : (kpiData?.flaggedUsers ?? '—'),
      trend: kpiData?.flaggedUsersTrend,
      icon: Users,
      color: 'warning',
      border: 'border-amber-500',
    },
    {
      label: 'Escrow Holds',
      value: kpiLoading ? '…' : (kpiData?.escrowHoldsTotal != null ? `$${Number(kpiData.escrowHoldsTotal / 100).toLocaleString()}` : '—'),
      trend: kpiData?.escrowHoldsTrend,
      icon: DollarSign,
      color: 'danger',
      border: 'border-red-500',
    },
    {
      label: 'Suspended Accounts',
      value: kpiLoading ? '…' : (kpiData?.suspendedAccounts ?? '—'),
      trend: kpiData?.suspendedAccountsTrend,
      icon: UserX,
      color: 'neutral',
      border: 'border-zinc-500',
    },
    {
      label: 'Pending Reviews',
      value: kpiLoading ? '…' : (kpiData?.pendingReviews ?? '—'),
      trend: kpiData?.pendingReviewsTrend,
      icon: Clock,
      color: 'info',
      border: 'border-[#4C1D95]/20',
    },
  ];

  const liveFeed = liveFeedData || [];

  return (
    <div className="space-y-8 pb-20 overflow-x-hidden">

      {/* 1. KPI CARDS - TOP ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={cn(
              'bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2',
              kpi.border
            )}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                'p-2 rounded-lg',
                kpi.color === 'danger' ? 'bg-red-500/10 text-red-500' :
                kpi.color === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                kpi.color === 'info' ? 'bg-[#4C1D95]/10 text-[#4C1D95]' : 'bg-zinc-500/10 text-zinc-500'
              )}>
                <kpi.icon size={18} />
              </div>
              {kpi.trend != null && (
                <div className={cn(
                  'text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1',
                  String(kpi.trend).startsWith('+') ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-500'
                )}>
                  {String(kpi.trend).startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {kpi.trend}
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* CENTER COLUMN */}
        <div className="lg:col-span-3 space-y-8">

          {/* Risk Heatmap from live API */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <Activity size={20} className="text-[#4C1D95]" />
                  Platform Risk Heatmap
                </h3>
                <p className="text-xs text-zinc-500 font-medium">Fraud enforcement trend — last 7 days</p>
              </div>
              <button onClick={() => refetchKpi()} className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>

            {!fraudTrend || fraudTrend.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-zinc-400 text-sm">No trend data available.</div>
            ) : (
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fraudTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="attempts" name="Detected" stroke="#f59e0b" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="blocked" name="Blocked" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Fraud Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* A. Fraud Trend Area */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center justify-between">
                Enforcement Trend
                <TrendingUp size={14} className="text-[#4C1D95]" />
              </h4>
              {!fraudTrend || fraudTrend.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-zinc-400 text-xs">No data</div>
              ) : (
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fraudTrend}>
                      <defs>
                        <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="blocked" stroke="#6366f1" fillOpacity={1} fill="url(#colorBlocked)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* B. Attack Vectors Pie */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Attack Vectors</h4>
              {!vectorData || vectorData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-zinc-400 text-xs">No vector data</div>
              ) : (
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vectorData}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="type"
                      >
                        {vectorData.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* C. Escrow Risk Bar */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Capital Exposure</h4>
              {!escrowRisk || escrowRisk.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-zinc-400 text-xs">No escrow data</div>
              ) : (
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={escrowRisk}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <Bar dataKey="held" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="risk" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME FEED */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-[700px] sticky top-24">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live Moderation Feed
            </h3>
            <span className="text-[9px] font-bold text-zinc-500">
              {feedLoading ? '…' : `${liveFeed.length} items`}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {feedLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              ))
            ) : liveFeed.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                <Activity size={28} className="mx-auto mb-2 opacity-30" />
                No moderation events.
              </div>
            ) : (
              liveFeed.map((ev, i) => {
                const riskScore = ev.riskScore || ev.metadata?.riskScore || 0;
                const decision = ev.status || ev.decision || 'PENDING';
                const eventType = ev.type || ev.action || 'Event';
                const userId = ev.userId || ev.reportedUserId || ev.id || `ID-${i}`;
                const role = ev.role || ev.userRole || 'USER';
                const timeAgo = ev.createdAt ? new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

                return (
                  <div
                    key={ev.id || i}
                    className={cn(
                      'p-3 rounded-xl bg-surface dark:bg-surface-dark/50 border border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group cursor-pointer',
                      riskScore >= 80 && 'border-red-500/30 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn(
                        'text-[10px] px-2 py-0.5 rounded font-black',
                        riskScore >= 80 ? 'bg-red-500 text-white' :
                        riskScore >= 60 ? 'bg-orange-500 text-white' :
                        riskScore >= 40 ? 'bg-amber-500 text-white' : 'bg-success text-white'
                      )}>
                        {riskScore || '—'}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{String(userId).slice(0, 12)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-zinc-900 dark:text-white leading-none">{eventType.replace(/_/g, ' ')}</p>
                        <p className="text-[9px] font-medium text-zinc-500">{role} • {timeAgo}</p>
                      </div>
                      <div className={cn(
                        'text-[9px] font-black px-1.5 py-0.5 rounded',
                        decision === 'BLOCKED' || decision === 'BLOCK' ? 'bg-red-500/10 text-red-500' :
                        decision === 'FLAGGED' || decision === 'FLAG' ? 'bg-amber-500/10 text-amber-500' :
                        decision === 'ESCALATE' ? 'bg-[#4C1D95]/10 text-[#4C1D95]' : 'bg-success/10 text-success'
                      )}>
                        {decision}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/users/${ev.userId || ev.reportedUserId}`)}
                        className="flex-1 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[9px] font-black uppercase transition-colors"
                      >View</button>
                      <button
                        onClick={() => blockMutation.mutate(ev.id || ev.caseId)}
                        disabled={blockMutation.isPending}
                        className="flex-1 py-1.5 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-[9px] font-black uppercase transition-colors disabled:opacity-50"
                      >Block</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-surface-dark/50 rounded-b-3xl">
            <button
              onClick={() => navigate('/admin/fraud/alerts')}
              className="w-full py-2 bg-[#4C1D95] hover:bg-[#4C1D95] text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-[#4C1D95]/25 transition-all"
            >
              View Full Queue
            </button>
          </div>
        </div>
      </div>

      {/* 3. SYSTEM INTELLIGENCE FOOTER — live from moderation stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: 'AI Throughput', key: 'aiThroughput', suffix: '/min', sub: 'Real-time' },
          { label: 'Avg Response', key: 'avgResponseMs', suffix: 'ms', sub: '99th ptl' },
          { label: 'False Positive', key: 'falsePositivePct', suffix: '%', sub: 'Target: <5%' },
          { label: 'Escalation', key: 'escalationPct', suffix: '%', sub: 'Rate' },
          { label: 'Active Clusters', key: 'activeClusters', suffix: '', sub: 'In review' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {kpiLoading ? '…' : kpiData?.[stat.key] != null ? `${kpiData[stat.key]}${stat.suffix}` : '—'}
            </h4>
            <p className="text-[9px] font-bold text-[#4C1D95]/80 mt-1 uppercase">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModerationDashboard;


