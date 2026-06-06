import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { cn } from '../../utils/cn';
import Card from '../ui/Card';
import { toast } from 'react-hot-toast';

const QuickActions: React.FC = () => {
  const { user } = useAuthStore();
  const config = user ? ROLE_CONFIG[user.role] : null;

  if (!config || config.quickActions.length === 0) return null;

  const handleAction = (action: string, label: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Executing ${label}...`,
        success: `Successfully triggered ${label}`,
        error: `Failed to execute ${label}`,
      }
    );
  };

  return (
    <Card className="bg-surface dark:bg-surface-dark border-dashed">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">Priority Controls</h3>
           <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Instant operations based on your permissions.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {config.quickActions.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleAction(item.action, item.label)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm",
                  item.variant === 'primary' && "bg-[#4C1D95] text-white hover:bg-[#22C55E]",
                  item.variant === 'danger' && "bg-rose-600 text-white hover:bg-rose-700",
                  item.variant === 'warning' && "bg-amber-500 text-white hover:bg-amber-600",
                  item.variant === 'secondary' && "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;


