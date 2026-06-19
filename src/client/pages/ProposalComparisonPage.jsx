// ProposalComparisonPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Star,
  DollarSign,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Download,
  MessageSquare,
  Briefcase,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Users,
  Send,
} from 'lucide-react';
import {
  useProposalsForJob,
  useJobDetails,
  useAcceptProposal,
  useRejectProposal,
} from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const COMPARE_FIELDS = [
  { label: 'Proposed Budget', key: (p) => `KES ${Number(p.proposedBudget || p.bidAmount || 0).toLocaleString()}`, highlight: 'budget' },
  { label: 'Timeline', key: (p) => p.timeline ? `${p.timeline} days` : (p.deliveryDays ? `${p.deliveryDays} days` : '—') },
  { label: 'Experience Level', key: (p) => p.freelancer?.experienceLevel || '—' },
  { label: 'Rating', key: (p) => p.freelancer?.rating ? `${Number(p.freelancer.rating).toFixed(1)} ⭐` : 'New', highlight: 'rating' },
  { label: 'Reviews', key: (p) => p.freelancer?.totalReviews ? `${p.freelancer.totalReviews} reviews` : '—' },
  { label: 'Location', key: (p) => p.freelancer?.location || '—' },
  { label: 'Skills', key: (p) => null, isSkills: true },
  { label: 'Status', key: (p) => p.status },
  { label: 'Submitted', key: (p) => new Date(p.createdAt).toLocaleDateString() },
];

