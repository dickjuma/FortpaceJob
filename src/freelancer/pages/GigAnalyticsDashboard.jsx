// src/pages/freelancer/GigAnalyticsDashboard.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Eye, DollarSign, Package, ChevronLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGigAnalytics } from '../services/freelancerHooks';

const salesData = [
  { name: 'Jan', sales: 400, views: 2400 },
  { name: 'Feb', sales: 300, views: 1398 },
  { name: 'Mar', sales: 500, views: 3800 },
  { name: 'Apr', sales: 450, views: 3908 },
  { name: 'May', sales: 800, views: 4800 },
  { name: 'Jun', sales: 650, views: 3800 },
];

export default function GigAnalyticsDashboard() {
  const { data: analyticsData, isLoading } = useGigAnalytics();

  // Map API data or fallback to mock
  const salesChart = analyticsData?.salesData || salesData;
  const overviewStats = analyticsData?.stats || [
    { name: 'Total revenue', value: 'KES 12.4K', change: '+24%', icon: DollarSign },
    { name: 'Active orders', value: '5', change: '+2', icon: ShoppingCart },
    { name: 'Gig views (30d)', value: '14.2K', change: '+45%', icon: Eye },
    { name: 'Conversion rate', value: '4.8%', change: '+1.2%', icon: TrendingUp },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-md p-3">
          <p className="text-xs font-body font-medium text-ink-secondary">{label}</p>
          <p className="text-sm font-mono font-semibold text-ink-primary">
            KES {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-md p-3">
          <p className="text-xs font-body font-medium text-ink-secondary">{label}</p>
          <p className="text-sm font-mono font-semibold text-ink-primary">
            {payload[0].value.toLocaleString()} views
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/freelancer/gigs"
          className="text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark mb-4 inline-flex items-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to my gigs
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <Package className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-4xl text-brand-900">Gig business analytics</h1>
        </div>
        <p className="text-ink-secondary font-body mt-2">
          Track your marketplace performance, gig views, and conversion rates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent DEFAULT" />
                </div>
                <span className="text-xs font-mono font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="font-mono font-bold text-2xl text-ink-primary">{stat.value}</h3>
                <p className="text-xs font-body font-medium text-ink-tertiary mt-1">{stat.name}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Revenue trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChart} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 12, fontFamily: 'DM Sans' }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 12, fontFamily: 'DM Sans' }}
                  tickFormatter={(value) => `KES ${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#16A34A', stroke: '#FFFFFF' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gig Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Gig views</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChart} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 12, fontFamily: 'DM Sans' }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 12, fontFamily: 'DM Sans' }}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F4F4F1', opacity: 0.4 }} />
                <Bar
                  dataKey="views"
                  fill="#16A34A"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
