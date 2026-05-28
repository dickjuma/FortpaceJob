import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  XCircle,
  RefreshCw,
  Info,
  TrendingUp,
  DollarSign,
  Lock,
  Send,
  ArrowUpDown,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

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
    color: "blue",
    accountLabel: "PayPal Email",
    placeholder: "you@email.com",
    gradient: "from-blue-500 to-blue-700",
    bgLight: "bg-brand-50",
    bgDark: "dark:bg-brand-900/20",
    border: "border-brand-300 dark:border-brand-600",
    text: "text-brand-700 dark:text-brand-300",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    emoji: "🏦",
    time: "3–5 business days",
    feePercent: 1.0,
    color: "gray",
    accountLabel: "Account Number",
    placeholder: "IBAN / Account No.",
    gradient: "from-gray-500 to-gray-700",
    bgLight: "bg-surface",
    bgDark: "dark:bg-gray-800",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-300",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    emoji: "📱",
    time: "Instant",
    feePercent: 1.5,
    color: "green",
    accountLabel: "Phone Number",
    placeholder: "+254 7XX XXX XXX",
    gradient: "from-green-500 to-green-700",
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-900/20",
    border: "border-green-300 dark:border-green-600",
    text: "text-green-700 dark:text-green-300",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    emoji: "💳",
    time: "1–3 business days",
    feePercent: 2.0,
    color: "orange",
    accountLabel: "Payoneer Account ID",
    placeholder: "Account ID",
    gradient: "from-orange-500 to-orange-700",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-900/20",
    border: "border-orange-300 dark:border-orange-600",
    text: "text-orange-700 dark:text-orange-300",
  },
  {
    id: "crypto",
    name: "Crypto Wallet",
    emoji: "₿",
    time: "10–30 minutes",
    feePercent: 0.5,
    color: "purple",
    accountLabel: "Wallet Address",
    placeholder: "0x… or bc1…",
    gradient: "from-purple-500 to-purple-700",
    bgLight: "bg-brand-50",
    bgDark: "dark:bg-brand-900/20",
    border: "border-purple-300 dark:border-purple-600",
    text: "text-brand-700 dark:text-brand-300",
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "t1",
    date: "2024-04-18",
    method: "PayPal",
    amount: 500,
    fee: 12.5,
    status: "Completed",
  },
  {
    id: "t2",
    date: "2024-04-12",
    method: "Bank Transfer",
    amount: 1200,
    fee: 12.0,
    status: "Completed",
  },
  {
    id: "t3",
    date: "2024-04-08",
    method: "M-Pesa",
    amount: 300,
    fee: 4.5,
    status: "Pending",
  },
  {
    id: "t4",
    date: "2024-04-01",
    method: "Payoneer",
    amount: 750,
    fee: 15.0,
    status: "Completed",
  },
  {
    id: "t5",
    date: "2024-03-25",
    method: "Crypto Wallet",
    amount: 2000,
    fee: 10.0,
    status: "Completed",
  },
  {
    id: "t6",
    date: "2024-03-18",
    method: "PayPal",
    amount: 450,
    fee: 11.25,
    status: "Failed",
  },
  {
    id: "t7",
    date: "2024-03-10",
    method: "Bank Transfer",
    amount: 1800,
    fee: 18.0,
    status: "Completed",
  },
  {
    id: "t8",
    date: "2024-03-02",
    method: "M-Pesa",
    amount: 200,
    fee: 3.0,
    status: "Completed",
  },
];

const AVAILABLE_BALANCE = 12840.5;
const PENDING_BALANCE = 1200;
const TOTAL_EARNED = 48320;
const DAILY_LIMIT = 5000;
const MONTHLY_LIMIT = 20000;
const REMAINING_TODAY = 4800;
const MONTHLY_USED = 8320;

// ─── Animated Counter ─────────────────────────────────────────────────────────

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
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return (
    <div
      className={`rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse ${className}`}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-10 w-64" />
      <SkeletonBlock className="h-5 w-80" />
      <SkeletonBlock className="h-44 w-full rounded-2xl" />
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="h-28 flex-1 rounded-xl" />
        ))}
      </div>
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
    </div>
  );
}

