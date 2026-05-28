import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TrendBadgeProps {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  className?: string;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({ value, direction, className }) => {
  const configs = {
    up: { color: 'text-success dark:text-success bg-emerald-50 dark:bg-emerald-900/20', icon: TrendingUp },
    down: { color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20', icon: TrendingDown },
    neutral: { color: 'text-zinc-500 bg-surface dark:bg-zinc-800', icon: Minus },
  };

  const { color, icon: Icon } = configs[direction];

  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold',
      color,
      className
    )}>
      <Icon size={12} />
      {direction !== 'neutral' && <span>{value}%</span>}
    </div>
  );
};

export default TrendBadge;
