import { API_BASE_URL, getToken } from './api';

const base = '/subscriptions';

async function subClient(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Subscription request failed');
  return data.data !== undefined ? data.data : data;
}

export const subscriptionAPI = {
  getPlans: () => subClient(`${base}/plans`),
  getPublicSettings: () => subClient(`${base}/settings/public`),
  getMySubscription: () => subClient(`${base}/me`),
  subscribe: (planId, { paymentMethod = 'mpesa', phoneNumber } = {}) =>
    subClient(`${base}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod, phoneNumber }),
    }),
  useQuota: (type) =>
    subClient(`${base}/use-quota`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),
  unlockRecommendedFeed: (limit) =>
    subClient(`${base}/recommended-feed${limit ? `?limit=${limit}` : ''}`),
  getMpesaSubscriptionStatus: (checkoutRequestId) =>
    subClient(`${base}/mpesa/status/${checkoutRequestId}`),
};

export const subscriptionAdminAPI = {
  getSettings: async () => {
    const { default: axios } = await import('axios');
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const token =
      localStorage.getItem('admin-token') ||
      localStorage.getItem('accessToken');
    const res = await axios.get(`${API_BASE}/admin_rbc/subscriptions/settings`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data?.data ?? res.data;
  },
  updateSettings: async (subscriptionPaymentsEnabled) => {
    const { default: axios } = await import('axios');
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const token =
      localStorage.getItem('admin-token') ||
      localStorage.getItem('accessToken');
    const res = await axios.put(
      `${API_BASE}/admin_rbc/subscriptions/settings`,
      { subscriptionPaymentsEnabled },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data?.data ?? res.data;
  },
  listMembers: async () => {
    const { default: axios } = await import('axios');
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('admin-token') || localStorage.getItem('accessToken');
    const res = await axios.get(`${API_BASE}/admin_rbc/subscriptions/members`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data?.data ?? res.data;
  },
  activateUser: async (userId, planId) => {
    const { default: axios } = await import('axios');
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('admin-token') || localStorage.getItem('accessToken');
    const res = await axios.post(
      `${API_BASE}/admin_rbc/subscriptions/users/${userId}/activate`,
      { planId },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data?.data ?? res.data;
  },
};
