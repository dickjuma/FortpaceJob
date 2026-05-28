import React from 'react';
import { SearchX, UserPlus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import useUserManagementStore from '../../../store/userManagementStore';

/**
 * Renders a high-fidelity empty state for user lists and search results.
 */
const EmptyUserState = ({ 
  title = "No users found", 
  description = "Adjust your filters or try a different search term to find what you're looking for.",
  showClearFilters = true,
  actionLabel,
  onAction
}) => {
  const resetFilters = useUserManagementStore(s => s.resetFilters);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500">
      <div className="h-24 w-24 bg-surface dark:bg-zinc-800/50 rounded-[40px] flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-8 border border-zinc-100 dark:border-zinc-800 shadow-inner">
        <SearchX size={48} strokeWidth={1} />
      </div>
      
      <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-zinc-500 max-w-sm mt-3 font-medium leading-relaxed">
        {description}
      </p>

      <div className="mt-10 flex gap-3">
        {showClearFilters && (
          <Button variant="secondary" onClick={() => resetFilters('all')}>
            Clear All Filters
          </Button>
        )}
        
        {actionLabel && (
          <Button variant="primary" leftIcon={<UserPlus size={18} />} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyUserState;
