import apiClient, { unwrapAdminResponse } from '../apiClient.js';

export const fetchUserRiskData = async () => {
  const response = await apiClient.get('/fraud/flagged-accounts');
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
};

export const fetchModerationEvents = async () => {
  const response = await apiClient.get('/fraud/anomalies');
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
};
