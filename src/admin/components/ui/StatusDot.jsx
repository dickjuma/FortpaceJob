import React from 'react';
import { cn } from '../../utils/cn';

interface StatusDotProps {
  status: 'success' | 'warning' | 'danger' | 'neutral';
  animate?: boolean;
  size?: 'sm' | 'md';
}

const StatusDot: React.FC<StatusDotProps> = ({ 
  status, 
  animate = false,
  size = 'md'
}) => {
  const colors = {
    success: 'bg-success',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-zinc-400',
  };

  const sizes = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
  };

  return (
    <div className="relative flex items-center justify-center">
      {animate && (
        <span className={cn(
          "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
          colors[status]
        )}></span>
      )}
      <span className={cn(
        "relative inline-flex rounded-full",
        colors[status],
        sizes[size]
      )}></span>
    </div>
  );
};

export default StatusDot;
