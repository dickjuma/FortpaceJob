// src/pages/freelancer/JobsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter, ChevronRight, Bookmark, ThumbsUp, ThumbsDown, Zap, ShieldCheck, Target, Check } from 'lucide-react';
import { useFreelancer } from '../context/FreelancerContext';
import { useFreelancerJobs, useSaveJob, useUnsaveJob, useSavedJobs } from '../services/freelancerHooks';

export default function JobsPage() {
  const navigate = useNavigate();
  const { accountType, isOfflineProvider } = useFreelancer();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Matches');
  const [category, setCategory] = useState('All Categories');
  const [budget, setBudget] = useState('Any Budget');
  const [experience, setExperience] = useState('Any Experience');
  const [page, setPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const { data: jobPage, isLoading: loading } = useFreelancerJobs({
    page,
    limit: 10,
    search: searchTerm,
    filter: activeFilter,
    category: category === 'All Categories' ? undefined : category,
    budget: budget === 'Any Budget' ? undefined : budget,
    experience: experience === 'Any Experience' ? undefined : experience,
  });
  const { data: saved = [] } = useSavedJobs();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const jobs = jobPage?.items ?? [];
  const quotaExhausted = jobPage?.quotaExhausted ?? false;
  const hasMore = page < (jobPage?.totalPages ?? 1);
  const savedJobsSet = useMemo(
    () => new Set((saved || []).map((item) => String(item?.id ?? item?.jobId ?? item))),
    [saved]
  );

  const toggleSaveJob = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const jobId = String(id);

    if (savedJobsSet.has(jobId)) {
      unsaveJobMutation.mutate(id, {
        onSuccess: () => {
          setShowSuccess({ message: 'Job removed from saved list' });
          setTimeout(() => setShowSuccess(null), 2000);
        }
      });
    } else {
      saveJobMutation.mutate(id, {
        onSuccess: () => {
          setShowSuccess({ message: 'Job saved successfully' });
          setTimeout(() => setShowSuccess(null), 2000);
        }
      });
    }
  };

  const handleApply = (id) => {
    setShowSuccess({ message: 'Redirecting to job details' });
    setTimeout(() => setShowSuccess(null), 1000);
    navigate(`/freelancer/job/${id}`);
  };

  const handleSearch = () => {
    setPage(1);
    setShowSuccess({ message: `Searching for "${searchTerm}"` });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const JobCardSkeleton = () => (
    <div className="bg-white border border-border rounded-xl p-5 animate-pulse">
      <div className="flex justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-surface-muted rounded"></div>
          <div className="h-4 w-1/3 bg-surface-muted rounded"></div>
        </div>
        <div className="w-8 h-8 bg-surface-muted rounded-full"></div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="h-5 w-20 bg-surface-muted rounded"></div>
        <div className="h-5 w-20 bg-surface-muted rounded"></div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full bg-surface-muted rounded"></div>
        <div className="h-4 w-2/3 bg-surface-muted rounded"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-16 bg-surface-muted rounded-full"></div>
        <div className="h-6 w-16 bg-surface-muted rounded-full"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-8 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-light/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body font-semibold text-white/80 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-accent-light" /> Curated matches
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
            Find enterprise projects that match your expertise
          </h1>
          <p className="text-sm font-body text-white/80 mb-6 max-w-2xl">
            We've curated these opportunities specifically for your profile
          </p>

          <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search by keywords, skills, or clients..."
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-transparent text-white text-sm font-body placeholder:text-white/50 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-lg bg-white text-brand-900 hover:bg-surface-soft font-body font-medium text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 shrink-0 sticky top-24">
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-body font-semibold text-sm text-ink-primary flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <button className="text-xs font-body font-medium text-ink-tertiary hover:text-danger transition-colors">
                Clear all
              </button>
            </div>

            <div className="space-y-6">
              {isOfflineProvider && (
                <div>
                  <h4 className="font-body font-semibold text-xs text-ink-primary uppercase tracking-wide mb-3">
                    Work location
                  </h4>
                  <div className="space-y-2">
                    {['Remote Only', 'Hybrid', 'On-Site'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-4 h-4 rounded border-2 border-border group-hover:border-accent DEFAULT transition-colors flex items-center justify-center">
                          <div className="w-2 h-2 rounded-sm bg-accent DEFAULT" />
                        </div>
                        <span className="text-sm font-body text-ink-secondary group-hover:text-ink-primary transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-body font-semibold text-xs text-ink-primary uppercase tracking-wide mb-3">
                  Job type
                </h4>
                <div className="space-y-2">
                  {['Any Job Type', 'Hourly', 'Fixed Price'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-4 h-4 rounded border-2 border-border group-hover:border-accent DEFAULT transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 rounded-sm bg-accent DEFAULT" />
                      </div>
                      <span className="text-sm font-body text-ink-secondary group-hover:text-ink-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-body font-semibold text-xs text-ink-primary uppercase tracking-wide mb-3">
                  Category
                </h4>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  {['All Categories', 'Development', 'Design', 'Writing', 'Marketing', 'Data', 'Admin Support'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-body font-semibold text-xs text-ink-primary uppercase tracking-wide mb-3">
                  Budget
                </h4>
                <select
                  value={budget}
                  onChange={(e) => { setBudget(e.target.value); setPage(1); }}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  {['Any Budget', 'Under $500', '$500-$1,000', '$1,000-$5,000', '$5,000+'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-body font-semibold text-xs text-ink-primary uppercase tracking-wide mb-3">
                  Experience
                </h4>
                <select
                  value={experience}
                  onChange={(e) => { setExperience(e.target.value); setPage(1); }}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  {['Any Experience', 'Entry', 'Intermediate', 'Expert'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-body font-semibold text-xs text-ink-primary uppercase tracking-wide mb-3">
                  Client info
                </h4>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border-2 border-border group-hover:border-accent DEFAULT transition-colors flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-accent DEFAULT" />
                  </div>
                  <span className="text-sm font-body text-ink-secondary group-hover:text-ink-primary transition-colors">Payment verified</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display font-semibold text-xl text-brand-900">Jobs matching your profile</h2>
            <div className="flex bg-surface-muted rounded-lg p-0.5">
              {['All Matches', 'Most Recent', 'Saved'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-xs font-body font-medium rounded-md transition-all ${
                    activeFilter === filter
                      ? "bg-white text-ink-primary shadow-sm"
                      : "text-ink-tertiary hover:text-ink-primary"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : quotaExhausted ? (
              <div className="bg-accent-light border border-accent DEFAULT rounded-xl text-center py-12 px-4">
                <Zap className="w-12 h-12 text-accent DEFAULT mx-auto mb-3" />
                <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">Limit reached</h3>
                <p className="text-sm text-ink-secondary mb-4">Upgrade to see more matches</p>
                <button
                  onClick={() => setPaywallOpen(true)}
                  className="px-5 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                >
                  View options
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-border rounded-xl text-center py-12">
                <Search className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
                <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">No jobs found</h3>
                <p className="text-sm text-ink-secondary">Try adjusting your filters</p>
              </div>
            ) : (
              jobs.map((jobRaw, idx) => {
                const job = {
                  id: jobRaw.id,
                  isUrgent: jobRaw.isUrgent,
                  title: jobRaw.title,
                  client: jobRaw.client?.name || 'Unknown Client',
                  verified: jobRaw.client?.verified || false,
                  postedAt: new Date(jobRaw.createdAt).toLocaleDateString(),
                  type: jobRaw.type === 'REMOTE' ? 'Remote' : (jobRaw.type || 'Job'),
                  budget: jobRaw.budgetRange || (jobRaw.budgetMin && jobRaw.budgetMax ? `$${jobRaw.budgetMin}-$${jobRaw.budgetMax}` : 'Negotiable'),
                  matchScore: jobRaw.matchScore || Math.floor(Math.random() * 20) + 80, // Mock score if missing
                  description: jobRaw.description,
                  skills: (typeof jobRaw.skills === 'string' ? (() => { try { return JSON.parse(jobRaw.skills); } catch { return []; } })() : jobRaw.skills) || []
                };
                
                return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleApply(job.id, { preventDefault: () => {}, stopPropagation: () => {} })}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      {job.isUrgent && (
                        <span className="inline-flex items-center gap-1 text-xs font-body font-medium bg-warn-light text-warn px-2 py-0.5 rounded-md mb-2 animate-pulse">
                          Urgent hiring
                        </span>
                      )}
                      <h3 className="font-body font-semibold text-base text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-body text-ink-secondary">
                        <span className="flex items-center gap-1">
                          {job.client}
                          {job.verified && <ShieldCheck className="w-3 h-3 text-accent DEFAULT" />}
                        </span>
                        <span>•</span>
                        <span>Posted {job.postedAt}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleSaveJob(job.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        savedJobsSet.has(String(job.id))
                          ? "text-accent DEFAULT bg-accent-light"
                          : "text-ink-tertiary hover:text-accent DEFAULT hover:bg-accent-light"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobsSet.has(String(job.id)) ? "fill-accent DEFAULT" : ""}`} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-body text-ink-secondary bg-surface-muted px-2 py-0.5 rounded-md">
                      <DollarSign className="w-3.5 h-3.5" /> {job.type}: {job.budget}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-body font-medium bg-accent-light text-accent-dark px-2 py-0.5 rounded-md">
                      <Target className="w-3.5 h-3.5" /> {job.matchScore}% Match
                    </div>
                  </div>

                  <p className="text-sm text-ink-secondary mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map(skill => (
                        <span key={skill} className="text-xs font-body font-medium bg-surface-muted text-ink-secondary px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => handleApply(job.id, e)}
                      className="px-4 py-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                    >
                      Apply now
                    </button>
                  </div>
                </motion.div>
              );
              })
            )}

            {!loading && hasMore && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
