import apiClient, { unwrapAdminResponse } from './apiClient.js';

export async function fetchFlaggedAccounts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/fraud/flagged-accounts${query ? `?${query}` : ''}`);
  return unwrapAdminResponse(response).data || [];
}

export async function fetchFraudReports(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/fraud/reports${query ? `?${query}` : ''}`);
  return unwrapAdminResponse(response).data || [];
}

export async function fetchAnomalies(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/fraud/anomalies${query ? `?${query}` : ''}`);
  return unwrapAdminResponse(response).data || [];
}

export async function fetchFraudCase(caseId) {
  const response = await apiClient.get(`/fraud/cases/${caseId}`);
  return unwrapAdminResponse(response).data;
}

export async function restrictFraudCase(caseId, data) {
  const response = await apiClient.patch(`/fraud/cases/${caseId}/restrict`, data);
  return unwrapAdminResponse(response).data;
}

export async function escalateFraudCase(caseId, data) {
  const response = await apiClient.patch(`/fraud/cases/${caseId}/escalate`, data);
  return unwrapAdminResponse(response).data;
}

export async function resolveFraudCase(caseId, data) {
  const response = await apiClient.patch(`/fraud/cases/${caseId}/resolve`, data);
  return unwrapAdminResponse(response).data;
}

export async function fetchRiskScore(userId) {
  const response = await apiClient.get(`/fraud/risk-scores/${userId}`);
  return unwrapAdminResponse(response).data;
}

export async function fetchBlacklist() {
  const response = await apiClient.get('/fraud/blacklist');
  return unwrapAdminResponse(response).data || [];
}

export async function addToBlacklist(data) {
  const response = await apiClient.post('/fraud/blacklist', data);
  return unwrapAdminResponse(response).data;
}

export async function removeFromBlacklist(entryId) {
  const response = await apiClient.delete(`/fraud/blacklist/${entryId}`);
  return unwrapAdminResponse(response).data;
}

export async function fetchFraudRules() {
  const response = await apiClient.get('/fraud/rules');
  return unwrapAdminResponse(response).data || [];
}

export async function createFraudRule(data) {
  const response = await apiClient.post('/fraud/rules', data);
  return unwrapAdminResponse(response).data;
}

export async function toggleFraudRule(ruleId) {
  const response = await apiClient.patch(`/fraud/rules/${ruleId}/toggle`);
  return unwrapAdminResponse(response).data;
}