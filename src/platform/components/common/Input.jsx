import React from 'react';

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  disabled = false,
  icon,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-text-primary">
          {label} {required && <span className="text-[#e63946]">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-text-secondary">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full bg-white border rounded-md px-4 py-2.5 text-sm text-text-primary transition-all placeholder:text-text-secondary disabled:bg-light-gray disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-[#e63946] focus:border-[#e63946] ${
            icon ? 'pl-10' : ''
          } ${
            error ? 'border-error focus:ring-error focus:border-error' : 'border-border'
          }`}
        />
      </div>
      {error && <span className="text-xs text-error mt-0.5">{error}</span>}
    </div>
  );
}
