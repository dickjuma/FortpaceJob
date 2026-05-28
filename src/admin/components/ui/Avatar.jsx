import React from 'react';
import { cn } from '../../utils/cn';

const Avatar = ({ 
  src, 
  name, 
  size = 'md',
  className,
  status
}) => {
  const sizes = {
    sm: 'h-8 w-8 text-[10px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || '??';

  return (
    <div className="relative shrink-0">
      <div className={cn(
        'flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-surface-border dark:border-surface-dark-border overflow-hidden font-bold text-zinc-600 dark:text-zinc-400',
        sizes[size],
        className
      )}>
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white dark:border-zinc-900 bg-white dark:bg-surface-dark p-0.5">
           <div className={cn(
             "h-2 w-2 rounded-full",
             status === 'success' ? 'bg-success' : 
             status === 'warning' ? 'bg-amber-500' : 
             status === 'danger' ? 'bg-rose-500' : 'bg-zinc-400'
           )}></div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
