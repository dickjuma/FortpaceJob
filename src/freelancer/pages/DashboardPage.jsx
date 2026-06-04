import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Clock, CheckCircle2, Star, 
  MessageSquare, Briefcase, Zap, BellRing, Target, ShieldCheck, ArrowRight,
  BarChart, Calendar, Award, ExternalLink, Activity
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useFreelancerDashboard, useFreelancerActiveOrders, useFreelancerRecentActivity, useFreelancerProfile } from '../services/freelancerHooks';
import toast, { Toaster } from 'react-hot-toast';
import { useFreelancer } from '../context/FreelancerContext';
import { useAuthStore } from '../../common/authStore';

// --- Skeleton Loaders ---
const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-light-gray rounded-2xl"></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="h-64 bg-light-gray rounded-2xl"></div>
        <div className="h-96 bg-light-gray rounded-2xl"></div>
      </div>
      <div className="space-y-6">
        <div className="h-80 bg-light-gray rounded-2xl"></div>
        <div className="h-48 bg-light-gray rounded-2xl"></div>
      </div>
    </div>
  </div>
);

// --- Micro-components ---
const StatCard = ({ title, value, icon: Icon, trend, trendValue, loading }) => (
  <Card hover className="relative overflow-hidden group bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm">
    <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-success/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-success/10 transition-colors"></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-3 bg-success/10 text-success rounded-xl group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest",
          trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        )}>
          {trend === 'up' ? '+' : '-'}{trendValue}
        </span>
      )}
    </div>
    <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1 relative z-10">{title}</p>
    {loading ? (
      <div className="h-9 bg-light-gray rounded animate-pulse w-24" />
    ) : (
      <h3 className="text-3xl font-bold text-text-primary tracking-tight relative z-10">{value}</h3>
    )}
  </Card>
);

