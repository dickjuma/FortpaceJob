/**
 * ============================================================
 * CLIENT API SERVICE LAYER
 * All real API calls for the Client portal — no mock data.
 * ============================================================
 */

import { messagingAPI } from '../../platform/common/services/messagingApi';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
const getToken = () =>
  localStorage.getItem('accessToken') ||
  localStorage.getItem('token') ||
  (() => {
    try { return JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token; } catch { return null; }
  })();

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  let body;
  try { body = await res.json(); } catch { body = {}; }

  if (!res.ok) {
    const msg = body?.message || body?.error || `HTTP ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, data: body });
  }
  return body;
}

const list = (d) => (Array.isArray(d) ? d : []);
const unwrap = (r) => r?.data ?? r;
const unwrapList = (r) => list(r?.data ?? r?.items ?? r?.results ?? r);
const unwrapPaged = (r) => ({
  items: list(r?.data?.items ?? r?.data ?? r?.items ?? r?.results ?? []),
  total: r?.data?.total ?? r?.total ?? 0,
  page: r?.data?.page ?? r?.page ?? 1,
  totalPages: r?.data?.totalPages ?? r?.totalPages ?? 1,
  meta: r?.meta ?? null,
});

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export async function getClientDashboardStats() {
  const [contractsRes, jobsRes, walletRes, notifRes] = await Promise.allSettled([
    apiFetch('/profilesystem/client/contracts?limit=100'),
    apiFetch('/profilesystem/client/jobs?limit=100'),
    apiFetch('/escrow_wallet/wallet'),
    apiFetch('/notifications?limit=5&unread=true'),
  ]);

  const contracts = unwrapList(contractsRes.value);
  const jobs = unwrapList(jobsRes.value);
  const wallet = unwrap(walletRes.value) || {};
  const notifications = unwrapList(notifRes.value);

  return {
    overview: {
      totalJobs: jobs.length,
      openJobs: jobs.filter((j) => j.status === 'OPEN').length,
      totalSpent: contracts.reduce((s, c) => s + (Number(c.totalAmount) || 0), 0),
      pendingProposals: jobs.reduce((s, j) => s + (j.proposals?.length || 0), 0),
    },
    contracts: {
      active: contracts.filter((c) => c.status === 'ACTIVE').length,
      completed: contracts.filter((c) => c.status === 'COMPLETED').length,
      pending: contracts.filter((c) => c.status === 'PENDING').length,
    },
    wallet,
    recentJobs: jobs.slice(0, 5),
    recentContracts: contracts.slice(0, 5),
    notifications,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// JOBS
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyJobs(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/profilesystem/client/jobs?${qs}`);
  return unwrapPaged(r);
}

export async function getJobDetails(jobId) {
  const r = await apiFetch(`/jobs/${jobId}`);
  return unwrap(r);
}

