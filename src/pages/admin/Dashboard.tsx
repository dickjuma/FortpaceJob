// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MetricCard } from '../../components/common/MetricCard';
import { Table, Column } from '../../components/common/Table';
import { Users, Briefcase, MessageSquare, DollarSign } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { api } from '../../common/services/api';

const columns: Column<any>[] = [
  { key: 'user', label: 'User' },
  { key: 'action', label: 'Activity' },
  { key: 'date', label: 'Date' },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => (
      <Badge variant={value === 'completed' ? 'success' : value === 'pending' ? 'warning' : 'info'}>
        {value}
      </Badge>
    ),
  },
];

export const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      api.get('/admin_rbc/dashboard'),
      api.get('/admin_rbc/marketplace/jobs?limit=5'),
    ])
      .then(([dashboardResponse, jobsResponse]) => {
        if (!active) return;
        const dashboardPayload = dashboardResponse?.data ?? dashboardResponse;
        setMetrics(dashboardPayload || {});

        const jobsPayload = jobsResponse?.data ?? jobsResponse;
        const jobs = jobsPayload.items || jobsPayload.data || [];
        setRecentActivity(
          jobs.map((job) => ({
            id: job.id,
            user: job.clientName || 'Client',
            action: `Posted job: ${job.title}`,
            date: job.postedAt ? new Date(job.postedAt).toLocaleString() : 'Unknown',
            status: job.status ? job.status.toLowerCase() : 'pending',
          }))
        );
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load dashboard metrics.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const metricsValue = (value) => {
    if (value == null || value === '') return 'N/A';
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Dashboard Overview</h1>
        <p className="text-text-secondary mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={isLoading ? 'Loading...' : metricsValue(metrics.totalUsers)}
          icon={<Users size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricCard
          title="Active Jobs"
          value={isLoading ? 'Loading...' : metricsValue(metrics.activeJobs)}
          icon={<Briefcase size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricCard
          title="Revenue"
          value={isLoading ? 'Loading...' : `KES ${metricsValue(metrics.totalRevenue)}`}
          icon={<DollarSign size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricCard
          title="Fraud Alerts"
          value={isLoading ? 'Loading...' : metricsValue(metrics.fraudAlerts)}
          icon={<MessageSquare size={24} />}
          trend={{ value: 0, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-text-secondary">Chart Integration Placeholder</p>
          <p className="text-sm text-gray-400 mt-2">(Live dashboard charts will render here once enabled.)</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-text-secondary">Chart Integration Placeholder</p>
          <p className="text-sm text-gray-400 mt-2">(Visual analytics for jobs and activity will appear here.)</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#222222] mb-4">Recent Activity</h2>
        {isLoading ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
            Loading recent activity...
          </div>
        ) : (
          <Table data={recentActivity} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
