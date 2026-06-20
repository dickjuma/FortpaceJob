// ClientDashboardPage.jsx
// Client Dashboard wired to backend stats and profile services.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  User,
  AlertTriangle,
} from 'lucide-react';
import { getClientDashboardStats } from '../services/clientApi';
import { profileAPI } from '../../platform/common/services/api';

// Helper to get initials
const getInitials = (firstName, lastName, username, email) => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (username) return username.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return 'CL';
};

// ----------------------------------------------------------------------
// StatCard Component (inline)
// ----------------------------------------------------------------------
const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
    transition={{ duration: 0.2 }}
    className="bg-white border border-border rounded-2xl p-5 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-accent-light rounded-lg text-accent">
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-medium text-accent-dark bg-accent-light px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" /> {trendValue}
        </span>
      )}
    </div>
    <h3 className="text-ink-secondary text-sm font-medium">{title}</h3>
    <div className="text-2xl font-bold text-ink-primary mt-1">{value}</div>
  </motion.div>
);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function ClientDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardData, profileData] = await Promise.all([
          getClientDashboardStats(),
          profileAPI.getMyProfile(),
        ]);
        setStats(dashboardData);
        setContracts(dashboardData?.recentContracts || []);
        setProfile(profileData?.user || null);
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Derived data
  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.username || profile?.email?.split('@')[0] || 'Client';
  const initials = getInitials(
    profile?.firstName,
    profile?.lastName,
    profile?.username,
    profile?.email
  );
  const totalSpent = stats?.overview?.totalSpent || 0;
  const activeContracts = stats?.contracts?.active || 0;
  const totalJobs = stats?.overview?.totalJobs || 0;
  const completedJobs = stats?.contracts?.completed || 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 bg-danger-light rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="font-display text-xl font-bold text-ink-primary">Connection Lost</h2>
        <p className="text-ink-secondary text-sm">{error}</p>
        <motion.button
          whileTap={buttonTap}
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
        >
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Area & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-border rounded-3xl p-6 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-light text-accent-dark flex items-center justify-center text-xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-brand-900">
                  Welcome back, {displayName}
                </h1>
                <p className="text-ink-secondary text-sm mt-1">
                  {profile?.clientProfile?.companyName || 'Client'} &bull; Member{' '}
                  {profile?.createdAt
                    ? new Date(profile.createdAt).getFullYear()
                    : '—'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileTap={buttonTap}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
              >
                <PlusCircle size={16} /> Post New Project
              </motion.button>
              <motion.button
                whileTap={buttonTap}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-ink-primary rounded-full font-medium text-sm hover:bg-surface-soft transition-colors"
              >
                <Briefcase size={16} /> View My Projects
              </motion.button>
              <motion.button
                whileTap={buttonTap}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-ink-primary rounded-full font-medium text-sm hover:bg-surface-soft transition-colors"
              >
                <Search size={16} /> Browse Freelancers
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <StatCard
            title="Total Projects Posted"
            value={totalJobs}
            icon={Briefcase}
            trend="up"
            trendValue="+2"
          />
          <StatCard title="Active Projects" value={activeContracts} icon={LayoutDashboard} />
          <StatCard title="Completed Projects" value={completedJobs} icon={CheckCircle} />
          <StatCard
            title="Total Spent"
            value={`KES ${totalSpent.toLocaleString()}`}
            icon={TrendingUp}
          />
        </motion.div>

        {/* Main Grid: Recent Projects + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects Table (spans 2 cols) */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-white">
              <h2 className="font-display font-bold text-brand-900 text-lg">Recent Projects</h2>
              <button className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider border-b border-border bg-surface-soft/30">
                    <th className="px-6 py-3">Project Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contracts.length > 0 ? (
                    contracts.slice(0, 5).map((contract, idx) => (
                      <motion.tr
                        key={contract.id}
                        variants={tableRowVariants}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-surface-soft transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-ink-primary">
                            {contract.title || `Contract #${contract.id}`}
                          </div>
                          <div className="text-xs text-ink-tertiary mt-0.5">
                            Updated {new Date(contract.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              contract.status === 'ACTIVE'
                                ? 'bg-accent-light text-accent-dark'
                                : contract.status === 'PENDING'
                                ? 'bg-warn-light text-warn'
                                : 'bg-surface-muted text-ink-secondary'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                contract.status === 'ACTIVE'
                                  ? 'bg-accent'
                                  : contract.status === 'PENDING'
                                  ? 'bg-warn'
                                  : 'bg-ink-tertiary'
                              }`}
                            ></span>
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-ink-primary">
                          KES {contract.totalAmount?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-accent hover:text-accent-dark font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-accent-light transition-colors">
                            Manage
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-ink-tertiary">
                        No projects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col"
          >
            <div className="p-6 border-b border-border bg-white">
              <h2 className="font-display font-bold text-brand-900 text-lg">Quick Actions</h2>
            </div>
            <div className="p-4 flex-1 space-y-2">
              {[
                {
                  to: '/client/post-job',
                  label: 'Post a New Job',
                  desc: 'Find talent for your project',
                  icon: PlusCircle,
                  color: 'bg-accent-light text-accent-dark',
                },
                {
                  to: '/client/talent-search',
                  label: 'Search Freelancers',
                  desc: 'Browse 10,000+ verified experts',
                  icon: Search,
                  color: 'bg-info-light text-info',
                },
                {
                  to: '/client/proposals',
                  label: 'Review Proposals',
                  desc: 'Accept or reject applications',
                  icon: Briefcase,
                  color: 'bg-warn-light text-warn',
                },
                {
                  to: '/client/contracts',
                  label: 'Manage Contracts',
                  desc: 'Track active & past agreements',
                  icon: CheckCircle,
                  color: 'bg-accent-light text-accent-dark',
                },
                {
                  to: '/client/wallet',
                  label: 'Wallet & Payments',
                  desc: 'Deposit, withdraw, escrow',
                  icon: TrendingUp,
                  color: 'bg-warn-light text-warn',
                },
                {
                  to: '/client/disputes',
                  label: 'Disputes',
                  desc: 'Open or track dispute cases',
                  icon: LayoutDashboard,
                  color: 'bg-danger-light text-danger',
                },
              ].map(({ to, label, desc, icon: Icon, color }) => (
                <button
                  key={to}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-soft border border-transparent hover:border-border transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-ink-primary text-sm">{label}</p>
                    <p className="text-xs text-ink-tertiary">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-tertiary group-hover:text-accent transition-colors" />
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-border bg-surface-soft/20 text-center">
              <button className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                Browse All Talent →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
