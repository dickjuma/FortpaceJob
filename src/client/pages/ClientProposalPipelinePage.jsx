import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Columns, List, ChevronRight, Star, Clock, DollarSign, AlertCircle,
  RefreshCw, CheckCircle, XCircle, User, MessageSquare, ArrowUpDown,
  Search, Filter, SlidersHorizontal
} from 'lucide-react';
import {
  useMyJobs, useProposalsForJob, useAcceptProposal,
  useRejectProposal, useShortlistProposal
} from '../services/clientHooks';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useConfirm } from '../../common/context/ConfirmContext';
import notify from '../../common/utils/notify';

const PIPELINE_COLUMNS = [
  { key: 'SUBMITTED',  label: 'New',        color: 'border-t-blue-400',   dot: 'bg-blue-400' },
  { key: 'SHORTLISTED',label: 'Shortlisted',color: 'border-t-yellow-400', dot: 'bg-yellow-400' },
  { key: 'ACCEPTED',   label: 'Accepted',   color: 'border-t-success',dot: 'bg-success' },
  { key: 'REJECTED',   label: 'Rejected',   color: 'border-t-red-400',    dot: 'bg-red-400' },
];

function ProposalCard({ proposal, onAccept, onShortlist, onReject, onView, isLoading }) {
  const f = proposal.freelancer || {};
  const initials = (f.name || 'F').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl p-4 space-y-3 hover:border-zinc-600 transition-colors shadow-sm">
      {/* Freelancer */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden">
          {f.avatar ? <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" /> : initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm truncate">{f.name || `Freelancer #${proposal.freelancerId}`}</p>
          <p className="text-[10px] text-zinc-500 truncate">{f.title || f.headline || ''}</p>
        </div>
        {f.rating && (
          <div className="ml-auto flex items-center gap-0.5 text-orange-400 text-xs font-bold shrink-0">
            <Star className="w-3 h-3 fill-orange-400" />{Number(f.rating).toFixed(1)}
          </div>
        )}
      </div>

      {/* Cover letter snippet */}
      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{proposal.coverLetter || proposal.message}</p>

      {/* Metrics */}
      <div className="flex gap-3 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-success" />KES {Number(proposal.proposedBudget || proposal.bidAmount || 0).toLocaleString()}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{proposal.timeline || proposal.deliveryDays || '?'}d</span>
        <span className="text-zinc-600">{new Date(proposal.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 pt-1">
        {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
          <>
            <button onClick={() => onAccept(proposal)} disabled={isLoading}
              className="flex-1 py-1.5 bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50">
              Accept
            </button>
            {proposal.status === 'SUBMITTED' && (
              <button onClick={() => onShortlist(proposal.id)} disabled={isLoading}
                className="flex-1 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50">
                Shortlist
              </button>
            )}
            <button onClick={() => onReject(proposal)} disabled={isLoading}
              className="w-8 flex items-center justify-center py-1.5 bg-red-400/10 hover:bg-red-400/20 text-red-400 border border-red-400/20 rounded-lg transition-colors disabled:opacity-50">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        <button onClick={() => onView(proposal)} className="flex items-center justify-center gap-1 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg text-[10px] font-bold transition-colors">
          View <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function ClientProposalPipelinePage() {
  const navigate = useNavigate();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: jobsData, isLoading: jobsLoading } = useMyJobs({ limit: 50, status: 'OPEN' });
  const jobs = jobsData?.items || [];

  // Auto-select first job
  const activeJobId = selectedJobId || jobs[0]?.id;

  const { data: proposalsData, isLoading: propsLoading, error: propsError, refetch } = useProposalsForJob(
    activeJobId, { limit: 200 }
  );

  const { confirm } = useConfirm();
  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();
  const shortlistMutation = useShortlistProposal();

  const allProposals = (proposalsData?.items || []).filter(p => {
    if (!search) return true;
    const name = p.freelancer?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      p.coverLetter?.toLowerCase().includes(search.toLowerCase());
  });

  // Group by status for kanban
  const grouped = useMemo(() => {
    const map = {};
    PIPELINE_COLUMNS.forEach(col => { map[col.key] = []; });
    allProposals.forEach(p => {
      if (map[p.status]) map[p.status].push(p);
      else if (map['SUBMITTED']) map['SUBMITTED'].push(p); // default bucket
    });
    return map;
  }, [allProposals]);

  const handleAccept = async () => {
    if (!confirmModal?.proposalId) return;
    try {
      await notify.promise(acceptMutation.mutateAsync(confirmModal.proposalId), {
        loading: 'Accepting proposal and creating contract...',
        success: 'Proposal accepted. Contract created.',
        error: 'Could not accept proposal',
      });
      setConfirmModal(null);
    } catch {
      /* notify handles error */
    }
  };

  const handleReject = async () => {
    if (!confirmModal?.proposalId) return;
    try {
      await notify.promise(
        rejectMutation.mutateAsync({ proposalId: confirmModal.proposalId, reason: rejectReason }),
        {
          loading: 'Rejecting proposal...',
          success: 'Proposal rejected',
          error: 'Could not reject proposal',
        }
      );
      setConfirmModal(null);
      setRejectReason('');
    } catch {
      /* notify handles error */
    }
  };

  const handleShortlist = async (proposalId) => {
    try {
      await notify.promise(shortlistMutation.mutateAsync(proposalId), {
        loading: 'Shortlisting...',
        success: 'Added to shortlist',
        error: 'Could not shortlist',
      });
    } catch {
      /* handled */
    }
  };

  const selectedJob = jobs.find(j => j.id === activeJobId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center gap-3 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white">Proposal Pipeline</h1>
          <p className="text-xs text-zinc-500">Review & manage candidate proposals</p>
        </div>

        {/* Job Selector */}
        <select
          value={activeJobId || ''}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-success"
          disabled={jobsLoading}
        >
          {jobsLoading ? <option>Loading jobs...</option> : jobs.length === 0 ? <option value="">No open jobs</option> :
            jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)
          }
        </select>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..."
            className="bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success w-44" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={refetch} className="p-2 text-zinc-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-xl transition-colors ${viewMode === 'kanban' ? 'bg-success/20 text-success' : 'text-zinc-400 hover:text-white'}`}>
            <Columns className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-success/20 text-success' : 'text-zinc-400 hover:text-white'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => navigate(`/client/proposals`)} className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">
            All Proposals <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      {activeJobId && !propsLoading && (
        <div className="px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/40 flex gap-6 text-xs shrink-0">
          <span className="text-zinc-400">{allProposals.length} total proposals</span>
          {PIPELINE_COLUMNS.map(col => (
            <span key={col.key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span className="text-zinc-500">{col.label}: <strong className="text-zinc-300">{grouped[col.key]?.length || 0}</strong></span>
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 custom-scrollbar">
        {!activeJobId ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <AlertCircle className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400">No open jobs found. Post a job to receive proposals.</p>
            <button onClick={() => navigate('/client/post-job')} className="px-5 py-2 bg-success text-white rounded-full text-sm font-bold hover:bg-success transition-colors">Post a Job</button>
          </div>
        ) : propsLoading ? (
          <div className={viewMode === 'kanban' ? 'flex gap-4' : 'space-y-3'}>
            {viewMode === 'kanban'
              ? PIPELINE_COLUMNS.map(col => <div key={col.key} className="flex-1 h-64 bg-zinc-900/40 rounded-2xl animate-pulse" />)
              : [1,2,3].map(i => <div key={i} className="h-20 bg-zinc-900/40 rounded-2xl animate-pulse" />)
            }
          </div>
        ) : propsError ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm">Failed to load proposals. <button onClick={refetch} className="text-success underline">Retry</button></p>
          </div>
        ) : allProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <User className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400">No proposals yet for <strong>"{selectedJob?.title}"</strong>.</p>
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban Board */
          <div className="flex gap-4 min-h-[500px]">
            {PIPELINE_COLUMNS.map(col => (
              <div key={col.key} className={`flex-1 min-w-64 bg-zinc-900/30 border-t-2 ${col.color} rounded-2xl p-4 space-y-3`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className="font-bold text-white text-sm">{col.label}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-bold bg-zinc-800 px-2 py-0.5 rounded-full">{grouped[col.key]?.length || 0}</span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-1">
                  {grouped[col.key]?.map(proposal => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      isLoading={acceptMutation.isPending || rejectMutation.isPending || shortlistMutation.isPending}
                      onAccept={(p) => setConfirmModal({ type: 'accept', proposalId: p.id, name: p.freelancer?.name })}
                      onShortlist={handleShortlist}
                      onReject={(p) => setConfirmModal({ type: 'reject', proposalId: p.id, name: p.freelancer?.name })}
                      onView={(p) => navigate(`/client/proposals/${p.id}`)}
                    />
                  ))}
                  {(!grouped[col.key] || grouped[col.key].length === 0) && (
                    <p className="text-xs text-zinc-600 text-center py-6">No proposals here</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {allProposals.map(proposal => {
              const f = proposal.freelancer || {};
              const colInfo = PIPELINE_COLUMNS.find(c => c.key === proposal.status) || PIPELINE_COLUMNS[0];
              return (
                <div key={proposal.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {f.avatar ? <img src={f.avatar} alt={f.name} className="w-full h-full object-cover rounded-full" /> : (f.name || 'F')[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-white">{f.name || 'Freelancer'}</p>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${colInfo.color.replace('border-t-', 'border-').replace('border-success', 'border-success/50')} bg-zinc-900`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colInfo.dot}`} />{colInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">{proposal.coverLetter}</p>
                      <div className="flex gap-3 text-[10px] text-zinc-500 mt-1">
                        <span>KES {Number(proposal.proposedBudget || 0).toLocaleString()}</span>
                        <span>{proposal.timeline || '?'}d delivery</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {['SUBMITTED', 'SHORTLISTED'].includes(proposal.status) && (
                        <>
                          <button onClick={() => setConfirmModal({ type: 'accept', proposalId: proposal.id, name: f.name })} disabled={acceptMutation.isPending} className="px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-xl text-xs font-bold hover:bg-success/20 transition-colors">Accept</button>
                          <button onClick={() => setConfirmModal({ type: 'reject', proposalId: proposal.id, name: f.name })} disabled={rejectMutation.isPending} className="px-3 py-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl text-xs font-bold hover:bg-red-400/20 transition-colors">Reject</button>
                        </>
                      )}
                      <button onClick={() => navigate(`/client/proposals/${proposal.id}`)} className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accept Modal */}
      <ConfirmModal
        isOpen={confirmModal?.type === 'accept'}
        title="Accept Proposal"
        message={`Accept ${confirmModal?.name}'s proposal? A contract will be created automatically.`}
        confirmLabel="Accept & Create Contract"
        confirmVariant="success"
        isLoading={acceptMutation.isPending}
        onConfirm={handleAccept}
        onClose={() => setConfirmModal(null)}
      />

      {/* Reject Modal */}
      {confirmModal?.type === 'reject' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Reject Proposal</h3>
            <p className="text-sm text-zinc-400">Rejecting <strong className="text-white">{confirmModal.name}</strong>'s proposal. Provide an optional reason:</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason (optional)..." rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setConfirmModal(null); setRejectReason(''); }} className="px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
              <button onClick={handleReject} disabled={rejectMutation.isPending} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
