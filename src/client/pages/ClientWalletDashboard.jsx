import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, ShieldCheck, Download, CreditCard, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientWalletDashboard() {
  const transactions = [
    { id: 'TXN-9821', type: 'deposit', amount: 5000.00, status: 'success', method: 'M-Pesa STK', date: 'Today, 10:45 AM' },
    { id: 'TXN-9820', type: 'escrow_lock', amount: -2500.00, status: 'success', method: 'Internal Transfer', date: 'Yesterday', contract: 'CON-9921' },
    { id: 'TXN-9819', type: 'release', amount: -1200.00, status: 'success', method: 'Escrow Release', date: 'May 17, 2026', contract: 'CON-8834' },
    { id: 'TXN-9818', type: 'deposit', amount: 10000.00, status: 'failed', method: 'Bank Transfer', date: 'May 16, 2026' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-brand-600" /> Client Wallet
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage deposits, track escrow locks, and review your spending analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-button text-sm font-medium hover:bg-surface dark:hover:bg-surface-dark-tertiary transition-colors shadow-card flex items-center">
            <Download className="w-4 h-4 mr-2" /> Statements
          </button>
          <button className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-button text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center transition-all">
            <CreditCard className="w-4 h-4 mr-2" /> Deposit Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <h3 className="text-brand-100 text-sm font-medium mb-1 relative z-10">Available Balance</h3>
          <div className="text-4xl font-bold mb-4 relative z-10">$12,450.00</div>
          <div className="flex items-center text-sm text-brand-100 relative z-10">
            <ArrowUpRight className="w-4 h-4 mr-1 text-success-light" />
            <span className="text-success-light font-bold">+$5,000</span> <span className="ml-2">deposited today</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total in Escrow</h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$8,200.00</div>
          <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg text-sm text-warning font-medium">
            <ShieldCheck className="w-4 h-4" /> Locked across 3 active contracts
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending Releases</h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$3,500.00</div>
          <div className="flex items-center gap-2 p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-sm text-brand-600 font-medium">
            <Clock className="w-4 h-4" /> 2 milestones awaiting your approval
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-surface-dark-border flex justify-between items-center bg-surface-secondary dark:bg-surface-dark-secondary">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
              <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700">View All</button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-surface-dark-border">
              {transactions.map(txn => (
                <div key={txn.id} className="p-4 sm:p-6 hover:bg-surface dark:hover:bg-surface-dark-secondary transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      txn.type === 'deposit' ? 'bg-success/10 text-success' :
                      txn.type === 'escrow_lock' ? 'bg-warning/10 text-warning' :
                      'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                    }`}>
                      {txn.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> : 
                       txn.type === 'escrow_lock' ? <ShieldCheck className="w-5 h-5" /> : 
                       <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white capitalize">
                        {txn.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{txn.date} • {txn.method} {txn.contract && `• ${txn.contract}`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${txn.amount > 0 ? 'text-success' : 'text-gray-900 dark:text-white'}`}>
                      {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                    <p className="text-xs mt-0.5 flex items-center justify-end">
                      {txn.status === 'success' ? <span className="text-success flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Success</span> : 
                       <span className="text-danger flex items-center">Failed</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-surface-dark text-white rounded-2xl p-6 shadow-card relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500 rounded-full opacity-20 blur-2xl"></div>
            <h3 className="text-lg font-bold mb-4">Quick Pay via M-Pesa</h3>
            <p className="text-sm text-gray-400 mb-6">Instantly deposit funds using M-Pesa STK Push. Zero transaction fees for deposits under $1,000.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                <input type="text" placeholder="254 7XX XXX XXX" className="w-full bg-surface-dark-secondary border border-surface-dark-tertiary rounded-lg px-4 py-3 text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 block">Amount (USD)</label>
                <input type="number" placeholder="0.00" className="w-full bg-surface-dark-secondary border border-surface-dark-tertiary rounded-lg px-4 py-3 text-white outline-none focus:border-brand-500" />
              </div>
              <button className="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-bold transition-colors">
                Send STK Push
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
