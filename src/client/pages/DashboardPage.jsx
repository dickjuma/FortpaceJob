// DashboardOverview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Activity, BellRing, UserCheck, AlertTriangle,
  Calendar, ShieldCheck, Download, Video, ChevronRight, Plus, Star
} from 'lucide-react';
import { useAuthStore } from '../../platform/common/authStore';
import { useClientDashboard, useWallet, useInterviews, useMyContracts } from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- Reusable SVG Spend Graph ---
const SpendFintechGraph = ({ data = [] }) => {
  const graphData = data.length > 0
    ? data.map(d => d.amount / 1000)
    : [];

  const maxVal = Math.max(...graphData, 1);

  return (
    <div className="h-48 w-full flex items-end gap-2 pt-4 relative">
      {graphData.length > 0 ? (
        graphData.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end">
            <div
              className="w-full bg-accent-light group-hover:bg-accent rounded-t-lg transition-all duration-300 relative"
              style={{ height: `${(val / maxVal) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink-primary text-white text-[9px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-30 pointer-events-none">
                KES {Math.round(val * 1000)}
              </div>
            </div>
            <span className="text-[8px] font-semibold text-ink-tertiary uppercase tracking-wider">
              {data[idx]?.month ? new Date(data[idx].month).toLocaleString('default', { month: 'short' }) : `M${idx + 1}`}
            </span>
          </div>
        ))
      ) : (
        <div className="flex h-full items-center justify-center text-ink-tertiary text-sm font-medium">
          No spending data available
        </div>
      )}
    </div>
  );
};

// --- Skeleton Loader (design tokens only) ---
const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
    <div className="h-20 bg-surface-muted rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-surface-muted rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-64 bg-surface-muted rounded-2xl" />
        <div className="h-40 bg-surface-muted rounded-2xl" />
      </div>
      <div className="space-y-6">
        <div className="h-48 bg-surface-muted rounded-2xl" />
        <div className="h-40 bg-surface-muted rounded-2xl" />
      </div>
    </div>
  </div>
);

// --- Action Item card (inline) ---
const ActionItemCard = ({ icon: Icon, title, description, buttonText, onAction, isUrgent }) => (
  <div className={cn(
    "flex justify-between items-center text-xs p-3.5 rounded-xl transition-all",
    isUrgent ? "bg-warn-light" : "bg-surface-soft"
  )}>
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-lg",
        isUrgent ? "bg-warn text-white" : "bg-accent text-white"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="font-semibold text-ink-primary">{title}</h4>
        <p className="text-[9px] font-medium text-ink-tertiary">{description}</p>
      </div>
    </div>
    <button
      onClick={onAction}
      className="px-3 py-1.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-[10px] font-medium transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const { data: dashboardData, isLoading: dashLoading } = useClientDashboard();
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const { data: interviewsData, isLoading: interviewsLoading } = useInterviews({ limit: 3, upcoming: true });
  const { data: contractsData, isLoading: contractsLoading } = useMyContracts({ status: 'ACTIVE', limit: 10 });

  const isLoading = dashLoading || walletLoading;

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const handleFundWallet = () => navigate('/client/wallet');

  if (isLoading) return <DashboardSkeleton />;

  const walletBalance = walletData?.availableBalance ?? walletData?.available ?? 0;
  const activeContracts = dashboardData?.contracts?.active ?? 0;
  const totalContracts = (dashboardData?.contracts?.active ?? 0) + (dashboardData?.contracts?.completed ?? 0);
  const openJobs = dashboardData?.overview?.openJobs ?? 0;
  const completedJobs = dashboardData?.overview?.completedJobs ?? dashboardData?.contracts?.completed ?? 0;

  const contractList = contractsData?.items ?? contractsData ?? [];
  const pendingMilestones = contractList.filter(c =>
    c.currentMilestone?.status === 'SUBMITTED' || c.currentMilestone?.status === 'PENDING_REVIEW'
  );
  const unfundedContracts = contractList.filter(c =>
    c.escrowStatus === 'UNFUNDED' || c.escrowStatus === 'INSUFFICIENT'
  );
  const upcomingInterviews = interviewsData?.items ?? interviewsData ?? [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-border pb-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-900 border border-border flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CL'}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-900 tracking-tight">
                Welcome back, {user?.name || user?.firstName || 'Client'}
              </h1>
              <p className="text-sm text-ink-secondary font-medium mt-1">
                {user?.companyName || 'Corporate Client Workspace'} • Command Center
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-xl border border-border shadow-sm">
            <motion.button
              whileTap={buttonTap}
              onClick={() => navigate('/client/post-job')}
              className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors"
            >
              Post Job
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              onClick={() => navigate('/find-talent')}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
            >
              Hire Talent
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              onClick={() => navigate('/client/interviews')}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
            >
              <Video className="w-4 h-4 inline mr-1" /> Interviews
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              onClick={handleFundWallet}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
            >
              Fund Wallet
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              onClick={() => navigate('/client/contracts')}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
            >
              Create Contract
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} className="bg-brand-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wide">Wallet Balance</p>
            <h2 className="text-3xl font-bold mt-1">
              KES {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h2>
            <span className="text-[9px] uppercase tracking-wide font-semibold text-accent-light mt-4 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant settlement
            </span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">Active Contracts</p>
            <h2 className="text-3xl font-bold text-ink-primary mt-1">{activeContracts} Projects</h2>
            <span className="text-[9px] uppercase tracking-wide font-semibold text-accent mt-4 block flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> {totalContracts} Total Lifetime
            </span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">Open Jobs</p>
            <h2 className="text-3xl font-bold text-ink-primary mt-1">{openJobs} Hiring</h2>
            <span className="text-[9px] uppercase tracking-wide font-semibold text-accent mt-4 block flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {completedJobs} Filled
            </span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">Notifications</p>
            <h2 className="text-3xl font-bold text-accent mt-1">
              {dashboardData?.notifications?.length ?? 0} Alerts
            </h2>
            <span className="text-[9px] uppercase tracking-wide font-semibold text-accent mt-4 block flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5" /> Unread
            </span>
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spend Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div>
                  <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide">
                    Hiring Spend Index
                  </h3>
                  <p className="text-[10px] font-medium text-ink-tertiary">Yearly spend allocation chart</p>
                </div>
                <button
                  onClick={() => showToast('success', 'CSV Report dispatched.')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                >
                  <Download size={14} /> Export PDF
                </button>
              </div>
              <SpendFintechGraph data={dashboardData?.spendingTrend || []} />
            </motion.div>

            {/* Action Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide border-b border-border pb-3 mb-4">
                Required Actions & Alerts
              </h3>
              <div className="space-y-4">
                {pendingMilestones.length === 0 && unfundedContracts.length === 0 ? (
                  <div className="text-center py-6 text-ink-tertiary">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-accent opacity-60" />
                    <p className="text-sm font-medium text-ink-primary">All clear!</p>
                    <p className="text-xs mt-1">No pending actions required.</p>
                  </div>
                ) : (
                  <>
                    {pendingMilestones.map((contract) => (
                      <ActionItemCard
                        key={`milestone-${contract.id}`}
                        icon={UserCheck}
                        title="Review Milestone Submission"
                        description={`${contract.freelancer?.firstName || 'Freelancer'} submitted a deliverable for "${contract.title || 'Contract'}"`}
                        buttonText="Release Payout"
                        onAction={() => {
                          showToast('success', 'Milestone approved!');
                          navigate(`/client/contracts/${contract.id}`);
                        }}
                        isUrgent={false}
                      />
                    ))}
                    {unfundedContracts.map((contract) => (
                      <ActionItemCard
                        key={`escrow-${contract.id}`}
                        icon={AlertTriangle}
                        title="Escrow Funding Warning"
                        description={`"${contract.title || 'Contract'}" milestone escrow requires funding`}
                        buttonText="Fund Escrow"
                        onAction={() => {
                          handleFundWallet();
                          navigate(`/client/contracts/${contract.id}`);
                        }}
                        isUrgent={true}
                      />
                    ))}
                    {contractsLoading && (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-16 bg-surface-muted rounded-xl" />
                        <div className="h-16 bg-surface-muted rounded-xl" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Talent Recommendations (no AI mention) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-brand-900 to-brand-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <Star className="w-4 h-4 text-accent" /> Talent Recommendations
              </h4>
              <p className="text-[10px] font-medium text-white/80 leading-relaxed mb-4">
                Based on your recent contracts, we've identified top‑rated specialists matching your stack requirements.
              </p>
              <button
                onClick={() => navigate('/find-talent')}
                className="w-full py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-medium transition-colors"
              >
                Review Candidates <ChevronRight className="w-3 h-3 inline ml-1" />
              </button>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-3"
            >
              <h4 className="font-display font-bold text-brand-900 text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-border pb-2">
                <Calendar className="w-4 h-4 text-accent" /> Upcoming Interviews
              </h4>
              {interviewsLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-surface-muted rounded" />
                  <div className="h-4 bg-surface-muted rounded" />
                </div>
              ) : upcomingInterviews.length === 0 ? (
                <p className="text-[10px] font-medium text-ink-tertiary text-center py-2">
                  No upcoming interviews scheduled.
                </p>
              ) : (
                <div className="space-y-2 text-[10px] font-medium text-ink-secondary">
                  {upcomingInterviews.slice(0, 3).map((interview) => (
                    <div key={interview.id} className="flex justify-between">
                      <span>
                        {interview.type || 'Interview'}: {interview.freelancerName || interview.title || 'Candidate'}
                      </span>
                      <span>
                        {interview.scheduledAt
                          ? new Date(interview.scheduledAt).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                          : 'TBD'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgb(220, 252, 231)' : 'rgb(254, 226, 226)',
              color: toast.type === 'success' ? 'rgb(21, 128, 61)' : 'rgb(185, 28, 28)',
            }}
          >
            {toast.type === 'success' ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
