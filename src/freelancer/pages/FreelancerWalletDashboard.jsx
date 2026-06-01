import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Clock, Download, Briefcase, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FreelancerWalletDashboard() {
  const analytics = [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 2100 },
    { month: 'Mar', earnings: 1800 },
    { month: 'Apr', earnings: 3400 },
    { month: 'May', earnings: 2800 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-dark dark:text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#14a800]" /> Earnings & Wallet
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your income, view pending escrow, and withdraw funds to your local bank or M-Pesa.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-surface-dark hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-surface-dark text-white rounded-button text-sm font-bold shadow-card flex items-center transition-all">
            <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card col-span-1 md:col-span-2">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Available for Withdrawal</h3>
          <div className="text-4xl font-bold text-surface-dark dark:text-white mb-4">$4,250.00</div>
          <div className="flex gap-3">
            <div className="px-3 py-1.5 bg-success/10 text-success rounded-lg text-xs font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +15% this month
            </div>
            <div className="px-3 py-1.5 bg-gray-100 dark:bg-surface-dark-secondary text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
              Next payout: May 25
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Work in Progress (Escrow)</h3>
          <div className="text-3xl font-bold text-surface-dark dark:text-white mb-4">$3,100.00</div>
          <div className="text-sm text-[#14a800] flex items-center">
            <Briefcase className="w-4 h-4 mr-1" /> 2 active contracts
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">In Review</h3>
          <div className="text-3xl font-bold text-surface-dark dark:text-white mb-4">$850.00</div>
          <div className="text-sm text-warning flex items-center">
            <Clock className="w-4 h-4 mr-1" /> Pending client approval
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-surface-dark dark:text-white">Earnings Overview</h2>
              <select className="bg-surface-tertiary dark:bg-surface-dark-secondary border-none text-sm rounded-lg px-3 py-1.5 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            
            {/* Mock Chart Area */}
            <div className="flex-1 flex items-end justify-between gap-2 pt-10">
              {analytics.map((data, i) => {
                const max = 4000;
                const height = `${(data.earnings / max) * 100}%`;
                return (
                  <div key={i} className="flex flex-col items-center w-full group">
                    <div className="relative w-full flex justify-center h-full items-end">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-dark text-white text-xs py-1 px-2 rounded-md font-bold z-10 pointer-events-none">
                        ${data.earnings}
                      </div>
                      <div className="w-full max-w-[40px] bg-[#14a800]/10 dark:bg-[#14a800]/30 group-hover:bg-[#14a800] dark:group-hover:bg-[#14a800] rounded-t-sm transition-colors" style={{ height }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-3 font-medium">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-surface-dark-border bg-surface-secondary dark:bg-surface-dark-secondary">
              <h2 className="text-lg font-bold text-surface-dark dark:text-white">Tax & Reports</h2>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center justify-between p-4 hover:bg-surface dark:hover:bg-surface-dark-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#14a800]/5 dark:bg-[#14a800]/20 text-[#14a800] rounded-lg"><FileText className="w-5 h-5" /></div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-surface-dark dark:text-white">Certificate of Earnings</p>
                    <p className="text-xs text-gray-500">Official document for visas/loans</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-surface dark:hover:bg-surface-dark-secondary rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><FileText className="w-5 h-5" /></div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-surface-dark dark:text-white">Tax Invoice Generator</p>
                    <p className="text-xs text-gray-500">Auto-generate invoices for clients</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
