import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, BellRing, UserCheck, AlertTriangle,
  Calendar, ShieldCheck, Bot, Sparkles, Download, Video
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';
import { useAuthStore } from '../../common/authStore';
import { useClientDashboard, useWallet, useInterviews, useMyContracts } from '../services/clientHooks';

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
               className="w-full bg-success/20 group-hover:bg-success rounded-t-lg transition-all duration-300 relative"
               style={{ height: `${(val / maxVal) * 100}%` }}
             >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222222] text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-30 pointer-events-none">
                 KES {Math.round(val * 1000)}
               </div>
             </div>
             <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">
               {data[idx]?.month ? new Date(data[idx].month).toLocaleString('default', { month: 'short' }) : `M${idx + 1}`}
             </span>
           </div>
         ))
       ) : (
         <div className="flex h-full items-center justify-center text-text-secondary text-sm font-bold">
           No spending data available
         </div>
       )}
     </div>
   );
 };

// --- Skeleton Loader ---
const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
    <div className="h-20 bg-light-gray rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-28 bg-light-gray rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-64 bg-light-gray rounded-2xl" />
        <div className="h-40 bg-light-gray rounded-2xl" />
      </div>
      <div className="space-y-6">
        <div className="h-48 bg-light-gray rounded-2xl" />
        <div className="h-40 bg-light-gray rounded-2xl" />
      </div>
    </div>
  </div>
);

