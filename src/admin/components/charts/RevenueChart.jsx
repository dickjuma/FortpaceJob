import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueChart } from '../../api/dashboard.api';
import { formatCurrency } from '../../utils/formatters';
import { useUIStore } from '../../store/uiStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';

const RevenueChart = () => {
  const [period, setPeriod] = useState('30d');
  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  const { data, isLoading } = useQuery({
    queryKey: ['chart_revenue', period],
    queryFn: () => fetchRevenueChart(period),
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface dark:bg-surface-dark border border-surface-border dark:border-zinc-800 p-4 rounded-2xl shadow-xl animate-in fade-in zoom-in-95">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2bb75c]" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Total Revenue</span>
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Platform Fees</span>
              </div>
              <span className="text-sm font-black text-success">{formatCurrency(payload[1].value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-none">Revenue Intelligence</h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Monitoring gross transaction volume and platform earnings.</p>
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-surface dark:bg-surface-dark rounded-xl border border-zinc-100 dark:border-zinc-800 shrink-0">
          {['7d', '30d', '90d', '1y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={
                "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all " +
                (period === p 
                  ? "bg-white dark:bg-zinc-800 text-[#2bb75c] dark:text-[#2bb75c] shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200")
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        {isLoading ? (
          <Skeleton variant="card" className="h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? '#334155' : '#e2e8f0'} 
              />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="secondaryValue" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorFees)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default RevenueChart;

