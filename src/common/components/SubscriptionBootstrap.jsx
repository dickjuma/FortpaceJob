import { useEffect } from 'react';
import { useAuthStore } from '../authStore';
import { subscriptionAPI } from '../services/subscriptionApi';

/**
 * Ensures every authenticated freelancer has a Basic subscription record on the backend.
 */
export default function SubscriptionBootstrap() {
  const { isAuthenticated, user } = useAuthStore();
  const role = String(user?.role || '').toUpperCase();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (role !== 'FREELANCER' && role !== 'FREELANCE') return;

    subscriptionAPI.getMySubscription().catch(() => {
      /* non-blocking — pricing page will retry */
    });
  }, [isAuthenticated, role, user?.id]);

  return null;
}
