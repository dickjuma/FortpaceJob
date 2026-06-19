// src/pages/freelancer/UpgradePlanPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Star,
  Award,
  Building,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useUpdateSubscription } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button' }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

// ---------- Main Component ----------
export default function UpgradePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const updateSubscription = useUpdateSubscription();
  const [toast, setToast] = useState(null);

  const plans = [
    {
      name: 'Free Starter',
      price: 0,
      icon: Star,
      desc: 'Perfect for independent freelancers beginning their platform journey.',
      features: [
        'Apply to 10 jobs/month',
        'Basic profile verification',
        'Standard wallet payouts',
        'Basic messaging inbox',
      ],
    },
    {
      name: 'Professional',
      price: 29,
      icon: Award,
      desc: 'Tailored for dedicated freelancers looking to accelerate growth.',
      features: [
        'Apply to unlimited jobs',
        'Priority verification',
        'Escrow protection & fast payouts',
        'Skills assessment badges',
        'Advanced analytics',
      ],
    },
    {
      name: 'Agency',
      price: 99,
      icon: Building,
      desc: 'Designed for agencies managing multiple team members.',
      features: [
        'All Professional features',
        'Team member invites',
        'Collaborative workspace',
        'Advanced permissions',
        'Brand asset library',
        'Dedicated support coordinator',
      ],
    },
  ];

  const handleUpgrade = (planName, price) => {
    if (price === 0) {
      updateSubscription.mutate({ plan: planName, billingCycle }, {
        onSuccess: () => {
          setSelectedPlan(planName);
          setToast({ type: 'success', message: 'Downgraded to Free plan.' });
          setTimeout(() => setToast(null), 3000);
        }
      });
      return;
    }

    setToast({ type: 'loading', message: `Processing ${planName} plan...` });
    updateSubscription.mutate({ plan: planName, billingCycle }, {
      onSuccess: () => {
        setSelectedPlan(planName);
        setToast({ type: 'success', message: `Successfully upgraded to ${planName}!` });
        setTimeout(() => setToast(null), 3000);
      },
      onError: () => {
        setToast({ type: 'error', message: 'Payment failed. Please try again.' });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-accent text-white'
                : toast.type === 'loading'
                ? 'bg-brand-900 text-white'
                : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'loading' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-light text-accent-dark mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-brand-900 mb-3">
          Choose your plan
        </h1>
        <p className="text-sm text-ink-secondary">
          Scale your freelance business with the right tools and features.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActive = selectedPlan === plan.name;
          const PlanIcon = plan.icon;

          return (
            <Card
              key={plan.name}
              className={`flex flex-col h-full relative ${isActive ? 'border-accent ring-2 ring-accent/20 bg-accent-light/10' : ''}`}
            >
              {isActive && (
                <span className="absolute top-4 right-4 bg-accent text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                  Current plan
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2.5 rounded-xl ${
                    isActive ? 'bg-accent-light text-accent-dark' : 'bg-surface-muted text-ink-secondary'
                  }`}
                >
                  <PlanIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-brand-900">{plan.name}</h3>
                  <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">
                    {plan.price === 0 ? 'Free' : 'Premium'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-mono font-bold text-brand-900">${plan.price}</span>
                <span className="text-sm text-ink-secondary ml-1">/month</span>
              </div>

              <p className="text-sm text-ink-secondary mb-6">{plan.desc}</p>

              <div className="border-t border-border pt-4 mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-ink-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                {isActive ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    className="w-full"
                    onClick={() => handleUpgrade(plan.name, plan.price)}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Select plan'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