export async function createJob(payload) {
  const r = await apiFetch('/jobs', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function updateJob(jobId, payload) {
  const r = await apiFetch(`/jobs/${jobId}`, { method: 'PATCH', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function deleteJob(jobId) {
  return apiFetch(`/jobs/${jobId}`, { method: 'DELETE' });
}

export async function cancelJob(jobId) {
  return apiFetch(`/jobs/${jobId}/cancel`, { method: 'POST' });
}

export async function closeJob(jobId) {
  return apiFetch(`/jobs/${jobId}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'CLOSED' }) });
}

export async function getJobBids(jobId, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const r = await apiFetch(`/jobs/${jobId}/bids?${qs}`);
  return unwrapPaged(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// PROPOSALS (received on client's jobs)
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyProposals(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/profilesystem/client/proposals?${qs}`);
  return unwrapPaged(r);
}

export async function getProposalsForJob(jobId, params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/proposals/job/${jobId}?${qs}`);
  return unwrapPaged(r);
}

export async function getProposalDetails(proposalId) {
  const r = await apiFetch(`/proposals/${proposalId}`);
  return unwrap(r);
}

export async function acceptProposal(proposalId) {
  const r = await apiFetch(`/proposals/${proposalId}/accept`, { method: 'PATCH' });
  return unwrap(r);
}

export async function rejectProposal(proposalId, reason = '') {
  const r = await apiFetch(`/proposals/${proposalId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
  return unwrap(r);
}

export async function shortlistProposal(proposalId) {
  const r = await apiFetch(`/proposals/${proposalId}/shortlist`, { method: 'PATCH' });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// CONTRACTS
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyContracts(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/profilesystem/client/contracts?${qs}`);
  return unwrapPaged(r);
}

export async function getContractDetails(contractId) {
  const r = await apiFetch(`/contracts/${contractId}`);
  return unwrap(r);
}

export async function createContract(payload) {
  const r = await apiFetch('/contracts', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function signContract(contractId) {
  const r = await apiFetch(`/contracts/${contractId}/sign`, { method: 'PATCH' });
  return unwrap(r);
}

export async function terminateContract(contractId, reason) {
  const r = await apiFetch(`/contracts/${contractId}/terminate`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
  return unwrap(r);
}

export async function cancelContract(contractId, reason = '') {
  const r = await apiFetch(`/contracts/${contractId}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
  return unwrap(r);
}

// ── Milestones ────────────────────────────────────────────────────────────────
export async function getContractMilestones(contractId) {
  const r = await apiFetch(`/contracts/${contractId}/milestones`);
  return unwrapList(r);
}

export async function addMilestone(contractId, payload) {
  const r = await apiFetch(`/contracts/${contractId}/milestones`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap(r);
}

export async function approveMilestone(contractId, milestoneId) {
  const r = await apiFetch(`/contracts/${contractId}/milestones/${milestoneId}/approve`, { method: 'PATCH' });
  return unwrap(r);
}

export async function rejectMilestone(contractId, milestoneId, feedback) {
  const r = await apiFetch(`/contracts/${contractId}/milestones/${milestoneId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ feedback }),
  });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// WALLET & FINANCES
// ══════════════════════════════════════════════════════════════════════════════
export async function getWallet() {
  const r = await apiFetch('/escrow_wallet/wallet');
  return unwrap(r);
}

export async function getTransactions(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/escrow_wallet/wallet/transactions?${qs}`);
  return unwrapPaged(r);
}

export async function getEscrowDetails(contractId) {
  const r = await apiFetch(`/escrow_wallet/escrow/${contractId}`);
  return unwrap(r);
}

export async function fundEscrow(contractId, milestoneId) {
  const r = await apiFetch(`/escrow_wallet/escrow/${contractId}/fund`, {
    method: 'POST',
    body: JSON.stringify({ milestoneId }),
  });
  return unwrap(r);
}

export async function releaseEscrow(contractId, milestoneId) {
  const r = await apiFetch(`/escrow_wallet/escrow/${contractId}/release`, {
    method: 'POST',
    body: JSON.stringify({ milestoneId }),
  });
  return unwrap(r);
}

export async function depositToWallet(payload) {
  const url = payload.provider === 'MPESA' 
    ? '/escrow_wallet/wallet/mpesa/deposit' 
    : '/escrow_wallet/wallet/deposit';
    
  const body = payload.provider === 'MPESA' 
    ? JSON.stringify({ amount: payload.amount, phoneNumber: payload.phone })
    : JSON.stringify(payload);

  const r = await apiFetch(url, {
    method: 'POST',
    body,
  });
  return unwrap(r);
}

export async function withdrawFromWallet(payload) {
  const r = await apiFetch('/escrow_wallet/withdrawal', {
    method: 'POST',
    body: JSON.stringify({
      amount: payload.amount,
      phoneNumber: payload.phone || payload.phoneNumber,
      provider: payload.provider || 'MPESA'
    }),
  });
  return unwrap(r);
}

export async function getInvoices(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/billing/invoices?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

export async function payInvoice(invoiceId) {
  const r = await apiFetch(`/billing/invoices/${invoiceId}/pay`, { method: 'POST' });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// TALENT SEARCH
// ══════════════════════════════════════════════════════════════════════════════
export async function searchFreelancers(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/profilesystem/search/freelancers?${qs}`);
  return unwrapPaged(r);
}

export async function getFreelancerProfile(userId) {
  const r = await apiFetch(`/profilesystem/profile/${userId}`);
  return unwrap(r);
}

export async function searchGigs(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/gigs?${qs}`);
  return unwrapPaged(r);
}

export async function getGigDetails(gigId) {
  const r = await apiFetch(`/gigs/${gigId}`);
  return unwrap(r);
}

export async function orderGig(gigId, payload) {
  const r = await apiFetch(`/gigs/${gigId}/order`, { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

// ── Shortlist / Favourites ────────────────────────────────────────────────────
export async function getShortlist(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/profilesystem/client/shortlist?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

export async function addToShortlist(freelancerId) {
  const r = await apiFetch('/profilesystem/client/shortlist', {
    method: 'POST',
    body: JSON.stringify({ freelancerId }),
  });
  return unwrap(r);
}

export async function removeFromShortlist(freelancerId) {
  return apiFetch(`/profilesystem/client/shortlist/${freelancerId}`, { method: 'DELETE' });
}

// ══════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyReviews(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/reviews/given?${qs}`);
  return unwrapPaged(r);
}

export async function getReviewsReceived(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/reviews/received?${qs}`);
  return unwrapPaged(r);
}

export async function submitReview(payload) {
  const r = await apiFetch('/reviews', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function updateReview(reviewId, payload) {
  const r = await apiFetch(`/reviews/${reviewId}`, { method: 'PATCH', body: JSON.stringify(payload) });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// DISPUTES
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyDisputes(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/disputes/my?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

export async function getDisputeDetails(disputeId) {
  const r = await apiFetch(`/disputes/${disputeId}`);
  return unwrap(r);
}

export async function openDispute(payload) {
  const r = await apiFetch('/disputes', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function submitDisputeEvidence(disputeId, payload) {
  const r = await apiFetch(`/disputes/${disputeId}/evidence`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap(r);
}

export async function acceptDisputeResolution(disputeId) {
  const r = await apiFetch(`/disputes/${disputeId}/accept`, { method: 'PATCH' });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT / MESSAGES (unified messaging API)
// ══════════════════════════════════════════════════════════════════════════════
export async function getConversations(params = {}) {
  return messagingAPI.getConversations(params);
}

export async function getConversation(conversationId) {
  return messagingAPI.getConversations({ conversationId });
}

export async function getMessages(conversationId, params = {}) {
  return messagingAPI.getMessages(conversationId, params);
}

export async function sendMessage(conversationId, content, type = 'TEXT') {
  return messagingAPI.sendMessage(conversationId, content, type);
}

export async function startConversation(payload) {
  return messagingAPI.startConversation(payload);
}

export async function markMessagesRead(conversationId) {
  return messagingAPI.markRead(conversationId);
}

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════
export async function getNotifications(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/notifications?${qs}`);
  return unwrapPaged(r);
}

export async function markNotificationRead(notificationId) {
  return apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead() {
  return apiFetch('/notifications/read-all', { method: 'PATCH' });
}

export async function getUnreadCount() {
  const r = await apiFetch('/notifications/unread-count');
  return r?.count ?? r?.data?.count ?? 0;
}

// ══════════════════════════════════════════════════════════════════════════════
// SKILL ASSESSMENTS
// ══════════════════════════════════════════════════════════════════════════════
export async function getSkillTests() {
  const r = await apiFetch('/profilesystem/skill-tests/tests').catch(() => ({ data: [] }));
  const payload = r?.data?.tests ?? r?.tests ?? (Array.isArray(r?.data) ? r?.data : []);
  return unwrapList(payload);
}

export async function getSkillTestResults() {
  const r = await apiFetch('/profilesystem/skill-tests/results').catch(() => ({ data: [] }));
  const payload = Array.isArray(r?.data) ? r?.data : (Array.isArray(r) ? r : []);
  return unwrapList(payload);
}

// ══════════════════════════════════════════════════════════════════════════════
// REFERRALS / AFFILIATES
// ══════════════════════════════════════════════════════════════════════════════
export async function getReferralSummary() {
  const r = await apiFetch('/profilesystem/referrals/summary').catch(() => ({}));
  return unwrap(r) || {};
}

// ══════════════════════════════════════════════════════════════════════════════
// NDA / ACTIVITY / AUDIT (client-visible derived views)
// ══════════════════════════════════════════════════════════════════════════════
export async function getNdaDocuments(params = {}) {
  const [jobsRes, contractsRes] = await Promise.allSettled([
    getMyJobs({ limit: params.limit || 50 }),
    getMyContracts({ limit: params.limit || 50 }),
  ]);

  const jobs = unwrapList(jobsRes.value);
  const contracts = unwrapList(contractsRes.value);
  const items = [
    ...jobs
      .filter((job) => job.requiresNDA || job.ndaRequired)
      .map((job) => ({
        id: `job-nda-${job.id}`,
        type: 'JOB_REQUIREMENT',
        title: job.title || 'Project NDA Requirement',
        status: job.status || 'OPEN',
        counterpart: job.freelancer?.user?.name || job.freelancer?.name || 'Shortlisted candidates',
        createdAt: job.createdAt,
        source: 'job',
        job,
      })),
    ...contracts
      .filter((contract) => contract.requiresNDA || contract.ndaRequired || contract.ndaSigned)
      .map((contract) => ({
        id: `contract-nda-${contract.id}`,
        type: contract.ndaSigned ? 'SIGNED' : 'PENDING_SIGNATURE',
        title: contract.title || 'Contract NDA',
        status: contract.status || 'PENDING',
        counterpart: contract.freelancer?.user?.name || contract.freelancer?.name || 'Freelancer',
        createdAt: contract.createdAt,
        source: 'contract',
        contract,
      })),
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    items,
    total: items.length,
    page: 1,
    totalPages: items.length ? 1 : 0,
  };
}

export async function getWorkspaceActivityLog(params = {}) {
  const limit = Number(params.limit || 100);
  const [jobsRes, contractsRes, ordersRes, notificationsRes] = await Promise.allSettled([
    getMyJobs({ limit: 50 }),
    getMyContracts({ limit: 50 }),
    getMyOrders({ limit: 50 }),
    getNotifications({ limit: 50 }),
  ]);

  const jobs = unwrapList(jobsRes.value);
  const contracts = unwrapList(contractsRes.value);
  const orders = unwrapList(ordersRes.value);
  const notifications = unwrapList(notificationsRes.value);
  const events = [
    ...jobs.map((job) => ({
      id: `job-${job.id}-${job.status}`,
      action: job.status === 'OPEN' ? 'JOB_PUBLISHED' : `JOB_${job.status || 'UPDATED'}`,
      entity: 'JOB',
      title: job.title || 'Project updated',
      description: `Project moved to ${job.status || 'updated'}.`,
      createdAt: job.createdAt || job.updatedAt,
      source: 'job',
    })),
    ...contracts.map((contract) => ({
      id: `contract-${contract.id}-${contract.status}`,
      action: `CONTRACT_${contract.status || 'UPDATED'}`,
      entity: 'CONTRACT',
      title: contract.title || 'Contract updated',
      description: `Contract status is ${contract.status || 'active'}.`,
      createdAt: contract.createdAt || contract.updatedAt,
      source: 'contract',
    })),
    ...orders.map((order) => ({
      id: `order-${order.id}-${order.status}`,
      action: `ORDER_${order.status || 'UPDATED'}`,
      entity: 'ORDER',
      title: order.gig?.title || order.title || 'Gig order updated',
      description: `Order status is ${order.status || 'active'}.`,
      createdAt: order.createdAt || order.updatedAt,
      source: 'order',
    })),
    ...notifications.map((notification) => ({
      id: `notification-${notification.id}`,
      action: notification.type || notification.category || 'NOTIFICATION',
      entity: 'NOTIFICATION',
      title: notification.title || 'Notification received',
      description: notification.message || notification.body || '',
      createdAt: notification.createdAt || notification.created_at,
      source: 'notification',
    })),
  ]
    .filter((event) => event.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return {
    items: events,
    total: events.length,
    page: 1,
    totalPages: events.length ? 1 : 0,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENT PROFILE
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyProfile() {
  const r = await apiFetch('/profilesystem/client/me');
  return unwrap(r);
}

export async function updateMyProfile(payload) {
  const r = await apiFetch('/profilesystem/client/profile', { method: 'PATCH', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function updateCompanyProfile(payload) {
  const r = await apiFetch('/profilesystem/client/company', { method: 'PATCH', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function uploadAvatar(formData) {
  const token = getToken();
  const r = await fetch(`${BASE}/profilesystem/profile/avatar`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const body = await r.json();
  if (!r.ok) throw new Error(body?.message || 'Upload failed');
  return body?.data ?? body;
}

// ══════════════════════════════════════════════════════════════════════════════
// SUPPORT
// ══════════════════════════════════════════════════════════════════════════════
export async function getSupportTickets(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/support/tickets?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

export async function getSupportTicket(ticketId) {
  const r = await apiFetch(`/support/tickets/${ticketId}`);
  return unwrap(r);
}

export async function createSupportTicket(payload) {
  const r = await apiFetch('/support/tickets', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function replySupportTicket(ticketId, message) {
  const r = await apiFetch(`/support/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body: message }),
  });
  return unwrap(r);
}

export async function closeSupportTicket(ticketId) {
  const r = await apiFetch(`/support/tickets/${ticketId}/close`, { method: 'PATCH' });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
export async function getClientAnalytics(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const r = await apiFetch(`/analytics/client?${qs}`).catch(() => ({}));
  return unwrap(r) || {};
}

export async function getSpendingAnalytics(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const r = await apiFetch(`/analytics/client/spending?${qs}`).catch(() => ({}));
  return unwrap(r) || {};
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS (Gig orders)
// ══════════════════════════════════════════════════════════════════════════════
export async function getMyOrders(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/orders/my?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

export async function getOrderDetails(orderId) {
  const r = await apiFetch(`/orders/${orderId}`);
  return unwrap(r);
}

export async function requestOrderRevision(orderId, payload) {
  const r = await apiFetch(`/orders/${orderId}/revision`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap(r);
}

export async function approveOrderDelivery(orderId) {
  const r = await apiFetch(`/orders/${orderId}/complete`, { method: 'PATCH' });
  return unwrap(r);
}

export async function cancelOrder(orderId, reason = '') {
  const r = await apiFetch(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
  return unwrap(r);
}

export async function disputeOrder(orderId, payload) {
  const r = await apiFetch(`/orders/${orderId}/dispute`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT FREELANCER
// ══════════════════════════════════════════════════════════════════════════════
export async function reportFreelancer(payload) {
  const r = await apiFetch('/disputes', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// HIRING & INTERVIEW
// ══════════════════════════════════════════════════════════════════════════════
export async function getHiringPipeline(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/hiring/pipeline?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

export async function scheduleInterview(payload) {
  const r = await apiFetch('/hiring/interviews', { method: 'POST', body: JSON.stringify(payload) });
  return unwrap(r);
}

export async function getInterviews(params = {}) {
  const qs = new URLSearchParams({ limit: 20, ...params }).toString();
  const r = await apiFetch(`/hiring/interviews?${qs}`).catch(() => ({ data: [] }));
  return unwrapPaged(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// BILLING / SUBSCRIPTION
// ══════════════════════════════════════════════════════════════════════════════
export async function getMySubscription() {
  const r = await apiFetch('/subscriptions/me').catch(() => ({}));
  return unwrap(r) || {};
}

export async function getSubscriptionPlans() {
  const r = await apiFetch('/subscriptions/plans').catch(() => ({ data: [] }));
  return unwrapList(r);
}

export async function upgradeSubscription(plan) {
  const r = await apiFetch('/subscriptions/subscribe', {
    method: 'POST',
    body: JSON.stringify({ planId: plan }),
  });
  return unwrap(r);
}

// ══════════════════════════════════════════════════════════════════════════════
// TEAM MEMBERS (SME / CORPORATE)
// ══════════════════════════════════════════════════════════════════════════════
export async function getClientTeamMembers() {
  const r = await apiFetch('/profilesystem/client/team');
  return unwrapList(r);
}

export async function inviteTeamMember(payload) {
  const r = await apiFetch('/profilesystem/client/team', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap(r);
}

export async function removeTeamMember(memberId) {
  return apiFetch(`/profilesystem/client/team/${memberId}`, { method: 'DELETE' });
}

export async function getClientPublicProfile(id) { return apiFetch(`/profilesystem/client/public/${id}`); }

export async function inviteFreelancer(jobId, payload) { return apiFetch(`/jobs/${jobId}/invite`, { method: 'POST', body: JSON.stringify(payload) }); }
