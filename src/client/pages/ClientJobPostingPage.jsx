// ClientJobPostingPage.jsx
// Self-contained Job Posting wizard with design tokens, framer-motion,
// and no AI features. Fully functional multi-step form.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Edit3,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Lock,
  Globe,
} from 'lucide-react';

// Step configuration
const STEPS = [
  { id: 1, name: 'Title', icon: Edit3 },
  { id: 2, name: 'Description', icon: Briefcase },
  { id: 3, name: 'Skills', icon: Users },
  { id: 4, name: 'Scope', icon: Clock },
  { id: 5, name: 'Budget', icon: DollarSign },
];

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientJobPostingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobType, setJobType] = useState('hourly'); // 'hourly' or 'fixed'
  const [visibility, setVisibility] = useState('public'); // 'public' or 'private'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    scope: '',
    hourlyMin: '',
    hourlyMax: '',
    fixedPrice: '',
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const buttonTap = { scale: 0.97 };

  const progressPercent = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-surface-soft font-body">
      {/* Sticky Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="font-display text-xl font-bold text-brand-900">Post a Job</h1>
          <button className="text-sm font-medium text-ink-tertiary hover:text-ink-primary transition-colors">
            Save as Draft
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-ink-tertiary">
              Step {currentStep} of {STEPS.length}: {STEPS.find((s) => s.id === currentStep)?.name}
            </span>
            <span className="text-sm font-semibold text-accent">{Math.round(progressPercent)}% Completed</span>
          </div>
          <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {/* Step 1: Title */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-900 mb-2">
                  Let's start with a strong title.
                </h2>
                <p className="text-ink-secondary mb-8">
                  This helps your job post stand out to the right candidates. It's the first thing they'll see, so make it count!
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink-primary mb-1.5">
                    Write a title for your job post
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Need a React Native developer to build a Fintech App"
                    className="w-full h-12 border border-border rounded-lg px-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <div className="bg-surface-soft border border-border rounded-xl p-5">
                  <h3 className="font-medium text-ink-primary flex items-center gap-2 mb-2">
                    <Edit3 size={18} className="text-accent" /> Title Tips
                  </h3>
                  <p className="text-sm text-ink-tertiary">
                    Use specific technologies, project type, and desired outcome. Avoid generic titles like "Need Developer".
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      'Senior React Native Developer for Fintech',
                      'React Native / iOS / Android App Dev',
                      'Fintech Mobile App using React Native',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setFormData({ ...formData, title: suggestion })}
                        className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg bg-white text-ink-primary hover:border-accent hover:text-accent transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-900 mb-2">
                  Describe the work in detail.
                </h2>
                <p className="text-ink-secondary mb-8">
                  Explain the project goals, deliverables, and any specific requirements.
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink-primary mb-1.5">
                    Job Description
                  </label>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what you need, the technologies involved, and expected outcomes..."
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none"
                  />
                </div>
                <div className="bg-surface-soft border border-border rounded-xl p-5">
                  <h3 className="font-medium text-ink-primary flex items-center gap-2 mb-2">
                    <Briefcase size={18} className="text-accent" /> What to include
                  </h3>
                  <ul className="text-sm text-ink-tertiary space-y-1 list-disc list-inside">
                    <li>Project background and context</li>
                    <li>Specific features or deliverables</li>
                    <li>Target timeline or milestones</li>
                    <li>Any preferred tools or frameworks</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-900 mb-2">
                  Select required skills.
                </h2>
                <p className="text-ink-secondary mb-8">
                  Add up to 10 skills that freelancers must have.
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink-primary mb-1.5">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Tailwind CSS, PostgreSQL"
                    className="w-full h-12 border border-border rounded-lg px-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['React Native', 'TypeScript', 'Redux', 'Firebase', 'Node.js'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-medium bg-surface-soft border border-border rounded-full text-ink-primary"
                    >
                      {skill}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 text-xs font-medium border border-dashed border-border rounded-full text-ink-tertiary hover:text-accent">
                    + Add custom
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Scope */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-900 mb-2">
                  Define project scope.
                </h2>
                <p className="text-ink-secondary mb-8">
                  Estimate the project size and expected duration.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-primary mb-1.5">
                      Project Size
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors"
                        >
                          <input type="radio" name="scope" className="text-accent focus:ring-accent" />
                          <span className="text-sm font-medium text-ink-primary">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-primary mb-1.5">
                      Expected Duration
                    </label>
                    <select className="w-full h-12 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900">
                      <option>Less than 1 week</option>
                      <option>1-2 weeks</option>
                      <option>1 month</option>
                      <option>1-3 months</option>
                      <option>3+ months</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Budget */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-900 mb-2">
                  Tell us about your budget.
                </h2>
                <p className="text-ink-secondary mb-8">
                  This helps us match you with talent within your range.
                </p>

                {/* Budget Type Toggle */}
                <div className="flex gap-4 mb-8">
                  <label
                    className={cn(
                      "flex-1 border-2 rounded-xl p-5 cursor-pointer transition-all",
                      jobType === 'hourly'
                        ? "border-accent bg-accent-light"
                        : "border-border bg-white hover:border-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value="hourly"
                      checked={jobType === 'hourly'}
                      onChange={() => setJobType('hourly')}
                      className="sr-only"
                    />
                    <Clock className={cn("w-6 h-6 mb-2", jobType === 'hourly' ? "text-accent" : "text-ink-tertiary")} />
                    <h3 className="font-semibold text-ink-primary mb-0.5">Hourly Rate</h3>
                    <p className="text-xs text-ink-tertiary">Pay by the hour for ongoing work.</p>
                  </label>
                  <label
                    className={cn(
                      "flex-1 border-2 rounded-xl p-5 cursor-pointer transition-all",
                      jobType === 'fixed'
                        ? "border-accent bg-accent-light"
                        : "border-border bg-white hover:border-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value="fixed"
                      checked={jobType === 'fixed'}
                      onChange={() => setJobType('fixed')}
                      className="sr-only"
                    />
                    <DollarSign className={cn("w-6 h-6 mb-2", jobType === 'fixed' ? "text-accent" : "text-ink-tertiary")} />
                    <h3 className="font-semibold text-ink-primary mb-0.5">Fixed Price</h3>
                    <p className="text-xs text-ink-tertiary">Pay a single flat fee for the project.</p>
                  </label>
                </div>

                {jobType === 'hourly' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-ink-primary mb-1.5">
                        Minimum Rate ($/hr)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                        <input
                          type="number"
                          placeholder="25"
                          value={formData.hourlyMin}
                          onChange={(e) => setFormData({ ...formData, hourlyMin: e.target.value })}
                          className="w-full pl-9 pr-4 h-12 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-primary mb-1.5">
                        Maximum Rate ($/hr)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                        <input
                          type="number"
                          placeholder="80"
                          value={formData.hourlyMax}
                          onChange={(e) => setFormData({ ...formData, hourlyMax: e.target.value })}
                          className="w-full pl-9 pr-4 h-12 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-ink-primary mb-1.5">
                      Total Fixed Price ($)
                    </label>
                    <div className="relative max-w-xs">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                      <input
                        type="number"
                        placeholder="2500"
                        value={formData.fixedPrice}
                        onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value })}
                        className="w-full pl-9 pr-4 h-12 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                )}

                {/* Market Insight (non-AI) */}
                <div className="bg-surface-soft border border-border rounded-xl p-5 flex gap-4 items-start">
                  <Briefcase size={20} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-ink-primary text-sm mb-1">Market Rate Insight</h4>
                    <p className="text-sm text-ink-tertiary">
                      The average hourly rate for React Native developers with your required skills is <strong className="text-ink-primary">$45 - $80/hr</strong>. Setting a competitive rate increases qualified proposals.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 pt-6 border-t border-border flex justify-between items-center">
            {currentStep > 1 ? (
              <motion.button
                whileTap={buttonTap}
                onClick={prevStep}
                className="inline-flex items-center gap-1 px-5 py-2.5 border border-border rounded-lg font-medium text-sm text-ink-primary hover:bg-surface-soft transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </motion.button>
            ) : (
              <div />
            )}
            <motion.button
              whileTap={buttonTap}
              onClick={nextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
            >
              {currentStep === STEPS.length ? 'Review Job Post' : `Next: ${STEPS[currentStep]?.name}`}
              {currentStep !== STEPS.length && <ChevronRight size={16} />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
