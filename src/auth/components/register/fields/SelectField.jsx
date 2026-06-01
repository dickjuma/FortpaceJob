import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SelectField({
  label,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  placeholder = 'Select an option',
  helperText,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        {label}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full appearance-none rounded-2xl border bg-white px-4 py-3.5 pr-11 text-sm text-zinc-900 outline-none transition-colors dark:bg-zinc-950/50 dark:text-white ${
            error
              ? 'border-red-300 focus:border-red-500 dark:border-red-500/60'
              : 'border-zinc-200 focus:border-[#14a800]/20 dark:border-zinc-700 dark:focus:border-[#14a800]/20'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -tranzinc-y-1/2 text-zinc-400" />
      </div>
      {helperText && !error && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
