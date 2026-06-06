import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Layers, Award, Building2,
  ChevronLeft, ChevronRight, Check, ShieldCheck,
  Lock, TrendingUp, DollarSign, Users, Star,
  BarChart3, Zap, Clock, Globe, ArrowUp,
  Sparkles, Target, Briefcase,
} from 'lucide-react';
import { loadOnboardingDraft, saveOnboardingDraft } from '../utils/onboardingDraft';

// ─── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(' '); }

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Account', 'Role', 'Experience', 'Profile', 'Done'];
const STORAGE_KEY = 'forte_onboarding_experience';

const INDUSTRIES = [
  'Software & Technology', 'Design & Creative', 'Marketing & Growth',
  'Finance & Accounting', 'Writing & Content', 'Video & Animation',
  'Data & Analytics', 'Legal & Compliance', 'Sales & Business Dev',
  'Engineering', 'Education & Training', 'Healthcare & Medical',
];

const EXPERIENCE_LEVELS = [
  {
    id: 'BEGINNER',
    label: 'Beginner',
    sublabel: '0 – 1 yr experience',
    tagline: 'Just getting started',
    description: 'You\'re new to freelancing or recently graduated. You\'re building your portfolio and looking for your first clients.',
    icon: Sprout,
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/25',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500/30',
    bg: 'bg-emerald-50 dark:bg-emerald-950/25',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    checkBg: 'bg-success',
    earning: { min: 15, max: 45, avg: 28 },
    demand: 68,
    demandLabel: 'High demand for entry-level tasks',
    successRate: 82,
    activeJobs: '12,400+',
    color: 'emerald',
    perks: [
      'Guided onboarding & mentorship',
      'Entry-level project matching',
      'Skills verification fast-track',
      'Free portfolio builder',
    ],
  },
  {
    id: 'INTERMEDIATE',
    label: 'Intermediate',
    sublabel: '1 – 4 yrs experience',
    tagline: 'Growing your craft',
    description: 'You have solid experience and a portfolio. You can handle complex projects and work independently with clients.',
    icon: Layers,
    gradient: 'from-#4C1D95] to-violet-600',
    glow: 'shadow-#4C1D95]/25',
    border: 'border-[#4C1D95]/20',
    ring: 'ring-#4C1D95]/30',
    bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/25',
    iconBg: 'bg-gradient-to-br from-#4C1D95] to-violet-600',
    checkBg: 'bg-[#4C1D95]',
    earning: { min: 45, max: 95, avg: 65 },
    demand: 85,
    demandLabel: 'Very high demand — most sought-after tier',
    successRate: 91,
    activeJobs: '28,700+',
    color: 'blue',
    perks: [
      'Access to mid-tier client projects',
      'AI-powered job recommendations',
      'Priority proposal placement',
      'Verified skill badge',
    ],
  },
  {
    id: 'EXPERT',
    label: 'Expert',
    sublabel: '4+ yrs experience',
    tagline: 'Top-tier professional',
    description: 'You\'re a specialist with deep expertise, high client satisfaction, and a track record of delivering premium results.',
    icon: Award,
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/25',
    border: 'border-amber-500',
    ring: 'ring-amber-500/30',
    bg: 'bg-amber-50 dark:bg-amber-950/25',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    checkBg: 'bg-amber-500',
    earning: { min: 90, max: 250, avg: 140 },
    demand: 94,
    demandLabel: 'Premium demand — highest earning potential',
    successRate: 97,
    activeJobs: '9,800+',
    color: 'amber',
    perks: [
      'Expert badge & priority listing',
      'Access to enterprise contracts',
      'Dedicated account manager',
      '0% commission for first 60 days',
    ],
  },
  {
    id: 'AGENCY',
    label: 'Agency / Studio',
    sublabel: 'Team of 2+ professionals',
    tagline: 'Scale with your team',
    description: 'You run a team or studio. You want to take on large-scale projects, manage multiple clients, and grow your agency.',
    icon: Building2,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/25',
    border: 'border-rose-500',
    ring: 'ring-rose-500/30',
    bg: 'bg-rose-50 dark:bg-rose-950/25',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    checkBg: 'bg-rose-500',
    earning: { min: 150, max: 800, avg: 320 },
    demand: 78,
    demandLabel: 'Strong demand for team-based delivery',
    successRate: 95,
    activeJobs: '4,200+',
    color: 'rose',
    perks: [
      'Team workspace & collaboration tools',
      'Multi-member agency profile',
      'Bulk contract management',
      'Dedicated agency growth advisor',
    ],
  },
];

