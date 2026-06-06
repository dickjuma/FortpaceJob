import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Layers,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  TrendingUp,
  Users,
  Lock,
} from 'lucide-react';
import { saveOnboardingDraft } from '../utils/onboardingDraft';

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: 'FREELANCER',
    label: 'Freelancer',
    tagline: 'Earn by offering your skills.',
    description:
      'Turn your expertise into income. Set your own rates, pick your clients, and work on projects you love.',
    icon: Briefcase,
    gradient: 'from-#4C1D95] via-#4C1D95] to-[#22C55E]',
    glow: 'shadow-#4C1D95]/30',
    border: 'border-#4C1D95]',
    ring: 'ring-#4C1D95]/40',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    iconBg: 'bg-gradient-to-br from-#4C1D95] to-[#22C55E]',
    checkBg: 'bg-violet-600',
    benefits: [
      { icon: Zap, text: 'Set your own rates & schedule' },
      { icon: Globe, text: 'Work with global clients' },
      { icon: Star, text: 'Build a verified portfolio' },
      { icon: TrendingUp, text: 'Grow your reputation & earnings' },
    ],
    useCase:
      '"A designer lands 3 international projects within their first week."',
  },
  {
    id: 'CLIENT',
    label: 'Client',
    tagline: 'Hire professionals for your projects.',
    description:
      'Post a job in minutes and connect with vetted, top-tier talent ready to deliver exceptional work.',
    icon: Building2,
    gradient: 'from-sky-400 via-cyan-500 to-teal-500',
    glow: 'shadow-sky-500/30',
    border: 'border-sky-500',
    ring: 'ring-sky-500/40',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    iconBg: 'bg-gradient-to-br from-sky-400 to-teal-500',
    checkBg: 'bg-sky-500',
    benefits: [
      { icon: Users, text: 'Access 50,000+ verified freelancers' },
      { icon: ShieldCheck, text: 'Secure escrow payments' },
      { icon: Zap, text: 'First proposals in under 1 hour' },
      { icon: Star, text: 'Satisfaction guarantee' },
    ],
    useCase:
      '"A startup ships their MVP in 3 weeks using Forte talent."',
  },
  {
    id: 'BOTH',
    label: 'Both',
    tagline: 'Work and hire from one account.',
    description:
      'The best of both worlds. Switch seamlessly between hiring talent and offering your own skills—all in one place.',
    icon: Layers,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    glow: 'shadow-orange-500/30',
    border: 'border-orange-500',
    ring: 'ring-orange-500/40',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    iconBg: 'bg-gradient-to-br from-amber-400 to-rose-500',
    checkBg: 'bg-orange-500',
    benefits: [
      { icon: Layers, text: 'One dashboard, two modes' },
      { icon: TrendingUp, text: 'Dual income streams' },
      { icon: Globe, text: 'Build & hire globally' },
      { icon: ShieldCheck, text: 'Unified secure wallet' },
    ],
    useCase:
      '"A developer freelances on weekends while hiring designers for their SaaS."',
  },
];

// ─── Progress Steps ───────────────────────────────────────────────────────────

