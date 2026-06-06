import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { fetchDashboardMetrics, fetchFraudChart } from '../../api/dashboard.api';
import WidgetGrid from '../widgets/WidgetGrid';
import AlertsPanel from '../panels/AlertsPanel';
import QuickActions from '../panels/QuickActions';
import Card from '../ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useUIStore } from '../../store/uiStore';

const FraudSecurityDashboard: React.FC = () => {
  const config = ROLE_CONFIG.fraud_security_admin;
  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard_metrics_fraud'],
    queryFn: fetchDashboardMetrics,
  });

  const { data: chartData } = useQuery({
    queryKey: ['chart_fraud'],
    queryFn: () => fetchFraudChart('30d'),
  });

  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Security Fortress</h1>
         <p className="text-zinc-500 font-medium mt-1">Monitoring fraudulent patterns and high-risk activity.</p>
      </div>

      <WidgetGrid widgets={config.widgets} data={metrics} loading={metricsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <Card className="h-[400px]">
               <h3 className="text-lg font-black mb-8">Fraud Alert Trends</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                     <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10}} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDark ? '#1e293b' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </Card>
         </div>
         <AlertsPanel />
      </div>

      <QuickActions />
    </div>
  );
};

export default FraudSecurityDashboard;
