import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionAPI } from '../services/subscriptionApi';
import toast from 'react-hot-toast';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: () => subscriptionAPI.getPlans(),
    staleTime: 60_000,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['subscriptions', 'me'],
    queryFn: () => subscriptionAPI.getMySubscription(),
    staleTime: 30_000,
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, paymentMethod, phoneNumber }) =>
      subscriptionAPI.subscribe(planId, { paymentMethod, phoneNumber }),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      if (variables.planId === 'basic') {
        toast.success('You are on the Basic plan');
      } else if (!data?.checkoutRequestId) {
        toast.success('Subscription active');
      }
    },
    onError: (err) => toast.error(err.message || 'Subscription failed'),
  });
}

/** Poll M-Pesa subscription checkout until completed or timeout */
export function useMpesaSubscriptionPoll(checkoutRequestId, { onSuccess, onTimeout } = {}) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!checkoutRequestId) return undefined;

    let attempts = 0;
    const maxAttempts = 24;

    const tick = async () => {
      attempts += 1;
      try {
        const status = await subscriptionAPI.getMpesaSubscriptionStatus(checkoutRequestId);
        if (status?.status === 'COMPLETED') {
          qc.invalidateQueries({ queryKey: ['subscriptions'] });
          onSuccess?.(status);
          return true;
        }
      } catch {
        /* retry */
      }
      if (attempts >= maxAttempts) {
        onTimeout?.();
        return true;
      }
      return false;
    };

    const id = setInterval(async () => {
      const done = await tick();
      if (done) clearInterval(id);
    }, 3000);

    tick();

    return () => clearInterval(id);
  }, [checkoutRequestId, qc, onSuccess, onTimeout]);
}

export function useUnlockRecommendations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (limit) => subscriptionAPI.unlockRecommendedFeed(limit),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions', 'me'] }),
    onError: (err) => toast.error(err.message || 'Could not unlock recommendations'),
  });
}
