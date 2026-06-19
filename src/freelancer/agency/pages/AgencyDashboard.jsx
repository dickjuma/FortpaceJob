import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Building2,
  Users,
  Briefcase,
  FolderKanban,
  Send,
  Gauge,
  Smile,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useAgencyDashboard } from '../services/agencyHooks';

const STAT_FIELDS = [
  { label: 'Total Agency Revenue', valueKey: 'totalRevenue', fallback: 0, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Team Members', valueKey: 'activeTeamMembers', fallback: 0, icon: Users, color: 'text-violet-700', bg: 'bg-violet-50' },
  { label: 'Active Contracts', valueKey: 'activeContracts', fallback: 0, icon: Briefcase, color: 'text-blue-700', bg: 'bg-blue-50' },
  { label: 'Active Projects', valueKey: 'activeProjects', fallback: 0, icon: FolderKanban, color: 'text-amber-700', bg: 'bg-amber-50' },
  { label: 'Open Proposals', valueKey: 'openProposals', fallback: 0, icon: Send, color: 'text-indigo-700', bg: 'bg-indigo-50' },
  { label: 'Team Utilization Rate', valueKey: 'teamUtilizationRate', fallback: 0, icon: Gauge, color: 'text-cyan-700', bg: 'bg-cyan-50', percent: true },
  { label: 'Client Satisfaction', valueKey: 'clientSatisfactionScore', fallback: 0, icon: Smile, color: 'text-rose-700', bg: 'bg-rose-50', percent: true },
];

const formatNumber = (value) => {
  if (value == null || Number.isNaN(Number(value))) return '0';
  const number = Number(value);
  return number >= 1000 ? number.toLocaleString() : String(Math.round(number));
};

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(Number(value))) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value));
};

