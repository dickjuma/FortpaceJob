import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { authAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';
import AuthLayout from '../components/AuthLayout';
import VerificationStep from '../components/VerificationStep';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPathForRole } from '../utils/authRouting';

export default function VerifyLoginOTPPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const email = location.state?.email || sessionStorage.getItem('pendingLoginVerificationEmail') || user?.email || '';
  const returnTo = location.state?.returnTo || '';

  useEffect(() => {
    if (!email) {
      navigate('/auth/login', { replace: true });
    }
  }, [email, navigate]);

  const content = useMemo(() => ({
    heroTitle: 'Verify this device.',
    heroSubtitle: 'Enter the six-digit code sent to your email to approve this new login.',
    successTitle: 'Device verified',
    successDescription: 'Your new device is trusted and your Forte session is active.',
  }), []);

  const handleVerify = async (method, otp) => {
    setError('');
    const data = await authAPI.verifyLoginOTP(email, otp);
    setAuth(data.user, data.accessToken, data.refreshToken);
    sessionStorage.removeItem('pendingLoginVerificationEmail');
    setIsSuccess(true);
  };

  const handleResend = async () => {
    setError('');
    await authAPI.resendOTP(email, null, 'email', 'login_verification', user?.id || null);
  };

  const handleContinue = () => {
    const safeReturnTo = returnTo && returnTo.startsWith('/') ? returnTo : '';
    navigate(safeReturnTo || getDashboardPathForRole(user?.role), { replace: true });
  };

  if (!email) return null;

  return (
    <AuthLayout
      heroTitle={content.heroTitle}
      heroSubtitle={content.heroSubtitle}
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto pt-4">
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <VerificationStep
                email={email}
                onVerify={handleVerify}
                onResend={handleResend}
              />
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
              <h2 className="text-2xl font-bold mb-2">{content.successTitle}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                {content.successDescription}
              </p>
              <Button variant="primary" onClick={handleContinue} fullWidth>
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
