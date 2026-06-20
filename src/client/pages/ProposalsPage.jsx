// ProposalsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Briefcase,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  DollarSign,
  User,
  Filter,
  RefreshCw,
  MoreHorizontal,
  X,
} from 'lucide-react';
import {
  useMyProposals,
  useProposalsForJob,
  useMyJobs,
  useAcceptProposal,
  useRejectProposal,
  useShortlistProposal,
} from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const STATUS_STYLES = {
  SUBMITTED: 'bg-info-light text-info border-info/20',
  ACCEPTED: 'bg-accent-light text-accent-dark border-accent/20',
  REJECTED: 'bg-danger-light text-danger border-danger/20',
  SHORTLISTED: 'bg-warn-light text-warn border-warn/20',
  WITHDRAWN: 'bg-surface-muted text-ink-tertiary border-border',
};

const TABS = ['All', 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];

export default function ProposalsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [toast, setToast] = useState(null);

  const { data: jobsData } = useMyJobs({ limit: 50 });
  const jobs = jobsData?.items || [];

  const filters = {
    page,
    limit: 15,
    ...(activeTab !== 'All' && { status: activeTab }),
  };

  const allProposals = useMyProposals(selectedJobId === 'all' ? filters : { enabled: false });
  const jobProposals = useProposalsForJob(selectedJobId !== 'all' ? selectedJobId : null, filters);
  const { data, isLoading, error, refetch } = selectedJobId === 'all' ? allProposals : jobProposals;

  const proposals = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();
  const shortlistMutation = useShortlistProposal();

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleAccept = async () => {
    if (!confirmModal) return;
    try {
      await acceptMutation.mutateAsync(confirmModal.proposalId);
      showToast('success', 'Proposal accepted! A contract has been created.');
      setConfirmModal(null);
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to accept proposal');
    }
  };

  const handleReject = async () => {
    if (!confirmModal) return;
    try {
      await rejectMutation.mutateAsync({ proposalId: confirmModal.proposalId, reason: rejectReason });
      showToast('success', 'Proposal rejected.');
      setConfirmModal(null);
      setRejectReason('');
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to reject proposal');
    }
  };

  const handleShortlist = async (proposalId) => {
    try {
      await shortlistMutation.mutateAsync(proposalId);
      showToast('success', 'Proposal shortlisted.');
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to shortlist');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900">Proposals</h1>
            <p className="text-sm text-ink-secondary mt-1">
              {total} proposal{total !== 1 ? 's' : ''} received. Review and hire top talent.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={() => navigate('/client-services/create-job')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Briefcase className="w-4 h-4" /> Post New Job
          </motion.button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-ink-tertiary shrink-0" />
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setPage(1);
              }}
              className="h-9 border border-border rounded-lg px-3 text-sm font-medium bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              <option value="all">All Jobs</option>
              {jobs.map((j) => (
                <option key={j.id || j._id} value={j.id || j._id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'bg-accent-light text-accent-dark'
                    : 'bg-transparent text-ink-tertiary hover:text-ink-primary hover:bg-surface-soft'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-tertiary hover:text-ink-primary transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Proposals Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-border rounded-2xl">
            <div className="w-8 h-8 border-4 border-surface-muted border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="text-ink-tertiary font-medium">Loading proposals...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-white border border-border rounded-2xl">
            <AlertCircle className="w-10 h-10 text-danger opacity-60" />
            <p className="text-ink-secondary text-sm font-medium">
              Failed to load proposals.{' '}
              <button onClick={() => refetch()} className="text-accent underline">
                Retry
              </button>
            </p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-border rounded-2xl text-center px-4">
            <div className="w-16 h-16 bg-surface-soft rounded-2xl flex items-center justify-center mb-4 border border-border">
              <Send className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-900 mb-2">No proposals found</h2>
            <p className="text-ink-secondary max-w-md mx-auto">No proposals match your current filters.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-soft text-ink-tertiary border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Freelancer</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Job Reference</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Terms</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Match</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {proposals.map((proposal, idx) => (
                    <motion.tr
                      key={proposal.id}
                      variants={tableRowVariants}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-surface-soft transition-colors group"
                    >
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-muted border border-border flex items-center justify-center shrink-0 text-sm font-semibold text-ink-primary">
                            {proposal.freelancer?.name?.[0] || <User className="w-4 h-4 text-ink-tertiary" />}
                          </div>
                          <div>
                            <div
                              className="text-sm font-semibold text-ink-primary group-hover:text-accent transition-colors cursor-pointer"
                              onClick={() => navigate(`/client/proposals/${proposal.id}`)}
                            >
                              {proposal.freelancer?.name || `Freelancer #${proposal.freelancerId}`}
                            </div>
                            <div className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(proposal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-ink-primary line-clamp-1">
                          {proposal.job?.title || `Job #${proposal.jobId}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border',
                            STATUS_STYLES[proposal.status] || STATUS_STYLES.SUBMITTED
                          )}
                        >
                          {proposal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-ink-primary flex items-center gap-1">
                          KES {(proposal.proposedBudget || proposal.bidAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {proposal.timeline || proposal.deliveryDays || '?'} days
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {proposal.matchScore ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-warn">
                            <Star className="w-4 h-4 fill-warn" /> {proposal.matchScore}%
                          </div>
                        ) : (
                          <span className="text-xs text-ink-tertiary font-medium">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          {proposal.status === 'SUBMITTED' || proposal.status === 'SHORTLISTED' ? (
                            <motion.button
                              whileTap={buttonTap}
                              onClick={() =>
                                setConfirmModal({
                                  type: 'accept',
                                  proposalId: proposal.id,
                                  name: proposal.freelancer?.name,
                                })
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-light text-accent-dark text-xs font-medium rounded-lg transition-colors border border-accent/20"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Hire
                            </motion.button>
                          ) : proposal.status === 'ACCEPTED' ? (
                            <motion.button
                              whileTap={buttonTap}
                              onClick={() => navigate('/client/contracts')}
                              className="px-3 py-1.5 bg-accent-light text-accent-dark text-xs font-medium rounded-lg transition-colors border border-accent/20"
                            >
                              Contract
                            </motion.button>
                          ) : (
                            <motion.button
                              whileTap={buttonTap}
                              onClick={() => navigate(`/client/proposals/${proposal.id}`)}
                              className="px-3 py-1.5 bg-surface-muted text-ink-secondary text-xs font-medium rounded-lg transition-colors border border-border"
                            >
                              View
                            </motion.button>
                          )}

                          {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                            <>
                              <button
                                onClick={() => setMenuOpen(menuOpen === proposal.id ? null : proposal.id)}
                                className="p-1.5 bg-surface-muted hover:bg-surface-soft text-ink-tertiary hover:text-ink-primary rounded-lg transition-colors border border-border"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              <AnimatePresence>
                                {menuOpen === proposal.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute right-0 top-10 w-48 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1"
                                  >
                                    {proposal.status !== 'SHORTLISTED' && (
                                      <button
                                        onClick={() => {
                                          handleShortlist(proposal.id);
                                          setMenuOpen(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-medium text-warn hover:bg-warn-light transition-colors flex items-center gap-2"
                                      >
                                        <Star className="w-3.5 h-3.5" /> Shortlist
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        navigate(`/client/proposals/${proposal.id}`);
                                        setMenuOpen(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                                    >
                                      View Full Proposal
                                    </button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button
                                      onClick={() => {
                                        setConfirmModal({
                                          type: 'reject',
                                          proposalId: proposal.id,
                                          name: proposal.freelancer?.name,
                                        });
                                        setMenuOpen(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-xs font-medium text-danger hover:bg-danger-light transition-colors flex items-center gap-2"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Decline
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <motion.button
              whileTap={buttonTap}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Previous
            </motion.button>
            <span className="text-sm font-medium text-ink-tertiary">
              Page {page} of {totalPages}
            </span>
            <motion.button
              whileTap={buttonTap}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Next
            </motion.button>
          </div>
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
              <h3 className="font-display text-xl font-bold text-brand-900 mb-2">Hire Freelancer</h3>
              <p className="text-sm text-ink-secondary mb-6">
                You are about to accept <span className="font-semibold text-ink-primary">{confirmModal.name}</span>'s
                proposal. A contract will be created automatically and they will be notified.
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

      {/* Reject Confirm Modal with reason */}
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
              className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
            >
              <h3 className="font-display text-xl font-bold text-brand-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-danger" /> Decline Proposal
              </h3>
              <p className="text-sm text-ink-secondary">
                You are declining <span className="font-semibold text-ink-primary">{confirmModal.name}</span>'s
                proposal. Provide a reason so they can improve next time.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for declining..."
                rows={3}
                className="w-full border border-border rounded-lg p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    setConfirmModal(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="px-5 py-2 bg-danger hover:bg-danger-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {rejectMutation.isPending ? 'Declining...' : 'Confirm Decline'}
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
