// src/pages/freelancer/FreelancerAnalyticsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Eye, MousePointer, DollarSign, Download, Filter, Zap,
  ArrowUpRight, ArrowDownRight, Target, Share2, Award, Calendar, BarChart2, Star, Check
} from 'lucide-react';
import { analyticsAPI } from '../../common/services/api';
import { useQuery } from '@tanstack/react-query';

// Custom Progress Ring Component
const CustomProgressRing = ({ percent, colorClass }) => {
  const radius = 30;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-border"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="32"
          cy="32"
        />
        <circle
          className={colorClass}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="32"
          cy="32"
        />
      </svg>
      <span className="absolute text-xs font-mono font-semibold text-ink-primary">{percent}%</span>
    </div>
  );
};

export default function FreelancerAnalyticsPage() {
  const [datePeriod, setDatePeriod] = useState('Last 30 Days');
  const [showSuccess, setShowSuccess] = useState(null);
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['freelancer', 'analytics', datePeriod],
    queryFn: () => analyticsAPI.getFreelancerDashboard(),
  });

  const handleExport = () => {
    setShowSuccess({ message: 'Analytics report exported' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const StatCard = ({ title, value, change, isPositive, icon: Icon, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2 }}
      className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="p-2 bg-surface-muted rounded-xl group-hover:bg-accent-light transition-all">
          <Icon className="w-5 h-5 text-accent DEFAULT" />
        </div>
        <span className={`inline-flex items-center gap-0.5 text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-accent-light text-accent-dark' : 'bg-danger-light text-danger'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change || '+0%'}
        </span>
      </div>
      <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide">
        {title}
      </p>
      <p className="font-mono font-semibold text-2xl text-ink-primary mt-1">
        {value}
      </p>
    </motion.div>
  );

  const stats = [
    { title: 'Search impressions', value: analyticsData?.impressions?.toLocaleString() || '0', change: '+' + (analyticsData?.impressionsGrowth || '0') + '%', isPositive: true, icon: Eye },
    { title: 'Profile clicks', value: analyticsData?.profileViews?.toLocaleString() || '0', change: '+' + (analyticsData?.profileViewsGrowth || '0') + '%', isPositive: true, icon: MousePointer },
    { title: 'Proposal success', value: analyticsData?.proposalSuccessRate ? analyticsData.proposalSuccessRate + '%' : '0%', change: '+0%', isPositive: true, icon: Target },
    { title: 'Job success score', value: analyticsData?.jobSuccessScore ? analyticsData.jobSuccessScore + '%' : '0%', change: '+0%', isPositive: true, icon: Award }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <BarChart2 className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Business intelligence</h1>
          </div>
          <p className="text-sm text-ink-secondary font-body mt-1">
            Track visibility metrics, conversion indexes, and performance indicators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={datePeriod}
            onChange={(e) => setDatePeriod(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 cursor-pointer"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>

          <button
            onClick={handleExport}
            className="h-9 px-4 rounded-lg border border-border bg-white text-ink-primary hover:bg-surface-muted font-body text-sm font-medium transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, idx) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            delay={idx * 0.05}
          />
        ))}
      </div>

      {/* Advanced Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Conversion Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-display font-semibold text-sm text-brand-900 uppercase tracking-wide border-b border-border pb-3 mb-4">
            Conversion indexes
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Response index', description: 'Average reply within 1 hour', percent: 96, color: 'text-accent DEFAULT' },
              { label: 'On-time delivery', description: 'Projects completed before deadline', percent: 98, color: 'text-accent DEFAULT' },
              { label: 'Engagement conversion', description: 'Clicks to project milestones', percent: 84, color: 'text-warn' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-surface-soft rounded-xl">
                <div className="flex-1">
                  <h4 className="text-sm font-body font-semibold text-ink-primary">{item.label}</h4>
                  <p className="text-xs font-body text-ink-tertiary mt-0.5">{item.description}</p>
                </div>
                <CustomProgressRing percent={item.percent} colorClass={item.color} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Client Traffic Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm lg:col-span-2"
        >
          <h3 className="font-display font-semibold text-sm text-brand-900 uppercase tracking-wide border-b border-border pb-3 mb-4">
            Client traffic by peak hours
          </h3>

          <div className="grid grid-cols-7 gap-2 mb-3 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-xs font-body font-medium text-ink-tertiary">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[
              { intensity: 20, color: 'bg-accent-light/20' },
              { intensity: 40, color: 'bg-accent-light/40' },
              { intensity: 30, color: 'bg-accent-light/30' },
              { intensity: 80, color: 'bg-accent-light/80' },
              { intensity: 95, color: 'bg-accent DEFAULT' },
              { intensity: 15, color: 'bg-accent-light/15' },
              { intensity: 25, color: 'bg-accent-light/25' },
              { intensity: 45, color: 'bg-accent-light/45' },
              { intensity: 85, color: 'bg-accent-light/85' },
              { intensity: 70, color: 'bg-accent-light/70' },
              { intensity: 90, color: 'bg-accent-light/90' },
              { intensity: 20, color: 'bg-accent-light/20' },
              { intensity: 10, color: 'bg-accent-light/10' },
              { intensity: 35, color: 'bg-accent-light/35' },
              { intensity: 75, color: 'bg-accent-light/75' },
              { intensity: 92, color: 'bg-accent DEFAULT' },
              { intensity: 88, color: 'bg-accent-light/88' },
              { intensity: 50, color: 'bg-accent-light/50' },
              { intensity: 30, color: 'bg-accent-light/30' },
              { intensity: 15, color: 'bg-accent-light/15' },
              { intensity: 12, color: 'bg-accent-light/12' }
            ].map((cell, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`h-10 rounded-lg ${cell.color} transition-all cursor-pointer shadow-sm`}
                title={`Engagement: ${cell.intensity}%`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <span className="text-xs font-body text-ink-tertiary">Low engagement</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded bg-accent-light/20"></div>
              <div className="w-3 h-3 rounded bg-accent-light/40"></div>
              <div className="w-3 h-3 rounded bg-accent-light/70"></div>
              <div className="w-3 h-3 rounded bg-accent DEFAULT"></div>
            </div>
            <span className="text-xs font-body text-ink-tertiary">High engagement</span>
          </div>
        </motion.div>
      </div>

      {/* Additional Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="mt-6 bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 text-white shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-accent-light" />
              <h3 className="font-display font-semibold text-lg">Performance insight</h3>
            </div>
            <p className="text-white/80 text-sm font-body max-w-md">
              Your profile views are up 24% this week. Consider updating your portfolio to maintain momentum.
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-body text-sm font-medium transition-colors inline-flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            View detailed report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
