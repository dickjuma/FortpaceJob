// ClientWalletDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, RefreshCw,
  DollarSign, Lock, TrendingUp, FileDown, AlertCircle, ChevronRight, Search,
  CheckCircle, XCircle
} from 'lucide-react';
import { useWallet, useTransactions, useDeposit, useWithdraw } from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const TX_TYPES = {
  CREDIT:   { label: 'Deposit',   icon: ArrowDownLeft,  color: 'text-accent', bg: 'bg-accent-light' },
  DEBIT:    { label: 'Withdrawal',icon: ArrowUpRight,   color: 'text-danger', bg: 'bg-danger-light' },
  ESCROW:   { label: 'Escrow',    icon: Lock,           color: 'text-warn',   bg: 'bg-warn-light' },
  RELEASE:  { label: 'Release',   icon: ArrowDownLeft,  color: 'text-accent', bg: 'bg-accent-light' },
  REFUND:   { label: 'Refund',    icon: ArrowDownLeft,  color: 'text-info',   bg: 'bg-info-light' },
};

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ClientWalletDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [txFilter, setTxFilter] = useState('ALL');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  const { data: wallet, isLoading: walletLoading, error: walletError, refetch: refetchWallet } = useWallet();
  const filters = { page, limit: 15, ...(txFilter !== 'ALL' && { type: txFilter }), ...(search && { search }) };
  const { data: txData, isLoading: txLoading, refetch: refetchTx } = useTransactions(filters);
  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const transactions = txData?.items || [];
  const total = txData?.total || 0;
  const totalPages = txData?.totalPages || 1;

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const showConfirm = ({ title, message, confirmLabel, onConfirm }) => {
    setConfirmModal({ title, message, confirmLabel, onConfirm });
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 10) {
      showToast('error', 'Minimum deposit is KES 10');
      return;
    }
    if (!phone.match(/^(07|01|2547|2541)\d{8}$/)) {
      showToast('error', 'Enter a valid M-Pesa number');
      return;
    }
    showConfirm({
      title: 'Confirm deposit',
      message: `Send M-Pesa STK Push for KES ${Number(amount).toLocaleString()} to ${phone}?`,
      confirmLabel: 'Send STK Push',
      onConfirm: async () => {
        try {
          await deposit.mutateAsync({ amount: Number(amount), phone, provider: 'MPESA' });
          showToast('success', 'M-Pesa STK Push Sent! Check your phone.');
          setDepositModal(false);
          setAmount('');
          setPhone('');
          refetchWallet();
          refetchTx();
        } catch (err) {
          showToast('error', err.message || 'Deposit failed');
        }
        setConfirmModal(null);
      },
    });
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const avail = Number(wallet?.availableBalance || wallet?.balance || 0);
    if (!withdrawAmount || Number(withdrawAmount) < 10) {
      showToast('error', 'Minimum withdrawal is KES 10');
      return;
    }
    if (Number(withdrawAmount) > avail) {
      showToast('error', 'Insufficient balance');
      return;
    }
    showConfirm({
      title: 'Confirm withdrawal',
      message: `Withdraw KES ${Number(withdrawAmount).toLocaleString()} to ${withdrawPhone || 'your M-Pesa number'}? Funds leave your available balance immediately.`,
      confirmLabel: 'Withdraw',
      onConfirm: async () => {
        try {
          await withdraw.mutateAsync({ amount: Number(withdrawAmount), phone: withdrawPhone, provider: 'MPESA' });
          showToast('success', 'Withdrawal initiated via M-Pesa.');
          setWithdrawModal(false);
          setWithdrawAmount('');
          setWithdrawPhone('');
          refetchWallet();
          refetchTx();
        } catch (err) {
          showToast('error', err.message || 'Withdrawal failed');
        }
        setConfirmModal(null);
      },
    });
  };

  const handleSync = () => {
    refetchWallet();
    refetchTx();
    showToast('success', 'Wallet synced.');
  };

  const availableBalance = Number(wallet?.availableBalance ?? wallet?.balance ?? 0);
  const lockedBalance = Number(wallet?.lockedBalance ?? wallet?.escrowBalance ?? 0);
  const totalBalance = availableBalance + lockedBalance;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900 flex items-center gap-3">
              <Wallet className="w-8 h-8 text-accent" /> M-Pesa Wallet
            </h1>
            <p className="text-sm text-ink-secondary mt-1">Manage your funds securely via M-Pesa.</p>
          </div>
          <button
            onClick={handleSync}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Sync Balance
          </button>
        </div>

        {/* Balance Cards */}
        {walletLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : walletError ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 border border-danger/20 bg-danger-light rounded-2xl">
            <AlertCircle className="w-8 h-8 text-danger opacity-60" />
            <p className="text-danger text-sm font-medium">Failed to load wallet balance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Total */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-accent mb-2">Total Balance</p>
              <p className="text-3xl font-bold text-ink-primary">KES {totalBalance.toLocaleString()}</p>
              <p className="text-xs text-ink-tertiary mt-2">Available + In Escrow</p>
            </div>
            {/* Available */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-accent" />
                <p className="text-sm font-semibold text-ink-tertiary">Available</p>
              </div>
              <p className="text-2xl font-bold text-accent">KES {availableBalance.toLocaleString()}</p>
              <p className="text-xs text-ink-tertiary mt-2">Ready to use for new contracts</p>
            </div>
            {/* Locked */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-warn" />
                <p className="text-sm font-semibold text-ink-tertiary">In Escrow</p>
              </div>
              <p className="text-2xl font-bold text-warn">KES {lockedBalance.toLocaleString()}</p>
              <p className="text-xs text-ink-tertiary mt-2">Locked in active contracts</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDepositModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit via M-Pesa
          </button>
          <button
            onClick={() => setWithdrawModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-white text-ink-primary rounded-lg text-sm font-medium hover:bg-surface-soft transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
          <button
            onClick={() => navigate('/client/contracts')}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-white text-ink-primary rounded-lg text-sm font-medium hover:bg-surface-soft transition-colors"
          >
            <TrendingUp className="w-4 h-4" /> View Contracts
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-brand-900">Transaction History</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2 flex-wrap">
                {['ALL', 'CREDIT', 'DEBIT', 'ESCROW', 'REFUND'].map(f => (
                  <button
                    key={f}
                    onClick={() => { setTxFilter(f); setPage(1); }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      txFilter === f
                        ? "bg-accent-light text-accent-dark"
                        : "bg-white text-ink-tertiary border border-border hover:bg-surface-soft"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <input
                  type="text"
                  placeholder="Search ref..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 pr-4 py-2 h-9 border border-border rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>
            </div>
          </div>

          {txLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-surface-muted border-t-accent rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center">
              <FileDown className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
              <p className="text-ink-primary font-medium">No transactions found.</p>
              <p className="text-xs text-ink-tertiary mt-1">Your deposits and withdrawals will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-soft text-ink-tertiary border-b border-border">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Transaction</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Reference</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-right">Amount</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx, idx) => {
                    const typeInfo = TX_TYPES[tx.type] || TX_TYPES.CREDIT;
                    const Icon = typeInfo.icon;
                    const isPositive = ['CREDIT', 'RELEASE', 'REFUND'].includes(tx.type);
                    return (
                      <motion.tr
                        key={tx.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-surface-soft transition-colors group"
                      >
                        <td className="px-5 py-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", typeInfo.bg)}>
                              <Icon className={cn("w-4 h-4", typeInfo.color)} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ink-primary">{tx.description || typeInfo.label}</p>
                              <p className="text-xs text-ink-tertiary mt-0.5">{typeInfo.label}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-mono text-ink-tertiary">{tx.reference || `TXN-${tx.id}`}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-sm text-ink-secondary flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {new Date(tx.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-ink-tertiary block mt-0.5">{timeAgo(tx.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <p className={cn("text-base font-bold", isPositive ? "text-accent" : "text-ink-primary")}>
                            {isPositive ? '+' : '-'}KES {Number(tx.amount || 0).toLocaleString()}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={cn(
                            "inline-flex px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase border",
                            tx.status === 'COMPLETED' ? "bg-accent-light text-accent-dark border-accent/20" :
                            tx.status === 'PENDING' ? "bg-warn-light text-warn border-warn/20" :
                            "bg-danger-light text-danger border-danger/20"
                          )}>
                            {tx.status || 'COMPLETED'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-center gap-3 bg-white">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-ink-tertiary">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {depositModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setDepositModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-brand-900 flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-accent" /> M-Pesa Deposit
                </h3>
                <p className="text-sm text-ink-secondary mt-1">Instantly fund your wallet using M-Pesa.</p>
              </div>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5 uppercase tracking-wide">
                    Amount (KES) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary font-medium">KES</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="5000"
                      min={10}
                      required
                      className="w-full h-10 border border-border rounded-lg pl-12 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5 uppercase tracking-wide">
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712345678"
                    required
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
                <div className="bg-accent-light border border-accent/20 p-3 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="w-4 h-4 text-accent-dark shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-secondary">
                    You will receive an M-Pesa STK Push prompt on your phone. Enter your PIN to complete the deposit.
                  </p>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setDepositModal(false)}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deposit.isPending}
                    className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deposit.isPending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Sending...
                      </span>
                    ) : (
                      'Send STK Push'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {withdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setWithdrawModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-brand-900 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-danger" /> Withdraw to M-Pesa
                </h3>
                <p className="text-sm text-ink-secondary mt-1">
                  Available to withdraw: <span className="font-semibold text-ink-primary">KES {availableBalance.toLocaleString()}</span>
                </p>
              </div>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5 uppercase tracking-wide">
                    Amount (KES) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary font-medium">KES</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="2000"
                      min={10}
                      max={availableBalance}
                      required
                      className="w-full h-10 border border-border rounded-lg pl-12 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5 uppercase tracking-wide">
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    placeholder="0712345678"
                    required
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawModal(false)}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={withdraw.isPending}
                    className="px-5 py-2 bg-danger hover:bg-danger-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {withdraw.isPending ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal (replaces useConfirm) */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
            >
              <h3 className="font-display text-lg font-bold text-brand-900">{confirmModal.title}</h3>
              <p className="text-sm text-ink-secondary">{confirmModal.message}</p>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {confirmModal.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' :
                               toast.type === 'error' ? 'rgb(254, 226, 226)' : 'rgb(219, 234, 254)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' :
                     toast.type === 'error' ? 'rgb(185, 28, 28)' : 'rgb(29, 78, 216)',
            }}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
