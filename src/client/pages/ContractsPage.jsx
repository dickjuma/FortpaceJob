// ContractsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, MoreHorizontal, User, Calendar, DollarSign,
  Search, Filter, RefreshCw, Award, Shield
} from 'lucide-react';
import {
  useMyContracts, useCancelContract, useSignContract
} from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const STATUS_STYLES = {
  ACTIVE:    'bg-accent-light text-accent-dark border-accent/20',
  PENDING:   'bg-warn-light text-warn border-warn/20',
  COMPLETED: 'bg-info-light text-info border-info/20',
  CANCELLED: 'bg-danger-light text-danger border-danger/20',
  DISPUTED:  'bg-warn-light text-warn border-warn/20',
  TERMINATED:'bg-surface-muted text-ink-tertiary border-border',
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
  const [toast, setToast] = useState(null);

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

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleCancel = async () => {
    if (!confirmModal) return;
    if (!cancelReason.trim()) {
      showToast('error', 'Please provide a reason for cancellation.');
      return;
    }
    try {
      await cancelMutation.mutateAsync({ contractId: confirmModal.contractId, reason: cancelReason });
      showToast('success', 'Contract cancelled successfully.');
      setConfirmModal(null);
      setCancelReason('');
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Could not cancel contract.');
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
            <h1 className="font-display text-3xl font-bold text-brand-900">Contracts</h1>
            <p className="text-sm text-ink-secondary mt-1">{total} active and past contract{total !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-accent-light text-accent-dark"
                    : "text-ink-tertiary hover:text-ink-primary hover:bg-surface-soft"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search contracts..."
                className="bg-white border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 text-ink-tertiary hover:text-accent bg-white border border-border rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-border rounded-2xl">
            <div className="w-8 h-8 border-4 border-surface-muted border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="text-ink-tertiary font-medium">Loading contracts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-white border border-border rounded-2xl">
            <AlertCircle className="w-10 h-10 text-danger opacity-60" />
            <p className="text-ink-secondary text-sm">
              Failed to load contracts.{' '}
              <button onClick={() => refetch()} className="text-accent underline">Retry</button>
            </p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-border rounded-2xl text-center px-4">
            <div className="w-16 h-16 bg-surface-soft rounded-2xl flex items-center justify-center mb-4 border border-border">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-900 mb-2">No contracts found</h2>
            <p className="text-ink-secondary max-w-md mx-auto">You do not have any contracts matching your filters.</p>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-soft text-ink-tertiary border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Contract ID / Freelancer</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Milestones</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Date Created</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contracts.map((contract, idx) => (
                    <motion.tr
                      key={contract.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-surface-soft transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-soft border border-border flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <div
                              className="text-sm font-semibold text-ink-primary group-hover:text-accent transition-colors cursor-pointer"
                              onClick={() => navigate(`/client/contracts/${contract.id}`)}
                            >
                              {contract.freelancer?.name || 'Unknown Freelancer'}
                            </div>
                            <div className="text-xs text-ink-tertiary font-mono mt-0.5">
                              #{contract.id}
                            </div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wide border",
                          STATUS_STYLES[contract.status] || STATUS_STYLES.ACTIVE
                        )}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-ink-primary">
                          KES {(contract.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {contract.milestones?.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-secondary">
                            <Award className="w-4 h-4 text-accent" />
                            {contract.milestones.filter(m => m.status === 'approved').length}/{contract.milestones.length} Done
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-ink-tertiary">No Milestones</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-ink-tertiary flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <button
                            onClick={() => navigate(`/client/contracts/${contract.id}`)}
                            className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                          >
                            Manage
                          </button>

                          {['ACTIVE', 'PENDING'].includes(contract.status) && (
                            <>
                              <button
                                onClick={() => setMenuOpen(menuOpen === contract.id ? null : contract.id)}
                                className="p-1.5 border border-border rounded-lg text-ink-tertiary hover:text-accent transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              <AnimatePresence>
                                {menuOpen === contract.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute right-0 top-8 w-44 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1"
                                  >
                                    <button
                                      onClick={() => {
                                        setConfirmModal({ contractId: contract.id, title: `Contract #${contract.id}` });
                                        setMenuOpen(null);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-danger hover:bg-danger-light flex items-center gap-2 transition-colors"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Cancel Contract
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
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-ink-tertiary">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Cancel Contract Modal */}
      <AnimatePresence>
        {confirmModal && (
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
                You are cancelling <span className="font-semibold text-ink-primary">{confirmModal.title}</span>. Please provide a reason below.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (required)..."
                rows={3}
                className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => { setConfirmModal(null); setCancelReason(''); }}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  Keep Contract
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending || !cancelReason.trim()}
                  className="px-5 py-2 bg-danger/20 text-danger border border-danger/30 rounded-lg text-sm font-medium hover:bg-danger/30 transition-colors disabled:opacity-50"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
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
