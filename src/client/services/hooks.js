import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './clientApi.js';

const opts = (extra = {}) => ({ staleTime: 60_000, gcTime: 300_000, ...extra });

export const useClientDashboard = () =>
  useQuery({ queryKey: ['client', 'dashboard'], queryFn: api.getClientDashboardStats, ...opts() });

export const useClientContracts = (filters = {}) =>
  useQuery({ queryKey: ['client', 'contracts', filters], queryFn: () => api.getMyContracts(filters), ...opts() });

export const useClientJobs = (filters = {}) =>
  useQuery({ queryKey: ['client', 'jobs', filters], queryFn: () => api.getMyJobs(filters), ...opts() });

export const useClientProposals = (filters = {}) =>
  useQuery({ queryKey: ['client', 'proposals', filters], queryFn: () => api.getMyProposals(filters), ...opts() });

export const useClientWallet = () =>
  useQuery({ queryKey: ['client', 'wallet'], queryFn: api.getWallet, ...opts() });

export const useClientTransactions = (filters = {}) =>
  useQuery({ queryKey: ['client', 'transactions', filters], queryFn: () => api.getTransactions(filters), ...opts() });

export const useClientContract = (contractId) =>
  useQuery({
    queryKey: ['client', 'contract', contractId],
    queryFn: () => api.getContractDetails(contractId),
    enabled: !!contractId,
    ...opts(),
  });

export const useClientConversations = (filters = {}) =>
  useQuery({ queryKey: ['client', 'conversations', filters], queryFn: () => api.getConversations(filters), ...opts() });