// ─── OTP Modal ────────────────────────────────────────────────────────────────

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 w-full max-w-sm"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-2xl mb-4">
            <Lock size={24} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Verify Withdrawal
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        {/* OTP inputs */}
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
              className={`w-11 h-12 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-colors
                ${
                  error
                    ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                    : digit
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                    : "border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white"
                }
                focus:border-brand-500 dark:focus:border-brand-400`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 mb-3">{error}</p>
        )}
        {resent && (
          <p className="text-center text-sm text-success mb-3">
            Code resent!
          </p>
        )}

        <button
          onClick={handleVerify}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <CheckCircle size={16} /> Verify & Withdraw
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {countdown > 0 ? (
            <>
              Resend code in{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                0:{String(countdown).padStart(2, "0")}
              </span>
            </>
          ) : (
            <button
              onClick={handleResend}
              className="text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw size={12} /> Resend code
            </button>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Success Toast ────────────────────────────────────────────────────────────

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
      className="fixed top-4 right-4 z-50 bg-success text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
    >
      <CheckCircle size={18} />
      <span className="font-medium">
        Withdrawal of {symbol}{amount} initiated!
      </span>
      <button onClick={onDismiss}>
        <X size={15} />
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WithdrawalPage() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(METHODS[0]);
  const [amount, setAmount] = useState("");
  const [accountDetail, setAccountDetail] = useState("");
  const [amountError, setAmountError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const ROWS_PER_PAGE = 3;
  const currencyMenuRef = useRef(null);

  // Skeleton delay
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Close currency menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target)) {
        setShowCurrencyMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Animated numbers
  const animBalance = useAnimatedNumber(AVAILABLE_BALANCE * currency.rate);
  const animPending = useAnimatedNumber(PENDING_BALANCE * currency.rate);
  const animTotal = useAnimatedNumber(TOTAL_EARNED * currency.rate);

  const feePercent = selectedMethod.feePercent;
  const parsedAmount = parseFloat(amount) || 0;
  const fee = (parsedAmount * feePercent) / 100;
  const receives = parsedAmount - fee;
  const maxAmount = AVAILABLE_BALANCE * currency.rate;
  const minAmount = 10 * currency.rate;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    validateAmount(amount);
    if (amountError || !parsedAmount) return;
    setShowOTP(true);
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    setShowSuccess(true);
    setAmount("");
    setAccountDetail("");
  };

  // Sorting
  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const sortedTx = [...MOCK_TRANSACTIONS].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (sortCol === "date") { va = new Date(va); vb = new Date(vb); }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTx.length / ROWS_PER_PAGE);
  const pagedTx = sortedTx.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const SortIcon = ({ col }) => (
    <span className="ml-1 opacity-60">
      {sortCol === col ? (
        sortDir === "asc" ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />
      ) : (
        <ArrowUpDown size={11} className="inline opacity-40" />
      )}
    </span>
  );

  const StatusBadge = ({ status }) => {
    if (status === "Completed")
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-success font-medium">
          <CheckCircle size={11} /> Completed
        </span>
      );
    if (status === "Pending")
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
          <Clock size={11} /> Pending
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
        <XCircle size={11} /> Failed
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <SkeletonPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-brand-600 rounded-xl">
                <Wallet size={20} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Withdraw Earnings
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">
              Transfer your earnings to your preferred payment method
            </p>
          </div>

          {/* Currency Selector */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onClick={() => setShowCurrencyMenu((o) => !o)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              {currency.code}
              <ChevronDown
                size={14}
                className={`transition-transform ${showCurrencyMenu ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showCurrencyMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg z-50 py-1 overflow-hidden"
                >
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c); setShowCurrencyMenu(false); setAmount(""); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        currency.code === c.code
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800"
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-gray-400 text-xs">{c.symbol}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Wallet Balance Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-blue-600 to-violet-700 text-white p-6 sm:p-8 shadow-xl"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -tranzinc-y-1/2 tranzinc-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full tranzinc-y-1/2 -tranzinc-x-1/4 pointer-events-none" />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Available */}
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">
                Available Balance
              </p>
              <p className="text-4xl font-extrabold tracking-tight">
                {currency.symbol}
                {animBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-white/60 text-xs mt-1">Ready to withdraw</p>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-6 pt-4 sm:pt-0">
              <p className="text-white/70 text-sm font-medium mb-1">
                Pending Balance
              </p>
              <p className="text-2xl font-bold">
                {currency.symbol}
                {animPending.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-white/60 text-xs mt-1">Clears in 3–5 days</p>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-6 pt-4 sm:pt-0">
              <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-1">
                <TrendingUp size={13} /> Total Earned
              </p>
              <p className="text-2xl font-bold">
                {currency.symbol}
                {animTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-white/60 text-xs mt-1">All time</p>
            </div>
          </div>
        </motion.div>

        {/* ── Method Selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Withdrawal Method
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {METHODS.map((method) => {
              const active = selectedMethod.id === method.id;
              return (
                <motion.button
                  key={method.id}
                  onClick={() => { setSelectedMethod(method); setAccountDetail(""); }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`shrink-0 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 transition-all w-28 ${
                    active
                      ? `${method.bgLight} ${method.bgDark} ${method.border} shadow-md`
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="text-2xl">{method.emoji}</span>
                  <span
                    className={`text-xs font-semibold text-center leading-tight ${
                      active
                        ? method.text
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {method.name}
                  </span>
                  <span
                    className={`text-xs ${
                      active
                        ? method.text + " opacity-80"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {method.feePercent}% fee
                  </span>
                  {active && (
                    <motion.div
                      layoutId="method-indicator"
                      className="w-4 h-1 rounded-full bg-current opacity-60"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={12} />
            <span>
              Estimated arrival:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {selectedMethod.time}
              </span>
            </span>
          </div>
        </motion.div>

        {/* ── Withdrawal Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
            Withdrawal Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-gray-500 dark:text-gray-400 font-semibold text-base">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={`Min ${currency.symbol}${(10 * currency.rate).toFixed(2)}`}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border text-base font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors text-gray-900 dark:text-white bg-surface dark:bg-gray-800 ${
                    amountError
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {parsedAmount > 0 && !amountError && (
                  <button
                    type="button"
                    onClick={() => handleAmountChange(maxAmount.toFixed(2))}
                    className="absolute right-3 top-1/2 -tranzinc-y-1/2 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    MAX
                  </button>
                )}
              </div>
              {amountError && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={11} /> {amountError}
                </p>
              )}
              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {[100, 500, 1000, 5000].map((q) => {
                  const adj = (q * currency.rate).toFixed(0);
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleAmountChange(adj)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {currency.symbol}{adj}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {selectedMethod.accountLabel}
              </label>
              <input
                type="text"
                value={accountDetail}
                onChange={(e) => setAccountDetail(e.target.value)}
                placeholder={selectedMethod.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Fee calculator */}
            <AnimatePresence>
              {parsedAmount > 0 && !amountError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Withdrawal amount</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currency.symbol}{parsedAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>
                        Fee ({feePercent}% · {selectedMethod.name})
                      </span>
                      <span className="text-red-500 font-medium">
                        −{currency.symbol}{fee.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold text-gray-900 dark:text-white">
                      <span>You receive</span>
                      <span className="text-success dark:text-success text-base">
                        {currency.symbol}{receives.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 pt-1">
                      <Clock size={11} />
                      Estimated arrival: {selectedMethod.time}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={!!amountError || !parsedAmount}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} /> Withdraw {parsedAmount > 0 ? `${currency.symbol}${parsedAmount.toFixed(2)}` : ""}
            </button>
          </form>
        </motion.div>

        {/* ── Withdrawal Limits ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield size={16} className="text-brand-600" /> Withdrawal Limits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Daily */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500 dark:text-gray-400">Daily Limit</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currency.symbol}{(REMAINING_TODAY * currency.rate).toFixed(0)} left
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((DAILY_LIMIT - REMAINING_TODAY) / DAILY_LIMIT) * 100}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-brand-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>Used: {currency.symbol}{((DAILY_LIMIT - REMAINING_TODAY) * currency.rate).toFixed(0)}</span>
                <span>Max: {currency.symbol}{(DAILY_LIMIT * currency.rate).toFixed(0)}</span>
              </div>
            </div>

            {/* Monthly */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500 dark:text-gray-400">Monthly Limit</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currency.symbol}{((MONTHLY_LIMIT - MONTHLY_USED) * currency.rate).toFixed(0)} left
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(MONTHLY_USED / MONTHLY_LIMIT) * 100}%` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                  className="h-full bg-violet-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>Used: {currency.symbol}{(MONTHLY_USED * currency.rate).toFixed(0)}</span>
                <span>Max: {currency.symbol}{(MONTHLY_LIMIT * currency.rate).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Transaction History ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface dark:bg-gray-800/50">
                <tr>
                  {[
                    { col: "date", label: "Date" },
                    { col: "method", label: "Method" },
                    { col: "amount", label: "Amount" },
                    { col: "fee", label: "Fee" },
                    { col: null, label: "Net Amount" },
                    { col: "status", label: "Status" },
                  ].map(({ col, label }) => (
                    <th
                      key={label}
                      onClick={() => col && handleSort(col)}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                        col ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" : ""
                      }`}
                    >
                      {label}
                      {col && <SortIcon col={col} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                <AnimatePresence initial={false}>
                  {pagedTx.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-surface dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {tx.method}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {currency.symbol}{(tx.amount * currency.rate).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-red-500 whitespace-nowrap">
                        −{currency.symbol}{(tx.fee * currency.rate).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-success dark:text-success whitespace-nowrap">
                        {currency.symbol}{((tx.amount - tx.fee) * currency.rate).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={tx.status} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages} · {MOCK_TRANSACTIONS.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-surface dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-brand-600 text-white"
                      : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-surface dark:hover:bg-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-surface dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Security Notices ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap gap-3 pb-4"
        >
          {[
            { icon: Shield, text: "256-bit SSL encrypted transactions" },
            { icon: Lock, text: "OTP verification required for every withdrawal" },
            { icon: Info, text: "Withdrawals reviewed within 24 hours for security" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400 shadow-sm"
            >
              <Icon size={13} className="text-brand-500 shrink-0" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── OTP Modal ── */}
      <AnimatePresence>
        {showOTP && (
          <OTPModal
            onClose={() => setShowOTP(false)}
            onSuccess={handleOTPSuccess}
          />
        )}
      </AnimatePresence>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessToast
            amount={parsedAmount > 0 ? parsedAmount.toFixed(2) : "0.00"}
            symbol={currency.symbol}
            onDismiss={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
