import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './freelancerApi';
import { orderAPI, gigAPI, bookingAPI, skillTestAPI, certificationAPI, disputeAPI } from '../../common/services/api';

/**
 * ============================================================
 * FREELANCER HOOKS
 * React Query hooks for the Freelancer portal using freelancerApi.
 * ============================================================
 */

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerDashboard = () => {
  return useQuery({
    queryKey: ['freelancer', 'dashboard'],
    queryFn: api.getFreelancerDashboardStats,
  });
};

export const useUpdateFreelancerGoals = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateFreelancerGoals,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'dashboard'] });
    },
  });
};

export const useFreelancerRecentActivity = (params = { limit: 10 }) => {
  return useQuery({
    queryKey: ['freelancer', 'activity', params],
    queryFn: () => api.getFreelancerRecentActivity(params),
  });
};

export const useFreelancerActiveOrders = (params = { limit: 10, status: 'ACTIVE' }) => {
  return useQuery({
    queryKey: ['freelancer', 'orders', 'active', params],
    queryFn: () => api.getFreelancerActiveOrders(params),
  });
};

export const useUpdateFreelancerAvailability = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateFreelancerAvailability,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'dashboard'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'profile'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// JOBS
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerJobs = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'jobs', params],
    queryFn: () => api.getFreelancerJobs(params),
    keepPreviousData: true,
  });
};

export const useFreelancerJobById = (jobId) => {
  return useQuery({
    queryKey: ['freelancer', 'jobs', jobId],
    queryFn: () => api.getFreelancerJobById(jobId),
    enabled: !!jobId,
  });
};

export const useSavedJobs = () => {
  return useQuery({
    queryKey: ['freelancer', 'jobs', 'saved'],
    queryFn: api.getSavedJobs,
  });
};

export const useSaveJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.saveJob,
    onSuccess: (_, jobId) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'jobs'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'jobs', 'saved'] });
    },
  });
};

export const useUnsaveJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.unsaveJob,
    onSuccess: (_, jobId) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'jobs'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'jobs', 'saved'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// PROPOSALS
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerProposals = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'proposals', params],
    queryFn: () => api.getFreelancerProposals(params),
    keepPreviousData: true,
  });
};

export const useProposalById = (proposalId) => {
  return useQuery({
    queryKey: ['freelancer', 'proposals', proposalId],
    queryFn: () => api.getProposalById(proposalId),
    enabled: !!proposalId,
  });
};

export const useCreateProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createProposal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'proposals'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'dashboard'] });
    },
  });
};

export const useWithdrawProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.withdrawProposal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'proposals'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'dashboard'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// CONTRACTS & MILESTONES
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerContracts = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'contracts', params],
    queryFn: () => api.getFreelancerContracts(params),
    keepPreviousData: true,
  });
};

export const useContractById = (contractId) => {
  return useQuery({
    queryKey: ['freelancer', 'contracts', contractId],
    queryFn: () => api.getContractById(contractId),
    enabled: !!contractId,
  });
};

export const useSignContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, data }) => api.signContract(contractId, data),
    onSuccess: (_, { contractId }) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'contracts'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'contracts', contractId] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'orders', 'active'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'dashboard'] });
    },
  });
};

export const useSubmitMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, data }) => api.requestMilestoneApproval(milestoneId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'contracts'] });
    },
  });
};

export const useStartMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.startMilestone,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'contracts'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// MESSAGES (Chat system)
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerChats = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'chats', params],
    queryFn: () => api.getFreelancerChats(params),
    refetchInterval: 10000, // Poll every 10s
  });
};

export const useFreelancerMessages = (conversationId, params) => {
  return useQuery({
    queryKey: ['freelancer', 'chats', conversationId, 'messages', params],
    queryFn: () => api.getFreelancerMessages(conversationId, params),
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll every 5s for active chat
  });
};

export const useSendFreelancerMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }) => api.sendFreelancerMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'chats', conversationId, 'messages'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'chats'] });
    },
  });
};

export const useMarkChatRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.markChatRead,
    onSuccess: (_, conversationId) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'chats'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// WALLET
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerWallet = () => {
  return useQuery({
    queryKey: ['freelancer', 'wallet'],
    queryFn: api.getFreelancerWallet,
  });
};

