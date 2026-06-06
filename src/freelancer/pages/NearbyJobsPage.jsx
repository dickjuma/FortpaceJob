// src/pages/freelancer/NearbyJobsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Plus, X, Award, Briefcase, ChevronRight, Star, DollarSign, Clock, Eye, Check
} from 'lucide-react';

export default function NearbyJobsPage() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'On-site Network infrastructure Upgrade', client: 'Apex Holdings', distance: '2.4 miles', budget: 1800, type: 'Fixed Price', duration: '3 days', location: 'San Francisco, CA' },
    { id: 2, title: 'Corporate Video Production & Photography', client: 'Cloudfront Media', distance: '5.1 miles', budget: 3500, type: 'Fixed Price', duration: '5 days', location: 'Oakland, CA' },
    { id: 3, title: 'Enterprise Firewall Security Audit', client: 'Bay Area Cyberlabs', distance: '0.8 miles', budget: 150, type: 'Hourly Rate', duration: '20 hours', location: 'San Francisco, CA' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const handleApply = (title) => {
    setShowSuccess({ message: `Applied to "${title}"` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <MapPin className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Nearby contracts</h1>
        </div>
        <p className="text-ink-secondary font-body">
          Discover in-person, on-site contracts matching your location
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search nearby positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-10 bg-white border border-border rounded-xl text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -2 }}
            className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-accent-light text-accent-dark">
                  {job.distance} away
                </span>
                <span className="text-xs text-ink-tertiary font-body flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
              </div>

              <h3 className="font-body font-semibold text-base text-ink-primary leading-tight group-hover:text-accent DEFAULT transition-colors cursor-pointer">
                {job.title}
              </h3>
              <p className="text-sm text-ink-secondary font-body">
                Client: {job.client} • Duration: {job.duration}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center shrink-0">
              <div className="text-right">
                <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">{job.type}</p>
                <p className="font-mono font-bold text-lg text-ink-primary">
                  KES {job.budget.toLocaleString()}{job.type === 'Hourly Rate' && '/hr'}
                </p>
              </div>
              <button
                onClick={() => handleApply(job.title)}
                className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
              >
                Apply on-site
              </button>
            </div>
          </motion.div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white border border-border rounded-xl">
            <MapPin className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
            <h4 className="font-body font-semibold text-lg text-ink-primary mb-1">No nearby jobs found</h4>
            <p className="text-sm text-ink-secondary">Try adjusting your search or location settings</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
