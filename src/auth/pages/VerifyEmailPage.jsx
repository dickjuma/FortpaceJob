import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';
import AuthLayout from '../components/AuthLayout';
import VerificationStep from '../components/VerificationStep';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { getPostVerificationPathForRole } from '../utils/authRouting';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const email = location.state?.email || user?.email || sessionStorage.getItem('pendingVerificationEmail') || '';
  const nextPath = getPostVerificationPathForRole(location.state?.role || user?.role);
  
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/auth/login', { replace: true });
    } else {
      sessionStorage.setItem('pendingVerificationEmail', email);
    }
  }, [email, navigate]);

  const handleVerify = async (method, otp) => {
    await authAPI.verifyEmailOTP(email, otp);
    updateUser?.({ emailVerified: true });
    sessionStorage.removeItem('pendingVerificationEmail');
    setIsSuccess(true);
  };

  const handleResend = async (method) => {
    await authAPI.resendOTP(email, null, 'email', 'email_verification', user?.id || null);
  };

  if (!email) return null;

  return (
    <AuthLayout
      heroTitle="Secure your access."
      heroSubtitle="Verify your email address to unlock your Forte workspace and start hiring or working."
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
              <h2 className="text-2xl font-bold mb-2">Email Verified</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                Your email address has been successfully verified. You can now access your dashboard.
              </p>
              
               <Button
                 variant="primary"
                 onClick={() => navigate(nextPath)}
                 fullWidth
               >
                 Continue setup
               </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
