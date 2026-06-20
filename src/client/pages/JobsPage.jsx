// JobsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Clock, CheckCircle, MoreHorizontal, Search,
  Plus, AlertCircle, Eye, ChevronDown,
} from 'lucide-react';
import { useMyJobs, useCancelJob, useDeleteJob } from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const STATUS_STYLES = {
  OPEN: 'bg-accent-light text-accent-dark border-accent/20',
  ASSIGNED: 'bg-info-light text-info border-info/20',
  COMPLETED: 'bg-surface-muted text-ink-tertiary border-border',
  CANCELLED: 'bg-danger-light text-danger border-danger/20',
  CLOSED: 'bg-surface-muted text-ink-tertiary border-border',
};

const TABS = ['All', 'OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];

// ─── Inline Confirm Modal ──────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, title, message, confirmLabel, confirmVariant = 'danger', isLoading, onConfirm, onClose }) => {
  const variantColors = {
    danger: { bg: 'bg-danger', hover: 'hover:bg-danger-dark' },
    success: { bg: 'bg-accent', hover: 'hover:bg-accent-dark' },
  };
  const color = variantColors[confirmVariant] || variantColors.danger;

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="font-display text-xl font-bold text-brand-900 mb-2">{title}</h3>
            <p className="text-sm text-ink-secondary mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50',
                  color.bg,
                  color.hover
                )}
              >
                {isLoading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null); // { type, jobId, jobTitle }
  const [menuOpen, setMenuOpen] = useState(null);
  const [toast, setToast] = useState(null);

  const filters = {
    page,
    limit: 12,
    ...(activeTab !== 'All' && { status: activeTab }),
    ...(search && { search }),
  };

  const { data, isLoading, error, refetch } = useMyJobs(filters);
  const cancelJob = useCancelJob();
  const deleteJob = useDeleteJob();

  const jobs = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleCancel = async () => {
    if (!confirmModal) return;
    try {
      await cancelJob.mutateAsync(confirmModal.jobId);
      setConfirmModal(null);
      showToast('success', `Job "${confirmModal.jobTitle}" cancelled.`);
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to cancel job');
    }
  };

  const handleDelete = async () => {
    if (!confirmModal) return;
    try {
      await deleteJob.mutateAsync(confirmModal.jobId);
      setConfirmModal(null);
      showToast('success', `Job "${confirmModal.jobTitle}" deleted.`);
      refetch();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete job');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-900">My Jobs</h1>
            <p className="text-sm text-ink-secondary mt-1">{total} project{total !== 1 ? 's' : ''} total</p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={() => navigate('/client/post-job')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </motion.button>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  activeTab === tab
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-ink-secondary border-border hover:border-accent/30'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search jobs..."
                className="h-9 bg-white border border-border rounded-lg pl-9 pr-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent w-52"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-surface-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-white border border-border rounded-2xl">
            <AlertCircle className="w-10 h-10 text-danger opacity-60" />
            <p className="text-ink-secondary text-sm">
              Failed to load jobs.{' '}
              <button onClick={() => refetch()} className="text-accent underline">
                Retry
              </button>
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-white border border-border rounded-2xl">
            <Briefcase className="w-12 h-12 text-ink-tertiary" />
            <p className="text-ink-secondary">No jobs found. Post your first job to get started.</p>
            <button
              onClick={() => navigate('/client/post-job')}
              className="px-5 py-2 bg-accent text-white rounded-full text-sm font-medium"
            >
              Post a Job
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={cardVariants}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                className="relative bg-white border border-border rounded-2xl p-5 shadow-sm transition-all"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border',
                      STATUS_STYLES[job.status] || STATUS_STYLES.CLOSED
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {job.status}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                      className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-ink-tertiary hover:text-accent transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {menuOpen === job.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-8 bg-white border border-border rounded-xl shadow-lg z-20 w-44 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              navigate(`/client/jobs/${job.id}`);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-ink-primary hover:bg-surface-soft flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          {job.status === 'OPEN' && (
                            <button
                              onClick={() => {
                                setConfirmModal({ type: 'cancel', jobId: job.id, jobTitle: job.title });
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-warn hover:bg-surface-soft flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" /> Cancel Job
                            </button>
                          )}
                          {['OPEN', 'CANCELLED'].includes(job.status) && (
                            <button
                              onClick={() => {
                                setConfirmModal({ type: 'delete', jobId: job.id, jobTitle: job.title });
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-surface-soft flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4" /> Delete Job
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <h3 className="font-semibold text-ink-primary text-sm leading-snug mb-1 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-xs text-ink-tertiary mb-3">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-4 text-xs text-ink-tertiary mb-4">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {job.type || 'REMOTE'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {job.proposals?.length || 0} proposal{job.proposals?.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-accent">
                    KES {(job.budgetMin || 0).toLocaleString()} – {(job.budgetMax || 0).toLocaleString()}
                  </div>
                  <button
                    onClick={() => navigate(`/client/jobs/${job.id}`)}
                    className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-ink-primary hover:bg-surface-soft transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-ink-tertiary">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={confirmModal?.type === 'cancel'}
        title="Cancel Job"
        message={`Are you sure you want to cancel "${confirmModal?.jobTitle}"? This will close the job to new proposals.`}
        confirmLabel="Yes, Cancel Job"
        confirmVariant="danger"
        isLoading={cancelJob.isPending}
        onConfirm={handleCancel}
        onClose={() => setConfirmModal(null)}
      />

      <ConfirmModal
        isOpen={confirmModal?.type === 'delete'}
        title="Delete Job"
        message={`Permanently delete "${confirmModal?.jobTitle}"? This cannot be undone.`}
        confirmLabel="Delete Permanently"
        confirmVariant="danger"
        isLoading={deleteJob.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmModal(null)}
      />

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
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
