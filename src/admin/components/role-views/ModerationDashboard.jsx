import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { fetchDashboardMetrics } from '../../api/dashboard.api';
import WidgetGrid from '../widgets/WidgetGrid';
import ActivityFeed from '../panels/ActivityFeed';
import AlertsPanel from '../panels/AlertsPanel';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const ModerationDashboard: React.FC = () => {
  const config = ROLE_CONFIG.moderation_admin;
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard_metrics_moderation'],
    queryFn: fetchDashboardMetrics,
  });

  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Content Moderation</h1>
         <p className="text-zinc-500 font-medium mt-1">Reviewing flagged jobs, profiles, and platform content.</p>
      </div>
      <WidgetGrid widgets={config.widgets} data={data} loading={isLoading} />
      <Card className="min-h-[400px]">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black">Flagged Content Queue</h3>
            <Badge variant="warning">18 Pending</Badge>
         </div>
         <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
            <p className="font-bold text-sm uppercase tracking-widest">Moderation table loading...</p>
         </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <ActivityFeed />
         <AlertsPanel />
      </div>
    </div>
  );
};

export default ModerationDashboard;