const STEPS = ['Account', 'Role', 'Profile', 'Done'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressIndicator({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={
                  isCompleted
                    ? { scale: 1, backgroundColor: '#2563eb' }
                    : isCurrent
                    ? { scale: 1.15, backgroundColor: '#2563eb' }
                    : { scale: 1, backgroundColor: '#e2e8f0' }
                }
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[10px] font-semibold tracking-wide uppercase hidden sm:block ${
                  isCurrent
                    ? 'text-[#4C1D95] dark:text-[#4C1D95]'
                    : isCompleted
                    ? 'text-[#4C1D95] dark:text-[#4C1D95]'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#2563eb' : '#e2e8f0',
                }}
                transition={{ duration: 0.4 }}
                className="h-[2px] w-10 sm:w-16 mx-1 rounded-full"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function RoleCard({ role, isSelected, onClick }) {
  const Icon = role.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      aria-pressed={isSelected}
      className={`
        relative w-full text-left rounded-2xl border-2 p-5 sm:p-6 cursor-pointer
        transition-all duration-300 focus:outline-none focus-visible:ring-4
        ${role.ring}
        ${
          isSelected
            ? `${role.border} ${role.bg} shadow-xl ${role.glow}`
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-card hover:shadow-card-hover'
        }
      `}
    >
      {/* Selection Badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`absolute top-4 right-4 w-6 h-6 ${role.checkBg} rounded-full flex items-center justify-center`}
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Glow Blob (selected only) */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-[0.07] pointer-events-none`}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${role.iconBg} shadow-lg mb-4`}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>

      {/* Label & Tagline */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
        {role.label}
      </h3>
      <p
        className={`text-sm font-semibold mb-2 bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}
      >
        {role.tagline}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
        {role.description}
      </p>

      {/* Benefits */}
      <ul className="space-y-2 mb-4">
        {role.benefits.map(({ icon: BenefitIcon, text }) => (
          <li key={text} className="flex items-center gap-2">
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}
            >
              <BenefitIcon className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              {text}
            </span>
          </li>
        ))}
      </ul>

      {/* Use Case */}
      <div
        className={`rounded-xl px-3 py-2 bg-gradient-to-br ${role.gradient} bg-opacity-10 border ${role.border} border-opacity-20`}
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <p className="text-[11px] italic text-gray-500 dark:text-gray-400 leading-relaxed">
          {role.useCase}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'forte_onboarding_role';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) || null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist selection across reloads / back-forward navigation
  useEffect(() => {
    if (selected) {
      sessionStorage.setItem(STORAGE_KEY, selected);
      saveOnboardingDraft({ onboardingRole: selected });
    }
  }, [selected]);

  const handleSelect = (roleId) => {
    setSelected((prev) => (prev === roleId ? null : roleId));
  };

  const handleContinue = async () => {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);

    const routes = {
      FREELANCER: '/auth/skills',
      CLIENT: '/client/dashboard',
      BOTH: '/auth/skills',
    };
    navigate(routes[selected] ?? '/', {
      state: { role: selected, ...(location.state || {}) },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-surface dark:bg-gray-950 font-sans selection:bg-[#4C1D95] selection:text-white overflow-hidden">
      {/* ── Floating Gradient Orbs ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-#4C1D95]/10 dark:bg-#4C1D95]/8 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-sky-400/10 dark:bg-sky-400/8 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-orange-400/10 dark:bg-orange-400/8 blur-[100px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-10 sm:py-14">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-9 h-9 bg-[#4C1D95] rounded-xl flex items-center justify-center shadow-lg shadow-[#4C1D95]/25/30">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Forte<span className="text-[#4C1D95]">.</span>
          </span>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full max-w-3xl"
        >
          <ProgressIndicator currentStep={1} />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center mb-8 max-w-lg"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            How will you use{' '}
            <span className="bg-gradient-to-r from-[#4C1D95] via-#4C1D95] to-cyan-500 bg-clip-text text-transparent">
              Forte?
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Choose your role to personalise your experience. You can always
            change this later.
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {ROLES.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
            >
              <RoleCard
                role={role}
                isSelected={selected === role.id}
                onClick={() => handleSelect(role.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-8 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Back */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-tranzinc-x-0.5 transition-transform" />
            Back
          </button>

          {/* Selection hint */}
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-400 dark:text-gray-500 sm:absolute sm:left-1/2 sm:-tranzinc-x-1/2"
              >
                Select a role to continue
              </motion.p>
            ) : (
              <motion.p
                key="selected"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-semibold text-[#4C1D95] dark:text-[#4C1D95] sm:absolute sm:left-1/2 sm:-tranzinc-x-1/2"
              >
                ✓ {ROLES.find((r) => r.id === selected)?.label} selected
              </motion.p>
            )}
          </AnimatePresence>

          {/* Continue */}
          <motion.button
            type="button"
            onClick={handleContinue}
            disabled={!selected || isSubmitting}
            whileHover={selected ? { scale: 1.03 } : {}}
            whileTap={selected ? { scale: 0.97 } : {}}
            className={`
              relative flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold
              transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-#4C1D95]/40
              ${
                selected
                  ? 'bg-[#4C1D95] hover:bg-[#22C55E] text-white shadow-lg shadow-[#4C1D95]/25/30 hover:shadow-xl hover:shadow-[#4C1D95]/25/40'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Saving…</span>
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Security footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600"
        >
          <Lock className="w-3 h-3" />
          <span>Your data is encrypted and never shared</span>
        </motion.div>
      </div>
    </div>
  );
}


