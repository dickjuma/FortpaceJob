import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Briefcase, ChevronRight, AlertCircle, Clock, CheckCircle,
  XCircle, Star, Calendar, DollarSign, User, Filter, RefreshCw, MoreHorizontal
} from 'lucide-react';
import {
  useMyProposals, useProposalsForJob, useMyJobs,
  useAcceptProposal, useRejectProposal, useShortlistProposal
} from '../services/clientHooks';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_STYLES = {
  SUBMITTED: 'bg-#2bb75c]/10 text-blue-400 border-#2bb75c]/20',
  ACCEPTED:  'bg-success/10 text-success border-success/20',
  REJECTED:  'bg-red-500/10 text-red-400 border-red-500/20',
  SHORTLISTED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  WITHDRAWN: 'bg-zinc-500/10 text-zinc-500 border-zinc-600/20',
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

  const { data: jobsData } = useMyJobs({ limit: 50 });
  const jobs = jobsData?.items || [];

  const filters = {
    page,
    limit: 15,
    ...(activeTab !== 'All' && { status: activeTab }),
  };

  // If specific job selected, use per-job proposals; else all proposals
  const allProposals = useMyProposals(selectedJobId === 'all' ? filters : { enabled: false });
  const jobProposals = useProposalsForJob(selectedJobId !== 'all' ? selectedJobId : null, filters);
  const { data, isLoading, error, refetch } = selectedJobId === 'all' ? allProposals : jobProposals;

  const proposals = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();
  const shortlistMutation = useShortlistProposal();

  const handleAccept = async () => {
    if (!confirmModal) return;
    try {
      await acceptMutation.mutateAsync(confirmModal.proposalId);
      toast.success('Proposal accepted! A contract has been created.');
      setConfirmModal(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to accept proposal');
    }
  };

  const handleReject = async () => {
    if (!confirmModal) return;
    try {
      await rejectMutation.mutateAsync({ proposalId: confirmModal.proposalId, reason: rejectReason });
      toast.success('Proposal rejected.');
      setConfirmModal(null);
      setRejectReason('');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to reject proposal');
    }
  };

  const handleShortlist = async (proposalId) => {
    try { 
      await shortlistMutation.mutateAsync(proposalId); 
      toast.success('Proposal shortlisted.');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to shortlist');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Proposals</h1>
            <p className="text-sm font-semibold text-zinc-400 mt-1">{total} proposal{total !== 1 ? 's' : ''} received. Review and hire top talent.</p>
          </div>
          <button onClick={() => navigate('/client-services/create-job')} className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#2bb75c]/20">
            <Briefcase className="w-4 h-4" /> Post New Job
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          {/* Job Selector */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={selectedJobId}
              onChange={(e) => { setSelectedJobId(e.target.value); setPage(1); }}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-zinc-200 focus:outline-none focus:border-success"
            >
              <option value="all">All Jobs</option>
              {jobs.map(j => <option key={j.id || j._id} value={j.id || j._id}>{j.title}</option>)}
            </select>
          </div>
          {/* Status Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === tab
                    ? 'bg-zinc-800 text-white'
                    : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Proposals Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <div className="w-8 h-8 border-4 border-zinc-800 border-t-success rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-bold">Loading proposals...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm font-bold">Failed to load proposals. <button onClick={() => refetch()} className="text-success underline">Retry</button></p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-center px-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700">
              <Send className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">No proposals found</h2>
            <p className="text-zinc-400 max-w-md mx-auto">No proposals match your current filters.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Freelancer</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Job Reference</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Terms</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Match</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {proposals.map(proposal => (
                    <tr key={proposal.id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-sm font-bold text-white">
                            {proposal.freelancer?.name?.[0] || <User className="w-4 h-4 text-zinc-400" />}
                          </div>
                          <div>
                            <div 
                              className="text-sm font-bold text-white group-hover:text-success transition-colors cursor-pointer"
                              onClick={() => navigate(`/client/proposals/${proposal.id}`)}
                            >
                              {proposal.freelancer?.name || `Freelancer #${proposal.freelancerId}`}
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(proposal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-zinc-300 line-clamp-1">{proposal.job?.title || `Job #${proposal.jobId}`}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${STATUS_STYLES[proposal.status] || STATUS_STYLES.SUBMITTED}`}>
                          {proposal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white flex items-center gap-1">
                          KES {(proposal.proposedBudget || proposal.bidAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {proposal.timeline || proposal.deliveryDays || '?'} days
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {proposal.matchScore ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-orange-400">
                            <Star className="w-4 h-4 fill-orange-400" /> {proposal.matchScore}%
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-600 font-bold">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          
                          {proposal.status === 'SUBMITTED' || proposal.status === 'SHORTLISTED' ? (
                            <button
                              onClick={() => setConfirmModal({ type: 'accept', proposalId: proposal.id, name: proposal.freelancer?.name })}
                              className="px-3 py-1.5 bg-success/10 hover:bg-success/20 text-success text-xs font-bold rounded-lg transition-colors border border-success/20 flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Hire
                            </button>
                          ) : proposal.status === 'ACCEPTED' ? (
                            <button
                              onClick={() => navigate(`/client/contracts`)}
                              className="px-3 py-1.5 bg-success/10 hover:bg-success/20 text-success text-xs font-bold rounded-lg transition-colors border border-success/20"
                            >
                              Contract
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/client/proposals/${proposal.id}`)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors border border-zinc-700"
                            >
                              View
                            </button>
                          )}

                          {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                            <>
                              <button 
                                onClick={() => setMenuOpen(menuOpen === proposal.id ? null : proposal.id)}
                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-700"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {menuOpen === proposal.id && (
                                <div className="absolute right-0 top-10 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                  {proposal.status !== 'SHORTLISTED' && (
                                    <button 
                                      onClick={() => { handleShortlist(proposal.id); setMenuOpen(null); }}
                                      className="w-full text-left px-4 py-2 text-xs font-bold text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center gap-2"
                                    >
                                      <Star className="w-3.5 h-3.5" /> Shortlist
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => { navigate(`/client/proposals/${proposal.id}`); setMenuOpen(null); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                  >
                                    View Full Proposal
                                  </button>
                                  <div className="h-px bg-zinc-800 my-1"></div>
                                  <button 
                                    onClick={() => { setConfirmModal({ type: 'reject', proposalId: proposal.id, name: proposal.freelancer?.name }); setMenuOpen(null); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Decline
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-bold text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Previous</button>
            <span className="text-sm font-bold text-zinc-400">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-bold text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Next</button>
          </div>
        )}
      </div>

      {/* Accept Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal?.type === 'accept'}
        title="Hire Freelancer"
        message={`You are about to accept ${confirmModal?.name}'s proposal. A contract will be created automatically and they will be notified.`}
        confirmLabel="Accept & Create Contract"
        confirmVariant="success"
        isLoading={acceptMutation.isPending}
        onConfirm={handleAccept}
        onClose={() => setConfirmModal(null)}
      />

      {/* Reject Confirm Modal with reason input */}
      {confirmModal?.type === 'reject' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /> Decline Proposal</h3>
            <p className="text-sm font-semibold text-zinc-400">You are declining <strong className="text-white">{confirmModal.name}</strong>'s proposal. Provide a reason so they can improve next time.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for declining..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm font-medium text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 resize-none"
            />
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { setConfirmModal(null); setRejectReason(''); }} className="px-4 py-2.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
              <button onClick={handleReject} disabled={rejectMutation.isPending} className="px-5 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {rejectMutation.isPending ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
