// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../common/authStore';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPathForRole } from '../utils/authRouting';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { resolveAuthReturnTo } from '../../common/utils/authRedirect';
import { validateEmail, validateRequired } from '../../common/utils/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');

  const [focusedField, setFocusedField] = useState(null);
  const returnTo = useMemo(() => searchParams.get('returnTo') || resolveAuthReturnTo(location), [location, searchParams]);

  useEffect(() => {
    const oauthError = searchParams.get('oauthError');
    if (oauthError) {
      setFormError(oauthError);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    const emailError = validateEmail(email);
    if (emailError) {
      setFormError(emailError);
      return;
    }
    const passwordError = validateRequired(password, 'Password');
    if (passwordError) {
      setFormError(passwordError);
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

      const destination = returnTo || getDashboardPathForRole(result.user?.role);
      navigate(destination, { replace: true });
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <AuthLayout
      heroTitle="Welcome back to Forte."
      heroSubtitle="Log in to access your enterprise dashboard, manage active contracts, and collaborate with your team."
      showStats={true}
      cardClassName="!p-8 sm:!p-10 !shadow-2xl !shadow-[#14a800]/25"
    >
      <div className="w-full">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#14a800] to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#14a800]/25">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Sign in to your Forte Workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
            <div className={`relative flex items-center transition-all rounded-xl border ${focusedField === 'email' ? 'border-[#14a800] ring-4 ring-[#14a800]/10' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-900 overflow-hidden shadow-sm`}>
              <div className="pl-4">
                <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-[#14a800]' : 'text-zinc-400'}`} />
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
                className="text-xs font-bold text-[#14a800] hover:text-[#14a800] dark:text-[#14a800] dark:hover:text-[#7bc67e] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className={`relative flex items-center transition-all rounded-xl border ${focusedField === 'password' ? 'border-[#14a800] ring-4 ring-[#14a800]/10' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-900 overflow-hidden shadow-sm`}>
              <div className="pl-4">
                <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-[#14a800]' : 'text-zinc-400'}`} />
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
                <div className="w-5 h-5 border-2 rounded-md border-zinc-300 dark:border-zinc-600 peer-checked:bg-[#14a800] peer-checked:border-[#14a800] transition-all group-hover:border-[#14a800]"></div>
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
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#14a800] to-[#118a00] hover:from-[#118a00] hover:to-[#0f7000] text-white font-bold text-[15px] shadow-lg shadow-[#14a800]/25 hover:shadow-[#14a800]/25 transition-all group mt-6"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <SocialLoginButtons isLoading={isLoading} returnTo={returnTo} />
        </div>

        <div className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="font-bold text-[#14a800] hover:text-[#14a800] dark:text-[#14a800] dark:hover:text-[#7bc67e] transition-colors"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
