import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = forwardRef(({ 
  className, 
  label, 
  error, 
  icon: Icon, 
  value, 
  onChange,
  onFocus,
  onBlur,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value.toString().length > 0;
  const isFloating = isFocused || hasValue;

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="w-full relative pb-1">
      <div className={cn(
        "relative rounded-xl transition-all duration-300",
        isFocused && !error ? "glow-border ring-2 ring-brand-500/20" : "",
        error ? "ring-2 ring-red-500/20" : ""
      )}>
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Icon className={cn(
              "h-5 w-5 transition-colors duration-300",
              error ? "text-red-400" : 
              isFocused ? "text-brand-500" : "text-zinc-400"
            )} />
          </div>
        )}
        
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? props.placeholder : ""}
          className={cn(
            "peer block w-full rounded-xl outline-none transition-all duration-300 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm border",
            Icon ? "pl-11" : "px-4",
            "pt-6 pb-2", // space for floating label
            error
              ? "border-red-300 text-red-900 focus:border-red-500 dark:border-red-500/50 dark:text-red-400 dark:bg-red-500/5"
              : "border-zinc-200 text-zinc-900 focus:border-brand-500 dark:border-zinc-700 dark:text-white dark:focus:border-brand-500",
            className
          )}
          {...props}
        />

        {label && (
          <label className={cn(
            "absolute left-0 transition-all duration-300 pointer-events-none z-10",
            Icon ? "left-11" : "left-4",
            isFloating 
              ? "top-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400" 
              : "top-4 text-sm text-zinc-500 dark:text-zinc-400"
          )}>
            {label}
          </label>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
