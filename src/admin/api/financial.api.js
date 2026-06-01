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

export async function fetchTransactions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/financial/transactions${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchTransaction(txId) {
  const response = await apiClient.get(`/financial/transactions/${txId}`);
  return unwrapAdminResponse(response).data;
}

export async function fetchPendingWithdrawals() {
  const response = await apiClient.get('/financial/withdrawals/pending');
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function approveWithdrawal(wdId, data = {}) {
  const response = await apiClient.post(`/financial/withdrawals/${wdId}/approve`, data);
  return unwrapAdminResponse(response).data;
}

export async function rejectWithdrawal(wdId, data = {}) {
  const response = await apiClient.post(`/financial/withdrawals/${wdId}/reject`, data);
  return unwrapAdminResponse(response).data;
}

export async function releaseEscrow(escrowId, mfaToken) {
  const response = await apiClient.post(`/financial/escrow/${escrowId}/release`, { mfaToken });
  return unwrapAdminResponse(response).data;
}

export async function refundEscrow(escrowId, mfaToken) {
  const response = await apiClient.post(`/financial/escrow/${escrowId}/refund`, { mfaToken });
  return unwrapAdminResponse(response).data;
}

export async function holdEscrow(escrowId, mfaToken) {
  const response = await apiClient.post(`/financial/escrow/${escrowId}/hold`, { mfaToken });
  return unwrapAdminResponse(response).data;
}

export async function partialReleaseEscrow(escrowId, data) {
  const response = await apiClient.post(`/financial/escrow/${escrowId}/partial-release`, data);
  return unwrapAdminResponse(response).data;
}

export async function freezeWallet(walletId, mfaToken) {
  const response = await apiClient.post(`/financial/wallets/${walletId}/freeze`, { mfaToken });
  return unwrapAdminResponse(response).data;
}

export async function unfreezeWallet(walletId, mfaToken) {
  const response = await apiClient.post(`/financial/wallets/${walletId}/unfreeze`, { mfaToken });
  return unwrapAdminResponse(response).data;
}

export async function fetchRevenueReport(fromDate, toDate) {
  const response = await apiClient.get(`/financial/reports/revenue?fromDate=${fromDate}&toDate=${toDate}`);
  return unwrapAdminResponse(response).data;
}

export async function fetchEscrowSummary() {
  const response = await apiClient.get('/financial/reports/escrow-summary');
  return unwrapAdminResponse(response).data;
}

export async function fetchFeeRules() {
  const response = await apiClient.get('/financial/fees');
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function fetchFeeSettings() {
  const response = await apiClient.get('/financial/fees/settings');
  return unwrapAdminResponse(response).data;
}

export async function updateFeeSettings(settings) {
  const response = await apiClient.put('/financial/fees/settings', settings);
  return unwrapAdminResponse(response).data;
}

export async function updateFeeRule(ruleId, patch) {
  const response = await apiClient.patch(`/financial/fees/${ruleId}`, patch);
  return unwrapAdminResponse(response).data;
}

export async function createFeeRule(data) {
  const response = await apiClient.post('/financial/fees', data);
  return unwrapAdminResponse(response).data;
}

export async function toggleFeeRule(ruleId, mfaToken) {
  const response = await apiClient.put(`/financial/fees/${ruleId}/toggle`, { mfaToken });
  return unwrapAdminResponse(response).data;
}

export async function runReconciliation(mfaToken) {
  const response = await apiClient.post('/financial/reconcile', { mfaToken });
  return unwrapAdminResponse(response).data;
}