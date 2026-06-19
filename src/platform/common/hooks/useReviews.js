import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewAPI } from '../services/api';
import { useAuthStore } from '../authStore';
import notify from '../utils/notify';

function normalizeReviews(res) {
  return res?.reviews || res?.data || (Array.isArray(res) ? res : []);
}

export function useMyReceivedReviews(userId) {
  const { user } = useAuthStore();
  const id = userId || user?.id;
  return useQuery({
    queryKey: ['reviews', 'received', id],
    queryFn: async () => {
      if (!id) return [];
      const res = await reviewAPI.getReceived(id);
      return normalizeReviews(res);
    },
    enabled: Boolean(id),
  });
}

export function useFreelancerPublicReviews(freelancerId) {
  return useQuery({
    queryKey: ['reviews', 'freelancer', freelancerId],
    queryFn: async () => {
      const res = await reviewAPI.getFreelancerReviews(freelancerId);
      return normalizeReviews(res);
    },
    enabled: Boolean(freelancerId),
  });
}

export function usePlatformReviews() {
  return useQuery({
    queryKey: ['reviews', 'platform'],
    queryFn: async () => {
      const { publicAPI } = await import('../services/api');
      const res = await publicAPI.getPlatformReviews();
      return normalizeReviews(res);
    },
    staleTime: 120_000,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => reviewAPI.createReview(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      notify.success('Review submitted');
    },
    onError: (e) => notify.error(e.message || 'Failed to submit review'),
  });
}

export function useReplyToReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reply }) => reviewAPI.replyToReview(reviewId, reply),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      notify.success('Reply posted');
    },
    onError: (e) => notify.error(e.message || 'Failed to post reply'),
  });
}
