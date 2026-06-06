import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Smartphone, RefreshCw, ArrowRight } from 'lucide-react';
import OTPInput from './ui/OTPInput';
import Button from './ui/Button';

export default function VerificationStep({ email, phone, onVerify, onResend }) {
  const [method, setMethod] = useState('email'); // email or phone
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    setError(null);
    try {
      await onVerify(method, otp);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(null);
    try {
      await onResend(method);
      setCountdown(60);
      setOtp('');
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const isComplete = otp.length === 6;

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Verify your account</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          We sent a 6-digit code to <span className="font-semibold text-zinc-900 dark:text-white">{method === 'email' ? email : phone}</span>
        </p>
      </div>

      {phone && (
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => { setMethod('email'); setOtp(''); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              method === 'email' ? 'bg-white dark:bg-zinc-700 shadow-sm text-[#4C1D95] dark:text-[#4C1D95]' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button
            type="button"
            onClick={() => { setMethod('phone'); setOtp(''); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              method === 'phone' ? 'bg-white dark:bg-zinc-700 shadow-sm text-[#4C1D95] dark:text-[#4C1D95]' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Phone
          </button>
        </div>
      )}

      <div className="mb-8">
        <OTPInput 
          length={6} 
          value={otp} 
          onChange={(val) => {
            setOtp(val);
            if (error) setError(null);
          }} 
          error={error}
          disabled={isVerifying}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleVerify}
          isLoading={isVerifying}
          disabled={!isComplete}
          icon={ArrowRight}
          iconPosition="right"
        >
          Verify {method === 'email' ? 'Email' : 'Phone'}
        </Button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className={`flex items-center gap-1 font-medium transition-colors ${
              countdown > 0 
                ? 'text-zinc-400 cursor-not-allowed' 
                : 'text-[#4C1D95] hover:text-[#4C1D95] dark:text-[#4C1D95] dark:hover:text-[#4C1D95]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${countdown > 0 ? '' : ''}`} />
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}


