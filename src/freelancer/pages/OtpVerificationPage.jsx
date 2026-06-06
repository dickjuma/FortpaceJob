// src/pages/auth/OtpVerificationPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ArrowRight, RefreshCw, X, MessageSquare, Key, AlertCircle, Check
} from 'lucide-react';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value !== '' && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const joined = otp.join('');

    if (joined.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (joined === '123456') {
        setShowSuccess({ message: 'Identity verified! Redirecting...' });
        setTimeout(() => setShowSuccess(null), 2000);
      } else {
        setError('Invalid OTP code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-input-0')?.focus();
      }
    }, 1200);
  };

  const resendCode = () => {
    setTimer(59);
    setShowSuccess({ message: 'New code sent to your email' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    const newOtp = [...otp];
    for (let i = 0; i < digits.length && i < 6; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {showSuccess.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-border text-center">
          <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Key className="w-8 h-8 text-accent DEFAULT" />
          </div>

          <div className="space-y-2 mb-6">
            <h2 className="font-display font-bold text-2xl text-brand-900">Multi-factor verification</h2>
            <p className="text-sm text-ink-secondary font-body">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3 bg-danger-light border border-danger rounded-lg"
              >
                <p className="text-danger text-sm font-body">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleVerify} className="space-y-5">
            {/* OTP Inputs */}
            <div className="flex gap-2.5 justify-center">
              {otp.map((char, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-12 border border-border rounded-xl text-center font-mono font-bold text-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent text-ink-primary"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Resend Timer */}
            <div className="text-sm font-body text-ink-tertiary">
              {timer > 0 ? (
                <span>Resend code in <span className="font-mono font-semibold text-accent DEFAULT">{timer}s</span></span>
              ) : (
                <button
                  type="button"
                  onClick={resendCode}
                  className="text-accent DEFAULT hover:text-accent-dark flex items-center gap-1 mx-auto transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend code
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Verify & sign in
                </>
              )}
            </button>
          </form>

          {/* Help Link */}
          <p className="mt-5 text-xs text-ink-tertiary">
            Didn't receive the code?{' '}
            <button onClick={resendCode} className="text-accent DEFAULT hover:text-accent-dark transition-colors">
              Click here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
