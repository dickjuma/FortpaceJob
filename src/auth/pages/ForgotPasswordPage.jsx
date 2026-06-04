import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, KeyRound } from 'lucide-react';
import { authAPI } from '../../common/services/api';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { validateEmail } from '../../common/utils/validation';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      sessionStorage.setItem('passwordResetEmail', email);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Forgot your password?"
      heroSubtitle="Don't worry, it happens to the best of us. We'll help you get back into your account securely."
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to log in
        </Link>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Reset password</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Enter your email address and we'll send you a 6-digit code to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  icon={Mail}
                  placeholder="name@company.com"
                  error={error}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  icon={Send}
                  iconPosition="right"
                >
                  Send Reset Code
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-[#2bb75c]/10 dark:bg-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                We've sent a 6-digit password reset code to <br/><span className="font-semibold text-zinc-900 dark:text-white">{email}</span>
              </p>
              
              <div className="space-y-4">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`)}
                  fullWidth
                  icon={KeyRound}
                >
                  Enter Reset Code
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => window.open(`mailto:${email}`)}
                  fullWidth
                >
                  Open Email App
                </Button>
                
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Didn't receive the email?{' '}
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="font-semibold text-[#2bb75c] hover:text-[#2bb75c] dark:text-[#2bb75c] transition-colors"
                  >
                    Click to resend
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}

