import React, { useState } from 'react';
import { 
  FileText, Search, MoreVertical, 
  ArrowUpDown, AlertTriangle, CheckCircle, Clock, Eye, AlertOctagon, RefreshCw, Activity
} from 'lucide-react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';
import { useContracts } from '../../hooks/useMarketplace';
import useMarketplaceStore from '../../store/marketplaceStore';
import { CONTRACT_STATUSES } from '../../config/marketplaceConfig';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import MarketplaceDetailModal from '../../components/marketplace/MarketplaceDetailModal';
import MarketplaceEditModal from '../../components/marketplace/MarketplaceEditModal';
import MarketplaceActionModal from '../../components/marketplace/MarketplaceActionModal';
import MarketplaceRequestUpdateModal from '../../components/marketplace/MarketplaceRequestUpdateModal';
import UserProfileModal from '../../components/users/UserProfileModal';
import UserRankingModal from '../../components/users/UserRankingModal';
import UserFlagModal from '../../components/users/UserFlagModal';

const StatusBadge = ({ status }) => {
  const config = CONTRACT_STATUSES[status] || CONTRACT_STATUSES.draft;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      config.bg, config.color
    )}>
      {config.label}
    </span>
  );
};

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState('contracts');
  const { data: contractsData, isLoading } = useContracts();
  const { filters, setFilter, setPage } = useMarketplaceStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === contractsData?.data?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contractsData?.data?.map(c => c.id) || []);
    }
  };

  const handleAction = (action, id) => {
    const contract = contractsData?.data?.find(c => c.id === id);
    if (action === 'View') {
      setSelectedContract(contract);
      setIsViewModalOpen(true);
    } else if (action === 'Update') {
      setSelectedContract(contract);
      setIsRequestModalOpen(true);
    } else if (action === 'Edit') {
      setSelectedContract(contract);
      setIsEditModalOpen(true);
    } else if (action === 'Dispute') {
      setSelectedContract(contract);
      setIsActionModalOpen(true);
    } else {
      toast.success(`${action} requested for contract ${id}`);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-xl">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Contract Management</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor active agreements, milestones, and dispute resolutions.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'contracts' ? 'audit' : 'contracts')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-[#4C1D95]" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={18} /> {activeTab === 'contracts' ? 'Audit Trail' : 'Back to Contracts'}
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="CONTRACT" 
             title="Contract Activity Logs"
             description="Monitoring contract amendments, milestone completions, and escrow release requests."
           />
        </div>
      ) : (
        <>

      {/* Table Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              value={filters.contracts.search}
              onChange={(e) => setFilter('contracts', 'search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#4C1D95] outline-none"
            />
          </div>
          <select 
            value={filters.contracts.status}
            onChange={(e) => setFilter('contracts', 'status', e.target.value)}
            className="px-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === (contractsData?.data?.length || 0) && selectedIds.length > 0}
                    onChange={toggleAll}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-[#4C1D95] focus:ring-[#4C1D95]"
                  />
                </th>
                <th className="p-4">Contract ID & Job</th>
                <th className="p-4">Freelancer</th>
                <th className="p-4">Client</th>
                <th className="p-4">Value</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div></td>
                    <td className="p-4"><div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                contractsData?.data?.map((contract) => (
                  <tr key={contract.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(contract.id)}
                        onChange={() => toggleSelect(contract.id)}
                        className="rounded border-zinc-300 dark:border-zinc-600 text-[#4C1D95]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 dark:text-white">{contract.id}</span>
                        <span className="text-xs text-zinc-500">Ref: {contract.jobId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => handleUserAction('profile', { name: contract.freelancerName, id: contract.freelancerId })}
                      >
                        <Avatar name={contract.freelancerName} size="sm" />
                        <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-[#4C1D95] transition-colors">{contract.freelancerName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => handleUserAction('profile', { name: contract.clientName, id: contract.clientId })}
                      >
                        <Avatar name={contract.clientName} size="sm" />
                        <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-[#4C1D95] transition-colors">{contract.clientName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-zinc-900 dark:text-white">
                        <span className="text-xs text-zinc-400 mr-1">KES</span>
                        {contract.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-[#4C1D95]">{contract.progress}%</span>
                          <span className="text-zinc-400">{contract.completedMilestones}/{contract.milestones}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4C1D95] rounded-full" style={{ width: `${contract.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={contract.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        <button 
                          onClick={() => handleAction('View', contract.id)}
                          className="p-2 text-[#4C1D95] bg-[#4C1D95]/5 hover:bg-[#4C1D95]/10 dark:bg-[#4C1D95]/40 dark:text-[#4C1D95] rounded-xl transition-all shadow-sm border border-[#4C1D95]/20 dark:border-[#4C1D95]/20" title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction('Update', contract.id)}
                          className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 rounded-xl transition-all shadow-sm border border-amber-100 dark:border-amber-800" title="Request Update"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction('Dispute', contract.id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-xl transition-all shadow-sm border border-red-100 dark:border-red-800" title="Dispute"
                        >
                          <AlertOctagon size={18} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl ml-1" title="More Options">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-surface-dark/50">
          <p className="text-sm text-zinc-500">
            Showing <span className="font-medium text-zinc-900 dark:text-white">{contractsData?.data?.length || 0}</span> contracts
          </p>
          <div className="flex gap-1">
            <button 
              disabled={contractsData?.page === 1}
              onClick={() => setPage('contracts', (contractsData?.page || 2) - 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <button 
              disabled={contractsData?.page === contractsData?.totalPages}
              onClick={() => setPage('contracts', (contractsData?.page || 0) + 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-zinc-800"
            >
              Next
            </button>
        </div>
        </div>
        </div>
      </>
      )}

      <MarketplaceDetailModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedContract}
        type="contract"
      />

      <MarketplaceEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedContract}
        type="contract"
      />

      <MarketplaceActionModal 
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        data={selectedContract}
        type="dispute"
      />

      <MarketplaceRequestUpdateModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        data={selectedContract}
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


