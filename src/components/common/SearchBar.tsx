// @ts-nocheck
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from './Button';

export default function SearchBar({ className, placeholder = "Search for talent, projects, or categories..." }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className={cn(
        "relative flex items-center w-full transition-all duration-300",
        className
      )}
    >
      <div 
        className={cn(
          "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
          isFocused ? "text-success" : "text-zinc-400"
        )}
      >
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        className={cn(
          "block w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-full bg-white",
          "border border-zinc-200 text-zinc-900 placeholder-zinc-400",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm",
          "transition-shadow duration-300",
          isFocused && "shadow-lg shadow-emerald-500/10"
        )}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button className="absolute inset-y-1.5 right-1.5 px-4 sm:px-6 bg-surface-dark hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg sm:rounded-full transition-colors hidden sm:block">
        Search
      </button>
    </div>
  );
}