function StatusBadge({ status }) {
  const styles = {
    SUBMITTED: 'bg-info-light text-info border-info/20',
    SHORTLISTED: 'bg-warn-light text-warn border-warn/20',
    ACCEPTED: 'bg-accent-light text-accent-dark border-accent/20',
    REJECTED: 'bg-danger-light text-danger border-danger/20',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${styles[status] || 'bg-surface-muted text-ink-tertiary border-border'}`}>
      {status}
    </span>
  );
}

export default function ProposalComparisonPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  const { data: job } = useJobDetails(jobId);
  const { data: proposalsData, isLoading, error, refetch } = useProposalsForJob(jobId, { limit: 100 });
  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();

  const allProposals = proposalsData?.items || [];

  const shortlisted = allProposals.filter(p => p.status === 'SHORTLISTED');
  const submitted = allProposals.filter(p => p.status === 'SUBMITTED');
  const topProposals = [...shortlisted, ...submitted].slice(0, 4);

  const compareProposals = topProposals.filter((_, i) =>
    selectedIds.size === 0 ? i < 3 : selectedIds.has(topProposals[i]?.id)
  ).slice(0, 4);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleAccept = async () => {
    if (!confirmModal) return;
    try {
      await acceptMutation.mutateAsync(confirmModal.proposalId);
      showToast('success', 'Proposal accepted! Contract created.');
      setConfirmModal(null);
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to accept proposal');
    }
  };

  const handleReject = async () => {
    if (!confirmModal) return;
    try {
      await rejectMutation.mutateAsync({ proposalId: confirmModal.proposalId, reason: '' });
      showToast('success', 'Proposal declined.');
      setConfirmModal(null);
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to decline proposal');
    }
  };

  const lowestBudget = Math.min(...compareProposals.map(p => Number(p.proposedBudget || p.bidAmount || Infinity)));
  const highestRating = Math.max(...compareProposals.map(p => Number(p.freelancer?.rating || 0)));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-900 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link
            to={`/client/jobs/${jobId}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-accent transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Pipeline
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-brand-900">Compare Proposals</h1>
              <p className="text-sm text-ink-secondary mt-1">
                Job: <span className="text-accent">{job?.title || `#${jobId}`}</span> • {allProposals.length} total proposals
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-ink-tertiary hover:text-accent transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error || allProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4 bg-white border border-border rounded-2xl">
            <Users className="w-12 h-12 text-ink-tertiary" />
            <p className="text-ink-secondary">
              {error ? 'Failed to load proposals.' : 'No proposals to compare yet.'}
            </p>
            <button
              onClick={() => navigate(`/client/jobs/${jobId}`)}
              className="text-sm text-accent hover:underline"
            >
              Go to Pipeline
            </button>
          </div>
        ) : (
          <>
            {/* Proposal Selector */}
            {allProposals.length > 3 && (
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-ink-tertiary mb-3">Select up to 4 proposals to compare:</p>
                <div className="flex flex-wrap gap-2">
                  {allProposals.map((p) => {
                    const isSelected =
                      selectedIds.size === 0
                        ? topProposals.slice(0, 3).some((t) => t.id === p.id)
                        : selectedIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          const next = new Set(
                            selectedIds.size === 0
                              ? topProposals.slice(0, 3).map((t) => t.id)
                              : selectedIds
                          );
                          if (next.has(p.id)) {
                            next.delete(p.id);
                          } else if (next.size < 4) {
                            next.add(p.id);
                          }
                          setSelectedIds(next);
                        }}
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          isSelected
                            ? 'bg-accent-light text-accent-dark border-accent/20'
                            : 'bg-white text-ink-secondary border-border hover:border-accent/30'
                        )}
                      >
                        {p.freelancer?.name || `Proposal #${p.id}`}
                        <StatusBadge status={p.status} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[640px] space-y-4">
                {/* Candidate Headers */}
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}
                >
                  <div /> {/* spacer */}
                  {compareProposals.map((proposal) => {
                    const f = proposal.freelancer || {};
                    const isTop = Number(f.rating || 0) === highestRating && highestRating > 0;
                    const isCheapest =
                      Number(proposal.proposedBudget || proposal.bidAmount || 0) === lowestBudget;
                    const initials = (f.name || 'F')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <div
                        key={proposal.id}
                        className={`relative bg-white border rounded-2xl p-4 text-center shadow-sm ${
                          isTop ? 'border-accent' : 'border-border'
                        }`}
                      >
                        {isTop && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-semibold">
                            TOP RATED
                          </span>
                        )}
                        {isCheapest && !isTop && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-semibold">
                            BEST PRICE
                          </span>
                        )}
                        <div className="w-12 h-12 rounded-full bg-surface-muted border border-border flex items-center justify-center text-sm font-bold text-ink-primary mx-auto mb-2 overflow-hidden">
                          {f.avatar ? (
                            <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <p className="font-semibold text-ink-primary text-sm">
                          {f.name || `Freelancer #${proposal.freelancerId}`}
                        </p>
                        <p className="text-xs text-ink-tertiary truncate">
                          {f.title || f.headline || ''}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={proposal.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Comparison Rows */}
                <div className="space-y-1">
                  {COMPARE_FIELDS.map((field) => (
                    <div
                      key={field.label}
                      className="grid gap-4 items-center"
                      style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}
                    >
                      <div className="text-xs text-ink-tertiary font-semibold py-3">
                        {field.label}
                      </div>
                      {compareProposals.map((proposal) => {
                        if (field.isSkills) {
                          const skills = proposal.freelancer?.skills || [];
                          return (
                            <div key={proposal.id} className="py-2">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(skills) ? skills : []).slice(0, 4).map((s, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] px-2 py-0.5 bg-accent-light text-accent-dark rounded-full border border-accent/20"
                                  >
                                    {typeof s === 'object' ? s.name : s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        const val = field.key(proposal);
                        const isBestBudget =
                          field.highlight === 'budget' &&
                          Number(proposal.proposedBudget || proposal.bidAmount || 0) === lowestBudget;
                        const isBestRating =
                          field.highlight === 'rating' &&
                          Number(proposal.freelancer?.rating || 0) === highestRating &&
                          highestRating > 0;
                        return (
                          <div
                            key={proposal.id}
                            className={cn(
                              'py-3 px-3 rounded-lg text-sm',
                              isBestBudget
                                ? 'text-accent font-semibold bg-accent-light'
                                : isBestRating
                                ? 'text-warn font-semibold bg-warn-light'
                                : 'text-ink-primary'
                            )}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Cover Letter Row */}
                  <div
                    className="grid gap-4 items-start pt-2"
                    style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}
                  >
                    <div className="text-xs text-ink-tertiary font-semibold pt-3">Cover Letter</div>
                    {compareProposals.map((proposal) => (
                      <div
                        key={proposal.id}
                        className="py-3 text-xs text-ink-secondary leading-relaxed line-clamp-4 bg-surface-soft rounded-lg p-3 border border-border"
                      >
                        {proposal.coverLetter || proposal.message || '—'}
                      </div>
                    ))}
                  </div>

                  {/* Action Row */}
                  <div
                    className="grid gap-4 items-start pt-4"
                    style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}
                  >
                    <div className="text-xs text-ink-tertiary font-semibold pt-3">Actions</div>
                    {compareProposals.map((proposal) => (
                      <div key={proposal.id} className="flex flex-col gap-2 py-2">
                        {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                          <motion.button
                            whileTap={buttonTap}
                            onClick={() =>
                              setConfirmModal({
                                type: 'accept',
                                proposalId: proposal.id,
                                name: proposal.freelancer?.name,
                              })
                            }
                            disabled={acceptMutation.isPending}
                            className="w-full py-2 bg-accent-light text-accent-dark border border-accent/20 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 hover:bg-accent/20 disabled:opacity-50"
                          >
                            <CheckCircle className="w-3 h-3" /> Accept
                          </motion.button>
                        )}
                        <motion.button
                          whileTap={buttonTap}
                          onClick={() => navigate(`/client/messages`)}
                          className="w-full py-2 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Message
                        </motion.button>
                        {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                          <motion.button
                            whileTap={buttonTap}
                            onClick={() =>
                              setConfirmModal({
                                type: 'reject',
                                proposalId: proposal.id,
                                name: proposal.freelancer?.name,
                              })
                            }
                            disabled={rejectMutation.isPending}
                            className="w-full py-2 bg-danger-light text-danger border border-danger/20 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 hover:bg-danger/20 disabled:opacity-50"
                          >
                            <XCircle className="w-3 h-3" /> Decline
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Accept Confirm Modal */}
      <AnimatePresence>
        {confirmModal?.type === 'accept' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="font-display text-xl font-bold text-brand-900 mb-2">Accept Proposal</h3>
              <p className="text-sm text-ink-secondary mb-6">
                Accept <span className="font-semibold text-ink-primary">{confirmModal.name}</span>'s proposal? A contract will be automatically created.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  disabled={acceptMutation.isPending}
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {acceptMutation.isPending ? 'Creating...' : 'Accept & Create Contract'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Confirm Modal */}
      <AnimatePresence>
        {confirmModal?.type === 'reject' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="font-display text-xl font-bold text-brand-900 mb-2">Decline Proposal</h3>
              <p className="text-sm text-ink-secondary mb-6">
                Decline <span className="font-semibold text-ink-primary">{confirmModal.name}</span>'s proposal? This action will notify them.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="px-5 py-2 bg-danger hover:bg-danger-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {rejectMutation.isPending ? 'Declining...' : 'Decline Proposal'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : 'rgb(254, 226, 226)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : 'rgb(185, 28, 28)',
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
