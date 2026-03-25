import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Clock3, Plus, XCircle } from "lucide-react";
import { clientWorkspaceAPI } from "../../Services/clientWorkspaceAPI";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [closingId, setClosingId] = useState("");

  useEffect(() => {
    let mounted = true;

    clientWorkspaceAPI
      .getMyJobs()
      .then((data) => {
        if (!mounted) return;
        setJobs(data?.data || data?.requests || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Could not load jobs.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleClose = async (jobId) => {
    setClosingId(jobId);
    setError("");
    try {
      await clientWorkspaceAPI.closeJob(jobId);
      setJobs((prev) => prev.map((job) => (job._id === jobId || job.id === jobId ? { ...job, status: "closed" } : job)));
    } catch (err) {
      setError(err.message || "Could not close job.");
    } finally {
      setClosingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#E5D9D0] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#7A665E]">Client Jobs</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2B211F]">Manage your posted service requests</h1>
          <p className="mt-2 text-sm text-[#6F5B53]">Review what is open, how many proposals each request has, and close jobs when they are done.</p>
        </div>
        <Link
          to="/client-services/create-job"
          className="inline-flex items-center gap-2 rounded-full bg-[#C9452F] px-5 py-3 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Create Job
        </Link>
      </div>

      {error && <div className="rounded-2xl border border-[#F3C0B7] bg-[#FFF2EF] px-4 py-3 text-sm text-[#9E3B2B]">{error}</div>}

      {loading ? (
        <div className="rounded-[28px] border border-[#E5D9D0] bg-white px-6 py-12 text-center text-sm text-[#6F5B53] shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
          Loading your jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-[28px] border border-[#E5D9D0] bg-white px-6 py-12 text-center shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
          <BriefcaseBusiness size={28} className="mx-auto text-[#B53A27]" />
          <h2 className="mt-4 text-xl font-semibold text-[#2B211F]">No jobs yet</h2>
          <p className="mt-2 text-sm text-[#6F5B53]">Create your first service request to start receiving proposals from freelancers.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id || job.id} className="rounded-[28px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#2B211F]">{job.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      job.status === "open" ? "bg-[#ECF9F0] text-[#287A45]" : "bg-[#F5ECE8] text-[#7A665E]"
                    }`}>
                      {job.status || "open"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6F5B53]">{job.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#7A665E]">
                    <span className="rounded-full bg-[#FCFAF8] px-3 py-1">{job.category}</span>
                    <span className="rounded-full bg-[#FCFAF8] px-3 py-1">{job.serviceMode}</span>
                    <span className="rounded-full bg-[#FCFAF8] px-3 py-1">
                      {job.currency || "USD"} {job.budgetMin} - {job.budgetMax}
                    </span>
                    <span className="rounded-full bg-[#FCFAF8] px-3 py-1">{job.proposalCount || 0} proposals</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/client-services/jobs/${job._id || job.id}`}
                    className="rounded-full border border-[#D7CBC4] bg-white px-4 py-2.5 text-sm font-medium text-[#2B211F]"
                  >
                    Open Workspace
                  </Link>
                  <Link
                    to={`/client-services/jobs/${job._id || job.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#FDECE7] px-4 py-2.5 text-sm font-medium text-[#B53A27]"
                  >
                    Review Proposals
                    <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleClose(job._id || job.id)}
                    disabled={job.status !== "open" || closingId === (job._id || job.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2B211F] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                  >
                    <XCircle size={15} />
                    {closingId === (job._id || job.id) ? "Closing..." : "Close Job"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#8A766D]">
                <Clock3 size={14} />
                <span>Created {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
