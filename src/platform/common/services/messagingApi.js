/**
 * Unified messaging API — tries canonical /chat/* then legacy /chat_messaging/chat/*
 */
import { getToken } from './api';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  let body;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  if (!res.ok) {
    throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
  }

  return body?.data !== undefined && body?.success !== undefined ? body.data : body;
}

function unwrapPaged(payload) {
  const items =
    payload?.items ||
    payload?.conversations ||
    payload?.messages ||
    (Array.isArray(payload) ? payload : []);
  return {
    items,
    total: payload?.total ?? payload?.pagination?.total ?? items.length,
    page: payload?.page ?? payload?.pagination?.page ?? 1,
    totalPages: payload?.totalPages ?? payload?.pagination?.totalPages ?? 1,
  };
}

async function tryPaths(paths, options) {
  let lastError;
  for (const path of paths) {
    try {
      return await request(path, options);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Messaging request failed');
}

export const messagingAPI = {
  getConversations: async (params = {}) => {
    const qs = new URLSearchParams({ limit: 30, ...params }).toString();
    const data = await request(`/chat/conversations?${qs}`);
    return unwrapPaged(data);
  },

  getMessages: async (conversationId, params = {}) => {
    const qs = new URLSearchParams({ limit: 50, ...params }).toString();
    const data = await request(`/chat/conversations/${conversationId}/messages?${qs}`);
    return unwrapPaged(data);
  },

  sendMessage: async (conversationId, content, messageType = 'TEXT', attachmentsJson = null) => {
    return request(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType, attachmentsJson }),
    });
  },

  startConversation: async (payload) => {
    return request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  markRead: async (conversationId) => {
    return request(`/chat/conversations/${conversationId}/read`, {
      method: 'PATCH',
    });
  },
};
