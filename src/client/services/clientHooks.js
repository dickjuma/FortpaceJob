/**
 * ============================================================
 * CLIENT REACT-QUERY HOOKS
 * All data-fetching + mutation hooks for the Client portal.
 * ============================================================
 */
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from './clientApi.js';
import { authAPI } from '../../platform/common/services/api';

// ── Keys ─────────────────────────────────────────────────────────────────────
export const QK = {
  dashboard: ['client', 'dashboard'],
  jobs: (f) => ['client', 'jobs', f],
  job: (id) => ['client', 'job', id],
  proposals: (f) => ['client', 'proposals', f],
  proposal: (id) => ['client', 'proposal', id],
  jobProposals: (jobId, f) => ['client', 'job-proposals', jobId, f],
  contracts: (f) => ['client', 'contracts', f],
  contract: (id) => ['client', 'contract', id],
  milestones: (id) => ['client', 'milestones', id],
  wallet: ['client', 'wallet'],
  transactions: (f) => ['client', 'transactions', f],
  invoices: (f) => ['client', 'invoices', f],
  escrow: (id) => ['client', 'escrow', id],
  freelancers: (f) => ['client', 'freelancers', f],
  freelancer: (id) => ['client', 'freelancer', id],
  gigs: (f) => ['client', 'gigs', f],
  gig: (id) => ['client', 'gig', id],
  shortlist: (f) => ['client', 'shortlist', f],
  reviews: (f) => ['client', 'reviews', f],
  disputes: (f) => ['client', 'disputes', f],
  dispute: (id) => ['client', 'dispute', id],
  conversations: (f) => ['client', 'conversations', f],
  messages: (id, f) => ['client', 'messages', id, f],
  notifications: (f) => ['client', 'notifications', f],
  unreadCount: ['client', 'unread-count'],
  skillTests: ['client', 'skill-tests'],
  skillTestResults: ['client', 'skill-test-results'],
  referral: ['client', 'referral'],
  nda: (f) => ['client', 'nda', f],
  activityLog: (f) => ['client', 'activity-log', f],
  profile: ['client', 'profile'],
  tickets: (f) => ['client', 'tickets', f],
  ticket: (id) => ['client', 'ticket', id],
  analytics: (f) => ['client', 'analytics', f],
  orders: (f) => ['client', 'orders', f],
  subscription: ['client', 'subscription'],
  plans: ['client', 'plans'],
  interviews: (f) => ['client', 'interviews', f],
  team: ['client', 'team'],
  sessions: ['client', 'sessions'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const opts = (extra = {}) => ({ staleTime: 60_000, gcTime: 300_000, ...extra });
const shortOpts = (extra = {}) => ({ staleTime: 15_000, gcTime: 60_000, ...extra });

const onSuccess = (msg, invalidates, qc) => () => {
  if (msg) toast.success(msg);
  invalidates.forEach((key) => qc.invalidateQueries({ queryKey: key }));
};

const onError = (err) => toast.error(err?.message || err?.data?.message || 'Something went wrong');

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export const useClientDashboard = () =>
  useQuery({ queryKey: QK.dashboard, queryFn: api.getClientDashboardStats, ...opts() });

// ══════════════════════════════════════════════════════════════════════════════
// JOBS
// ══════════════════════════════════════════════════════════════════════════════
export const useMyJobs = (filters = {}) =>
  useQuery({ queryKey: QK.jobs(filters), queryFn: () => api.getMyJobs(filters), ...opts() });

export const useJobDetails = (jobId) =>
  useQuery({ queryKey: QK.job(jobId), queryFn: () => api.getJobDetails(jobId), enabled: !!jobId, ...opts() });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createJob,
    onSuccess: onSuccess('Job posted successfully!', [QK.jobs({})], qc),
    onError,
  });
};

export const useUpdateJob = (jobId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.updateJob(jobId, payload),
    onSuccess: onSuccess('Job updated!', [QK.job(jobId), QK.jobs({})], qc),
    onError,
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteJob,
    onSuccess: onSuccess('Job deleted.', [QK.jobs({})], qc),
    onError,
  });
};

export const useCancelJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.cancelJob,
    onSuccess: onSuccess('Job cancelled.', [QK.jobs({}), QK.dashboard], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// PROPOSALS
// ══════════════════════════════════════════════════════════════════════════════
export const useMyProposals = (filters = {}) =>
  useQuery({ queryKey: QK.proposals(filters), queryFn: () => api.getMyProposals(filters), ...opts() });

export const useProposalsForJob = (jobId, filters = {}) =>
  useQuery({
    queryKey: QK.jobProposals(jobId, filters),
    queryFn: () => api.getProposalsForJob(jobId, filters),
    enabled: !!jobId,
    ...opts(),
  });

export const useProposalDetails = (proposalId) =>
  useQuery({
    queryKey: QK.proposal(proposalId),
    queryFn: () => api.getProposalDetails(proposalId),
    enabled: !!proposalId,
    ...opts(),
  });

export const useAcceptProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.acceptProposal,
    onSuccess: onSuccess('Proposal accepted! Contract created.', [QK.proposals({}), QK.contracts({})], qc),
    onError,
  });
};

