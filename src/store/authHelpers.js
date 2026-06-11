// src/store/authHelpers.js
// Simple helper functions to provide auth token and refresh logic.
// In a real app these would integrate with your auth backend.
import { useAuthStore } from './authStore';

/**
 * Retrieve the current auth token from the auth store.
 */
export function getAuthToken() {
  const { token } = useAuthStore.getState();
  return token;
}

/**
 * Refresh the auth token. Placeholder implementation – in a production app this
 * would call a refresh endpoint and update the store. Here we simply return the
 * existing token for compatibility with SocketManager expectations.
 */
export async function refreshAuthToken() {
  const { token } = useAuthStore.getState();
  // Simulate async refresh; you could replace with real API call.
  return token;
}