const ActionItem = ({ icon: Icon, title, description, buttonText, isUrgent, onClick }) => (
  <div onClick={onClick} className="p-4 rounded-xl bg-white border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md group cursor-pointer">
    <div className="flex gap-4">
      <div className={cn(
        "p-3 rounded-xl h-fit shrink-0 transition-transform group-hover:rotate-6",
        isUrgent ? "bg-amber-100 text-amber-700" : "bg-success/10 text-success"
      )}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-sm text-text-primary group-hover:text-success transition-colors flex items-center gap-2">
          {title}
          {isUrgent && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse">Urgent</span>}
        </h4>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
    <Button variant={isUrgent ? 'primary' : 'outline'} size="sm" className="shrink-0" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {buttonText}
    </Button>
  </div>
);

// --- Main Page Component ---
export default function DashboardOverview() {
  const { accountType } = useFreelancer();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useFreelancerDashboard();
  const { data: recentActivity = [], isLoading: activityLoading } = useFreelancerRecentActivity();
  const { data: activeOrders = [], isLoading: ordersLoading } = useFreelancerActiveOrders();
  const { data: profileData, isLoading: profileLoading } = useFreelancerProfile();

  const isLoading = statsLoading || activityLoading || ordersLoading;

  if (isLoading) return <DashboardSkeleton />;

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Activity className="w-16 h-16 text-[#e63946] opacity-50" />
        <h2 className="text-xl font-bold text-text-primary">Connection Lost</h2>
        <p className="text-sm text-text-secondary">Failed to load dashboard data. Please try again.</p>
        <Button variant="primary" onClick={() => window.location.reload()}>Retry Connection</Button>
      </div>
    );
  }

   // --- Real profile data ---
   const profileCompletion = profileData?.profileCompletion ?? profileData?.completionPercentage;
   const sellerLevel = profileData?.sellerLevel ?? stats?.overview?.sellerLevel;
   const trustScore = profileData?.trustScore ?? stats?.overview?.trustScore;
  const profileChecklist = profileData?.checklist ?? [];

   // Transform stats for display
   const displayStats = {
     availableFunds: { 
       value: `KES ${(stats?.overview?.totalEarnings ?? stats?.wallet?.available ?? 0).toLocaleString()}`, 
       trend: 'up', 
       trendValue: stats?.overview?.availableFundsTrend ?? null 
     },
     activeOrders: { value: String(stats?.contracts?.active ?? 0) },
     responseRate: { value: `${stats?.proposals?.successRate ?? 0}%` },
     positiveRating: { value: `${Math.round((stats?.overview?.averageRating ?? 0) * 20)}%`, trendValue: stats?.overview?.satisfactionTrend ?? null }
   };

  // Transform active orders for display
  const displayOrders = (Array.isArray(activeOrders) ? activeOrders : []).map(order => ({
    ...order,
    buyer: order.client ? `${order.client.firstName || ''} ${order.client.lastName || ''}`.trim() || 'Client' : 'Client',
    gig: order.title || 'Contract',
    dueIn: order.dueDate ? `Due ${new Date(order.dueDate).toLocaleDateString()}` : 'No deadline',
    total: `KES ${(order.totalAmount ?? 0).toLocaleString()}`,
    status: order.status === 'ACTIVE' ? 'In Progress' : order.status,
  }));

  // Seller level progress metrics from real data
  const earningsTarget = stats?.overview?.nextLevelEarningsTarget ?? 1000000;
  const earningsCurrent = stats?.overview?.totalEarnings ?? 0;
  const earningsProgress = earningsTarget > 0 ? Math.min((earningsCurrent / earningsTarget) * 100, 100) : 0;
  const responseRate = stats?.proposals?.successRate ?? 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 relative">
      <Toaster position="top-right" toastOptions={{ className: 'font-bold text-sm' }} />
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2bb75c] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
              {accountType} PLAN
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Online
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome back, {user?.firstName || 'Alex'}.</h1>
          <p className="mt-2 text-sm font-medium text-white/90 max-w-lg leading-relaxed">
            Your workspace is active. You have {Array.isArray(recentActivity) ? recentActivity.length : 0} priority action items and KES {(stats?.wallet?.locked ?? 0).toLocaleString()} pending clearance in escrow.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 shrink-0">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => toast.success('Workspace settings opened')}>
            Workspace Settings
          </Button>
          <Button 
            variant="primary" 
            className="bg-white text-[#2bb75c] hover:bg-zinc-100 border-none shadow-lg shadow-white/20 font-bold" 
            onClick={() => navigate('/freelancer/create-gig')}
          >
            <Zap size={16} className="mr-2" /> Create Service
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Available Funds" value={displayStats.availableFunds.value} icon={TrendingUp} trend="up" trendValue={displayStats.availableFunds.trendValue} loading={statsLoading} />
        <StatCard title="Active Orders" value={displayStats.activeOrders.value} icon={Briefcase} loading={statsLoading} />
        <StatCard title="Response Rate" value={displayStats.responseRate.value} icon={Clock} loading={statsLoading} />
        <StatCard title="Client Satisfaction" value={displayStats.positiveRating.value} icon={Star} trend="up" trendValue={displayStats.positiveRating.trendValue} loading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Items - from real recent activity */}
          <Card 
            title={
              <span className="flex items-center gap-2 text-text-primary font-bold">
                <BellRing className="w-5 h-5 text-[#e63946]" /> Priority Action Items
              </span>
            }
            className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm"
          >
            {!Array.isArray(recentActivity) || recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
                <p className="text-sm font-bold text-text-primary">You're all caught up!</p>
                <p className="text-xs text-text-secondary mt-1">No pending actions required.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <ActionItem 
                    key={activity.id}
                    icon={activity.type === 'message' ? MessageSquare : activity.type === 'delivery' ? CheckCircle2 : Zap}
                    title={activity.type === 'message' ? 'Unread Message' : activity.type === 'delivery' ? 'Order Delivery Due' : 'New Buyer Request Match'}
                    description={activity.description || activity.message || ''}
                    buttonText={activity.type === 'message' ? 'Reply' : activity.type === 'delivery' ? 'Deliver Now' : 'View Request'}
                    isUrgent={activity.isUrgent}
                    onClick={() => {
                      toast.success(`Processing: ${activity.type}`);
                      if(activity.type === 'message') navigate('/freelancer/messages');
                      if(activity.type === 'delivery') navigate('/freelancer/orders');
                    }}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Revenue Chart Widget - API-backed earnings data */}
          <Card title="Revenue Analytics" className="shadow-sm border-border">
            {stats?.earnings?.weeklyTrend && stats.earnings.weeklyTrend.length > 0 ? (
              <div className="h-64 flex items-end gap-2 pt-4 px-2">
                {stats.earnings.weeklyTrend.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => toast(`Viewing analytics for Week ${i + 1}`)}>
                    <div className="w-full bg-success/10 rounded-t-md relative overflow-hidden group-hover:bg-success/30 transition-all duration-300" style={{ height: `${val}px` }}>
                      <div className="absolute bottom-0 w-full bg-success transition-all duration-500" style={{ height: `${val * 0.8}px` }}></div>
                    </div>
                    <span className="text-[9px] font-bold text-text-secondary uppercase">W{i + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-text-secondary text-sm font-bold">
                Analytics will appear after your first orders.
              </div>
            )}
          </Card>

          {/* Active Contracts Table */}
          <Card 
            title={
              <div className="flex justify-between items-center w-full">
                <span className="flex items-center gap-2 text-text-primary font-bold">
                  <Briefcase className="w-5 h-5 text-[#2bb75c]" /> Active Contracts
                </span>
                <Button variant="outline" size="sm" onClick={() => navigate('/freelancer/contracts')}>
                  View All <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            }
            className="overflow-hidden shadow-sm border-border"
          >
            <div className="-mx-6 -my-6 overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-light-gray/50 text-text-secondary text-[10px] uppercase tracking-widest font-bold border-b border-border">
                    <th className="px-6 py-4">Client / Contract</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4">Escrow Value</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-text-secondary text-sm font-semibold">
                        No active contracts yet.
                      </td>
                    </tr>
                  ) : (
                    displayOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-light-gray/30 transition-colors cursor-pointer group"
                        onClick={() => navigate('/freelancer/contracts')}
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm text-text-primary group-hover:text-[#e63946] transition-colors">{order.buyer}</p>
                          <p className="text-xs text-text-secondary mt-0.5">{order.gig}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-sm text-text-primary">
                          <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-text-secondary" /> {order.dueIn}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-black text-sm text-text-primary">{order.total}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg",
                            order.status === 'In Progress' ? 'bg-success/10 text-success' : 
                            order.status === 'Needs Delivery' ? 'bg-warning/10 text-warning' : 
                            'bg-light-gray text-text-secondary'
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <ExternalLink size={16} className="text-text-secondary group-hover:text-[#2bb75c]" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Profile Completion Card - real data */}
          <Card className="shadow-sm border-border bg-gradient-to-b from-white to-light-gray/20">
            <h4 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-success" /> Profile Completion
            </h4>
             {profileLoading ? (
               <div className="animate-pulse space-y-3">
                 <div className="h-4 bg-light-gray rounded w-full" />
                 <div className="h-2.5 bg-light-gray rounded-full w-full" />
               </div>
             ) : (
               <>
                 <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-text-primary">{profileCompletion ?? 0}% Complete</span>
                   <span className="text-success">
                     {(profileCompletion ?? 0) >= 90 ? 'Excellent!' : (profileCompletion ?? 0) >= 70 ? 'Great!' : 'Keep going!'}
                   </span>
                 </div>
                 <div className="w-full bg-light-gray rounded-full h-2.5 mb-6 overflow-hidden">
                   <div className="bg-success h-2.5 rounded-full transition-all duration-700" style={{ width: `${profileCompletion ?? 0}%` }}></div>
                 </div>
                 <div className="space-y-3">
                   {profileChecklist.length > 0 ? (
                     profileChecklist.slice(0, 4).map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3 text-sm">
                         {item.completed ? (
                           <CheckCircle2 size={16} className="text-success" />
                         ) : (
                           <div className="w-4 h-4 border-2 border-border rounded-full" />
                         )}
                         <span className={item.completed ? 'text-text-secondary line-through' : 'text-text-primary font-bold'}>
                           {item.label}
                         </span>
                       </div>
                     ))
                   ) : (
                     <>
                       <div className="flex items-center gap-3 text-sm">
                         <CheckCircle2 size={16} className="text-success" />
                         <span className="text-text-secondary line-through">Verify Identity</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm">
                         <CheckCircle2 size={16} className="text-success" />
                         <span className="text-text-secondary line-through">Add Payment Method</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm cursor-pointer group" onClick={() => navigate('/freelancer/portfolio-management')}>
                         <div className="w-4 h-4 border-2 border-border rounded-full group-hover:border-[#e63946] transition-colors"></div>
                         <span className="text-text-primary font-bold group-hover:text-[#e63946] transition-colors">Add Portfolio Case Study</span>
                       </div>
                     </>
                   )}
                 </div>
               </>
             )}
          </Card>

          {/* Seller Level Card - real data */}
          <div className="bg-[#222222] rounded-2xl p-8 border border-white/10 text-white shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-success/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
             <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                 <Target className="w-8 h-8 text-white" />
               </div>
               {profileLoading ? (
                 <div className="animate-pulse space-y-2 w-full">
                   <div className="h-7 bg-white/10 rounded w-32 mx-auto" />
                   <div className="h-4 bg-white/10 rounded w-48 mx-auto" />
                 </div>
               ) : (
                 <>
                   <h3 className="text-2xl font-black mb-1 tracking-tight">{sellerLevel ?? 'Not Rated'}</h3>
                   <p className="text-[10px] font-bold text-success/80 uppercase tracking-widest mb-8 bg-success/10 px-3 py-1 rounded-full">
                    {earningsProgress >= 85 ? 'On track for Top Rated' : 'Building your reputation'}
                  </p>
                </>
              )}
              
              <div className="w-full space-y-6">
                <div className="group/stat cursor-pointer">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/80 group-hover/stat:text-white transition-colors">
                      Response Rate ({responseRate}%)
                    </span>
                    <span className={responseRate >= 90 ? 'text-success' : 'text-warning'}>
                      {responseRate >= 90 ? 'Pass' : 'Needs work'}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={cn("h-1.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]", responseRate >= 90 ? 'bg-success' : 'bg-warning')}
                      style={{ width: `${Math.min(responseRate, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="group/stat cursor-pointer">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/80 group-hover/stat:text-white transition-colors">
                      Earnings (KES {earningsCurrent.toLocaleString()} / KES {earningsTarget.toLocaleString()})
                    </span>
                    <span className="text-success">{Math.round(earningsProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-success h-1.5 rounded-full shadow-[0_0_10px_rgba(20,168,0,0.5)] transition-all duration-700"
                      style={{ width: `${earningsProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Score Card - real data */}
          <Card hover className="bg-white/50 backdrop-blur-md border-white shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-success/10 text-success rounded-xl">
                <ShieldCheck size={20} />
              </div>
             <div>
               <h4 className="font-bold text-text-primary">Trust Score</h4>
               <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">
                 {(trustScore ?? 0) >= 90 ? 'Enterprise Grade' : (trustScore ?? 0) >= 70 ? 'Professional' : 'Building'}
               </p>
             </div>
            </div>
             {profileLoading ? (
               <div className="animate-pulse h-12 bg-light-gray rounded w-24" />
             ) : (
               <div className="flex items-end gap-2 mt-4 cursor-pointer" onClick={() => navigate('/freelancer/trust-score')}>
                 <span className="text-5xl font-black text-text-primary tracking-tighter">{trustScore ?? 0}</span>
                 <span className="text-sm font-semibold text-text-secondary mb-1.5">/ 100</span>
               </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
}

