import React, { useState } from 'react';
import { 
  Star, Search, Filter, MoreVertical, ThumbsUp, Flag, CheckCircle, Trash2
} from 'lucide-react';
import { useReviews } from '../../hooks/useMarketplace';
import useMarketplaceStore from '../../store/marketplaceStore';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import UserProfileModal from '../../components/users/UserProfileModal';
import UserRankingModal from '../../components/users/UserRankingModal';
import UserFlagModal from '../../components/users/UserFlagModal';

const StatusBadge = ({ status }) => {
  const configs = {
    verified: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-success dark:text-success', label: 'Verified' },
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400', label: 'Pending' },
    flagged: { bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400', label: 'Flagged' },
  };
  const config = configs[status] || configs.pending;

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
      config.bg, config.color
    )}>
      {config.label}
    </span>
  );
};

export default function ReviewsPage() {
  const { data: reviewsData, isLoading } = useReviews();
  const { filters, setFilter, setPage } = useMarketplaceStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === reviewsData?.data?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviewsData?.data?.map(r => r.id) || []);
    }
  };

  const handleAction = (action, id) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: `${action} in progress...`,
        success: `Review ${id} successfully ${action.toLowerCase()}ed`,
        error: `Failed to ${action.toLowerCase()} review`,
      }
    );
  };

  const handleBulkAction = (action) => {
    toast.success(`${action} applied to ${selectedIds.length} reviews`);
    setSelectedIds([]);
  };

  const handleUserAction = (type, user) => {
    setSelectedUser(user);
    if (type === 'profile') setIsProfileModalOpen(true);
    if (type === 'ranking') setIsRankingModalOpen(true);
    if (type === 'flag') setIsFlagModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl">
              <Star size={24} className="fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Review Moderation</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor and moderate marketplace feedback to ensure platform integrity.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={filters.reviews.search}
              onChange={(e) => setFilter('reviews', 'search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <select 
            value={filters.reviews.status}
            onChange={(e) => setFilter('reviews', 'status', e.target.value)}
            className="px-4 py-2 bg-surface dark:bg-zinc-800 border-none rounded-xl text-sm outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-brand-50 dark:bg-brand-500/10 border-b border-brand-100 dark:border-brand-500/20 p-3 flex items-center justify-between px-6">
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
              {selectedIds.length} reviews selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('Verified')}
                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={14} /> Verify
              </button>
              <button 
                onClick={() => handleBulkAction('Removed')}
                className="px-3 py-1.5 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" onChange={toggleAll} checked={selectedIds.length > 0 && selectedIds.length === reviewsData?.data?.length} className="rounded border-zinc-300 dark:border-zinc-600 text-brand-600 focus:ring-brand-500" />
                </th>
                <th className="p-4">Review Details</th>
                <th className="p-4">Reviewer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Loading reviews...</td></tr>
              ) : (
                reviewsData?.data?.map(review => (
                  <tr key={review.id} className={cn("hover:bg-surface/50 dark:hover:bg-zinc-800/20", review.flagged && "bg-red-50/30 dark:bg-red-900/10")}>
                    <td className="p-4 text-center align-top">
                      <input type="checkbox" checked={selectedIds.includes(review.id)} onChange={() => toggleSelect(review.id)} className="rounded border-zinc-300 dark:border-zinc-600 text-brand-600 mt-2" />
                    </td>
                    <td className="p-4 max-w-md whitespace-normal">
                      <p className="font-bold text-zinc-900 dark:text-white">{review.title}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">{review.comment}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                        <span>{review.id}</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={10} /> {review.helpful} Helpful</span>
                        {review.flagged && <span className="flex items-center gap-1 text-red-500 font-medium"><Flag size={10} /> {review.flagReason}</span>}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div 
                        className="flex items-center gap-2 mt-1 cursor-pointer group"
                        onClick={() => handleUserAction('profile', { name: review.reviewerName, id: review.reviewerId })}
                      >
                        <Avatar name={review.reviewerName} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors">{review.reviewerName}</p>
                          <p className="text-xs text-zinc-500 capitalize">{review.reviewerRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div 
                        className="flex items-center text-amber-500 gap-0.5 mt-2 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleUserAction('ranking', { name: review.reviewerName })}
                        title="Adjust User Ranking"
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-zinc-200 dark:text-zinc-700"} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-top pt-5">
                      <StatusBadge status={review.status} />
                    </td>
                    <td className="p-4 text-right align-top pt-4">
                      <div className="flex items-center justify-end gap-2">
                        {review.status === 'pending' && (
                          <button 
                            onClick={() => handleAction('Verify', review.id)}
                            className="p-1.5 text-success bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg transition-colors tooltip-trigger" title="Verify Review"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {review.status !== 'flagged' && (
                          <button 
                            onClick={() => handleAction('Flag', review.id)}
                            className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 rounded-lg transition-colors tooltip-trigger" title="Flag for review"
                          >
                            <Flag size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction('Remove', review.id)}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors tooltip-trigger" title="Reject / Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg ml-1" title="More Options">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-surface-dark/50">
          <p className="text-sm text-zinc-500">Showing {reviewsData?.data?.length || 0} reviews</p>
          <div className="flex gap-1">
            <button disabled={reviewsData?.page === 1} onClick={() => setPage('reviews', (reviewsData?.page || 2) - 1)} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-surface">Prev</button>
            <button disabled={reviewsData?.page === reviewsData?.totalPages} onClick={() => setPage('reviews', (reviewsData?.page || 0) + 1)} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-surface">Next</button>
          </div>
        </div>
      </div>

      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
        onAction={handleUserAction}
      />

      <UserRankingModal 
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        user={selectedUser}
      />

      <UserFlagModal 
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
