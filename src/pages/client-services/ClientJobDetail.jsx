import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BriefcaseBusiness, Clock3, Eye, MessageSquare, PencilLine, ShieldCheck, Sparkles } from "lucide-react";
import { clientWorkspaceAPI } from "../../Services/clientWorkspaceAPI";

const statusPill = {
  open: "bg-[#ECF9F0] text-[#287A45]",
  in_progress: "bg-[#EFF5FF] text-[#2D5B9F]",
  closed: "bg-[#F5ECE8] text-[#7A665E]",
  expired: "bg-[#FFF2EF] text-[#9E3B2B]",
};

const proposalActions = [
  { label: "Shortlist", value: "shortlisted", tone: "border border-[#D7CBC4] bg-white text-[#2B211F]" },
  { label: "Accept", value: "accepted", tone: "bg-[#2B211F] text-white" },
  { label: "Reject", value: "rejected", tone: "bg-[#FDECE7] text-[#B53A27]" },
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
  const [success, setSuccess] = useState("");

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
        acc[proposal.status] = (acc[proposal.status] || 0) + 1;
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
    setError("");
    setSuccess("");
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
      setSuccess("Job details updated.");
    } catch (err) {
      setError(err.message || "Could not update this job.");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseJob = async () => {
    if (!job || closing || job.status === "closed") return;
    setClosing(true);
    setError("");
    setSuccess("");
    try {
      const response = await clientWorkspaceAPI.closeJob(jobId);
      const nextJob = response?.request || response?.data || { ...job, status: "closed" };
      setJob(nextJob);
      setSuccess("Job closed.");
    } catch (err) {
      setError(err.message || "Could not close this job.");
    } finally {
      setClosing(false);
    }
  };

  const handleProposalAction = async (proposalId, status) => {
    if (activeProposal) return;
    setActiveProposal(proposalId);
    setError("");
    setSuccess("");
    try {
      const response = await clientWorkspaceAPI.updateProposalStatus(proposalId, status);
      const updated = response?.proposal || response?.data;
      setProposals((prev) => prev.map((item) => (item._id === proposalId ? { ...item, ...updated, status } : item)));
      setSuccess(`Proposal ${status}.`);
    } catch (err) {
      setError(err.message || "Could not update proposal status.");
    } finally {
      setActiveProposal("");
    }
  };

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#E5D9D0] bg-white px-6 py-12 text-center text-sm text-[#6F5B53] shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
        Loading job workspace...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="rounded-[28px] border border-[#E5D9D0] bg-white px-6 py-12 text-center shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
        <BriefcaseBusiness size={28} className="mx-auto text-[#B53A27]" />
        <h1 className="mt-4 text-xl font-semibold text-[#2B211F]">Job not found</h1>
        <p className="mt-2 text-sm text-[#6F5B53]">This client request is missing or no longer available.</p>
        <Link to="/client-services/my-jobs" className="mt-5 inline-flex rounded-full bg-[#C9452F] px-4 py-2.5 text-sm font-medium text-white">
          Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#E5D9D0] bg-[radial-gradient(circle_at_top_left,_#FFF7F2,_#F6EFEA_42%,_#FFFFFF_100%)] p-6 shadow-[0_20px_50px_rgba(33,24,21,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.18em] text-[#7A665E]">Client Job Workspace</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-[#2B211F]">{job.title}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusPill[job.status] || statusPill.open}`}>
                {job.status}
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-sm text-[#6F5B53]">
              Update the brief, review freelancer proposals, and move the job forward from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/messages" className="inline-flex items-center gap-2 rounded-full border border-[#D7CBC4] bg-white px-4 py-2.5 text-sm font-medium text-[#2B211F]">
              <MessageSquare size={15} />
              Messages
            </Link>
            <button
              type="button"
              onClick={handleCloseJob}
              disabled={closing || job.status === "closed"}
              className="rounded-full bg-[#2B211F] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {closing ? "Closing..." : job.status === "closed" ? "Closed" : "Close Job"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Budget</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{job.currency || "USD"} {job.budgetMin} - {job.budgetMax}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Views</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{job.views || 0}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Proposals</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{proposalSummary.total}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Deadline</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "Flexible"}</p>
          </div>
        </div>
      </div>

      {(error || success) && (
        <div className={`rounded-2xl px-4 py-3 text-sm ${error ? "border border-[#F3C0B7] bg-[#FFF2EF] text-[#9E3B2B]" : "border border-[#CBE7D3] bg-[#F2FBF5] text-[#287A45]"}`}>
          {error || success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSave} className="rounded-[28px] border border-[#E5D9D0] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#FDECE7] p-3 text-[#B53A27]">
              <PencilLine size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#2B211F]">Edit job details</h2>
              <p className="text-sm text-[#6F5B53]">Keep the brief accurate while proposals are coming in.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Job title</span>
              <input name="title" value={form.title} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Category</span>
              <input name="category" value={form.category} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Subcategory</span>
              <input name="subcategory" value={form.subcategory} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Service mode</span>
              <select name="serviceMode" value={form.serviceMode} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F]">
                <option>Fully online</option>
                <option>Physical on-site</option>
                <option>Hybrid (online + on-site)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Location</span>
              <input name="location" value={form.location} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Minimum budget</span>
              <input name="budgetMin" type="number" min="0" value={form.budgetMin} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Maximum budget</span>
              <input name="budgetMax" type="number" min="0" value={form.budgetMax} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Currency</span>
              <select name="currency" value={form.currency} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F]">
                <option>USD</option>
                <option>KES</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Deadline</span>
              <input name="deadline" type="date" value={form.deadline} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Tags</span>
              <input name="tags" value={form.tags} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-[#5A4640]">Description</span>
              <textarea name="description" rows={6} value={form.description} onChange={handleFormChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
            </label>
          </div>

          <label className="mt-4 flex items-center gap-3 rounded-2xl bg-[#FCFAF8] px-4 py-3 text-sm text-[#5A4640]">
            <input type="checkbox" name="isUrgent" checked={form.isUrgent} onChange={handleFormChange} />
            Mark this job as urgent
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="rounded-full bg-[#C9452F] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/client-services/my-jobs" className="rounded-full border border-[#D7CBC4] bg-white px-5 py-3 text-sm font-medium text-[#2B211F]">
              Back to My Jobs
            </Link>
          </div>
        </form>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
              <div className="flex items-center gap-3 text-[#B53A27]">
                <Sparkles size={17} />
                <p className="text-sm font-medium text-[#5A4640]">Proposal pipeline</p>
              </div>
              <p className="mt-3 text-2xl font-semibold text-[#2B211F]">{proposalSummary.pending}</p>
              <p className="mt-1 text-sm text-[#6F5B53]">Still waiting for review.</p>
            </div>
            <div className="rounded-[24px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
              <div className="flex items-center gap-3 text-[#B53A27]">
                <ShieldCheck size={17} />
                <p className="text-sm font-medium text-[#5A4640]">Shortlisted</p>
              </div>
              <p className="mt-3 text-2xl font-semibold text-[#2B211F]">{proposalSummary.shortlisted}</p>
              <p className="mt-1 text-sm text-[#6F5B53]">Top candidates you want to revisit.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E5D9D0] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-[#2B211F]">Proposals</h2>
                <p className="mt-1 text-sm text-[#6F5B53]">Review proposals and update each freelancer from here.</p>
              </div>
              <Link to="/messages" className="text-sm font-medium text-[#B53A27]">
                Open messages
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {proposals.length === 0 ? (
                <div className="rounded-2xl bg-[#FCFAF8] px-4 py-10 text-center text-sm text-[#6F5B53]">
                  No proposals yet. Once freelancers respond, they will show here.
                </div>
              ) : (
                proposals.map((proposal) => (
                  <div key={proposal._id} className="rounded-[24px] border border-[#E9DED7] bg-[#FFFCFA] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-[#2B211F]">{proposal.freelancer?.name || "Freelancer"}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusPill[proposal.status] || "bg-[#FCF1DB] text-[#8A6100]"}`}>
                            {proposal.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#7A665E]">
                          <span className="rounded-full bg-white px-3 py-1">{job.currency || "USD"} {proposal.bidAmount}</span>
                          <span className="rounded-full bg-white px-3 py-1">{proposal.deliveryDays} day delivery</span>
                          {proposal.freelancer?.country && <span className="rounded-full bg-white px-3 py-1">{proposal.freelancer.country}</span>}
                          {proposal.freelancer?.avgRating ? <span className="rounded-full bg-white px-3 py-1">{proposal.freelancer.avgRating} rating</span> : null}
                          {proposal.freelancer?.level ? <span className="rounded-full bg-white px-3 py-1">{proposal.freelancer.level}</span> : null}
                        </div>
                        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#5C4943]">{proposal.coverLetter}</p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {proposalActions.map((action) => (
                          <button
                            key={action.value}
                            type="button"
                            onClick={() => handleProposalAction(proposal._id, action.value)}
                            disabled={activeProposal === proposal._id || proposal.status === action.value}
                            className={`rounded-full px-4 py-2.5 text-sm font-medium disabled:opacity-60 ${action.tone}`}
                          >
                            {activeProposal === proposal._id ? "Saving..." : action.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8A766D]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} />
                        Submitted {new Date(proposal.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={13} />
                        Shared through the connected proposals system
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
