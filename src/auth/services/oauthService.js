/**
 * OAuth Service
 *
 * OAuth flows are handled by the backend auth routes under /api/auth.
 * We keep the browser redirects pointed at that API entry point so the
 * server can start the provider handshake and return the user to the frontend
 * callback page with a live session payload.
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const oauthService = {
  /**
   * Redirect to backend Google OAuth flow.
   */
  loginWithGoogle: (returnTo = '') => {
    const url = new URL(`${API_BASE}/auth/google`);
    if (returnTo) {
      url.searchParams.set('returnTo', returnTo);
    }
    window.location.href = url.toString();
  },

  /**
   * Redirect to backend GitHub OAuth flow.
   */
  loginWithGithub: (returnTo = '') => {
    const url = new URL(`${API_BASE}/auth/github`);
    if (returnTo) {
      url.searchParams.set('returnTo', returnTo);
    }
    window.location.href = url.toString();
  },

  /**
   * Redirect to backend LinkedIn OAuth flow.
   */
  loginWithLinkedIn: () => {
    window.location.href = `${API_BASE}/auth/linkedin`;
  },

  /**
   * Redirect to backend Apple OAuth flow.
   */
  loginWithApple: () => {
    window.location.href = `${API_BASE}/auth/apple`;
  },

  /**
   * POST a Google ID token to the backend for token-based Google login.
   * Use this when the frontend obtains a credential via @react-oauth/google
   * and wants to exchange it server-side.
   *
   * @param {string} credential - Google ID token (JWT) from GoogleLogin onSuccess
   * @returns {Promise<object>} backend auth response { user, accessToken, refreshToken }
   */
  loginWithGoogleCredential: async (credential) => {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credential }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Google login failed');
    }
    return data?.data ?? data;
  },
};
