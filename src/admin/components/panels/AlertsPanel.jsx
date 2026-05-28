import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../../api/dashboard.api';
import { formatRelativeTime } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { 
  AlertTriangle, 
  Shield, 
  Settings, 
  CreditCard, 
  Lock,
  ChevronRight,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Badge from '../ui/Badge';
import { useNotificationStore } from '../../store/notificationStore';

const AlertsPanel = () => {
  const { notifications, markAsRead, removeNotification } = useNotificationStore();

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical': return 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400';
      case 'warning': return 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400';
      default: return 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/10 text-brand-700 dark:text-brand-400';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'fraud': return Shield;
      case 'security': return Lock;
      case 'payment': return CreditCard;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">System Alerts</h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Critical signals requiring attention.</p>
        </div>
        <Badge variant="danger" size="sm">Active</Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="h-12 w-12 bg-surface dark:bg-surface-dark rounded-full flex items-center justify-center text-zinc-200 dark:text-zinc-800 mb-3">
              <Shield size={24} />
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No active threats</p>
          </div>
        ) : (
          notifications.map((alert) => {
            const Icon = getIcon(alert.type);
            const styles = getSeverityStyles(alert.severity);
            
            return (
              <div 
                key={alert.id}
                className={cn(
                  "relative p-4 rounded-2xl border-l-4 transition-all group",
                  styles,
                  alert.severity === 'critical' && "animate-pulse-slow"
                )}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{alert.type}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeNotification(alert.id); }}
                    className="p-1 hover:bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
                <h4 className="text-xs font-black mb-1">{alert.title}</h4>
                <p className="text-[11px] font-medium leading-relaxed opacity-80 line-clamp-2">
                  {alert.message}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                  {alert.actionLabel && (
                    <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                      {alert.actionLabel} <ChevronRight size={10} />
                    </button>
                  )}
                </div>
                {!alert.isRead && (
                   <div className="absolute top-4 right-4 h-1.5 w-1.5 bg-current rounded-full" />
                )}
              </div>
            );
          })
        )}
      </div>

      <Button variant="ghost" size="sm" className="mt-6 w-full text-[10px] uppercase tracking-widest font-black text-zinc-400">
        Clear All Alerts
      </Button>
    </Card>
  );
};

export default AlertsPanel;
