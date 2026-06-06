// src/pages/freelancer/FreelancerPerformanceInsightsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Eye, MousePointerClick, Star,
  Clock, Zap, Trophy, Target, Award, Sparkles,
  BarChart3, PieChart, Check
} from 'lucide-react';

export default function FreelancerPerformanceInsightsPage() {
  const [timeRange, setTimeRange] = useState('This Month');
  const [showSuccess, setShowSuccess] = useState(null);

  const handleApplyRecommendation = () => {
    setShowSuccess({ message: 'Recommendation applied to your profile' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const kpis = [
    { label: 'Profile views', value: '3,240', trend: '+12%', icon: Eye, trendPositive: true },
    { label: 'Proposal success', value: '28%', trend: '+4%', icon: MousePointerClick, trendPositive: true },
    { label: 'Response time', value: '1.2 hr', trend: '-0.5h', icon: Clock, trendPositive: true },
    { label: 'Client satisfaction', value: '4.9/5', trend: 'Top 5%', icon: Star, trendPositive: true }
  ];

  const rankingFactors = [
    { label: 'Job success score', score: 98, weight: '40%' },
    { label: 'Profile completeness', score: 100, weight: '20%' },
    { label: 'Responsiveness', score: 85, weight: '20%' },
    { label: 'Recent earnings', score: 90, weight: '20%' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
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
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-accent-light rounded-xl">
                  <TrendingUp className="w-6 h-6 text-accent DEFAULT" />
                </div>
                <h1 className="font-display font-bold text-3xl text-brand-900">Performance insights</h1>
              </div>
              <p className="text-ink-secondary font-body">Advanced analytics and recommendations to grow your business</p>
            </div>

            <div className="flex bg-surface-muted p-1 rounded-lg">
              {['This Week', 'This Month', 'Last 3 Months', 'All Time'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-4 py-1.5 rounded-md text-sm font-body font-medium transition-all ${
                    timeRange === period
                      ? 'bg-white text-ink-primary shadow-sm'
                      : 'text-ink-tertiary hover:text-ink-secondary'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-accent DEFAULT transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-accent-light rounded-xl">
                  <kpi.icon className="w-5 h-5 text-accent DEFAULT" />
                </div>
                <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
                  kpi.trendPositive ? 'bg-accent-light text-accent-dark' : 'bg-danger-light text-danger'
                }`}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                {kpi.label}
              </p>
              <h3 className="font-mono font-semibold text-2xl text-ink-primary">{kpi.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Charts Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Ranking Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-900 flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-accent DEFAULT" /> Platform ranking score
                  </h2>
                  <p className="text-sm font-body text-ink-secondary">Your visibility score in the marketplace algorithm</p>
                </div>
                <div className="text-right">
                  <h3 className="font-mono font-bold text-4xl text-ink-primary">94<span className="text-base text-ink-tertiary">/100</span></h3>
                </div>
              </div>

              <div className="space-y-4">
                {rankingFactors.map((factor) => (
                  <div key={factor.label}>
                    <div className="flex justify-between text-sm font-body mb-1">
                      <span className="text-ink-secondary">
                        {factor.label} <span className="text-ink-tertiary text-xs">({factor.weight} weight)</span>
                      </span>
                      <span className={`font-mono font-semibold ${
                        factor.score > 90 ? 'text-accent DEFAULT' : factor.score > 70 ? 'text-warn' : 'text-danger'
                      }`}>
                        {factor.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          factor.score > 90 ? 'bg-accent DEFAULT' : factor.score > 70 ? 'bg-warn' : 'bg-danger'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Earnings Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white border border-border rounded-2xl p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[280px]"
            >
              <BarChart3 className="w-16 h-16 text-ink-tertiary mb-4" />
              <h3 className="font-body font-semibold text-ink-primary mb-2">Earnings trend chart</h3>
              <p className="text-sm font-body text-ink-tertiary">Historical revenue graph will be rendered here</p>
            </motion.div>
          </div>

          {/* Right Column: Recommendations & Competition */}
          <div className="space-y-6">

            {/* AI Recommendations - Removed AI branding, kept as "Insights" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent-light" /> Performance insights
                </h2>

                <div className="space-y-3">
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <p className="text-xs font-body font-semibold text-accent-light uppercase tracking-wide mb-2">
                      Pricing strategy
                    </p>
                    <p className="text-sm font-body leading-relaxed">
                      Your current rate of <strong className="text-white">KES 4,500/hr</strong> is 15% below top performers. Consider raising to <strong className="text-white">KES 5,500/hr</strong>.
                    </p>
                    <button
                      onClick={handleApplyRecommendation}
                      className="mt-3 text-xs font-body font-medium text-accent-light hover:text-white transition-colors"
                    >
                      Apply recommendation →
                    </button>
                  </div>

                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <p className="text-xs font-body font-semibold text-accent-light uppercase tracking-wide mb-2">
                      Skill demand
                    </p>
                    <p className="text-sm font-body leading-relaxed">
                      "Next.js App Router" searches increased by 40% this week. Add this keyword to your gig title.
                    </p>
                    <button
                      onClick={handleApplyRecommendation}
                      className="mt-3 text-xs font-body font-medium text-accent-light hover:text-white transition-colors"
                    >
                      Update gig →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Market Competition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h2 className="font-display font-semibold text-lg text-brand-900 mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent DEFAULT" /> Market competition
              </h2>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
                        React developers
                      </p>
                      <p className="text-sm font-body font-semibold text-ink-primary">Your win rate</p>
                    </div>
                    <span className="font-mono font-bold text-2xl text-ink-primary">28%</span>
                  </div>
                  <p className="text-xs font-body text-ink-tertiary">
                    You win 28% of proposals you submit. Top performers average 35%.
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-body font-semibold text-ink-primary mb-3">Why you lose proposals</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm font-body text-ink-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                      40% due to higher price than competitors
                    </li>
                    <li className="flex items-start gap-2 text-sm font-body text-ink-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-warn mt-1.5 shrink-0" />
                      25% due to slower initial response time
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
