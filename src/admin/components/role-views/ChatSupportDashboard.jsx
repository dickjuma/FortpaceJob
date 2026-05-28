import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { fetchDashboardMetrics } from '../../api/dashboard.api';
import WidgetGrid from '../widgets/WidgetGrid';
import ActivityFeed from '../panels/ActivityFeed';
import AlertsPanel from '../panels/AlertsPanel';

const ChatSupportDashboard: React.FC = () => {
  const config = ROLE_CONFIG.chat_support_admin;
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard_metrics_chat'],
    queryFn: fetchDashboardMetrics,
  });

  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Chat Oversight</h1>
         <p className="text-zinc-500 font-medium mt-1">Monitoring platform conversations and safety reports.</p>
      </div>
      <WidgetGrid widgets={config.widgets} data={data} loading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <ActivityFeed />
         </div>
         <div className="h-full">
            <AlertsPanel />
         </div>
      </div>
    </div>
  );
};

export default ChatSupportDashboard;
