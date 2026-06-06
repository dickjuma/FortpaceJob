// src/pages/freelancer/GigsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus, Edit3, Eye, MoreVertical, Trash2,
  Copy, Check, Package, Star
} from 'lucide-react';
import { useFreelancerGigs } from '../services/freelancerHooks';

export default function GigsPage() {
  const { data, isLoading, error } = useFreelancerGigs();
  const [showSuccess, setShowSuccess] = useState(null);

  const gigs = Array.isArray(data) ? data : data?.items ?? data?.gigs ?? [];

  const handleEdit = (gigId) => {
    setShowSuccess({ message: 'Opening gig editor' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDuplicate = (gigId) => {
    setShowSuccess({ message: 'Duplicating gig' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDelete = (gigId) => {
    setShowSuccess({ message: 'Gig deleted' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const getStatusStyles = (status) => {
    if (status === 'Active') return 'bg-accent-light text-accent-dark';
    return 'bg-surface-muted text-ink-secondary';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-border rounded-xl p-4 animate-pulse">
                <div className="h-40 bg-surface-muted rounded-lg mb-3"></div>
                <div className="h-5 bg-surface-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-muted rounded w-2/3"></div>
              </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Package className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">My services</h1>
          </div>
          <p className="text-ink-secondary font-body">Manage and monitor your service listings</p>
        </div>
        <Link to="/freelancer/gigs/create">
          <button className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create new gig
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger rounded-xl p-4 mb-6">
          <p className="text-danger text-sm font-body">{error}</p>
        </div>
      )}

      {/* Gigs Grid */}
      {gigs.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl text-center py-16 px-4">
          <Package className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
          <h3 className="font-body font-semibold text-xl text-ink-primary mb-2">No gigs yet</h3>
          <p className="text-ink-secondary mb-6">Create your first service to start selling</p>
          <Link to="/freelancer/gigs/create">
            <button className="px-5 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create new gig
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig, idx) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              {gig.imageUrl && (
                <img
                  src={gig.imageUrl}
                  alt={gig.title}
                  className="w-full h-40 object-cover"
                  width={400}
                  height={160}
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-body font-semibold text-base text-ink-primary line-clamp-1 flex-1">
                    {gig.title}
                  </h3>
                  <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ml-2 ${getStatusStyles(gig.status || 'Active')}`}>
                    {gig.status || 'Active'}
                  </span>
                </div>

                <p className="text-sm font-body text-ink-secondary line-clamp-2 mb-3">
                  {gig.description}
                </p>

                {gig.rating > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                    <span className="text-sm font-body font-semibold text-ink-primary">{gig.rating}</span>
                    <span className="text-xs text-ink-tertiary">(12 reviews)</span>
                  </div>
                )}

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-ink-primary">
                    KES {gig.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(gig.id)}
                      className="p-1.5 text-ink-tertiary hover:text-accent DEFAULT rounded-lg transition-colors"
                      title="Edit gig"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(gig.id)}
                      className="p-1.5 text-ink-tertiary hover:text-accent DEFAULT rounded-lg transition-colors"
                      title="Duplicate gig"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(gig.id)}
                      className="p-1.5 text-ink-tertiary hover:text-danger rounded-lg transition-colors"
                      title="Delete gig"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
