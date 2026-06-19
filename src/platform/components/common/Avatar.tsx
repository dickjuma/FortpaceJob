// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
}

export const Avatar = ({ className, src, alt, name, size = 'md', status, ...props }: any) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    away: 'bg-warning',
  };

  const statusSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className={twMerge(clsx('relative inline-block', sizes[size], className))}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full rounded-full object-cover border border-border"
          {...props}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-success text-[#222222] flex items-center justify-center font-semibold border border-border">
          {initials}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusColors[status],
            statusSize[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
