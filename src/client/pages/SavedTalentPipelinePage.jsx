// ClientSavedTalentPipelinePage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  Star,
  MoreVertical,
  MessageSquare,
  LayoutGrid,
  List,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { workAPI } from '../../common/services/api';

const DEFAULT_PIPELINE = {
  total: 0,
  stages: [],
  candidates: [],
};

function mapCandidate(c) {
  return {
    id: c.id,
    name: c.name || 'Candidate',
    role: c.jobId || 'Open role',
    stage: c.stage || 'Sourced',
    score: c.score ?? 85,
    hourlyRate: c.bidAmount ? `$${c.bidAmount}/hr` : '—',
    notes: c.notes ?? 0,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'C')}&background=16A34A&color=fff`,
    skills: c.skills || [],
  };
}

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientSavedTalentPipelinePage() {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pipeline, setPipeline] = useState(DEFAULT_PIPELINE);

  const loadPipeline = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workAPI.getPipeline();
      setPipeline({
        total: data?.total ?? data?.candidates?.length ?? 0,
        stages: data?.stages ?? [],
        candidates: data?.candidates ?? [],
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  const refetch = () => {
    loadPipeline();
  };

  const stages = pipeline?.stages?.length ? pipeline.stages : [];
  const candidates = useMemo(
    () => (pipeline?.candidates || []).map(mapCandidate),
    [pipeline]
  );

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center gap-4 p-6">
        <AlertCircle className="w-12 h-12 text-danger opacity-60" />
        <p className="text-ink-secondary">Failed to load pipeline.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-900 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-accent" />
              Talent Pipeline
            </h1>
            <p className="text-ink-secondary mt-1">
              Manage and track saved freelancers across hiring stages.
              {pipeline?.total != null && ` (${pipeline.total} total)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-ink-tertiary hover:text-accent transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10 w-full sm:w-64 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
              />
            </div>
            <div className="flex bg-white border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'kanban'
                    ? 'bg-accent-light text-accent-dark'
                    : 'text-ink-tertiary hover:bg-surface-soft'
                )}
                aria-label="Kanban view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-accent-light text-accent-dark'
                    : 'text-ink-tertiary hover:bg-surface-soft'
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Kanban View */}
        {viewMode === 'kanban' ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {stages.map((stage) => {
              const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-display font-semibold text-brand-900 text-sm uppercase tracking-wide flex items-center gap-2">
                      {stage}
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-surface-muted text-ink-secondary">
                        {stageCandidates.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex-1 space-y-3 min-h-[200px] bg-surface-muted rounded-xl p-2">
                    <AnimatePresence>
                      {stageCandidates.map((candidate, idx) => (
                        <motion.div
                          key={candidate.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: idx * 0.05 }}
                          className="bg-white p-4 rounded-xl border border-border shadow-sm cursor-pointer hover:border-accent/30 transition-colors group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={candidate.avatar}
                                alt={candidate.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-medium text-ink-primary text-sm">
                                  {candidate.name}
                                </h4>
                                <p className="text-xs text-ink-tertiary">{candidate.role}</p>
                              </div>
                            </div>
                            <button className="text-ink-tertiary hover:text-ink-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-ink-tertiary border-t border-border pt-3 mt-2">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-warn font-medium">
                                <Star className="w-3 h-3 fill-warn" /> {candidate.score}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> {candidate.notes}
                              </span>
                            </div>
                            <span className="font-medium text-accent-dark">{candidate.hourlyRate}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {stageCandidates.length === 0 && (
                      <div className="h-full flex items-center justify-center text-sm text-ink-tertiary border-2 border-dashed border-border rounded-lg p-6 text-center">
                        No candidates in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-soft text-ink-tertiary border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">
                      Candidate
                    </th>
                    <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">
                      Stage
                    </th>
                    <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">
                      Score
                    </th>
                    <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">
                      Rate
                    </th>
                    <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCandidates.map((candidate, idx) => (
                    <motion.tr
                      key={candidate.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-surface-soft transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-ink-primary">{candidate.name}</div>
                            <div className="text-ink-tertiary text-xs">{candidate.role}</div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-accent-light text-accent-dark">
                          {candidate.stage}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-warn font-medium">
                          <Star className="w-4 h-4 fill-warn" /> {candidate.score}
                        </div>
                       </td>
                      <td className="px-6 py-4 text-ink-secondary">{candidate.hourlyRate}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-ink-tertiary hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent-light">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                       </td>
                    </motion.tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-ink-tertiary">
                        No candidates found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
