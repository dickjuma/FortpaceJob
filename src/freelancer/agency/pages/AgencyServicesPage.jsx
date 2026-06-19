import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Edit3, Trash2, Users, DollarSign, Search } from 'lucide-react';
import { useAgencyServices } from '../services/agencyHooks';

export default function AgencyServicesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAgencyServices();
  const services = Array.isArray(data?.items) ? data.items : [
    { id: 1, name: 'Enterprise Web Applications', category: 'Software Engineering', pricing: 'Fixed + milestone', allocation: '8 members', revenue: '$120K MRR' },
    { id: 2, name: 'Product Strategy Sprint', category: 'Consulting', pricing: 'Weekly retainer', allocation: '3 members', revenue: '$32K MRR' },
    { id: 3, name: 'Cloud Migration', category: 'Infrastructure', pricing: 'Project-based', allocation: '6 members', revenue: '$88K MRR' },
  ];

  const filtered = services.filter((service) => `${service.name} ${service.category}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Briefcase className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Agency services</h1>
          </div>
          <p className="text-ink-secondary">Manage service categories, pricing models, and team allocation.</p>
        </div>
        <button className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add service</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Briefcase className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No services found</h3>
          <p className="text-sm text-ink-secondary mt-1">Add your first agency service package.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((service) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full bg-[#4C1D95]/10 text-[#4C1D95] px-2.5 py-1 text-xs font-bold">{service.category}</span>
                    <span className="rounded-full bg-success/10 text-success px-2.5 py-1 text-xs font-bold">Active</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-900">{service.name}</h3>
                  <p className="text-sm text-ink-secondary mt-2">Service description, deliverables, and success criteria for this agency offering.</p>
                </div>
                <div className="rounded-2xl bg-surface-soft p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm"><span className="text-ink-secondary flex items-center gap-2"><DollarSign className="w-4 h-4" /> Pricing</span><span className="font-bold text-ink-primary">{service.pricing}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-ink-secondary flex items-center gap-2"><Users className="w-4 h-4" /> Allocation</span><span className="font-bold text-ink-primary">{service.allocation}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-ink-secondary">Revenue</span><span className="font-bold text-ink-primary">{service.revenue}</span></div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-5 border-t border-border pt-4">
                <button className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-ink-primary inline-flex items-center gap-2"><Edit3 className="w-4 h-4" /> Edit service</button>
                <button className="rounded-xl border border-danger/30 px-4 py-2 text-sm font-bold text-danger inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> Remove service</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
