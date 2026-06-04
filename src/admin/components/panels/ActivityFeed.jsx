import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityFeed } from '../../api/dashboard.api';
import { formatRelativeTime } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { 
  Users, 
  CreditCard, 
  Scale, 
  ShieldAlert, 
  Briefcase,
  History,
  ArrowRight
} from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Skeleton from '../ui/Skeleton';

const ActivityFeed = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['activity_feed_live'],
    queryFn: () => fetchActivityFeed(20),
    refetchInterval: 30000, // Every 30s
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return { icon: Users, color: 'bg-[#2bb75c]/10 text-[#2bb75c] dark:bg-[#2bb75c]/30 dark:text-[#2bb75c]' };
      case 'payment': return { icon: CreditCard, color: 'bg-emerald-100 text-success dark:bg-emerald-900/30 dark:text-success' };
      case 'dispute': return { icon: Scale, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'fraud_flag': return { icon: ShieldAlert, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' };
      default: return { icon: Briefcase, color: 'bg-[#2bb75c]/10 text-[#2bb75c] dark:bg-[#2bb75c]/30 dark:text-[#2bb75c]' };
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Live Pulse</h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Real-time governance stream.</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
           <div className="h-1.5 w-1.5 bg-success rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-success dark:text-success uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-1/2 h-3" />
                <Skeleton className="w-full h-2" />
              </div>
            </div>
          ))
        ) : (
          data.map((item, index) => {
            const { icon: Icon, color } = getIcon(item.type);
            
            return (
              <div 
                key={item.id} 
                className="flex gap-4 group cursor-default animate-in slide-in-right duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <Avatar name={item.actor.name} src={item.actor.avatar} size="sm" />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-lg flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm",
                    color
                  )}>
                    <Icon size={10} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-[#2bb75c] transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter whitespace-nowrap">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black text-zinc-400 hover:text-[#2bb75c] border-t border-surface-border dark:border-surface-dark-border transition-all uppercase tracking-widest">
        Full Activity Log <ArrowRight size={12} />
      </button>
    </Card>
  );
};

export default ActivityFeed;

