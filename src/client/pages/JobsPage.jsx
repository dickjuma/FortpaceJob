import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Clock, CheckCircle, MoreHorizontal, Search, Filter,
  Plus, AlertCircle, ChevronDown, Eye
} from 'lucide-react';
import { useMyJobs, useCancelJob, useDeleteJob } from '../services/clientHooks';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_STYLES = {
  OPEN: 'bg-success/10 text-success border-success/20',
  ASSIGNED: 'bg-#14a800]/10 text-blue-400 border-#14a800]/20',
  COMPLETED: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  CLOSED: 'bg-zinc-500/10 text-zinc-400 border-zinc-600/20',
};

const TABS = ['All', 'OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];

export default function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null); // { type, jobId, jobTitle }
  const [menuOpen, setMenuOpen] = useState(null);

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

  const handleCancel = async () => {
    if (!confirmModal) return;
    try {
      await cancelJob.mutateAsync(confirmModal.jobId);
      setConfirmModal(null);
    } catch (_) {}
  };

  const handleDelete = async () => {
    if (!confirmModal) return;
    try {
      await deleteJob.mutateAsync(confirmModal.jobId);
      setConfirmModal(null);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">My Jobs</h1>
            <p className="text-sm text-zinc-400 mt-1">{total} project{total !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => navigate('/client/post-job')}
            className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#14a800]/20"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  activeTab === tab
                    ? 'bg-success text-white border-success'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search jobs..."
                className="bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-success w-52"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 bg-zinc-900/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm">Failed to load jobs. <button onClick={refetch} className="text-success underline">Retry</button></p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <Briefcase className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400">No jobs found. Post your first job to get started.</p>
            <button onClick={() => navigate('/client/post-job')} className="px-5 py-2 bg-success text-white rounded-full text-sm font-bold">Post a Job</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="relative bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-colors group">

                {/* Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_STYLES[job.status] || STATUS_STYLES.CLOSED}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {job.status}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                      className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === job.id && (
                      <div className="absolute right-0 top-9 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-20 w-44 overflow-hidden" onClick={() => setMenuOpen(null)}>
                        <button onClick={() => navigate(`/client/jobs/${job.id}`)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"><Eye className="w-4 h-4" />View Details</button>
                        {job.status === 'OPEN' && (
                          <button onClick={() => setConfirmModal({ type: 'cancel', jobId: job.id, jobTitle: job.title })} className="w-full text-left px-4 py-2.5 text-sm text-yellow-400 hover:bg-zinc-800 flex items-center gap-2"><Clock className="w-4 h-4" />Cancel Job</button>
                        )}
                        {['OPEN', 'CANCELLED'].includes(job.status) && (
                          <button onClick={() => setConfirmModal({ type: 'delete', jobId: job.id, jobTitle: job.title })} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Delete Job</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug mb-1 line-clamp-2">{job.title}</h3>
                <p className="text-xs text-zinc-500 mb-3">Posted {new Date(job.createdAt).toLocaleDateString()}</p>

                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.type || 'REMOTE'}</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {job.proposals?.length || 0} proposal{job.proposals?.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-success">
                    KES {(job.budgetMin || 0).toLocaleString()} – {(job.budgetMax || 0).toLocaleString()}
                  </div>
                  <button
                    onClick={() => navigate(`/client/jobs/${job.id}`)}
                    className="px-3 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-success/20 text-zinc-300 hover:text-success border border-zinc-700 hover:border-success/40 rounded-lg transition-colors"
                  >
                    Manage
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

      {/* Confirm Modal — Cancel */}
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

      {/* Confirm Modal — Delete */}
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
    </div>
  );
}