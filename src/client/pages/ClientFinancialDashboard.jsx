// ClientFinancialDashboard.jsx
// Self-contained Financial Dashboard with mock data, framer-motion animations,
// and design tokens. No external dependencies.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Download,
  AlertCircle,
  RefreshCw,
  BarChart2,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getWallet, getTransactions, getMyContracts } from '../services/clientApi';

// ----------------------------------------------------------------------
// Mock API / Data
// ----------------------------------------------------------------------
const mockWallet = {
  availableBalance: 245000,
  lockedBalance: 75000,
  balance: 320000,
};

const mockTransactions = [
  {
    id: 'TX-1001',
    type: 'CREDIT',
    amount: 50000,
    description: 'Wallet deposit via M-Pesa',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'COMPLETED',
  },
  {
    id: 'TX-1002',
    type: 'ESCROW',
    amount: 45000,
    description: 'Escrow hold for contract #CT-202',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'TX-1003',
    type: 'DEBIT',
    amount: 25000,
    description: 'Payment to freelancer Sarah Jenkins',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'COMPLETED',
  },
  {
    id: 'TX-1004',
    type: 'CREDIT',
    amount: 15000,
    description: 'Refund from milestone release',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    status: 'COMPLETED',
  },
  {
    id: 'TX-1005',
    type: 'ESCROW',
    amount: 30000,
    description: 'Escrow for new project',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    status: 'ACTIVE',
  },
];

const mockContracts = [
  {
    id: 'CT-202',
    status: 'ACTIVE',
    freelancer: { name: 'Sarah Jenkins' },
    totalAmount: 85000,
  },
  {
    id: 'CT-203',
    status: 'ACTIVE',
    freelancer: { name: 'Michael Chen' },
    totalAmount: 120000,
  },
  {
    id: 'CT-204',
    status: 'ACTIVE',
    freelancer: { name: 'David Omondi' },
    totalAmount: 45000,
  },
];