const StatCard = ({ stat, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-border rounded-2xl p-5 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${stat.bg}`}>
        <stat.icon className={`w-5 h-5 ${stat.color}`} />
      </div>
      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
        Live
      </span>
    </div>
    <p className="mt-4 text-xs font-semibold text-ink-secondary uppercase tracking-wide">{stat.label}</p>
    <p className="mt-1 font-display text-2xl font-bold text-brand-900">
      {stat.percent ? `${formatNumber(value)}%` : formatCurrency(value)}
    </p>
  </motion.div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="font-display font-bold text-lg text-brand-900">{title}</h3>
        <p className="text-xs text-ink-secondary mt-1">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-soft p-10 text-center">
    <Icon className="w-10 h-10 text-ink-tertiary mb-3" />
    <h3 className="font-display font-bold text-brand-900">{title}</h3>
    <p className="text-sm text-ink-secondary mt-1">{description}</p>
  </div>
);

export default function AgencyDashboard() {
  const { data, isLoading, error, refetch } = useAgencyDashboard();

  const dashboard = data?.dashboard ?? {};
  const analytics = data?.analytics ?? {};
  const contracts = Array.isArray(data?.contracts) ? data.contracts : [];
  const monthlyRevenue = Array.isArray(dashboard?.monthlyRevenue) && dashboard.monthlyRevenue.length
    ? dashboard.monthlyRevenue
    : Array.isArray(analytics?.monthlyRevenue) && analytics.monthlyRevenue.length
      ? analytics.monthlyRevenue
      : [
          { month: 'Jan', revenue: 18000, utilization: 62 },
          { month: 'Feb', revenue: 24500, utilization: 68 },
          { month: 'Mar', revenue: 31000, utilization: 74 },
          { month: 'Apr', revenue: 27500, utilization: 71 },
          { month: 'May', revenue: 42000, utilization: 82 },
          { month: 'Jun', revenue: 48000, utilization: 86 },
        ];

  const recentActivity = Array.isArray(dashboard?.recentTeamActivity) && dashboard.recentTeamActivity.length
    ? dashboard.recentTeamActivity
    : Array.isArray(analytics?.recentTeamActivity) && analytics.recentTeamActivity.length
      ? analytics.recentTeamActivity
      : [
          { id: 1, member: 'Amina O.', action: 'submitted milestone delivery', target: 'FinCorp ERP rollout', time: '12 minutes ago' },
          { id: 2, member: 'Daniel K.', action: 'updated proposal for', target: 'HealthSync mobile app', time: '46 minutes ago' },
          { id: 3, member: 'Grace M.', action: 'closed contract approval for', target: 'Nexis cloud migration', time: '2 hours ago' },
        ];

  const activeContracts = contracts.length ? contracts.slice(0, 5) : (Array.isArray(dashboard?.activeContracts) ? dashboard.activeContracts.slice(0, 5) : []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => <div key={item} className="h-32 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-surface-muted animate-pulse" />
          <div className="h-96 rounded-2xl bg-surface-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Agency dashboard is waiting for backend data</p>
            <p>{error.message}. The UI is ready for the configured agency endpoints.</p>
            <button onClick={refetch} className="mt-2 text-xs font-bold underline">Retry</button>
          </div>
        </div>
      )}

      <div className="bg-[#222222] text-white rounded-[28px] p-6 md:p-8 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-success" />
              <span className="text-xs font-black uppercase tracking-widest text-success">Agency operating system</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight">Agency dashboard</h1>
            <p className="text-sm md:text-base text-white/70 mt-2 max-w-2xl">
              Monitor revenue, utilization, contracts, proposals, and team activity across your agency workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/agency/team" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#222222] hover:bg-white/90">
              Manage team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/agency/analytics" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">
              Team analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STAT_FIELDS.map((stat, index) => {
          const value = dashboard[stat.valueKey] ?? analytics[stat.valueKey] ?? stat.fallback;
          return <StatCard key={stat.label} stat={stat} value={value} />;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly revenue" subtitle="Revenue trend from contracts and active projects">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="agencyRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4C1D95" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4C1D95" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#4C1D95" strokeWidth={3} fill="url(#agencyRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Utilization" subtitle="Team capacity used this month">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="utilization" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-900">Active contracts</h3>
              <p className="text-xs text-ink-secondary mt-1">Contracts requiring delivery attention</p>
            </div>
            <Link to="/agency/contracts" className="text-xs font-bold text-[#4C1D95] hover:underline">View all</Link>
          </div>
          {activeContracts.length === 0 ? (
            <EmptyState icon={Briefcase} title="No active contracts" description="Contracts will appear here once the agency API returns data." />
          ) : (
            <div className="divide-y divide-border">
              {activeContracts.map((contract) => (
                <div key={contract.id} className="p-5 hover:bg-surface-soft transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-body font-bold text-brand-900">{contract.title || contract.projectName || 'Untitled contract'}</h4>
                      <p className="text-xs text-ink-secondary mt-1">
                        {contract.client?.name || contract.clientName || 'Client'} · {contract.status || 'Active'}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-display font-bold text-brand-900">{formatCurrency(contract.value || contract.amount || 0)}</p>
                      <p className="text-xs text-ink-secondary">{contract.deadline ? new Date(contract.deadline).toLocaleDateString() : 'No deadline'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#4C1D95]" />
            <div>
              <h3 className="font-display font-bold text-lg text-brand-900">Recent team activity</h3>
              <p className="text-xs text-ink-secondary mt-1">Latest agency workspace events</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-5">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center font-bold text-xs shrink-0">
                    {String(activity.member || 'TM').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-ink-primary">
                      <span className="font-bold">{activity.member}</span>{' '}
                      <span className="text-ink-secondary">{activity.action}</span>{' '}
                      <span className="font-bold text-[#4C1D95]">{activity.target}</span>
                    </p>
                    <p className="text-xs text-ink-tertiary mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <div className="p-5 text-sm text-ink-secondary">No recent activity</div>}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-success" />
          <p className="text-sm text-ink-secondary">
            Agency routes are visible only for <span className="font-bold text-text-primary">AGENCY</span> accounts and sit on top of standard freelancer workflows.
          </p>
        </div>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-[#4C1D95]" />}
      </div>
    </motion.div>
  );
}
