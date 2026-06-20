import { useProposalsForJob } from '../services/clientHooks';
// JobApplicantsScreen.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, CheckCircle, MessageSquare, Briefcase, Award, ChevronLeft } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function JobApplicantsScreen({ jobId }) {
  const { data: proposalsData } = useProposalsForJob(jobId);
  const applicants = proposalsData?.items || [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior React Developer', rate: '/hr', score: 98, status: 'pending' },
    { id: 2, name: 'David Chen', role: 'Full Stack Engineer', rate: '/hr', score: 92, status: 'shortlisted' },
    { id: 3, name: 'Elena Rodriguez', role: 'Frontend Specialist', rate: '/hr', score: 88, status: 'pending' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-900">Review Applicants</h1>
            <p className="text-sm text-ink-secondary mt-1">Enterprise Web App Development (#JOB-9921)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors">
              <Filter size={16} /> Filters
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search by name or skill..."
                className="pl-9 pr-4 py-2 border border-border rounded-lg bg-white text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5"
        >
          {applicants.map((app) => (
            <motion.div
              key={app.id}
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-accent-light text-accent-dark flex items-center justify-center text-lg font-bold shrink-0 border border-accent/20">
                  {app.name[0]}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                    {app.name}
                    <CheckCircle size={16} className="text-accent" />
                  </h3>
                  <p className="text-sm text-ink-secondary">{app.role}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-ink-tertiary">
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} className="text-warn fill-warn" /> 4.9 (120 reviews)
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={14} /> 100% Job Success
                    </span>
                    <span className="inline-flex items-center gap-1 text-accent">
                      <Award size={14} /> Top Rated Plus
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                <div className="text-right">
                  <span className="text-xl font-bold text-ink-primary">{app.rate}</span>
                  <p className="text-xs text-ink-tertiary">Proposed Rate</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <motion.button
                    whileTap={buttonTap}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors"
                  >
                    <MessageSquare size={16} /> Message
                  </motion.button>
                  <motion.button
                    whileTap={buttonTap}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Hire & Offer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

