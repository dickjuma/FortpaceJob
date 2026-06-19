import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function SecurityBadge({ className = '' }) {
  return (
    <div className={`mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="flex items-center justify-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Lock className="w-3.5 h-3.5" />
        <span>Secured by enterprise-grade encryption</span>
      </div>
      
      <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
          <ShieldCheck className="w-4 h-4" />
          <span>SOC 2 Type II</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <div className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}
