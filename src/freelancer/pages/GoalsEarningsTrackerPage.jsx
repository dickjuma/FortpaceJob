// src/pages/freelancer/GoalsEarningsTrackerPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, DollarSign, Target, BarChart3,
  PieChart, Users, ArrowUpRight, Zap, Briefcase,
  ChevronRight, Wallet, Download, Check
} from 'lucide-react';
import { useFreelancerDashboard, useUpdateFreelancerGoals } from '../services/freelancerHooks';

export default function GoalsEarningsTrackerPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const navigate = useNavigate();

  const { data: dashboardData = {}, isLoading: dashboardLoading } = useFreelancerDashboard();
  const updateGoals = useUpdateFreelancerGoals();
  const isLoading = dashboardLoading || updateGoals.isLoading;

  const metrics = dashboardData?.overview || {};
  const walletStats = dashboardData?.wallet || {};
  const earnings = dashboardData?.earnings || {};

  const totalEarnings = metrics.totalEarnings || 0;
  const currentMonth = walletStats.available || 0;
  const monthlyGoal = metrics.financialGoals?.monthlyGoal || 50000;
  const forecast = metrics.financialGoals?.forecast;
  const outstanding = walletStats.pending || 0;
  const yoyGrowth = metrics.yoyGrowth || '+24%';

  const earningsTrend = earnings.weeklyTrend || earnings.monthlyTrend || [];
  const topClients = earnings.topClients || [];
  const skillBreakdown = earnings.skillBreakdown || [];

  const goalProgress = monthlyGoal > 0 ? Math.min((currentMonth / monthlyGoal) * 100, 100) : 0;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'KES 0';
    return `KES ${amount.toLocaleString()}`;
  };

  const handleUpdateGoal = () => {
    if (!newGoalInput) return;

    updateGoals.mutate({ monthlyGoal: parseFloat(newGoalInput) }, {
      onSuccess: () => {
        setShowSuccess({ message: `Goal updated to KES ${parseFloat(newGoalInput).toLocaleString()}` });
        setTimeout(() => setShowSuccess(null), 2000);
        setIsEditingGoal(false);
        setNewGoalInput('');
      },
      onError: () => {
        setShowSuccess({ message: 'Failed to update goal' });
        setTimeout(() => setShowSuccess(null), 2000);
      },
    });
  };

  const handleExportCSV = () => {
    setShowSuccess({ message: 'Exporting CSV report' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleWithdraw = () => {
    navigate('/freelancer/withdrawal');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Target className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Goals & earnings</h1>
          </div>
          <p className="text-ink-secondary font-body">Track your income, forecasts, and top clients</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleWithdraw}
            className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" /> Withdraw funds
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 shadow-sm text-white">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet className="w-5 h-5 text-accent-light" />
            </div>
            <span className="text-xs font-mono font-semibold text-accent-light flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {yoyGrowth} YoY
            </span>
          </div>
          <h4 className="font-mono font-bold text-2xl">{formatCurrency(totalEarnings)}</h4>
          <p className="text-xs text-white/60 uppercase tracking-wide mt-1">Total earnings</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-accent-light rounded-lg">
              <Target className="w-5 h-5 text-accent DEFAULT" />
            </div>
          </div>
          <h4 className="font-mono font-bold text-2xl text-ink-primary">{formatCurrency(currentMonth)}</h4>

          {isEditingGoal ? (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                placeholder="New goal"
                className="flex-1 h-8 px-2 text-xs bg-white border border-border rounded text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
              <button onClick={handleUpdateGoal} className="px-2 py-1 text-xs bg-accent DEFAULT text-white rounded">Save</button>
              <button onClick={() => setIsEditingGoal(false)} className="px-2 py-1 text-xs border border-border rounded">Cancel</button>
            </div>
          ) : (
            <div
              className="flex justify-between items-center mt-1 cursor-pointer group"
              onClick={() => { setNewGoalInput(monthlyGoal); setIsEditingGoal(true); }}
            >
              <span className="text-xs text-ink-tertiary group-hover:text-accent DEFAULT transition-colors">
                Goal: {formatCurrency(monthlyGoal)}
              </span>
              <span className="text-xs font-mono font-semibold text-accent DEFAULT">{Math.round(goalProgress)}%</span>
            </div>
          )}

          <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="h-1.5 rounded-full bg-accent DEFAULT transition-all duration-500" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="p-2 bg-info-light rounded-lg w-fit mb-3">
            <BarChart3 className="w-5 h-5 text-info DEFAULT" />
          </div>
          <h4 className="font-mono font-bold text-2xl text-ink-primary">
            {forecast ? formatCurrency(forecast) : '---'}
          </h4>
          <p className="text-xs text-ink-tertiary uppercase tracking-wide mt-1">Projected forecast</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="p-2 bg-warn-light rounded-lg w-fit mb-3">
            <DollarSign className="w-5 h-5 text-warn" />
          </div>
          <h4 className="font-mono font-bold text-2xl text-ink-primary">{formatCurrency(outstanding)}</h4>
          <p className="text-xs text-ink-tertiary uppercase tracking-wide mt-1 flex items-center justify-between">
            Outstanding invoices
            <ChevronRight className="w-4 h-4 text-ink-tertiary cursor-pointer" />
          </p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display font-semibold text-lg text-brand-900">Earnings trend</h2>
            <div className="flex bg-surface-muted rounded-lg p-0.5">
              {['1m', '3m', '6m', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-body font-medium rounded-md transition-all ${
                    timeRange === range
                      ? "bg-white text-accent DEFAULT shadow-sm"
                      : "text-ink-tertiary hover:text-ink-primary"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {earningsTrend.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2">
              {earningsTrend.map((data, i) => {
                const max = Math.max(...earningsTrend.map(d => d.earnings || 0), 1);
                const val = data.earnings || 0;
                const height = `${(val / max) * 100}%`;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="w-full flex justify-center mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-mono bg-ink-primary text-white px-1.5 py-0.5 rounded text-[10px]">
                        {formatCurrency(val)}
                      </span>
                    </div>
                    <div className="w-full max-w-[40px] bg-accent-light rounded-t-md transition-all" style={{ height, minHeight: '4px' }} />
                    <span className="text-xs text-ink-tertiary mt-2">{data.month || `W${i + 1}`}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-ink-secondary">
              Earnings data will appear after your first orders
            </div>
          )}
        </div>

        {/* Revenue by Skill */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-accent-light rounded-lg">
              <PieChart className="w-5 h-5 text-accent DEFAULT" />
            </div>
            <h2 className="font-display font-semibold text-lg text-brand-900">Revenue by skill</h2>
          </div>

          {skillBreakdown.length > 0 ? (
            <div className="space-y-4">
              {skillBreakdown.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-body mb-1">
                    <span className="text-ink-secondary">{cat.name}</span>
                    <span className="font-mono font-semibold text-ink-primary">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full ${cat.color || 'bg-accent DEFAULT'}`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-tertiary py-8">Revenue breakdown will appear as you complete projects</p>
          )}

          <div className="mt-5 p-3 bg-accent-light rounded-lg">
            <p className="text-xs text-accent-dark">
              <span className="font-semibold">Tip:</span> Diversifying your skills can increase revenue stability
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Clients */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-surface-soft flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent-light rounded-lg">
                <Users className="w-5 h-5 text-accent DEFAULT" />
              </div>
              <h2 className="font-display font-semibold text-lg text-brand-900">Best clients</h2>
            </div>
            {topClients.length > 0 && (
              <button className="text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          {topClients.length === 0 ? (
            <div className="p-8 text-center text-ink-tertiary">No client data yet</div>
          ) : (
            <ul className="divide-y divide-border">
              {topClients.map((client, idx) => (
                <li key={client.id} className="p-5 flex items-center justify-between hover:bg-surface-soft transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center font-mono font-semibold text-accent-dark group-hover:bg-accent DEFAULT group-hover:text-white transition-colors">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-body font-semibold text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                        {client.name}
                      </h4>
                      <p className="text-xs text-ink-tertiary flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {client.projects} projects
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-ink-primary">{formatCurrency(client.amount)}</div>
                    <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
                      {client.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Growth Recommendations */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-accent-light rounded-lg">
              <Zap className="w-5 h-5 text-accent DEFAULT" />
            </div>
            <h2 className="font-display font-semibold text-lg text-brand-900">Growth recommendations</h2>
          </div>

          <div className="text-center py-10">
            <Zap className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
            <p className="text-ink-secondary">No recommendations at this time</p>
            <p className="text-xs text-ink-tertiary mt-1">Complete more projects to unlock personalized tips</p>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-br from-brand-900 to-brand-800 rounded-xl text-white">
            <h4 className="font-body font-semibold text-lg mb-2">Premium insights</h4>
            <p className="text-white/80 text-sm mb-4">
              Unlock deep market analysis, rate optimization, and advanced analytics with Forte Pro
            </p>
            <button className="px-4 py-2 rounded-lg bg-white text-brand-900 hover:bg-surface-soft font-body font-medium text-sm transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
