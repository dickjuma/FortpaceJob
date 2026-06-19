// src/pages/freelancer/ProposalsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Clock,
  FileText,
  BarChart2,
  Zap,
  XCircle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useFreelancerProposals, useWithdrawProposal, useFreelancerDashboard } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, ...props }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
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

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md z-50"
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-display font-bold text-brand-900">{title}</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-ink-secondary">{message}</p>
          </div>
          <div className="p-6 pt-0 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant={isDestructive ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-xs font-medium text-ink-secondary uppercase tracking-wide">{title}</p>
    <p className="text-3xl font-mono font-semibold text-brand-900 mt-1">{value}</p>
  </Card>
);

// ---------- Main Component ----------
export default function ProposalsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Proposals');
  const [page, setPage] = useState(1);
  const [withdrawModal, setWithdrawModal] = useState({ isOpen: false, id: null });
  const [toast, setToast] = useState(null);

  const { data: dashboardData } = useFreelancerDashboard();
  const { data, isLoading: loading } = useFreelancerProposals({ page, limit: 10, status: filter === 'All Proposals' ? undefined : filter.toUpperCase() });
  const proposals = data?.items || [];
  const withdrawMutation = useWithdrawProposal();

  const activeProposalsCount = dashboardData?.proposals?.total || proposals.filter(p => {
    const status = p.status?.toUpperCase() || '';
    return status !== 'DECLINED' && status !== 'WITHDRAWN';
  }).length || 0;

  const clientViewsCount = proposals.reduce((sum, p) => sum + (p.clientViews || p.views || 0), 0) || 0;

  const interviewsCount = proposals.filter(p => {
    const status = p.status?.toUpperCase() || '';
    return status === 'SHORTLISTED' || status === 'INTERVIEW';
  }).length || 0;

  const winRate = dashboardData?.proposals?.successRate !== undefined
    ? `${dashboardData.proposals.successRate}%`
    : (proposals.length > 0
        ? `${Math.round((proposals.filter(p => p.status?.toUpperCase() === 'ACCEPTED').length / proposals.length) * 100)}%`
        : '0%');

  const getProgressWidth = (status) => {
    const s = status?.toUpperCase() || '';
    switch(s) {
      case 'SUBMITTED': return 'w-1/4 bg-ink-tertiary';
      case 'VIEWED': return 'w-2/4 bg-accent';
      case 'SHORTLISTED': return 'w-3/4 bg-accent';
      case 'DECLINED': return 'w-full bg-danger';
      default: return 'w-0';
    }
  };

  const getStatusVariant = (status) => {
    const s = status?.toUpperCase() || '';
    if (s === 'SHORTLISTED' || s === 'INTERVIEW') return 'success';
    if (s === 'VIEWED') return 'info';
    if (s === 'DECLINED') return 'danger';
    if (s === 'ACCEPTED') return 'success';
    return 'default';
  };

  const handleWithdraw = (id, e) => {
    e.stopPropagation();
    setWithdrawModal({ isOpen: true, id });
  };

  const confirmWithdraw = () => {
    if (withdrawModal.id) {
      withdrawMutation.mutate(withdrawModal.id, {
        onSuccess: () => {
          setToast({ type: 'success', message: 'Proposal withdrawn' });
          setTimeout(() => setToast(null), 3000);
          setWithdrawModal({ isOpen: false, id: null });
        },
        onError: (err) => {
          setToast({ type: 'error', message: err.message || 'Failed to withdraw proposal' });
          setTimeout(() => setToast(null), 3000);
          setWithdrawModal({ isOpen: false, id: null });
        }
      });
    }
  };

  if (loading && proposals.length === 0) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 pb-12"
    >
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={withdrawModal.isOpen}
        onClose={() => setWithdrawModal({ isOpen: false, id: null })}
        onConfirm={confirmWithdraw}
        title="Withdraw proposal"
        message="Are you sure you want to withdraw this proposal? This action cannot be undone."
        confirmText={withdrawMutation.isPending ? "Withdrawing..." : "Withdraw"}
        isDestructive={true}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <Send size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Proposals</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Track your submitted proposals, client views, and interview invitations.
          </p>
        </div>
        <Link to="/freelancer/jobs">
          <Button variant="primary">
            <Zap size={16} /> Find more jobs
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active proposals" value={activeProposalsCount} icon={Clock} colorClass="bg-surface-muted text-ink-primary" />
        <StatCard title="Client views" value={clientViewsCount} icon={FileText} colorClass="bg-accent-light text-accent-dark" />
        <StatCard title="Interviews" value={interviewsCount} icon={CheckCircle} colorClass="bg-accent-light text-accent-dark" />
        <StatCard title="Win rate" value={winRate} icon={BarChart2} colorClass="bg-danger-light text-danger" />
      </div>

      {/* Proposals Table */}
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-display font-semibold text-brand-900">Recent proposals</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 pl-3 pr-8 border border-border rounded-lg text-sm font-body text-ink-primary bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            <option>All Proposals</option>
            <option>Active</option>
            <option>Shortlisted</option>
            <option>Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {proposals.length === 0 && !loading ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-brand-900">No proposals found</h3>
              <p className="text-sm text-ink-secondary mt-1">You haven't submitted any proposals matching this filter.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-surface-muted text-ink-tertiary text-xs font-medium uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4">Job / Client</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Bid</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {proposals.map((proposal) => (
                  <motion.tr
                    key={proposal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#FAFAF8' }}
                    className="cursor-pointer transition-colors"
                    onClick={() => navigate(`/freelancer/proposals/${proposal.id}`)}
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-medium text-ink-primary">
                          {proposal.job?.title || proposal.jobTitle || 'Untitled job'}
                        </p>
                        <p className="text-xs text-ink-tertiary mt-0.5">
                          Client: {proposal.job?.client?.name || proposal.client || 'Unknown'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-ink-secondary">
                      {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-5 font-mono font-semibold text-brand-900">
                      {proposal.proposedPrice ? `KES ${proposal.proposedPrice.toLocaleString()}` : proposal.amount || '—'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant={getStatusVariant(proposal.status)}>
                          {proposal.status || 'Submitted'}
                        </Badge>
                        <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${getProgressWidth(proposal.status)}`} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="danger"
                          className="px-3 py-1.5 text-sm"
                          onClick={(e) => handleWithdraw(proposal.id, e)}
                        >
                          <XCircle size={14} /> Withdraw
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-3 py-1.5 text-sm"
                          onClick={(e) => { e.stopPropagation(); navigate(`/freelancer/proposals/${proposal.id}`); }}
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
