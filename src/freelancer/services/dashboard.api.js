import { getToken } from '../../platform/common/services/api.js';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'API request failed');
  }

  return response.json();
};

const normalizeList = (data) => Array.isArray(data) ? data : [];
const unwrapResponse = (response) => response.data || response;

// Dashboard stats - fetch from freelancer orders and gigs
export async function fetchFreelancerDashboardStats() {
  const response = await apiFetch('/profilesystem/freelancer/dashboard');
  return unwrapResponse(response);
}

export async function fetchFreelancerActiveOrders() {
  const response = await apiFetch('/profilesystem/freelancer/orders?status=ACTIVE');
  return normalizeList(unwrapResponse(response));
}

export async function fetchFreelancerRecentActivity() {
  const response = await apiFetch('/profilesystem/freelancer/activity?limit=10');
  return normalizeList(unwrapResponse(response));
}

export async function fetchFreelancerEarningsData() {
  const response = await apiFetch('/escrow_wallet/wallet');
  const wallet = unwrapResponse(response);
  return {
    totalEarnings: (wallet?.availableBalance || 0) + (wallet?.lockedBalance || 0),
    availableBalance: wallet?.availableBalance,
    lockedBalance: wallet?.lockedBalance,
    pendingBalance: wallet?.pendingBalance,
  };
}

export async function updateFreelancerAvailabilityStatus(status) {
  const response = await apiFetch('/profilesystem/freelancer/dashboard/availability', {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return unwrapResponse(response);
}