export const useRejectProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ proposalId, reason }) => api.rejectProposal(proposalId, reason),
    onSuccess: onSuccess('Proposal rejected.', [QK.proposals({})], qc),
    onError,
  });
};

export const useShortlistProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.shortlistProposal,
    onSuccess: onSuccess('Added to shortlist.', [QK.proposals({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// CONTRACTS
// ══════════════════════════════════════════════════════════════════════════════
export const useMyContracts = (filters = {}) =>
  useQuery({ queryKey: QK.contracts(filters), queryFn: () => api.getMyContracts(filters), ...opts() });

export const useContractDetails = (contractId) =>
  useQuery({
    queryKey: QK.contract(contractId),
    queryFn: () => api.getContractDetails(contractId),
    enabled: !!contractId,
    ...shortOpts(),
  });

export const useSignContract = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.signContract(contractId),
    onSuccess: onSuccess('Contract signed!', [QK.contract(contractId), QK.contracts({})], qc),
    onError,
  });
};

export const useTerminateContract = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason) => api.terminateContract(contractId, reason),
    onSuccess: onSuccess('Contract terminated.', [QK.contract(contractId), QK.contracts({})], qc),
    onError,
  });
};

export const useCancelContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, reason }) => api.cancelContract(contractId, reason),
    onSuccess: onSuccess('Contract cancelled.', [QK.contracts({}), QK.dashboard], qc),
    onError,
  });
};

// ── Milestones ────────────────────────────────────────────────────────────────
export const useContractMilestones = (contractId) =>
  useQuery({
    queryKey: QK.milestones(contractId),
    queryFn: () => api.getContractMilestones(contractId),
    enabled: !!contractId,
    ...shortOpts(),
  });

export const useAddMilestone = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.addMilestone(contractId, payload),
    onSuccess: onSuccess('Milestone added!', [QK.milestones(contractId)], qc),
    onError,
  });
};

export const useApproveMilestone = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId) => api.approveMilestone(contractId, milestoneId),
    onSuccess: onSuccess('Milestone approved! Payment released.', [QK.milestones(contractId), QK.wallet], qc),
    onError,
  });
};

export const useRejectMilestone = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, feedback }) => api.rejectMilestone(contractId, milestoneId, feedback),
    onSuccess: onSuccess('Milestone rejected with feedback.', [QK.milestones(contractId)], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// WALLET & FINANCES
// ══════════════════════════════════════════════════════════════════════════════
export const useWallet = () =>
  useQuery({ queryKey: QK.wallet, queryFn: api.getWallet, ...shortOpts() });

export const useTransactions = (filters = {}) =>
  useQuery({ queryKey: QK.transactions(filters), queryFn: () => api.getTransactions(filters), ...opts() });

export const useInvoices = (filters = {}) =>
  useQuery({ queryKey: QK.invoices(filters), queryFn: () => api.getInvoices(filters), ...opts() });

export const usePayInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.payInvoice,
    onSuccess: onSuccess('Invoice paid successfully!', [QK.invoices({})], qc),
    onError,
  });
};

export const useEscrow = (contractId) =>
  useQuery({
    queryKey: QK.escrow(contractId),
    queryFn: () => api.getEscrowDetails(contractId),
    enabled: !!contractId,
    ...shortOpts(),
  });

export const useFundEscrow = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId) => api.fundEscrow(contractId, milestoneId),
    onSuccess: onSuccess('Escrow funded!', [QK.escrow(contractId), QK.wallet], qc),
    onError,
  });
};

export const useReleaseEscrow = (contractId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId) => api.releaseEscrow(contractId, milestoneId),
    onSuccess: onSuccess('Payment released to freelancer!', [QK.escrow(contractId), QK.wallet], qc),
    onError,
  });
};

export const useDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.depositToWallet,
    onSuccess: onSuccess('Deposit initiated!', [QK.wallet, QK.transactions({})], qc),
    onError,
  });
};

