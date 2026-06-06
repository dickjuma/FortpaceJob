// JobDetailsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, Star, MessageSquare, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function JobDetailsPage() {
  const { id } = useParams();

  const [proposals, setProposals] = useState([
    { id: 1, name: 'Alex Johnson', title: 'Senior React Engineer', rate: '$85/hr', score: 98, bid: '$85/hr', time: '1-3 months', status: 'Pending' },
    { id: 2, name: 'Elena Rodriguez', title: 'Full Stack Architect', rate: '$110/hr', score: 94, bid: '$100/hr', time: '3-6 months', status: 'Shortlisted' },
    { id: 3, name: 'Marcus Chen', title: 'Frontend Developer', rate: '$65/hr', score: 82, bid: '$60/hr', time: 'Less than 1 month', status: 'Pending' },
  ]);

  const handleShortlist = (proposalId) => {
    setProposals(prev => prev.map(p =>
      p.id === proposalId ? { ...p, status: 'Shortlisted' } : p
    ));
  };

  const handleDecline = (proposalId) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/client/jobs" className="text-sm font-medium text-accent hover:text-accent-dark mb-4 inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-900">Senior React Developer for Enterprise Dashboard</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-ink-tertiary">
                <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> Posted 2 days ago</span>
                <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote (Worldwide)</span>
                <span className="inline-flex px-2 py-0.5 rounded-full font-medium text-xs bg-accent-light text-accent-dark">Active</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary hover:bg-surface-soft transition-colors">
                Edit Job
              </button>
              <button className="px-4 py-2 bg-danger-light text-danger border border-danger/20 rounded-lg text-sm font-medium hover:bg-danger/10 transition-colors">
                Close Job
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Proposals */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border bg-white">
                <h2 className="font-display text-xl font-bold text-brand-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" /> Review Proposals ({proposals.length})
                </h2>
              </div>
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-border"
              >
                {proposals.map((proposal) => (
                  <motion.li
                    key={proposal.id}
                    variants={itemVariants}
                    className="p-5 hover:bg-surface-soft transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent-light text-accent-dark flex items-center justify-center font-bold text-xl shrink-0 border border-accent/20">
                          {proposal.name[0]}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-ink-primary text-lg">{proposal.name}</h3>
                            {proposal.status === 'Shortlisted' && (
                              <span className="inline-flex px-2 py-0.5 bg-warn-light text-warn text-xs rounded-full border border-warn/20">Shortlisted</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-ink-secondary">{proposal.title}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-ink-tertiary">
                            <span className="font-semibold text-ink-primary">Profile Rate: {proposal.rate}</span>
                            <span className="inline-flex items-center gap-1 text-accent font-semibold">
                              <Star className="w-4 h-4 fill-accent" /> Match: {proposal.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-ink-tertiary mb-0.5">Bid Amount</p>
                        <p className="text-xl font-bold text-accent">{proposal.bid}</p>
                        <p className="text-xs text-ink-tertiary mt-1">{proposal.time}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors shadow-sm">
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-ink-primary text-sm font-medium rounded-lg hover:bg-surface-soft transition-colors">
                        View Cover Letter
                      </button>
                      {proposal.status !== 'Shortlisted' && (
                        <button
                          onClick={() => handleShortlist(proposal.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-accent-dark bg-accent-light text-sm font-medium rounded-lg hover:bg-accent/20 transition-colors ml-auto"
                        >
                          <CheckCircle className="w-4 h-4" /> Shortlist
                        </button>
                      )}
                      <button
                        onClick={() => handleDecline(proposal.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-danger bg-danger-light text-sm font-medium rounded-lg hover:bg-danger/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>

          {/* Sidebar - Job Overview */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm sticky top-6"
            >
              <h3 className="font-display text-lg font-bold text-brand-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-ink-tertiary uppercase tracking-wide">Budget Range</p>
                  <p className="font-bold text-ink-primary">$80 - $120 / hr</p>
                </div>
                <div>
                  <p className="text-xs text-ink-tertiary uppercase tracking-wide">Required Experience</p>
                  <p className="font-bold text-ink-primary">Expert (5+ years)</p>
                </div>
                <div>
                  <p className="text-xs text-ink-tertiary uppercase tracking-wide">Expected Duration</p>
                  <p className="font-bold text-ink-primary">3-6 Months</p>
                </div>
                <div>
                  <p className="text-xs text-ink-tertiary uppercase tracking-wide">Required Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-surface-soft text-ink-secondary text-xs font-medium rounded-md border border-border">React</span>
                    <span className="px-2 py-1 bg-surface-soft text-ink-secondary text-xs font-medium rounded-md border border-border">TypeScript</span>
                    <span className="px-2 py-1 bg-surface-soft text-ink-secondary text-xs font-medium rounded-md border border-border">Node.js</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
