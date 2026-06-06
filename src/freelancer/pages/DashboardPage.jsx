import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Clock, CheckCircle2, Star,
  MessageSquare, Briefcase, Zap, BellRing, Target, ShieldCheck, ArrowRight,
  Calendar, Award
} from 'lucide-react';
import { useAuthStore } from '../../common/authStore';
import {
  useFreelancerDashboard,
  useFreelancerActiveOrders,
  useFreelancerRecentActivity,
  useFreelancerProfile,
} from '../services/freelancerHooks';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: stats = {}, isLoading: statsLoading } = useFreelancerDashboard();
  const { data: recentActivity = [] } = useFreelancerRecentActivity();
  const { data: activeOrders = [] } = useFreelancerActiveOrders();
  const { data: profileData = {} } = useFreelancerProfile();

  const accountType = 'FREELANCER';
  const availableFunds = stats?.wallet?.available ?? stats?.available ?? 0;
  const activeOrderCount = activeOrders?.length ?? 0;
  const responseRate = stats?.proposals?.successRate ?? 0;
  const positiveRating = Math.round((stats?.overview?.averageRating ?? 0) * 20);

  const displayStats = {
    availableFunds: `KES ${availableFunds.toLocaleString()}`,
    activeOrders: String(activeOrderCount),
    responseRate: `${responseRate}%`,
    positiveRating: `${positiveRating}%`
  };

  const displayOrders = (activeOrders || []).map(order => ({
    ...order,
    buyer: order?.client?.name || `${order?.client?.firstName || ''} ${order?.client?.lastName || ''}`.trim() || 'Client',
    gig: order?.title || order?.projectName || 'Contract',
    dueIn: order?.dueDate ? `Due ${new Date(order.dueDate).toLocaleDateString()}` : 'No deadline',
    total: `KES ${(order?.totalAmount ?? order?.value ?? 0).toLocaleString()}`,
    status: order?.status === 'ACTIVE' ? 'In Progress' : order?.status || 'Pending'
  }));

  const earningsCurrent = stats?.overview?.totalEarnings ?? 0;
  const earningsTarget = Math.max(1000000, earningsCurrent || 1000000);
  const earningsProgress = earningsTarget > 0 ? Math.min((earningsCurrent / earningsTarget) * 100, 100) : 0;
  const profileCompletion = profileData?.profileCompletion ?? 0;

  const isLoading = statsLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-accent-light/30 blur-[40px] rounded-full pointer-events-none" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-3 bg-accent-light rounded-xl">
          <Icon className="w-5 h-5 text-accent DEFAULT" />
        </div>
        {trend && (
          <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-1 relative z-10">
        {title}
      </p>
      <h3 className="font-mono font-semibold text-2xl text-ink-primary relative z-10">
        {value}
      </h3>
    </motion.div>
  );

  const ActionItem = ({ icon: Icon, title, description, buttonText, isUrgent, onClick }) => (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="p-4 rounded-xl bg-white border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md cursor-pointer"
    >
      <div className="flex gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${
          isUrgent ? 'bg-warn-light text-warn' : 'bg-accent-light text-accent DEFAULT'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm text-ink-primary">
            {title}
            {isUrgent && (
              <span className="ml-2 text-xs font-body font-medium text-warn bg-warn-light px-2 py-0.5 rounded-full animate-pulse">
                Urgent
              </span>
            )}
          </h4>
          <p className="text-xs text-ink-secondary mt-1">{description}</p>
        </div>
      </div>
      <button className="px-4 py-1.5 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body text-xs font-medium transition-colors">
        {buttonText}
      </button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-brand-900 to-brand-800 text-white p-8 rounded-2xl shadow-sm relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-body font-medium uppercase tracking-wide">
              {accountType} plan
            </span>
            <span className="flex items-center gap-1 text-xs font-body text-white bg-white/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-accent DEFAULT rounded-full animate-pulse" />
              Online
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl">
            Welcome back, {user?.firstName || 'Freelancer'}.
          </h1>
          <p className="mt-2 text-sm font-body text-white/80 max-w-lg">
            Your workspace is active. You have {recentActivity.length} pending actions and KES {(stats?.wallet?.locked ?? 0).toLocaleString()} in escrow.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 font-body text-sm font-medium transition-colors"
            onClick={() => window.location.href = '/freelancer/settings'}
          >
            Workspace settings
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-white text-brand-900 hover:bg-surface-soft font-body text-sm font-medium transition-colors inline-flex items-center gap-2"
            onClick={() => navigate('/freelancer/create-gig')}
          >
            <Zap className="w-4 h-4" />
            Create service
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Available funds" value={displayStats.availableFunds} icon={TrendingUp} trend="+12%" />
        <StatCard title="Active orders" value={displayStats.activeOrders} icon={Briefcase} />
        <StatCard title="Response rate" value={displayStats.responseRate} icon={Clock} />
        <StatCard title="Satisfaction" value={displayStats.positiveRating} icon={Star} trend="+5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Action Items */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-accent DEFAULT" />
                <h2 className="font-display font-semibold text-lg text-brand-900">Priority actions</h2>
              </div>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-accent DEFAULT mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-body font-medium text-ink-primary">All caught up!</p>
                  <p className="text-xs text-ink-secondary mt-1">No pending actions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <ActionItem
                      key={activity.id}
                      icon={activity.type === 'message' ? MessageSquare : activity.type === 'delivery' ? CheckCircle2 : Zap}
                      title={activity.type === 'message' ? 'Unread message' : activity.type === 'delivery' ? 'Order delivery due' : 'New buyer request'}
                      description={activity.description}
                      buttonText={activity.type === 'message' ? 'Reply' : activity.type === 'delivery' ? 'Deliver now' : 'View request'}
                      isUrgent={activity.isUrgent}
                      onClick={() => {
                        if (activity.type === 'message') navigate('/freelancer/messages');
                        else if (activity.type === 'delivery') navigate('/freelancer/orders');
                        else navigate('/freelancer/requests');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h2 className="font-display font-semibold text-lg text-brand-900 mb-4">Revenue analytics</h2>
            {stats?.earnings?.weeklyTrend && stats.earnings.weeklyTrend.length > 0 ? (
              <div className="h-64 flex items-end gap-2 pt-4">
                {stats.earnings.weeklyTrend.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <motion.div
                      className="w-full bg-accent-light rounded-t-md overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ height: `${val}px` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    >
                      <div className="w-full bg-accent DEFAULT h-full" style={{ height: '100%' }} />
                    </motion.div>
                    <span className="text-xs font-mono text-ink-tertiary">W{i + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-ink-secondary text-sm font-body">
                Analytics will appear after your first orders
              </div>
            )}
          </div>

          {/* Active Contracts */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent DEFAULT" />
                <h2 className="font-display font-semibold text-lg text-brand-900">Active contracts</h2>
              </div>
              <button
                onClick={() => navigate('/freelancer/contracts')}
                className="text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark inline-flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-muted">
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Client</th>
                    <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Deadline</th>
                    <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Value</th>
                    <th className="px-6 py-3 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-ink-secondary text-sm">
                        No active contracts
                      </td>
                    </tr>
                  ) : (
                    displayOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-surface-soft transition-colors cursor-pointer"
                        onClick={() => navigate(`/freelancer/contracts/${order.id}`)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-body font-medium text-sm text-ink-primary">{order.buyer}</p>
                          <p className="text-xs text-ink-tertiary mt-0.5">{order.gig}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-body text-ink-secondary flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {order.dueIn}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold text-sm text-ink-primary">
                          {order.total}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-body font-medium bg-accent-light text-accent-dark">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent DEFAULT" />
              <h3 className="font-body font-semibold text-ink-primary">Profile completion</h3>
            </div>
            <div className="flex justify-between text-xs font-body mb-2">
              <span className="text-ink-secondary">{profileCompletion}% complete</span>
              <span className="text-accent DEFAULT">
                {profileCompletion >= 90 ? 'Excellent' : profileCompletion >= 70 ? 'Great' : 'Keep going'}
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2 mb-5 overflow-hidden">
              <motion.div
                className="bg-accent DEFAULT h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="space-y-3">
              {(profileData?.checklist || []).slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-accent DEFAULT" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-border rounded-full" />
                  )}
                  <span className={`text-sm font-body ${item.completed ? 'text-ink-tertiary line-through' : 'text-ink-primary'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Level */}
          <div className="bg-brand-900 rounded-2xl p-6 text-white shadow-sm">
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-1">{profileData?.sellerLevel || 'Not Rated'}</h3>
              <p className="text-xs font-body text-accent-light mb-6">
                {earningsProgress >= 85 ? 'On track for Top Rated' : 'Building reputation'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-body mb-2">
                  <span className="text-white/80">Response rate ({responseRate}%)</span>
                  <span className={responseRate >= 90 ? 'text-accent DEFAULT' : 'text-warn'}>
                    {responseRate >= 90 ? 'Pass' : 'Needs work'}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${responseRate >= 90 ? 'bg-accent DEFAULT' : 'bg-warn'}`}
                    style={{ width: `${Math.min(responseRate, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-body mb-2">
                  <span className="text-white/80">Earnings progress</span>
                  <span className="text-accent DEFAULT">{Math.round(earningsProgress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent DEFAULT h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${earningsProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Score */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-light rounded-xl">
                <ShieldCheck className="w-5 h-5 text-accent DEFAULT" />
              </div>
              <div>
                <h4 className="font-body font-semibold text-ink-primary">Trust score</h4>
                <p className="text-xs text-ink-tertiary">
                  {profileData?.trustScore >= 90 ? 'Enterprise grade' : 'Professional'}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-mono font-bold text-4xl text-ink-primary">{profileData?.trustScore || 0}</span>
              <span className="text-sm font-body text-ink-secondary mb-1">/ 100</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
