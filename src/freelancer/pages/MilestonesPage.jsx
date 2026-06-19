import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, DollarSign, Calendar, UploadCloud, MessageSquare,
  FileText, ArrowRight, Loader2, Check, Search,
} from 'lucide-react';
import { useFreelancerContracts, useSubmitMilestone } from '../services/freelancerHooks';

const statusTone = (status) => {
  const value = String(status || '').toUpperCase();
  if (['COMPLETED', 'APPROVED'].includes(value)) return 'bg-accent-light text-accent-dark';
  if (['SUBMITTED', 'IN_REVIEW', 'PENDING'].includes(value)) return 'bg-blue-50 text-blue-700';
  if (['OVERDUE'].includes(value)) return 'bg-danger-light text-danger';
  return 'bg-amber-50 text-amber-700';
};

export default function MilestonesPage() {
  const [search, setSearch] = useState('');
  const [submitModal, setSubmitModal] = useState(null);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const { data, isLoading } = useFreelancerContracts({ page: 1, limit: 50 });
  const submitMilestone = useSubmitMilestone();

  const contracts = Array.isArray(data?.items) ? data.items : [];
  const milestones = contracts.flatMap((contract) =>
    (contract.milestones || []).map((milestone) => ({ ...milestone, contract }))
  );

  const filtered = milestones.filter((milestone) => {
    const q = search.trim().toLowerCase();
    return !q || `${milestone.title || ''} ${milestone.contract?.title || ''} ${milestone.contract?.client?.name || ''}`.toLowerCase().includes(q);
  });

  const pendingCount = milestones.filter((m) => !['COMPLETED', 'APPROVED'].includes(String(m.status || '').toUpperCase())).length;
  const amountAtRisk = milestones.filter((m) => !['COMPLETED', 'APPROVED'].includes(String(m.status || '').toUpperCase())).reduce((sum, m) => sum + Number(m.amount || 0), 0);

  const submit = () => {
    if (!submitModal) return;
    submitMilestone.mutate(
      { milestoneId: submitModal.id, data: { notes, files } },
      { onSuccess: () => { setSubmitModal(null); setNotes(''); setFiles([]); } }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl"><CheckCircle2 className="w-6 h-6 text-accent DEFAULT" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Milestones</h1>
          </div>
          <p className="text-ink-secondary">Track milestone status, amounts, deadlines, and submit work with files.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Milestones</p>
          <p className="font-display text-3xl font-bold text-brand-900 mt-2">{milestones.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Pending work</p>
          <p className="font-display text-3xl font-bold text-brand-900 mt-2">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Open amount</p>
          <p className="font-display text-3xl font-bold text-brand-900 mt-2">KES {amountAtRisk.toLocaleString()}</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search milestones, contracts, or clients..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No milestones found</h3>
          <p className="text-sm text-ink-secondary mt-1">Milestones from active contracts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((milestone, index) => (
            <motion.div key={`${milestone.id || index}-${milestone.title}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                <div className="p-5 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(milestone.status)}`}>{milestone.status || 'Pending'}</span>
                    <span className="text-xs text-ink-secondary">{milestone.contract?.id}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-900">{milestone.title || milestone.name || 'Milestone'}</h3>
                  <p className="text-sm text-ink-secondary mt-2">{milestone.contract?.title || milestone.contract?.job?.title || 'Contract milestone'}</p>
                  <p className="text-sm text-ink-secondary mt-3">{milestone.description || 'No milestone description provided.'}</p>
                  <div className="flex flex-wrap gap-4 mt-5 text-sm text-ink-secondary">
                    <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> KES {Number(milestone.amount || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {milestone.deadline ? new Date(milestone.deadline).toLocaleDateString() : 'No deadline'}</span>
                  </div>
                </div>
                <div className="p-5 bg-surface-soft flex flex-col gap-3">
                  <button onClick={() => setSubmitModal(milestone)} className="rounded-xl bg-brand-900 py-2 text-sm font-bold text-white inline-flex items-center justify-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Submit work
                  </button>
                  <button className="rounded-xl border border-border bg-white py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted inline-flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Upload files
                  </button>
                  <button className="rounded-xl border border-border bg-white py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted inline-flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> View feedback
                  </button>
                  <button className="rounded-xl border border-border bg-white py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted inline-flex items-center gap-2">
                    Contract <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {submitModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSubmitModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-4 z-50 flex items-center justify-center">
              <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-bold text-xl text-brand-900">Submit milestone work</h3>
                  <p className="text-sm text-ink-secondary mt-1">{submitModal.title}</p>
                </div>
                <div className="p-5 space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Submission notes</span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Files</span>
                    <div className="mt-2 rounded-xl border-2 border-dashed border-border p-6 text-center text-sm text-ink-secondary">
                      Drag files here or click to upload. Selected files are staged for submission.
                    </div>
                  </label>
                </div>
                <div className="p-5 border-t border-border flex justify-end gap-3">
                  <button onClick={() => setSubmitModal(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-bold">Cancel</button>
                  <button disabled={submitMilestone.isPending} onClick={submit} className="rounded-xl bg-brand-900 px-4 py-2 text-sm font-bold text-white inline-flex items-center gap-2 disabled:opacity-50">
                    {submitMilestone.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Submit milestone
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
