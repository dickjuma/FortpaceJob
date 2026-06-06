// src/pages/freelancer/FreelancerActivityFeedPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Star, Award, TrendingUp, MessageCircle,
  Heart, Share2, MoreHorizontal, Briefcase, Send, Check
} from 'lucide-react';
import { useFreelancerRecentActivity } from '../services/freelancerHooks';

export default function FreelancerActivityFeedPage() {
  const { data: activityData = [], isLoading } = useFreelancerRecentActivity({ limit: 20 });
  const activities = Array.isArray(activityData) ? activityData : [];

  const [likedItems, setLikedItems] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentTexts, setCommentTexts] = useState({});
  const [showSuccess, setShowSuccess] = useState(null);

  const toggleLike = (id) => {
    setLikedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setShowSuccess({ message: likedItems.has(id) ? 'Like removed' : 'Activity liked' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const toggleComments = (id) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCommentChange = (id, text) => {
    setCommentTexts(prev => ({ ...prev, [id]: text }));
  };

  const handleSubmitComment = (id) => {
    const text = commentTexts[id];
    if (!text?.trim()) return;
    setShowSuccess({ message: 'Comment added' });
    setCommentTexts(prev => ({ ...prev, [id]: '' }));
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleShare = (id) => {
    setShowSuccess({ message: 'Share link copied to clipboard' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'rank_up':
        return (
          <div className="p-2 bg-accent-light rounded-full">
            <TrendingUp className="w-4 h-4 text-accent DEFAULT" />
          </div>
        );
      case 'job_completed':
        return (
          <div className="p-2 bg-accent-light rounded-full">
            <Briefcase className="w-4 h-4 text-accent DEFAULT" />
          </div>
        );
      case 'review_received':
        return (
          <div className="p-2 bg-accent-light rounded-full">
            <Star className="w-4 h-4 text-accent DEFAULT" />
          </div>
        );
      case 'badge_earned':
        return (
          <div className="p-2 bg-accent-light rounded-full">
            <Award className="w-4 h-4 text-accent DEFAULT" />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-surface-muted rounded-full">
            <CheckCircle2 className="w-4 h-4 text-ink-secondary" />
          </div>
        );
    }
  };

  const getActivityHeader = (activity) => {
    switch(activity.type) {
      case 'rank_up':
        return <span>achieved a new rank: <strong className="text-ink-primary">{activity.details.newRank}</strong></span>;
      case 'job_completed':
        return <span>completed a job: <strong className="text-ink-primary">{activity.details.projectTitle}</strong></span>;
      case 'review_received':
        return <span>received a 5-star review from <strong className="text-ink-primary">{activity.details.client}</strong></span>;
      case 'badge_earned':
        return <span>earned the <strong className="text-ink-primary">{activity.details.badgeName}</strong> badge</span>;
      default:
        return <span>posted an update</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-soft py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse mb-4"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-border rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-muted"></div>
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-surface-muted rounded mb-2"></div>
                    <div className="h-3 w-32 bg-surface-muted rounded"></div>
                  </div>
                </div>
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
      className="min-h-screen bg-surface-soft py-8 px-4 sm:px-6 lg:px-8"
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

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="font-display font-bold text-4xl text-brand-900">Activity feed</h1>
          <p className="mt-2 text-ink-secondary font-body">
            Stay updated with your network's latest achievements and project milestones
          </p>
        </header>

        {/* Activities List */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.08 }}
        >
          {activities.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl text-center py-16 px-4">
              <CheckCircle2 className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
              <p className="text-ink-secondary font-body">No recent activity yet</p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const isLiked = likedItems.has(activity.id);
              const isExpanded = expandedComments.has(activity.id);
              const currentLikes = activity.likes + (isLiked ? 1 : 0);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    {/* Activity Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          {activity.user.avatar ? (
                            <img
                              src={activity.user.avatar}
                              alt={activity.user.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center font-mono font-semibold text-accent-dark text-base">
                              {activity.user.name.charAt(0)}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-body text-ink-secondary">
                            <span className="font-semibold text-ink-primary">{activity.user.name}</span>{' '}
                            {getActivityHeader(activity)}
                          </div>
                          <div className="text-xs font-body text-ink-tertiary mt-1">
                            {activity.timestamp} • {activity.user.handle}
                          </div>
                        </div>
                      </div>
                      <button className="text-ink-tertiary hover:text-ink-secondary transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Activity Content */}
                    <div className="mt-4">
                      {activity.details.message && (
                        <p className="text-ink-primary text-sm font-body leading-relaxed whitespace-pre-wrap">
                          {activity.details.message}
                        </p>
                      )}

                      {/* Review Card */}
                      {activity.type === 'review_received' && activity.details.reviewText && (
                        <div className="mt-4 p-4 bg-surface-soft rounded-xl border border-border">
                          <div className="flex text-accent DEFAULT mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent DEFAULT" />
                            ))}
                          </div>
                          <p className="text-ink-primary text-sm font-body italic">
                            "{activity.details.reviewText}"
                          </p>
                          <p className="text-xs text-ink-tertiary font-body mt-2">
                            — Project: {activity.details.projectTitle}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex gap-5">
                        <button
                          onClick={() => toggleLike(activity.id)}
                          className={`flex items-center gap-1.5 text-sm font-body font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg px-2 py-1 ${
                            isLiked ? 'text-danger' : 'text-ink-tertiary hover:text-ink-secondary'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-danger' : ''}`} />
                          <span>{currentLikes}</span>
                        </button>
                        <button
                          onClick={() => toggleComments(activity.id)}
                          className="flex items-center gap-1.5 text-sm font-body font-medium text-ink-tertiary hover:text-ink-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg px-2 py-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{activity.comments}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleShare(activity.id)}
                        className="flex items-center gap-1.5 text-sm font-body font-medium text-ink-tertiary hover:text-ink-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg px-2 py-1"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border bg-surface-soft"
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-xs font-mono font-semibold text-accent-dark flex-shrink-0">
                              Y
                            </div>
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentTexts[activity.id] || ''}
                                onChange={(e) => handleCommentChange(activity.id, e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(activity.id)}
                                className="w-full h-9 px-4 pr-10 rounded-full border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                              />
                              <button
                                onClick={() => handleSubmitComment(activity.id)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent DEFAULT hover:text-accent-dark transition-colors p-1 rounded-full"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-center pt-2">
                            <button className="text-sm font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors">
                              View all {activity.comments} comments
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
