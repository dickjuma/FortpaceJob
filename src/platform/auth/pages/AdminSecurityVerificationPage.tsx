import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { adminAuthAPI } from '../../../admin/api/adminAuth.api';
import { useAuthStore as useAdminAuthStore } from '../../../admin/store/authStore';
import AuthLayout from '../components/AuthLayout';
import VerificationStep from '../components/VerificationStep';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPathForRole } from '../utils/authRouting';

export default function AdminSecurityVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminStore = useAdminAuthStore();
  const state = location.state || {};

  const challengeId = state.challengeId || null;
  const email = state.email || '';
  const admin = state.admin || null;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const content = useMemo(() => ({
    heroTitle: 'Admin security check',
    heroSubtitle: `Enter the verification code sent to ${email}.`,
  }), [email]);

  useEffect(() => {
    if (!challengeId || !email) {
      navigate('/admin/login', { replace: true });
    }
  }, [challengeId, email, navigate]);

  const handleOtpSubmit = async (method, otp) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await adminAuthAPI.verifyEmailOtp({ challengeId, code: otp });
      if (result?.accessToken && result?.admin) {
        adminStore.setUser(result.admin);
        adminStore.setToken(result.accessToken);
        adminStore.setIsAuthenticated(true);
      }
      setIsSuccess(true);
    } catch (err) {
      setError(err?.message || err?.error || 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await adminAuthAPI.sendEmailOtp({ email });
      if (result?.challengeId) {
        location.state = { ...location.state, challengeId: result.challengeId };
      }
    } catch (err) {
      setError(err?.message || err?.error || 'Could not resend code. Try logging in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(getDashboardPathForRole(admin?.role || 'ADMIN'));
  };

  if (!challengeId || !email) return null;

  if (isSuccess) {
    return (
      <AuthLayout
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        heroTitle={content.heroTitle}
        heroSubtitle={content.heroSubtitle}
        showStats={false}
      >
        <div className="w-full max-w-sm mx-auto pt-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Security check complete</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Two-factor authentication succeeded. You can continue to the admin control center.</p>
            <Button variant="primary" onClick={handleContinue} className="h-12" fullWidth disabled={false} icon={null}>
              Continue to Admin Center
            </Button>
          </motion.div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      heroTitle={content.heroTitle}
      heroSubtitle={content.heroSubtitle}
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto pt-4">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 font-medium">
            {error}
          </motion.div>
        )}

        <VerificationStep
          email={email}
          phone=""
          onVerify={handleOtpSubmit}
          onResend={handleResend}
        />
      </div>
    </AuthLayout>
  );
}
