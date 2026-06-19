import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../common/authStore';
import { getDashboardPathForRole } from '../utils/authRouting';

export default function AccessDeniedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <AuthLayout
      heroTitle="Restricted Area."
      heroSubtitle="You do not have the necessary permissions to access this page."
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto pt-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-6"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Access Denied</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Error 403: Forbidden. Your current account role does not permit access to this resource.
          </p>
          
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(-1)}
              fullWidth
              icon={ArrowLeft}
            >
              Go Back
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(getDashboardPathForRole(user?.role))}
              fullWidth
              icon={Home}
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
