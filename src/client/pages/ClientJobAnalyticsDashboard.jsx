// ClientJobAnalyticsDashboard.jsx
// Self-contained Job Analytics Dashboard with design tokens,
// framer-motion animations, and recharts for visualizations.
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------




// ----------------------------------------------------------------------
// Animation Variants
// ----------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.2 } },
};

const buttonTap = { scale: 0.97 };

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientJobAnalyticsDashboard() {
  const { data: analyticsData } = useQuery({
    queryKey: ['client', 'jobAnalytics'],
    queryFn: async () => {
      return {
        hiringData: [
          { name: 'Jan', jobs: 4, hires: 2, spend: 2400 },
          { name: 'Feb', jobs: 3, hires: 3, spend: 5398 },
          { name: 'Mar', jobs: 5, hires: 4, spend: 8800 },
          { name: 'Apr', jobs: 2, hires: 2, spend: 3908 },
          { name: 'May', jobs: 6, hires: 5, spend: 9800 },
          { name: 'Jun', jobs: 4, hires: 3, spend: 6800 }
        ],
        statsData: [
          { name: 'Total Spend (YTD)', value: '.1K', change: '+14%', trend: 'up', icon: DollarSign },
          { name: 'Active Contracts', value: '8', change: '+2', trend: 'up', icon: Briefcase },
          { name: 'Total Hires', value: '19', change: '+5', trend: 'up', icon: Users },
          { name: 'Avg. Time to Hire', value: '4 Days', change: '-12%', trend: 'down', icon: TrendingUp }
        ]
      };
    }
  });

  const hiringData = analyticsData?.hiringData || [];
  const statsData = analyticsData?.statsData || [];

  const handleBack = () => {
    // Navigate back – in a real app use useNavigate or Link
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            whileTap={buttonTap}
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark mb-4 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Jobs
          </motion.button>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900">
            Job & Hiring Analytics
          </h1>
          <p className="text-ink-secondary text-sm mt-1">
            Track your spending, hiring efficiency, and contract performance.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {statsData.map((stat) => (
            <motion.div
              key={stat.name}
              variants={itemVariants}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-accent-light text-accent-dark flex items-center justify-center">
                  <stat.icon size={20} />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === 'up'
                      ? 'bg-accent-light text-accent-dark'
                      : 'bg-danger-light text-danger'
                  }`}
                >
                  {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-ink-primary">{stat.value}</h3>
                <p className="text-sm text-ink-tertiary mt-0.5">{stat.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Trend Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-brand-900 text-lg mb-5">
              Spending Trend
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hiringData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716C', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716C', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#16A34A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Jobs vs Hires Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-brand-900 text-lg mb-5">
              Jobs vs. Hires
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716C', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716C', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#F4F4F1', opacity: 0.6 }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Bar
                    dataKey="jobs"
                    fill="#A8A29E"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                    name="Jobs Posted"
                  />
                  <Bar
                    dataKey="hires"
                    fill="#16A34A"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                    name="Hires Made"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Optional: Additional insights card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 bg-accent-light border border-accent/20 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-accent-dark">Hiring Efficiency</h3>
              <p className="text-sm text-ink-secondary mt-1">
                Your average time to hire has improved by 12% compared to last quarter. Keep up the momentum!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

