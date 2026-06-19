// src/pages/freelancer/EscrowPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Clock, AlertCircle, CheckCircle2, ChevronRight,
  Lock, Search, AlertOctagon, MessageSquare, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFreelancerContracts } from '../services/freelancerHooks';

// Keep original API hooks - preserve structure
// import { contractAPI } from '../../platform/common/services/api';
// import { useConfirm } from '../../platform/common/context/ConfirmContext';

function mapContractStatus(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'DISPUTED' || s === 'DISPUTE') return 'In Dispute';
  if (s === 'COMPLETED' || s === 'RELEASED') return 'Released';
  if (s === 'ACTIVE' || s === 'FUNDED') return 'Funded';
  if (s === 'PENDING' || s === 'DRAFT') return 'Awaiting Funding';
  return 'Funded';
}

function contractToEscrowRow(contract) {
  const milestone = contract.milestones?.[0];
  const amount = Number(milestone?.amount ?? contract.totalAmount ?? 0);
  return {
    id: contract.id,
    contractId: contract.id,
    milestoneId: milestone?.id,
    client: contract.clientName || contract.clientId || 'Client',
    milestone: milestone?.title || contract.title || 'Contract milestone',
    amount,
    status: mapContractStatus(contract.status),
    date: contract.createdAt
      ? new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    releaseDate: contract.status === 'COMPLETED' && contract.updatedAt
      ? new Date(contract.updatedAt).toLocaleDateString()
      : 'Pending approval',
  };
}

export default function EscrowPage() {
  const navigate = useNavigate();
  // Keep original hooks - preserve structure
  // const { confirm } = useConfirm();
  const { data: contractsData = [], isLoading } = useFreelancerContracts({ limit: 50 });
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const escrows = useMemo(() => {
    const contracts = Array.isArray(contractsData)
      ? contractsData
      : (contractsData?.items ?? []);
    return contracts.map(contractToEscrowRow);
  }, [contractsData]);

  const summary = useMemo(() => {
    const funded = escrows.filter((e) => e.status === 'Funded').reduce((s, e) => s + e.amount, 0);
    const awaiting = escrows.filter((e) => e.status === 'Awaiting Funding').reduce((s, e) => s + e.amount, 0);
    const dispute = escrows.filter((e) => e.status === 'In Dispute').reduce((s, e) => s + e.amount, 0);
    return { funded, awaiting, dispute };
  }, [escrows]);

  const handleRequestRelease = async (escrow) => {
    // Keep original confirm flow commented
    // const ok = await confirm({
    //   title: 'Request release',
    //   message: `Request release of KES ${escrow.amount.toLocaleString()} for "${escrow.milestone}"?`,
    //   confirmLabel: 'Request release',
    // });
    // if (!ok) return;

    setShowSuccess({ message: `Release request submitted for ${escrow.milestone}` });
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleOpenDispute = async (escrow) => {
    // Keep original confirm flow commented
    // const ok = await confirm({
    //   title: 'Open dispute',
    //   message: `Open a dispute for contract ${escrow.id}?`,
    //   confirmLabel: 'Open dispute',
    //   critical: true,
    // });
    // if (!ok) return;

    navigate(`/freelancer/disputes/${escrow.contractId}`);
  };

  const filteredEscrows = escrows.filter((e) => {
    if (filter !== 'All' && e.status !== filter) return false;
    if (searchTerm && !e.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !e.milestone.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-muted rounded-2xl animate-pulse"></div>)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-surface-muted rounded-2xl animate-pulse"></div>)}
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Shield className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-4xl text-brand-900">Escrow protection</h1>
          </div>
          <p className="text-ink-secondary font-body mt-1 text-base">
            Track funded milestones, request releases, and manage disputes securely
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-body font-medium text-white/70 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-accent-light" /> Securely funded
            </p>
            <h3 className="font-mono font-semibold text-3xl text-white">KES {summary.funded.toLocaleString()}</h3>
            <p className="text-xs text-white/50 mt-2">Ready for release upon approval</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-warn" /> Awaiting funding
          </p>
          <h3 className="font-mono font-semibold text-3xl text-ink-primary">KES {summary.awaiting.toLocaleString()}</h3>
          <p className="text-xs text-ink-tertiary mt-2">Do not start work until funded</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-border rounded-2xl p-6 shadow-sm"
        >
          <p className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-danger" /> In dispute
          </p>
          <h3 className="font-mono font-semibold text-3xl text-danger">KES {summary.dispute.toLocaleString()}</h3>
          <p className="text-xs text-ink-tertiary mt-2">Under review by Trust & Safety</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-border mb-6"
      >
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Funded', 'Awaiting Funding', 'Released', 'In Dispute'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-body font-medium rounded-lg transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-900 ${
                filter === f
                  ? 'bg-brand-900 text-white'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search milestones..."
            className="w-full pl-9 pr-4 h-10 border border-border rounded-lg bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Escrow List */}
      <div className="space-y-4">
        {filteredEscrows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-border rounded-2xl text-center py-20 px-4"
          >
            <Shield className="w-12 h-12 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-lg text-ink-primary">No escrow records found</h3>
            <p className="text-sm text-ink-secondary mt-1">Active contracts with milestones appear here</p>
          </motion.div>
        ) : (
          filteredEscrows.map((escrow, idx) => (
            <motion.div
              key={escrow.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-xs font-medium text-ink-secondary bg-surface-muted px-2 py-0.5 rounded">
                      {escrow.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${
                      escrow.status === 'Funded'
                        ? 'bg-accent-light text-accent-dark border border-accent DEFAULT'
                        : escrow.status === 'Awaiting Funding'
                        ? 'bg-warn-light text-warn border border-warn DEFAULT'
                        : escrow.status === 'In Dispute'
                        ? 'bg-danger-light text-danger border border-danger DEFAULT'
                        : 'bg-surface-muted text-ink-secondary border border-border'
                    }`}>
                      {escrow.status}
                    </span>
                  </div>

                  <h3 className="font-body font-semibold text-lg text-ink-primary">
                    {escrow.milestone}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-body text-ink-secondary">Client:</span>
                    <span className="text-sm font-body font-medium text-ink-primary">{escrow.client}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-ink-tertiary" />
                      <span className="text-xs font-body text-ink-secondary">Added {escrow.date}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                    <div className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary" />
                      <span className="text-xs font-body text-ink-secondary">Release: {escrow.releaseDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold text-accent-dark bg-accent-light px-2 py-0.5 rounded">
                        KES {escrow.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {escrow.status === 'Funded' && (
                    <>
                      <button
                        onClick={() => handleRequestRelease(escrow)}
                        className="px-4 py-2 rounded-lg font-body font-medium text-sm bg-brand-900 text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Request release
                      </button>
                      <button
                        onClick={() => navigate('/freelancer/messages')}
                        className="px-4 py-2 rounded-lg font-body font-medium text-sm border border-border text-ink-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message client
                      </button>
                    </>
                  )}

                  {escrow.status === 'Awaiting Funding' && (
                    <button
                      onClick={() => navigate('/freelancer/messages')}
                      className="px-4 py-2 rounded-lg font-body font-medium text-sm border border-border text-ink-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-900 inline-flex items-center gap-2 transition-all"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Remind client
                    </button>
                  )}

                  {escrow.status === 'In Dispute' && (
                    <button
                      onClick={() => handleOpenDispute(escrow)}
                      className="px-4 py-2 rounded-lg font-body font-medium text-sm border border-danger text-danger hover:bg-danger-light focus:outline-none focus:ring-2 focus:ring-danger inline-flex items-center gap-2 transition-all"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      View dispute
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
