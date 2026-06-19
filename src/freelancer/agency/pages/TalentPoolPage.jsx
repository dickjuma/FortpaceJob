import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Mail, UserPlus, Star, X, Calendar } from 'lucide-react';
import { useTalentPool } from '../services/agencyHooks';

export default function TalentPoolPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useTalentPool();
  const talents = Array.isArray(data?.items) ? data.items : [
    { id: 1, name: 'Maya Chen', skills: ['React', 'TypeScript', 'Figma'], availability: 'Available', rating: 4.9 },
    { id: 2, name: 'Noah Smith', skills: ['Node.js', 'AWS', 'PostgreSQL'], availability: '2 weeks', rating: 4.8 },
    { id: 3, name: 'Ivy Patel', skills: ['Product Strategy', 'UX Research'], availability: 'Available', rating: 4.7 },
  ];

  const filtered = talents.filter((talent) => `${talent.name} ${talent.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Heart className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Talent pool</h1>
          </div>
          <p className="text-ink-secondary">Manage saved freelancers, skill tags, availability, ratings, and recruitment actions.</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search saved freelancers or skills..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-56 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Heart className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No saved talent</h3>
          <p className="text-sm text-ink-secondary mt-1">Save freelancers from discovery pages to build your talent bench.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((talent) => (
            <motion.div key={talent.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center font-black">{talent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-brand-900">{talent.name}</h3>
                    <p className="text-xs text-ink-secondary">Saved freelancer</p>
                  </div>
                </div>
                <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-danger"><Heart className="w-4 h-4 fill-[#4C1D95] text-[#4C1D95]" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                {talent.skills.map((skill) => <span key={skill} className="rounded-full bg-accent-light text-accent-dark px-2.5 py-1 text-xs font-bold">{skill}</span>)}
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-secondary flex items-center gap-2"><Calendar className="w-4 h-4" /> Availability</span><span className="font-bold text-ink-primary">{talent.availability}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-secondary flex items-center gap-2"><Star className="w-4 h-4" /> Rating</span><span className="font-bold text-ink-primary">{talent.rating}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5">
                <button className="rounded-xl border border-border py-2 text-xs font-bold text-ink-primary">Remove</button>
                <button className="rounded-xl border border-border py-2 text-xs font-bold text-ink-primary inline-flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> Contact</button>
                <button className="rounded-xl bg-[#4C1D95] py-2 text-xs font-bold text-white inline-flex items-center justify-center gap-1"><UserPlus className="w-3 h-3" /> Pipeline</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
