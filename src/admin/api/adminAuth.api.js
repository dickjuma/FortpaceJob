import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ADMIN_AUTH_BASE = process.env.REACT_APP_ADMIN_AUTH_BASE_PATH || '/admin/auth';

const api = axios.create({
  baseURL: `${API_BASE_URL}${ADMIN_AUTH_BASE}`,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const unwrap = (response) => response.data;

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || { error: error.message })
);

export const adminAuthAPI = {
  setupStart: (payload) => api.post('/setup/start', payload).then(unwrap),
  setupConfirm: (payload) => api.post('/setup/confirm', payload).then(unwrap),
  login: (payload) => api.post('/login', payload).then(unwrap),
  verifyTotp: (payload) => api.post('/verify-totp', payload).then(unwrap),
  verifyEmailOtp: (payload) => api.post('/verify-email-otp', payload).then(unwrap),
  verifyRecoveryCode: (payload) => api.post('/verify-recovery-code', payload).then(unwrap),
  me: () => api.get('/me').then(unwrap),
  logout: () => api.post('/logout').then(unwrap),
  logoutAll: () => api.post('/logout-all').then(unwrap),
  sessions: () => api.get('/sessions').then(unwrap),
  revokeSession: (sessionId) => api.delete(`/sessions/${sessionId}`).then(unwrap),
  auditLogs: (params) => api.get('/audit-logs', { params }).then(unwrap),
  createAdmin: (payload) => api.post('/admins', payload).then(unwrap),
};

export default api;
