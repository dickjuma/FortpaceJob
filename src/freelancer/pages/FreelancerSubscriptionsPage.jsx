// src/pages/freelancer/FreelancerSubscriptionsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, CheckCircle2, Zap, Star,
  Crown, Receipt, Settings, Clock, AlertCircle, Check
} from 'lucide-react';
import { useUpdateSubscription } from '../services/freelancerHooks';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    description: 'Basic features for new freelancers',
    features: ['10 proposals / month', 'Standard profile', 'Basic analytics', 'Community support'],
    icon: Star,
    color: 'text-ink-secondary',
    bg: 'bg-white',
    border: 'border-border'
  },
  {
    name: 'Professional',
    price: 15,
    description: 'For growing independent professionals',
    features: ['50 proposals / month', 'Featured profile badge', 'Advanced analytics', 'Priority support', 'Custom profile URL'],
    icon: Zap,
    color: 'text-accent DEFAULT',
    bg: 'bg-accent-light',
    border: 'border-accent DEFAULT',
    isPopular: true
  },
  {
    name: 'Enterprise',
    price: 49,
    description: 'Maximum visibility for top earners',
    features: ['Unlimited proposals', 'Top search placement', 'Dedicated account manager', '0% processing fees'],
    icon: Crown,
    color: 'text-warn',
    bg: 'bg-brand-900',
    border: 'border-brand-800'
  }
];

const BILLING_HISTORY = [
  { id: 'INV-001', date: 'May 1, 2026', amount: 15, plan: 'Professional Plan', status: 'Paid' },
  { id: 'INV-002', date: 'Apr 1, 2026', amount: 15, plan: 'Professional Plan', status: 'Paid' },
  { id: 'INV-003', date: 'Mar 1, 2026', amount: 0, plan: 'Free Plan', status: 'Paid' }
];

