// src/pages/freelancer/ProposalDetailsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  Send,
  Clock,
  FileText,
  CheckCircle,
  ChevronLeft,
  Building,
  Pencil,
  Eye,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useProposalById } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline for self‑containment) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', ...props }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
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

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

// ---------- Main Component ----------
export default function ProposalDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProposalById(id);
  const proposal = data?.proposal || data?.data || data;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  // Format currency
  const formatPrice = (price) => {
    if (price == null) return '—';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !proposal) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
        <p className="text-ink-secondary mb-4">Proposal not found or unavailable.</p>
        <Link to="/freelancer/proposals">
          <Button variant="ghost">Back to proposals</Button>
        </Link>
      </div>
    );
  }

  const jobTitle = proposal.job?.title || proposal.jobTitle || 'Job';
  const clientName =
    proposal.job?.client?.companyName ||
    proposal.client?.name ||
    proposal.clientName ||
    'Client';
  const status = proposal.status || 'SUBMITTED';
  const coverLetter = proposal.coverLetter || proposal.message || proposal.description || '';
  const bidAmount = proposal.proposedPrice ?? proposal.bid;
  const submittedAt = proposal.createdAt;

  // Map status to badge variant
  const getStatusVariant = (status) => {
    const s = status.toUpperCase();
    if (s === 'HIRED' || s === 'ACCEPTED') return 'success';
    if (s === 'REJECTED' || s === 'DECLINED') return 'danger';
    if (s === 'VIEWED') return 'info';
    if (s === 'SUBMITTED' || s === 'PENDING') return 'warning';
    return 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Navigation back */}
      <div className="mb-6">
        <Link
          to="/freelancer/proposals"
          className="inline-flex items-center text-sm font-medium text-ink-secondary hover:text-brand-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to proposals
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-brand-900">
            {jobTitle}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-ink-secondary">
            <Building className="w-4 h-4" />
            <span className="text-sm">{clientName}</span>
          </div>
        </div>
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status.toLowerCase()}
        </Badge>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cover letter section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h2 className="font-display font-semibold text-brand-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Cover letter
            </h2>
            <div className="prose prose-sm max-w-none text-ink-secondary whitespace-pre-wrap leading-relaxed">
              {coverLetter || 'No cover letter provided.'}
            </div>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-2">
              Your bid
            </p>
            <p className="text-2xl font-mono font-semibold text-brand-900">
              {formatPrice(bidAmount)}
            </p>
          </Card>

          <Card>
            <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-2">
              Submitted
            </p>
            <p className="text-sm text-ink-primary">{formatDate(submittedAt)}</p>
          </Card>

          {proposal.jobId && (
            <Link to={`/freelancer/job/${proposal.jobId}`}>
              <Button variant="primary" className="w-full">
                View job posting
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
