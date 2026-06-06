// src/pages/freelancer/TutorialOnboardingPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ---------- Main Component ----------
export default function TutorialOnboardingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [toast, setToast] = useState(null);

  const onboardingSteps = [
    {
      title: 'Complete your profile',
      desc: 'Verify your identity, add your skills, and set up your public portfolio.',
      icon: ShieldCheck,
    },
    {
      title: 'Create service offerings',
      desc: 'Publish gigs with clear pricing, requirements, and delivery timelines.',
      icon: Sparkles,
    },
    {
      title: 'Set up payments',
      desc: 'Connect your payment method and configure your withdrawal preferences.',
      icon: BookOpen,
    },
  ];

  const handleNextStep = () => {
    if (activeStep === onboardingSteps.length - 1) {
      setToast({ type: 'success', message: 'Onboarding completed successfully!' });
      setTimeout(() => setToast(null), 3000);
      setActiveStep(0);
    } else {
      setActiveStep(prev => prev + 1);
      setToast({ type: 'success', message: `Step ${activeStep + 1} completed!` });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const StepIcon = onboardingSteps[activeStep].icon;
  const progressPercent = ((activeStep + 1) / onboardingSteps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-900">Onboarding guide</h1>
        </div>
        <p className="text-sm text-ink-secondary">
          Complete these steps to start receiving orders and grow your freelance business.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step indicators */}
        <div className="space-y-3">
          {onboardingSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                activeStep === idx
                  ? 'border-accent bg-accent-light'
                  : 'border-border bg-white hover:border-border-strong'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep === idx
                    ? 'bg-accent text-white'
                    : 'bg-surface-muted text-ink-secondary'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  activeStep === idx ? 'text-brand-900' : 'text-ink-secondary'
                }`}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active step content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-accent-light text-accent-dark rounded-xl">
                <StepIcon className="w-6 h-6" />
              </div>
              <Badge variant="success">
                Step {activeStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>

            <h3 className="text-xl font-display font-semibold text-brand-900 mb-3">
              {onboardingSteps[activeStep].title}
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed mb-8">
              {onboardingSteps[activeStep].desc}
            </p>

            <div className="pt-6 border-t border-border flex justify-between items-center">
              <div className="flex-1 max-w-[60%]">
                <div className="flex justify-between text-xs text-ink-tertiary mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <Button variant="primary" onClick={handleNextStep}>
                {activeStep === onboardingSteps.length - 1 ? 'Complete' : 'Next step'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
