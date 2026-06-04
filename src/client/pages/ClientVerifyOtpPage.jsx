import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, Mail, RefreshCw, ArrowRight, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { validateOtp } from '../../common/utils/validation';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientVerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
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
    toast.success('A fresh OTP code has been dispatched via M-Pesa Auth SMS & Email.');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    const otpError = validateOtp(code);
    if (otpError) {
      toast.error(otpError);
      return;
    }

    setIsVerifying(true);
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (code === '123456' || code === '000000' || code.length === 6) {
            resolve();
          } else {
            reject();
          }
        }, 1500);
      }),
      {
        loading: 'Decrypting 2FA OTP Payload...',
        success: () => {
          setVerified(true);
          setTimeout(() => {
            navigate('/client/dashboard');
          }, 1200);
          return 'Access granted. Welcome back! 🔐';
        },
        error: 'Invalid OTP code. Please try again.'
      }
    ).finally(() => setIsVerifying(false));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-zinc-950 via-[#222222] to-zinc-900 font-sans text-white">
      <Toaster position="top-right" />
      
      {/* Left side brand banner and illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-cover bg-center relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-zinc-900/40 z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e63946]/10 blur-[120px] rounded-full"></div>

        <div className="relative z-20 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center font-black text-xl shadow-lg">F</div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-light-gray bg-clip-text text-transparent">ForteSpace</span>
        </div>

        <div className="relative z-20 space-y-6">
          <h2 className="text-5xl font-black leading-tight tracking-tight max-w-lg">
            Securing Your <span className="bg-gradient-to-r from-success via-[#e63946] to-orange-400 bg-clip-text text-transparent">Workforce Ecosystem</span>.
          </h2>
          <p className="text-light-gray/70 text-base max-w-md font-medium">
            Confirm identity to manage escrow accounts, authorize payment runs, and locate checked-in field operators instantly.
          </p>
        </div>

        <div className="relative z-20 flex gap-4 text-xs font-bold uppercase tracking-wider text-light-gray/40">
          <span>Stripe Protected</span>
          <span>•</span>
          <span>Daraja Secured</span>
        </div>
      </div>

      {/* Right side interactive glassmorphic card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-success/10 blur-[80px] rounded-full"></div>

        <Card className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl relative z-10">
          {verified ? (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#2bb75c]/10 border border-success/30">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Identity Decrypted</h3>
                <p className="text-sm text-light-gray/60 font-medium">Establishing secure portal credentials...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex p-3 bg-success/20 text-success rounded-2xl border border-success/20 mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Confirm OTP Identity</h3>
                <p className="text-xs text-light-gray/60 font-medium leading-relaxed">
                  We've dispatched a 6-digit confirmation payload to your authenticated device ending in <span className="text-success font-bold">***890</span>.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex gap-2 justify-between">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-14 bg-white/5 border border-white/10 text-center text-xl font-bold rounded-xl focus:border-success focus:ring-2 focus:ring-success/20 transition-all outline-none"
                      value={data}
                      onChange={e => handleChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>

                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center text-[10px] font-bold text-light-gray/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-success" />
                    <span>M-Pesa SMS Code Helper</span>
                  </div>
                  <span className="text-[#e63946] font-mono bg-white/5 px-2 py-0.5 rounded">123456</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-light-gray/50 font-medium">
                    {timer > 0 ? (
                      <span>Resend code in <strong className="text-success font-mono font-bold">{timer}s</strong></span>
                    ) : (
                      <span>Code expired</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0}
                    className="flex items-center gap-1 font-bold text-success hover:text-success/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-success hover:bg-success/95 border-none font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#2bb75c]/20 transition-all"
                >
                  {isVerifying ? 'Verifying Payload...' : 'Decrypt Command Portal'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

