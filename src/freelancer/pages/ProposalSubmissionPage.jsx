// src/pages/freelancer/ProposalSubmissionPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  Send,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  ChevronRight,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useFreelancerJobById, useCreateProposal } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, ...props }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
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

const Input = ({ label, error, value, onChange, type = 'text', placeholder, icon: Icon, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-ink-tertiary" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? 'pl-9' : ''} ${error ? 'border-danger' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="text-danger text-xs mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, error, value, onChange, placeholder, rows = 4 }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${error ? 'border-danger' : ''}`}
    />
    {error && <p className="text-danger text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5 font-body">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-ink-tertiary" />
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white appearance-none ${Icon ? 'pl-9' : ''}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
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

// ---------- Helper functions (inline) ----------
const validatePositiveNumber = (value, fieldName) => {
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num <= 0) return `${fieldName} must be greater than 0`;
  return null;
};

const validateCoverLetter = (text, minLength = 50) => {
  if (!text.trim()) return 'Cover letter is required';
  if (text.trim().length < minLength) return `Cover letter must be at least ${minLength} characters`;
  return null;
};

// ---------- Main Component ----------
export default function ProposalSubmissionPage() {
  const { jobId } = useParams();
  const { data: job, isLoading } = useFreelancerJobById(jobId);
  const submitProposalMutation = useCreateProposal();

  const [step, setStep] = useState(1);
  const [hourlyRate, setHourlyRate] = useState('85');
  const [duration, setDuration] = useState('less_1');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const hourlyRateNum = parseFloat(hourlyRate) || 0;
  const fee = hourlyRateNum * 0.1;
  const youReceive = hourlyRateNum - fee;

  const durationOptions = [
    { value: 'less_1', label: 'Less than 1 month' },
    { value: '1_3', label: '1 to 3 months' },
    { value: '3_6', label: '3 to 6 months' },
    { value: 'more_6', label: 'More than 6 months' },
  ];

  const goToCoverLetter = () => {
    const rateErr = validatePositiveNumber(hourlyRate, 'Hourly rate');
    if (rateErr) {
      setToast({ type: 'error', message: rateErr });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    const coverErr = validateCoverLetter(coverLetter, 50);
    if (coverErr) {
      setToast({ type: 'error', message: coverErr });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    submitProposalMutation.mutate(
      { jobId, coverLetter, bidAmount: hourlyRateNum, deliveryDays: duration === 'less_1' ? 30 : 90 },
      {
        onSuccess: () => setIsSubmitted(true),
        onError: (err) => {
          setToast({ type: 'error', message: err.message || 'Failed to submit proposal' });
          setTimeout(() => setToast(null), 3000);
        }
      }
    );
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-20 text-center text-ink-secondary">Loading job...</div>;
  }

  if (!job) {
    return <div className="max-w-4xl mx-auto py-20 text-center text-ink-secondary">Job not found</div>;
  }

  const jobTitle = job.title;
  const clientBudget = job.budgetRange || (job.budgetMin && job.budgetMax ? `$${job.budgetMin} - $${job.budgetMax}` : 'Negotiable');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium bg-danger text-white"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back link */}
      <div className="mb-6">
        <Link
          to="/search/jobs"
          className="inline-flex items-center text-sm font-medium text-ink-secondary hover:text-brand-900 transition-colors"
        >
          ← Back to job search
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-brand-900">Submit proposal</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Submit your bid for "{jobTitle}".
        </p>
      </div>

      {/* Client budget card */}
      <Card className="mb-6">
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-brand-900">Client's budget</h3>
            <p className="text-sm text-ink-secondary">
              The client has specified an hourly budget of <strong className="text-ink-primary">{clientBudget}</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* Progress steps */}
      <div className="flex mb-6 gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              step >= s ? 'bg-accent' : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Main form card */}
      <Card className="overflow-hidden p-0">
        <div className="p-6 md:p-8">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-display font-semibold text-brand-900">Terms & pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Hourly rate (USD)"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  icon={DollarSign}
                  placeholder="e.g., 85"
                />
                <Select
                  label="Estimated duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  options={durationOptions}
                  icon={Clock}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-ink-secondary">10% platform fee</span>
                  <span className="text-sm font-mono text-ink-secondary">-${fee.toFixed(2)}/hr</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold text-ink-primary">You'll receive</span>
                  <span className="text-xl font-mono font-bold text-accent">${youReceive.toFixed(2)}/hr</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && !isSubmitted && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-display font-semibold text-brand-900">Cover letter</h2>

              <Textarea
                label="Cover letter"
                rows={8}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Introduce yourself and explain why you're a strong candidate for this job. Highlight relevant experience..."
              />

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <FileText className="w-8 h-8 text-ink-tertiary mx-auto mb-2" />
                <p className="text-sm font-medium text-ink-primary">Attach portfolio or resume</p>
                <p className="text-xs text-ink-tertiary mt-1">Drag & drop or click to upload (max 25MB)</p>
                <Button variant="ghost" className="mt-4 text-sm">
                  Select files
                </Button>
              </div>
            </motion.div>
          )}

          {isSubmitted && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent-dark" />
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-900 mb-2">Proposal submitted!</h2>
              <p className="text-ink-secondary text-sm max-w-md mx-auto mb-6">
                Your proposal has been sent to the client. You can track its status in your proposals dashboard.
              </p>
              <Link to="/freelancer/proposals">
                <Button variant="primary">View proposals dashboard</Button>
              </Link>
            </motion.div>
          )}

          {!isSubmitted && (
            <div className="mt-8 pt-6 border-t border-border flex justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={submitProposalMutation.isPending}
                className={`px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all ${
                  step === 1
                    ? 'invisible'
                    : 'text-ink-secondary hover:bg-surface-muted'
                } ${submitProposalMutation.isPending ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Back
              </button>

              {step < 2 ? (
                <Button variant="primary" onClick={goToCoverLetter}>
                  Write cover letter <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  disabled={submitProposalMutation.isPending}
                >
                  {submitProposalMutation.isPending ? 'Submitting...' : 'Submit proposal'}
                  {submitProposalMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
