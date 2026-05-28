import React, { useEffect, useState } from 'react';
import { reviewAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadReviews(user.id);
    }
  }, [user]);

  const loadReviews = async (userId) => {
    try {
      const data = await reviewAPI.getReviews(userId);
      setReviews(data.reviews || data.data || []);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading reviews...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Reviews</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            You don't have any reviews yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.map(review => (
              <li key={review.id} className="p-6 hover:bg-surface dark:hover:bg-surface-dark transition-colors">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="font-medium dark:text-white">{review.rating} / 5</span>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">"{review.comment}"</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Reviewed by {review.reviewer?.firstName} {review.reviewer?.lastName} on {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
