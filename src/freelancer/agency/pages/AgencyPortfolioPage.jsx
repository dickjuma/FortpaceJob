import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Edit3, Trash2, Image as ImageIcon, Users, Star, Search } from 'lucide-react';
import { useAgencyPortfolio } from '../services/agencyHooks';

export default function AgencyPortfolioPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAgencyPortfolio();
  const items = Array.isArray(data?.items) ? data.items : [
    { id: 1, title: 'FinCorp ERP Rollout', category: 'Enterprise Software', client: 'FinCorp Bank', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', impact: '+38% efficiency', contributors: 8, rating: 4.9 },
    { id: 2, title: 'HealthSync Mobile App', category: 'Product Design', client: 'HealthSync', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', impact: '4.8/5 client rating', contributors: 6, rating: 4.8 },
    { id: 3, title: 'Nexis Cloud Migration', category: 'Cloud Infrastructure', client: 'Nexis Labs', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', impact: '99.99% uptime', contributors: 10, rating: 5.0 },
  ];

  const filtered = items.filter((item) => `${item.title} ${item.category} ${item.client}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Briefcase className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Agency portfolio</h1>
          </div>
          <p className="text-ink-secondary">Manage case studies, client testimonials, and team contributions.</p>
        </div>
        <button className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add portfolio item</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search portfolio items..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-96 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <ImageIcon className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No portfolio items</h3>
          <p className="text-sm text-ink-secondary mt-1">Add your first agency case study.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#4C1D95] uppercase tracking-wide">{item.category}</p>
                    <h3 className="font-display font-bold text-xl text-brand-900 mt-1">{item.title}</h3>
                    <p className="text-sm text-ink-secondary mt-1">{item.client}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-600"><Star className="w-4 h-4 fill-amber-500" /> {item.rating}</div>
                </div>
                <p className="rounded-xl bg-surface-soft p-3 text-sm text-ink-secondary">{item.impact}</p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-ink-secondary"><Users className="w-3.5 h-3.5" /> {item.contributors} contributors</span>
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Edit3 className="w-4 h-4" /></button>
                    <button className="rounded-lg border border-danger/30 p-2 text-danger hover:bg-danger/5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
