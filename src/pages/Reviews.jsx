import React from 'react';
import { Star, ThumbsUp, Filter, Loader2 } from 'lucide-react';
import { usePlatformReviews } from '../common/hooks/usePublicDiscovery';

const Reviews = () => {
  const { reviews, loading } = usePlatformReviews();

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <>
      <div className="bg-surface py-12 border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Platform Reviews</h1>
              <p className="text-zinc-600">What clients are saying about their experience on Forte.</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-zinc-900 flex items-center justify-center gap-1">
                  {loading ? '—' : avgRating.toFixed(1)} <Star className="w-6 h-6 text-amber-400 fill-current" />
                </div>
                <div className="text-sm text-zinc-500 mt-1">{reviews.length} Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-zinc-900">{reviews.length} Reviews</h2>
          <button type="button" className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-surface border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
            <Filter className="w-4 h-4" /> Filter / Sort
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-zinc-500 font-medium py-16">No platform reviews yet.</p>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {reviews.map((review) => (
              <div key={review.id || review._id} className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">{review.project || review.projectTitle || review.title || 'Project'}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                      <span className="font-medium text-zinc-700">{review.client || review.clientName || review.author?.name || 'Client'}</span>
                      <span>•</span>
                      <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
                    {Number(review.rating || 0).toFixed(1)} <Star className="w-4 h-4 fill-current text-amber-500" />
                  </div>
                </div>

                <p className="text-zinc-700 mb-6 leading-relaxed">
                  {review.text || review.comment || review.feedback || ''}
                </p>

                <div className="flex items-center gap-4 text-sm text-zinc-500 border-t border-zinc-100 pt-4">
                  {review.cost && <span>Project cost: {review.cost}</span>}
                  {review.duration && <span>Duration: {review.duration}</span>}
                  <button type="button" className="ml-auto flex items-center gap-1 text-zinc-600 hover:text-[#2bb75c] font-medium transition-colors">
                    <ThumbsUp className="w-4 h-4" /> Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;

