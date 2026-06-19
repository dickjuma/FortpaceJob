import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Search, Filter, BriefcaseBusiness, Clock3, MoreHorizontal, ChevronDown, CheckCircle, XCircle
} from "lucide-react";
import { useMyJobs, useCancelJob } from "../../services/clientHooks";
import toast from "react-hot-toast";
import { useConfirm } from "../../../platform/common/context/ConfirmContext";

export default function MyJobs() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);

  const { data, isLoading: loading, error, refetch } = useMyJobs();
  const jobs = data?.items || data || [];
  const cancelJobMutation = useCancelJob();

  const tabs = ["All", "Active", "Completed", "Draft", "Closed"];

  const handleCancelJob = async (jobId) => {
    const ok = await confirm({
      title: "Cancel job",
      message: "Are you sure you want to cancel this job? This cannot be undone.",
      confirmLabel: "Cancel job",
      critical: true,
    });
    if (!ok) return;
    try {
      await cancelJobMutation.mutateAsync(jobId);
      toast.success("Job cancelled successfully.");
      refetch();
    } catch (err) {
      toast.error(err.message || "Could not cancel job.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "closed":
      case "completed":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesTab = activeTab === "All" || (job.status || "OPEN").toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [jobs, activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">My Projects</h1>
          <p className="text-sm font-semibold text-zinc-400 mt-1">Manage your active jobs, review proposals, and track milestones.</p>
        </div>
        <Link
          to="/client-services/create-job"
          className="bg-success hover:bg-success text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#4C1D95]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Post New Project
        </Link>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-10">
        {/* Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar w-full lg:w-auto gap-2 pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-success transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">{error?.message || "Error loading jobs"}</div>}

      {/* Projects Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-success rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400 font-bold">Loading your projects...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-center px-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700">
            <BriefcaseBusiness className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">No projects found</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-6">You don't have any projects matching your criteria.</p>
          <Link
            to="/client-services/create-job"
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            Post a Project
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Project</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Budget</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-center">Proposals</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">Posted</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredJobs.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => navigate(`/client-services/jobs/${job._id || job.id}`)}
                          className="text-sm font-bold text-white group-hover:text-success transition-colors cursor-pointer line-clamp-1"
                        >
                          {job.title}
                        </span>
                        <span className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                          <BriefcaseBusiness className="w-3 h-3" /> {job.category || "General"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md border ${getStatusColor(job.status || "open")}`}>
                        {job.status || "OPEN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-zinc-300">
                        {job.currency || "USD"} {job.budgetMin} - {job.budgetMax}
                      </span>
                      <div className="text-[10px] text-zinc-500 uppercase mt-0.5">{job.paymentType || 'Fixed Price'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-sm font-bold text-white">
                        {job.proposalCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-zinc-400 flex items-center gap-1.5">
                        <Clock3 className="w-3.5 h-3.5" /> 
                        {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button 
                          onClick={() => navigate(`/client-services/jobs/${job._id || job.id}`)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors border border-zinc-700"
                        >
                          Review
                        </button>
                        
                        {/* Dropdown Menu Toggle */}
                        <button 
                          onClick={() => setStatusMenuOpen(statusMenuOpen === job.id ? null : job.id)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-700"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {statusMenuOpen === job.id && (
                          <div className="absolute right-0 top-10 w-40 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                            <button 
                              onClick={() => { navigate(`/client-services/jobs/${job._id || job.id}`); setStatusMenuOpen(null); }}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              Workspace
                            </button>
                            <button 
                              onClick={() => { handleCancelJob(job._id || job.id); setStatusMenuOpen(null); }}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-between"
                            >
                              Cancel Job <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


