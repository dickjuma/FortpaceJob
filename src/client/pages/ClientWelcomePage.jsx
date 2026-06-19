// ClientWelcomePage.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Briefcase, ChevronRight,
  ShieldCheck, ArrowRight, User, Check, AlertCircle
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientWelcomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const roles = [
    { id: 'individual', title: 'Individual Client', desc: 'Hiring single digital contractors or surveyors.', icon: User },
    { id: 'sme', title: 'SME Operations', desc: 'Managing small onsite crews and digital teams.', icon: Briefcase },
    { id: 'corporate', title: 'Corporate Enterprise', desc: 'Enterprise management, cost centers, and budget chains.', icon: Building2 }
  ];

  const welcomeMutation = useMutation({
    mutationFn: async (role) => {
      // simulate saving user role
      await new Promise(resolve => setTimeout(resolve, 1500));
      return role;
    },
    onSuccess: (role) => {
      showToast('success', "Role selected: . Redirecting to setup...");
      setTimeout(() => navigate('/client/setup-wizard'), 1500);
    }
  });

  const handleContinue = () => {
    if (!selectedRole) {
      showToast('error', 'Please select an operational role tier to continue.');
      return;
    }
    welcomeMutation.mutate(selectedRole);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-soft via-surface to-surface-soft font-body py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background vectors (soft, no AI) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 blur-3xl rounded-full" />

      <div className="max-w-4xl mx-auto w-full flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-sm text-white">F</div>
            <span className="text-sm font-bold tracking-tight text-ink-primary">ForteSpace Gateway</span>
          </div>
          <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">Select Operational Tier</span>
        </div>

        {/* Central Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-12 space-y-8 text-center sm:text-left"
        >
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-soft border border-border rounded-full text-[10px] font-semibold text-accent uppercase tracking-wide">
              Unified Workforce Operating System
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-brand-900">
              Welcome to the <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">Future of Work</span>.
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Identify your business tier to customize your recruiting helper, allocate cost centers, and configure M-Pesa payment channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {roles.map(r => {
              const RoleIcon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <motion.div
                  key={r.id}
                  variants={itemVariants}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                  onClick={() => setSelectedRole(r.id)}
                  className={cn(
                    "p-6 rounded-xl border cursor-pointer text-left flex flex-col justify-between h-48 transition-all bg-white",
                    isSelected
                      ? "border-accent bg-accent-light shadow-sm"
                      : "border-border hover:border-accent/30 hover:bg-surface-soft"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "p-3 rounded-lg",
                      isSelected ? "bg-accent text-white shadow-sm" : "bg-surface-soft text-ink-tertiary"
                    )}>
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    {isSelected && <div className="w-4 h-4 rounded-full bg-accent border border-white flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-primary">{r.title}</h4>
                    <p className="text-[10px] text-ink-tertiary mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 mt-8">
          <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" /> Secure Payment Gateway
          </span>
          <motion.button
            whileTap={buttonTap}
            onClick={handleContinue}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Configure Selected Tier
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' :
                               toast.type === 'error' ? 'rgb(254, 226, 226)' : 'rgb(219, 234, 254)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' :
                     toast.type === 'error' ? 'rgb(185, 28, 28)' : 'rgb(29, 78, 216)'
            }}
          >
            {toast.type === 'success' && <Check className="w-4 h-4" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

