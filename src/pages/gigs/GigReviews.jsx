import React from 'react';
import { Star, ThumbsUp, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGigReviews } from '../../common/hooks/useGigsMarketplace';

const GigReviews = () => {
  const { gigId } = useParams();
  const { reviews, loading } = useGigReviews(gigId);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">

          <div className="mb-6">
            <Link to={`/gigs/gig/${gigId}`} className="text-success font-bold text-sm hover:underline">
              &larr; Back to Gig Details
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-zinc-900 mb-2">Gig Reviews</h1>
            </div>

            <div className="w-px h-24 bg-zinc-200 hidden md:block mx-4"></div>

            <div className="flex items-center gap-6 text-center md:text-left">
              <div>
                <div className="text-5xl font-black text-zinc-900 mb-1 flex items-center justify-center md:justify-start gap-2">
                  {avgRating.toFixed(1)} <Star className="w-8 h-8 text-amber-500 fill-current" />
                </div>
                <div className="text-sm font-bold text-zinc-500">{reviews.length} Total Reviews</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-center text-zinc-500 font-medium py-12">No reviews yet for this gig.</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => {
                    const rating = Number(review.rating || 0);
                    const buyerName = review.buyerName || review.author?.name || review.clientName || 'Client';
                    const avatar = review.buyerAvatar || review.author?.avatar;
                    return (
                      <div key={review.id || review._id} className="pb-8 border-b border-zinc-100 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            {avatar ? (
                              <img src={avatar} alt="Buyer" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600">
                                {buyerName[0]}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-zinc-900">{buyerName}</div>
                              <div className="text-xs font-medium text-zinc-500">{review.country || review.location || ''}</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-zinc-400">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date || ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= rating ? 'text-amber-500 fill-current' : 'text-zinc-200'}`} />
                          ))}
                        </div>

                        <p className="text-zinc-700 leading-relaxed mb-4">
                          {review.comment || review.text || review.feedback || ''}
                        </p>

                        {review.sellerResponse && (
                          <div className="ml-10 mb-4 p-4 bg-surface border border-zinc-100 rounded-xl">
                            <div className="font-bold text-sm text-zinc-900 mb-1">Seller&apos;s Response</div>
                            <p className="text-sm text-zinc-600">{review.sellerResponse}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-500 mr-2">Helpful?</span>
                          <button type="button" className="flex items-center gap-1 px-2.5 py-1.5 bg-surface hover:bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg border border-zinc-200 transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" /> Yes
                            {review.helpfulCount > 0 && ` (${review.helpfulCount})`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GigReviews;


