// DisputesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Plus, Eye, ChevronRight, Clock, CheckCircle,
  XCircle, AlertCircle, RefreshCw, Shield, X
} from 'lucide-react';
import { useMyDisputes, useOpenDispute } from '../services/clientHooks';
import { useMyContracts } from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const STATUS_STYLES = {
  OPEN:      'bg-warn-light text-warn border-warn/20',
  PENDING:   'bg-info-light text-info border-info/20',
  RESOLVED:  'bg-accent-light text-accent-dark border-accent/20',
  CLOSED:    'bg-surface-muted text-ink-tertiary border-border',
  ESCALATED: 'bg-danger-light text-danger border-danger/20',
};

const REASONS = [
  'Non-delivery of work',
  'Substandard quality',
  'Missed deadline',
  'Contract breach',
  'Unauthorized charge',
  'Communication breakdown',
  'Other',
];

const TABS = ['All', 'OPEN', 'ESCALATED', 'RESOLVED', 'CLOSED'];

// Helper for toast
const showLocalToast = (type, message, setToast, duration = 3000) => {
  setToast({ type, message });
  setTimeout(() => setToast(null), duration);
};

export default function DisputesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contractId: '', reason: '', description: '', evidence: '' });
  const [toast, setToast] = useState(null);

  const filters = { page, limit: 10, ...(activeTab !== 'All' && { status: activeTab }) };
  const { data, isLoading, error, refetch } = useMyDisputes(filters);
  const { data: contractsData } = useMyContracts({ limit: 50, status: 'ACTIVE' });
  const openDispute = useOpenDispute();

  const disputes = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const contracts = contractsData?.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contractId || !form.reason || !form.description.trim()) {
      showLocalToast('error', 'Please fill all required fields.', setToast);
      return;
    }
    try {
      await openDispute.mutateAsync({
        contractId: Number(form.contractId),
        reason: form.reason,
        description: form.description,
        ...(form.evidence && { evidence: form.evidence }),
      });
      setShowForm(false);
      setForm({ contractId: '', reason: '', description: '', evidence: '' });
      showLocalToast('success', 'Dispute opened successfully.', setToast);
      refetch();
    } catch (err) {
      showLocalToast('error', err.message || 'Failed to open dispute', setToast);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const listItemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent" /> Disputes
            </h1>
            <p className="text-sm text-ink-secondary mt-1">{total} dispute{total !== 1 ? 's' : ''} total</p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Open New Dispute
          </motion.button>
        </div>

        {/* Open Dispute Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-accent/20 rounded-2xl p-6 space-y-4 shadow-sm overflow-hidden"
            >
              <h2 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warn" /> Open a Dispute
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Contract *</label>
                    <select
                      value={form.contractId}
                      onChange={(e) => setForm({ ...form, contractId: e.target.value })}
                      required
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      <option value="">Select active contract...</option>
                      {contracts.map(c => (
                        <option key={c.id} value={c.id}>
                          Contract #{c.id} – {c.freelancer?.name || 'Unknown'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Reason *</label>
                    <select
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      required
                      className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      <option value="">Select reason...</option>
                      {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the issue in detail (minimum 50 characters)..."
                    rows={4}
                    required
                    minLength={50}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none bg-white text-ink-primary placeholder:text-ink-tertiary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Evidence / Links (optional)</label>
                  <input
                    value={form.evidence}
                    onChange={(e) => setForm({ ...form, evidence: e.target.value })}
                    placeholder="URLs, file references, etc..."
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={openDispute.isPending}
                    className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {openDispute.isPending ? 'Submitting...' : 'Submit Dispute'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                activeTab === tab
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-ink-secondary border-border hover:border-accent/30"
              )}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={refetch}
            className="ml-auto p-2 rounded-lg text-ink-tertiary hover:text-accent transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-surface-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-white border border-border rounded-2xl">
            <AlertCircle className="w-10 h-10 text-danger opacity-60" />
            <p className="text-ink-secondary text-sm">
              Failed to load disputes. <button onClick={refetch} className="text-accent underline">Retry</button>
            </p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-white border border-border rounded-2xl">
            <Shield className="w-12 h-12 text-ink-tertiary" />
            <p className="text-ink-secondary">No disputes found. Good news!</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {disputes.map((dispute, idx) => (
              <motion.div
                key={dispute.id}
                variants={listItemVariants}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                className="bg-white border border-border rounded-xl p-5 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-warn-light border border-warn/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-warn" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-semibold text-ink-primary text-sm">Dispute #{dispute.id}</h3>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
                        STATUS_STYLES[dispute.status] || STATUS_STYLES.OPEN
                      )}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {dispute.status}
                      </span>
                    </div>
                    <p className="text-sm text-ink-secondary mb-1">{dispute.reason}</p>
                    <p className="text-xs text-ink-tertiary line-clamp-2">{dispute.description}</p>
                    <p className="text-xs text-ink-tertiary mt-2">
                      Opened {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/client/disputes/${dispute.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors shrink-0"
                  >
                    View Case <ChevronRight className="w-3.5 h-3.5" />
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
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
