// @ts-nocheck
import React from 'react';
import { MetricCard } from '../../components/common/MetricCard';
import { Table, Column } from '../../components/common/Table';
import { Users, Briefcase, MessageSquare, DollarSign } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

// Mock Data
const recentActivity = [
  { id: 1, user: 'Alice Smith', action: 'Posted a new job', date: '2 hours ago', status: 'completed' },
  { id: 2, user: 'Bob Johnson', action: 'Applied for UI Designer', date: '4 hours ago', status: 'pending' },
  { id: 3, user: 'Charlie Brown', action: 'Completed project milestone', date: '5 hours ago', status: 'completed' },
  { id: 4, user: 'Diana Prince', action: 'Updated profile', date: '1 day ago', status: 'completed' },
  { id: 5, user: 'Evan Wright', action: 'Reported an issue', date: '1 day ago', status: 'in-progress' },
];

const columns: Column<typeof recentActivity[0]>[] = [
  { key: 'user', label: 'User' },
  { key: 'action', label: 'Activity' },
  { key: 'date', label: 'Date' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => (
      <Badge 
        variant={value === 'completed' ? 'success' : value === 'pending' ? 'warning' : 'info'}
      >
        {value}
      </Badge>
    )
  },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Dashboard Overview</h1>
        <p className="text-text-secondary mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="12,450"
          icon={<Users size={24} />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Jobs"
          value="842"
          icon={<Briefcase size={24} />}
          trend={{ value: 5.4, isPositive: true }}
        />
        <MetricCard
          title="Messages This Month"
          value="45,231"
          icon={<MessageSquare size={24} />}
          trend={{ value: 2.1, isPositive: false }}
        />
        <MetricCard
          title="Revenue"
          value="$124,500"
          icon={<DollarSign size={24} />}
          trend={{ value: 18.2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-text-secondary">Chart Integration Placeholder</p>
          <p className="text-sm text-gray-400 mt-2">(Recharts would render User Growth here)</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-text-secondary">Chart Integration Placeholder</p>
          <p className="text-sm text-gray-400 mt-2">(Recharts would render Jobs by Category here)</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#222222] mb-4">Recent Activity</h2>
        <Table
          data={recentActivity}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Dashboard;
