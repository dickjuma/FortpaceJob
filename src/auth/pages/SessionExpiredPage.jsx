import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hourglass, LogIn } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

export default function SessionExpiredPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      heroTitle="Session Expired."
      heroSubtitle="Your security is our priority. We log you out automatically after a period of inactivity to protect your account."
      showStats={false}
    >
      <div className="w-full max-w-sm mx-auto pt-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-6"
        >
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Hourglass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Your session has expired due to inactivity. Please log in again to continue working on your projects.
          </p>
          
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/auth/login')}
              fullWidth
              icon={LogIn}
            >
              Log in again
            </Button>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Need help? <a href="#" className="font-semibold text-[#4C1D95] hover:text-[#4C1D95] dark:text-[#4C1D95] transition-colors">Contact Support</a>
            </p>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}


