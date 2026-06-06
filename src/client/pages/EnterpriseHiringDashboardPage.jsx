// EnterpriseHiringDashboardPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, Building, Filter, Plus, Clock, MoreVertical,
  ArrowUpRight, ArrowDownRight, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import { workAPI } from '../../common/services/api';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function formatCurrency(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function buildAnalyticsCards(analytics) {
  if (!analytics) return [];
  return [
    {
      title: 'Total Hires',
      value: String(analytics.completedContracts ?? analytics.jobsPosted ?? 0),
      change: `${analytics.hireRate ?? 0}% hire rate`,
      isPositive: (analytics.hireRate ?? 0) >= 50,
    },
    {
      title: 'Active Contracts',
      value: String(analytics.activeContracts ?? 0),
      change: `${analytics.totalProposals ?? 0} proposals`,
      isPositive: true,
    },
    {
      title: 'Jobs Posted',
      value: String(analytics.jobsPosted ?? 0),
      change: `${analytics.totalProposals ?? 0} total proposals`,
      isPositive: true,
    },
    {
      title: 'Avg Contract Value',
      value: formatCurrency(analytics.avgContractValue ?? 0),
      change: formatCurrency(analytics.totalSpend ?? 0),
      isPositive: (analytics.avgContractValue ?? 0) > 0,
    },
  ];
}

function buildPipelineRows(pipeline) {
  if (!pipeline?.candidates?.length) return [];
  const byJob = {};
  for (const c of pipeline.candidates) {
    const key = c.jobId || 'general';
    if (!byJob[key]) {
      byJob[key] = { id: key, role: `Job ${key}`, department: 'Hiring', candidates: 0, stage: c.stage, lastUpdated: c.updatedAt };
    }
    byJob[key].candidates += 1;
    byJob[key].stage = c.stage;
    if (c.updatedAt && (!byJob[key].lastUpdated || c.updatedAt > byJob[key].lastUpdated)) {
      byJob[key].lastUpdated = c.updatedAt;
    }
  }
  return Object.values(byJob);
}

function timeAgo(iso) {
  if (!iso) return 'Recently';
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function EnterpriseHiringDashboardPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['client', 'work', 'analytics'],
    queryFn: () => workAPI.getAnalytics(),
    staleTime: 60000,
  });

  const {
    data: pipeline,
    isLoading: pipelineLoading,
    error: pipelineError,
    refetch: refetchPipeline,
  } = useQuery({
    queryKey: ['client', 'work', 'pipeline'],
    queryFn: () => workAPI.getPipeline(),
    staleTime: 60000,
  });

  const analyticsCards = buildAnalyticsCards(analytics);
  const pipelineRows = buildPipelineRows(pipeline);
  const isLoading = analyticsLoading || pipelineLoading;
  const hasError = analyticsError || pipelineError;

  const stageSummary = pipeline?.byStage
    ? Object.entries(pipeline.byStage).map(([stage, items]) => ({
        id: stage,
        name: stage,
        activeContractors: items?.length ?? 0,
        budgetSpent: '—',
        status: items?.length > 5 ? 'Warning' : 'On Track',
      }))
    : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const listItemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  const handleRefresh = () => {
    refetchAnalytics();
    refetchPipeline();
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900">Enterprise Hiring</h1>
            <p className="text-ink-secondary mt-1">Manage bulk hiring, departments, and vendors.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 bg-white border border-border rounded-2xl">
            <AlertCircle className="w-10 h-10 text-danger opacity-60" />
            <p className="text-ink-secondary">Failed to load hiring data.</p>
            <button onClick={handleRefresh} className="text-sm text-accent hover:underline">Retry</button>
          </div>
        ) : (
          <>
            {/* Analytics Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {analyticsCards.map((stat, idx) => (
                <motion.div
                  key={stat.title}
                  variants={cardVariants}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                  className="bg-white border border-border rounded-2xl p-5 shadow-sm"
                >
                  <h3 className="text-sm font-medium text-ink-tertiary">{stat.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-semibold text-ink-primary">{stat.value}</span>
                    <span className={`inline-flex items-center text-sm ${stat.isPositive ? 'text-accent' : 'text-danger'}`}>
                      {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Hiring Pipelines */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border flex justify-between items-center bg-white">
                    <h2 className="font-display text-lg font-semibold text-brand-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-accent" />
                      Active Hiring Pipelines
                    </h2>
                    <span className="text-sm text-ink-tertiary">{pipeline?.total ?? 0} candidates</span>
                  </div>
                  <div className="divide-y divide-border">
                    {pipelineRows.length === 0 ? (
                      <div className="p-8 text-center text-ink-tertiary">No active pipeline data yet.</div>
                    ) : (
                      pipelineRows.map((job, idx) => (
                        <motion.div
                          key={job.id}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: idx * 0.05 }}
                          className="p-5 hover:bg-surface-soft transition-colors"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                            <div>
                              <h3 className="font-semibold text-ink-primary text-base">{job.role}</h3>
                              <p className="text-sm text-ink-tertiary flex items-center gap-2 mt-0.5">
                                <Building className="w-4 h-4" /> {job.department}
                              </p>
                            </div>
                            <span className="inline-flex px-2.5 py-1 bg-accent-light text-accent-dark text-xs font-medium rounded-full">
                              {job.stage}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-tertiary">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {job.candidates} Candidates
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {timeAgo(job.lastUpdated)}
                              </span>
                            </div>
                            <button className="text-ink-tertiary hover:text-accent transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Pipeline Stages */}
              <div className="space-y-6">
                <div className="bg-white border border-border rounded-2xl shadow-sm p-5">
                  <h2 className="font-display text-lg font-semibold text-brand-900 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-accent" />
                    Pipeline Stages
                  </h2>
                  <div className="space-y-4">
                    {stageSummary.length === 0 ? (
                      <p className="text-sm text-ink-tertiary">No stage breakdown available.</p>
                    ) : (
                      stageSummary.map((dept) => (
                        <div
                          key={dept.id}
                          className="p-4 rounded-xl border border-border bg-surface-soft"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-ink-primary">{dept.name}</span>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium",
                              dept.status === 'On Track'
                                ? "bg-accent-light text-accent-dark"
                                : "bg-warn-light text-warn"
                            )}>
                              {dept.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-ink-tertiary">
                            <span>{dept.activeContractors} Candidates</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
