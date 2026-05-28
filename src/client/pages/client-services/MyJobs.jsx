import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, BriefcaseBusiness, Clock3, Plus, XCircle, 
  Search, Filter, ChevronDown, CheckCircle, MoreHorizontal
} from "lucide-react";
import { clientWorkspaceAPI } from "../../../common/services/clientWorkspaceAPI";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [closingId, setClosingId] = useState("");
  const [activeTab, setActiveTab] = useState("All Projects");

  const tabs = ["All Projects", "Active", "Completed", "On Hold", "Drafts"];

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "active":
        return "bg-vivid-green/20 text-vivid-green border-vivid-green/30";
      case "closed":
      case "completed":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
      case "draft":
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
      default:
        return "bg-vivid-lavender/20 text-vivid-lavender border-vivid-lavender/30";
    }
  };

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
          className="bg-vivid-lavender hover:bg-dark-purple text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Post New Project
        </Link>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-10">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar w-full lg:w-auto gap-2 pb-2 lg:pb-0">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">{error}</div>}

      {/* Projects List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-vivid-lavender rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400 font-bold">Loading your projects...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-center px-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700">
            <BriefcaseBusiness className="w-8 h-8 text-vivid-lavender" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">No projects found</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-6">You haven't posted any projects yet. Create a service request to start receiving proposals from top talent.</p>
          <Link
            to="/client-services/create-job"
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div key={job._id || job.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-2xl p-6 group">
              
              <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
                
                {/* Left Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-vivid-lavender transition-colors cursor-pointer">
                      {job.title}
                    </h2>
                    <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md border ${getStatusColor(job.status || "open")}`}>
                      {job.status || "OPEN"}
                    </span>
                  </div>
                  
                  <p className="text-sm text-zinc-400 line-clamp-2 max-w-3xl mb-4 leading-relaxed">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300">
                      <BriefcaseBusiness className="w-3.5 h-3.5" /> {job.category || "General"}
                    </span>
                    <span className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300">
                      <Clock3 className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-white bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                      {job.currency || "USD"} {job.budgetMin} - {job.budgetMax}
                    </span>
                  </div>
                </div>

                {/* Right Metrics & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 border-t lg:border-t-0 border-zinc-800 pt-4 lg:pt-0">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-6 min-w-[200px]">
                    <div>
                      <p className="text-xs text-zinc-500 font-bold mb-0.5">Proposals</p>
                      <p className="text-xl font-black text-white">{job.proposalCount || 0}</p>
                    </div>
                    <Link 
                      to={`/client-services/jobs/${job._id || job.id}`}
                      className="text-xs font-bold bg-vivid-lavender/10 text-vivid-lavender hover:bg-vivid-lavender hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                    >
                      Review
                    </Link>
                  </div>

                  <div className="flex gap-2 w-full">
                    <Link
                      to={`/client-services/jobs/${job._id || job.id}`}
                      className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-zinc-700"
                    >
                      Workspace
                    </Link>
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-2.5 rounded-xl transition-colors border border-zinc-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