export const useWithdraw = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.withdrawFromWallet,
    onSuccess: onSuccess('Withdrawal initiated!', [QK.wallet, QK.transactions({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// TALENT SEARCH
// ══════════════════════════════════════════════════════════════════════════════
export const useFreelancers = (filters = {}) =>
  useQuery({ queryKey: QK.freelancers(filters), queryFn: () => api.searchFreelancers(filters), ...opts() });

export const useFreelancerProfile = (userId) =>
  useQuery({
    queryKey: QK.freelancer(userId),
    queryFn: () => api.getFreelancerProfile(userId),
    enabled: !!userId,
    ...opts(),
  });

export const useGigs = (filters = {}) =>
  useQuery({ queryKey: QK.gigs(filters), queryFn: () => api.searchGigs(filters), ...opts() });

export const useGigDetails = (gigId) =>
  useQuery({ queryKey: QK.gig(gigId), queryFn: () => api.getGigDetails(gigId), enabled: !!gigId, ...opts() });

export const useOrderGig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ gigId, payload }) => api.orderGig(gigId, payload),
    onSuccess: onSuccess('Order placed!', [QK.orders({})], qc),
    onError,
  });
};

export const useShortlist = (filters = {}) =>
  useQuery({ queryKey: QK.shortlist(filters), queryFn: () => api.getShortlist(filters), ...opts() });

export const useAddToShortlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addToShortlist,
    onSuccess: onSuccess('Added to shortlist!', [QK.shortlist({})], qc),
    onError,
  });
};

export const useRemoveFromShortlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.removeFromShortlist,
    onSuccess: onSuccess('Removed from shortlist.', [QK.shortlist({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════════════════════
export const useMyReviews = (filters = {}) =>
  useQuery({ queryKey: QK.reviews(filters), queryFn: () => api.getMyReviews(filters), ...opts() });

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.submitReview,
    onSuccess: onSuccess('Review submitted! Thank you.', [QK.reviews({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// DISPUTES
// ══════════════════════════════════════════════════════════════════════════════
export const useMyDisputes = (filters = {}) =>
  useQuery({ queryKey: QK.disputes(filters), queryFn: () => api.getMyDisputes(filters), ...opts() });

export const useDisputeDetails = (disputeId) =>
  useQuery({
    queryKey: QK.dispute(disputeId),
    queryFn: () => api.getDisputeDetails(disputeId),
    enabled: !!disputeId,
    ...opts(),
  });

export const useOpenDispute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.openDispute,
    onSuccess: onSuccess('Dispute opened. Our team will review within 48h.', [QK.disputes({})], qc),
    onError,
  });
};

export const useSubmitDisputeEvidence = (disputeId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.submitDisputeEvidence(disputeId, payload),
    onSuccess: onSuccess('Evidence submitted!', [QK.dispute(disputeId)], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// MESSAGES / CHAT
// ══════════════════════════════════════════════════════════════════════════════
export const useConversations = (filters = {}) =>
  useQuery({ queryKey: QK.conversations(filters), queryFn: () => api.getConversations(filters), ...shortOpts() });

export const useMessages = (conversationId, filters = {}) =>
  useQuery({
    queryKey: QK.messages(conversationId, filters),
    queryFn: () => api.getMessages(conversationId, filters),
    enabled: !!conversationId,
    ...shortOpts({ refetchInterval: 10_000 }),
  });

export const useSendMessage = (conversationId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ content, type }) => api.sendMessage(conversationId, content, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.messages(conversationId, {}) }),
    onError,
  });
};

export const useStartConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.startConversation,
    onSuccess: onSuccess(null, [QK.conversations({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════
export const useNotifications = (filters = {}) =>
  useQuery({ queryKey: QK.notifications(filters), queryFn: () => api.getNotifications(filters), ...shortOpts() });

export const useUnreadCount = () =>
  useQuery({ queryKey: QK.unreadCount, queryFn: api.getUnreadCount, staleTime: 10_000, refetchInterval: 30_000 });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications({}) });
      qc.invalidateQueries({ queryKey: QK.unreadCount });
    },
    onError,
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', 'notifications'] });
      qc.invalidateQueries({ queryKey: QK.unreadCount });
      toast.success('All notifications marked as read.');
    },
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// SKILL ASSESSMENTS
// ══════════════════════════════════════════════════════════════════════════════
export const useSkillTests = () =>
  useQuery({ queryKey: QK.skillTests, queryFn: api.getSkillTests, ...opts() });

export const useSkillTestResults = () =>
  useQuery({ queryKey: QK.skillTestResults, queryFn: api.getSkillTestResults, ...opts() });

// ══════════════════════════════════════════════════════════════════════════════
// REFERRALS / AFFILIATES
// ══════════════════════════════════════════════════════════════════════════════
export const useReferralSummary = () =>
  useQuery({ queryKey: QK.referral, queryFn: api.getReferralSummary, ...opts() });

// ══════════════════════════════════════════════════════════════════════════════
// NDA / ACTIVITY / AUDIT
// ══════════════════════════════════════════════════════════════════════════════
export const useNdaDocuments = (filters = {}) =>
  useQuery({ queryKey: QK.nda(filters), queryFn: () => api.getNdaDocuments(filters), ...opts() });

export const useWorkspaceActivityLog = (filters = {}) =>
  useQuery({ queryKey: QK.activityLog(filters), queryFn: () => api.getWorkspaceActivityLog(filters), ...shortOpts() });

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════════════════════════════════════
export const useMyProfile = () =>
  useQuery({ queryKey: QK.profile, queryFn: api.getMyProfile, ...opts() });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateMyProfile,
    onSuccess: onSuccess('Profile updated!', [QK.profile], qc),
    onError,
  });
};

