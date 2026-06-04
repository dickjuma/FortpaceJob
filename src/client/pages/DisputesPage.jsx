import React, { useState } from 'react';
import {
  AlertTriangle, Plus, Eye, ChevronRight, Clock, CheckCircle,
  XCircle, AlertCircle, RefreshCw, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMyDisputes, useOpenDispute } from '../services/clientHooks';
import { useMyContracts } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_STYLES = {
  OPEN:      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PENDING:   'bg-#2bb75c]/10 text-blue-400 border-#2bb75c]/20',
  RESOLVED:  'bg-success/10 text-success border-success/20',
  CLOSED:    'bg-zinc-500/10 text-zinc-400 border-zinc-600/20',
  ESCALATED: 'bg-red-500/10 text-red-400 border-red-500/20',
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

export default function DisputesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contractId: '', reason: '', description: '', evidence: '' });

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
      toast.error('Please fill all required fields.');
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
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-success" /> Disputes
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{total} dispute{total !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#2bb75c]/20"
          >
            <Plus className="w-4 h-4" /> Open New Dispute
          </button>
        </div>

        {/* Open Dispute Form */}
        {showForm && (
          <div className="bg-zinc-900/60 border border-success/20 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" />Open a Dispute</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Contract *</label>
                  <select
                    value={form.contractId}
                    onChange={(e) => setForm({ ...form, contractId: e.target.value })}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success"
                  >
                    <option value="">Select active contract...</option>
                    {contracts.map(c => <option key={c.id} value={c.id}>Contract #{c.id} – {c.freelancer?.name || 'Unknown'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Reason *</label>
                  <select
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success"
                  >
                    <option value="">Select reason...</option>
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail (minimum 50 characters)..."
                  rows={4}
                  required
                  minLength={50}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Evidence / Links (optional)</label>
                <input
                  value={form.evidence}
                  onChange={(e) => setForm({ ...form, evidence: e.target.value })}
                  placeholder="URLs, file references, etc..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={openDispute.isPending} className="px-5 py-2 bg-success text-white rounded-xl text-sm font-bold hover:bg-success transition-colors disabled:opacity-50">
                  {openDispute.isPending ? 'Submitting...' : 'Submit Dispute'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                activeTab === tab ? 'bg-success text-white border-success' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
              }`}>{tab}</button>
          ))}
          <button onClick={refetch} className="ml-auto p-2 text-zinc-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-zinc-900/40 rounded-2xl animate-pulse" />)}</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm">Failed to load disputes. <button onClick={refetch} className="text-success underline">Retry</button></p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <Shield className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400">No disputes found. Good news!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {disputes.map(dispute => (
              <div key={dispute.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-sm">Dispute #{dispute.id}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_STYLES[dispute.status] || STATUS_STYLES.OPEN}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />{dispute.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-1">{dispute.reason}</p>
                    <p className="text-xs text-zinc-500 line-clamp-2">{dispute.description}</p>
                    <p className="text-xs text-zinc-600 mt-2">Opened {new Date(dispute.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/client/disputes/${dispute.id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold transition-colors shrink-0"
                  >
                    View Case <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Previous</button>
            <span className="text-sm text-zinc-400">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

