import React, { useMemo, useState } from 'react';
import { Shield, Search, Filter, AlertTriangle, CheckCircle, Download, MoreVertical, Eye, Lock } from 'lucide-react';
import { useContracts } from '../../hooks/useMarketplace';
import { cn } from '../../utils/cn';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

const statusStyles = {
  active: 'bg-success/10 text-success',
  completed: 'bg-emerald-100 text-emerald-800',
  disputed: 'bg-danger/10 text-danger',
  pending: 'bg-amber-100 text-amber-800',
  pending_signatures: 'bg-amber-100 text-amber-800',
};

export default function AdminContractControlPanel() {
  const [search, setSearch] = useState('');
  const { data: contractsData = {}, isLoading } = useContracts();
  const contracts = contractsData.data || [];

  const filteredContracts = useMemo(() => {
    if (!search.trim()) return contracts;
    const query = search.trim().toLowerCase();
    return contracts.filter((contract) => {
      return [
        contract.id,
        contract.client?.name,
        contract.clientName,
        contract.freelancer?.name,
        contract.freelancerName,
        contract.jobTitle,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query));
    });
  }, [contracts, search]);

  const summary = useMemo(() => {
    const active = contracts.filter((contract) => contract.status === 'active').length;
    const disputed = contracts.filter((contract) => contract.status === 'disputed').length;
    const pending = contracts.filter((contract) => ['pending', 'pending_signatures'].includes(contract.status)).length;
    const escrowTotal = contracts.reduce((sum, contract) => sum + (contract.amount || 0), 0);
    const highRisk = contracts.filter((contract) => {
      const risk = String(contract.risk || contract.riskLevel || '').toLowerCase();
      return risk === 'high' || contract.riskScore > 70;
    }).length;
    return { active, disputed, pending, escrowTotal, highRisk };
  }, [contracts]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#4C1D95]" /> Contract Control Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Supervise marketplace contracts, review status flows, and monitor escalation risk.</p>
        </div>
        <Button className="bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border text-sm font-medium hover:bg-surface dark:hover:bg-surface-dark-tertiary shadow-card" leftIcon={<Download size={16} />}>
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Contracts', value: summary.active, color: 'text-[#4C1D95]' },
          { label: 'Funds in Escrow', value: `$${summary.escrowTotal.toLocaleString()}`, color: 'text-success' },
          { label: 'Pending Signatures', value: summary.pending, color: 'text-warning' },
          { label: 'High Risk Flags', value: summary.highRisk, color: 'text-danger' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl p-6 shadow-card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
            <div className="flex items-end justify-between gap-4">
              <span className={cn('text-3xl font-bold', stat.color)}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-surface-dark-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-secondary dark:bg-surface-dark-secondary">
          <div className="flex flex-1 gap-4 min-w-0">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contract ID, client, or freelancer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-surface-dark-border rounded-lg bg-white dark:bg-surface-dark text-sm focus:ring-2 focus:ring-[#4C1D95] outline-none"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark rounded-lg text-sm font-medium hover:bg-surface dark:hover:bg-surface-dark-tertiary">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-tertiary dark:bg-surface-dark-tertiary text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Contract</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Freelancer</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Risk</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-surface-dark-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, cell) => (
                      <td key={cell} className="px-6 py-4 h-10 bg-gray-100 dark:bg-zinc-800 rounded-md"></td>
                    ))}
                  </tr>
                ))
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">No contracts found for the current filters.</td>
                </tr>
              ) : (
                filteredContracts.map((contract) => {
                  const clientName = contract.client?.name || contract.clientName || 'Client';
                  const freelancerName = contract.freelancer?.name || contract.freelancerName || 'Freelancer';
                  const amount = contract.amount || contract.value || 0;
                  const status = contract.status || contract.state || 'unknown';
                  const riskLabel = String(contract.risk || contract.riskLevel || '').toLowerCase();
                  const riskClass = riskLabel === 'high' ? 'text-danger' : 'text-success';

                  return (
                    <tr key={contract.id || contract._id} className="hover:bg-surface dark:hover:bg-surface-dark-secondary transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900 dark:text-white">{contract.id}</div>
                        {contract.jobTitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{contract.jobTitle}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={freelancerName} size="sm" />
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{freelancerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={clientName} size="sm" />
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">${amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide', statusStyles[status] ?? 'bg-slate-100 text-slate-700')}>
                          {status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('font-bold', riskClass)}>{riskLabel || 'low'}</span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#4C1D95] transition-colors" title="View contract"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="More options"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


