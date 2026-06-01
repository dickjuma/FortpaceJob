import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Briefcase, 
  Search,
  ChevronRight, 
  TrendingUp, 
  Star,
  CheckCircle,
  Clock,
  LayoutDashboard,
  User
} from 'lucide-react';
import { useClientDashboard, useClientContracts, useClientJobs } from '../services/dashboard.hooks';
import { useMyProfile } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

// --- Micro-components ---
const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-success/30 transition-colors backdrop-blur-md">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-success/10 border border-success/20 rounded-lg text-success">
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full`}>
          <TrendingUp className="w-3 h-3 mr-1" /> {trendValue}
        </span>
      )}
    </div>
    <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
    <div className="text-3xl font-bold text-white mt-1">{value}</div>
  </div>
);

export default function ClientDashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useClientDashboard();
  const { data: contracts = [], isLoading: contractsLoading } = useClientContracts();
  const { data: jobs = [], isLoading: jobsLoading } = useClientJobs();
  const { data: profile } = useMyProfile();

  const displayName = useMemo(() => {
    if (profile?.firstName) return `${profile.firstName} ${profile.lastName || ''}`.trim();
    return profile?.username || profile?.email?.split('@')[0] || 'Client';
  }, [profile]);
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL';

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-zinc-900/40 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <LayoutDashboard className="w-16 h-16 text-[#e63946] opacity-50" />
        <h2 className="text-xl font-bold text-white">Connection Lost</h2>
        <p className="text-sm text-zinc-400">Failed to load dashboard data. Please try again.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-success text-white rounded-lg">Retry</button>
      </div>
    );
  }

  const totalSpent = stats?.overview?.totalSpent || 0;
  const activeContracts = stats?.contracts?.active || 0;
  const totalJobs = stats?.overview?.totalJobs || 0;
  const openJobs = stats?.overview?.openJobs || 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Area & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-zinc-900/50 p-6 rounded-[32px] border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-success border border-success/30 shadow-lg flex items-center justify-center text-xl font-bold text-white shrink-0 overflow-hidden">
              {profile?.avatar ? <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover" /> : initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {profile?.clientProfile?.companyName || 'Client'} &bull; Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '—'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 relative z-10">
            <Link to="/client-services/create-job" className="flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#14a800]/20">
              <PlusCircle className="w-4 h-4" />
              Post New Project
            </Link>
            <Link to="/client-services/my-jobs" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-full text-sm font-bold transition-colors">
              <Briefcase className="w-4 h-4" />
              View My Projects
            </Link>
            <Link to="/client/talent-search" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-full text-sm font-bold transition-colors">
              <Search className="w-4 h-4" />
              Browse Freelancers
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Projects Posted" value={totalJobs} icon={Briefcase} trend="up" trendValue="+2" />
          <StatCard title="Active Projects" value={activeContracts} icon={LayoutDashboard} />
          <StatCard title="Completed Projects" value={stats?.contracts?.completed || 0} icon={CheckCircle} />
          <StatCard title="Total Spent" value={`KES ${totalSpent.toLocaleString()}`} icon={TrendingUp} />
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Projects Table (Col Span 2) */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-[28px] overflow-hidden backdrop-blur-md flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
              <h2 className="font-bold text-white text-lg">Recent Projects</h2>
              <Link to="/client-services/my-jobs" className="text-sm font-bold text-success hover:text-white transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                    <th className="p-4 font-semibold">Project Name</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Budget</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {contracts.length > 0 ? contracts.slice(0, 5).map(contract => (
                    <tr key={contract.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{contract.title || `Contract #${contract.id}`}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">Updated {new Date(contract.updatedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          contract.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 
                          contract.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          'bg-#14a800]/10 text-blue-400 border-#14a800]/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            contract.status === 'ACTIVE' ? 'bg-success' : 
                            contract.status === 'PENDING' ? 'bg-yellow-500' : 'bg-#14a800]'
                          }`}></span> {contract.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-zinc-300">KES {contract.totalAmount?.toLocaleString() || 0}</td>
                      <td className="p-4 text-right">
                        <button className="text-success hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-success/10 transition-colors">Manage</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-zinc-400">No projects found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[28px] overflow-hidden backdrop-blur-md flex flex-col">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/80">
              <h2 className="font-bold text-white text-lg">Quick Actions</h2>
            </div>
            <div className="p-4 flex-1 space-y-2">
              {[
                { to: '/client/post-job', label: 'Post a New Job', desc: 'Find talent for your project', icon: PlusCircle, color: 'text-success bg-success/10' },
                { to: '/client/talent-search', label: 'Search Freelancers', desc: 'Browse 10,000+ verified experts', icon: Search, color: 'text-blue-400 bg-blue-400/10' },
                { to: '/client/proposals', label: 'Review Proposals', desc: 'Accept or reject applications', icon: Briefcase, color: 'text-orange-400 bg-orange-400/10' },
                { to: '/client/contracts', label: 'Manage Contracts', desc: 'Track active & past agreements', icon: CheckCircle, color: 'text-success bg-success/10' },
                { to: '/client/wallet', label: 'Wallet & Payments', desc: 'Deposit, withdraw, escrow', icon: TrendingUp, color: 'text-yellow-400 bg-yellow-400/10' },
                { to: '/client/disputes', label: 'Disputes', desc: 'Open or track dispute cases', icon: LayoutDashboard, color: 'text-red-400 bg-red-400/10' },
              ].map(({ to, label, desc, icon: Icon, color }) => (
                <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700 transition-colors group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">{label}</p>
                    <p className="text-[10px] text-zinc-500">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 text-center">
              <Link to="/client/talent-search" className="text-sm font-bold text-success hover:text-white transition-colors">Browse All Talent →</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}