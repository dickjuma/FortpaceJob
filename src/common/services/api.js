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
  return payload.message || payload.error?.message || fallback;
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
    throw new Error(getErrorMessage(rawData));
  }

  if (rawData?.success === false) {
    throw new Error(getErrorMessage(rawData));
  }
  
  return data;
};

// ─── AUTH API ───────────────────────────────────────────────────────────────────
export const authAPI = {
  // Register
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

  // Register with OTP verification
  registerWithOTP: async (userData, sendOTP = true) => {
    const data = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...userData, sendOTP }),
    });
    return data;
  },

  // Verify OTP
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

  completeRegistration: async (email) => {
    const data = await apiClient("/auth/complete-registration", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  // Resend OTP: either email or phone (or both)
  resendOTP: async (email, phoneNumber, channel = "email", purpose = "email_verification", userId = null) => {
    return apiClient("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email, phoneNumber, channel, purpose, userId }),
    });
  },


  // Login
  login: async (identifier, password) => {
    const data = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: identifier, password }),
    });

    if (data?.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }

    return data;
  },

  sendLoginOTP: async (phoneNumber) => {
    return apiClient("/auth/login/send-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },

  loginWithPhoneOTP: async (phoneNumber, otp) => {
    throw new Error("Phone OTP login is not supported by the current API.");
  },

  verifyPhoneOTP: async () => {
    throw new Error("Phone OTP verification is not supported by the current API.");
  },

  // Logout
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

  // Get current user
  getMe: async () => {
    const data = await apiClient("/auth/me");
    setUser(data);
    return { user: data, source: "rest" };
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiClient("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Reset password (token flow or email+otp flow)
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

  // Refresh token
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
  // Get public freelancer profile
  getProfile: async (userId) => {
    return apiClient(`/talents/${userId}`);
  },

  // Update profile
  updateProfile: async (formData) => {
    // Create FormData for file uploads
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "avatar" && formData[key]) {
        data.append(key, formData[key]);
      } else if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
      method: "PATCH",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return apiClient("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Get my stats
  getMyStats: async () => {
    return apiClient("/users/me/stats");
  },

  // Search talent
  searchTalent: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/talents?${queryString}`);
  },

  // Upload portfolio
  uploadPortfolio: async (files) => {
    const data = new FormData();
    files.forEach((file) => data.append("files", file));

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/users/me/portfolio`, {
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

  // Delete portfolio item
  deletePortfolioItem: async (index) => {
    const data = await apiClient(`/profile/me/portfolio/${index}`, {
      method: "DELETE",
    });
    if (data?.user) setUser(data.user);
    return data;
  },

  // Update portfolio item metadata
  updatePortfolioItem: async (index, updates) => {
    const data = await apiClient(`/profile/me/portfolio/${index}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (data?.user) setUser(data.user);
    return data;
  },
};

// PROFILE API (Prisma-backed)
export const profileAPI = {
  getMyProfile: async () => {
    const data = await apiClient("/profile/me", {
      method: "GET",
    });
    if (data?.user) {
      setUser(data.user);
      return { success: true, user: data.user };
    }
    throw new Error("No profile data returned");
  },

  updateMyProfile: async (input) => {
    const data = await apiClient("/profile/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    if (data?.user) {
      setUser(data.user);
      return { success: true, user: data.user, missingFields: data.missingFields || [] };
    }
    throw new Error("Profile update failed");
  },

  uploadAvatar: async (file) => {
    const data = new FormData();
    data.append("avatar", file);
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/profile/me/avatar`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Avatar upload failed");
    if (result.user) setUser(result.user);
    return result;
  },

  uploadCoverPhoto: async (file) => {
    const data = new FormData();
    data.append("coverPhoto", file);
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/profile/me/cover-photo`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Cover photo upload failed");
    if (result.user) setUser(result.user);
    return result;
  },

  uploadCompanyLogo: async (file) => {
    const data = new FormData();
    data.append("companyLogo", file);
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/profile/me/company-logo`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Company logo upload failed");
    if (result.user) setUser(result.user);
    return result;
  },

  getMissingFields: async () => {
    return apiClient("/profile/missing-fields", { method: "GET" });
  },

  uploadIntroVideo: async (file) => {
    const data = new FormData();
    data.append("introVideo", file);
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/profile/me/intro-video`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Video upload failed");
    if (result.user) setUser(result.user);
    return result;
  },

  uploadPortfolio: async (files) => {
    const data = new FormData();
    files.forEach((file) => data.append("files", file));
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/profile/me/portfolio`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Portfolio upload failed");
    if (result.user) setUser(result.user);
    return result;
  },
};

// ─── GIGS API ──────────────────────────────────────────────────────────────────
export const gigAPI = {
  // Get all gigs
  getGigs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/gigs?${queryString}`);
  },

  // Get single gig
  getGig: async (gigId) => {
    return apiClient(`/gigs/${gigId}`);
  },

   createGig: // Create gig
 async (gigData) => {
    const data = new FormData();
    Object.keys(gigData).forEach((key) => {
      if (Array.isArray(gigData[key])) {
        data.append(key, JSON.stringify(gigData[key]));
      } else {
        data.append(key, gigData[key]);
      }
    });

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/gigs`, {
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

  // Update gig
  updateGig: async (gigId, gigData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/gigs/${gigId}`, {
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

  // Delete gig
  deleteGig: async (gigId) => {
    return apiClient(`/gigs/${gigId}`, { method: "DELETE" });
  },
};

// ─── CONTRACTS API ──────────────────────────────────────────────────────────────
export const contractAPI = {
  // Get my contracts
  getMyContracts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/contracts?${queryString}`);
  },

  // Get single contract
  getContract: async (contractId) => {
    return apiClient(`/contracts/${contractId}`);
  },

  // Create contract
  createContract: async (contractData) => {
    return apiClient("/contracts", {
      method: "POST",
      body: JSON.stringify(contractData),
    });
  },

  // Deliver contract
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

  // Accept delivery
  acceptDelivery: async (contractId) => {
    return apiClient(`/contracts/${contractId}/accept`, { method: "POST" });
  },

  // Request revision
  requestRevision: async (contractId, reason) => {
    return apiClient(`/contracts/${contractId}/revision`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  // Cancel contract
  cancelContract: async (contractId, reason) => {
    return apiClient(`/contracts/${contractId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};

// ─── PAYMENTS API ──────────────────────────────────────────────────────────────
export const paymentAPI = {
  // Create payment intent (Stripe)
  createPaymentIntent: async (contractId) => {
    return apiClient("/payments/intent", {
      method: "POST",
      body: JSON.stringify({ contractId }),
    });
  },

  // Create M-Pesa payment
  createMpesaPayment: async (contractId, phoneNumber) => {
    return apiClient("/payments/mpesa", {
      method: "POST",
      body: JSON.stringify({ contractId, phoneNumber }),
    });
  },

  // Verify M-Pesa payment
  verifyMpesaPayment: async (checkoutRequestId) => {
    return apiClient("/payments/mpesa/verify", {
      method: "POST",
      body: JSON.stringify({ checkoutRequestId }),
    });
  },

  // Deposit funds
  deposit: async (amount, method, phoneNumber) => {
    return apiClient("/payments/deposit", {
      method: "POST",
      body: JSON.stringify({ amount, method, phoneNumber }),
    });
  },

  // Connect Stripe account
  connectStripe: async (refreshUrl, returnUrl) => {
    return apiClient("/payments/connect/stripe", {
      method: "POST",
      body: JSON.stringify({ refreshUrl, returnUrl }),
    });
  },

  // Get Stripe connect status
  getStripeConnectStatus: async () => {
    return apiClient("/payments/connect/status");
  },

  // Release payment
  releasePayment: async (contractId) => {
    return apiClient(`/payments/release/${contractId}`, { method: "POST" });
  },

  // Request refund
  requestRefund: async (contractId, reason) => {
    return apiClient("/payments/refund", {
      method: "POST",
      body: JSON.stringify({ contractId, reason }),
    });
  },

  // Get escrow balance
  getEscrowBalance: async () => {
    return apiClient("/payments/escrow/balance");
  },
};

// ─── WALLET API ────────────────────────────────────────────────────────────────
export const walletAPI = {
  // Get wallet
  getWallet: async () => {
    return apiClient("/wallet");
  },

  // Get transactions
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/wallet/transactions?${queryString}`);
  },

  // Update withdrawal method
  updateWithdrawalMethod: async (withdrawalMethod, withdrawalDetails) => {
    return apiClient("/wallet/withdrawal-method", {
      method: "PATCH",
      body: JSON.stringify({ withdrawalMethod, withdrawalDetails }),
    });
  },

  // Request withdrawal
  requestWithdrawal: async (amount) => {
    return apiClient("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
};

// ─── DISPUTES API ──────────────────────────────────────────────────────────────
export const disputeAPI = {
  // Open dispute
  openDispute: async (contractId, reason, description, attachments) => {
    return apiClient("/disputes", {
      method: "POST",
      body: JSON.stringify({ contractId, reason, description, attachments }),
    });
  },

  // Get my disputes
  getMyDisputes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/disputes?${queryString}`);
  },

  // Get single dispute
  getDispute: async (disputeId) => {
    return apiClient(`/disputes/${disputeId}`);
  },

  // Add message to dispute
  addMessage: async (disputeId, message, attachments) => {
    return apiClient(`/disputes/${disputeId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message, attachments }),
    });
  },
};

// ─── BUYER REQUESTS API ───────────────────────────────────────────────────────
export const buyerRequestAPI = {
  // Get all requests
  getRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/buyer-requests?${queryString}`);
  },

  getMyRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/buyer-requests/mine?${queryString}`);
  },

  // Get single request
  getRequest: async (requestId) => {
    return apiClient(`/buyer-requests/${requestId}`);
  },

  // Create request
  createRequest: async (requestData) => {
    return apiClient("/buyer-requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  updateRequest: async (requestId, requestData) => {
    return apiClient(`/buyer-requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify(requestData),
    });
  },

  closeRequest: async (requestId) => {
    return apiClient(`/buyer-requests/${requestId}/close`, {
      method: "PATCH",
    });
  },
};

// ─── PROPOSALS API ─────────────────────────────────────────────────────────────
export const proposalAPI = {
  // Get my proposals
  getMyProposals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/proposals?${queryString}`);
  },

  getProposalsForRequest: async (requestId) => {
    return apiClient(`/proposals/request/${requestId}`);
  },

  updateProposalStatus: async (proposalId, status) => {
    return apiClient(`/proposals/${proposalId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Submit proposal
  submitProposal: async (proposalData) => {
    return apiClient("/proposals", {
      method: "POST",
      body: JSON.stringify(proposalData),
    });
  },

  // Withdraw proposal
  withdrawProposal: async (proposalId) => {
    return apiClient(`/proposals/${proposalId}/withdraw`, { method: "POST" });
  },
};

// ─── REVIEWS API ───────────────────────────────────────────────────────────────
export const reviewAPI = {
  // Get reviews for user
  getReviews: async (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/reviews?user=${userId}&${queryString}`);
  },

  // Create review
  createReview: async (reviewData) => {
    return apiClient("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },
};

// ─── MESSAGES API ──────────────────────────────────────────────────────────────
export const messageAPI = {
  // Get conversations
  getConversations: async () => {
    return apiClient("/messages");
  },

  // Get messages for conversation
  getMessages: async (conversationId) => {
    return apiClient(`/messages/${conversationId}`);
  },

  // Send message
  sendMessage: async (conversationId, message) => {
    return apiClient(`/messages/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

// Export utilities
export { getToken, getUser, removeTokens, setUser, API_BASE_URL };
export default {
  auth: authAPI,
  user: userAPI,
  gig: gigAPI,
  contract: contractAPI,
  payment: paymentAPI,
  wallet: walletAPI,
  dispute: disputeAPI,
  buyerRequest: buyerRequestAPI,
  proposal: proposalAPI,
  review: reviewAPI,
  message: messageAPI,
  profile: profileAPI,
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
    // For export, we might want to return the raw blob or handle it differently
    // but the backend sends CSV text
    return apiClient(`/audit/export?${queryString}`);
  }
};
