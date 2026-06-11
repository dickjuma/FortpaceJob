// src/pages/freelancer/WalletPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, Clock, CheckCircle2, AlertCircle, ShieldCheck, Send, Smartphone, Loader2, X,
} from 'lucide-react';
import { useFreelancerWallet, useFreelancerTransactions, useInitiateWithdrawal } from '../services/freelancerHooks';
import { walletAPI } from '../../common/services/api';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button', icon: Icon }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ value, onChange, placeholder, type = 'text', required, className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${className}`}
  />
);

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

// ---------- Helper ----------
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
};

// ---------- Main Component ----------
export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [toast, setToast] = useState(null);

  const [mpesaStatus, setMpesaStatus] = useState('Not setup');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaName, setMpesaName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mpesaOtp, setMpesaOtp] = useState('');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const { data: walletData = {}, isLoading: walletLoading } = useFreelancerWallet();
  const { data: txPagedData = {}, isLoading: txLoading } = useFreelancerTransactions({ page: 1, limit: 10 });
  const withdrawMutation = useInitiateWithdrawal();

  const wallet = {
    available: walletData.available ?? 0,
    pending: walletData.pending ?? 0,
    escrow: walletData.escrow ?? 0,
    monthly: walletData.monthly ?? 0,
  };
  const transactions = txPagedData.items ?? [];
  const loading = walletLoading || txLoading;

  const handleSendOTP = () => {
    if (!mpesaPhone.match(/^(07|01|\+254)\d{8,9}$/)) {
      setToast({ type: 'error', message: 'Please enter a valid phone number.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setOtpSent(true);
    setToast({ type: 'success', message: 'OTP sent to your phone.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerifyOTP = () => {
    if (!mpesaOtp || mpesaOtp.length < 4) {
      setToast({ type: 'error', message: 'Please enter the OTP.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setMpesaStatus('Active');
    setMpesaName('Alex Morgan');
    setOtpSent(false);
    setToast({ type: 'success', message: 'M-Pesa verified successfully!' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (mpesaStatus !== 'Active') {
      setToast({ type: 'error', message: 'Please set up M-Pesa first.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0 || amount > wallet.available) {
      setToast({ type: 'error', message: 'Invalid withdrawal amount.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setIsWithdrawing(true);
    try {
      await withdrawMutation.mutateAsync({ amount, phoneNumber: mpesaPhone });
      setWithdrawAmount('');
      setToast({ type: 'success', message: `Withdrawal request submitted` });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Withdrawal failed' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositPhone.match(/^(07|01|\+254)\d{8,9}$/)) {
      setToast({ type: 'error', message: 'Enter a valid M-Pesa number.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setToast({ type: 'error', message: 'Enter a valid deposit amount.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setIsDepositing(true);
    try {
      await walletAPI.depositMpesa(amount, depositPhone);
      setDepositAmount('');
      setToast({ type: 'success', message: `Deposit request submitted` });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Deposit failed' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleRefresh = () => {
    setToast({ type: 'success', message: 'Wallet refreshed.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    setToast({ type: 'success', message: 'Statement exported.' });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 border-b border-border pb-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Wallet</h1>
          </div>
          <p className="text-sm text-ink-secondary">Manage your balance, withdraw earnings, and view transactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} icon={RefreshCcw}>
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} icon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="bg-brand-900 text-white border-none">
          <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Available balance</p>
          <p className="text-2xl font-mono font-bold mt-1">{formatCurrency(wallet.available)}</p>
          <Badge variant="success" className="mt-3 bg-white/20 text-white">
            <ShieldCheck className="w-3 h-3 mr-1" /> Ready for payout
          </Badge>
        </Card>
        <Card>
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Pending clearance</p>
          <p className="text-2xl font-mono font-bold text-brand-900 mt-1">{formatCurrency(wallet.pending)}</p>
          <div className="flex items-center gap-1 mt-3 text-xs text-warn">
            <Clock className="w-3 h-3" /> Clears in 3 days
          </div>
        </Card>
        <Card>
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Escrow balance</p>
          <p className="text-2xl font-mono font-bold text-brand-900 mt-1">{formatCurrency(wallet.escrow)}</p>
          <div className="flex items-center gap-1 mt-3 text-xs text-accent">
            <ShieldCheck className="w-3 h-3" /> Milestone locked
          </div>
        </Card>
        <Card>
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Monthly earnings</p>
          <p className="text-2xl font-mono font-bold text-accent mt-1">{formatCurrency(wallet.monthly)}</p>
          <div className="flex items-center gap-1 mt-3 text-xs text-accent">
            <ArrowUpRight className="w-3 h-3" /> +15.8% vs last month
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {['Overview', 'Transactions', 'Payment Setup'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-brand-900 text-white'
                  : 'text-ink-secondary hover:bg-surface-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'Overview' && (
            <>
              {/* Chart placeholder - simple bar chart */}
              <Card>
                <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-semibold text-brand-900">Recent activity</h3>
                    <p className="text-xs text-ink-tertiary">Last 7 days</p>
                  </div>
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[45, 62, 38, 71, 55, 84, 92].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-accent-light rounded-t"
                        style={{ height: `${(val / 100) * 80}px` }}
                      />
                      <span className="text-[10px] text-ink-tertiary">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent transactions */}
              <Card>
                <h3 className="font-display font-semibold text-brand-900 border-b border-border pb-3 mb-4">
                  Recent transactions
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(tx => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-surface-soft rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-accent-light text-accent-dark' : 'bg-danger-light text-danger'}`}>
                          {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-primary">{tx.description}</p>
                          <p className="text-xs text-ink-tertiary">{formatDate(tx.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-semibold ${tx.amount > 0 ? 'text-accent' : 'text-danger'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === 'Transactions' && (
            <Card>
              <h3 className="font-display font-semibold text-brand-900 border-b border-border pb-3 mb-4">
                All transactions
              </h3>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-ink-secondary py-8">No transactions yet.</p>
                ) : (
                  transactions.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-surface-soft rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-ink-primary">{tx.description}</p>
                        <p className="text-xs text-ink-tertiary">{formatDate(tx.createdAt)} • {tx.type}</p>
                      </div>
                      <span className={`font-mono font-semibold ${tx.amount > 0 ? 'text-accent' : 'text-danger'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {activeTab === 'Payment Setup' && (
            <Card>
              <h3 className="font-display font-semibold text-brand-900 border-b border-border pb-3 mb-4">
                M-Pesa setup
              </h3>
              {mpesaStatus === 'Active' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-accent-light rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-accent-dark" />
                    <span className="text-sm font-medium text-accent-dark">Verified active</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-ink-tertiary">Name:</span> {mpesaName}</p>
                    <p><span className="text-ink-tertiary">Phone:</span> {mpesaPhone}</p>
                  </div>
                  <Button variant="danger" onClick={() => setMpesaStatus('Not setup')}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!otpSent ? (
                    <>
                      <Input
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="0712345678"
                        type="tel"
                      />
                      <Button variant="success" onClick={handleSendOTP}>
                        Verify phone number
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        value={mpesaOtp}
                        onChange={(e) => setMpesaOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                      <Button variant="primary" onClick={handleVerifyOTP}>
                        Verify OTP
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Withdraw & Deposit Widgets (shown on all tabs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <h3 className="font-display font-semibold text-brand-900 flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-accent" />
            Withdraw to M-Pesa
          </h3>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount (KES)"
              required
            />
            <Button type="submit" variant="success" disabled={isWithdrawing} className="w-full">
              {isWithdrawing && <Loader2 className="w-4 h-4 animate-spin" />}
              Withdraw
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-brand-900 flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-accent" />
            Deposit via M-Pesa
          </h3>
          <form onSubmit={handleDeposit} className="space-y-4">
            <Input
              type="tel"
              value={depositPhone}
              onChange={(e) => setDepositPhone(e.target.value)}
              placeholder="M-Pesa number"
              required
            />
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount (KES)"
              required
            />
            <Button type="submit" variant="success" disabled={isDepositing} className="w-full">
              {isDepositing && <Loader2 className="w-4 h-4 animate-spin" />}
              Deposit
            </Button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
}
