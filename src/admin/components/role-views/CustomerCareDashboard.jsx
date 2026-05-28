import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { fetchDashboardMetrics } from '../../api/dashboard.api';
import WidgetGrid from '../widgets/WidgetGrid';
import ActivityFeed from '../panels/ActivityFeed';
import AlertsPanel from '../panels/AlertsPanel';
import DataTable from '../tables/DataTable';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatRelativeTime } from '../../utils/formatters';

const CustomerCareDashboard = () => {
  const config = ROLE_CONFIG.customer_care;
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard_metrics_support'],
    queryFn: fetchDashboardMetrics,
  });

  const disputes = [
    { id: 'DSP-001', contract: 'Modern Logo Design', parties: [{ name: 'Alex K.' }, { name: 'Sarah M.' }], status: 'OPEN', amount: 12000, opened: new Date().toISOString() },
    { id: 'DSP-002', contract: 'E-commerce Dev', parties: [{ name: 'John D.' }, { name: 'Forte Inc.' }], status: 'IN_REVIEW', amount: 85000, opened: new Date().toISOString() },
  ];

  const columns = [
    { key: 'id', header: 'Dispute ID', render: (item) => <span className="font-bold">{item.id}</span> },
    { key: 'contract', header: 'Contract', render: (item) => <span className="truncate max-w-[150px] block">{item.contract}</span> },
    { key: 'status', header: 'Status', render: (item) => <Badge variant={item.status === 'OPEN' ? 'warning' : 'info'}>{item.status}</Badge> },
    { key: 'opened', header: 'Opened', render: (item) => formatRelativeTime(item.opened) }
  ];

  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Support Center</h1>
         <p className="text-zinc-500 font-medium mt-1">Mediating disputes and resolving platform issues.</p>
      </div>
      <WidgetGrid widgets={config.widgets} data={metrics} loading={metricsLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-black mb-6">Active Disputes</h3>
              <DataTable columns={columns} data={disputes} />
            </Card>
         </div>
         <ActivityFeed />
      </div>
      <AlertsPanel />
    </div>
  );
};

export default CustomerCareDashboard;
