import React from 'react';
import WidgetCard from './WidgetCard';
import { WidgetType, WidgetData } from '../../types/role';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Wallet, 
  ShieldAlert, 
  Gavel, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Flag,
  UserCheck,
  Activity
} from 'lucide-react';

interface WidgetGridProps {
  visibleWidgets: WidgetType[];
  data: any; // From React Query
}

const WIDGET_METADATA: Record<WidgetType, Partial<WidgetData>> = {
  total_users: { title: "Total Users", icon: Users, color: "bg-brand-50 text-brand-600" },
  active_jobs: { title: "Active Jobs", icon: Briefcase, color: "bg-brand-50 text-brand-600" },
  revenue: { title: "Total Revenue", icon: TrendingUp, color: "bg-emerald-50 text-success" },
  escrow_balance: { title: "Escrow Balance", icon: Wallet, color: "bg-teal-50 text-teal-600" },
  fraud_alerts: { title: "Fraud Alerts", icon: ShieldAlert, color: "bg-rose-50 text-rose-600" },
  active_disputes: { title: "Active Disputes", icon: Gavel, color: "bg-amber-50 text-amber-600" },
  pending_withdrawals: { title: "Pending Withdrawals", icon: Clock, color: "bg-orange-50 text-orange-600" },
  failed_transactions: { title: "Failed Transactions", icon: AlertCircle, color: "bg-rose-50 text-rose-600" },
  open_tickets: { title: "Open Tickets", icon: MessageSquare, color: "bg-brand-50 text-brand-600" },
  pending_responses: { title: "Pending Responses", icon: Clock, color: "bg-zinc-100 text-zinc-600" },
  flagged_jobs: { title: "Flagged Jobs", icon: Flag, color: "bg-rose-50 text-rose-600" },
  reported_users: { title: "Reported Users", icon: UserCheck, color: "bg-amber-50 text-amber-600" },
  pending_reviews: { title: "Pending Reviews", icon: Activity, color: "bg-brand-50 text-brand-600" },
  risky_users: { title: "Risky Users", icon: ShieldAlert, color: "bg-rose-50 text-rose-600" },
  suspicious_transactions: { title: "Suspicious TX", icon: Activity, color: "bg-orange-50 text-orange-600" },
  active_conversations: { title: "Conversations", icon: MessageSquare, color: "bg-brand-50 text-brand-600" },
  reported_messages: { title: "Reported Msgs", icon: Flag, color: "bg-rose-50 text-rose-600" }
};

const WidgetGrid: React.FC<WidgetGridProps> = ({ visibleWidgets, data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {visibleWidgets.map((type) => {
        const meta = WIDGET_METADATA[type];
        const widgetData: WidgetData = {
          id: type,
          title: meta.title || type,
          value: data?.[type]?.value || '0',
          trend: data?.[type]?.trend || 0,
          icon: meta.icon || Activity,
          color: meta.color || "bg-surface text-zinc-600"
        };

        return <WidgetCard key={type} data={widgetData} loading={!data} />;
      })}
    </div>
  );
};

export default WidgetGrid;
