import React from 'react';
import PhoneInput from 'react-phone-number-input/input';
import { Phone } from 'lucide-react';

export default function PhoneField({
  label,
  value,
  onChange,
  onBlur,
  country,
  error,
  helperText,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-colors dark:bg-zinc-950/50 ${
          error
            ? 'border-red-300 dark:border-red-500/60'
            : 'border-zinc-200 focus-within:border-[#14a800]/20 dark:border-zinc-700 dark:focus-within:border-[#14a800]/20'
        }`}
      >
        <Phone className={`h-4 w-4 shrink-0 ${error ? 'text-red-400' : 'text-zinc-400'}`} />
        <PhoneInput
          country={country || 'KE'}
          international
          withCountryCallingCode
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Phone number"
          className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
        />
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
