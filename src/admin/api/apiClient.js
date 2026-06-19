import axios from 'axios';
import { removeTokens } from '../../platform/common/services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ADMIN_API_BASE_PATH = process.env.REACT_APP_ADMIN_API_BASE_PATH || '/admin_rbc';

const readPersistedToken = () => {
  const explicitAdminToken = localStorage.getItem('admin-token');
  if (explicitAdminToken) return explicitAdminToken;

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) return accessToken;

  try {
    const adminStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    return adminStorage?.state?.token || null;
  } catch (_) {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${ADMIN_API_BASE_PATH}`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = readPersistedToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      removeTokens();
      localStorage.removeItem('admin-token');
      localStorage.removeItem('auth-storage');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const unwrapAdminResponse = (response) => {
  if (!response || typeof response !== 'object') {
    return { data: response, meta: null };
  }

  if ('success' in response || 'data' in response || 'meta' in response) {
    return {
      data: response.data ?? null,
      meta: response.meta ?? null,
      message: response.message,
      success: response.success !== false,
    };
  }

  return { data: response, meta: null, success: true };
};

export default apiClient;