// --- Action Item card ---
const ActionItemCard = ({ icon: Icon, title, description, buttonText, buttonVariant, onAction, isUrgent }) => (
  <div className={cn(
    "flex justify-between items-center text-xs p-3.5 rounded-2xl",
    isUrgent ? "bg-warning/10" : "bg-light-gray/40"
  )}>
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-xl text-white",
        isUrgent ? "bg-warning" : "bg-success"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="font-bold text-text-primary">{title}</h4>
        <p className="text-[9px] font-semibold text-text-secondary">{description}</p>
      </div>
    </div>
    <Button 
      variant="primary" 
      size="sm" 
      onClick={onAction} 
      className={cn(
        "border-none font-bold text-[10px] py-1.5 px-3",
        isUrgent ? "bg-success hover:bg-success/90" : "bg-success hover:bg-success/90"
      )}
    >
      {buttonText}
    </Button>
  </div>
);

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Real data hooks
  const { data: dashboardData, isLoading: dashLoading } = useClientDashboard();
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const { data: interviewsData, isLoading: interviewsLoading } = useInterviews({ limit: 3, upcoming: true });
  const { data: contractsData, isLoading: contractsLoading } = useMyContracts({ status: 'ACTIVE', limit: 10 });

  const isLoading = dashLoading || walletLoading;

  if (isLoading) return <DashboardSkeleton />;

  // Derive values from real data
  const walletBalance = walletData?.availableBalance ?? walletData?.available ?? 0;
  const activeContracts = dashboardData?.contracts?.active ?? 0;
  const totalContracts = (dashboardData?.contracts?.active ?? 0) + (dashboardData?.contracts?.completed ?? 0);
  const openJobs = dashboardData?.overview?.openJobs ?? 0;
  const completedJobs = dashboardData?.overview?.completedJobs ?? dashboardData?.contracts?.completed ?? 0;

  // Build action items from real contracts data
  const contractList = contractsData?.items ?? contractsData ?? [];
  const pendingMilestones = contractList.filter(c => 
    c.currentMilestone?.status === 'SUBMITTED' || c.currentMilestone?.status === 'PENDING_REVIEW'
  );
  const unfundedContracts = contractList.filter(c =>
    c.escrowStatus === 'UNFUNDED' || c.escrowStatus === 'INSUFFICIENT'
  );

  // Upcoming interviews
  const upcomingInterviews = interviewsData?.items ?? interviewsData ?? [];

  const handleFundWallet = () => {
    navigate('/client/wallet');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Top Greeting Welcome Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-border pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#222222] border border-white/10 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CL'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-success animate-pulse" />
              <h1 className="text-3xl font-black text-text-primary tracking-tight">
                Welcome back, {user?.name || user?.firstName || 'Client'}
              </h1>
            </div>
            <p className="text-sm text-text-secondary font-medium mt-1">
              {user?.companyName || 'Corporate Client Workspace'} • Command Center
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-light-gray p-1.5 rounded-2xl border border-border shadow-inner">
          <Button 
            onClick={() => navigate('/client/post-job')} 
            variant="primary" 
            className="bg-success hover:bg-success/95 font-bold text-xs py-2 px-3.5 rounded-xl border-none"
          >
            Post Job
          </Button>
          <Button 
            onClick={() => navigate('/find-talent')} 
            variant="outline" 
            className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border"
          >
            Hire Talent
          </Button>
          <Button 
            onClick={() => navigate('/client/interviews')} 
            variant="outline" 
            className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border"
          >
            <Video className="w-4 h-4 mr-1.5" />
            Video Interviews
          </Button>
          <Button 
            onClick={handleFundWallet} 
            variant="outline" 
            className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border"
          >
            Fund Wallet
          </Button>
          <Button 
            onClick={() => navigate('/client/contracts')} 
            variant="outline" 
            className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border"
          >
            Create Contract
          </Button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border-none bg-[#222222] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Wallet Balance</p>
          <h2 className="text-3xl font-black mt-1">
            KES {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant settlement
          </span>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Contracts</p>
          <h2 className="text-3xl font-black text-text-primary mt-1">{activeContracts} Projects</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> {totalContracts} Total Lifetime
          </span>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Open Jobs</p>
          <h2 className="text-3xl font-black text-text-primary mt-1">{openJobs} Hiring</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {completedJobs} Filled
          </span>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Notifications</p>
          <h2 className="text-3xl font-black text-success mt-1">
            {dashboardData?.notifications?.length ?? 0} Alerts
          </h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <BellRing className="w-3.5 h-3.5" /> Unread
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Spending Graph Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <h3 className="font-black text-text-primary text-sm uppercase tracking-wider">Hiring Spend Index</h3>
                <p className="text-[10px] font-semibold text-text-secondary">Yearly spend allocation chart</p>
              </div>
              <Button 
                onClick={() => toast.success('CSV Report dispatched.')} 
                variant="outline" 
                size="sm" 
                icon={<Download size={14} />}
              >
                Export PDF
              </Button>
            </div>
            <SpendFintechGraph data={dashboardData?.spendingTrend || []} />
          </Card>

          {/* Action Items from real data */}
          <Card className="p-6 border border-border bg-white shadow-sm">
            <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3 mb-4">
              Required Actions & Alerts
            </h3>
            <div className="space-y-4">
              {pendingMilestones.length === 0 && unfundedContracts.length === 0 ? (
                <div className="text-center py-6 text-text-secondary">
                  <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-success opacity-60" />
                  <p className="text-sm font-bold text-text-primary">All clear!</p>
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
                        toast.success('Milestone approved!');
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
                  {/* Fallback items if contracts data failed to load properly */}
                  {contractsLoading && (
                    <div className="animate-pulse space-y-3">
                      <div className="h-16 bg-light-gray rounded-2xl" />
                      <div className="h-16 bg-light-gray rounded-2xl" />
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">

          <Card className="p-6 bg-gradient-to-br from-[#222222] to-zinc-900 border border-white/10 text-white rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Bot className="w-4 h-4 text-success animate-bounce" /> AI Talent Recommender
            </h4>
            <p className="text-[10px] font-semibold text-white/70 leading-relaxed mb-4">
              We parsed your recently finalized contracts and auto-selected top-rated specialists matching your stack requirements.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/find-talent')} 
              className="w-full bg-success hover:bg-success/90 border-none rounded-xl text-xs font-bold py-2.5"
            >
              Review Candidates
            </Button>
          </Card>

          {/* Upcoming Interviews from real data */}
          <Card className="p-6 border border-border bg-white shadow-sm space-y-3">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2">
              <Calendar className="w-4 h-4 text-success" /> Upcoming Interviews
            </h4>
            {interviewsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-light-gray rounded" />
                <div className="h-4 bg-light-gray rounded" />
              </div>
            ) : upcomingInterviews.length === 0 ? (
              <p className="text-[10px] font-bold text-text-secondary text-center py-2">
                No upcoming interviews scheduled.
              </p>
            ) : (
              <div className="space-y-2 text-[10px] font-bold text-text-secondary">
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
          </Card>

        </div>

      </div>
    </div>
  );
}
