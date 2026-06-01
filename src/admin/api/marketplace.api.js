import apiClient, { unwrapAdminResponse } from './apiClient.js';

const normalizeListResponse = (response) => {
  const { data, meta } = unwrapAdminResponse(response);
  const list = Array.isArray(data) ? data : [];

  return {
    data: list,
    total: meta?.total ?? list.length,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? list.length,
    totalPages: meta?.totalPages ?? 1,
  };
};

export async function fetchMarketplaceStats() {
  const [jobs, gigs, proposals] = await Promise.all([
    fetchJobs({ limit: 1 }),
    fetchGigs({ limit: 1 }),
    fetchProposals({ limit: 1 }),
  ]);

  return {
    jobs: {
      total: jobs.total,
      active: null,
      inProgress: null,
      completed: null,
      flagged: null,
    },
    gigs: {
      total: gigs.total,
      active: null,
      delisted: null,
      flagged: null,
    },
    proposals: {
      total: proposals.total,
      submitted: null,
      underReview: null,
      shortlisted: null,
      accepted: null,
    },
    contracts: {
      total: null,
      active: null,
      inProgress: null,
      completed: null,
    },
    reviews: {
      total: null,
      pending: null,
      verified: null,
      flagged: null,
      avgRating: null,
    },
    marketplace: {
      totalValue: null,
      averageJobBudget: null,
      proposalAcceptanceRate: null,
      contractCompletionRate: null,
    },
  };
}

export async function fetchJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/marketplace/jobs${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchGigs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/marketplace/gigs${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchProposals(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/marketplace/proposals${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchContracts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/marketplace/contracts${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

const PUBLIC_API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function readAdminToken() {
  return (
    localStorage.getItem('admin-token') ||
    localStorage.getItem('accessToken') ||
    null
  );
}

export async function fetchReviews(params = {}) {
  const query = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 20,
    ...(params.status ? { status: params.status } : {}),
    ...(params.search ? { search: params.search } : {}),
  }).toString();
  const token = readAdminToken();
  const res = await fetch(`${PUBLIC_API_BASE}/reviews/admin/list?${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Failed to load reviews');
  const payload = body.data ?? body;
  const list = Array.isArray(payload?.data) ? payload.data : [];
  return {
    data: list,
    total: payload.total ?? list.length,
    page: payload.page ?? 1,
    limit: payload.limit ?? list.length,
    totalPages: payload.totalPages ?? 1,
  };
}

export async function moderateReview(reviewId, { action, reason } = {}) {
  const token = readAdminToken();
  const res = await fetch(`${PUBLIC_API_BASE}/reviews/admin/${reviewId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, reason }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Moderation failed');
  return body.data ?? body;
}

export async function approveJob(jobId, data = {}) {
  const response = await apiClient.patch(`/marketplace/jobs/${jobId}/approve`, data);
  return unwrapAdminResponse(response).data;
}

export async function rejectJob(jobId, data = {}) {
  const response = await apiClient.patch(`/marketplace/jobs/${jobId}/reject`, data);
  return unwrapAdminResponse(response).data;
}

export async function approveGig(gigId) {
  const response = await apiClient.patch(`/marketplace/gigs/${gigId}/approve`);
  return unwrapAdminResponse(response).data;
}

export async function removeGig(gigId, data = {}) {
  const response = await apiClient.patch(`/marketplace/gigs/${gigId}/remove`, data);
  return unwrapAdminResponse(response).data;
}

export async function resolveFlaggedContent(contentId, data) {
  if (data?.type === 'review' || !data?.type) {
    const action =
      data?.action === 'REMOVE' ? 'REMOVE' : data?.action === 'FLAG' ? 'FLAG' : 'VERIFY';
    return moderateReview(contentId, { action, reason: data?.reason });
  }
  const response = await apiClient.patch(`/marketplace/content/${contentId}/resolve`, data);
  return unwrapAdminResponse(response).data;
}
