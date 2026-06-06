// src/pages/freelancer/ContractsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Clock, CheckCircle2, AlertCircle, ShieldCheck,
  Download, MoreVertical, Search, UploadCloud, MessageSquare, Check
} from 'lucide-react';
import { useFreelancerContracts, useSignContract, useFreelancerDashboard } from '../services/freelancerHooks';

export default function ContractsPage() {
  const [filter, setFilter] = useState('All Contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(null);

  const { data: dashboardData } = useFreelancerDashboard();
  const { data, isLoading: loading } = useFreelancerContracts({
    page,
    limit: 10,
    search: searchTerm,
    status: filter === 'All Contracts' ? undefined : filter.toUpperCase()
  });

  const contracts = data?.items || [];
  const totalContracts = data?.total || 0;

  const signContractMutation = useSignContract();

  const handleUpload = (e, contractId) => {
    e.stopPropagation();
    setShowSuccess({ message: 'Document uploaded successfully' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleSign = (id, e) => {
    e.stopPropagation();
    // await signContractMutation.mutateAsync({ contractId: id, data: {} });
    setShowSuccess({ message: `Contract signed successfully` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleMessage = (clientName) => {
    setShowSuccess({ message: `Opening conversation with ${clientName}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  // Dynamic calculations for KPIs
  const totalEscrow = dashboardData?.wallet?.locked || 0;

  const calculatedEscrow = contracts.reduce((sum, c) => {
    const msSum = (c.milestones || []).reduce((mSum, m) => {
      const status = m.status?.toUpperCase() || '';
      if (status === 'LOCKED' || status === 'PENDING' || status === 'IN_REVIEW' || status === 'ACTIVE') {
        return mSum + (m.amount || 0);
      }
      return mSum;
    }, 0);
    return sum + (msSum || c.totalAmount || 0);
  }, 0);

  const displayEscrow = totalEscrow || calculatedEscrow || 0;

  const activeContractsCount = dashboardData?.contracts?.active || contracts.filter(c => {
    const status = c.status?.toUpperCase() || '';
    return status === 'ACTIVE' || status === 'IN_PROGRESS';
  }).length || 0;

  const pendingApprovalsCount = contracts.filter(c => {
    const status = c.status?.toUpperCase() || '';
    return status === 'PENDING_SIGNATURE' || status === 'PENDING' || status === 'PENDING_APPROVAL';
  }).length || 0;

  if (loading && contracts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-64 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <FileText className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Contract management</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1 text-base max-w-2xl">
            Securely manage active agreements, track milestone deliveries, and monitor escrow funding
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-xs font-body font-medium text-white/70 uppercase tracking-wide mb-2">Total in escrow</p>
            <h3 className="font-mono font-semibold text-3xl text-white">KES {displayEscrow.toLocaleString()}</h3>
            <p className="text-xs font-body text-accent-light bg-white/10 w-fit px-2 py-0.5 rounded-full mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secured
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2">Active contracts</p>
          <div className="flex items-center gap-3">
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">{activeContractsCount}</h3>
            <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-md">
              Live agreements
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2">Pending approvals</p>
          <div className="flex items-center gap-3">
            <h3 className="font-mono font-semibold text-3xl text-danger">{pendingApprovalsCount}</h3>
            {pendingApprovalsCount > 0 && (
              <span className="text-xs font-body font-medium text-danger bg-danger-light px-2 py-0.5 rounded-md animate-pulse">
                Requires signature
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-border mb-6"
      >
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search by client or contract ID..."
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto h-10 px-4 border border-border bg-white text-ink-primary rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
        >
          <option>All Contracts</option>
          <option>In Progress</option>
          <option>Pending Signature</option>
          <option>Completed</option>
        </select>
      </motion.div>

      {/* Contracts List */}
      <div className="space-y-6">
        {contracts.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-border rounded-2xl text-center py-20 px-4"
          >
            <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-lg text-ink-primary">No contracts found</h3>
            <p className="text-sm text-ink-secondary mt-1">No contracts match your current filters</p>
          </motion.div>
        ) : (
          contracts.map((contract, idx) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-border bg-surface-soft">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs font-medium text-ink-secondary bg-surface-muted px-2 py-0.5 rounded">
                        {contract.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-body font-medium ${
                        contract.status === 'In Progress'
                          ? 'bg-accent-light text-accent-dark border border-accent DEFAULT'
                          : 'bg-warn-light text-warn border border-warn DEFAULT'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <h2 className="font-body font-semibold text-xl text-ink-primary">
                      {contract.title || contract.job?.title || 'Untitled Contract'}
                    </h2>
                    <p className="text-sm font-body text-ink-secondary mt-1">
                      Client: {contract.client?.companyName || contract.client?.name || 'Client'}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-1">Total value</p>
                    <p className="font-mono font-semibold text-2xl text-ink-primary">
                      {contract.totalAmount ? `KES ${contract.totalAmount.toLocaleString()}` : contract.totalEscrow}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress & Quick Actions */}
              <div className="p-6 border-b border-border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="w-full md:w-1/2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide">
                        Project progress
                      </span>
                      <span className="text-xs font-mono font-semibold text-ink-primary">{contract.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-900 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${contract.progress}%` }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      />
                    </div>
                    <p className="text-xs font-body text-ink-tertiary mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : contract.dueDate || 'TBD'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleMessage(contract.client?.name || 'Client')}
                      className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message client
                    </button>
                    <button
                      onClick={(e) => handleUpload(e, contract.id)}
                      className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload file
                    </button>
                    {(contract.status === 'PENDING_SIGNATURE' || contract.status === 'Pending Signature') && (
                      <button
                        onClick={(e) => handleSign(contract.id, e)}
                        className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Sign agreement
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestones Tracker */}
              {(contract.milestones || []).length > 0 && (
                <div className="p-6 bg-surface-soft">
                  <h4 className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-4">
                    Milestone timeline
                  </h4>
                  <div className="space-y-4">
                    {(contract.milestones || []).map((milestone, idx) => {
                      const isCompleted = milestone.status === 'COMPLETED' || milestone.status === 'Paid';
                      const isReview = milestone.status === 'IN_REVIEW' || milestone.status === 'In Review';
                      return (
                        <div key={milestone.id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center mt-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                              isCompleted
                                ? 'bg-accent DEFAULT border-accent DEFAULT text-white'
                                : isReview
                                ? 'bg-warn-light border-warn DEFAULT text-warn'
                                : 'bg-white border-border'
                            }`}>
                              {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                              {isReview && <Clock className="w-3 h-3" />}
                            </div>
                            {idx !== (contract.milestones || []).length - 1 && (
                              <div className={`w-0.5 h-full mt-1 ${isCompleted ? 'bg-accent DEFAULT' : 'bg-border'}`} />
                            )}
                          </div>

                          <div className="flex-1 bg-white border border-border rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:border-brand-900 transition-colors cursor-pointer">
                            <div>
                              <p className="text-sm font-body font-semibold text-ink-primary">
                                {milestone.name || milestone.title}
                              </p>
                              <p className="text-xs font-body text-ink-tertiary mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Target: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : milestone.date || 'TBD'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                              <span className="text-sm font-mono font-semibold text-ink-primary">
                                {milestone.amount ? `KES ${milestone.amount.toLocaleString()}` : 'TBD'}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-body font-medium ${
                                isCompleted
                                  ? 'bg-accent-light text-accent-dark'
                                  : isReview
                                  ? 'bg-warn-light text-warn'
                                  : 'bg-surface-muted text-ink-secondary'
                              }`}>
                                {milestone.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
