import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Lock } from 'lucide-react';
import { authAPI } from '../../common/services/api';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // Simple length check, PasswordInput component handles the visual strength meter
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authAPI.resetPassword({ token, password });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link might be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Secure your account."
      heroSubtitle="Create a strong password to keep your Forte workspace and earnings safe."
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto pt-4">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Create new password</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Please enter your new password below.
                </p>
              </div>

              {!token && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-xl text-sm font-medium border border-yellow-200 dark:border-yellow-500/20">
                  Warning: No reset token found in URL. You need to click the link in your email to reset your password.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <PasswordInput
                  label="New Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  showStrength={true}
                />

                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                />

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center border border-red-100 dark:border-red-500/20"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={!token || !password || !confirmPassword}
                  icon={Lock}
                >
                  Reset Password
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
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Password reset</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              
              <Button
                variant="primary"
                onClick={() => navigate('/auth/login')}
                fullWidth
              >
                Continue to Log in
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
