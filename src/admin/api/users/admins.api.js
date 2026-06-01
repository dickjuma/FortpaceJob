import apiClient, { unwrapAdminResponse } from '../apiClient.js';
import { fetchAllUsers } from './users.api.js';

export async function fetchAdmins(params = {}) {
  return fetchAllUsers({ ...params, userGroup: 'admin' });
}

export async function createAdminApi(data) {
  const response = await apiClient.post('/admins', data);
  return unwrapAdminResponse(response).data;
}

export async function assignRoleApi(userId, role, permissions) {
  const response = await apiClient.patch(`/users/${userId}/role`, { role, permissions });
  return unwrapAdminResponse(response).data;
}