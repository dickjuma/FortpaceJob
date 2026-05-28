import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Clock, CheckCircle2, Star, 
  MessageSquare, Briefcase, Zap, BellRing, Target, ShieldCheck, ArrowRight,
  BarChart, Calendar, Award, ExternalLink, Activity
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  getDashboardStats, 
  getRecentActivity, 
  getActiveOrders
} from '../services/dashboard.service';
import toast, { Toaster } from 'react-hot-toast';
import { useFreelancer } from '../context/FreelancerContext';

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
const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <Card hover className="relative overflow-hidden group bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm">
    <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-accent-purple/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent-purple/10 transition-colors"></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-3 bg-accent-purple/10 text-navy rounded-xl group-hover:scale-110 transition-transform">
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
    <h3 className="text-3xl font-bold text-text-primary tracking-tight relative z-10">{value}</h3>
  </Card>
);

const ActionItem = ({ icon: Icon, title, description, buttonText, isUrgent, onClick }) => (
  <div onClick={onClick} className="p-4 rounded-xl bg-white border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md group cursor-pointer">
    <div className="flex gap-4">
      <div className={cn(
        "p-3 rounded-xl h-fit shrink-0 transition-transform group-hover:rotate-6",
        isUrgent ? "bg-accent-red/10 text-accent-red" : "bg-accent-purple/10 text-navy"
      )}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-sm text-text-primary group-hover:text-accent-red transition-colors flex items-center gap-2">
          {title}
          {isUrgent && <span className="text-[9px] font-bold bg-accent-red/20 text-accent-red px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse">Urgent</span>}
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
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulated API call with loading state and debouncing
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network latency for UX perception
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const [dashboardStats, activity, orders] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(),
          getActiveOrders()
        ]);
        
        setStats(dashboardStats);
        setRecentActivity(activity);
        setActiveOrders(orders);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        toast.error('Network Error: Database unreachable');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Activity className="w-16 h-16 text-accent-red opacity-50" />
        <h2 className="text-xl font-bold text-text-primary">Connection Lost</h2>
        <p className="text-sm text-text-secondary">{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>Retry Connection</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 relative">
      <Toaster position="top-right" toastOptions={{ className: 'font-bold text-sm' }} />
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy via-navy to-accent-purple text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
              {accountType} PLAN
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span> Online
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome back, Alex.</h1>
          <p className="mt-2 text-sm font-medium text-white/80 max-w-lg leading-relaxed">
            Your workspace is active. You have 3 urgent action items and KES 450,000 pending clearance in escrow.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 shrink-0">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => toast.success('Workspace settings opened')}>
            Workspace Settings
          </Button>
          <Button variant="primary" className="bg-white text-navy hover:bg-light-gray border-none shadow-lg shadow-white/20" onClick={() => navigate('/freelancer/gigs/create')}>
            <Zap size={16} className="mr-2" /> Create Service
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Available Funds" value={stats?.availableFunds?.value || 'KES 0'} icon={TrendingUp} trend="up" trendValue={stats?.availableFunds?.trendValue || '0%'} />
        <StatCard title="Active Orders" value={stats?.activeOrders?.value || '0'} icon={Briefcase} />
        <StatCard title="Response Rate" value={stats?.responseRate?.value || '0%'} icon={Clock} />
        <StatCard title="Client Satisfaction" value={stats?.positiveRating?.value || '0%'} icon={Star} trend="up" trendValue="2%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Items */}
          <Card 
            title={
              <span className="flex items-center gap-2 text-text-primary font-bold">
                <BellRing className="w-5 h-5 text-accent-red" /> Priority Action Items
              </span>
            }
            className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm"
          >
            {recentActivity.length === 0 ? (
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
                    description={activity.description}
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

          {/* Revenue Chart Widget (Mocked for SaaS feel) */}
          <Card title="Revenue Analytics" className="shadow-sm border-border">
            <div className="h-64 flex items-end gap-2 pt-4 px-2">
              {[40, 70, 45, 90, 65, 120, 85, 110, 150, 130, 180, 160].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => toast(`Viewing analytics for Week ${i+1}`)}>
                  <div className="w-full bg-accent-purple/10 rounded-t-md relative overflow-hidden group-hover:bg-accent-purple/30 transition-all duration-300" style={{ height: `${height}px` }}>
                    <div className="absolute bottom-0 w-full bg-accent-purple transition-all duration-500" style={{ height: `${height * 0.8}px` }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary uppercase">W{i+1}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Contracts Table */}
          <Card 
            title={
              <div className="flex justify-between items-center w-full">
                <span className="flex items-center gap-2 text-text-primary font-bold">
                  <Briefcase className="w-5 h-5 text-navy" /> Active Contracts
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
                  {activeOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-light-gray/30 transition-colors cursor-pointer group"
                      onClick={() => navigate('/freelancer/contracts')}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-text-primary group-hover:text-accent-red transition-colors">{order.buyer}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{order.gig}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-sm text-text-primary flex items-center gap-2">
                        <Calendar size={14} className="text-text-secondary" /> {order.dueIn}
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
                        <ExternalLink size={16} className="text-text-secondary group-hover:text-navy" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <Card className="shadow-sm border-border bg-gradient-to-b from-white to-light-gray/20">
            <h4 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent-purple" /> Profile Completion
            </h4>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-text-primary">85% Complete</span>
              <span className="text-accent-purple">Great!</span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-2.5 mb-6 overflow-hidden">
              <div className="bg-accent-purple h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-text-secondary line-through">Verify Identity</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-text-secondary line-through">Add Payment Method</span>
              </div>
              <div className="flex items-center gap-3 text-sm cursor-pointer group" onClick={() => navigate('/freelancer/portfolio-management')}>
                <div className="w-4 h-4 border-2 border-border rounded-full group-hover:border-accent-red transition-colors"></div>
                <span className="text-text-primary font-bold group-hover:text-accent-red transition-colors">Add Portfolio Case Study</span>
              </div>
            </div>
          </Card>

          {/* Seller Level Card - Dark Navy Theme */}
          <div className="bg-navy rounded-2xl p-8 border border-white/10 text-white shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple/20 blur-[60px] rounded-full -tranzinc-y-1/2 tranzinc-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-1 tracking-tight">Level 2 Seller</h3>
              <p className="text-[10px] font-bold text-accent-purple/80 uppercase tracking-widest mb-8 bg-accent-purple/10 px-3 py-1 rounded-full">On track for Top Rated</p>
              
              <div className="w-full space-y-6">
                <div className="group/stat cursor-pointer" onClick={() => toast('Response rate metric details')}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/80 group-hover/stat:text-white transition-colors">Response Rate (100%)</span>
                    <span className="text-success">Pass</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-success h-1.5 rounded-full w-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
                <div className="group/stat cursor-pointer" onClick={() => toast('Earnings metric details')}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/80 group-hover/stat:text-white transition-colors">Earnings (KES 850k / KES 1M)</span>
                    <span className="text-accent-red">85%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent-red h-1.5 rounded-full shadow-[0_0_10px_rgba(255,59,48,0.5)]" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Score Card */}
          <Card hover className="bg-white/50 backdrop-blur-md border-white shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-success/10 text-success rounded-xl">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-text-primary">Trust Score</h4>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">Enterprise Grade</p>
              </div>
            </div>
            <div className="flex items-end gap-2 mt-4 cursor-pointer" onClick={() => navigate('/freelancer/trust-score')}>
              <span className="text-5xl font-black text-text-primary tracking-tighter">98</span>
              <span className="text-sm font-semibold text-text-secondary mb-1.5">/ 100</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
