import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAgencyEnterpriseContracts } from '../services/agencyHooks';

const statusTone = (status) => {
  const value = String(status || '').toLowerCase();
  if (value.includes('active')) return 'bg-success/10 text-success';
  if (value.includes('pending')) return 'bg-amber-50 text-amber-700';
  if (value.includes('completed')) return 'bg-blue-50 text-blue-700';
  return 'bg-surface-muted text-ink-secondary';
};

export default function EnterpriseContractsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAgencyEnterpriseContracts();
  const contracts = Array.isArray(data?.items) ? data.items : [
    { id: 1, title: 'Nexis Cloud Migration', client: 'Nexis Labs', status: 'Active', amount: 92000, approvals: '2/3' },
    { id: 2, title: 'FinCorp ERP Rollout', client: 'FinCorp Bank', status: 'Pending Approval', amount: 148000, approvals: '1/3' },
    { id: 3, title: 'HealthSync Mobile App', client: 'HealthSync', status: 'Completed', amount: 64000, approvals: '3/3' },
  ];

  const filtered = contracts.filter((contract) => `${contract.title} ${contract.client} ${contract.status}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><FileText className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Enterprise contracts</h1>
          </div>
          <p className="text-ink-secondary">Manage active contracts, pending approvals, and completed agreements.</p>
        </div>
        <button className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Create contract</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contracts..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No contracts found</h3>
          <p className="text-sm text-ink-secondary mt-1">Create or approve enterprise contracts here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-soft">
                <tr>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Contract</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Client</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Amount</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Approvals</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Status</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((contract) => (
                  <tr key={contract.id} className="hover:bg-surface-soft/50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-ink-primary">{contract.title}</p>
                      <p className="text-xs text-ink-secondary">#{contract.id}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-secondary">{contract.client}</td>
                    <td className="px-5 py-4 font-display font-bold text-brand-900">${Number(contract.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-ink-secondary">{contract.approvals}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(contract.status)}`}>{contract.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><CheckCircle className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><XCircle className="w-4 h-4" /></button>
                        <Link to={`/agency/contracts/${contract.id}/approval`} className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Eye className="w-4 h-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
