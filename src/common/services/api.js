/**
 * Forte Platform API Service
 * Centralized API client for all backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Token management
const getToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};
const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("auth-store");
};
const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const unwrapApiResponse = (payload) => {
  if (payload && typeof payload === "object" && "data" in payload && payload.success !== undefined) {
    return payload.data;
  }
  return payload;
};

const getErrorMessage = (payload, fallback = "An error occurred") => {
  if (!payload || typeof payload !== "object") return fallback;
  return payload.message || payload.error?.message || payload.error || fallback;
};

// API Client with auth handling
const apiClient = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    // Pass the AbortSignal if provided in options
    signal: options.signal,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle token refresh
  if (response.status === 401 && token) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const rawRefreshData = await parseJsonSafely(refreshResponse);
          const refreshData = unwrapApiResponse(rawRefreshData);

          setTokens(refreshData?.accessToken, refreshData?.refreshToken);
          
          // Retry original request with new token
          config.headers.Authorization = `Bearer ${refreshData.accessToken}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
          removeTokens();
          window.location.href = "/auth/session-expired";
        }
      } catch (error) {
        removeTokens();
        window.location.href = "/auth/session-expired";
      }
    } else {
      removeTokens();
    }
  }

  const rawData = await parseJsonSafely(response);
  const data = unwrapApiResponse(rawData);
  
  if (!response.ok) {
    const fallbackMessage = response.status === 429
      ? "Too many attempts. Please wait a moment and try again."
      : "An error occurred";
    throw new Error(getErrorMessage(rawData, fallbackMessage));
  }

  if (rawData?.success === false) {
    throw new Error(getErrorMessage(rawData));
  }
  
  return data;
};

// Custom format helper and named api utility for Axios-like compatibility
const formatUrl = (url) => url.startsWith('/') ? url : '/' + url;

export const api = {
  get: async (url, config = {}) => {
    let endpoint = formatUrl(url);
    if (config.params) {
      const q = new URLSearchParams(config.params).toString();
      endpoint += (endpoint.includes('?') ? '&' : '?') + q;
    }
    const data = await apiClient(endpoint, { method: 'GET', ...config });
    return { data };
  },
  post: async (url, body, config = {}) => {
    const data = await apiClient(formatUrl(url), { method: 'POST', body: JSON.stringify(body), ...config });
    return { data };
  },
  patch: async (url, body, config = {}) => {
    const data = await apiClient(formatUrl(url), { method: 'PATCH', body: JSON.stringify(body), ...config });
    return { data };
  },
  delete: async (url, config = {}) => {
    const data = await apiClient(formatUrl(url), { method: 'DELETE', ...config });
    return { data };
  }
};

// ==========================================
// FEATURE SPECIFIC APIS
// ==========================================

export const analyticsAPI = {
  getClientDashboard: () => apiClient('/analytics_reports/dashboard/client'),
  getFreelancerDashboard: () => apiClient('/analytics_reports/dashboard/freelancer'),
};



// ─── AUTH API ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: async (userData) => {
    const data = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  registerWithOTP: async (userData, sendOTP = true) => {
    const data = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...userData, sendOTP }),
    });
    return data;
  },

  verifyOTP: async (email, emailOtp, phoneOtp, phoneNumber) => {
    if (phoneOtp || phoneNumber) {
      throw new Error("Phone OTP verification is not supported by the current API.");
    }
    return authAPI.verifyEmailOTP(email, emailOtp);
  },

  verifyEmailOTP: async (email, otp) => {
    const data = await apiClient("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token: otp, email }),
    });
    if (data?.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  verifyAdmin2FA: async (userId, otp) => {
    const data = await apiClient("/auth/admin/verify-2fa", {
      method: "POST",
      body: JSON.stringify({ userId, otp }),
    });
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  completeRegistration: async () => {
    throw new Error("Complete registration is handled by /auth/verify-email in the current backend.");
  },

  resendOTP: async (email, phoneNumber, channel = "email", purpose = "email_verification", userId = null) => {
    return apiClient("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email, phoneNumber, channel, purpose, userId }),
    });
  },

  login: async (identifier, password, options = {}) => {
    const turnstileToken = options.turnstileToken || options.deviceMetadata?.turnstileToken;
    const data = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: identifier,
        password,
        ...(turnstileToken ? { "cf-turnstile-response": turnstileToken } : {}),
      }),
    });

    if (data?.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }

    return data;
  },

  sendLoginOTP: async () => {
    throw new Error("Phone OTP login is not supported by the current API.");
  },

  loginWithPhoneOTP: async (phoneNumber, otp) => {
    throw new Error("Phone OTP login is not supported by the current API.");
  },

  verifyPhoneOTP: async () => {
    throw new Error("Phone OTP verification is not supported by the current API.");
  },

  logout: async () => {
    try {
      await apiClient("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: getRefreshToken() }),
      });
    } finally {
      removeTokens();
    }
  },

  getMe: async () => {
    const data = await apiClient("/auth/me");
    setUser(data);
    return { user: data, source: "rest" };
  },

  forgotPassword: async (email) => {
    return apiClient("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resendPasswordResetOTP: async (email) => {
    return authAPI.resendOTP(email, null, "email", "reset_password");
  },

  resetPassword: async (payloadOrToken, password) => {
    const payload =
      typeof payloadOrToken === "string"
        ? { token: payloadOrToken, password }
        : payloadOrToken;
    return apiClient("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");
    
    const data = await apiClient("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  getSessions: async () => {
    return apiClient("/auth/sessions");
  },

  revokeSession: async (sessionId) => {
    return apiClient(`/auth/sessions/${sessionId}`, {
      method: "DELETE",
    });
  },

  revokeAllSessions: async () => {
    return apiClient("/auth/sessions", {
      method: "DELETE",
    });
  },
};

// ─── USER API ──────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: async (userId) => {
    return apiClient(`/profilesystem/view/${userId}`);
  },

  updateProfile: async (formData) => {
    // Adapter handles role based patching
    return profileAPI.updateMyProfile(formData);
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiClient("/auth/reset-password", { // maps to auth password change
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getMyStats: async () => {
    return apiClient("/profilesystem/onboarding/status");
  },

  searchTalent: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/category-taxonomy/matching/job-to-freelancers?${queryString}`);
  },

  uploadPortfolio: async (files) => {
    return profileAPI.uploadPortfolio(files);
  },

  deletePortfolioItem: async (index) => {
    const user = getUser();
    return apiClient(`/profilesystem/freelancer/${user?.id}/portfolio/${index}`, {
      method: "DELETE",
    });
  },

  updatePortfolioItem: async (index, updates) => {
    const user = getUser();
    return apiClient(`/profilesystem/freelancer/${user?.id}/portfolio/${index}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },
};

// PROFILE API (Role-aware REST adapter mapping legacy endpoints to microservices)
export const profileAPI = {
  getMyProfile: async () => {
    const data = await apiClient("/profilesystem/me", {
      method: "GET",
    });
    // If backend returns unwrapped profile directly, bundle it for user session
    const user = getUser();
    const updatedUser = { ...user, profile: data };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  },

  getReferralSummary: async () => apiClient('/profilesystem/referrals/summary'),

  updateMyProfile: async (input) => {
    const user = getUser();
    if (!user) throw new Error("No authenticated user found");

    let endpoint = "/profilesystem/me";
    const role = user.role?.toUpperCase();

    if (role === "FREELANCER") {
      endpoint = `/profilesystem/freelancer/${user.id}`;
    } else if (role === "CLIENT") {
      endpoint = `/profilesystem/client/${user.id}`;
    } else if (role === "AGENCY") {
      endpoint = `/profilesystem/agency/${user.id}`;
    }

    const data = await apiClient(endpoint, {
      method: "PATCH",
      body: JSON.stringify(input),
    });

    const updatedUser = { ...user, ...data, profile: data };
    setUser(updatedUser);
    return { success: true, user: updatedUser, missingFields: [] };
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const data = await fetch(`${API_BASE_URL}/profilesystem/upload/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(res => res.json());

    const user = getUser();
    const updatedUser = { ...user, avatar: data.url, profile: { ...user?.profile, avatar: data.url } };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  },

  uploadCoverPhoto: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const data = await fetch(`${API_BASE_URL}/profilesystem/upload/cover`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(res => res.json());

    const user = getUser();
    const updatedUser = { ...user, coverPhoto: data.url, profile: { ...user?.profile, coverPhoto: data.url } };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  },

  uploadCompanyLogo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const data = await fetch(`${API_BASE_URL}/profilesystem/upload/logo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(res => res.json());

    const user = getUser();
    const updatedUser = { ...user, companyLogo: data.url, profile: { ...user?.profile, companyLogo: data.url } };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  },

  getMissingFields: async () => {
    return apiClient("/profilesystem/onboarding/status", { method: "GET" });
  },

  updateFreelancerProfile: async (data) => {
    return apiClient("/profilesystem/freelancer/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  updateFreelancerGoals: async (goals) => {
    return apiClient("/profilesystem/freelancer/goals", {
      method: "PATCH",
      body: JSON.stringify({ goals }),
    });
  },

  uploadIntroVideo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const data = await fetch(`${API_BASE_URL}/profilesystem/upload/video`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(res => res.json());

    const user = getUser();
    const updatedUser = { ...user, introVideo: data.url, profile: { ...user?.profile, introVideo: data.url } };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  },

  uploadPortfolio: async (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    const data = await fetch(`${API_BASE_URL}/profilesystem/upload/portfolio`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(res => res.json());
    
    return { success: true, urls: data.urls };
  },
};

export const onboardingAPI = {
  getStatus: async () => {
    return apiClient('/profilesystem/onboarding/status', { method: 'GET' });
  },

  completeStep: async (step, data = {}) => {
    return apiClient('/profilesystem/onboarding/step', {
      method: 'PATCH',
      body: JSON.stringify({ step, ...data }),
    });
  },
};

// ─── ORDER API ─────────────────────────────────────────────────────────────────
export const orderAPI = {
  createOrder: async (orderData) => {
    return apiClient("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/orders/my?${queryString}`);
  },

  getOrder: async (orderId) => apiClient(`/orders/${orderId}`),

  getFreelancerOrders: async (params = {}) => {
    return orderAPI.getMyOrders(params);
  },

  updateOrderStatus: async (orderId, data) => {
    return apiClient(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ─── AVAILABILITY / BOOKING API ────────────────────────────────────────────────
export const bookingAPI = {
  getFreelancerBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/profilesystem/availability/bookings?${queryString}`);
  },
  updateBookingStatus: async (bookingId, data) => {
    return apiClient(`/profilesystem/availability/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
};

// ─── SKILL TESTS API ────────────────────────────────────────────────
export const skillTestAPI = {
  getAvailableTests: async () => apiClient(`/profilesystem/skill-tests/tests`),
  getTestResults: async () => apiClient(`/profilesystem/skill-tests/results`),
  submitExam: async (data) => apiClient(`/profilesystem/skill-tests/submit`, {
    method: "POST",
    body: JSON.stringify(data)
  })
};

// ─── CERTIFICATIONS API ────────────────────────────────────────────────
export const certificationAPI = {
  getCertifications: async () => apiClient(`/profilesystem/certifications`),
  addCertification: async (data) => apiClient(`/profilesystem/certifications`, {
    method: "POST",
    body: JSON.stringify(data)
  }),
  deleteCertification: async (id) => apiClient(`/profilesystem/certifications/${id}`, {
    method: "DELETE"
  })
};
// ─── GIGS API ──────────────────────────────────────────────────────────────────
export const gigAPI = {
  getGigs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const token = getToken();
    if (token) {
      try {
        return await apiClient(`/jobs-gigs/gigs?${queryString}`);
      } catch {
        // Fall through to public browse when session is invalid or listing is restricted.
      }
    }
    return apiClient(`/jobs-gigs/gigs/public?${queryString}`);
  },

  getMyGigs: async () => {
    return apiClient(`/jobs-gigs/gigs/my`);
  },

  getGig: async (gigId) => {
    const token = getToken();
    if (token) {
      try {
        return await apiClient(`/jobs-gigs/gigs/${gigId}`);
      } catch {
        // Fall through to public detail endpoint.
      }
    }
    return apiClient(`/jobs-gigs/gigs/public/${gigId}`);
  },

  createGig: async (gigData) => {
    const data = new FormData();
    Object.keys(gigData).forEach((key) => {
      if (Array.isArray(gigData[key])) {
        data.append(key, JSON.stringify(gigData[key]));
      } else {
        data.append(key, gigData[key]);
      }
    });

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/jobs-gigs/gigs`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },

  updateGig: async (gigId, gigData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/jobs-gigs/gigs/${gigId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(gigData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },

  deleteGig: async (gigId) => {
    return apiClient(`/jobs-gigs/gigs/${gigId}`, { method: "DELETE" });
  },

  pauseGig: async (gigId) => {
    return apiClient(`/jobs-gigs/gigs/${gigId}/pause`, { method: "POST" });
  },

  activateGig: async (gigId) => {
    return apiClient(`/jobs-gigs/gigs/${gigId}/activate`, { method: "POST" });
  },

  createGigJson: async (gigData) => {
    return apiClient("/jobs-gigs/gigs", {
      method: "POST",
      body: JSON.stringify(gigData),
    });
  },
};

// ─── CONTRACTS API ──────────────────────────────────────────────────────────────
export const contractAPI = {
  getMyContracts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/contracts/my?${queryString}`);
  },

  getContract: async (contractId) => {
    return apiClient(`/contracts/${contractId}`);
  },

  createContract: async (contractData) => {
    return apiClient("/contracts", {
      method: "POST",
      body: JSON.stringify(contractData),
    });
  },

  deliverContract: async (contractId, files) => {
    const data = new FormData();
    files?.forEach((file) => data.append("files", file));

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/deliver`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },

  acceptDelivery: async (contractId) => {
    return apiClient(`/contracts/${contractId}/accept`, { method: "POST" });
  },

  requestRevision: async (contractId, reason) => {
    return apiClient(`/contracts/${contractId}/revision`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  cancelContract: async (contractId, reason) => {
    return apiClient(`/contracts/${contractId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  submitMilestone: async (milestoneId, body = {}) => {
    return apiClient(`/hiring/milestones/${milestoneId}/submit`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
};

// ─── PAYMENTS API ──────────────────────────────────────────────────────────────
export const paymentAPI = {
  createPaymentIntent: async (contractId) => {
    return apiClient("/escorow_wallet/payment/deposit", {
      method: "POST",
      body: JSON.stringify({ provider: "MPESA", amount: 1, phoneNumber: "254712345678" }),
    });
  },

  createMpesaPayment: async (contractId, phoneNumber) => {
    return apiClient("/escorow_wallet/payment/deposit", {
      method: "POST",
      body: JSON.stringify({ contractId, phoneNumber, provider: "MPESA" }),
    });
  },

  verifyMpesaPayment: async (checkoutRequestId) => {
    return apiClient(`/escorow_wallet/wallet/mpesa/status/${checkoutRequestId}`);
  },

  deposit: async (amount, method, phoneNumber) => {
    return apiClient("/escorow_wallet/payment/deposit", {
      method: "POST",
      body: JSON.stringify({ amount: parseFloat(amount), provider: method.toUpperCase(), phoneNumber }),
    });
  },

  connectStripe: async (refreshUrl, returnUrl) => {
    return { success: true, message: "Local mock mode activated" };
  },

  getStripeConnectStatus: async () => {
    return { success: true, connected: false };
  },

  releasePayment: async (contractId) => {
    return apiClient("/escorow_wallet/escrow/release", {
      method: "POST",
      body: JSON.stringify({ contractId }),
    });
  },

  requestRefund: async (contractId, reason) => {
    return apiClient("/escorow_wallet/escrow/refund", {
      method: "POST",
      body: JSON.stringify({ contractId, reason }),
    });
  },

  getEscrowBalance: async () => {
    return apiClient("/escorow_wallet/wallet");
  },
};

// ─── WALLET API ────────────────────────────────────────────────────────────────
export const walletAPI = {
  getWallet: async () => {
    return apiClient("/escorow_wallet/wallet");
  },

  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/escorow_wallet/wallet/transactions?${queryString}`);
  },

  updateWithdrawalMethod: async (withdrawalMethod, withdrawalDetails) => {
    return apiClient("/escorow_wallet/wallet/withdrawal-method", {
      method: "PATCH",
      body: JSON.stringify({ withdrawalMethod, withdrawalDetails }),
    });
  },

  requestWithdrawal: async (amount, phoneNumber) => {
    return apiClient("/escorow_wallet/withdrawal", {
      method: "POST",
      body: JSON.stringify({ amount: parseFloat(amount), phoneNumber, provider: "MPESA" }),
    });
  },

  depositMpesa: async (amount, phoneNumber) => {
    return apiClient("/escorow_wallet/wallet/mpesa/deposit", {
      method: "POST",
      body: JSON.stringify({ amount: parseFloat(amount), phoneNumber }),
    });
  },

  getMpesaStatus: async (checkoutRequestId) => {
    return apiClient(`/escorow_wallet/wallet/mpesa/status/${checkoutRequestId}`);
  },

  getPublicFees: async () => {
    return apiClient("/escorow_wallet/fees/public");
  },

  calculateFees: async (amount, context = {}) => {
    return apiClient("/escorow_wallet/fees/calculate", {
      method: "POST",
      body: JSON.stringify({ amount, ...context }),
    });
  },

  getVaultCompliance: async () => apiClient("/escorow_wallet/vault/compliance"),

  initiateStkPush: async ({ amount, phoneNumber, projectId, serviceId, contractId, orderId, idempotencyKey }) => {
    return apiClient("/escorow_wallet/wallet/mpesa/stk-push", {
      method: "POST",
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
      body: JSON.stringify({ amount, phoneNumber, projectId, serviceId, contractId, orderId, idempotencyKey }),
    });
  },

  paySubscription: async (amount, planId, useWalletBalance = false) => {
    return apiClient("/escorow_wallet/subscriptions/pay", {
      method: "POST",
      body: JSON.stringify({ amount, planId, useWalletBalance }),
    });
  },
};

// ─── DISPUTES API ──────────────────────────────────────────────────────────────
export const disputeAPI = {
  openDispute: async (contractId, reason, description, attachments) => {
    return apiClient("/disputes", {
      method: "POST",
      body: JSON.stringify({ contractId, reason, description, attachments }),
    });
  },

  getMyDisputes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/disputes?${queryString}`);
  },

  getDispute: async (disputeId) => {
    return apiClient(`/disputes/${disputeId}`);
  },

  addMessage: async (disputeId, message, attachments) => {
    return apiClient(`/disputes/${disputeId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message, attachments }),
    });
  },

  getDisputeById: async (id) => apiClient(`/disputes/${id}`),

  submitEvidence: async (id, data) => apiClient(`/disputes/${id}/evidence`, {
    method: "POST",
    body: JSON.stringify(data)
  }),

  getEvidence: async (id) => apiClient(`/disputes/${id}/evidence`)
};

// ─── BUYER REQUESTS API ───────────────────────────────────────────────────────
export const buyerRequestAPI = {
  getRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/hiring/buyer-requests?${queryString}`);
  },

  getMyRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/hiring/buyer-requests/mine?${queryString}`);
  },

  getRequest: async (requestId) => {
    return apiClient(`/hiring/buyer-requests/${requestId}`);
  },

  createRequest: async (requestData) => {
    return apiClient("/hiring/buyer-requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  updateRequest: async (requestId, requestData) => {
    return apiClient(`/hiring/buyer-requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify(requestData),
    });
  },

  closeRequest: async (requestId) => {
    return apiClient(`/hiring/buyer-requests/${requestId}/close`, {
      method: "PATCH",
    });
  },
};

// ─── PROPOSALS API ─────────────────────────────────────────────────────────────
export const proposalAPI = {
  getMyProposals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/proposals/my?${queryString}`);
  },

  getProposalsForRequest: async (requestId) => {
    return apiClient(`/proposals/job/${requestId}`);
  },

  getProposal: async (proposalId) => apiClient(`/proposals/${proposalId}`),

  counterOffer: async (proposalId, payload) =>
    apiClient(`/proposals/${proposalId}/counter-offer`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  updateProposalStatus: async (proposalId, status) => {
    // Determine the specific endpoint based on the status action
    if (status === 'shortlisted') {
      return apiClient(`/proposals/${proposalId}/shortlist`, { method: "PATCH" });
    }
    if (status === 'accepted') {
      return apiClient(`/proposals/${proposalId}/accept`, { method: "PATCH" });
    }
    if (status === 'rejected') {
      return apiClient(`/proposals/${proposalId}/reject`, { 
        method: "PATCH", 
        body: JSON.stringify({ reason: "Not a good fit at this time" }) 
      });
    }
    // Fallback for general status updates if it still exists
    return apiClient(`/proposals/${proposalId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  submitProposal: async (proposalData) => {
    return apiClient("/proposals", {
      method: "POST",
      body: JSON.stringify(proposalData),
    });
  },

  withdrawProposal: async (proposalId, reason = "") => {
    return apiClient(`/proposals/${proposalId}`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    });
  },
};

// ─── REVIEWS API ───────────────────────────────────────────────────────────────
export const reviewAPI = {
  getReviews: async (userId, params = {}) => {
    const queryString = new URLSearchParams({ user: userId, ...params }).toString();
    return apiClient(`/reviews?${queryString}`);
  },

  getReceived: async (userId, params = {}) => {
    const queryString = new URLSearchParams({ user: userId, ...params }).toString();
    return apiClient(`/reviews/received?${queryString}`);
  },

  getFreelancerReviews: async (freelancerId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/reviews/freelancer/${freelancerId}?${queryString}`);
  },

  createReview: async (reviewData) => {
    return apiClient("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  replyToReview: async (reviewId, reply) => {
    return apiClient(`/reviews/${reviewId}/reply`, {
      method: "POST",
      body: JSON.stringify({ reply }),
    });
  },
};

// ─── MESSAGES API ──────────────────────────────────────────────────────────────
export const messageAPI = {
  getConversations: async () => {
    return apiClient("/chat_messeging/conversations");
  },

  getMessages: async (conversationId) => {
    return apiClient(`/chat_messeging/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, message) => {
    return apiClient(`/chat_messeging/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

// ─── AUDIT LOGS API ────────────────────────────────────────────────────────────
export const auditAPI = {
  getLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/audit/logs?${queryString}`);
  },
  getLogById: async (id) => {
    return apiClient(`/audit/logs/${id}`);
  },
  getByTraceId: async (traceId) => {
    return apiClient(`/audit/trace/${traceId}`);
  },
  exportLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/audit/export?${queryString}`);
  }
};

export const cmsAPI = {
  getPublicSettings: () => apiClient('/cms/public'),
  getCommunityPosts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiClient(`/cms/community/posts?${qs}`);
  },
  submitContact: (payload) =>
    apiClient('/cms/contact', { method: 'POST', body: JSON.stringify(payload) }),
};

export const publicAPI = {
  searchFreelancers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/search/freelancers?${queryString}`);
  },
  searchJobs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/search/jobs?${queryString}`);
  },
  getJobById: async (jobId) => apiClient(`/jobs/${jobId}`),
  searchGigs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/search/gigs?${queryString}`);
  },
  getTrendingCategories: async () => {
    return apiClient(`/categories/trending`);
  },
  getCategoryTree: async () => {
    return apiClient(`/categories/tree`);
  },
  getPlatformReviews: async () => {
    return apiClient(`/reviews/platform`); // Will fallback gracefully if backend doesn't support
  },
  getTrustedClients: async () => {
    return apiClient(`/search/trusted-clients`);
  },
  saveFindWorkJob: async (jobId) =>
    apiClient(`/search/find-work/job/${jobId}/save`, { method: 'POST' }),
  unsaveFindWorkJob: async (jobId) =>
    apiClient(`/search/find-work/job/${jobId}/save`, { method: 'DELETE' }),
};

export const workAPI = {
  getTemplates: () => apiClient('/work/templates'),
  createTemplate: (payload) =>
    apiClient('/work/templates', { method: 'POST', body: JSON.stringify(payload) }),
  deleteTemplate: (templateId) =>
    apiClient(`/work/templates/${templateId}`, { method: 'DELETE' }),
  getCollaborators: (jobId) => apiClient(`/work/jobs/${jobId}/collaborators`),
  addCollaborator: (jobId, payload) =>
    apiClient(`/work/jobs/${jobId}/collaborators`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  removeCollaborator: (jobId, memberId) =>
    apiClient(`/work/jobs/${jobId}/collaborators/${memberId}`, { method: 'DELETE' }),
  getAnalytics: () => apiClient('/work/analytics'),
  getProviders: () => apiClient('/work/providers'),
  getPipeline: () => apiClient('/work/pipeline'),
  getVideoFeed: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/videos/feed?${queryString}`);
  },
  getInterviews: () => apiClient('/hiring/interviews'),
  scheduleInterview: (payload) =>
    apiClient('/hiring/interviews', { method: 'POST', body: JSON.stringify(payload) }),
};

// Export utilities
export { getToken, getUser, removeTokens, setUser, API_BASE_URL };
export default {
  auth: authAPI,
  user: userAPI,
  gig: gigAPI,
  order: orderAPI,
  contract: contractAPI,
  payment: paymentAPI,
  wallet: walletAPI,
  booking: bookingAPI,
  skillTest: skillTestAPI,
  certification: certificationAPI,
  dispute: disputeAPI,
  proposal: proposalAPI,
  review: reviewAPI,
  message: messageAPI,
  profile: profileAPI,
  audit: auditAPI,
  public: publicAPI,
  work: workAPI,
};
