import React from 'react';
import { cn } from '../../../utils/cn';

const AVATAR_COLORS = [
  'from-#2bb75c] to-[#1d8d38]',
  'from-#2bb75c] to-[#1d8d38]',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
  'from-lime-500 to-green-600',
  'from-fuchsia-500 to-[#1d8d38]',
  'from-red-500 to-rose-600',
  'from-teal-500 to-cyan-600',
  'from-[#2bb75c] to-blue-600',
  'from-orange-500 to-amber-600',
];

function getAvatarColor(name) {
  const code = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

/**
 * Renders a high-fidelity circular avatar with fallback gradients and online indicator.
 */
const UserAvatar = ({ 
  src, 
  name = '?', 
  size = 'md',
  isOnline = false,
  className 
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-[8px]',
    sm: 'h-8 w-8 text-[10px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-14 w-14 text-sm',
    xl: 'h-20 w-20 text-xl',
    '2xl': 'h-[120px] w-[120px] text-4xl',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const colorGradient = getAvatarColor(name);

  return (
    <div className={cn("relative shrink-0 group", className)} title={name}>
      <div className={cn(
        "rounded-full flex items-center justify-center font-black text-white shadow-inner overflow-hidden select-none transition-transform group-hover:scale-105",
        sizes[size],
        !src && `bg-gradient-to-br ${colorGradient}`
      )}>
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {isOnline && (
        <div className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-zinc-900 bg-success animate-pulse",
          size === 'xs' ? 'h-1.5 w-1.5' : 
          size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
        )} />
      )}
    </div>
  );
};

export default UserAvatar;

