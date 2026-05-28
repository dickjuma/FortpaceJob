import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error('Enter your admin email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result?.requiresTwoFactor) {
        navigate('/auth/admin/verify', {
          state: {
            purpose: 'admin_2fa',
            userId: result.userId,
            email,
          },
        });
        return;
      }

      toast.success('Admin session started');
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-brand-100 selection:text-brand-900">
      <div className="hidden lg:flex flex-col justify-between p-16 bg-surface-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#4338ca_0,transparent_50%)] opacity-40"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
             <div className="h-10 w-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
                <ShieldCheck size={24} />
             </div>
             <span className="text-xl font-black tracking-tight">Forte<span className="text-brand-500">Admin</span></span>
          </div>
          <h1 className="text-6xl font-black leading-[1.1] tracking-tighter mb-6 max-w-md">
             The brain behind the <span className="text-brand-500 underline decoration-brand-500 underline-offset-8">marketplace.</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-20 bg-white dark:bg-surface-dark">
         <div className="w-full max-w-md space-y-10 animate-in slide-up duration-700">
            <div>
               <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">Welcome back</h2>
               <p className="text-zinc-500 font-medium italic">Authorized administrative access only.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Work Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                     <input 
                        type="email" 
                        placeholder="admin@forte.ke"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 h-14 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-all"
                      />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                     <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 h-14 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-all"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                     >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>

               <Button fullWidth size="lg" className="h-14" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In to Control Center'}
               </Button>
            </form>

            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-zinc-900/40 p-4 text-xs font-medium text-zinc-500">
               Admin access uses the production auth service and role checks. Demo shortcuts are disabled in this build.
            </div>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