// Helper
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientFinancialDashboard() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [txPage, setTxPage] = useState(1);
  const [toast, setToast] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        const walletData = await getWallet();
        const txData = await getTransactions({ limit: 50, sort: 'createdAt:desc' });
        const contractData = await getMyContracts({ limit: 20 });

        setWallet(walletData?.data || walletData);
        setTransactions(txData?.items || txData || []);
        setContracts(contractData?.items || contractData || []);
      } catch (err) {
        showToast('error', err?.message || 'Failed to load financial data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const refetchWallet = () => {
    showToast('success', 'Wallet balance refreshed.');
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      showToast('error', 'No transactions to export');
      return;
    }
    const rows = [
      ['ID', 'Date', 'Type', 'Amount', 'Description', 'Status'],
      ...transactions.map((t) => [
        t.id,
        new Date(t.createdAt).toLocaleDateString(),
        t.type,
        t.amount,
        t.description || '',
        t.status || 'COMPLETED',
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forte-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'CSV downloaded!');
  };

  // Paginate transactions
  const paginatedTransactions = transactions.slice(
    (txPage - 1) * itemsPerPage,
    txPage * itemsPerPage
  );
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const availableBalance = wallet?.availableBalance ?? 0;
  const lockedBalance = wallet?.lockedBalance ?? 0;
  const totalBalance = availableBalance + lockedBalance;

  // Calculate total spent from transactions
  const totalSpent = transactions
    .filter((t) => t.type === 'DEBIT' || t.type === 'ESCROW')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Animation variants
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
  const buttonTap = { scale: 0.97 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900">
              Financial Dashboard
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Overview of your spending, escrow, and payments
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={buttonTap}
              onClick={refetchWallet}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-white text-ink-secondary rounded-lg text-xs font-medium hover:bg-surface-soft transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-white text-ink-secondary rounded-lg text-xs font-medium hover:bg-surface-soft transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </motion.button>
          </div>
        </div>

        {/* Balance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {/* Total Balance */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-accent" />
              <p className="text-xs text-ink-tertiary">Total Balance</p>
            </div>
            <p className="text-3xl font-bold text-ink-primary">
              KES {totalBalance.toLocaleString()}
            </p>
            <p className="text-xs text-ink-tertiary mt-2">Available + Escrow</p>
          </motion.div>

          {/* Available */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-accent" />
              <p className="text-xs text-ink-tertiary">Available</p>
            </div>
            <p className="text-3xl font-bold text-accent">
              KES {availableBalance.toLocaleString()}
            </p>
            <button className="text-xs text-ink-tertiary hover:text-accent mt-2 transition-colors flex items-center gap-1">
              Manage wallet <ArrowUpRight className="w-3 h-3" />
            </button>
          </motion.div>

          {/* In Escrow */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-warn" />
              <p className="text-xs text-ink-tertiary">In Escrow</p>
            </div>
            <p className="text-3xl font-bold text-warn">
              KES {lockedBalance.toLocaleString()}
            </p>
            <p className="text-xs text-ink-tertiary mt-2">Locked for active contracts</p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileTap={buttonTap}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit Funds
          </motion.button>
          <motion.button
            whileTap={buttonTap}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-white text-ink-primary rounded-full font-medium text-sm hover:bg-surface-soft transition-colors"
          >
            <FileText className="w-4 h-4" /> View Contracts
          </motion.button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction History */}
          <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center bg-white">
              <h2 className="font-display font-bold text-brand-900">Recent Transactions</h2>
              <span className="text-xs text-ink-tertiary">{transactions.length} total</span>
            </div>
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-ink-tertiary text-sm">
                No transactions yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {paginatedTransactions.map((tx) => {
                  const isPositive = ['CREDIT', 'RELEASE', 'REFUND'].includes(tx.type);
                  const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-soft transition-colors"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isPositive ? 'bg-accent-light' : 'bg-danger-light'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isPositive ? 'text-accent' : 'text-danger'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-primary truncate">
                          {tx.description || tx.type}
                        </p>
                        <p className="text-xs text-ink-tertiary">{timeAgo(tx.createdAt)}</p>
                      </div>
                      <p
                        className={`text-sm font-bold shrink-0 ${
                          isPositive ? 'text-accent' : 'text-danger'
                        }`}
                      >
                        {isPositive ? '+' : '-'}KES {Number(tx.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            {totalPages > 1 && (
              <div className="p-4 border-t border-border flex justify-center gap-2">
                <button
                  onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                  disabled={txPage === 1}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs text-ink-secondary disabled:opacity-40 hover:bg-surface-soft transition-colors"
                >
                  Prev
                </button>
                <span className="text-xs text-ink-tertiary">
                  {txPage} / {totalPages}
                </span>
                <button
                  onClick={() => setTxPage((p) => Math.min(totalPages, p + 1))}
                  disabled={txPage === totalPages}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs text-ink-secondary disabled:opacity-40 hover:bg-surface-soft transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Active Contracts Sidebar */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border bg-white">
              <h2 className="font-display font-bold text-brand-900">Active Contracts</h2>
            </div>
            {contracts.length === 0 ? (
              <div className="p-6 text-center text-ink-tertiary text-sm">
                No active contracts.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {contracts.map((c) => (
                  <div
                    key={c.id}
                    className="px-5 py-4 hover:bg-surface-soft transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-ink-primary">
                        Contract #{c.id}
                      </p>
                      <span className="text-xs font-medium text-accent">{c.status}</span>
                    </div>
                    <p className="text-xs text-ink-tertiary">
                      {c.freelancer?.name || 'Freelancer'}
                    </p>
                    <p className="text-xs font-bold text-accent mt-1">
                      KES {Number(c.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="p-4 border-t border-border">
              <button className="w-full text-center text-xs font-medium text-accent hover:text-accent-dark transition-colors">
                View All Contracts →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : toast.type === 'error'
                  ? 'rgb(254, 226, 226)'
                  : 'rgb(219, 234, 254)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : toast.type === 'error'
                  ? 'rgb(185, 28, 28)'
                  : 'rgb(29, 78, 216)',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
