import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';

/**
 * Renders an animated risk score meter with semantic color levels.
 */
const RiskScoreMeter = ({ score = 0, className }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score <= 30) return 'bg-success';
    if (score <= 60) return 'bg-amber-500';
    if (score <= 80) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  const getLabel = () => {
    if (score <= 30) return 'Low';
    if (score <= 60) return 'Medium';
    if (score <= 80) return 'High';
    return 'Critical';
  };

  return (
    <div className={cn("flex flex-col gap-1.5 w-full min-w-[100px]", className)}>
      <div className="flex justify-between items-center px-0.5">
        <span className={cn("text-[9px] font-black uppercase tracking-tighter", getColor().replace('bg-', 'text-'))}>
          {getLabel()}
        </span>
        <span className="text-[10px] font-bold text-zinc-500">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out rounded-full", getColor())}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default RiskScoreMeter;
