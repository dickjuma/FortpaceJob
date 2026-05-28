import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No data found", 
  description = "There are no records matching your current filters."
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-16 w-16 bg-surface dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-700 mb-4 animate-in zoom-in duration-500">
        <Inbox size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{message}</h3>
      <p className="text-xs text-zinc-500 mt-1 max-w-[240px] leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
