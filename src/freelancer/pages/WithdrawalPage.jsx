// src/pages/freelancer/WithdrawalPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowDownToLine,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info,
  TrendingUp,
  Lock,
  Send,
  ArrowUpDown,
} from 'lucide-react';
import { useFreelancerWallet, useFreelancerTransactions, useInitiateWithdrawal, useFreelancerProfile } from '../services/freelancerHooks';
import { useAuthStore } from '../../platform/common/authStore';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button', icon: Icon }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
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

const Input = ({ value, onChange, placeholder, type = 'text', required, className = '', icon: Icon, error }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full h-10 border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? 'pl-9' : ''} ${error ? 'border-danger' : 'border-border'} ${className}`}
    />
  </div>
);

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md z-50 max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-bold text-brand-900">{title}</h3>
              <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ---------- Helpers ----------
const formatCurrency = (amount, symbol = '$') => {
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ---------- Animated Counter ----------
function useAnimatedNumber(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ---------- Configuration ----------
const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "KES", symbol: "KSh", rate: 129.5 },
];

const METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    emoji: "🅿️",
    time: "1–2 business days",
    feePercent: 2.5,
    accountLabel: "PayPal Email",
    placeholder: "you@email.com",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    emoji: "🏦",
    time: "3–5 business days",
    feePercent: 1.0,
    accountLabel: "Account Number",
    placeholder: "IBAN / Account No.",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    emoji: "📱",
    time: "Instant",
    feePercent: 1.5,
    accountLabel: "Phone Number",
    placeholder: "+254 7XX XXX XXX",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    emoji: "💳",
    time: "1–3 business days",
    feePercent: 2.0,
    accountLabel: "Payoneer Account ID",
    placeholder: "Account ID",
  },
  {
    id: "crypto",
    name: "Crypto Wallet",
    emoji: "₿",
    time: "10–30 minutes",
    feePercent: 0.5,
    accountLabel: "Wallet Address",
    placeholder: "0x… or bc1…",
  },
];

const DEFAULT_METHOD = METHODS.find(m => m.id === 'mpesa') || METHODS[2];

// ---------- OTP Modal ----------
function OTPModal({ onClose, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(59);
  const [resent, setResent] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code === "123456") {
      onSuccess();
    } else {
      setError("Invalid code. Hint: use 123456");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(59);
    setResent(true);
    setError("");
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Verify withdrawal">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-light rounded-xl mb-3">
          <Lock className="w-6 h-6 text-accent-dark" />
        </div>
        <p className="text-sm text-ink-secondary mb-4">Enter the 6-digit code sent to your phone</p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
            className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-colors ${
              error
                ? "border-danger bg-danger-light"
                : digit
                ? "border-accent bg-accent-light text-accent-dark"
                : "border-border bg-white text-ink-primary"
            } focus:border-accent`}
          />
        ))}
      </div>

      {error && <p className="text-center text-sm text-danger mb-3">{error}</p>}
      {resent && <p className="text-center text-sm text-accent mb-3">Code resent!</p>}

      <Button variant="success" onClick={handleVerify} className="w-full mb-4">
        <CheckCircle className="w-4 h-4" /> Verify & withdraw
      </Button>

      <p className="text-center text-sm text-ink-secondary">
        {countdown > 0 ? (
          <>Resend code in 0:{String(countdown).padStart(2, "0")}</>
        ) : (
          <button onClick={handleResend} className="text-accent hover:underline inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Resend code
          </button>
        )}
      </p>
    </Modal>
  );
}

// ---------- Success Toast ----------
function SuccessToast({ amount, symbol, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      className="fixed top-4 right-4 z-50 bg-accent text-white px-4 py-3 rounded-lg shadow-md flex items-center gap-3"
    >
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">Withdrawal of {symbol}{amount} initiated!</span>
      <button onClick={onDismiss} className="text-white/80 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ---------- Confirm Dialog (inline) ----------
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-ink-secondary mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm}>Continue</Button>
      </div>
    </Modal>
  );
}

// ---------- Skeleton ----------
function SkeletonBlock({ className }) {
  return <div className={`rounded-xl bg-surface-muted animate-pulse ${className}`} />;
}

function SkeletonPage() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-10 w-64" />
      <SkeletonBlock className="h-5 w-80" />
      <SkeletonBlock className="h-44 w-full rounded-2xl" />
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} className="h-28 flex-1 rounded-xl" />)}
      </div>
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
    </div>
  );
}

