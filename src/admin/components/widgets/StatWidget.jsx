import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import Card from '../ui/Card';
import TrendBadge from '../ui/TrendBadge';
import Skeleton from '../ui/Skeleton';

const StatWidget = ({ 
  config, 
  value, 
  loading = false,
  sparklineData = [30, 45, 32, 50, 42, 60, 48, 70],
  trend = { value: 12.5, direction: 'up' }
}) => {
  const Icon = config.icon;

  const formattedValue = useMemo(() => {
    if (config.format === 'currency') return formatCurrency(value);
    if (config.format === 'percentage') return formatPercentage(value);
    return formatNumber(value);
  }, [value, config.format]);

  const isCritical = config.criticalThreshold && value > config.criticalThreshold;
  const isWarning = config.warningThreshold && value > config.warningThreshold;

  if (loading) {
    return (
      <Card className="h-full flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          <Skeleton className="w-24 h-3 mb-2" />
          <Skeleton className="w-32 h-8" />
        </div>
        <div className="mt-6">
          <Skeleton className="w-full h-12" />
        </div>
      </Card>
    );
  }

  const chartData = sparklineData.map((val) => ({ value: val }));

  return (
    <Card 
      hover 
      className={cn(
        "h-full flex flex-col justify-between overflow-hidden relative group",
        isCritical && "border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10",
        isWarning && !isCritical && "border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10"
      )}
    >
      {isCritical && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-r-full" />
      )}
      {isWarning && !isCritical && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full" />
      )}

      <div>
        <div className="flex justify-between items-start">
          <div className={cn("p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110", config.iconBg)}>
            <Icon className={cn("transition-colors", config.iconColor)} size={20} />
          </div>
          {config.showTrend && (
             <TrendBadge value={trend.value} direction={trend.direction} />
          )}
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
            {config.title}
          </p>
          <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mt-1 tracking-tight">
            {formattedValue}
          </h3>
        </div>
      </div>

      {config.showSparkline && (
        <div className="mt-6 h-12 -mx-6 -mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trend.direction === 'up' ? '#10b981' : '#f43f5e'} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={trend.direction === 'up' ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={trend.direction === 'up' ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                fill={`url(#gradient-${config.id})`}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default StatWidget;
