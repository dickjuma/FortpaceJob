import React from 'react';
import { 
  TrendingUp, Users, Briefcase, ShoppingBag, 
  Activity, Shield, Star, FileText
} from 'lucide-react';
import { useMarketplaceStats } from '../../hooks/useMarketplace';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function MarketplaceDashboardPage() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { data: stats, isLoading } = useMarketplaceStats();

  const handleTimeRangeChange = () => {
    toast.loading('Filtering analytics for 30 days...', { duration: 2000 });
  };

  const handleReviewQueue = () => {
    toast('Redirecting to Content Review Queue...', { icon: '🛡️' });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Marketplace Overview</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time telemetry and analytics for the Fortspace marketplace.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'audit' : 'dashboard')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-brand-600" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'dashboard' ? 'Audit Trail' : 'Back to Dashboard'}
          </button>
          <button 
            onClick={handleTimeRangeChange}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-surface transition-colors"
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="JOB,CONTRACT,PROPOSAL,REVIEW" 
             title="Marketplace Activity Logs"
             description="Monitoring all job postings, contract negotiations, and community feedback events."
           />
        </div>
      ) : (
        <>

      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Jobs</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stats?.jobs?.total || 0}</p>
          </div>
        </div>
        
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-success rounded-xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Gigs</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stats?.gigs?.total || 0}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Proposals</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stats?.proposals?.total || 0}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Value (KES)</p>
            <p className="text-xl font-black text-zinc-900 dark:text-white">{(stats?.marketplace?.totalValue || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
          <Activity size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">Activity Trends</h3>
          <p className="text-zinc-500 text-sm mt-2">Interactive charts are being compiled...</p>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-red-500" size={20} />
              <h3 className="font-bold text-zinc-900 dark:text-white">Flagged Content</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Flagged Jobs</span>
                <span className="font-bold text-red-700 dark:text-red-400">{stats?.jobs?.flagged || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Flagged Gigs</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{stats?.gigs?.flagged || 0}</span>
              </div>
            </div>
            <button 
              onClick={handleReviewQueue}
              className="w-full mt-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-zinc-800 transition-colors"
            >
              Review Queue
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-amber-500 fill-amber-500" size={20} />
              <h3 className="font-bold text-zinc-900 dark:text-white">Review Moderation</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Pending Approval</span>
                <span className="font-bold text-zinc-900 dark:text-white">{stats?.reviews?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Average Rating</span>
                <span className="font-bold text-amber-500">{stats?.reviews?.avgRating || "0.0"} / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