export default function FreelancerSubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [currentPlan, setCurrentPlan] = useState('Professional');
  const [showSuccess, setShowSuccess] = useState(null);
  
  const updateSubscription = useUpdateSubscription();

  const handleUpgrade = (planName) => {
    updateSubscription.mutate({ plan: planName, billingCycle }, {
      onSuccess: () => {
        setCurrentPlan(planName);
        setShowSuccess({ message: `Upgraded to ${planName} plan` });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    });
  };

  const handleAddPaymentMethod = () => {
    setShowSuccess({ message: 'Add payment method form would open' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDownloadInvoice = (id) => {
    setShowSuccess({ message: `Downloading invoice ${id}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const proposalsUsed = 32;
  const proposalsLimit = 50;
  const proposalsPercent = (proposalsUsed / proposalsLimit) * 100;

  const getAnnualPrice = (monthlyPrice) => {
    if (monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * 0.8);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-warn-light rounded-xl">
              <Crown className="w-6 h-6 text-warn" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Subscription & billing</h1>
          </div>
          <p className="text-ink-secondary font-body">Manage your premium plan, billing history, and proposal limits</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Current Plan Overview */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2">
              Current plan
            </p>
            <h2 className="font-display font-bold text-2xl text-brand-900 flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-accent DEFAULT" /> Professional Plan
            </h2>
            <p className="text-ink-secondary font-body">
              Your plan renews on <strong className="text-ink-primary">June 1, 2026</strong> for KES 15.00
            </p>
          </div>

          <div className="w-full md:w-72 bg-surface-soft rounded-xl p-4 border border-border">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-body font-medium text-ink-primary">Proposals used</span>
              <span className="text-sm font-mono font-semibold text-accent DEFAULT">{proposalsUsed} / {proposalsLimit}</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent DEFAULT rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${proposalsPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="text-xs font-body text-ink-tertiary mt-2 text-center">Resets in 12 days</p>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-surface-muted p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-1.5 rounded-md text-sm font-body font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-ink-primary shadow-sm'
                  : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-1.5 rounded-md text-sm font-body font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-white text-ink-primary shadow-sm'
                  : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              Annually
              <span className="text-xs font-body font-medium bg-accent-light text-accent-dark px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan, idx) => {
            const isCurrent = currentPlan === plan.name;
            const displayPrice = billingCycle === 'annual' && plan.price > 0
              ? getAnnualPrice(plan.price)
              : plan.price;
            const period = billingCycle === 'annual' && plan.price > 0 ? '/year' : '/month';
            const Icon = plan.icon;
            const isHighlight = plan.name === 'Professional';
            const isDark = plan.name === 'Enterprise';

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                className={`relative rounded-2xl border-2 p-6 flex flex-col transition-all ${
                  isHighlight
                    ? `${plan.bg} ${plan.border} shadow-md`
                    : isDark
                    ? `${plan.bg} ${plan.border} text-white`
                    : `bg-white ${plan.border} shadow-sm`
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-accent DEFAULT text-white text-xs font-body font-semibold px-3 py-0.5 rounded-full shadow-sm">
                    Most popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-body font-medium bg-accent-light text-accent-dark px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isDark ? 'bg-white/10' : 'bg-accent-light'
                  }`}>
                    <Icon className={`w-5 h-5 ${isDark ? 'text-accent-light' : plan.color}`} />
                  </div>
                  <h3 className={`font-body font-semibold text-xl mb-1 ${isDark ? 'text-white' : 'text-ink-primary'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm font-body ${isDark ? 'text-white/70' : 'text-ink-secondary'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-5">
                  <span className={`font-mono font-bold text-3xl ${isDark ? 'text-white' : 'text-ink-primary'}`}>
                    KES {displayPrice.toLocaleString()}
                  </span>
                  {plan.price > 0 && (
                    <span className={`text-sm font-body ml-1 ${isDark ? 'text-white/60' : 'text-ink-tertiary'}`}>
                      {period}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm font-body ${
                      isDark ? 'text-white/80' : 'text-ink-secondary'
                    }`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDark ? 'text-accent-light' : 'text-accent DEFAULT'
                      }`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isCurrent || updateSubscription.isPending}
                  className={`w-full py-2.5 rounded-lg font-body font-semibold text-sm transition-all focus:outline-none focus:ring-2 ${
                    isCurrent
                      ? 'bg-surface-muted text-ink-tertiary cursor-not-allowed'
                      : isHighlight
                      ? 'bg-brand-900 text-white hover:bg-brand-800 focus:ring-brand-900'
                      : isDark
                      ? 'bg-accent DEFAULT text-white hover:bg-accent-dark focus:ring-accent DEFAULT'
                      : 'border border-border text-ink-primary hover:bg-surface-muted focus:ring-brand-900'
                  }`}
                >
                  {isCurrent ? 'Current plan' : updateSubscription.isPending ? 'Processing...' : 'Upgrade plan'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Billing & Payment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Payment Methods */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-brand-900 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent DEFAULT" /> Payment methods
            </h3>

            <div className="p-4 border border-border rounded-xl flex items-center justify-between mb-4 bg-surface-soft">
              <div className="flex items-center gap-4">
                <div className="w-10 h-7 bg-surface-muted rounded flex items-center justify-center font-mono font-bold text-ink-tertiary text-xs">
                  VISA
                </div>
                <div>
                  <p className="font-body font-semibold text-sm text-ink-primary">Visa ending in 4242</p>
                  <p className="text-xs font-body text-ink-tertiary">Expires 12/28</p>
                </div>
              </div>
              <span className="text-xs font-body font-medium bg-accent-light text-accent-dark px-2 py-0.5 rounded-full">
                Default
              </span>
            </div>

            <button
              onClick={handleAddPaymentMethod}
              className="text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
            >
              + Add payment method
            </button>
          </div>

          {/* Billing History */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-brand-900 mb-5 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-accent DEFAULT" /> Billing history
            </h3>

            <div className="space-y-3">
              {BILLING_HISTORY.map((inv, idx) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-body font-semibold text-sm text-ink-primary">{inv.plan}</p>
                    <p className="text-xs font-body text-ink-tertiary">{inv.date} • {inv.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-sm text-ink-primary">KES {inv.amount.toLocaleString()}</p>
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
