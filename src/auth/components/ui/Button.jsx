import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon: Icon,
  iconPosition = 'left',
  children, 
  disabled,
  fullWidth = true,
  ...props 
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 outline-none overflow-hidden group z-10";
  
  const variants = {
    primary: "text-white bg-[#4C1D95] hover:bg-[#22C55E] shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-tranzinc-y-0.5",
    gradient: "text-white bg-gradient-to-r from-[#4C1D95] to-[#22C55E] hover:from-[#4C1D95] hover:to-[#22C55E] shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-tranzinc-y-0.5 border border-[#4C1D95]/20/20",
    secondary: "text-zinc-700 bg-white border border-zinc-200 hover:bg-surface dark:text-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700/80 shadow-sm hover:shadow",
    danger: "text-white bg-red-600 hover:bg-red-700 shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)]",
    ghost: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        isDisabled && "opacity-70 cursor-not-allowed transform-none hover:shadow-none hover:tranzinc-y-0",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Animated gradient hover effect for primary/gradient */}
      {(variant === 'primary' || variant === 'gradient') && !isDisabled && (
        <span className="absolute inset-0 z-[-1] bg-gradient-to-r from-transparent via-white/20 to-transparent -tranzinc-x-full group-hover:animate-shimmer" />
      )}

      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={cn("mr-2 h-4 w-4", variant === 'ghost' ? 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300' : '')} />
      )}
      
      <span>{children}</span>
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={cn("ml-2 h-4 w-4 transition-transform duration-300 group-hover:tranzinc-x-1", variant === 'ghost' ? 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300' : '')} />
      )}
    </motion.button>
  );
}


