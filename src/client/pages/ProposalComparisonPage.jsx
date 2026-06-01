import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Star, DollarSign, Clock, MapPin, CheckCircle,
  XCircle, Download, MessageSquare, Briefcase, ArrowLeft,
  AlertCircle, RefreshCw, Users
} from 'lucide-react';
import {
  useProposalsForJob, useJobDetails, useAcceptProposal, useRejectProposal
} from '../services/clientHooks';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';

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
    SUBMITTED: 'bg-#14a800]/10 text-blue-400 border-#14a800]/20',
    SHORTLISTED: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    ACCEPTED: 'bg-success/10 text-success border-success/20',
    REJECTED: 'bg-red-400/10 text-red-400 border-red-400/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
      {status}
    </span>
  );
}

export default function ProposalComparisonPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { data: job } = useJobDetails(jobId);
  const { data: proposalsData, isLoading, error, refetch } = useProposalsForJob(jobId, { limit: 100 });
  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();

  const allProposals = proposalsData?.items || [];

  // Start with top 3 proposals (highest bidAmount = first choice, or limit to shortlisted first)
  const shortlisted = allProposals.filter(p => p.status === 'SHORTLISTED');
  const submitted = allProposals.filter(p => p.status === 'SUBMITTED');
  const topProposals = [...shortlisted, ...submitted].slice(0, 4);

  // Allow toggling which proposals to compare
  const compareProposals = topProposals.filter((_, i) =>
    selectedIds.size === 0 ? i < 3 : selectedIds.has(topProposals[i]?.id)
  ).slice(0, 4);

  const handleAccept = async () => {
    if (!confirmModal) return;
    try {
      await acceptMutation.mutateAsync(confirmModal.proposalId);
      setConfirmModal(null);
    } catch (_) {}
  };

  const handleReject = async () => {
    if (!confirmModal) return;
    try {
      await rejectMutation.mutateAsync({ proposalId: confirmModal.proposalId, reason: '' });
      setConfirmModal(null);
    } catch (_) {}
  };

  const lowestBudget = Math.min(...compareProposals.map(p => Number(p.proposedBudget || p.bidAmount || Infinity)));
  const highestRating = Math.max(...compareProposals.map(p => Number(p.freelancer?.rating || 0)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {[1,2].map(i => <div key={i} className="h-48 bg-zinc-900/40 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <Link to={`/client/jobs/${jobId}/pipeline`} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Pipeline
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Compare Proposals</h1>
              <p className="text-sm text-zinc-400 mt-1">
                Job: <span className="text-success">{job?.title || `#${jobId}`}</span> &bull; {allProposals.length} total proposals
              </p>
            </div>
            <button onClick={refetch} className="p-2 text-zinc-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error || allProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <Users className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400">{error ? 'Failed to load proposals.' : 'No proposals to compare yet.'}</p>
            <button onClick={() => navigate(`/client/jobs/${jobId}/pipeline`)} className="text-sm text-success hover:underline">Go to Pipeline</button>
          </div>
        ) : (
          <>
            {/* Proposal Selector */}
            {allProposals.length > 3 && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4">
                <p className="text-xs text-zinc-400 mb-3">Select up to 4 proposals to compare:</p>
                <div className="flex flex-wrap gap-2">
                  {allProposals.map(p => {
                    const isSelected = selectedIds.size === 0 ? topProposals.slice(0, 3).some(t => t.id === p.id) : selectedIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          const next = new Set(selectedIds.size === 0 ? topProposals.slice(0, 3).map(t => t.id) : selectedIds);
                          if (next.has(p.id)) { next.delete(p.id); } else if (next.size < 4) { next.add(p.id); }
                          setSelectedIds(next);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          isSelected ? 'bg-success/20 text-success border-success/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                        }`}
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
            <div className="overflow-x-auto custom-scrollbar">
              <div className="min-w-[640px]">
                {/* Candidate Headers */}
                <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}>
                  <div /> {/* spacer */}
                  {compareProposals.map(proposal => {
                    const f = proposal.freelancer || {};
                    const isTop = Number(f.rating || 0) === highestRating && highestRating > 0;
                    const isCheapest = Number(proposal.proposedBudget || proposal.bidAmount || 0) === lowestBudget;
                    const initials = (f.name || 'F').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <div key={proposal.id} className={`bg-zinc-900/40 border rounded-2xl p-4 text-center relative ${isTop ? 'border-success/50' : 'border-zinc-800'}`}>
                        {isTop && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-success text-white px-2 py-0.5 rounded-full font-bold">TOP RATED</span>}
                        {isCheapest && !isTop && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-success text-white px-2 py-0.5 rounded-full font-bold">BEST PRICE</span>}
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-white mx-auto mb-2 overflow-hidden">
                          {f.avatar ? <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <p className="font-bold text-white text-sm">{f.name || `Freelancer #${proposal.freelancerId}`}</p>
                        <p className="text-xs text-zinc-400 truncate">{f.title || f.headline || ''}</p>
                        <div className="mt-2"><StatusBadge status={proposal.status} /></div>
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
                      <div className="text-xs text-zinc-500 font-bold py-3">{field.label}</div>
                      {compareProposals.map(proposal => {
                        if (field.isSkills) {
                          const skills = proposal.freelancer?.skills || [];
                          return (
                            <div key={proposal.id} className="py-2">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(skills) ? skills : []).slice(0, 4).map((s, i) => (
                                  <span key={i} className="text-[9px] px-2 py-0.5 bg-success/10 text-success rounded-full border border-success/20">
                                    {typeof s === 'object' ? s.name : s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        const val = field.key(proposal);
                        const isBestBudget = field.highlight === 'budget' && Number(proposal.proposedBudget || proposal.bidAmount || 0) === lowestBudget;
                        const isBestRating = field.highlight === 'rating' && Number(proposal.freelancer?.rating || 0) === highestRating && highestRating > 0;
                        return (
                          <div key={proposal.id} className={`py-3 px-3 rounded-xl text-sm ${
                            isBestBudget ? 'text-success font-bold bg-success/5' :
                            isBestRating ? 'text-orange-400 font-bold bg-orange-400/5' : 'text-zinc-300'
                          }`}>
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Cover Letter Row */}
                  <div className="grid gap-4 items-start pt-2" style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}>
                    <div className="text-xs text-zinc-500 font-bold pt-3">Cover Letter</div>
                    {compareProposals.map(proposal => (
                      <div key={proposal.id} className="py-3 text-xs text-zinc-400 leading-relaxed line-clamp-4 bg-zinc-900/30 rounded-xl p-3">
                        {proposal.coverLetter || proposal.message || '—'}
                      </div>
                    ))}
                  </div>

                  {/* Action Row */}
                  <div className="grid gap-4 items-start pt-4" style={{ gridTemplateColumns: `200px repeat(${compareProposals.length}, 1fr)` }}>
                    <div className="text-xs text-zinc-500 font-bold pt-3">Actions</div>
                    {compareProposals.map(proposal => (
                      <div key={proposal.id} className="flex flex-col gap-2 py-2">
                        {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                          <button
                            onClick={() => setConfirmModal({ type: 'accept', proposalId: proposal.id, name: proposal.freelancer?.name })}
                            disabled={acceptMutation.isPending}
                            className="w-full py-2 bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Accept
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/client/messages`)}
                          className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Message
                        </button>
                        {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                          <button
                            onClick={() => setConfirmModal({ type: 'reject', proposalId: proposal.id, name: proposal.freelancer?.name })}
                            disabled={rejectMutation.isPending}
                            className="w-full py-2 bg-red-400/5 hover:bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Decline
                          </button>
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

      {/* Accept confirm */}
      <ConfirmModal
        isOpen={confirmModal?.type === 'accept'}
        title="Accept Proposal"
        message={`Accept ${confirmModal?.name}'s proposal? A contract will be automatically created.`}
        confirmLabel="Accept & Create Contract"
        confirmVariant="success"
        isLoading={acceptMutation.isPending}
        onConfirm={handleAccept}
        onClose={() => setConfirmModal(null)}
      />

      {/* Reject confirm */}
      <ConfirmModal
        isOpen={confirmModal?.type === 'reject'}
        title="Decline Proposal"
        message={`Decline ${confirmModal?.name}'s proposal? This action will notify them.`}
        confirmLabel="Decline Proposal"
        confirmVariant="danger"
        isLoading={rejectMutation.isPending}
        onConfirm={handleReject}
        onClose={() => setConfirmModal(null)}
      />
    </div>
  );
}
