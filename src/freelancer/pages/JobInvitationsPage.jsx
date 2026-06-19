import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Users, DollarSign, FileText, XCircle, Send,
  ArrowRight, Search, Loader2, Check,
} from 'lucide-react';
import { useFreelancerJobs, useCreateProposal } from '../services/freelancerHooks';

const Badge = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-danger-light text-danger',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
};

export default function JobInvitationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [proposalModal, setProposalModal] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('7');

  const { data, isLoading, refetch } = useFreelancerJobs({ page: 1, limit: 20, filter: 'Invited' });
  const createProposal = useCreateProposal();

  const invitations = Array.isArray(data?.items)
    ? data.items.filter((job) => String(job.invited || job.invitation || job.isInvitation || '').toLowerCase() !== 'false')
    : [];
  const filtered = invitations.filter((job) => {
    const q = search.trim().toLowerCase();
    return !q || `${job.title || ''} ${job.client?.name || ''} ${job.client?.companyName || ''}`.toLowerCase().includes(q);
  });

  const submitProposal = () => {
    if (!proposalModal) return;
    createProposal.mutate(
      {
        jobId: proposalModal.id,
        coverLetter,
        bidAmount: Number(bidAmount || 0),
        deliveryDays: Number(deliveryDays || 7),
      },
      {
        onSuccess: () => {
          setProposalModal(null);
          setCoverLetter('');
          setBidAmount('');
          refetch();
        },
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl"><Bell className="w-6 h-6 text-accent DEFAULT" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Job invitations</h1>
          </div>
          <p className="text-ink-secondary">Review client invitations, accept, decline, or submit a tailored proposal.</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invited projects..."
            className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-44 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Bell className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No invitations</h3>
          <p className="text-sm text-ink-secondary mt-1">Client invitations will appear here when available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
                <div className="p-5 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge tone="success">Invited</Badge>
                    <Badge>{job.experienceLevel || 'Intermediate'}</Badge>
                    <Badge>{job.budgetType || 'Fixed'}</Badge>
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-900">{job.title || 'Invited project'}</h3>
                  <p className="text-sm text-ink-secondary mt-2 line-clamp-2">{job.description || job.summary || 'No project summary provided.'}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-ink-secondary">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {job.client?.name || job.clientName || 'Client'}</span>
                    <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> {job.budget || job.price || 'Budget hidden'}</span>
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {job.category || 'Category not set'}</span>
                  </div>
                </div>
                <div className="p-5 bg-surface-soft flex flex-col gap-3">
                  <button onClick={() => navigate(`/freelancer/job/${job.id}`)} className="rounded-xl border border-border bg-white py-2 text-sm font-bold text-ink-primary hover:bg-surface-muted inline-flex items-center justify-center gap-2">
                    View details <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setProposalModal(job)} className="rounded-xl bg-brand-900 py-2 text-sm font-bold text-white inline-flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Submit proposal
                  </button>
                  <button className="rounded-xl border border-success/30 bg-success/10 py-2 text-sm font-bold text-success">
                    Accept invitation
                  </button>
                  <button className="rounded-xl border border-danger/30 py-2 text-sm font-bold text-danger hover:bg-danger/5">
                    Decline
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {proposalModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setProposalModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-4 z-50 flex items-center justify-center">
              <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-border flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-900">Submit proposal</h3>
                    <p className="text-sm text-ink-secondary mt-1">{proposalModal.title}</p>
                  </div>
                  <button onClick={() => setProposalModal(null)} className="rounded-lg p-2 hover:bg-surface-muted"><XCircle className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Bid amount</span>
                    <input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} type="number" className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Delivery days</span>
                    <input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} type="number" className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Cover letter</span>
                    <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={6} placeholder="Explain why your team is the best fit..." className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
                  </label>
                </div>
                <div className="p-5 border-t border-border flex justify-end gap-3">
                  <button onClick={() => setProposalModal(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-bold">Cancel</button>
                  <button disabled={createProposal.isPending} onClick={submitProposal} className="rounded-xl bg-brand-900 px-4 py-2 text-sm font-bold text-white inline-flex items-center gap-2 disabled:opacity-50">
                    {createProposal.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Submit
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