// ---------- Main Component ----------
export default function WithdrawalPage() {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(DEFAULT_METHOD);
  const [amount, setAmount] = useState("");
  const [accountDetail, setAccountDetail] = useState("");
  const [amountError, setAmountError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const ROWS_PER_PAGE = 3;
  const currencyMenuRef = useRef(null);

  const { data: profileData } = useFreelancerProfile();
  const { data: walletData, isLoading: walletLoading } = useFreelancerWallet();
  const { data: txPagedData, isLoading: txLoading } = useFreelancerTransactions({ page, limit: 10 });
  const withdrawMutation = useInitiateWithdrawal();
  const loading = walletLoading || txLoading;

  const availableBalance = walletData?.withdrawableBalance ?? walletData?.availableBalance ?? walletData?.available ?? 0;
  const pendingBalance = walletData?.pendingBalance ?? walletData?.pending ?? 0;
  const totalEarned = walletData?.totalEarnings ?? availableBalance;

  const maxAmount = availableBalance * currency.rate;
  const minAmount = 10 * currency.rate;

  useEffect(() => {
    const handler = () => setShowCurrencyMenu(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (selectedMethod.id === 'mpesa' && profileData?.phoneNumber && !accountDetail) {
      setAccountDetail(profileData.phoneNumber);
    }
  }, [selectedMethod, profileData, accountDetail]);

  const animBalance = useAnimatedNumber(maxAmount);
  const animPending = useAnimatedNumber(pendingBalance * currency.rate);
  const animTotal = useAnimatedNumber(totalEarned * currency.rate);

  const feePercent = selectedMethod.feePercent;
  const parsedAmount = parseFloat(amount) || 0;
  const fee = (parsedAmount * feePercent) / 100;
  const receives = parsedAmount - fee;

  const validateAmount = (val) => {
    const n = parseFloat(val);
    if (!val) { setAmountError(""); return; }
    if (isNaN(n) || n < minAmount)
      setAmountError(`Minimum withdrawal is ${currency.symbol}${minAmount.toFixed(2)}`);
    else if (n > maxAmount)
      setAmountError(`Exceeds available balance (${currency.symbol}${maxAmount.toFixed(2)})`);
    else setAmountError("");
  };

  const handleAmountChange = (val) => {
    setAmount(val);
    validateAmount(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateAmount(amount);
    if (amountError || !parsedAmount) return;

    if (selectedMethod.id !== 'mpesa') {
      // In real app, other methods could be implemented
      alert("Only M-Pesa is supported in this demo.");
      return;
    }

    if (!accountDetail.trim()) {
      setAmountError("Phone number is required.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmWithdrawal = () => {
    setShowConfirm(false);
    setShowOTP(true);
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    withdrawMutation.mutate({
      amount: parsedAmount,
      phoneNumber: accountDetail,
      method: 'paystack',
      bankCode: 'MPESA',
      recipientType: 'mobile_money',
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        setAmount("");
        setPage(1);
      },
      onError: (err) => {
        alert(err.message || 'Payout failed.');
      }
    });
  };

  // Transaction sorting & pagination
  const rawTxList = txPagedData?.items ?? txPagedData?.transactions ?? txPagedData?.data ?? txPagedData ?? [];
  const mappedTransactions = rawTxList.map(tx => ({
    id: tx.id || String(Math.random()),
    date: tx.createdAt || tx.timestamp || new Date(),
    method: tx.method || tx.description || 'M-Pesa Payout',
    amount: Math.abs(tx.amount || 0),
    fee: tx.fee || 0,
    status: tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'Completed' : tx.status === 'PENDING' ? 'Pending' : 'Failed'
  }));

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const sortedTx = [...mappedTransactions].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (sortCol === "date") { va = new Date(va); vb = new Date(vb); }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTx.length / ROWS_PER_PAGE);
  const pagedTx = sortedTx.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const dailyLimit = walletData?.dailyLimit || 5000;
  const monthlyLimit = walletData?.monthlyLimit || 20000;
  const dailyUsed = walletData?.dailyUsed ?? 0;
  const monthlyUsed = walletData?.monthlyUsed ?? 0;

  if (loading) return <SkeletonPage />;

  return (
    <div className="min-h-screen bg-surface-soft">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-accent rounded-xl">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-900">Withdraw earnings</h1>
            </div>
            <p className="text-ink-secondary ml-14">Transfer your earnings to your preferred payment method</p>
          </div>

          {/* Currency selector */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onClick={() => setShowCurrencyMenu(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-ink-primary hover:bg-surface-muted transition-colors shadow-sm"
            >
              {currency.code}
              <ChevronDown size={14} className={`transition-transform ${showCurrencyMenu ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showCurrencyMenu && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-border shadow-lg z-10 py-1">
                  {CURRENCIES.map(c => (
                    <button key={c.code} onClick={() => { setCurrency(c); setShowCurrencyMenu(false); setAmount(""); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex justify-between items-center ${currency.code === c.code ? "bg-accent-light text-accent-dark font-semibold" : "text-ink-secondary hover:bg-surface-muted"}`}>
                      <span>{c.code}</span>
                      <span className="text-ink-tertiary text-xs">{c.symbol}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
          className="relative overflow-hidden rounded-2xl bg-brand-900 text-white p-6 sm:p-8 shadow-xl">
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Available balance</p>
              <p className="text-4xl font-mono font-bold tracking-tight">
                {currency.symbol}{animBalance.toFixed(2)}
              </p>
              <p className="text-white/60 text-xs mt-1">Ready to withdraw</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-6 pt-4 sm:pt-0">
              <p className="text-white/70 text-sm font-medium mb-1">Pending balance</p>
              <p className="text-2xl font-mono font-bold">{currency.symbol}{animPending.toFixed(2)}</p>
              <p className="text-white/60 text-xs mt-1">Clears in 3–5 days</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-6 pt-4 sm:pt-0">
              <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-1"><TrendingUp size={13} /> Total earned</p>
              <p className="text-2xl font-mono font-bold">{currency.symbol}{animTotal.toFixed(0)}</p>
              <p className="text-white/60 text-xs mt-1">All time</p>
            </div>
          </div>
        </motion.div>

        {/* Method Selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <h2 className="text-base font-display font-semibold text-brand-900 mb-3">Withdrawal method</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {METHODS.map(method => {
              const active = selectedMethod.id === method.id;
              return (
                <motion.button key={method.id} onClick={() => { setSelectedMethod(method); setAccountDetail(""); }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`shrink-0 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 transition-all w-28 ${active ? "border-accent bg-accent-light shadow-sm" : "border-border bg-white hover:border-border-strong"}`}>
                  <span className="text-2xl">{method.emoji}</span>
                  <span className={`text-xs font-semibold text-center ${active ? "text-accent-dark" : "text-ink-secondary"}`}>{method.name}</span>
                  <span className={`text-xs ${active ? "text-accent-dark" : "text-ink-tertiary"}`}>{method.feePercent}% fee</span>
                  {active && <motion.div layoutId="method-indicator" className="w-4 h-1 rounded-full bg-accent mt-1" />}
                </motion.button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-ink-secondary">
            <Clock size={12} /> Estimated arrival: <span className="font-medium text-ink-primary">{selectedMethod.time}</span>
          </div>
        </motion.div>

        {/* Withdrawal Form */}
        <Card>
          <h2 className="text-base font-display font-semibold text-brand-900 mb-5">Withdrawal details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-primary mb-1.5">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary font-semibold">{currency.symbol}</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={`Min ${currency.symbol}${minAmount.toFixed(2)}`}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border text-base font-semibold focus:outline-none focus:ring-2 focus:ring-brand-900 bg-white ${amountError ? "border-danger" : "border-border"}`}
                />
                {parsedAmount > 0 && !amountError && (
                  <button type="button" onClick={() => handleAmountChange(maxAmount.toFixed(2))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-accent font-semibold hover:underline">
                    MAX
                  </button>
                )}
              </div>
              {amountError && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle size={11} /> {amountError}</p>}
              <div className="flex gap-2 mt-2">
                {[100, 500, 1000, 5000].map(q => {
                  const adj = (q * currency.rate).toFixed(0);
                  return (
                    <button key={q} type="button" onClick={() => handleAmountChange(adj)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-border text-ink-secondary hover:border-accent/50 hover:text-accent transition-colors">
                      {currency.symbol}{adj}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-primary mb-1.5">{selectedMethod.accountLabel}</label>
              <Input value={accountDetail} onChange={(e) => setAccountDetail(e.target.value)} placeholder={selectedMethod.placeholder} />
            </div>

            <AnimatePresence>
              {parsedAmount > 0 && !amountError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-surface-soft rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-ink-secondary">
                      <span>Withdrawal amount</span>
                      <span className="font-medium text-ink-primary">{currency.symbol}{parsedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ink-secondary">
                      <span>Fee ({feePercent}% · {selectedMethod.name})</span>
                      <span className="text-danger">−{currency.symbol}{fee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold text-ink-primary">
                      <span>You receive</span>
                      <span className="text-accent text-base">{currency.symbol}{receives.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink-tertiary pt-1">
                      <Clock size={11} /> Estimated arrival: {selectedMethod.time}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" variant="success" disabled={!!amountError || !parsedAmount || withdrawMutation.isPending} className="w-full">
              <Send size={16} /> {withdrawMutation.isPending ? 'Processing...' : parsedAmount > 0 ? `Withdraw ${currency.symbol}${parsedAmount.toFixed(2)}` : "Withdraw"}
            </Button>
          </form>
        </Card>

        {/* Limits */}
        <Card>
          <h2 className="text-base font-display font-semibold text-brand-900 mb-4 flex items-center gap-2"><Shield size={16} className="text-accent" /> Withdrawal limits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-secondary">Daily limit</span>
                <span className="font-semibold text-ink-primary">{currency.symbol}{(dailyLimit - dailyUsed).toFixed(0)} left</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(dailyUsed / dailyLimit) * 100}%` }} transition={{ duration: 0.9 }} className="h-full bg-accent rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-ink-tertiary mt-1">
                <span>Used: {currency.symbol}{dailyUsed.toFixed(0)}</span>
                <span>Max: {currency.symbol}{dailyLimit}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-secondary">Monthly limit</span>
                <span className="font-semibold text-ink-primary">{currency.symbol}{(monthlyLimit - monthlyUsed).toFixed(0)} left</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(monthlyUsed / monthlyLimit) * 100}%` }} transition={{ duration: 0.9, delay: 0.15 }} className="h-full bg-accent rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-ink-tertiary mt-1">
                <span>Used: {currency.symbol}{monthlyUsed.toFixed(0)}</span>
                <span>Max: {currency.symbol}{monthlyLimit}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-base font-display font-semibold text-brand-900">Transaction history</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr>
                  {[
                    { col: "date", label: "Date" },
                    { col: "method", label: "Method" },
                    { col: "amount", label: "Amount" },
                    { col: "fee", label: "Fee" },
                    { col: null, label: "Net amount" },
                    { col: "status", label: "Status" },
                  ].map(({ col, label }) => (
                    <th key={label} onClick={() => col && handleSort(col)}
                      className={`px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide ${col ? "cursor-pointer hover:text-ink-primary" : ""}`}>
                      {label}
                      {col && (
                        <span className="ml-1">
                          {sortCol === col ? (sortDir === "asc" ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />) : <ArrowUpDown size={11} className="inline opacity-40" />}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedTx.map(tx => (
                  <tr key={tx.id} className="hover:bg-surface-soft transition-colors">
                    <td className="px-4 py-3.5 text-sm text-ink-secondary whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-ink-primary">{tx.method}</td>
                    <td className="px-4 py-3.5 text-sm font-mono font-semibold text-ink-primary whitespace-nowrap">
                      {currency.symbol}{(tx.amount * currency.rate).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-danger whitespace-nowrap">
                      −{currency.symbol}{(tx.fee * currency.rate).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-mono font-semibold text-accent whitespace-nowrap">
                      {currency.symbol}{((tx.amount - tx.fee) * currency.rate).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {pagedTx.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-ink-secondary">No transactions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-ink-secondary">Page {page} of {totalPages} · {sortedTx.length} transactions</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-border text-ink-secondary hover:bg-surface-muted disabled:opacity-40 transition-colors">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-brand-900 text-white" : "border border-border text-ink-secondary hover:bg-surface-muted"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-border text-ink-secondary hover:bg-surface-muted disabled:opacity-40 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Security notices */}
        <div className="flex flex-wrap gap-3 pb-4">
          {[
            { icon: Shield, text: "256-bit SSL encrypted transactions" },
            { icon: Lock, text: "OTP verification required for every withdrawal" },
            { icon: Info, text: "Withdrawals reviewed within 24 hours for security" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full text-xs text-ink-secondary shadow-sm">
              <Icon size={13} className="text-accent shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleConfirmWithdrawal}
        title="Confirm withdrawal" message={`Withdraw ${currency.symbol}${parsedAmount.toFixed(2)} to ${accountDetail}? A fee of ${feePercent}% applies (you receive ${currency.symbol}${receives.toFixed(2)}).`} />

      <AnimatePresence>
        {showOTP && <OTPModal onClose={() => setShowOTP(false)} onSuccess={handleOTPSuccess} />}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && <SuccessToast amount={parsedAmount > 0 ? parsedAmount.toFixed(2) : "0.00"} symbol={currency.symbol} onDismiss={() => setShowSuccess(false)} />}
      </AnimatePresence>
    </div>
  );
}
