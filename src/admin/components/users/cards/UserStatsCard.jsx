import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * High-fidelity statistic card for user management overview.
 */
const UserStatsCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  color = 'brand',
  index = 0 
}) => {
  const colors = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
    emerald: 'bg-emerald-50 text-success dark:bg-emerald-900/20 dark:text-success',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    blue: 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
  };

  return (
    <div 
      className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-up fill-mode-both"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110 duration-300", colors[color])}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-full",
            trend > 0 ? "bg-emerald-50 text-success dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{label}</h4>
        <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default UserStatsCard;
