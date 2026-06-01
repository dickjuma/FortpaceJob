import apiClient, { unwrapAdminResponse } from '../apiClient.js';

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

export async function fetchAllUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/users${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchUserById(userId) {
  const response = await apiClient.get(`/users/${userId}`);
  return unwrapAdminResponse(response).data;
}

export async function fetchUserActivity(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/users/${userId}/activity${query ? `?${query}` : ''}`);
  return normalizeListResponse(response);
}

export async function fetchUserSessions(userId) {
  const response = await apiClient.get(`/users/${userId}/sessions`);
  return unwrapAdminResponse(response).data || [];
}

export async function suspendUserApi(userId, data) {
  const response = await apiClient.patch(`/users/${userId}/suspend`, data);
  return unwrapAdminResponse(response).data;
}

export async function restrictUserApi(userId, data) {
  const response = await apiClient.patch(`/users/${userId}/restrict`, data);
  return unwrapAdminResponse(response).data;
}

export async function activateUserApi(userId, data = {}) {
  const response = await apiClient.patch(`/users/${userId}/unflag`, {
    resolutionNote: data.resolutionNote || 'Account reviewed and restored by admin.',
  });
  return unwrapAdminResponse(response).data;
}

export async function banUserApi(userId, data) {
  const response = await apiClient.patch(`/users/${userId}/restrict`, {
    restrictions: ['LOGIN', 'MARKETPLACE_ACTIONS', 'WITHDRAWALS'],
    reason: data?.reason || 'Administrative restriction applied.',
  });
  return unwrapAdminResponse(response).data;
}

export async function flagUserApi(userId, data) {
  const response = await apiClient.patch(`/users/${userId}/flag`, data);
  return unwrapAdminResponse(response).data;
}

export async function unflagUserApi(userId, data) {
  const response = await apiClient.patch(`/users/${userId}/unflag`, data);
  return unwrapAdminResponse(response).data;
}

export async function verifyKycApi(userId, data = {}) {
  const endpoint = data.status === 'rejected' ? 'reject' : 'approve';
  const response = await apiClient.post(`/users/${userId}/kyc/${endpoint}`, data);
  return unwrapAdminResponse(response).data;
}

export async function freezeWalletApi(userId, data) {
  return restrictUserApi(userId, {
    restrictions: ['WITHDRAWALS'],
    reason: data?.reason || 'Wallet withdrawals restricted by admin.',
  });
}

export async function updateUserApi(userId, data) {
  const response = await apiClient.patch(`/users/${userId}`, data);
  return unwrapAdminResponse(response).data;
}
