// src/pages/admin/AdminLogin.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

// ---------- Shared UI Components (inline) ----------
type ButtonType = "button" | "submit" | "reset";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
};

const Button = ({ children, variant = "primary", disabled = false, className = "", onClick, type = "button" }: ButtonProps) => {
  const base =
    "px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40",
    ghost: "border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40",
    danger: "bg-danger text-white hover:bg-red-700 disabled:opacity-40",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  icon?: React.ElementType;
  required?: boolean;
  error?: string;
};

const Card = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, required, error }: InputProps) => (
  <div className="mb-4">
    {label && (
      <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-ink-tertiary" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full h-10 border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? "pl-9" : ""} ${
          error ? "border-danger" : "border-border"
        }`}
      />
    </div>
    {error && <p className="text-danger text-xs mt-1">{error}</p>}
  </div>
);

// ---------- OTP Input Component ----------
const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const allFilled = newOtp.every((digit) => digit !== "");
    if (allFilled) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          autoFocus={idx === 0}
          className="w-12 h-12 text-center text-xl font-mono font-bold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
        />
      ))}
    </div>
  );
};

// ---------- Toast Notification ----------
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
        type === "success" ? "bg-accent text-white" : "bg-danger text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
};

// ---------- Main Component ----------
export default function AdminLogin() {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: "error", message: "Please enter both email and password." });
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setToast({ type: "success", message: "OTP sent to your email (use 123456)." });
    }, 1500);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setToast({ type: "error", message: "Please enter the 6-digit code." });
      return;
    }
    // Demo: accept "123456" as valid
    if (otpCode !== "123456") {
      setToast({ type: "error", message: "Invalid OTP. Hint: use 123456" });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setToast({ type: "error", message: err.message || "Authentication failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = (code) => {
    setOtpCode(code);
  };

  const clearToast = () => setToast(null);

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
      </AnimatePresence>

      {/* Background decoration - subtle without gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-surface border-border shadow-xl p-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-accent-light p-3 rounded-2xl mb-4">
              <ShieldCheck className="text-accent-dark w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-bold text-brand-900 tracking-tight">Forte Control Center</h1>
            <p className="text-ink-tertiary text-xs mt-2 font-medium uppercase tracking-wider">Authorized Personnel Only</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <form onSubmit={handleLogin} className="space-y-5">
                  <Input
                    label="Admin Email"
                    type="email"
                    placeholder="admin@fortemarket.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Continue to 2FA <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-2 text-danger bg-danger-light p-3 rounded-xl">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <p className="text-[10px] font-medium uppercase tracking-tight">
                      Your IP address is being logged for security compliance.
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-display font-semibold text-brand-900">Verify Identity</h2>
                    <p className="text-ink-tertiary text-xs mt-2 leading-relaxed">
                      Enter the 6-digit code sent to your registered email.
                    </p>
                  </div>
                  <OtpInput length={6} onComplete={handleOtpComplete} />
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Access"
                    )}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtpCode("");
                      }}
                      className="text-ink-tertiary text-xs font-medium hover:text-ink-primary transition-colors"
                    >
                      ← Back to credentials
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <p className="text-center text-ink-tertiary text-[10px] mt-8 font-medium uppercase tracking-wider">
          © 2026 FORTE MARKETPLACE GLOBAL • SECURE PORTAL
        </p>
      </div>
    </div>
  );
}
