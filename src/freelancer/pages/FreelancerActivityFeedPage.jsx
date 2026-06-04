import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Star, Award, TrendingUp, MessageCircle, 
  Heart, Share2, MoreHorizontal, Briefcase, Send
} from 'lucide-react';
import { useFreelancerRecentActivity } from '../services/freelancerHooks';
import { extractList } from '../../common/utils/apiHelpers';
import { Loader2 } from 'lucide-react';

export default function FreelancerActivityFeedPage() {
  const { data: activityData, isLoading } = useFreelancerRecentActivity({ limit: 20 });
  const activities = extractList(activityData?.activities || activityData).map((a, i) => ({
    id: a.id || a._id || `act-${i}`,
    type: a.type || 'update',
    timestamp: a.timestamp || a.createdAt || '',
    likes: a.likes || 0,
    comments: a.comments || 0,
    user: {
      name: a.user?.name || a.actorName || 'User',
      avatar: a.user?.avatar || a.actorAvatar || '',
      handle: a.user?.handle || '',
    },
    details: a.details || a.payload || { message: a.message || a.description || '' },
  }));

  const [likedItems, setLikedItems] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentTexts, setCommentTexts] = useState({});

  const toggleLike = (id) => {
    setLikedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  const getActivityIcon = (type) => {
    switch(type) {
      case 'rank_up': return <div className="p-2 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/30 rounded-full"><TrendingUp className="w-5 h-5 text-[#2bb75c] dark:text-[#2bb75c]" /></div>;
      case 'job_completed': return <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-full"><Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" /></div>;
      case 'review_received': return <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-full"><Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" /></div>;
      case 'badge_earned': return <div className="p-2 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/30 rounded-full"><Award className="w-5 h-5 text-[#2bb75c] dark:text-[#2bb75c]" /></div>;
      default: return <div className="p-2 bg-surface dark:bg-gray-800 rounded-full"><CheckCircle2 className="w-5 h-5 text-gray-600 dark:text-gray-400" /></div>;
    }
  };

  const getActivityHeader = (activity) => {
    switch(activity.type) {
      case 'rank_up': return <span>achieved a new rank: <strong className="text-gray-900 dark:text-white">{activity.details.newRank}</strong></span>;
      case 'job_completed': return <span>completed a job: <strong className="text-gray-900 dark:text-white">{activity.details.projectTitle}</strong></span>;
      case 'review_received': return <span>received a 5-star review from <strong className="text-gray-900 dark:text-white">{activity.details.client}</strong></span>;
      case 'badge_earned': return <span>earned the <strong className="text-gray-900 dark:text-white">{activity.details.badgeName}</strong> badge</span>;
      default: return <span>posted an update</span>;
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Activity Feed</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Stay updated with your network's latest achievements and project milestones.</p>
        </header>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No recent activity yet.</p>
          ) : activities.map((activity, index) => {
            const isLiked = likedItems.has(activity.id);
            const isExpanded = expandedComments.has(activity.id);
            const currentLikes = activity.likes + (isLiked ? 1 : 0);

            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  {/* Activity Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {activity.user.avatar ? (
                          <img
                            src={activity.user.avatar}
                            alt={activity.user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600">
                            {activity.user.name[0]}
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-gray-900 dark:text-white">{activity.user.name}</span>{' '}
                          {getActivityHeader(activity)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {activity.timestamp} • {activity.user.handle}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Activity Content */}
                  <div className="mt-4">
                    {activity.details.message && (
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {activity.details.message}
                      </p>
                    )}
                    
                    {activity.type === 'review_received' && (
                      <div className="mt-4 p-4 bg-surface dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{activity.details.reviewText}"</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">— Project: {activity.details.projectTitle}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div className="flex space-x-6">
                      <button 
                        onClick={() => toggleLike(activity.id)}
                        className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                          isLiked ? 'text-[#2bb75c] dark:text-[#2bb75c]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{currentLikes}</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(activity.id)}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{activity.comments}</span>
                      </button>
                    </div>
                    <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                      <Share2 className="w-5 h-5" />
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
                      className="border-t border-gray-100 dark:border-gray-800 bg-surface dark:bg-gray-800/30"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-zinc-600">
                            You
                          </div>
                          <div className="flex-1 relative">
                            <input 
                              type="text"
                              placeholder="Write a comment..."
                              value={commentTexts[activity.id] || ''}
                              onChange={(e) => handleCommentChange(activity.id, e.target.value)}
                              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2bb75c] dark:text-white"
                            />
                            <button className="absolute right-2 top-1/2 -tranzinc-y-1/2 text-[#2bb75c] dark:text-[#2bb75c] p-1 rounded-full hover:bg-[#2bb75c]/5 dark:hover:bg-gray-800">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                          View all {activity.comments} comments
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

