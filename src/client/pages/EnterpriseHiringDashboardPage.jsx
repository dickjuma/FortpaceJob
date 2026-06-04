import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, Building, Filter, Plus, Clock, MoreVertical,
  ArrowUpRight, ArrowDownRight, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import { workAPI } from '../../common/services/api';

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
  const [activeTab, setActiveTab] = useState('overview');

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['client', 'work', 'analytics'],
    queryFn: () => workAPI.getAnalytics(),
    staleTime: 60_000,
  });

  const {
    data: pipeline,
    isLoading: pipelineLoading,
    error: pipelineError,
    refetch: refetchPipeline,
  } = useQuery({
    queryKey: ['client', 'work', 'pipeline'],
    queryFn: () => workAPI.getPipeline(),
    staleTime: 60_000,
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

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Enterprise Hiring</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage bulk hiring, departments, and vendors.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { refetchAnalytics(); refetchPipeline(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-surface dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-surface dark:hover:bg-gray-800 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-lg transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-gray-500">Failed to load hiring data.</p>
            <button onClick={() => { refetchAnalytics(); refetchPipeline(); }} className="text-sm text-[#2bb75c] hover:underline">Retry</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsCards.map((stat, idx) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">{stat.value}</span>
                    <span className={`flex items-center text-sm ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#2bb75c]" />
                      Active Hiring Pipelines
                    </h2>
                    <span className="text-sm text-gray-500">{pipeline?.total ?? 0} candidates</span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pipelineRows.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No active pipeline data yet.</div>
                    ) : (
                      pipelineRows.map((job) => (
                        <div key={job.id} className="p-6 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{job.role}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <Building className="w-4 h-4" /> {job.department}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/30 text-[#2bb75c] dark:text-[#2bb75c] text-xs font-medium rounded-full">
                              {job.stage}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {job.candidates} Candidates
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {timeAgo(job.lastUpdated)}
                              </span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#2bb75c]" />
                    Pipeline Stages
                  </h2>
                  <div className="space-y-4">
                    {stageSummary.length === 0 ? (
                      <p className="text-sm text-gray-500">No stage breakdown available.</p>
                    ) : (
                      stageSummary.map((dept) => (
                        <div key={dept.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-surface dark:bg-gray-800/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{dept.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              dept.status === 'On Track' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {dept.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
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

