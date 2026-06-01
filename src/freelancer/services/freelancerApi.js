/**
 * ============================================================
 * FREELANCER API SERVICE LAYER
 * All real API calls for the Freelancer portal — no mock data.
 * ============================================================
 */

import { messagingAPI } from '../../common/services/messagingApi';

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

export async function getFreelancerDashboardStats() {
  try {
    const res = await apiFetch('/profilesystem/freelancer/dashboard');
    return unwrap(res);
  } catch (error) {
    // Fallback or re-throw
    console.error('Failed to load freelancer dashboard stats:', error);
    throw error;
  }
}

export async function updateFreelancerGoals(goals) {
  return unwrap(await apiFetch('/profilesystem/freelancer/goals', {
    method: 'PATCH',
    body: JSON.stringify({ goals }),
  }));
}

export async function getFreelancerRecentActivity(params = { limit: 10 }) {
  const qs = new URLSearchParams(params).toString();
  return unwrapList(await apiFetch(`/profilesystem/freelancer/activity?${qs}`));
}

export async function getFreelancerActiveOrders(params = { limit: 10, status: 'ACTIVE' }) {
  const qs = new URLSearchParams(params).toString();
  return unwrapList(await apiFetch(`/profilesystem/freelancer/orders?${qs}`));
}

export async function updateFreelancerAvailability(status) {
  return unwrap(await apiFetch('/profilesystem/freelancer/dashboard/availability', {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// JOBS
// ══════════════════════════════════════════════════════════════════════════════

export async function getFreelancerJobs(params = { page: 1, limit: 10 }) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/search/find-work/feed?${qs}`));
}

export async function getFreelancerJobById(jobId) {
  return unwrap(await apiFetch(`/search/find-work/job/${jobId}`));
}

export async function getSavedJobs() {
  return unwrapList(await apiFetch('/profilesystem/freelancer/jobs/saved'));
}

export async function saveJob(jobId) {
  return unwrap(await apiFetch(`/search/find-work/job/${jobId}/save`, { method: 'POST' }));
}

export async function unsaveJob(jobId) {
  return unwrap(await apiFetch(`/search/find-work/job/${jobId}/save`, { method: 'DELETE' }));
}

// ══════════════════════════════════════════════════════════════════════════════
// PROPOSALS
// ══════════════════════════════════════════════════════════════════════════════

export async function getFreelancerProposals(params = { page: 1, limit: 10 }) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/proposals/my?${qs}`));
}

export async function getProposalById(proposalId) {
  return unwrap(await apiFetch(`/proposals/${proposalId}`));
}

function parseDeliveryDays(value) {
  if (typeof value === 'number' && value > 0) return value;
  const match = String(value || '').match(/(\d+)/);
  return match ? Math.min(365, Math.max(1, parseInt(match[1], 10))) : 7;
}

export async function createProposal(data) {
  const payload = {
    jobId: data.jobId,
    title: data.title || `Proposal for job ${data.jobId}`,
    coverLetter: data.coverLetter || data.message || '',
    bidAmount: String(data.bidAmount ?? data.proposedPrice ?? 0),
    deliveryDays: parseDeliveryDays(data.deliveryDays ?? data.proposedDuration),
    currency: data.currency || 'USD',
  };

  return unwrap(await apiFetch('/proposals', {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
}

export async function withdrawProposal(proposalId) {
  return unwrap(await apiFetch(`/proposals/${proposalId}`, {
    method: 'DELETE',
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// CONTRACTS & MILESTONES
// ══════════════════════════════════════════════════════════════════════════════

export async function getFreelancerContracts(params = { page: 1, limit: 10 }) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/profilesystem/freelancer/orders?${qs}`));
}

export async function getContractById(contractId) {
  return unwrap(await apiFetch(`/contracts/${contractId}`));
}

export async function signContract(contractId, data = {}) {
  return unwrap(await apiFetch(`/contracts/${contractId}/sign`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }));
}

export async function requestMilestoneApproval(milestoneId, data) {
  return unwrap(await apiFetch(`/hiring/milestones/${milestoneId}/submit`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }));
}

export async function startMilestone(milestoneId) {
  return unwrap(await apiFetch(`/hiring/milestones/${milestoneId}/start`, {
    method: 'PATCH',
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// MESSAGES (Chat system)
// ══════════════════════════════════════════════════════════════════════════════
export async function getFreelancerChats(params = {}) {
  const data = await messagingAPI.getConversations(params);
  return { items: data.items, total: data.total };
}

export async function getFreelancerMessages(conversationId, params = {}) {
  const data = await messagingAPI.getMessages(conversationId, params);
  return { items: data.items, total: data.total };
}

export async function sendFreelancerMessage(conversationId, content) {
  return messagingAPI.sendMessage(conversationId, content);
}

export async function markChatRead(conversationId) {
  return messagingAPI.markRead(conversationId);
}

// ══════════════════════════════════════════════════════════════════════════════
// WALLET & TRANSACTIONS
// ══════════════════════════════════════════════════════════════════════════════

export async function getFreelancerWallet() {
  return unwrap(await apiFetch('/escorow_wallet/wallet'));
}

export async function getFreelancerTransactions(params = { page: 1, limit: 10 }) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/escorow_wallet/transactions?${qs}`));
}

export async function initiateWithdrawal(data) {
  return unwrap(await apiFetch('/escorow_wallet/withdrawal', {
    method: 'POST',
    headers: data.idempotencyKey ? { 'Idempotency-Key': data.idempotencyKey } : {},
    body: JSON.stringify({
      amount: data.amount,
      method: data.method || 'paystack',
      phoneNumber: data.phoneNumber,
      accountNumber: data.accountNumber || data.phoneNumber,
      accountName: data.accountName,
      bankCode: data.bankCode || 'MPESA',
      recipientType: data.recipientType || 'mobile_money',
    }),
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE & PORTFOLIO
// ══════════════════════════════════════════════════════════════════════════════

export async function getFreelancerProfile() {
  return unwrap(await apiFetch('/profilesystem/profile'));
}

export async function updateFreelancerProfile(data) {
  return unwrap(await apiFetch('/profilesystem/profile/freelancer', {
    method: 'PUT',
    body: JSON.stringify(data),
  }));
}
