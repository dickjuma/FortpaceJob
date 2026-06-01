import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Heart, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateReview } from '../../common/hooks/useReviews';
import { useAuthStore } from '../../common/authStore';
import { validateMinLength, validateRating } from '../../common/utils/validation';

const RatingReview = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const revieweeId = searchParams.get('revieweeId') || searchParams.get('freelancerId');
  const contractId = searchParams.get('contractId') || orderId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const ratingError = validateRating(rating);
    if (ratingError) {
      setFormError(ratingError);
      return;
    }
    const reviewError = validateMinLength(review, 10, 'Review');
    if (reviewError) {
      setFormError(reviewError);
      return;
    }
    if (!revieweeId) {
      createReview.mutate(
        {
          contractId,
          orderId,
          overallRating: rating,
          comment: review,
          reviewerRole: 'CLIENT',
        },
        { onSuccess: () => setSuccess(true) }
      );
      return;
    }
    createReview.mutate(
      {
        revieweeId,
        contractId,
        orderId,
        overallRating: rating,
        comment: review,
        reviewerRole: user?.role || 'CLIENT',
      },
      { onSuccess: () => setSuccess(true) }
    );
  };

  if (success) {
    return (
      <>
        <div className="bg-surface min-h-screen py-20 flex items-center justify-center">
          <div className="bg-white border border-zinc-200 rounded-3xl p-10 shadow-xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Review Submitted!</h1>
            <p className="text-zinc-600 font-medium mb-8">Thank you for sharing your experience. Your feedback helps the Fortspace community.</p>
            <Link to="/find-work/my-posted-work" className="block w-full py-3 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Rate Your Experience</h1>
            <p className="text-zinc-600 font-medium">The contract is now complete. Please rate DevMasterPro.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm">
            
            <div className="flex flex-col items-center mb-10">
              <img src="https://i.pravatar.cc/150?img=11" alt="Provider" className="w-20 h-20 rounded-full mb-4 border-2 border-zinc-100" />
              <h3 className="font-bold text-zinc-900 text-xl">DevMasterPro</h3>
              <div className="text-sm font-medium text-zinc-500 mb-6">Senior React Developer for Dashboard Rebuild</div>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-12 h-12 ${
                        star <= (hoverRating || rating) 
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm' 
                          : 'text-zinc-200'
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm font-bold text-zinc-400 h-5">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Write a public review</label>
              <textarea 
                rows="5"
                required
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="What was it like working with this freelancer? (e.g., quality of work, communication, meeting deadlines)"
                className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-[#14a800]/20 focus:outline-none focus:ring-4 focus:ring-[#14a800]/10 font-medium text-zinc-900 resize-none"
              ></textarea>
              {formError && <p className="mt-2 text-sm font-semibold text-red-600">{formError}</p>}
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#14a800]/5 border border-[#14a800]/20 rounded-xl mb-8">
              <Heart className="w-5 h-5 text-[#14a800] shrink-0" />
              <div className="text-sm font-medium text-[#14a800]">
                You can add this freelancer to your favorites list after submitting the review, making it easy to re-hire them in the future.
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/find-work/my-posted-work')} 
                className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors"
              >
                Skip for now
              </button>
              <button 
                type="submit" 
                disabled={rating === 0 || createReview.isPending}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${rating > 0 ? 'bg-[#14a800] hover:bg-[#118a00] text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                {createReview.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default RatingReview;
