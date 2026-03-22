/**
 * Forte Platform API Service
 * Centralized API client for all backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Token management
const getToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};
const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

const graphqlClient = async ({ query, variables = {}, operationName }) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables, operationName }),
  });

  const result = await response.json();
  if (!response.ok || result.errors?.length) {
    throw new Error(result.errors?.[0]?.message || "GraphQL request failed");
  }
  return result.data;
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
          const data = await refreshResponse.json();
          setTokens(data.accessToken, data.refreshToken);
          
          // Retry original request with new token
          config.headers.Authorization = `Bearer ${data.accessToken}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
          removeTokens();
          window.location.href = "/signin";
        }
      } catch (error) {
        removeTokens();
        window.location.href = "/signin";
      }
    } else {
      removeTokens();
    }
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
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
    const data = await apiClient("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, emailOtp, phoneOtp, phoneNumber }),
    });
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  verifyEmailOTP: async (email, otp) => {
    const data = await apiClient("/auth/verify-email-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  verifyPhoneOTP: async (email, phoneNumber, otp) => {
    const data = await apiClient("/auth/verify-phone-otp", {
      method: "POST",
      body: JSON.stringify({ email, phoneNumber, otp }),
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
  resendOTP: async (email, phoneNumber, channel = "phone", purpose) => {
    return apiClient("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email, phoneNumber, channel, ...(purpose ? { purpose } : {}) }),
    });
  },


  // Login
  login: async (identifier, password) => {
    const data = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    if (data.accessToken) {
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
    const data = await apiClient("/auth/login/phone", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, otp }),
    });
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
    return data;
  },

  // Logout
  logout: async () => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } finally {
      removeTokens();
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const data = await graphqlClient({
        operationName: "Me",
        query: "query Me { me { _id id role name companyName email phoneNumber bio skills hourlyRate currency serviceMode physicalCategory serviceArea country languages companyDescription industry budget hiringCapacity avatar companyLogo isVerified emailVerified phoneVerified createdAt } }",
      });
      if (data?.me) {
        setUser(data.me);
        return { success: true, user: data.me, source: "graphql" };
      }
      throw new Error("GraphQL me query returned no data");
    } catch (_) {
      const data = await apiClient("/auth/me");
      setUser(data.user);
      return { ...data, source: "rest" };
    }
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
};

// ─── USER API ──────────────────────────────────────────────────────────────────
export const userAPI = {
  // Get user profile
  getProfile: async (userId) => {
    return apiClient(`/users/${userId}`);
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
    return apiClient(`/users/search?${queryString}`);
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
  deletePortfolioItem: async (url) => {
    return apiClient("/users/me/portfolio", {
      method: "DELETE",
      body: JSON.stringify({ url }),
    });
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
};

// ─── PROPOSALS API ─────────────────────────────────────────────────────────────
export const proposalAPI = {
  // Get my proposals
  getMyProposals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/proposals?${queryString}`);
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
