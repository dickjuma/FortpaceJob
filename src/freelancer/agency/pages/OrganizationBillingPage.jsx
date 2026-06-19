import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { DollarSign, TrendingUp, Receipt, Users, CreditCard, Download, FileCheck, Search } from 'lucide-react';
import { useAgencyBilling } from '../services/agencyHooks';

const METRICS = [
  { label: 'Revenue summary', value: '$248K', icon: TrendingUp, tone: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: 'Expenses', value: '$64K', icon: DollarSign, tone: 'text-rose-700', bg: 'bg-rose-50' },
  { label: 'Invoices', value: '36', icon: Receipt, tone: 'text-blue-700', bg: 'bg-blue-50' },
  { label: 'Team costs', value: '$42K', icon: Users, tone: 'text-violet-700', bg: 'bg-violet-50' },
  { label: 'Platform fees', value: '$8.2K', icon: CreditCard, tone: 'text-amber-700', bg: 'bg-amber-50' },
];

export default function OrganizationBillingPage() {
  const { data, isLoading } = useAgencyBilling();
  const revenue = data?.revenueSummary || [
    { label: 'Jan', revenue: 32000, expenses: 9000 },
    { label: 'Feb', revenue: 38000, expenses: 11000 },
    { label: 'Mar', revenue: 42000, expenses: 10000 },
    { label: 'Apr', revenue: 52000, expenses: 14000 },
    { label: 'May', revenue: 48000, expenses: 12000 },
    { label: 'Jun', revenue: 61000, expenses: 15000 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><DollarSign className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Organization billing</h1>
          </div>
          <p className="text-ink-secondary">Track revenue, expenses, invoices, team costs, and platform fees.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.tone} flex items-center justify-center mb-4`}><metric.icon className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide">{metric.label}</p>
            <p className="font-display text-2xl font-bold text-brand-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-900">Revenue vs expenses</h3>
              <p className="text-xs text-ink-secondary mt-1">Monthly organization billing summary</p>
            </div>
            <button className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-ink-primary">Export</button>
          </div>
          {isLoading ? <div className="h-80 rounded-2xl bg-surface-muted animate-pulse" /> : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4C1D95" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#22C55E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brand-900 mb-4">Recent invoices</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((invoice) => (
              <div key={invoice} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink-primary">INV-{202600 + invoice}</p>
                    <p className="text-xs text-ink-secondary">Platform services · Due {invoice + 5} days</p>
                  </div>
                  <span className="rounded-full bg-amber-50 text-amber-700 px-2.5 py-1 text-xs font-bold">Open</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-display font-bold text-brand-900">${(invoice * 1240).toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><FileCheck className="w-4 h-4" /></button>
                    <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-ink-tertiary" />
        <input placeholder="Search invoices, expenses, payouts..." className="flex-1 outline-none text-sm" />
      </div>
    </motion.div>
  );
}
