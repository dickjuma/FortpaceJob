import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
// ClientWalletPage.jsx
// Self-contained Client Wallet page with design tokens, framer-motion animations,
// and local mock data. No external dependencies.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Phone,
  Loader2,
  Smartphone,
  Lock,
  X,
} from 'lucide-react';
import { getWallet, getTransactions, depositToWallet } from '../services/clientApi';

// ----------------------------------------------------------------------
// Helper for conditional classes
// ----------------------------------------------------------------------
const cn = (...classes) => classes.filter(Boolean).join(' ');

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientWalletPage() {
  const queryClient = useQueryClient();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');
  const [toast, setToast] = useState(null);

  const { data: walletData, isLoading: isWalletLoading, error: walletError, refetch: refetchWallet } = useQuery({
    queryKey: ['client', 'wallet'],
    queryFn: async () => {
      const data = await getWallet();
      return data || {};
    }
  });

  const { data: transactionsData, isLoading: isTxLoading, refetch: refetchTx } = useQuery({
    queryKey: ['client', 'transactions'],
    queryFn: async () => {
      const data = await getTransactions({ limit: 50, sort: 'createdAt:desc' });
      return data?.items || data || [];
    }
  });

  const isLoading = isWalletLoading || isTxLoading;
  const error = walletError ? walletError.message : '';
  const wallet = walletData;
  const transactions = transactionsData || [];

  const depositMutation = useMutation({
    mutationFn: async ({ amount, phone }) => {
      return await depositToWallet({ provider: 'MPESA', amount, phone });
    },
    onSuccess: () => {
      toast.success('STK Push sent successfully!');
      setDepositAmount('');
      setDepositPhone('');
      refetchWallet();
      refetchTx();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to trigger M-Pesa STK Push.');
    }
  });

  const handleMpesaDeposit = (e) => {
    e.preventDefault();
    if (!depositPhone.trim()) {
      toast.error('Safaricom number is required.');
      return;
    }
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      toast.error('Invalid deposit amount.');
      return;
    }
    const ok = window.confirm("Deposit KES  via M-Pesa STK Push to ?");
    if (!ok) return;
    toast.success('info', 'Sending M-Pesa STK Push request...');
    depositMutation.mutate({ amount: amt, phone: depositPhone });
  };

  const isDepositing = depositMutation.isPending;

  const handleRefresh = async () => {
    await refetchWallet();
    await refetchTx();
    toast.success('Wallet balance refreshed');
  };

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
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: {
      y: -3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const availableBalance = wallet?.availableBalance || 0;
  const lockedBalance = wallet?.lockedBalance || 0;
  const totalBalance = availableBalance + lockedBalance;

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-border">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-accent" /> Client Financial Wallet
          </h1>
          <motion.button
            whileTap={buttonTap}
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-white text-ink-primary rounded-lg font-medium text-sm hover:bg-surface-soft transition-colors"
          >
            <RefreshCcw size={14} /> Sync Balance
          </motion.button>
        </div>

        {error && (
          <div className="bg-danger-light border border-danger/20 rounded-xl p-3 mb-6 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        {/* Balance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Available Balance */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover.hover}
            className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl shadow-sm p-6 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 text-white/80">
              <ShieldCheck size={14} /> Available Balance
            </h2>
            <p className="text-3xl font-bold mt-2">
              KES {availableBalance.toLocaleString()}
            </p>
          </motion.div>

          {/* Locked in Escrow */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover.hover}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide flex items-center gap-1.5">
              <Lock size={14} className="text-warn" /> Locked in Escrow
            </h2>
            <p className="text-3xl font-bold text-ink-primary mt-2">
              KES {lockedBalance.toLocaleString()}
            </p>
          </motion.div>

          {/* Total Balance */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHover.hover}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide flex items-center gap-1.5">
              <Wallet size={14} className="text-accent" /> Total Balance
            </h2>
            <p className="text-3xl font-bold text-ink-primary mt-2">
              KES {totalBalance.toLocaleString()}
            </p>
          </motion.div>
        </motion.div>

        {/* Deposit Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-8"
        >
          <h2 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2 mb-4">
            <Smartphone size={20} className="text-accent" /> Quick Top-Up (STK Push)
          </h2>
          <form onSubmit={handleMpesaDeposit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-tertiary mb-1.5">
                Safaricom Number
              </label>
              <input
                type="tel"
                placeholder="0712345678"
                value={depositPhone}
                onChange={(e) => setDepositPhone(e.target.value)}
                className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-tertiary mb-1.5">
                Amount (KES)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-end">
              <motion.button
                whileTap={buttonTap}
                type="submit"
                disabled={isDepositing}
                className="w-full h-10 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isDepositing && <Loader2 size={14} className="animate-spin" />}
                Send STK Push
              </motion.button>
            </div>
          </form>
          <p className="text-xs text-ink-tertiary mt-3">
            Enter your Safaricom number (without spaces). You'll receive a prompt on your phone to complete the payment.
          </p>
        </motion.div>

        {/* Transactions Table */}
        <div>
          <h2 className="font-display text-xl font-bold text-brand-900 mb-4">Recent Ledger Transactions</h2>
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-ink-tertiary text-sm">
                No transactions yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-soft text-ink-tertiary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Description
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                        Amount
                      </th>
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((tx, idx) => (
                      <motion.tr
                        key={tx.id || idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-surface-soft transition-colors"
                      >
                        <td className="px-5 py-3 text-ink-secondary">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 font-medium text-ink-primary">
                          {tx.description || 'Ledger entry'}
                        </td>
                        <td
                          className={cn(
                            'px-5 py-3 text-right font-bold',
                            tx.amount > 0 || tx.type === 'CREDIT'
                              ? 'text-accent'
                              : 'text-ink-primary'
                          )}
                        >
                          {tx.amount > 0 || tx.type === 'CREDIT' ? '+' : ''}
                          KES {Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-light text-accent-dark">
                            {tx.status || 'COMPLETED'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            {toast.type === 'success' && <CheckCircle2 size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <Phone size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

