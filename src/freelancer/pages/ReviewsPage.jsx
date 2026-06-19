// src/pages/freelancer/ReviewsPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageCircle,
  Filter,
  Search,
  ThumbsUp,
  MoreVertical,
  Reply,
  MessageSquare,
  ShieldCheck,
  Check,
  AlertTriangle,
  Share2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useMyReceivedReviews, useReplyToReview } from '../../platform/common/hooks/useReviews';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, icon: Icon }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-border border-t-brand-900 rounded-full animate-spin" />
  </div>
);

// ---------- Helper Functions ----------
function mapReview(r) {
  return {
    id: r.id,
    client: r.reviewerName || 'Client',
    rating: Number(r.overallRating || r.rating) || 5,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    project: r.projectTitle || 'Project',
    content: r.comment || '',
    reply: r.reply || null,
    type: 'Contract',
    verified: true,
  };
}

// ---------- Main Component ----------
export default function ReviewsPage() {
  const [filter, setFilter] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [toast, setToast] = useState(null);
  const { data: apiReviews = [], isLoading, refetch } = useMyReceivedReviews();
  const replyMutation = useReplyToReview();

  const reviews = useMemo(() => apiReviews.map(mapReview), [apiReviews]);

  const handleReplySubmit = async (id) => {
    if (!replyText.trim()) {
      setToast({ type: 'error', message: 'Reply cannot be empty.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    try {
      await replyMutation.mutateAsync({ reviewId: id, reply: replyText });
      setReplyingTo(null);
      setReplyText('');
      refetch();
      setToast({ type: 'success', message: 'Reply posted successfully!' });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ type: 'error', message: 'Failed to post reply.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (isLoading) return <Spinner />;

  const filteredReviews = reviews.filter((r) => {
    if (filter === '5 Stars') return r.rating === 5;
    if (filter === 'Unanswered') return r.reply === null;
    return true;
  });

  // Calculate summary stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
  };
  const verifiedCount = reviews.filter((r) => r.verified).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-warn-light text-warn rounded-xl">
              <Star className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Reviews & ratings</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            View client feedback and manage your professional responses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Summary */}
        <div className="space-y-6">
          <Card className="text-center">
            <h3 className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-2">
              Overall rating
            </h3>
            <div className="flex items-baseline justify-center gap-1.5 mt-2">
              <span className="text-5xl font-mono font-bold text-brand-900">{avgRating}</span>
              <span className="text-sm text-ink-tertiary">/ 5.0</span>
            </div>
            <div className="flex justify-center gap-0.5 my-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(parseFloat(avgRating))
                      ? 'fill-warn text-warn'
                      : 'text-border'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-ink-secondary">
              From {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </Card>

          <Card>
            <h3 className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-3">
              Rating breakdown
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-secondary">5 stars</span>
                  <span className="font-mono text-ink-primary">{ratingDistribution[5] || 0}</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warn rounded-full"
                    style={{ width: `${((ratingDistribution[5] || 0) / totalReviews) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-3">
              Verified projects
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-ink-primary">{verifiedCount} verified</span>
              </div>
              <Badge variant="success">{Math.round((verifiedCount / totalReviews) * 100)}%</Badge>
            </div>
          </Card>
        </div>

        {/* Right Side: Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-white border border-border rounded-xl">
            {['All', '5 Stars', 'Unanswered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-brand-900 text-white'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
                <p className="text-ink-secondary">No reviews match the selected filter.</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-semibold text-brand-900">
                          {review.client}
                        </h4>
                        {review.verified && (
                          <Badge variant="success" className="gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-ink-tertiary mt-1">
                        {review.project} • {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-warn-light px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-warn text-warn" />
                      <span className="text-xs font-semibold text-warn">{review.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-ink-secondary leading-relaxed">
                    "{review.content}"
                  </p>

                  {review.reply ? (
                    <div className="mt-4 pl-4 border-l-2 border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Reply className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span className="text-xs font-medium text-ink-tertiary">Your reply</span>
                      </div>
                      <p className="text-sm text-ink-primary">{review.reply}</p>
                    </div>
                  ) : replyingTo === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a professional response..."
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={() => handleReplySubmit(review.id)}>
                          Post reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setReplyingTo(review.id)}
                        icon={MessageSquare}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
