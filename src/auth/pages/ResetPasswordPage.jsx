import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, KeyRound, Lock, Mail } from 'lucide-react';
import { authAPI } from '../../common/services/api';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import OTPInput from '../components/ui/OTPInput';
import PasswordInput from '../components/ui/PasswordInput';
import { motion, AnimatePresence } from 'framer-motion';
import {
  validateConfirmPassword,
  validateEmail,
  validateOtp,
  validatePassword,
} from '../../common/utils/validation';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || sessionStorage.getItem('passwordResetEmail') || '';
  const navigate = useNavigate();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const isOtpReset = !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOtpReset) {
      const emailError = validateEmail(email);
      if (emailError) {
        setError(emailError);
        return;
      }
      const otpError = validateOtp(otp);
      if (otpError) {
        setError(otpError);
        return;
      }
    } else if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authAPI.resetPassword(
        isOtpReset
          ? { email, otp, password }
          : email
          ? { token, password, email }
          : { token, password }
      );
      sessionStorage.removeItem('passwordResetEmail');
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The code might be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsResending(true);
    setError('');

    try {
      await authAPI.resendPasswordResetOTP(email);
      sessionStorage.setItem('passwordResetEmail', email);
    } catch (err) {
      setError(err.message || 'Failed to resend reset code. Please try again.');
    } finally {
      setIsResending(false);
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
                  {isOtpReset ? 'Enter the code from your email and choose a new password.' : 'Please enter your new password below.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isOtpReset && (
                  <>
                    <Input
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      icon={Mail}
                      placeholder="name@company.com"
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                          Reset code
                        </label>
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={isResending}
                          className="text-sm font-semibold text-[#4C1D95] hover:text-[#4C1D95] dark:text-[#4C1D95] disabled:opacity-60"
                        >
                          {isResending ? 'Sending...' : 'Resend code'}
                        </button>
                      </div>
                      <OTPInput
                        value={otp}
                        onChange={(value) => { setOtp(value); setError(''); }}
                        error={error && otp.length !== 6 ? error : ''}
                        disabled={isSubmitting}
                        autoFocus={Boolean(email)}
                      />
                    </div>
                  </>
                )}

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
                  disabled={(isOtpReset ? (!email || otp.length !== 6) : !token) || !password || !confirmPassword}
                  icon={isOtpReset ? KeyRound : Lock}
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


