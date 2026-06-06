// ContractDetailsPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, User, DollarSign, Calendar, CheckCircle, XCircle,
  Clock, AlertCircle, ArrowLeft, MessageSquare, Flag, Award,
  ChevronDown, ChevronUp, Unlock, Lock, TrendingUp, HelpCircle,
  Shield
} from 'lucide-react';
import {
  useContractDetails, useContractMilestones, useApproveMilestone,
  useRejectMilestone, useCancelContract, useSignContract, useWallet
} from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const STATUS_STYLES = {
  ACTIVE:    'bg-accent-light text-accent-dark border-accent/20',
  PENDING:   'bg-warn-light text-warn border-warn/20',
  COMPLETED: 'bg-info-light text-info border-info/20',
  CANCELLED: 'bg-danger-light text-danger border-danger/20',
  TERMINATED:'bg-surface-muted text-ink-tertiary border-border',
};

const MS_STATUS = {
  APPROVED:    { label: 'Approved & Paid', icon: CheckCircle, color: 'text-accent-dark', bg: 'bg-accent-light' },
  SUBMITTED:   { label: 'In Review',       icon: Clock,       color: 'text-warn',        bg: 'bg-warn-light' },
  IN_PROGRESS: { label: 'In Progress',     icon: TrendingUp,  color: 'text-info',        bg: 'bg-info-light' },
  PENDING:     { label: 'Pending',         icon: Clock,       color: 'text-ink-tertiary',bg: 'bg-surface-muted' },
  REJECTED:    { label: 'Revisions Requested', icon: AlertCircle, color: 'text-danger',   bg: 'bg-danger-light' },
  DISPUTED:    { label: 'Disputed',        icon: Flag,        color: 'text-warn',        bg: 'bg-warn-light' },
};

