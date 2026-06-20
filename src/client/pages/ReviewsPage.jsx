// ClientReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, User, Calendar, ShieldCheck, ThumbsUp, MoreHorizontal, Filter, AlertCircle } from 'lucide-react';
import { useMyReviews } from '../services/clientHooks';
import { useAuthStore } from '../../platform/common/authStore';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientReviewsPage() {
  const [filter, setFilter] = useState('ALL');
  const { user } = useAuthStore();
  const { data, isLoading, error: queryError } = useMyReviews();
  const reviews = data?.items || data?.reviews || [];
  const error = queryError?.message || '';

  const filteredReviews = reviews.filter(r => {
    if (filter === 'ALL') return true;
    const rating = parseInt(filter.split('_')[0], 10);
    return Math.round(r.rating) === rating;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-900 border-t-accent rounded-full animate-spin"></div>
        <p className="text-ink-secondary mt-4 font-medium">Loading your reviews...</p>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-12 h-12 text-accent mb-4" />
        <h1 className="font-display text-2xl font-bold text-brand-900">Sign in to view reviews</h1>
        <p className="text-ink-secondary mt-2 max-w-md">Your client reviews are private. Please sign in to continue.</p>
        <Link to="/auth/login" className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-dark transition-colors">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl pointer-events-none rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-900 flex items-center gap-3">
                <Star className="w-8 h-8 text-accent" /> My Reviews
              </h1>
              <p className="text-sm font-medium text-ink-secondary mt-1">
                See what freelancers have to say about working with you.
              </p>
            </div>
            <div className="flex items-center gap-5 bg-surface-soft p-3 rounded-xl border border-border">
              <div className="text-center">
                <p className="text-3xl font-bold text-ink-primary">{averageRating}</p>
                <div className="flex text-accent mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-3 h-3 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-ink-tertiary'}`} />
                  ))}
                </div>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-ink-primary">{reviews.length}</p>
                <p className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide mt-1">Total Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
          <div className="w-full md:w-64 bg-surface-soft border-r border-border p-5 shrink-0">
            <div className="flex items-center gap-2 font-display font-bold text-brand-900 mb-5">
              <Filter className="w-4 h-4 text-accent" /> Filter by Rating
            </div>
            <div className="space-y-1.5">
              {['ALL', '5_STAR', '4_STAR', '3_STAR', '2_STAR', '1_STAR'].map(rating => {
                const starValue = rating === 'ALL' ? null : parseInt(rating.split('_')[0], 10);
                const count = rating === 'ALL'
                  ? reviews.length
                  : reviews.filter(r => Math.round(r.rating) === starValue).length;
                return (
                  <button
                    key={rating}
                    onClick={() => setFilter(rating)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      filter === rating
                        ? "bg-accent-light text-accent-dark border border-accent/20"
                        : "text-ink-secondary hover:bg-surface-muted hover:text-ink-primary border border-transparent"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {rating === 'ALL' ? 'All Reviews' : (
                        <>{starValue} <Star className="w-3.5 h-3.5 fill-current" /></>
                      )}
                    </span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full text-ink-tertiary">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 p-5">
            {error && (
              <div className="p-4 bg-danger-light border border-danger/20 rounded-xl text-danger text-sm font-medium flex items-center gap-2 mb-5">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {filteredReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center py-16"
              >
                <div className="w-20 h-20 bg-surface-muted border border-border rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-ink-tertiary" />
                </div>
                <h3 className="font-display text-lg font-bold text-brand-900">No reviews found</h3>
                <p className="text-sm text-ink-secondary mt-2 max-w-sm">
                  {filter === 'ALL'
                    ? "You haven't received any reviews from freelancers yet. Complete projects to build your reputation."
                    : `No ${filter.split('_')[0]}-star reviews available.`}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {filteredReviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    variants={itemVariants}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-border rounded-xl p-5 shadow-sm hover:border-accent/30 transition-all"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-muted rounded-full flex items-center justify-center shrink-0 border border-border overflow-hidden">
                          {review.reviewer?.avatar ? (
                            <img src={review.reviewer.avatar} alt="Reviewer" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-ink-tertiary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ink-primary text-sm">
                            {review.reviewer?.name || review.reviewer?.firstName || 'Freelancer'}
                          </p>
                          <p className="text-xs text-ink-tertiary flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-accent-light px-2.5 py-1 rounded-full border border-accent/20">
                        <Star className="w-3.5 h-3.5 text-accent-dark fill-current" />
                        <span className="font-bold text-accent-dark text-sm">{Number(review.rating).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="pl-13">
                      <p className="text-sm text-ink-primary leading-relaxed mb-3">
                        "{review.comment}"
                      </p>
                      {review.contractId && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-soft border border-border rounded-lg text-xs font-medium text-ink-tertiary">
                          <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Verified Contract
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