export const useFreelancerTransactions = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'transactions', params],
    queryFn: () => api.getFreelancerTransactions(params),
    keepPreviousData: true,
  });
};

export const useInitiateWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.initiateWithdrawal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'wallet'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'transactions'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerProfile = () => {
  return useQuery({
    queryKey: ['freelancer', 'profile'],
    queryFn: api.getFreelancerProfile,
  });
};

export const useUpdateFreelancerProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateFreelancerProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'profile'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS (Gig management)
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerOrders = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'orders', params],
    queryFn: () => orderAPI.getFreelancerOrders(params),
    keepPreviousData: true,
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ['freelancer', 'orders', 'detail', orderId],
    queryFn: () => orderAPI.getOrder(orderId),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderData) => orderAPI.createOrder(orderData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'orders'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'dashboard'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }) => orderAPI.updateOrderStatus(orderId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'orders'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'orders', 'detail'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// GIGS
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerGigs = () => {
  return useQuery({
    queryKey: ['freelancer', 'gigs', 'my'],
    queryFn: () => gigAPI.getMyGigs(),
    keepPreviousData: true,
  });
};

export const useFreelancerGigById = (gigId) => {
  return useQuery({
    queryKey: ['freelancer', 'gigs', gigId],
    queryFn: () => gigAPI.getGig(gigId),
    enabled: !!gigId,
  });
};

export const useUpdateFreelancerGig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ gigId, data }) => gigAPI.updateGig(gigId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'gigs', variables.gigId] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'gigs', 'my'] });
    },
  });
};

export const useCreateGig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gigData) => gigAPI.createGig(gigData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'gigs', 'my'] });
    },
  });
};

export const usePauseGig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gigId) => gigAPI.pauseGig(gigId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'gigs', 'my'] });
    },
  });
};

export const useActivateGig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gigId) => gigAPI.activateGig(gigId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'gigs', 'my'] });
    },
  });
};

export const useDeleteGig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gigId) => gigAPI.deleteGig(gigId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'gigs', 'my'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerBookings = (params) => {
  return useQuery({
    queryKey: ['freelancer', 'bookings', params],
    queryFn: () => bookingAPI.getFreelancerBookings(params),
    keepPreviousData: true,
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, data }) => bookingAPI.updateBookingStatus(bookingId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'bookings'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// SKILL TESTS
// ══════════════════════════════════════════════════════════════════════════════

export const useAvailableSkillTests = () => {
  return useQuery({
    queryKey: ['freelancer', 'skillTests', 'available'],
    queryFn: () => skillTestAPI.getAvailableTests(),
  });
};

export const useSkillTestResults = () => {
  return useQuery({
    queryKey: ['freelancer', 'skillTests', 'results'],
    queryFn: () => skillTestAPI.getTestResults(),
  });
};

export const useSubmitSkillTest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => skillTestAPI.submitExam(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'skillTests', 'results'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const useFreelancerCertifications = () => {
  return useQuery({
    queryKey: ['freelancer', 'certifications'],
    queryFn: () => certificationAPI.getCertifications(),
  });
};

export const useAddCertification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => certificationAPI.addCertification(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'certifications'] });
    },
  });
};

export const useDeleteCertification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => certificationAPI.deleteCertification(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'certifications'] });
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// DISPUTES
// ══════════════════════════════════════════════════════════════════════════════

export const useMyDisputes = () => {
  return useQuery({
    queryKey: ['freelancer', 'disputes'],
    queryFn: () => disputeAPI.getMyDisputes(),
  });
};

export const useDisputeById = (disputeId) => {
  return useQuery({
    queryKey: ['freelancer', 'disputes', disputeId],
    queryFn: () => disputeAPI.getDispute(disputeId),
    enabled: !!disputeId,
  });
};

export const useDisputeEvidence = (disputeId) => {
  return useQuery({
    queryKey: ['freelancer', 'disputes', disputeId, 'evidence'],
    queryFn: () => disputeAPI.getEvidence(disputeId),
    enabled: !!disputeId
  });
};

export const useSubmitEvidence = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ disputeId, data }) => disputeAPI.submitEvidence(disputeId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['freelancer', 'disputes', variables.disputeId, 'evidence'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'disputes'] });
    },
  });
};
