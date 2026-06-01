import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { subDays, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../../api/apiClient';

/**
 * Compact sparkline chart for user registration trends.
 * Fetches real registration data from the API.
 */
const UserGrowthMiniChart = ({ title = "New Registrations", color = "#6366f1" }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user-growth-mini', 30],
    queryFn: async () => {
      const res = await apiClient.get('/users/growth-stats?days=30');
      const d = unwrapAdminResponse(res).data;
      // Handle array trend data or aggregate object
      if (Array.isArray(d?.trend)) return d.trend;
      if (Array.isArray(d)) return d;
      // Fallback: return empty (chart will show nothing)
      return [];
    },
    staleTime: 300_000,
  });

  const { data: summary } = useQuery({
    queryKey: ['admin', 'user-growth-summary'],
    queryFn: async () => {
      const res = await apiClient.get('/users/growth-stats');
      return unwrapAdminResponse(res).data || {};
    },
    staleTime: 300_000,
  });

  const chartData = (data || []).map((item, i) => ({
    date: item.date || format(subDays(new Date(), (data.length - 1) - i), 'MMM dd'),
    users: item.users || item.count || item.newSignups || 0,
  }));

  const totalValue = summary?.newSignups7d || summary?.newSignupsWeek || (chartData.reduce((s, d) => s + d.users, 0));
  const changePct = summary?.signupChangePct ?? null;

  return (
    <div className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{title}</h4>
          <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {isLoading ? '…' : totalValue?.toLocaleString() ?? '—'}
          </p>
        </div>
        {changePct != null && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${changePct >= 0 ? 'bg-emerald-50 text-success dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'}`}>
            {changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="h-[120px] -mx-6 -mb-6 mt-4">
        {isLoading ? (
          <div className="h-full animate-pulse bg-zinc-100 dark:bg-zinc-800" />
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-400 text-xs">No trend data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-surface-dark border border-white/10 px-3 py-2 rounded-xl shadow-2xl">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{payload[0].payload.date}</p>
                        <p className="text-xs font-black text-white">{payload[0].value} New Users</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke={color}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
                className="transition-all duration-1000"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UserGrowthMiniChart;
