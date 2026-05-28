// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  count?: number;
}

export const Badge = ({ className, variant = 'default', count, children, ...props }: any) => {
  const variants = {
    default: 'bg-light-gray text-text-primary border border-border',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
  };

  const content = count !== undefined ? count : children;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {content}
    </span>
  );
};

export default Badge;
