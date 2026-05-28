import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { authAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';
import { useAuthStore as useAdminAuthStore } from '../../admin/store/authStore';
import AuthLayout from '../components/AuthLayout';
import VerificationStep from '../components/VerificationStep';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPathForRole, getPostVerificationPathForRole } from '../utils/authRouting';

export default function OTPVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setAuth, updateUser } = useAuthStore();
  const purpose = location.state?.purpose || 'email_verification';
  const email = location.state?.email || user?.email || sessionStorage.getItem('pendingVerificationEmail') || '';
  const userId = location.state?.userId || null;

  const [isSuccess, setIsSuccess] = useState(false);

  const content = useMemo(() => {
    if (purpose === 'admin_2fa') {
      return {
        heroTitle: 'Admin security check.',
        heroSubtitle: 'Enter the six-digit code sent to your administrator email to complete sign-in.',
        successTitle: 'Security check complete',
        successDescription: 'Two-factor authentication succeeded. You can continue to the admin dashboard.',
      };
    }

    return {
      heroTitle: 'Verify your email.',
      heroSubtitle: 'Enter the six-digit code sent to your email to secure your account and continue setup.',
      successTitle: 'Email verified',
      successDescription: 'Your email has been verified successfully.',
    };
  }, [purpose]);

  useEffect(() => {
    if (purpose === 'admin_2fa' && !userId) {
      navigate('/auth/login', { replace: true });
      return;
    }

    if (purpose !== 'admin_2fa' && !email) {
      navigate('/auth/login', { replace: true });
    }
  }, [email, navigate, purpose, userId]);

  const handleVerify = async (method, otp) => {
    if (purpose === 'admin_2fa') {
      const data = await authAPI.verifyAdmin2FA(userId, otp);
      if (data?.accessToken && data?.user) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        useAdminAuthStore.getState().setUser(data.user);
        useAdminAuthStore.getState().setToken(data.accessToken);
        useAdminAuthStore.getState().setIsAuthenticated(true);
      }
      setIsSuccess(true);
      return;
    }

    await authAPI.verifyEmailOTP(email, otp);
    updateUser?.({ emailVerified: true });
    sessionStorage.removeItem('pendingVerificationEmail');
    setIsSuccess(true);
  };

  const handleResend = async () => {
    await authAPI.resendOTP(
      email,
      null,
      'email',
      purpose === 'admin_2fa' ? 'admin_2fa' : 'email_verification',
      userId || user?.id || null
    );
  };

  const handleContinue = () => {
    if (purpose === 'admin_2fa') {
      navigate(getDashboardPathForRole(user?.role));
      return;
    }

    navigate(getPostVerificationPathForRole(user?.role));
  };

  if ((purpose === 'admin_2fa' && !userId) || (purpose !== 'admin_2fa' && !email)) {
    return null;
  }

  return (
    <AuthLayout
      heroTitle={content.heroTitle}
      heroSubtitle={content.heroSubtitle}
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto pt-4">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <VerificationStep
                email={email || user?.email}
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

              <Button
                variant="primary"
                onClick={handleContinue}
                fullWidth
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
