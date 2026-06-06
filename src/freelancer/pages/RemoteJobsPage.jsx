// src/pages/freelancer/RemoteJobsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Briefcase, Star, DollarSign, Clock, Eye, AlertCircle, CheckCircle } from 'lucide-react';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
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

// ---------- Main Component ----------
export default function RemoteJobsPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer (Next.js focus)',
      client: 'Vercel Ecosystem',
      budget: 95,
      type: 'Hourly Rate',
      timezone: 'EST Overlap',
      async: 'Preferred',
    },
    {
      id: 2,
      title: 'Node.js backend API designer',
      client: 'Stripe Orchestrations',
      budget: 12000,
      type: 'Fixed Price',
      timezone: 'Global Async',
      async: 'Required',
    },
    {
      id: 3,
      title: 'AWS Cloud DevOps & CI/CD Builder',
      client: 'SaaS Flow systems',
      budget: 85,
      type: 'Hourly Rate',
      timezone: 'CET Overlap',
      async: 'Optional',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const handleApplySimulate = (title) => {
    setToast({ type: 'loading', message: `Applying to "${title}"...` });
    setTimeout(() => {
      setToast({ type: 'success', message: `Applied to "${title}" successfully!` });
      setTimeout(() => setToast(null), 3000);
    }, 800);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast notification */}
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
            {toast.type === 'loading' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Remote jobs</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Browse fully remote, asynchronous, and timezone-flexible opportunities.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search remote contracts..."
        />
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info">{job.timezone}</Badge>
                <Badge variant={job.async === 'Required' ? 'success' : job.async === 'Preferred' ? 'warning' : 'default'}>
                  Async: {job.async}
                </Badge>
              </div>
              <h3 className="font-display font-semibold text-brand-900 text-lg leading-tight hover:text-accent transition-colors cursor-pointer">
                {job.title}
              </h3>
              <p className="text-xs font-medium text-ink-secondary">Client: {job.client}</p>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center shrink-0">
              <div className="text-right">
                <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">{job.type}</p>
                <p className="font-mono font-bold text-xl text-brand-900">
                  ${job.budget.toLocaleString()}
                  {job.type === 'Hourly Rate' && '/hr'}
                </p>
              </div>
              <Button variant="success" onClick={() => handleApplySimulate(job.title)}>
                Apply remote
              </Button>
            </div>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
            <h4 className="font-display font-semibold text-brand-900">No remote jobs found</h4>
            <p className="text-sm text-ink-secondary mt-1">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