export default function ContractDetailsPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [expandedMs, setExpandedMs] = useState(null);
  const [toast, setToast] = useState(null);

  const { data: contract, isLoading, error } = useContractDetails(contractId);
  const { data: milestones = [], isLoading: msLoading, refetch: refetchMs } = useContractMilestones(contractId);
  const { refetch: refetchWallet } = useWallet();

  const approveMilestone = useApproveMilestone(contractId);
  const rejectMilestone = useRejectMilestone(contractId);
  const cancelContract = useCancelContract();
  const signContract = useSignContract(contractId);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleApprove = async (milestoneId, amount) => {
    try {
      await approveMilestone.mutateAsync(milestoneId);
      showToast('success', `Milestone approved! KES ${Number(amount).toLocaleString()} released.`);
      refetchMs();
      refetchWallet();
      setConfirmModal(null);
    } catch (err) {
      showToast('error', err.message || 'Failed to approve milestone.');
    }
  };

  const handleReject = async () => {
    if (!confirmModal || !rejectFeedback.trim()) return;
    try {
      await rejectMilestone.mutateAsync({ milestoneId: confirmModal.milestoneId, feedback: rejectFeedback });
      showToast('success', 'Revision request sent to freelancer.');
      setConfirmModal(null);
      setRejectFeedback('');
      refetchMs();
    } catch (err) {
      showToast('error', err.message || 'Failed to reject milestone.');
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    try {
      await cancelContract.mutateAsync({ contractId: Number(contractId), reason: cancelReason });
      showToast('success', 'Contract cancelled successfully.');
      setConfirmModal(null);
      setCancelReason('');
    } catch (err) {
      showToast('error', err.message || 'Failed to cancel contract.');
    }
  };

  const handleSign = async () => {
    try {
      await signContract.mutateAsync();
      showToast('success', 'Contract signed successfully! Escrow funded.');
      setConfirmModal(null);
      refetchWallet();
    } catch (err) {
      showToast('error', err.message || 'Failed to sign contract.');
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
  const milestoneVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-surface-muted border-t-accent rounded-full animate-spin"></div>
        <p className="text-ink-secondary mt-4 font-medium">Loading contract details...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-danger opacity-60" />
        <p className="text-ink-secondary font-medium">Contract not found or you don't have access.</p>
        <button
          onClick={() => navigate('/client/contracts')}
          className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
        >
          ← Back to Contracts
        </button>
      </div>
    );
  }

  const completedMs = milestones.filter(m => m.status === 'APPROVED' || m.status === 'PAID').length;
  const totalMsAmount = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const releasedAmount = milestones.filter(m => m.status === 'APPROVED' || m.status === 'PAID').reduce((s, m) => s + (Number(m.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Navigation */}
        <motion.button
          whileTap={buttonTap}
          onClick={() => navigate('/client/contracts')}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-tertiary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Contracts
        </motion.button>

        {/* Contract Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-2xl font-bold text-brand-900">Contract #{contract.id}</h1>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border",
                  STATUS_STYLES[contract.status] || STATUS_STYLES.ACTIVE
                )}>
                  {contract.status}
                </span>
              </div>
              <p className="text-sm text-ink-tertiary flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Started {new Date(contract.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {contract.status === 'PENDING' && (
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => setConfirmModal({ type: 'sign' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Sign & Fund
                </motion.button>
              )}
              {contract.freelancer && (
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => navigate('/client/messages')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </motion.button>
              )}
              {['ACTIVE', 'PENDING'].includes(contract.status) && (
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => setConfirmModal({ type: 'cancel' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </motion.button>
              )}
              {contract.status === 'ACTIVE' && (
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => navigate(`/client/disputes/new?contractId=${contract.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-warn hover:bg-warn-light transition-colors"
                >
                  <Flag className="w-4 h-4" /> Dispute
                </motion.button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6 pt-6 border-t border-border relative z-10">
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">Freelancer</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-soft border border-border flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-semibold text-ink-primary">{contract.freelancer?.name || 'Unknown'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">Contract Value</p>
              <p className="text-xl font-bold text-ink-primary">KES {Number(contract.totalAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">Released to Date</p>
              <p className="text-xl font-bold text-accent">KES {releasedAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">Milestones Progress</p>
              <p className="text-xl font-bold text-ink-primary">{completedMs}<span className="text-sm text-ink-tertiary font-medium"> / {milestones.length}</span></p>
            </div>
          </div>

          {/* Progress Bar */}
          {milestones.length > 0 && (
            <div className="mt-6 relative z-10">
              <div className="flex justify-between text-xs font-medium text-ink-tertiary mb-1.5">
                <span>Overall Progress</span>
                <span className="text-accent">{Math.round((completedMs / milestones.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${milestones.length ? (completedMs / milestones.length) * 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Milestones Table Section */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border flex flex-wrap justify-between items-center gap-3">
            <h2 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Contract Milestones
            </h2>
            <div className="text-xs font-medium text-ink-tertiary bg-surface-soft px-3 py-1 rounded-full">
              Escrow Protection Active
            </div>
          </div>

          {msLoading ? (
            <div className="p-10 flex justify-center">
              <div className="w-8 h-8 border-4 border-surface-muted border-t-accent rounded-full animate-spin"></div>
            </div>
          ) : milestones.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
              <p className="text-ink-primary font-medium text-lg">No milestones defined.</p>
              <p className="text-sm text-ink-tertiary mt-1">This contract has no milestones yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {milestones.map((ms, index) => {
                const normalizedStatus = ms.status?.toUpperCase() || 'PENDING';
                const msInfo = MS_STATUS[normalizedStatus] || MS_STATUS.PENDING;
                const Icon = msInfo.icon;
                const isExpanded = expandedMs === ms.id;

                return (
                  <motion.div
                    key={ms.id}
                    variants={milestoneVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-soft transition-colors"
                  >
                    <div
                      className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 group"
                      onClick={() => setExpandedMs(isExpanded ? null : ms.id)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                          msInfo.bg
                        )}>
                          <Icon className={cn("w-5 h-5", msInfo.color)} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink-primary text-base truncate flex items-center gap-2">
                            <span className="text-ink-tertiary font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                            {ms.title}
                          </p>
                          <p className="text-sm text-ink-tertiary mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {ms.dueDate ? `Due ${new Date(ms.dueDate).toLocaleDateString()}` : 'No deadline set'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 ml-14 sm:ml-0">
                        <div className="text-right">
                          <span className="block text-lg font-bold text-ink-primary">KES {Number(ms.amount || 0).toLocaleString()}</span>
                          <span className={cn("block text-xs font-medium uppercase tracking-wide", msInfo.color)}>
                            {msInfo.label}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-ink-tertiary group-hover:text-accent transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details + Actions */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-5 pt-0 overflow-hidden"
                        >
                          <div className="bg-surface-soft border border-border rounded-xl p-4 space-y-4">
                            {/* Deliverables */}
                            {ms.deliverables && (
                              <div>
                                <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1.5">
                                  Scope / Deliverables
                                </p>
                                <div className="text-sm text-ink-secondary">
                                  {Array.isArray(ms.deliverables) ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                      {ms.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                  ) : (
                                    <p>{ms.deliverables}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Submission Notes */}
                            {ms.submissionNotes && (
                              <div className="bg-white border border-border rounded-lg p-3">
                                <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5" /> Freelancer Notes
                                </p>
                                <p className="text-sm text-ink-primary italic">"{ms.submissionNotes}"</p>
                              </div>
                            )}

                            {/* Rejection Reason */}
                            {ms.rejectionReason && (
                              <div className="bg-danger-light border border-danger/20 rounded-lg p-3">
                                <p className="text-xs font-semibold text-danger uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5" /> Revision Requested
                                </p>
                                <p className="text-sm text-danger">{ms.rejectionReason}</p>
                              </div>
                            )}

                            {/* Client Actions on Submitted Milestone */}
                            {normalizedStatus === 'SUBMITTED' && contract.status === 'ACTIVE' && (
                              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                                <motion.button
                                  whileTap={buttonTap}
                                  onClick={() => setConfirmModal({ type: 'approve', milestoneId: ms.id, amount: ms.amount, title: ms.title })}
                                  disabled={approveMilestone.isPending}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  <Unlock className="w-4 h-4" /> Approve & Release KES {Number(ms.amount).toLocaleString()}
                                </motion.button>
                                <motion.button
                                  whileTap={buttonTap}
                                  onClick={() => setConfirmModal({ type: 'reject-ms', milestoneId: ms.id, title: ms.title })}
                                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                                >
                                  <AlertCircle className="w-4 h-4" /> Request Revision
                                </motion.button>
                              </div>
                            )}

                            {/* Info for pending/active */}
                            {normalizedStatus === 'IN_PROGRESS' && (
                              <div className="pt-1">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-info bg-info-light px-3 py-1.5 rounded-lg">
                                  <Clock className="w-3.5 h-3.5" /> Freelancer is currently working on this milestone.
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Review CTA (if completed + no review) */}
        {contract.status === 'COMPLETED' && (
          <div className="bg-accent-light border border-accent/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left">
              <h3 className="font-display text-lg font-bold text-brand-900 mb-1">Leave a Review</h3>
              <p className="text-sm text-ink-secondary">
                Share your experience working with {contract.freelancer?.name || 'this freelancer'}. This helps other clients.
              </p>
            </div>
            <button
              onClick={() => navigate(`/client/reviews/new?contractId=${contract.id}`)}
              className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
            >
              Write Review
            </button>
          </div>
        )}
      </div>

      {/* Approve Confirm Modal */}
      <AnimatePresence>
        {confirmModal?.type === 'approve' && (
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
              <h3 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" /> Approve Milestone
              </h3>
              <p className="text-sm text-ink-secondary">
                You are approving <span className="font-semibold text-ink-primary">"{confirmModal.title}"</span>.
              </p>
              <div className="bg-accent-light border border-accent/20 p-4 rounded-xl">
                <p className="text-sm font-medium text-accent-dark">
                  This will instantly release KES {Number(confirmModal.amount).toLocaleString()} from Escrow to the freelancer.
                </p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(confirmModal.milestoneId, confirmModal.amount)}
                  disabled={approveMilestone.isPending}
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {approveMilestone.isPending ? 'Releasing...' : 'Approve & Release Funds'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Modal */}
      <AnimatePresence>
        {confirmModal?.type === 'sign' && (
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
              <h3 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" /> Sign Contract & Fund Escrow
              </h3>
              <p className="text-sm text-ink-secondary">
                By signing this contract you agree to the terms and scope of work defined. You must have sufficient funds to cover the first milestone.
              </p>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSign}
                  disabled={signContract.isPending}
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {signContract.isPending ? 'Signing...' : 'Sign & Fund Contract'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {confirmModal?.type === 'cancel' && (
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
              <h3 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-danger" /> Cancel Contract
              </h3>
              <p className="text-sm text-ink-secondary">
                Please provide a reason for cancellation. Any unfunded milestones will be discarded. Escrowed funds will follow the dispute process if work was submitted.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={3}
                className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Keep Contract
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelContract.isPending || !cancelReason.trim()}
                  className="px-5 py-2 bg-danger/20 text-danger border border-danger/30 rounded-lg text-sm font-medium hover:bg-danger/30 transition-colors disabled:opacity-50"
                >
                  {cancelContract.isPending ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Milestone Modal */}
      <AnimatePresence>
        {confirmModal?.type === 'reject-ms' && (
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
              <h3 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-danger" /> Request Revision
              </h3>
              <p className="text-sm text-ink-secondary">
                Explain what needs to be revised for <span className="font-semibold text-ink-primary">"{confirmModal.title}"</span>.
              </p>
              <textarea
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Detailed feedback for the freelancer..."
                rows={4}
                className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => { setConfirmModal(null); setRejectFeedback(''); }}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectMilestone.isPending || !rejectFeedback.trim()}
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {rejectMilestone.isPending ? 'Sending...' : 'Send Revision Request'}
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
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' : 'rgb(254, 226, 226)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' : 'rgb(185, 28, 28)',
            }}
          >
            {toast.type === 'success' ? <Shield size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
