import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { fetchDashboardMetrics } from '../../api/dashboard.api';
import WidgetGrid from '../widgets/WidgetGrid';
import RevenueChart from '../charts/RevenueChart';
import TransactionsTable from '../tables/TransactionsTable';
import AlertsPanel from '../panels/AlertsPanel';
import QuickActions from '../panels/QuickActions';

const FinanceAdminDashboard: React.FC = () => {
  const config = ROLE_CONFIG.finance_admin;
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard_metrics_finance'],
    queryFn: fetchDashboardMetrics,
  });

  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Financial Oversight</h1>
         <p className="text-zinc-500 font-medium mt-1">Managing revenue, escrow accounts, and platform payouts.</p>
      </div>

      <WidgetGrid widgets={config.widgets} data={data} loading={isLoading} />

      <RevenueChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <TransactionsTable />
         </div>
         <div className="h-full">
            <AlertsPanel />
         </div>
      </div>

      <QuickActions />
    </div>
  );
};

export default FinanceAdminDashboard;
