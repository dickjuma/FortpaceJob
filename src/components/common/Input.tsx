// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col mb-4">
        {label && (
          <label htmlFor={inputId} className="mb-1 text-sm font-semibold text-text-primary">
            {label} {required && <span className="text-accent-red">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={twMerge(
              clsx(
                'w-full rounded-md border border-border bg-white px-4 py-3 text-sm transition-colors focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red disabled:bg-gray-100 disabled:cursor-not-allowed',
                icon && 'pl-10',
                error && 'border-error focus:border-error focus:ring-error',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <span className="mt-1 text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
