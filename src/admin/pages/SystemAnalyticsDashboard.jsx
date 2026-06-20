import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react';
import { fetchDashboardMetrics, fetchRevenueChart, fetchFraudChart } from '../api/dashboard.api';

const statConfig = [
  { label: 'Total Users', field: 'totalUsers', icon: Users },
  { label: 'Active Jobs', field: 'activeJobs', icon: Briefcase },
  { label: 'Total Revenue', field: 'totalRevenue', icon: DollarSign },
  { label: 'Escrow Balance', field: 'escrowBalance', icon: TrendingUp },
];

export default function SystemAnalyticsDashboard() {
  const { data: metrics = {}, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin', 'dashboardMetrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 30_000,
    retry: 1,
  });

  const { data: revenueData = [], isLoading: revenueLoading } = useQuery({
    queryKey: ['admin', 'revenueChart'],
    queryFn: () => fetchRevenueChart('30d'),
    staleTime: 30_000,
    retry: 1,
  });

  const { data: fraudData = [], isLoading: fraudLoading } = useQuery({
    queryKey: ['admin', 'fraudChart'],
    queryFn: fetchFraudChart,
    staleTime: 30_000,
    retry: 1,
  });

  const isLoading = metricsLoading || revenueLoading || fraudLoading;

  const growthData = [
    { name: 'Active Users', value: metrics.totalUsers ?? 0, color: '#3b82f6' },
    { name: 'Active Jobs', value: metrics.activeJobs ?? 0, color: '#f59e0b' },
    { name: 'Fraud Alerts', value: metrics.fraudAlerts ?? 0, color: '#ef4444' },
    { name: 'Disputes', value: metrics.activeDisputes ?? 0, color: '#10b981' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live backend analytics for marketplace growth, revenue, and security signals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statConfig.map((stat) => {
          const value = metrics[stat.field] ?? 0;
          const formatted = typeof value === 'number' ? value.toLocaleString() : value;
          return (
            <div key={stat.field} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 text-[#4C1D95] dark:text-[#4C1D95] rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">Live</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? '…' : formatted}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Timeline</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Actual revenue and escrow flow from backend reports.</p>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">30 days</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#colorRevenue)" strokeWidth={2} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Marketplace Signals</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active user and risk metrics from the live admin API.</p>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Current</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 20, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {growthData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {fraudData.map((item) => (
              <div key={item.label || item.name} className="bg-surface dark:bg-zinc-800 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{item.label || 'Fraud Alerts'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value?.toLocaleString?.() ?? item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


