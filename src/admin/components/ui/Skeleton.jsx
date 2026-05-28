import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full rounded-md',
    card: 'h-32 w-full rounded-card',
    avatar: 'h-10 w-10 rounded-full',
    row: 'h-12 w-full rounded-md',
  };

  return (
    <div
      className={cn(
        'bg-zinc-200 dark:bg-zinc-800 animate-pulse relative overflow-hidden',
        variants[variant],
        className
      )}
    >
      <div className="absolute inset-0 -tranzinc-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
    </div>
  );
};

export default Skeleton;