const DEFAULT_SKILLS = [
  { id: 'communication', label: 'Client Communication', confidence: 60 },
  { id: 'delivery', label: 'On-Time Delivery', confidence: 70 },
  { id: 'quality', label: 'Work Quality', confidence: 65 },
  { id: 'technical', label: 'Technical Proficiency', confidence: 55 },
  { id: 'problemsolving', label: 'Problem Solving', confidence: 60 },
];

const SIDEBAR_STATS = [
  { icon: Users, label: 'Active freelancers', value: '150K+', color: 'text-[#4C1D95]' },
  { icon: DollarSign, label: 'Avg. monthly earnings', value: '$4,200', color: 'text-success' },
  { icon: Clock, label: 'Avg. time to first hire', value: '< 48 hrs', color: 'text-#4C1D95]' },
  { icon: Star, label: 'Client satisfaction', value: '99.8%', color: 'text-amber-500' },
];

const DEMAND_DATA = [
  { level: 'Beginner', pct: 68, color: 'bg-success' },
  { level: 'Intermediate', pct: 85, color: 'bg-[#4C1D95]' },
  { level: 'Expert', pct: 94, color: 'bg-amber-400' },
  { level: 'Agency', pct: 78, color: 'bg-rose-500' },
];

// ─── Progress Stepper ─────────────────────────────────────────────────────────
function ProgressStepper({ currentStep = 2 }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
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
                    ? { scale: 1.18, backgroundColor: '#2563eb' }
                    : { scale: 1, backgroundColor: '#e2e8f0' }
                }
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              >
                {isCompleted
                  ? <Check className="w-4 h-4 text-white" />
                  : <span className={cn('text-xs font-bold', isCurrent ? 'text-white' : 'text-gray-400')}>{idx + 1}</span>
                }
              </motion.div>
              <span className={cn(
                'text-[10px] font-semibold tracking-wide uppercase hidden sm:block',
                isCurrent ? 'text-[#4C1D95] dark:text-[#4C1D95]'
                  : isCompleted ? 'text-[#4C1D95]' : 'text-gray-400'
              )}>{step}</span>
            </div>
            {!isLast && (
              <motion.div
                initial={false}
                animate={{ backgroundColor: isCompleted ? '#2563eb' : '#e2e8f0' }}
                transition={{ duration: 0.4 }}
                className="h-[2px] w-8 sm:w-14 mx-1 rounded-full"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Skill Confidence Slider ──────────────────────────────────────────────────
function SkillSlider({ skill, onChange, accentColor }) {
  const colorMap = {
    emerald: { track: 'bg-success', thumb: 'accent-emerald-500' },
    blue: { track: 'bg-[#4C1D95]', thumb: 'accent-blue-600' },
    amber: { track: 'bg-amber-500', thumb: 'accent-amber-500' },
    rose: { track: 'bg-rose-500', thumb: 'accent-rose-500' },
  };
  const colors = colorMap[accentColor] || colorMap.blue;

  const getLabel = (v) => {
    if (v < 25) return 'Learning';
    if (v < 50) return 'Developing';
    if (v < 75) return 'Proficient';
    if (v < 90) return 'Advanced';
    return 'Expert';
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{skill.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{getLabel(skill.confidence)}</span>
          <span className="text-xs font-extrabold text-zinc-900 dark:text-white w-8 text-right">{skill.confidence}%</span>
        </div>
      </div>
      <div className="relative h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-visible">
        <motion.div
          animate={{ width: `${skill.confidence}%` }}
          transition={{ duration: 0.3 }}
          className={cn('absolute left-0 top-0 h-full rounded-full', colors.track)}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={skill.confidence}
        onChange={(e) => onChange(skill.id, Number(e.target.value))}
        className={cn('w-full mt-1.5 h-1.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity', colors.thumb)}
        style={{ marginTop: '-18px', position: 'relative', zIndex: 10 }}
      />
    </div>
  );
}

// ─── Level Card ───────────────────────────────────────────────────────────────
function LevelCard({ level, isSelected, onClick }) {
  const Icon = level.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      aria-pressed={isSelected}
      className={cn(
        'relative w-full text-left rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300',
        'focus:outline-none focus-visible:ring-4', level.ring,
        isSelected
          ? `${level.border} ${level.bg} shadow-xl ${level.glow}`
          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm hover:shadow-md'
      )}
    >
      {/* Selection badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={cn('absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center', level.checkBg)}
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected glow overlay */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn('absolute inset-0 rounded-2xl bg-gradient-to-br pointer-events-none opacity-[0.06]', level.gradient)}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <div className={cn('inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg', level.iconBg)}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Label */}
      <div className="mb-1">
        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">{level.label}</h3>
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">{level.sublabel}</p>
      </div>

      {/* Tagline */}
      <p className={cn('text-sm font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent', level.gradient)}>
        {level.tagline}
      </p>

      {/* Description */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
        {level.description}
      </p>

      {/* Earning Range */}
      <div className={cn(
        'rounded-xl p-3 border mb-4',
        isSelected ? `${level.border} border-opacity-30 bg-white/60 dark:bg-surface-dark/30` : 'border-zinc-100 dark:border-zinc-700 bg-surface dark:bg-zinc-700/30'
      )}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Est. Hourly Rate</span>
          <DollarSign className={cn('w-3 h-3', isSelected ? 'text-success' : 'text-zinc-400')} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-extrabold text-zinc-900 dark:text-white">${level.earning.avg}</span>
          <span className="text-xs text-zinc-400">/hr avg</span>
        </div>
        <div className="text-[11px] text-zinc-400 mt-0.5">Range: ${level.earning.min} – ${level.earning.max}/hr</div>
        {/* Mini bar */}
        <div className="mt-2 h-1 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(level.earning.avg / 400) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className={cn('h-full rounded-full bg-gradient-to-r', level.gradient)}
          />
        </div>
      </div>

      {/* Perks */}
      <ul className="space-y-1.5">
        {level.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <span className={cn('flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br mt-0.5 flex items-center justify-center', level.gradient)}>
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </span>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium leading-snug">{perk}</span>
          </li>
        ))}
      </ul>
    </motion.button>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ selectedLevel }) {
  const level = EXPERIENCE_LEVELS.find((l) => l.id === selectedLevel);

  return (
    <aside className="w-full lg:w-80 xl:w-88 flex-shrink-0 space-y-5">
      {/* Marketplace Demand */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-[#4C1D95]" />
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Marketplace Demand</h3>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">Demand score by experience level (current market)</p>
        <div className="space-y-3">
          {DEMAND_DATA.map((d) => (
            <div key={d.level}>
              <div className="flex justify-between items-center mb-1">
                <span className={cn(
                  'text-xs font-bold',
                  selectedLevel === d.level.toUpperCase() || (selectedLevel === 'AGENCY' && d.level === 'Agency')
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400'
                )}>{d.level}</span>
                <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">{d.pct}%</span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.pct}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', d.color)}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Selected Level Insights */}
      <AnimatePresence mode="wait">
        {level ? (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className={cn('rounded-2xl border p-5 shadow-card', level.bg, level.border, 'border-opacity-40')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">{level.label} Insights</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Avg. Rate', value: `$${level.earning.avg}/hr`, icon: DollarSign },
                { label: 'Success Rate', value: `${level.successRate}%`, icon: Target },
                { label: 'Active Jobs', value: level.activeJobs, icon: Briefcase },
                { label: 'Demand Score', value: `${level.demand}%`, icon: TrendingUp },
              ].map(({ label, value, icon: Ic }) => (
                <div key={label} className="bg-white/70 dark:bg-surface-dark/40 rounded-xl p-3 border border-white/50 dark:border-zinc-700/50">
                  <Ic className="w-3.5 h-3.5 text-zinc-400 mb-1" />
                  <div className="text-sm font-extrabold text-zinc-900 dark:text-white">{value}</div>
                  <div className="text-[10px] text-zinc-400">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-white/60 dark:bg-surface-dark/30 border border-white/50 dark:border-zinc-700 p-3">
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{level.demandLabel}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 p-6 text-center"
          >
            <Target className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Select a level to see personalized insights</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marketplace Stats */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-teal-500" />
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Platform Stats</h3>
        </div>
        <div className="space-y-4">
          {SIDEBAR_STATS.map(({ icon: Ic, label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface dark:bg-zinc-700 flex items-center justify-center">
                  <Ic className={cn('w-3.5 h-3.5', color)} />
                </div>
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{label}</span>
              </div>
              <span className="text-sm font-extrabold text-zinc-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Success Story */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-5 shadow-lg shadow-#4C1D95]/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span className="text-xs font-extrabold text-white/90 uppercase tracking-wide">Success Story</span>
        </div>
        <p className="text-sm text-[#4C1D95] leading-relaxed mb-3 italic">
          "I joined as a Beginner with zero clients. Within 6 months I levelled up to Expert and now earn $140/hr."
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-extrabold">AR</div>
          <div>
            <div className="text-xs font-bold text-white">Alex R.</div>
            <div className="text-[10px] text-[#4C1D95]">Full Stack Developer · Expert</div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-emerald-300">
            <ArrowUp className="w-3 h-3" />
            <span className="text-[11px] font-bold">133% income</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}

// ─── Skill Sliders Panel ──────────────────────────────────────────────────────
function SkillsPanel({ skills, onSkillChange, level }) {
  if (!level) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border p-5 sm:p-6',
        level.bg, level.border, 'border-opacity-30',
        'bg-opacity-50'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Skill Confidence</h3>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-5">
        Drag each slider to reflect your confidence level. This helps us match you with the right projects.
      </p>
      <div className="space-y-5">
        {skills.map((skill) => (
          <SkillSlider key={skill.id} skill={skill} onChange={onSkillChange} accentColor={level.color} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Industry Selector ────────────────────────────────────────────────────────
function IndustrySelector({ selected, onToggle, level }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 sm:p-6 shadow-card">
      <div className="flex items-center gap-2 mb-1">
        <Globe className="w-4 h-4 text-zinc-500" />
        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Industry Experience</h3>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
        Select industries you have experience in (choose up to 4).
      </p>
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((industry) => {
          const isSelected = selected.includes(industry);
          const atMax = selected.length >= 4 && !isSelected;
          return (
            <motion.button
              key={industry}
              type="button"
              onClick={() => !atMax && onToggle(industry)}
              whileHover={!atMax ? { scale: 1.03 } : {}}
              whileTap={!atMax ? { scale: 0.97 } : {}}
              disabled={atMax}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200',
                isSelected
                  ? level
                    ? `border-transparent text-white bg-gradient-to-r ${level.gradient} shadow-sm`
                    : 'border-[#4C1D95]/20 text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20'
                  : atMax
                  ? 'border-zinc-100 dark:border-zinc-700 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                  : 'border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-500 hover:bg-surface dark:hover:bg-zinc-700/50'
              )}
            >
              {isSelected && <Check className="inline w-3 h-3 mr-1" strokeWidth={3} />}
              {industry}
            </motion.button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500">
          {selected.length}/4 selected
        </p>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ExperienceLevelPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingDraft = loadOnboardingDraft();

  const [selectedLevel, setSelectedLevel] = useState(
    () => onboardingDraft.experienceLevel || sessionStorage.getItem(STORAGE_KEY) || null
  );
  const [skills, setSkills] = useState(() => onboardingDraft.skillConfidence || DEFAULT_SKILLS);
  const [industries, setIndustries] = useState(() => onboardingDraft.industries || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist
  useEffect(() => {
    if (selectedLevel) sessionStorage.setItem(STORAGE_KEY, selectedLevel);
    saveOnboardingDraft({
      experienceLevel: selectedLevel,
      skillConfidence: skills,
      industries,
    });
  }, [industries, selectedLevel, skills]);

  const level = EXPERIENCE_LEVELS.find((l) => l.id === selectedLevel) || null;

  const handleSkillChange = useCallback((id, value) => {
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, confidence: value } : s));
  }, []);

  const handleIndustryToggle = (industry) => {
    setIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const handleContinue = async () => {
    if (!selectedLevel || isSubmitting) return;
    setIsSubmitting(true);
    navigate('/auth/availability', {
      state: {
        ...(location.state || {}),
        experienceLevel: selectedLevel,
        skills,
        industries,
      },
    });
  };

  const canContinue = !!selectedLevel && industries.length > 0;

  return (
    <div className="relative min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-[#4C1D95]/30 overflow-x-hidden">
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#4C1D95]/8 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-#4C1D95]/8 blur-[130px]" />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-amber-400/8 blur-[110px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top header */}
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 bg-[#4C1D95] rounded-xl flex items-center justify-center shadow-lg shadow-[#4C1D95]/25/30">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Forte<span className="text-[#4C1D95]">.</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">Your data is encrypted</span>
          </motion.div>
        </div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="px-4 max-w-4xl mx-auto w-full"
        >
          <ProgressStepper currentStep={2} />
        </motion.div>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center px-4 mb-8 max-w-xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            What's your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-#4C1D95] to-amber-500 bg-clip-text text-transparent">
              experience level?
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
            This helps us match you with the right projects and clients. You can always update this later.
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">

            {/* Left column — cards + panels */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Level Cards */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {EXPERIENCE_LEVELS.map((lvl, i) => (
                  <motion.div
                    key={lvl.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                  >
                    <LevelCard
                      level={lvl}
                      isSelected={selectedLevel === lvl.id}
                      onClick={() => setSelectedLevel((prev) => prev === lvl.id ? null : lvl.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Skill Sliders */}
              <AnimatePresence>
                {level && (
                  <motion.div
                    key={`skills-${level.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SkillsPanel skills={skills} onSkillChange={handleSkillChange} level={level} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Industry Selector */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <IndustrySelector selected={industries} onToggle={handleIndustryToggle} level={level} />
              </motion.div>

              {/* Footer actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2"
              >
                {/* Back */}
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-tranzinc-x-0.5 transition-transform" />
                  Back
                </button>

                {/* Validation hint */}
                <AnimatePresence mode="wait">
                  {!canContinue && (
                    <motion.p
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-zinc-400 dark:text-zinc-500 text-center"
                    >
                      {!selectedLevel
                        ? 'Select your experience level to continue'
                        : 'Choose at least one industry to continue'}
                    </motion.p>
                  )}
                  {canContinue && (
                    <motion.p
                      key="ready"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-success dark:text-success"
                    >
                      ✓ Ready — looking great!
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Continue */}
                <motion.button
                  type="button"
                  onClick={handleContinue}
                  disabled={!canContinue || isSubmitting}
                  whileHover={canContinue ? { scale: 1.03 } : {}}
                  whileTap={canContinue ? { scale: 0.97 } : {}}
                  className={cn(
                    'flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300',
                    'focus:outline-none focus-visible:ring-4 focus-visible:ring-#4C1D95]/40',
                    canContinue
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-#4C1D95]/25 hover:shadow-xl hover:shadow-#4C1D95]/35'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
            </div>

            {/* Right sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full lg:w-80 xl:w-84"
            >
              <Sidebar selectedLevel={selectedLevel} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


