// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldAlert,
  Loader2
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification
    await login("admin@fortemarket.com", "super_admin");
    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-success/10 blur-[150px] rounded-full -tranzinc-y-1/2 tranzinc-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#14a800]/10 blur-[150px] rounded-full tranzinc-y-1/2 -tranzinc-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-dark border border-zinc-800 p-10 rounded-[40px] shadow-2xl">
          {/* Logo & Intro */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-success p-4 rounded-3xl shadow-lg shadow-emerald-500/20 mb-6 animate-pulse">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Forte Control Center</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-500 group-focus-within:text-success transition-colors" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="admin@fortemarket.com"
                    className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-500 group-focus-within:text-success transition-colors" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-zinc-900 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-success transition-all hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    Continue to 2FA
                    <ArrowRight size={18} className="group-hover:tranzinc-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-rose-500 bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                <ShieldAlert size={16} className="shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-tight">Your IP (192.168.1.1) is being logged for security compliance.</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center">
                <h2 className="text-white font-bold">Verify Identity</h2>
                <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                  A 6-digit verification code has been sent to your registered admin email.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-12 h-16 bg-zinc-800/50 border border-zinc-700 focus:border-emerald-500 text-white text-2xl font-bold text-center rounded-xl outline-none"
                    autoFocus={i === 1}
                  />
                ))}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-success text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-success transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Authentication"}
              </button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-zinc-500 text-xs font-bold hover:text-white transition-colors"
                >
                  Back to Credentials
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-zinc-600 text-[10px] mt-10 font-medium uppercase tracking-[0.3em]">
          © 2026 FORTE MARKETPLACE GLOBAL • SYSTEM v2.4
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
