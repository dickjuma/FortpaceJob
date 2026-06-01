import React, { useState } from 'react';
import { 
  FileText, Search, Star, MoreVertical,
  ArrowUpDown, Filter, User, CheckCircle, XCircle, UserPlus, ThumbsUp, ThumbsDown, Eye, Activity
} from 'lucide-react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';
import { useProposals } from '../../hooks/useMarketplace';
import useMarketplaceStore from '../../store/marketplaceStore';
import { PROPOSAL_STATUSES } from '../../config/marketplaceConfig';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import MarketplaceProposalModal from '../../components/marketplace/MarketplaceProposalModal';
import MarketplaceActionModal from '../../components/marketplace/MarketplaceActionModal';
import UserProfileModal from '../../components/users/UserProfileModal';
import UserRankingModal from '../../components/users/UserRankingModal';
import UserFlagModal from '../../components/users/UserFlagModal';

const StatusBadge = ({ status }) => {
  const config = PROPOSAL_STATUSES[status] || PROPOSAL_STATUSES.submitted;
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
      config.bg, config.color
    )}>
      {config.label}
    </span>
  );
};

export default function ProposalsReviewPage() {
  const [activeTab, setActiveTab] = useState('proposals');
  const { data: proposalsData, isLoading } = useProposals();
  const { filters, setFilter, setPage } = useMarketplaceStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('flag');

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === proposalsData?.data?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(proposalsData?.data?.map(p => p.id) || []);
    }
  };

  const handleAction = (action, id) => {
    const proposal = proposalsData?.data?.find(p => p.id === id);
    setSelectedProposal(proposal);
    if (action === 'View') {
      setIsViewModalOpen(true);
    } else if (action === 'Approve' || action === 'Shortlist' || action === 'Reject') {
      setActionType(action === 'Reject' ? 'delist' : 'flag'); // Using flag as a proxy for moderation actions
      setIsActionModalOpen(true);
    } else {
      toast.success(`${action} triggered for ${id}`);
    }
  };

  const handleUserAction = (type, user) => {
    setSelectedUser(user);
    if (type === 'profile') setIsProfileModalOpen(true);
    if (type === 'ranking') setIsRankingModalOpen(true);
    if (type === 'flag') setIsFlagModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Proposal Management</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Review submitted bids, track conversion funnels, and moderate freelancer proposals.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'proposals' ? 'audit' : 'proposals')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-[#14a800]" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={18} /> {activeTab === 'proposals' ? 'Audit Trail' : 'Back to Proposals'}
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="PROPOSAL" 
             title="Proposal Activity Logs"
             description="Monitoring bid submissions, budget negotiations, and selection events."
           />
        </div>
      ) : (
        <>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by job or freelancer..." 
              value={filters.proposals.search}
              onChange={(e) => setFilter('proposals', 'search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#14a800] outline-none"
            />
          </div>
          <select 
            value={filters.proposals.status}
            onChange={(e) => setFilter('proposals', 'status', e.target.value)}
            className="px-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" onChange={toggleAll} checked={selectedIds.length > 0 && selectedIds.length === proposalsData?.data?.length} className="rounded border-zinc-300 dark:border-zinc-600 text-[#14a800] focus:ring-[#14a800]" />
                </th>
                <th className="p-4">Proposal / Job</th>
                <th className="p-4">Freelancer</th>
                <th className="p-4">Bid Amount</th>
                <th className="p-4">Match Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-zinc-500">Loading proposals...</td></tr>
              ) : (
                proposalsData?.data?.map(proposal => (
                  <tr key={proposal.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20">
                    <td className="p-4 text-center">
                      <input type="checkbox" checked={selectedIds.includes(proposal.id)} onChange={() => toggleSelect(proposal.id)} className="rounded border-zinc-300 dark:border-zinc-600 text-[#14a800]" />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white truncate max-w-[200px]" title={proposal.jobTitle}>{proposal.jobTitle}</p>
                        <p className="text-xs text-zinc-500">{proposal.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => handleUserAction('profile', { name: proposal.freelancerName, id: proposal.freelancerId })}
                      >
                        <Avatar name={proposal.freelancerName} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-[#14a800] transition-colors">{proposal.freelancerName}</p>
                          <div 
                            className="flex items-center text-xs text-amber-500 gap-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-1 rounded transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleUserAction('ranking', { name: proposal.freelancerName }); }}
                          >
                            <Star size={10} className="fill-current" />
                            <span>{proposal.freelancerRating}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">
                      KES {proposal.bidAmount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 w-24">
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", proposal.matchScore > 80 ? "bg-success" : "bg-[#14a800]")} style={{ width: `${proposal.matchScore}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500">{proposal.matchScore}%</span>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={proposal.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction('View', proposal.id)}
                          className="p-1.5 text-[#14a800] bg-[#14a800]/5 hover:bg-[#14a800]/10 dark:bg-[#14a800]/20 dark:hover:bg-[#14a800]/40 rounded-lg transition-colors tooltip-trigger" title="View Proposal"
                        >
                          <Eye size={16} />
                        </button>
                        {proposal.status !== 'accepted' && (
                          <button 
                            onClick={() => handleAction('Approve', proposal.id)}
                            className="p-1.5 text-success bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg transition-colors tooltip-trigger" title="Approve Proposal"
                          >
                            <ThumbsUp size={16} />
                          </button>
                        )}
                        {proposal.status === 'submitted' && (
                          <button 
                            onClick={() => handleAction('Shortlist', proposal.id)}
                            className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 rounded-lg transition-colors tooltip-trigger" title="Shortlist Freelancer"
                          >
                            <UserPlus size={16} />
                          </button>
                        )}
                        {proposal.status !== 'rejected' && (
                          <button 
                            onClick={() => handleAction('Reject', proposal.id)}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors tooltip-trigger" title="Reject Proposal"
                          >
                            <ThumbsDown size={16} />
                          </button>
                        )}
                        <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg ml-1" title="More Options">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-surface-dark/50">
          <p className="text-sm text-zinc-500">Showing {proposalsData?.data?.length || 0} proposals</p>
          <div className="flex gap-1">
            <button disabled={proposalsData?.page === 1} onClick={() => setPage('proposals', (proposalsData?.page || 2) - 1)} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-surface">Prev</button>
            <button disabled={proposalsData?.page === proposalsData?.totalPages} onClick={() => setPage('proposals', (proposalsData?.page || 0) + 1)} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-surface">Next</button>
          </div>
        </div>
        </div>
      </>
      )}

      <MarketplaceProposalModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedProposal}
      />

      <MarketplaceActionModal 
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        data={selectedProposal}
        type={actionType}
      />

      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
        onAction={handleUserAction}
      />

      <UserRankingModal 
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        user={selectedUser}
      />

      <UserFlagModal 
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
