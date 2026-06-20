// GigsPage.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { gigAPI } from '../../platform/common/services/api';

export default function GigsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: gigsData, isLoading, error } = useQuery({
    queryKey: ['client', 'gigs'],
    queryFn: async () => {
      const data = await gigAPI.getGigs();
      return data.gigs || data.data || [];
    }
  });
  const gigs = gigsData || [];

  const filteredGigs = gigs.filter(
    (gig) =>
      gig.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    hover: { y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="font-display text-2xl font-bold text-brand-900">Browse Services</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-10 w-full sm:w-64 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary placeholder:text-ink-tertiary"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-danger-light text-danger text-sm flex items-center gap-2 border border-danger/20">
            <AlertCircle className="w-4 h-4" /> {error instanceof Error ? error.message : 'Failed to load gigs'}
          </div>
        )}

        {filteredGigs.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
            <p className="text-ink-secondary">No gigs available at the moment.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGigs.map((gig) => (
              <motion.div
                key={gig.id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                {gig.imageUrl ? (
                  <img
                    src={gig.imageUrl}
                    alt={gig.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-surface-muted flex items-center justify-center text-ink-tertiary text-sm">
                    No image
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display text-lg font-semibold text-brand-900 truncate" title={gig.title}>
                    {gig.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-secondary line-clamp-2 flex-1">
                    {gig.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-accent">${gig.price}</span>
                    <motion.button
                      whileTap={buttonTap}
                      className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      Order Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

