import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { useAgencyProcurement } from '../services/agencyHooks';

const statusTone = (status) => {
  const value = String(status || '').toLowerCase();
  if (value.includes('approved')) return 'bg-success/10 text-success';
  if (value.includes('pending')) return 'bg-amber-50 text-amber-700';
  return 'bg-danger-light text-danger';
};

export default function ProcurementPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAgencyProcurement();
  const requests = Array.isArray(data?.items) ? data.items : [
    { id: 1, title: 'Figma Enterprise Seats', vendor: 'Figma', amount: 4800, status: 'Pending Approval' },
    { id: 2, title: 'AWS Reserved Capacity', vendor: 'Amazon Web Services', amount: 12000, status: 'Approved' },
    { id: 3, title: 'Design Contractor', vendor: 'Internal Pool', amount: 6500, status: 'Rejected' },
  ];

  const filtered = requests.filter((request) => `${request.title} ${request.vendor} ${request.status}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><FileText className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Procurement</h1>
          </div>
          <p className="text-ink-secondary">Create purchase requests, review vendors, and manage approval status.</p>
        </div>
        <button className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Create request</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests or vendors..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No procurement requests</h3>
          <p className="text-sm text-ink-secondary mt-1">Create a request to start the approval workflow.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-soft">
                <tr>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Purchase request</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Vendor</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Amount</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Approval status</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((request) => (
                  <tr key={request.id} className="hover:bg-surface-soft/50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-ink-primary">{request.title}</p>
                      <p className="text-xs text-ink-secondary">PR-{String(request.id).padStart(4, '0')}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-secondary">{request.vendor}</td>
                    <td className="px-5 py-4 font-display font-bold text-brand-900 flex items-center gap-2"><DollarSign className="w-4 h-4 text-ink-tertiary" />{Number(request.amount).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(request.status)}`}>{request.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><CheckCircle className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><XCircle className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Clock className="w-4 h-4" /></button>
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
