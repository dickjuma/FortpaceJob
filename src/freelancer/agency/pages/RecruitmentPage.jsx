import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Calendar, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { useRecruitmentPipeline } from '../services/agencyHooks';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

export default function RecruitmentPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useRecruitmentPipeline();
  const candidates = Array.isArray(data?.items) ? data.items : [
    { id: 1, name: 'Daniel K.', role: 'React Engineer', stage: 'Interview', availability: '2 weeks', rating: 4.8 },
    { id: 2, name: 'Grace M.', role: 'Product Designer', stage: 'Screening', availability: 'Immediate', rating: 4.9 },
    { id: 3, name: 'Samuel O.', role: 'DevOps Engineer', stage: 'Offer', availability: '1 month', rating: 4.7 },
  ];

  const filtered = candidates.filter((candidate) => `${candidate.name} ${candidate.role} ${candidate.stage}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><Users className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Recruitment & hiring</h1>
          </div>
          <p className="text-ink-secondary">Move candidates through interview stages, schedule interviews, and hire talent.</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-96 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {STAGES.map((stage) => {
            const stageCandidates = filtered.filter((candidate) => candidate.stage === stage);
            return (
              <div key={stage} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-brand-900">{stage}</h3>
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold">{stageCandidates.length}</span>
                </div>
                <div className="space-y-3">
                  {stageCandidates.map((candidate) => (
                    <motion.div key={candidate.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border p-4 hover:border-[#4C1D95] transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center font-bold text-xs">{candidate.name.slice(0, 2)}</div>
                        <div>
                          <p className="font-bold text-ink-primary text-sm">{candidate.name}</p>
                          <p className="text-xs text-ink-secondary">{candidate.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs text-ink-secondary">
                        <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {candidate.availability}</p>
                        <p className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Rating {candidate.rating}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 rounded-lg border border-border py-2 text-xs font-bold text-ink-primary">Move</button>
                        <button className="flex-1 rounded-lg bg-[#4C1D95] py-2 text-xs font-bold text-white inline-flex items-center justify-center gap-1"><Calendar className="w-3 h-3" /> Interview</button>
                      </div>
                    </motion.div>
                  ))}
                  {stageCandidates.length === 0 && <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-ink-secondary">Drop candidates here</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
