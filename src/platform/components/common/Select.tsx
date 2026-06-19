// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, required, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col mb-4">
        {label && (
          <label htmlFor={selectId} className="mb-1 text-sm font-semibold text-text-primary">
            {label} {required && <span className="text-[#e63946]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={twMerge(
              clsx(
                'w-full appearance-none rounded-md border border-border bg-white px-4 py-3 pr-10 text-sm transition-colors focus:border-[#e63946] focus:outline-none focus:ring-1 focus:ring-[#e63946] disabled:bg-gray-100 disabled:cursor-not-allowed',
                error && 'border-error focus:border-error focus:ring-error',
                className
              )
            )}
            {...props}
          >
            <option value="" disabled hidden>Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && <span className="mt-1 text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
