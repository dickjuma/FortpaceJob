const PUBLIC_API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const readAdminToken = () =>
  localStorage.getItem('admin-token') ||
  localStorage.getItem('accessToken') ||
  null;

const request = async (path, options = {}) => {
  const token = readAdminToken();
  const response = await fetch(`${PUBLIC_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || 'Request failed');
  if (body.success === false) throw new Error(body.message || body.error || 'Request failed');
  return body;
};

const normalizeListPayload = (payload, listKey = 'data') => {
  const list = Array.isArray(payload?.[listKey]) ? payload[listKey] : [];
  const meta = payload?.meta || payload?.pagination || payload || {};

  return {
    data: list,
    total: Number(meta.total ?? meta.count ?? list.length),
    page: Number(meta.page ?? 1),
    limit: Number((meta.limit ?? list.length) || 20),
    totalPages: Number(meta.totalPages ?? meta.pages ?? Math.max(1, Math.ceil(list.length / Number((meta.limit ?? list.length) || 20)))),
  };
};

const qs = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString();
};

export async function fetchMarketplaceStats() {
  const [jobs, gigs, orders, reviews] = await Promise.all([
    fetchJobs({ limit: 1 }),
    fetchGigs({ limit: 1 }),
    fetchOrders({ limit: 1 }),
    fetchReviews({ limit: 1 }),
  ]);

  const completedOrders = orders.data.filter((order) => order.status === 'COMPLETED');
  const refundedOrders = orders.data.filter((order) => order.status === 'REFUNDED');

  return {
    jobs: {
      total: jobs.total,
      active: jobs.data.filter((job) => ['OPEN', 'PENDING', 'ASSIGNED'].includes(job.status)).length,
      inProgress: jobs.data.filter((job) => ['IN_PROGRESS', 'ASSIGNED'].includes(job.status)).length,
      completed: jobs.data.filter((job) => ['COMPLETED', 'CLOSED'].includes(job.status)).length,
      flagged: jobs.data.filter((job) => job.flagged || job.reviewStatus === 'FLAGGED').length,
    },
    gigs: {
      total: gigs.total,
      active: gigs.data.filter((gig) => ['ACTIVE', 'PUBLISHED', 'PENDING'].includes(gig.status)).length,
      delisted: gigs.data.filter((gig) => ['SUSPENDED', 'REJECTED', 'DELISTED'].includes(gig.status)).length,
      flagged: gigs.data.filter((gig) => gig.flagged || gig.reviewStatus === 'FLAGGED').length,
    },
    orders: {
      total: orders.total,
      active: orders.data.filter((order) => ['PENDING', 'ACTIVE', 'REVISION', 'DELIVERED'].includes(order.status)).length,
      completed: completedOrders.length,
      disputed: orders.data.filter((order) => order.status === 'DISPUTED').length,
      refunded: refundedOrders.length,
      totalValue: completedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
    },
    proposals: {
      total: null,
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
      total: reviews.total,
      pending: reviews.data.filter((review) => review.status === 'PENDING').length,
      verified: reviews.data.filter((review) => review.status === 'VERIFIED' || review.status === 'verified').length,
      flagged: reviews.data.filter((review) => review.status === 'FLAGGED' || review.status === 'flagged' || review.flagged).length,
      avgRating: reviews.data.length
        ? reviews.data.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.data.length
        : 0,
    },
    marketplace: {
      totalValue: completedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
      averageJobBudget: null,
      proposalAcceptanceRate: null,
      contractCompletionRate: null,
    },
  };
}

export async function fetchJobs(params = {}) {
  const response = await request(`/jobs/admin/all?${qs(params)}`);
  return normalizeListPayload(response);
}

export async function fetchGigs(params = {}) {
  const response = await request(`/gigs/admin/all?${qs(params)}`);
  return normalizeListPayload(response);
}

export async function fetchOrders(params = {}) {
  const response = await request(`/orders/admin/all?${qs(params)}`);
  return normalizeListPayload(response);
}

export async function fetchProposals(params = {}) {
  const response = await request(`/proposals/admin/all?${qs(params)}`);
  return normalizeListPayload(response);
}

export async function fetchContracts(params = {}) {
  const response = await request(`/contracts/admin/all?${qs(params)}`);
  return normalizeListPayload(response);
}

export async function fetchReviews(params = {}) {
  const response = await request(`/reviews/admin/list?${qs({
    page: params.page || 1,
    limit: params.limit || 20,
    ...(params.status ? { status: params.status } : {}),
    ...(params.search ? { search: params.search } : {}),
  })}`);
  return normalizeListPayload(response);
}

export async function moderateReview(reviewId, { action, reason } = {}) {
  const actionMap = {
    ALLOW: 'VERIFY',
    VERIFY: 'VERIFY',
    REMOVE: 'REMOVE',
    FLAG: 'FLAG',
  };
  return request(`/reviews/admin/${reviewId}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: actionMap[action] || action || 'VERIFY', reason }),
  });
}

export async function approveJob(jobId) {
  return request(`/jobs/admin/${jobId}/feature`, { method: 'POST' });
}

export async function rejectJob(jobId, data = {}) {
  return request(`/jobs/admin/${jobId}/intervene`, {
    method: 'POST',
    body: JSON.stringify({ action: 'REJECT', notes: data.reason || data.notes }),
  });
}

export async function forceJobStatus(jobId, status, reason) {
  return request(`/jobs/admin/${jobId}/force-status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });
}

export async function approveGig(gigId) {
  return request(`/gigs/admin/${gigId}/approve`, { method: 'POST' });
}

export async function removeGig(gigId, data = {}) {
  return request(`/gigs/admin/${gigId}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason: data.reason }),
  });
}

export async function flagGig(gigId, reason) {
  return request(`/gigs/admin/${gigId}/flag`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export async function featureGig(gigId) {
  return request(`/gigs/admin/${gigId}/feature`, { method: 'POST' });
}

export async function unfeatureGig(gigId) {
  return request(`/gigs/admin/${gigId}/unfeature`, { method: 'POST' });
}

export async function refundOrder(orderId, reason) {
  return request(`/orders/admin/${orderId}/refund`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function resolveFlaggedContent(contentId, data) {
  if (data?.type === 'review' || !data?.type) {
    return moderateReview(contentId, { action: data?.action, reason: data?.reason });
  }
  if (data?.type === 'gig') {
    return data.action === 'REMOVE' ? removeGig(contentId, data) : flagGig(contentId, data.reason);
  }
  if (data?.type === 'job') {
    return data.action === 'REMOVE'
      ? rejectJob(contentId, data)
      : request(`/jobs/admin/${contentId}/intervene`, {
          method: 'POST',
          body: JSON.stringify({ action: data.action || 'FLAG', notes: data.reason }),
        });
  }
  if (data?.type === 'order' && data.action === 'REFUND') {
    return refundOrder(contentId, data.reason);
  }
  throw new Error('Unsupported marketplace content type.');
}