export const useUpdateCompanyProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateCompanyProfile,
    onSuccess: onSuccess('Company profile updated!', [QK.profile], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// SUPPORT
// ══════════════════════════════════════════════════════════════════════════════
export const useSupportTickets = (filters = {}) =>
  useQuery({ queryKey: QK.tickets(filters), queryFn: () => api.getSupportTickets(filters), ...opts() });

export const useSupportTicket = (ticketId) =>
  useQuery({
    queryKey: QK.ticket(ticketId),
    queryFn: () => api.getSupportTicket(ticketId),
    enabled: !!ticketId,
    ...shortOpts(),
  });

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSupportTicket,
    onSuccess: onSuccess('Ticket created! Our team will respond within 24h.', [QK.tickets({})], qc),
    onError,
  });
};

export const useReplyTicket = (ticketId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message) => api.replySupportTicket(ticketId, message),
    onSuccess: onSuccess('Reply sent!', [QK.ticket(ticketId)], qc),
    onError,
  });
};

export const useCloseTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.closeSupportTicket,
    onSuccess: onSuccess('Ticket closed.', [QK.tickets({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
export const useClientAnalytics = (filters = {}) =>
  useQuery({ queryKey: QK.analytics(filters), queryFn: () => api.getClientAnalytics(filters), ...opts() });

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════════════════════
export const useMyOrders = (filters = {}) =>
  useQuery({ queryKey: QK.orders(filters), queryFn: () => api.getMyOrders(filters), ...opts() });

export const useApproveOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.approveOrderDelivery,
    onSuccess: onSuccess('Order approved!', [QK.orders({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION
// ══════════════════════════════════════════════════════════════════════════════
export const useMySubscription = () =>
  useQuery({ queryKey: QK.subscription, queryFn: api.getMySubscription, ...opts() });

export const useSubscriptionPlans = () =>
  useQuery({ queryKey: QK.plans, queryFn: api.getSubscriptionPlans, staleTime: 3_600_000 });

export const useUpgradeSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upgradeSubscription,
    onSuccess: onSuccess('Subscription upgraded!', [QK.subscription], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// INTERVIEWS
// ══════════════════════════════════════════════════════════════════════════════
export const useInterviews = (filters = {}) =>
  useQuery({ queryKey: QK.interviews(filters), queryFn: () => api.getInterviews(filters), ...opts() });

export const useScheduleInterview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.scheduleInterview,
    onSuccess: onSuccess('Interview scheduled!', [QK.interviews({})], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// TEAM MEMBERS (SME / CORPORATE)
// ══════════════════════════════════════════════════════════════════════════════
export const useClientTeamMembers = () =>
  useQuery({ queryKey: QK.team, queryFn: api.getClientTeamMembers, ...opts() });

export const useInviteTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.inviteTeamMember,
    onSuccess: onSuccess('Invitation sent successfully!', [QK.team], qc),
    onError,
  });
};

export const useRemoveTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.removeTeamMember,
    onSuccess: onSuccess('Team member removed.', [QK.team], qc),
    onError,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVE SESSIONS
// ══════════════════════════════════════════════════════════════════════════════
export const useSessions = () =>
  useQuery({ queryKey: QK.sessions, queryFn: () => authAPI.getSessions(), ...shortOpts() });

export const useRevokeSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) => authAPI.revokeSession(sessionId),
    onSuccess: onSuccess('Session revoked successfully.', [QK.sessions], qc),
    onError,
  });
};

// ── Re-export legacy names for backwards compat ──────────────────────────────
export { useMyContracts as useClientContracts };
export { useMyJobs as useClientJobs };
export { useWallet as useClientWallet };
export { useTransactions as useClientTransactions };
export { useMyProposals as useClientProposals };

export const useClientPublicProfile = (id) => useQuery({ queryKey: ['client', 'public-profile', id], queryFn: () => api.getClientPublicProfile(id), enabled: !!id });

export const useInviteFreelancer = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({jobId, payload}) => api.inviteFreelancer(jobId, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['client', 'jobs'] }); } }); };
