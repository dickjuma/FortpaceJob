import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, User, Calendar, ShieldCheck, ThumbsUp, MoreHorizontal, Filter, AlertCircle } from 'lucide-react';
import { reviewAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, 5_STAR, 4_STAR, etc.

  useEffect(() => {
    if (user?.id) {
      loadReviews(user.id);
      return;
    }
    setIsLoading(false);
  }, [user]);

  const loadReviews = async (userId) => {
    try {
      const data = await reviewAPI.getReviews(userId);
      setReviews(data.reviews || data.data || []);
    } catch (err) {
      setError('Failed to load reviews');
      toast.error('Failed to load your reviews.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'ALL') return true;
    const rating = parseInt(filter.split('_')[0], 10);
    return Math.round(r.rating) === rating;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-success rounded-full animate-spin"></div>
        <p className="text-zinc-400 mt-4 font-bold">Loading your reviews...</p>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-success mb-4" />
        <h1 className="text-2xl font-black text-white">Sign in to view reviews</h1>
        <p className="text-zinc-400 mt-2 max-w-md">Your client reviews are private. Please sign in to continue.</p>
        <Link to="/auth/login" className="mt-6 inline-flex items-center justify-center rounded-xl bg-success px-5 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Star className="w-8 h-8 text-success" /> 
              My Reviews
            </h1>
            <p className="text-sm font-semibold text-zinc-400 mt-2">
              See what freelancers have to say about working with you.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{averageRating}</p>
              <div className="flex text-success mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3 h-3 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-zinc-700'}`} />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{reviews.length}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Total Reviews</p>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 bg-zinc-950/50 border-r border-zinc-800 p-6 shrink-0">
            <div className="flex items-center gap-2 text-white font-black mb-6">
              <Filter className="w-4 h-4 text-success" /> Filter by Rating
            </div>
            <div className="space-y-2">
              {['ALL', '5_STAR', '4_STAR', '3_STAR', '2_STAR', '1_STAR'].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilter(rating)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filter === rating 
                      ? 'bg-success/10 text-success border border-success/20' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {rating === 'ALL' ? 'All Reviews' : (
                      <>{rating.split('_')[0]} <Star className="w-3.5 h-3.5 fill-current" /></>
                    )}
                  </span>
                  <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">
                    {rating === 'ALL' ? reviews.length : reviews.filter(r => Math.round(r.rating) === parseInt(rating.split('_')[0], 10)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="flex-1 p-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-2 mb-6">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {filteredReviews.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-black text-white">No reviews found</h3>
                <p className="text-sm font-semibold text-zinc-500 mt-2 max-w-sm">
                  {filter === 'ALL' 
                    ? "You haven't received any reviews from freelancers yet. Complete projects to build your reputation." 
                    : `No ${filter.split('_')[0]}-star reviews available.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-zinc-700 overflow-hidden">
                          {review.reviewer?.avatar ? (
                            <img src={review.reviewer.avatar} alt="Reviewer" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">
                            {review.reviewer?.name || review.reviewer?.firstName || 'Freelancer'}
                          </p>
                          <p className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                        <Star className="w-4 h-4 text-success fill-current mr-1.5" />
                        <span className="font-black text-success text-sm">{Number(review.rating).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="pl-15">
                      <p className="text-sm font-medium text-zinc-300 leading-relaxed mb-4">
                        "{review.comment}"
                      </p>
                      
                      {review.contractId && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified Contract
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
