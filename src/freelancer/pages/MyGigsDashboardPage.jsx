// src/pages/freelancer/MyGigsDashboardPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Plus, Search, MoreVertical, Star, Edit, PauseCircle, PlayCircle, Trash2, Eye, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFreelancerGigs, usePauseGig, useActivateGig, useDeleteGig } from '../services/freelancerHooks';

const getStatusStyles = (status) => {
  if (status === 'ACTIVE') return 'bg-accent-light text-accent-dark border border-accent DEFAULT';
  return 'bg-warn-light text-warn border border-warn DEFAULT';
};

export default function MyGigsDashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading: loading } = useFreelancerGigs();
  const pauseMutation = usePauseGig();
  const activateMutation = useActivateGig();
  const deleteMutation = useDeleteGig();
  const [activeMenu, setActiveMenu] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);

  const gigs = Array.isArray(data) ? data : data?.items ?? [];

  const filteredGigs = gigs.filter(g => {
    if (filter !== 'All') {
      const filterVal = filter === 'Drafts' ? 'DRAFT' : filter.toUpperCase();
      if (g.status !== filterVal) return false;
    }
    if (searchTerm && !g.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAction = async (id, action) => {
    setActiveMenu(null);

    try {
      if (action === 'pause') {
        await pauseMutation.mutateAsync(id);
        setShowSuccess({ message: 'Gig paused' });
      } else if (action === 'activate') {
        await activateMutation.mutateAsync(id);
        setShowSuccess({ message: 'Gig activated' });
      } else if (action === 'delete') {
        await deleteMutation.mutateAsync(id);
        setShowSuccess({ message: 'Gig deleted' });
      } else if (action === 'edit') {
        navigate(`/freelancer/gigs/${id}/edit`);
      } else if (action === 'view') {
        navigate(`/freelancer/gigs/${id}`);
      }
    } catch {
      setShowSuccess({ message: 'Action could not be completed' });
    } finally {
      setTimeout(() => setShowSuccess(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-surface-muted rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
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

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Briefcase className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">My services</h1>
          </div>
          <p className="text-ink-secondary font-body">Manage your service listings and track performance</p>
        </div>
        <button
          onClick={() => navigate('/freelancer/create-gig')}
          className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create new gig
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-border mb-6">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Active', 'Paused', 'Drafts'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-body font-medium rounded-lg transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-brand-900 text-white'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-9 pr-4 h-10 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredGigs.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl text-center py-20 px-4">
          <Briefcase className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
          <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">No services found</h3>
          <p className="text-ink-secondary mb-6">Create your first service to start selling</p>
          <button
            onClick={() => navigate('/freelancer/create-gig')}
            className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create gig
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig, idx) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={250}
                />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-body font-medium ${getStatusStyles(gig.status)}`}>
                    {gig.status}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    className="p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors"
                    onClick={() => setActiveMenu(activeMenu === gig.id ? null : gig.id)}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {activeMenu === gig.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-20"
                      >
                        <button
                          onClick={() => handleAction(gig.id, 'view')}
                          className="w-full text-left px-3 py-2 text-sm font-body font-medium text-ink-primary hover:bg-surface-muted flex items-center gap-2 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => handleAction(gig.id, 'edit')}
                          className="w-full text-left px-3 py-2 text-sm font-body font-medium text-ink-primary hover:bg-surface-muted flex items-center gap-2 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        {gig.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleAction(gig.id, 'pause')}
                            className="w-full text-left px-3 py-2 text-sm font-body font-medium text-warn hover:bg-surface-muted flex items-center gap-2 transition-colors"
                          >
                            <PauseCircle className="w-3.5 h-3.5" /> Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(gig.id, 'activate')}
                            className="w-full text-left px-3 py-2 text-sm font-body font-medium text-accent DEFAULT hover:bg-surface-muted flex items-center gap-2 transition-colors"
                          >
                            <PlayCircle className="w-3.5 h-3.5" /> Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(gig.id, 'delete')}
                          className="w-full text-left px-3 py-2 text-sm font-body font-medium text-danger hover:bg-surface-muted flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-body font-semibold text-base text-ink-primary line-clamp-2">
                      {gig.title}
                    </h3>
                    <p className="text-xs text-ink-tertiary mt-1">{gig.category}</p>
                  </div>
                  {gig.price != null && (
                    <span className="font-mono font-bold text-base text-ink-primary">KES {Number(gig.price).toLocaleString()}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-ink-secondary gap-3 mb-4">
                  <span>{gig.orders ?? 0} orders</span>
                  <span>{gig.views ?? 0} views</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-ink-secondary">
                  <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                  <span>{gig.averageRating?.toFixed(1) ?? '0.0'}</span>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </motion.div>
  );
}
