import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BriefcaseBusiness, Clock3, Eye, MessageSquare, PencilLine, ShieldCheck, Sparkles, XCircle, CheckCircle } from "lucide-react";
import { clientWorkspaceAPI } from "../../../common/services/clientWorkspaceAPI";
import toast from "react-hot-toast";
import { useConfirm } from "../../../common/context/ConfirmContext";

const statusPill = {
  open: "bg-success/10 text-success border border-success/20",
  in_progress: "bg-#2bb75c]/10 text-blue-400 border border-#2bb75c]/20",
  closed: "bg-zinc-800 text-zinc-400 border border-zinc-700",
  expired: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const proposalActions = [
  { label: "Shortlist", value: "shortlisted", tone: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700" },
  { label: "Accept & Hire", value: "accepted", tone: "bg-success hover:bg-success/90 text-zinc-950" },
  { label: "Decline", value: "rejected", tone: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20" },
];

const toFormState = (job) => ({
  title: job?.title || "",
  category: job?.category || "",
  subcategory: job?.subcategory || "",
  serviceMode: job?.serviceMode || "Fully online",
  location: job?.location || "Remote",
  budgetMin: job?.budgetMin ?? "",
  budgetMax: job?.budgetMax ?? "",
  currency: job?.currency || "USD",
  deadline: job?.deadline ? new Date(job.deadline).toISOString().slice(0, 10) : "",
  tags: Array.isArray(job?.tags) ? job.tags.join(", ") : "",
  description: job?.description || "",
  isUrgent: Boolean(job?.isUrgent),
});

export default function ClientJobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [form, setForm] = useState(() => toFormState());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeProposal, setActiveProposal] = useState("");
  const [error, setError] = useState("");
  const { confirm } = useConfirm();

  useEffect(() => {
    let mounted = true;

    Promise.all([clientWorkspaceAPI.getJob(jobId), clientWorkspaceAPI.getJobProposals(jobId)])
      .then(([jobResponse, proposalResponse]) => {
        if (!mounted) return;
        const nextJob = jobResponse?.request || jobResponse?.data || null;
        const nextProposals = proposalResponse?.proposals || proposalResponse?.data || [];
        setJob(nextJob);
        setForm(toFormState(nextJob));
        setProposals(nextProposals);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Could not load this job.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [jobId]);

  const proposalSummary = useMemo(() => {
    return proposals.reduce(
      (acc, proposal) => {
        acc.total += 1;
        if (proposal.status === "pending") acc.pending += 1;
        if (proposal.status === "shortlisted") acc.shortlisted += 1;
        if (proposal.status === "accepted") acc.accepted += 1;
        if (proposal.status === "rejected") acc.rejected += 1;
        return acc;
      },
      { total: 0, pending: 0, shortlisted: 0, accepted: 0, rejected: 0 }
    );
  }, [proposals]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!job || saving) return;

    setSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const response = await clientWorkspaceAPI.updateJob(jobId, {
        title: form.title.trim(),
        category: form.category.trim(),
        subcategory: form.subcategory.trim(),
        serviceMode: form.serviceMode,
        location: form.location.trim(),
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        currency: form.currency,
        deadline: form.deadline || undefined,
        description: form.description.trim(),
        tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
        isUrgent: form.isUrgent,
      });
      const nextJob = response?.request || response?.data || job;
      setJob(nextJob);
      setForm(toFormState(nextJob));
      toast.success("Job details updated successfully.", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Could not update this job.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseJob = async () => {
    if (!job || closing || job.status === "closed") return;
    const ok = await confirm({
      title: "Close job",
      message: "Are you sure you want to close this job? You will not receive new proposals.",
      confirmLabel: "Close job",
      critical: true,
    });
    if (!ok) return;
    
    setClosing(true);
    const toastId = toast.loading("Closing job...");
    try {
      const response = await clientWorkspaceAPI.closeJob(jobId);
      const nextJob = response?.request || response?.data || { ...job, status: "closed" };
      setJob(nextJob);
      toast.success("Job closed.", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Could not close this job.", { id: toastId });
    } finally {
      setClosing(false);
    }
  };

  const handleProposalAction = async (proposalId, status) => {
    if (activeProposal) return;
    setActiveProposal(proposalId);
    
    let actionName = status === 'accepted' ? 'Accepting proposal...' : status === 'rejected' ? 'Declining proposal...' : 'Shortlisting...';
    const toastId = toast.loading(actionName);
    
    try {
      const response = await clientWorkspaceAPI.updateProposalStatus(proposalId, status);
      const updated = response?.proposal || response?.data;
      setProposals((prev) => prev.map((item) => (item._id === proposalId || item.id === proposalId ? { ...item, ...updated, status } : item)));
      
      if (status === 'accepted') {
        toast.success("Proposal accepted! A contract offer has been sent.", { id: toastId });
      } else if (status === 'rejected') {
        toast.success("Proposal declined.", { id: toastId });
      } else {
        toast.success("Proposal shortlisted.", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Could not process proposal action.", { id: toastId });
    } finally {
      setActiveProposal("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-success rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
          <BriefcaseBusiness size={28} className="text-success" />
        </div>
        <h1 className="text-xl font-black text-white mb-2">Job not found</h1>
        <p className="text-sm text-zinc-400 mb-6">This client request is missing or no longer available.</p>
        <Link to="/client-services/my-jobs" className="rounded-xl bg-zinc-800 border border-zinc-700 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-700 transition-colors">
          Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-black uppercase tracking-widest text-success">Project Workspace</p>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusPill[job.status] || statusPill.open}`}>
                  {job.status}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white">{job.title}</h1>
              <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
                Update your brief, review freelancer proposals, and hire talent all from this central workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/messages" className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-700 transition-colors">
                <MessageSquare size={16} /> Messages
              </Link>
              <button
                type="button"
                onClick={handleCloseJob}
                disabled={closing || job.status === "closed"}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {closing ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <XCircle size={16} />}
                {job.status === "closed" ? "Closed" : "Close Job"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Budget</p>
              <p className="mt-1.5 text-lg font-bold text-white">{job.currency || "USD"} {job.budgetMin} - {job.budgetMax}</p>
            </div>
            <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Views</p>
              <p className="mt-1.5 text-lg font-bold text-white">{job.views || 0}</p>
            </div>
            <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Proposals</p>
              <p className="mt-1.5 text-lg font-bold text-white">{proposalSummary.total}</p>
            </div>
            <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Deadline</p>
              <p className="mt-1.5 text-lg font-bold text-white">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "Flexible"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Main Content Area - Proposals */}
          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">Freelancer Proposals</h2>
                  <p className="mt-1 text-sm text-zinc-400">Review applicants and hire the perfect fit.</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-bold text-white">
                    <ShieldCheck size={14} className="text-success" /> Shortlisted: {proposalSummary.shortlisted}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {proposals.length === 0 ? (
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 border-dashed p-8 text-center">
                    <p className="text-sm font-bold text-zinc-400">No proposals yet.</p>
                    <p className="text-xs text-zinc-500 mt-1">Once freelancers bid on your project, they will appear here.</p>
                  </div>
                ) : (
                  proposals.map((proposal) => (
                    <div key={proposal._id || proposal.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-700 transition-colors">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-base font-black text-white">{proposal.freelancer?.name || "Freelancer"}</h3>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              proposal.status === 'accepted' ? 'bg-success/10 text-success border-success/20' :
                              proposal.status === 'shortlisted' ? 'bg-success/10 text-success border-success/20' :
                              proposal.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}>
                              {proposal.status || 'PENDING'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-xs mb-4">
                            <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-300 font-bold">
                              {job.currency || "USD"} {proposal.bidAmount}
                            </span>
                            <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-400 flex items-center gap-1">
                              <Clock3 size={12} /> {proposal.deliveryDays} days
                            </span>
                            {proposal.freelancer?.avgRating && (
                              <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-yellow-400 flex items-center gap-1 font-bold">
                                ⭐ {proposal.freelancer.avgRating}
                              </span>
                            )}
                          </div>
                          
                          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">{proposal.coverLetter}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 xl:flex-col xl:items-end w-full xl:w-auto mt-4 xl:mt-0 pt-4 xl:pt-0 border-t border-zinc-800 xl:border-0">
                          {proposalActions.map((action) => (
                            <button
                              key={action.value}
                              type="button"
                              onClick={() => handleProposalAction(proposal._id || proposal.id, action.value)}
                              disabled={activeProposal === (proposal._id || proposal.id) || proposal.status === action.value}
                              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto xl:w-full flex items-center justify-center gap-2 ${action.tone}`}
                            >
                              {activeProposal === (proposal._id || proposal.id) && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Edit Job Form */}
          <div className="space-y-6">
            <form onSubmit={handleSave} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success border border-success/20">
                  <PencilLine size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Edit Brief</h2>
                  <p className="text-xs text-zinc-400">Update details if needed.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Title</label>
                  <input name="title" value={form.title} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-success transition-colors" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Category</label>
                    <input name="category" value={form.category} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-success transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Budget Min</label>
                    <input name="budgetMin" type="number" min="0" value={form.budgetMin} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-success transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Service Mode</label>
                  <select name="serviceMode" value={form.serviceMode} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-success transition-colors">
                    <option>Fully online</option>
                    <option>Physical on-site</option>
                    <option>Hybrid (online + on-site)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea name="description" rows={5} value={form.description} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-success transition-colors resize-none" />
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input type="checkbox" name="isUrgent" checked={form.isUrgent} onChange={handleFormChange} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-success focus:ring-success/20" />
                  <span className="text-sm font-bold text-zinc-300">Mark as urgent</span>
                </label>
              </div>

              <div className="mt-6">
                <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-3 text-sm font-black text-white hover:bg-success transition-colors disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

