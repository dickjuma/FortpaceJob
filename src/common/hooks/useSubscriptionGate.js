import { useState, useCallback } from 'react';
import { subscriptionAPI } from '../services/subscriptionApi';
import { useMySubscription } from './useSubscription';

/**
 * Check quota and optionally consume before an action.
 * @returns {{ checkAndConsume, paywallOpen, closePaywall, paywallMeta, subscription }}
 */
export function useSubscriptionGate() {
  const { data: subscription, refetch } = useMySubscription();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallMeta, setPaywallMeta] = useState({ title: '', message: '', quotaType: 'gig_recommendation' });

  const openPaywall = (meta) => {
    setPaywallMeta(meta);
    setPaywallOpen(true);
  };

  const checkQuotaAvailable = useCallback(
    (type) => {
      if (!subscription) return true;
      if (type === 'gig_recommendation') {
        const left = subscription.remaining?.gigRecommendations;
        if (left === 0) {
          openPaywall({
            title: 'No recommendations left',
            message: `You've used all ${subscription.plan?.gigRecommendationsPerMonth} gig recommendations on your ${subscription.plan?.name} plan this month.`,
            quotaType: 'gig_recommendation',
          });
          return false;
        }
      }
      if (type === 'job_application') {
        const left = subscription.remaining?.jobApplications;
        if (left === 0) {
          openPaywall({
            title: 'Application limit reached',
            message: `You've used all ${subscription.plan?.jobApplicationsPerMonth} job applications on your ${subscription.plan?.name} plan this month.`,
            quotaType: 'job_application',
          });
          return false;
        }
      }
      return true;
    },
    [subscription]
  );

  const checkAndConsume = useCallback(
    async (type) => {
      if (!checkQuotaAvailable(type)) return false;
      try {
        await subscriptionAPI.useQuota(type);
        await refetch();
        return true;
      } catch (err) {
        if (err.message?.includes('limit') || err.message?.includes('Quota')) {
          openPaywall({
            title: 'Limit reached',
            message: err.message,
            quotaType: type,
          });
          return false;
        }
        throw err;
      }
    },
    [checkQuotaAvailable, refetch]
  );

  return {
    subscription,
    checkQuotaAvailable,
    checkAndConsume,
    paywallOpen,
    closePaywall: () => setPaywallOpen(false),
    paywallMeta,
  };
}
