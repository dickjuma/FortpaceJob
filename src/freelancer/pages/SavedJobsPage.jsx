// src/pages/freelancer/SavedJobsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
  Heart,
  Search,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useSavedJobs, useUnsaveJob } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
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

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
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

const Input = ({ value, onChange, placeholder, className = '' }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-10 pl-9 pr-3 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${className}`}
    />
  </div>
);

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

// ---------- Helper Functions ----------
const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
};

const formatBudget = (job) => {
  if (job.budgetMax) {
    return `${job.budgetMin} - ${job.budgetMax}`;
  }
  return job.budget || 'Negotiable';
};

// ---------- Main Component ----------
export default function SavedJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const { data: savedJobsData, isLoading, error } = useSavedJobs();
  const unsaveJobMutation = useUnsaveJob();

  const savedJobs = savedJobsData?.items || savedJobsData || [];

  const handleUnsave = (id, jobTitle) => {
    unsaveJobMutation.mutate(id, {
      onSuccess: () => {
        setToast({ type: 'success', message: `Removed "${jobTitle}" from saved jobs` });
        setTimeout(() => setToast(null), 3000);
      },
      onError: (err) => {
        setToast({ type: 'error', message: err.message || 'Failed to remove job' });
        setTimeout(() => setToast(null), 3000);
      },
    });
  };

  const handleApply = (id) => {
    navigate(`/freelancer/jobs/${id}`);
  };

  const filteredJobs = savedJobs.filter((item) => {
    const job = item.job || item;
    const jobTitle = job.title || '';
    const companyName = job.client?.name || job.company || '';
    if (searchTerm && !jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) && !companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
        <p className="text-ink-secondary mb-4">Unable to load saved jobs.</p>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

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
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-danger-light text-danger rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Saved jobs</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Keep track of jobs you're interested in and apply when you're ready.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved jobs..."
        />
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <Bookmark className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-display font-semibold text-brand-900">No saved jobs</h3>
            <p className="text-sm text-ink-secondary mt-1 mb-6">
              You haven't saved any jobs yet. Start exploring the marketplace.
            </p>
            <Button variant="primary" onClick={() => navigate('/freelancer/jobs')}>
              Browse jobs
            </Button>
          </Card>
        ) : (
          filteredJobs.map((item) => {
            const job = item.job || item;
            const skills = job.skills
              ? typeof job.skills === 'string'
                ? JSON.parse(job.skills)
                : job.skills
              : job.tags || [];
            const savedDate = item.createdAt || job.savedAt || new Date().toISOString();

            return (
              <Card key={job.id} className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-medium text-ink-secondary">
                      {job.client?.name || job.company || 'Unknown client'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-xs text-ink-tertiary">
                      Saved {formatDate(savedDate)}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-display font-semibold text-brand-900 mb-3 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => handleApply(job.id)}
                  >
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                      <MapPin className="w-4 h-4 text-ink-tertiary" />
                      {job.type || job.locationType || 'Remote'}
                    </div>
                    <Badge variant="success" className="gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatBudget(job)}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                      <Clock className="w-4 h-4 text-ink-tertiary" />
                      {job.duration || 'Flexible'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                    {skills.length > 4 && (
                      <Badge variant="default">+{skills.length - 4} more</Badge>
                    )}
                  </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                  <Button variant="primary" onClick={() => handleApply(job.id)}>
                    Apply now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleUnsave(job.id, job.title)}
                    disabled={unsaveJobMutation.isPending}
                    className="text-danger hover:text-danger hover:border-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
