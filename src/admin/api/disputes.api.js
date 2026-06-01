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

export async function fetchDisputes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/disputes${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchDispute(disputeId) {
  const response = await apiClient.get(`/disputes/${disputeId}`);
  return unwrapAdminResponse(response).data;
}

export async function fetchDisputeEvidence(disputeId) {
  const response = await apiClient.get(`/disputes/${disputeId}/evidence`);
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
}

export async function assignDisputeOutcome(disputeId, data) {
  const response = await apiClient.post(`/disputes/${disputeId}/outcome`, data);
  return unwrapAdminResponse(response).data;
}

export async function escalateDispute(disputeId, data) {
  const response = await apiClient.post(`/disputes/${disputeId}/escalate`, data);
  return unwrapAdminResponse(response).data;
}

export async function addDisputeNote(disputeId, note) {
  const response = await apiClient.post(`/disputes/${disputeId}/note`, { note });
  return unwrapAdminResponse(response).data;
}

export async function fetchDisputeAuditTrail(disputeId) {
  const response = await apiClient.get(`/disputes/${disputeId}/audit-trail`);
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
}