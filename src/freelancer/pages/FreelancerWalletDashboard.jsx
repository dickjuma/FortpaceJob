// src/pages/freelancer/FreelancerWalletDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUpRight, TrendingUp, Clock, Download, Briefcase, FileText, Check } from 'lucide-react';
import { useFreelancerWallet } from '../services/freelancerHooks';

export default function FreelancerWalletDashboard() {
  const { data: walletData, isLoading } = useFreelancerWallet();
  const fallbackAnalytics = [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 2100 },
    { month: 'Mar', earnings: 1800 },
    { month: 'Apr', earnings: 3400 },
    { month: 'May', earnings: 2800 },
  ];
  const analytics = Array.isArray(walletData?.analytics) ? walletData.analytics : fallbackAnalytics;
  const metrics = walletData?.metrics || {
    balance: 2450.00,
    escrow: 1200.00,
    withdrawn: 8400.00
  };

  const maxEarnings = 4000;

  const handleWithdraw = () => {
    // Withdraw functionality would go here
    console.log('Withdraw funds');
  };

  const handleDownloadCertificate = () => {
    console.log('Downloading certificate of earnings');
  };

  const handleDownloadInvoice = () => {
    console.log('Opening tax invoice generator');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <DollarSign className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Earnings & wallet</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1">
            Track your income, view pending escrow, and withdraw funds
          </p>
        </div>
        <button
          onClick={handleWithdraw}
          className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900"
        >
          <ArrowUpRight className="w-4 h-4" /> Withdraw funds
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -2 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm lg:col-span-2"
        >
          <p className="text-ink-tertiary text-xs font-body font-medium uppercase tracking-wide mb-1">
            Available for withdrawal
          </p>
          <div className="font-mono font-bold text-4xl text-ink-primary mb-3">KES {metrics.balance.toLocaleString()}</div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent-light text-accent-dark text-xs font-body font-medium">
              <TrendingUp className="w-3 h-3" /> +15% this month
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-muted text-ink-tertiary text-xs font-body font-medium">
              Next payout: May 25
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm"
        >
          <p className="text-ink-tertiary text-xs font-body font-medium uppercase tracking-wide mb-1">
            Work in progress (escrow)
          </p>
          <div className="font-mono font-bold text-3xl text-ink-primary mb-2">KES {metrics.escrow.toLocaleString()}</div>
          <div className="text-xs font-body text-accent DEFAULT inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> 2 active contracts
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -2 }}
          className="bg-white border border-border rounded-2xl p-5 shadow-sm"
        >
          <p className="text-ink-tertiary text-xs font-body font-medium uppercase tracking-wide mb-1">
            In review
          </p>
          <div className="font-mono font-bold text-3xl text-ink-primary mb-2">KES {metrics.withdrawn.toLocaleString()}</div>
          <div className="text-xs font-body text-warn inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending client approval
          </div>
        </motion.div>
      </div>

      {/* Chart & Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-5 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display font-semibold text-lg text-brand-900">Earnings overview</h2>
              <select className="h-9 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900">
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
            </div>

            {/* Chart Bars */}
            <div className="flex-1 flex items-end justify-between gap-2 pt-4">
              {analytics.map((data, i) => {
                const heightPercent = (data.earnings / maxEarnings) * 100;
                return (
                  <div key={i} className="flex flex-col items-center w-full group">
                    <div className="relative w-full flex justify-center h-full items-end">
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-900 text-white text-xs font-body font-medium py-1 px-2 rounded-md z-10 pointer-events-none whitespace-nowrap">
                        KES {data.earnings.toLocaleString()}
                      </div>
                      <motion.div
                        className="w-full max-w-[50px] bg-accent-light group-hover:bg-accent DEFAULT rounded-t-md transition-all cursor-pointer"
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        style={{ minHeight: '4px' }}
                      />
                    </div>
                    <div className="text-xs font-body text-ink-tertiary mt-2 font-medium">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tax & Reports */}
        <div>
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-surface-soft">
              <h2 className="font-display font-semibold text-lg text-brand-900">Tax & reports</h2>
            </div>
            <div className="p-2">
              <button
                onClick={handleDownloadCertificate}
                className="w-full flex items-center justify-between p-3 hover:bg-surface-soft rounded-xl transition-colors group focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-light rounded-lg">
                    <FileText className="w-4 h-4 text-accent DEFAULT" />
                  </div>
                  <div className="text-left">
                    <p className="font-body font-semibold text-sm text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                      Certificate of earnings
                    </p>
                    <p className="text-xs font-body text-ink-tertiary">Official document for visas/loans</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors" />
              </button>

              <button
                onClick={handleDownloadInvoice}
                className="w-full flex items-center justify-between p-3 hover:bg-surface-soft rounded-xl transition-colors group focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-light rounded-lg">
                    <FileText className="w-4 h-4 text-accent DEFAULT" />
                  </div>
                  <div className="text-left">
                    <p className="font-body font-semibold text-sm text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                      Tax invoice generator
                    </p>
                    <p className="text-xs font-body text-ink-tertiary">Auto-generate invoices for clients</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors" />
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="mt-5 bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 text-white">
            <h3 className="font-body font-semibold text-sm mb-2">Quick transfer</h3>
            <p className="text-xs text-white/70 mb-3">Withdraw directly to your bank account or M-Pesa</p>
            <div className="flex gap-2">
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">Bank transfer</span>
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">M-Pesa</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
