import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Search, FileCheck, Download, Eye, DollarSign } from 'lucide-react';
import { useAgencyInvoices } from '../services/agencyHooks';

const statusTone = (status) => {
  const value = String(status || '').toLowerCase();
  if (value.includes('paid')) return 'bg-success/10 text-success';
  if (value.includes('open') || value.includes('pending')) return 'bg-amber-50 text-amber-700';
  return 'bg-danger-light text-danger';
};

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAgencyInvoices();
  const invoices = Array.isArray(data?.items) ? data.items : [
    { id: 1, number: 'INV-2026-001', date: '2026-06-01', amount: 4200, status: 'Paid' },
    { id: 2, number: 'INV-2026-002', date: '2026-06-06', amount: 1850, status: 'Open' },
    { id: 3, number: 'INV-2026-003', date: '2026-06-10', amount: 3100, status: 'Overdue' },
    { id: 4, number: 'INV-2026-004', date: '2026-06-14', amount: 980, status: 'Paid' },
  ];

  const filtered = invoices.filter((invoice) => `${invoice.number} ${invoice.status}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Receipt className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Invoices</h1>
          </div>
          <p className="text-ink-secondary">View, download, and reconcile agency invoices.</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice number or status..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Receipt className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No invoices found</h3>
          <p className="text-sm text-ink-secondary mt-1">Invoices will appear here once billing data is available.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-soft">
                <tr>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Invoice number</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Date</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Amount</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary">Status</th>
                  <th className="px-5 py-3 font-bold text-ink-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-surface-soft/50">
                    <td className="px-5 py-4 font-bold text-ink-primary">{invoice.number}</td>
                    <td className="px-5 py-4 text-ink-secondary">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-display font-bold text-brand-900 flex items-center gap-2"><DollarSign className="w-4 h-4 text-ink-tertiary" />{Number(invoice.amount).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(invoice.status)}`}>{invoice.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Eye className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Download className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><FileCheck className="w-4 h-4" /></button>
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
