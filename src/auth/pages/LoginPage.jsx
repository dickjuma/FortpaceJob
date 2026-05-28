// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../common/authStore';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, LogIn, Github, ArrowRight, User, Briefcase, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPathForRole } from '../utils/authRouting';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setAuth, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');

  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      const result = await login(email, password, rememberMe);

      if (result?.requiresTwoFactor && result?.userId) {
        navigate('/auth/admin/verify', {
          state: {
            purpose: 'admin_2fa',
            userId: result.userId,
            email: email.trim().toLowerCase(),
          },
        });
        return;
      }

      navigate(getDashboardPathForRole(result.user?.role));
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleTestSeededLogin = (role) => {
    const mockUsers = {
      CLIENT: { id: 'test-client', email: 'client@forte.test', role: 'CLIENT', firstName: 'Test', lastName: 'Client', avatar: 'https://ui-avatars.com/api/?name=Test+Client&background=1a1d2e&color=fff' },
      FREELANCER: { id: 'test-freelancer', email: 'freelancer@forte.test', role: 'FREELANCER', firstName: 'Test', lastName: 'Freelancer', avatar: 'https://ui-avatars.com/api/?name=Test+Freelancer&background=1a1d2e&color=fff' },
      ADMIN: { id: 'test-admin', email: 'admin@forte.test', role: 'ADMIN', firstName: 'Test', lastName: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Test+Admin&background=1a1d2e&color=fff' },
    };
    
    setAuth(mockUsers[role], 'mock-access-token', 'mock-refresh-token');
    
    if (role === 'CLIENT') navigate('/client/dashboard');
    else if (role === 'FREELANCER') navigate('/freelancer/dashboard');
    else navigate('/admin');
  };

  return (
    <AuthLayout
      heroTitle="Welcome back to Forte."
      heroSubtitle="Log in to access your enterprise dashboard, manage active contracts, and collaborate with your team."
      showStats={true}
      cardClassName="!p-8 sm:!p-10 !shadow-2xl !shadow-indigo-500/10"
    >
      <div className="w-full">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Sign in to your Forte Workspace.
          </p>
        </div>

        {/* Development Seed Testing Login */}
        <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
          <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-3 text-center">Development Test Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleTestSeededLogin('CLIENT')} type="button" className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors shadow-sm">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">Client</span>
            </button>
            <button onClick={() => handleTestSeededLogin('FREELANCER')} type="button" className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors shadow-sm">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">Freelancer</span>
            </button>
            <button onClick={() => handleTestSeededLogin('ADMIN')} type="button" className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors shadow-sm">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">Admin</span>
            </button>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-semibold text-sm text-zinc-700 dark:text-zinc-200 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-semibold text-sm text-zinc-700 dark:text-zinc-200 shadow-sm">
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        <div className="relative flex items-center py-2 mb-8">
          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">or email</span>
          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
            <div className={`relative flex items-center transition-all rounded-xl border ${focusedField === 'email' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-900 overflow-hidden shadow-sm`}>
              <div className="pl-4">
                <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-indigo-500' : 'text-zinc-400'}`} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); setFormError(''); }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="name@company.com"
                className="w-full py-3.5 px-3 bg-transparent text-zinc-900 dark:text-white outline-none placeholder-zinc-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Password</label>
              <Link 
                to="/auth/forgot-password" 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className={`relative flex items-center transition-all rounded-xl border ${focusedField === 'password' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-900 overflow-hidden shadow-sm`}>
              <div className="pl-4">
                <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-indigo-500' : 'text-zinc-400'}`} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); setFormError(''); }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className="w-full py-3.5 px-3 bg-transparent text-zinc-900 dark:text-white outline-none placeholder-zinc-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center py-2 ml-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="w-5 h-5 border-2 rounded-md border-zinc-300 dark:border-zinc-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all group-hover:border-indigo-400"></div>
                <svg className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                Remember me for 30 days
              </span>
            </label>
          </div>

          <AnimatePresence>
            {(error || formError) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100 dark:border-red-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error || formError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-[15px] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all group mt-6"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:tranzinc-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link 
            to="/auth/register" 
            className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
