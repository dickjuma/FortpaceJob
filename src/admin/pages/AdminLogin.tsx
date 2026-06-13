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
  KeyRound,
  Smartphone,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

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
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-4 h-4 text-ink-tertiary" /></div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full h-10 border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? "pl-9" : ""} ${error ? "border-danger" : "border-border"}`}
      />
    </div>
    {error && <p className="text-danger text-xs mt-1">{error}</p>}
  </div>
);

const OtpInput = ({ length = 6, onComplete, disabled }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < length - 1) inputsRef.current[index + 1]?.focus();
    if (next.every((digit) => digit !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          autoFocus={idx === 0}
          className="w-12 h-12 text-center text-xl font-mono font-bold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary disabled:opacity-50"
        />
      ))}
    </div>
  );
};

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
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${type === "success" ? "bg-accent text-white" : "bg-danger text-white"}`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
};

export default function AdminLogin() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState("");
  const [setup, setSetup] = useState(null);
  const [setupCodes, setSetupCodes] = useState("");
  const [setupOtp, setSetupOtp] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { login, setupStart, setupConfirm, verifyTotp, verifyEmailOtp, verifyRecoveryCode, setUser, setIsAuthenticated } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter admin email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.requiresSetup) {
        setChallengeId(result.setupToken);
        setSetup(result);
        setStep(5);
        return;
      }
      if (result.requiresTotp) {
        setChallengeId(result.challengeId);
        setStep(2);
        return;
      }
      setToast({ type: "success", message: "Admin login completed." });
      navigate("/admin");
    } catch (err) {
      setError(err.error || err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupStart = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await setupStart(email, password);
      setChallengeId(result.setupToken);
      setSetup(result);
      setStep(5);
    } catch (err) {
      setError(err.error || err.message || "Admin setup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupConfirm = async (e) => {
    e.preventDefault();
    setError("");
    if (setupOtp.length !== 6 || setupCodes.trim().length < 10) {
      setError("Enter the authenticator code and all 10 recovery codes.");
      return;
    }
    setLoading(true);
    try {
      const result = await setupConfirm({
        setupToken: challengeId,
        totpCode: setupOtp,
        recoveryCodes: setupCodes.trim().split(/\s+/),
      });
      setUser(result.admin);
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (err) {
      setError(err.error || err.message || "Admin setup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async (e) => {
    e.preventDefault();
    setError("");
    if (otpCode.length !== 6) {
      setError("Enter the 6-digit authenticator code.");
      return;
    }
    setLoading(true);
    try {
      const result = await verifyTotp({ challengeId, totpCode: otpCode });
      if (result.requiresEmailOtp) {
        setChallengeId(result.challengeId);
        setStep(3);
        return;
      }
      setUser(result.admin);
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (err) {
      setError(err.error || err.message || "Invalid authenticator code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (emailOtp.length !== 6) {
      setError("Enter the 6-digit email code.");
      return;
    }
    setLoading(true);
    try {
      const result = await verifyEmailOtp({ challengeId, code: emailOtp });
      setUser(result.admin);
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (err) {
      setError(err.error || err.message || "Invalid email verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await verifyRecoveryCode({ challengeId, recoveryCode });
      if (result.requiresEmailOtp) {
        setChallengeId(result.challengeId);
        setStep(3);
        return;
      }
      setUser(result.admin);
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (err) {
      setError(err.error || err.message || "Invalid recovery code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}</AnimatePresence>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-surface border-border shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-accent-light p-3 rounded-2xl mb-4"><ShieldCheck className="text-accent-dark w-8 h-8" /></div>
            <h1 className="text-2xl font-display font-bold text-brand-900 tracking-tight">Forte Control Center</h1>
            <p className="text-ink-tertiary text-xs mt-2 font-medium uppercase tracking-wider">Authorized Personnel Only</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <form onSubmit={handleLogin} className="space-y-5">
                  <Input label="Admin Email" type="email" placeholder="admin@fortemarket.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
                  <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} required />
                  {error && <div className="rounded-xl border border-danger bg-danger-light px-4 py-3 text-xs text-danger">{error}</div>}
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? "Authenticating..." : <>Continue to 2FA <ArrowRight className="w-4 h-4" /></>}</Button>
                  <Button type="button" variant="ghost" disabled={loading} onClick={handleSetupStart} className="w-full">First-time admin setup</Button>
                  <div className="flex items-center gap-2 text-danger bg-danger-light p-3 rounded-xl">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <p className="text-[10px] font-medium uppercase tracking-tight">Your IP address, device, and browser are logged for security compliance.</p>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="totp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleVerifyTotp} className="space-y-6">
                  <div className="text-center">
                    <Smartphone className="w-10 h-10 mx-auto text-brand-900 mb-3" />
                    <h2 className="text-lg font-display font-semibold text-brand-900">Authenticator Required</h2>
                    <p className="text-ink-tertiary text-xs mt-2 leading-relaxed">Enter the 6-digit code from Google Authenticator, Microsoft Authenticator, Authy, or 1Password.</p>
                  </div>
                  <OtpInput length={6} onComplete={setOtpCode} disabled={loading} />
                  {error && <div className="rounded-xl border border-danger bg-danger-light px-4 py-3 text-xs text-danger">{error}</div>}
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? "Verifying..." : "Verify Authenticator"}</Button>
                  <div className="text-center">
                    <button type="button" onClick={() => setStep(4)} className="text-ink-tertiary text-xs font-medium hover:text-ink-primary transition-colors">Use recovery code</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleVerifyEmailOtp} className="space-y-6">
                  <div className="text-center">
                    <Mail className="w-10 h-10 mx-auto text-brand-900 mb-3" />
                    <h2 className="text-lg font-display font-semibold text-brand-900">Email Verification Required</h2>
                    <p className="text-ink-tertiary text-xs mt-2 leading-relaxed">Enter the code sent for this admin login attempt.</p>
                  </div>
                  <OtpInput length={6} onComplete={setEmailOtp} disabled={loading} />
                  {error && <div className="rounded-xl border border-danger bg-danger-light px-4 py-3 text-xs text-danger">{error}</div>}
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? "Verifying..." : "Verify Email Code"}</Button>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="recovery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleRecovery} className="space-y-5">
                  <div className="text-center">
                    <KeyRound className="w-10 h-10 mx-auto text-brand-900 mb-3" />
                    <h2 className="text-lg font-display font-semibold text-brand-900">Recovery Code</h2>
                    <p className="text-ink-tertiary text-xs mt-2 leading-relaxed">Use one unused backup recovery code.</p>
                  </div>
                  <Input label="Recovery Code" value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())} icon={KeyRound} required />
                  {error && <div className="rounded-xl border border-danger bg-danger-light px-4 py-3 text-xs text-danger">{error}</div>}
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? "Verifying..." : "Use Recovery Code"}</Button>
                  <div className="text-center">
                    <button type="button" onClick={() => setStep(2)} className="text-ink-tertiary text-xs font-medium hover:text-ink-primary transition-colors">Back to authenticator</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 5 && setup && (
              <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleSetupConfirm} className="space-y-5">
                  <div className="text-center">
                    <ShieldCheck className="w-10 h-10 mx-auto text-brand-900 mb-3" />
                    <h2 className="text-lg font-display font-semibold text-brand-900">Activate Admin 2FA</h2>
                    <p className="text-ink-tertiary text-xs mt-2 leading-relaxed">Scan this QR code, then enter the authenticator code and save all recovery codes.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4 flex justify-center" dangerouslySetInnerHTML={{ __html: setup.qr }} />
                  <Input label="Authenticator Code" value={setupOtp} onChange={(e) => setSetupOtp(e.target.value)} icon={Smartphone} required />
                  <textarea
                    value={setupCodes}
                    onChange={(e) => setSetupCodes(e.target.value)}
                    placeholder="Paste the 10 recovery codes here"
                    className="w-full min-h-32 rounded-lg border border-border px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                  {error && <div className="rounded-xl border border-danger bg-danger-light px-4 py-3 text-xs text-danger">{error}</div>}
                  <Button type="submit" variant="primary" disabled={loading} className="w-full">{loading ? "Activating..." : "Activate Admin Account"}</Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        <p className="text-center text-ink-tertiary text-[10px] mt-8 font-medium uppercase tracking-wider">© 2026 FORTE MARKETPLACE GLOBAL • SECURE PORTAL</p>
      </div>
    </div>
  );
}
