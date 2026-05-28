import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowRight, RefreshCw, X, MessageSquare, Key, AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);

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

    // Auto-focus next input field
    if (value !== '' && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const joined = otp.join('');
    if (joined.length < 6) {
      toast.error('Please input a valid 6-digit OTP verification code!');
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (joined === '123456') {
            resolve();
          } else {
            reject();
          }
        }, 1200);
      }),
      {
        loading: 'Decrypting MFA security signature...',
        success: 'Identity authenticated! Portal workspace initialized! 🔓',
        error: 'Incorrect OTP. Try "123456" for mock login validation!'
      }
    );
  };

  const resendCode = () => {
    setTimer(59);
    toast.success('A new Multi-Factor OTP code has been dispatched to your email! ✉️');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 font-sans animate-in zoom-in-95 duration-200 relative">
      <Toaster position="top-right" />
      
      <Card className="bg-white border border-border p-8 rounded-[24px] shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-accent-purple/10 text-accent-purple rounded-2xl flex items-center justify-center mx-auto animate-pulse">
          <Key size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text-primary">Multi-Factor Verification</h2>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            A 6-digit authentication security OTP was dispatched to your email. Enter code below to confirm identity.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
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
                className="w-12 h-14 border border-border rounded-xl text-center font-black text-xl bg-light-gray/60 focus:outline-none focus:bg-white focus:border-accent-purple text-text-primary select-all"
                required
              />
            ))}
          </div>

          <div className="text-xs font-bold text-text-secondary">
            {timer > 0 ? (
              <span>Resend verification code in <span className="text-accent-purple">{timer}s</span></span>
            ) : (
              <button type="button" onClick={resendCode} className="text-accent-purple hover:underline flex items-center gap-1 mx-auto">
                <RefreshCw size={12} /> Resend OTP Code
              </button>
            )}
          </div>

          <button type="submit" className="w-full py-3.5 bg-accent-purple hover:bg-accent-purple/95 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-accent-purple/20 flex items-center justify-center gap-1.5">
            <ShieldCheck size={18} /> Confirm Identity & Sign In
          </button>
        </form>
      </Card>
    </div>
  );
}
