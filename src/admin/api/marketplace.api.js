import apiClient, { unwrapAdminResponse } from './apiClient';

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
  const response = await apiClient.get(`/disputes${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchReviews(params = {}) {
  const query = new URLSearchParams({ ...params, status: params.status || 'flagged' }).toString();
  const response = await apiClient.get(`/marketplace/content/flagged${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
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
  const response = await apiClient.patch(`/marketplace/content/${contentId}/resolve`, data);
  return unwrapAdminResponse(response).data;
}
