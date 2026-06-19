import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { TrendingUp, Gauge, CheckCircle, Smile, Clock, Users, DollarSign } from 'lucide-react';
import { useTeamAnalytics } from '../services/agencyHooks';

const COLORS = ['#4C1D95', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];
const METRICS = [
  { label: 'Revenue per member', value: '$42.8K', icon: DollarSign },
  { label: 'Utilization rate', value: '84%', icon: Gauge },
  { label: 'Project success rate', value: '93%', icon: CheckCircle },
  { label: 'Client satisfaction', value: '4.8/5', icon: Smile },
  { label: 'Response times', value: '1.4h', icon: Clock },
  { label: 'Team productivity', value: '91%', icon: TrendingUp },
];

export default function TeamAnalyticsPage() {
  const { data, isLoading } = useTeamAnalytics();
  const revenueTrends = data?.revenueTrends || [
    { month: 'Jan', revenue: 28000, target: 24000 },
    { month: 'Feb', revenue: 34000, target: 30000 },
    { month: 'Mar', revenue: 41000, target: 36000 },
    { month: 'Apr', revenue: 39000, target: 38000 },
    { month: 'May', revenue: 52000, target: 44000 },
    { month: 'Jun', revenue: 61000, target: 50000 },
  ];
  const performance = data?.teamPerformance || [
    { name: 'Design', utilization: 88, satisfaction: 4.9 },
    { name: 'Frontend', utilization: 92, satisfaction: 4.8 },
    { name: 'Backend', utilization: 84, satisfaction: 4.7 },
    { name: 'QA', utilization: 76, satisfaction: 4.6 },
    { name: 'PM', utilization: 95, satisfaction: 4.9 },
  ];
  const completion = data?.contractCompletion || [
    { name: 'Completed', value: 68 },
    { name: 'Active', value: 22 },
    { name: 'At risk', value: 7 },
    { name: 'Cancelled', value: 3 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><TrendingUp className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Team analytics</h1>
          </div>
          <p className="text-ink-secondary">Revenue, utilization, success rates, satisfaction, response times, and productivity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-6">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center mb-4"><metric.icon className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide">{metric.label}</p>
            <p className="font-display text-2xl font-bold text-brand-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brand-900 mb-4">Revenue trends</h3>
          {isLoading ? <div className="h-80 rounded-2xl bg-surface-muted animate-pulse" /> : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4C1D95" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="target" stroke="#22C55E" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brand-900 mb-4">Team performance</h3>
          {isLoading ? <div className="h-80 rounded-2xl bg-surface-muted animate-pulse" /> : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilization" fill="#4C1D95" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="satisfaction" fill="#22C55E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="font-display font-bold text-lg text-brand-900 mb-4">Contract completion</h3>
          {isLoading ? <div className="h-80 rounded-2xl bg-surface-muted animate-pulse" /> : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={completion} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                    {completion.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brand-900 mb-4">Team capacity</h3>
          <div className="space-y-4">
            {performance.map((member) => (
              <div key={member.name}>
                <div className="flex justify-between text-xs text-ink-secondary mb-1">
                  <span>{member.name}</span>
                  <span>{member.utilization}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-muted"><div className="h-2 rounded-full bg-[#4C1D95]" style={{ width: `${member.utilization}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
