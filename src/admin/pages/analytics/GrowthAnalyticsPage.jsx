import React from 'react';
import {
  TrendingUp, Users, UserPlus, Target,
  ArrowUpRight, ArrowDownRight, Zap, Download, RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import toast from 'react-hot-toast';

export default function GrowthAnalyticsPage() {
  const { data: growthStats, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'growth-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/users/growth-stats');
      return unwrapAdminResponse(res).data || {};
    },
    staleTime: 60_000,
  });

  const { data: dauMauData, isLoading: chartLoading } = useQuery({
    queryKey: ['admin', 'dau-mau-trend'],
    queryFn: async () => {
      const res = await apiClient.get('/users/activity-trend?days=30');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : [];
    },
    staleTime: 120_000,
  });

  const handleExport = async () => {
    try {
      const res = await apiClient.get('/users/growth-stats/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `growth-report-${Date.now()}.csv`;
      a.click();
      toast.success('Growth metrics exported.');
    } catch {
      toast.error('Export failed.');
    }
  };

  const totalUsers = growthStats?.totalUsers ?? null;
  const newSignups = growthStats?.newSignups7d ?? growthStats?.newSignupsWeek ?? null;
  const retentionRate = growthStats?.retentionRate ?? null;
  const wowGrowth = growthStats?.wowGrowthPct ?? null;
  const signupChange = growthStats?.signupChangePct ?? null;
  const churnChange = growthStats?.churnChangePct ?? null;

  // Build chart bars from real data, or empty array
  const chartBars = chartLoading
    ? Array.from({ length: 30 }).map((_, i) => ({ mau: 0, dau: 0 }))
    : (dauMauData?.length > 0
      ? dauMauData
      : []);

  const maxBar = chartBars.length > 0
    ? Math.max(...chartBars.map(b => b.mau || b.totalActive || 0), 1)
    : 1;
  const maxDau = chartBars.length > 0
    ? Math.max(...chartBars.map(b => b.dau || b.dailyActive || 0), 1)
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#14a800]/10 text-[#14a800] rounded-xl shadow-sm">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Growth Intelligence</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor user acquisition, retention rates, and platform scaling metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-surface-dark text-white dark:bg-[#14a800] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#14a800]/5 text-[#14a800] rounded-2xl">
              <Users size={24} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Users</span>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                {isLoading ? '…' : totalUsers?.toLocaleString() ?? '—'}
              </h3>
            </div>
          </div>
          {wowGrowth !== null && (
            <div className={cn('flex items-center gap-2 text-xs font-bold', wowGrowth >= 0 ? 'text-success' : 'text-rose-500')}>
              {wowGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {wowGrowth >= 0 ? '+' : ''}{wowGrowth.toFixed(1)}% WoW growth
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#14a800]/5 text-[#14a800] rounded-2xl">
              <UserPlus size={24} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">New Signups</span>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                {isLoading ? '…' : newSignups?.toLocaleString() ?? '—'}
              </h3>
            </div>
          </div>
          {signupChange !== null && (
            <div className={cn('flex items-center gap-2 text-xs font-bold', signupChange >= 0 ? 'text-success' : 'text-rose-500')}>
              {signupChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {signupChange >= 0 ? '+' : ''}{signupChange.toFixed(0)}% vs last 7d
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-success rounded-2xl">
              <Zap size={24} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Retention Rate</span>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                {isLoading ? '…' : retentionRate != null ? `${retentionRate.toFixed(1)}%` : '—'}
              </h3>
            </div>
          </div>
          {churnChange !== null && (
            <div className={cn('flex items-center gap-2 text-xs font-bold', churnChange <= 0 ? 'text-success' : 'text-rose-600')}>
              {churnChange <= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {churnChange > 0 ? '+' : ''}{churnChange.toFixed(1)}% churn {churnChange > 0 ? 'alert' : 'improvement'}
            </div>
          )}
        </div>
      </div>

      {/* DAU/MAU Trend Chart */}
      <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Active User Trends</h3>
            <p className="text-sm text-zinc-500 font-medium">Daily and Monthly Active Users (DAU/MAU) — last 30 days</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14a800]" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">MAU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14a800]" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">DAU</span>
            </div>
          </div>
        </div>

        {chartLoading ? (
          <div className="h-[250px] animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        ) : chartBars.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-zinc-400 text-sm">
            No trend data available. Configure the growth metrics endpoint.
          </div>
        ) : (
          <div className="h-[250px] flex items-end gap-1">
            {chartBars.map((bar, i) => {
              const mauVal = bar.mau || bar.totalActive || 0;
              const dauVal = bar.dau || bar.dailyActive || 0;
              return (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <div className="w-full bg-[#14a800] rounded-t-sm" style={{ height: `${(mauVal / maxBar) * 100}%` }} />
                  <div className="w-full bg-[#14a800] rounded-t-sm" style={{ height: `${(dauVal / maxBar) * 100}%` }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
