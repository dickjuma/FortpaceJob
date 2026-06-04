import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, User, DollarSign, Calendar, CheckCircle, XCircle,
  Clock, AlertCircle, ArrowLeft, MessageSquare, Flag, Award,
  ChevronDown, ChevronUp, Unlock, Lock, TrendingUp, HelpCircle
} from 'lucide-react';
import {
  useContractDetails, useContractMilestones, useApproveMilestone,
  useRejectMilestone, useCancelContract, useSignContract, useWallet
} from '../services/clientHooks';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  ACTIVE:    'bg-success/10 text-success border-success/20',
  PENDING:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  COMPLETED: 'bg-#2bb75c]/10 text-blue-400 border-#2bb75c]/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  TERMINATED:'bg-zinc-500/10 text-zinc-400 border-zinc-600/20',
};

const MS_STATUS = {
  APPROVED:    { label: 'Approved & Paid', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  SUBMITTED:   { label: 'In Review',       icon: Clock,       color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
  IN_PROGRESS: { label: 'In Progress',     icon: TrendingUp,  color: 'text-blue-400',    bg: 'bg-#2bb75c]/10' },
  PENDING:     { label: 'Pending',         icon: Clock,       color: 'text-zinc-400',    bg: 'bg-zinc-800' },
  REJECTED:    { label: 'Revisions Requested', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  DISPUTED:    { label: 'Disputed',        icon: Flag,        color: 'text-orange-400',  bg: 'bg-orange-500/10' },
};

export default function ContractDetailsPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [expandedMs, setExpandedMs] = useState(null);

  const { data: contract, isLoading, error } = useContractDetails(contractId);
  const { data: milestones = [], isLoading: msLoading, refetch: refetchMs } = useContractMilestones(contractId);
  const { refetch: refetchWallet } = useWallet();

  const approveMilestone = useApproveMilestone(contractId);
  const rejectMilestone = useRejectMilestone(contractId);
  const cancelContract = useCancelContract();
  const signContract = useSignContract(contractId);

  const handleApprove = async (milestoneId, amount) => {
    try {
      await approveMilestone.mutateAsync(milestoneId);
      toast.success(`Milestone approved! KES ${Number(amount).toLocaleString()} released.`);
      refetchMs();
      refetchWallet();
      setConfirmModal(null);
    } catch (err) {
      toast.error(err.message || 'Failed to approve milestone.');
    }
  };

  const handleReject = async () => {
    if (!confirmModal || !rejectFeedback.trim()) return;
    try {
      await rejectMilestone.mutateAsync({ milestoneId: confirmModal.milestoneId, feedback: rejectFeedback });
      toast.success('Revision request sent to freelancer.');
      setConfirmModal(null);
      setRejectFeedback('');
      refetchMs();
    } catch (err) {
      toast.error(err.message || 'Failed to reject milestone.');
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    try {
      await cancelContract.mutateAsync({ contractId: Number(contractId), reason: cancelReason });
      toast.success('Contract cancelled successfully.');
      setConfirmModal(null);
      setCancelReason('');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel contract.');
    }
  };

  const handleSign = async () => {
    try {
      await signContract.mutateAsync();
      toast.success('Contract signed successfully! Escrow funded.');
      setConfirmModal(null);
      refetchWallet();
    } catch (err) {
      toast.error(err.message || 'Failed to sign contract.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-success rounded-full animate-spin"></div>
        <p className="text-zinc-400 mt-4 font-bold">Loading contract details...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-400 opacity-60" />
        <p className="text-zinc-400 font-bold">Contract not found or you don't have access.</p>
        <button onClick={() => navigate('/client/contracts')} className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 font-bold transition-colors">← Back to Contracts</button>
      </div>
    );
  }

  const completedMs = milestones.filter(m => m.status === 'APPROVED' || m.status === 'PAID').length;
  const totalMsAmount = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const releasedAmount = milestones.filter(m => m.status === 'APPROVED' || m.status === 'PAID').reduce((s, m) => s + (Number(m.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back Navigation */}
        <button onClick={() => navigate('/client/contracts')} className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Contracts
        </button>

        {/* Contract Header Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">Contract #{contract.id}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${STATUS_STYLES[contract.status] || STATUS_STYLES.ACTIVE}`}>
                  {contract.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Started {new Date(contract.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {contract.status === 'PENDING' && (
                <button onClick={() => setConfirmModal({ type: 'sign' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-green-600 text-black rounded-xl text-sm font-black transition-colors shadow-lg shadow-[#2bb75c]/20">
                  <CheckCircle className="w-4 h-4" /> Sign & Fund
                </button>
              )}
              {contract.freelancer && (
                <button onClick={() => navigate(`/client/messages`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-[#2bb75c]/20">
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
              )}
              {['ACTIVE', 'PENDING'].includes(contract.status) && (
                <button onClick={() => setConfirmModal({ type: 'cancel' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold transition-colors">
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              )}
              {contract.status === 'ACTIVE' && (
                <button onClick={() => navigate(`/client/disputes/new?contractId=${contract.id}`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-orange-400 border border-zinc-700 rounded-xl text-sm font-bold transition-colors">
                  <Flag className="w-4 h-4" /> Dispute
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-zinc-800/80 relative z-10">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Freelancer</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm font-black text-white">{contract.freelancer?.name || 'Unknown'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Contract Value</p>
              <p className="text-xl font-black text-white">KES {Number(contract.totalAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Released to Date</p>
              <p className="text-xl font-black text-success">KES {releasedAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Milestones Progress</p>
              <p className="text-xl font-black text-white">{completedMs}<span className="text-sm text-zinc-500 font-bold"> / {milestones.length}</span></p>
            </div>
          </div>

          {/* Progress Bar */}
          {milestones.length > 0 && (
            <div className="mt-8 relative z-10">
              <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2">
                <span>Overall Progress</span>
                <span className="text-success">{Math.round((completedMs / milestones.length) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-success rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${milestones.length ? (completedMs / milestones.length) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Milestones Table Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2"><Award className="w-5 h-5 text-success" /> Contract Milestones</h2>
            <div className="text-sm font-bold text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
              Escrow Protection Active
            </div>
          </div>

          {msLoading ? (
            <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-zinc-800 border-t-success rounded-full animate-spin"></div></div>
          ) : milestones.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 font-bold text-lg">No milestones defined.</p>
              <p className="text-sm text-zinc-500 mt-1">This contract has no milestones yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {milestones.map((ms, index) => {
                // Determine normalized status based on milestone.state.js standard if applicable
                const normalizedStatus = ms.status.toUpperCase();
                const msInfo = MS_STATUS[normalizedStatus] || MS_STATUS.PENDING;
                const Icon = msInfo.icon;
                const isExpanded = expandedMs === ms.id;

                return (
                  <div key={ms.id} className="hover:bg-zinc-800/20 transition-colors">
                    <div 
                      className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 group"
                      onClick={() => setExpandedMs(isExpanded ? null : ms.id)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msInfo.bg} border border-zinc-700/50 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${msInfo.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-base truncate flex items-center gap-2">
                            <span className="text-zinc-500 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span> 
                            {ms.title}
                          </p>
                          <p className="text-sm font-semibold text-zinc-500 mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> 
                            {ms.dueDate ? `Due ${new Date(ms.dueDate).toLocaleDateString()}` : 'No deadline set'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 ml-14 sm:ml-0">
                        <div className="text-right">
                          <span className="block text-lg font-black text-white">KES {Number(ms.amount || 0).toLocaleString()}</span>
                          <span className={`block text-xs font-black uppercase tracking-wider ${msInfo.color}`}>{msInfo.label}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details + Actions */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2">
                        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                          
                          {/* Deliverables */}
                          {ms.deliverables && (
                            <div>
                              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Scope / Deliverables</p>
                              <div className="text-sm font-semibold text-zinc-300">
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
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                              <p className="text-xs font-bold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Freelancer Notes
                              </p>
                              <p className="text-sm font-medium text-zinc-300 italic">"{ms.submissionNotes}"</p>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {ms.rejectionReason && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                              <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" /> Revision Requested
                              </p>
                              <p className="text-sm font-medium text-red-200">{ms.rejectionReason}</p>
                            </div>
                          )}

                          {/* Client Actions on Submitted Milestone */}
                          {normalizedStatus === 'SUBMITTED' && contract.status === 'ACTIVE' && (
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800/50">
                              <button
                                onClick={() => setConfirmModal({ type: 'approve', milestoneId: ms.id, amount: ms.amount, title: ms.title })}
                                disabled={approveMilestone.isPending}
                                className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-green-600 text-black rounded-xl text-sm font-black transition-colors shadow-lg shadow-[#2bb75c]/20 disabled:opacity-50"
                              >
                                <Unlock className="w-4 h-4" /> Approve & Release KES {Number(ms.amount).toLocaleString()}
                              </button>
                              <button
                                onClick={() => setConfirmModal({ type: 'reject-ms', milestoneId: ms.id, title: ms.title })}
                                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold transition-colors"
                              >
                                <AlertCircle className="w-4 h-4" /> Request Revision
                              </button>
                            </div>
                          )}
                          
                          {/* Info for pending/active */}
                          {normalizedStatus === 'IN_PROGRESS' && (
                            <div className="pt-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-#2bb75c]/10 px-3 py-1.5 rounded-lg">
                                <Clock className="w-3.5 h-3.5" /> Freelancer is currently working on this milestone.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Review CTA (if completed + no review) */}
        {contract.status === 'COMPLETED' && (
          <div className="bg-gradient-to-r from-success/10 to-success/20 border border-success/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-black text-white mb-2">Leave a Review</h3>
              <p className="text-sm font-semibold text-zinc-400">Share your experience working with {contract.freelancer?.name || 'this freelancer'}. This helps other clients on Fortspace.</p>
            </div>
            <button onClick={() => navigate(`/client/reviews/new?contractId=${contract.id}`)}
              className="px-6 py-3 bg-success text-white rounded-xl text-sm font-black hover:bg-success transition-all shadow-lg shadow-[#2bb75c]/20 shrink-0 w-full sm:w-auto">
              Write Review
            </button>
          </div>
        )}
      </div>

      {/* Approve Confirm Modal */}
      {confirmModal?.type === 'approve' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2"><CheckCircle className="w-6 h-6 text-success" /> Approve Milestone</h3>
            <p className="text-sm font-semibold text-zinc-300">You are approving <strong className="text-white">"{confirmModal.title}"</strong>.</p>
            <div className="bg-success/10 border border-success/20 p-4 rounded-xl">
              <p className="text-sm font-bold text-success">This will instantly release KES {Number(confirmModal.amount).toLocaleString()} from Escrow to the freelancer.</p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setConfirmModal(null)} className="px-5 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
              <button onClick={() => handleApprove(confirmModal.milestoneId, confirmModal.amount)} disabled={approveMilestone.isPending} className="px-6 py-3 bg-success text-black rounded-xl text-sm font-black hover:bg-green-600 transition-colors disabled:opacity-50">
                {approveMilestone.isPending ? 'Releasing...' : 'Approve & Release Funds'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Modal */}
      <ConfirmModal
        isOpen={confirmModal?.type === 'sign'}
        title="Sign Contract & Fund Escrow"
        message="By signing this contract you agree to the terms and scope of work defined. You must have sufficient funds in your M-Pesa wallet to cover the first milestone."
        confirmLabel="Sign & Fund Contract"
        confirmVariant="success"
        isLoading={signContract.isPending}
        onConfirm={handleSign}
        onClose={() => setConfirmModal(null)}
      />

      {/* Cancel Modal */}
      {confirmModal?.type === 'cancel' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2"><XCircle className="w-6 h-6 text-red-500" /> Cancel Contract</h3>
            <p className="text-sm font-semibold text-zinc-400">Please provide a reason for cancellation. Any unfunded milestones will be discarded. Escrowed funds will follow the dispute process if work was submitted.</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..." rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-medium text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 resize-none" />
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setConfirmModal(null)} className="px-5 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Keep Contract</button>
              <button onClick={handleCancel} disabled={cancelContract.isPending || !cancelReason.trim()} className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {cancelContract.isPending ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Milestone Modal */}
      {confirmModal?.type === 'reject-ms' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2"><AlertCircle className="w-6 h-6 text-red-400" /> Request Revision</h3>
            <p className="text-sm font-semibold text-zinc-400">Explain what needs to be revised for <strong className="text-white">"{confirmModal.title}"</strong>.</p>
            <textarea value={rejectFeedback} onChange={(e) => setRejectFeedback(e.target.value)} placeholder="Detailed feedback for the freelancer..." rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-medium text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none" />
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { setConfirmModal(null); setRejectFeedback(''); }} className="px-5 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
              <button onClick={handleReject} disabled={rejectMilestone.isPending || !rejectFeedback.trim()} className="px-6 py-3 bg-zinc-100 text-black border border-zinc-300 rounded-xl text-sm font-black hover:bg-white transition-colors disabled:opacity-50">
                {rejectMilestone.isPending ? 'Sending...' : 'Send Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

