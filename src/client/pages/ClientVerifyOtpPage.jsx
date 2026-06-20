// ClientVerifyOtpPage.jsx
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Smartphone, Mail, RefreshCw, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientVerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  
  const [verified, setVerified] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0 && !verified) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, verified]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleResend = () => {
    setTimer(59);
    showToast('success', 'A fresh OTP code has been dispatched via SMS.');
  };

  const verifyMutation = useMutation({
    mutationFn: async (code) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (code === '123456' || code === '000000') return true;
      throw new Error('Invalid OTP code');
    },
    onSuccess: () => {
      setVerified(true);
      showToast('success', 'Access granted.');
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 1200);
    },
    onError: (err) => {
      showToast('error', err.message || 'Invalid OTP code. Please try again.');
    }
  });

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      showToast('error', 'Please enter the 6-digit verification code.');
      return;
    }
    verifyMutation.mutate(code);
  };

  const isVerifying = verifyMutation.isPending;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen flex bg-surface-soft font-body">
      {/* Left side brand banner (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 to-brand-800 opacity-80 z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-3xl rounded-full" />

        <div className="relative z-20 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-xl text-white shadow-sm">F</div>
          <span className="text-xl font-bold tracking-tight text-white">ForteSpace</span>
        </div>

        <div className="relative z-20 space-y-5">
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight max-w-lg text-white">
            Securing Your <span className="text-accent">Workforce Ecosystem</span>.
          </h2>
          <p className="text-white/70 text-base max-w-md font-medium">
            Confirm identity to manage escrow accounts, authorize payment runs, and monitor field operations.
          </p>
        </div>

        <div className="relative z-20 flex gap-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          <span>Secure Gateway</span>
          <span>•</span>
          <span>Encrypted Channel</span>
        </div>
      </div>

      {/* Right side verification card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/5 blur-3xl rounded-full" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white border border-border rounded-2xl shadow-lg p-6 sm:p-8 relative z-10"
        >
          {verified ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-5"
            >
              <div className="w-20 h-20 bg-accent-light text-accent-dark rounded-full flex items-center justify-center mx-auto border border-accent/20">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-brand-900">Identity Verified</h3>
                <p className="text-sm text-ink-secondary">Establishing secure portal access...</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex p-3 bg-accent-light text-accent-dark rounded-xl mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-900">Confirm OTP Identity</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  We've sent a 6‑digit verification code to your registered mobile number ending in <span className="font-semibold text-accent">***890</span>.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex gap-2 justify-between">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 bg-white border border-border text-center text-xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent transition-all"
                      value={data}
                      onChange={e => handleChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>

                <div className="bg-surface-soft rounded-xl p-3 border border-border text-center text-[10px] font-medium text-ink-tertiary flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>Test code: 123456</span>
                  </div>
                  <span className="text-accent font-mono bg-white px-2 py-0.5 rounded border border-border">123456</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-tertiary font-medium">
                    {timer > 0 ? (
                      <span>Resend code in <strong className="text-accent font-mono">{timer}s</strong></span>
                    ) : (
                      <span>Code expired</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0}
                    className="flex items-center gap-1 font-medium text-accent hover:text-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                  </button>
                </div>

                <motion.button
                  whileTap={buttonTap}
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Access <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
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
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' :
                               toast.type === 'error' ? 'rgb(254, 226, 226)' : 'rgb(219, 234, 254)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' :
                     toast.type === 'error' ? 'rgb(185, 28, 28)' : 'rgb(29, 78, 216)'
            }}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

