import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, MoreHorizontal, User, Calendar, DollarSign,
  Search, Filter, RefreshCw, Award
} from 'lucide-react';
import {
  useMyContracts, useCancelContract, useSignContract
} from '../services/clientHooks';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  ACTIVE:    'bg-success/10 text-success border-success/20',
  PENDING:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  COMPLETED: 'bg-#2bb75c]/10 text-blue-400 border-#2bb75c]/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  DISPUTED:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  TERMINATED:'bg-zinc-500/10 text-zinc-400 border-zinc-600/20',
};

const TABS = ['All', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];

export default function ContractsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);

  const filters = {
    page, limit: 12,
    ...(activeTab !== 'All' && { status: activeTab }),
    ...(search && { search }),
  };

  const { data, isLoading, error, refetch } = useMyContracts(filters);
  const cancelMutation = useCancelContract();

  const contracts = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleCancel = async () => {
    if (!confirmModal) return;
    try {
      await cancelMutation.mutateAsync({ contractId: confirmModal.contractId, reason: cancelReason });
      toast.success('Contract cancelled successfully.');
      setConfirmModal(null);
      setCancelReason('');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not cancel contract.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Contracts</h1>
            <p className="text-sm font-semibold text-zinc-400 mt-1">{total} active and past contract{total !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                placeholder="Search contracts..." 
                className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-zinc-200 focus:outline-none focus:border-success w-full sm:w-64" 
              />
            </div>
            <button onClick={() => refetch()} className="p-2 text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <div className="w-8 h-8 border-4 border-zinc-800 border-t-success rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-bold">Loading contracts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm font-bold">Failed to load contracts. <button onClick={() => refetch()} className="text-success underline">Retry</button></p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-center px-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700">
              <FileText className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">No contracts found</h2>
            <p className="text-zinc-400 max-w-md mx-auto">You do not have any contracts matching your filters.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Contract ID / Freelancer</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Amount</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Milestones</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Date Created</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {contracts.map(contract => (
                    <tr key={contract.id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-success" />
                          </div>
                          <div>
                            <div 
                              className="text-sm font-bold text-white group-hover:text-success transition-colors cursor-pointer"
                              onClick={() => navigate(`/client/contracts/${contract.id}`)}
                            >
                              {contract.freelancer?.name || 'Unknown Freelancer'}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono mt-0.5">
                              #{contract.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${STATUS_STYLES[contract.status] || STATUS_STYLES.ACTIVE}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-white">KES {(contract.totalAmount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        {contract.milestones?.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-300">
                            <Award className="w-4 h-4 text-success" />
                            {contract.milestones.filter(m => m.status === 'approved').length}/{contract.milestones.length} Done
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-zinc-500">No Milestones</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-zinc-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> 
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <button 
                            onClick={() => navigate(`/client/contracts/${contract.id}`)}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors border border-zinc-700"
                          >
                            Manage
                          </button>
                          
                          {['ACTIVE', 'PENDING'].includes(contract.status) && (
                            <>
                              <button 
                                onClick={() => setMenuOpen(menuOpen === contract.id ? null : contract.id)}
                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-700"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {menuOpen === contract.id && (
                                <div className="absolute right-0 top-10 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                  <button
                                    onClick={() => { setConfirmModal({ contractId: contract.id, title: `Contract #${contract.id}` }); setMenuOpen(null); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Cancel Contract
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

      {/* Cancel Contract Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setConfirmModal(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /> Cancel Contract</h3>
            <p className="text-sm font-semibold text-zinc-400">You are cancelling <strong className="text-white">{confirmModal.title}</strong>. Please provide a reason below.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (required)..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm font-medium text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 resize-none"
            />
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { setConfirmModal(null); setCancelReason(''); }} className="px-4 py-2.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Keep Contract</button>
              <button onClick={handleCancel} disabled={cancelMutation.isPending || !cancelReason.trim()} className="px-5 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
