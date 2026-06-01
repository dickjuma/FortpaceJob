import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchClientDashboardStats,
  fetchClientActiveContracts,
  fetchClientJobs,
  fetchClientProposals,
  fetchClientWallet,
  fetchClientTransactions,
} from './dashboard.api.js';

// Dashboard hooks
export const useClientDashboard = () => {
  return useQuery({
    queryKey: ['client', 'dashboard'],
    queryFn: fetchClientDashboardStats,
    staleTime: 60000,
    gcTime: 300000,
  });
};

export const useClientContracts = (filters) => {
  return useQuery({
    queryKey: ['client', 'contracts', filters],
    queryFn: () => fetchClientActiveContracts(filters),
    staleTime: 60000,
    gcTime: 300000,
  });
};

export const useClientJobs = (filters) => {
  return useQuery({
    queryKey: ['client', 'jobs', filters],
    queryFn: () => fetchClientJobs(filters),
    staleTime: 60000,
    gcTime: 300000,
  });
};

export const useClientProposals = (filters) => {
  return useQuery({
    queryKey: ['client', 'proposals', filters],
    queryFn: () => fetchClientProposals(filters),
    staleTime: 60000,
    gcTime: 300000,
  });
};

export const useClientWallet = () => {
  return useQuery({
    queryKey: ['client', 'wallet'],
    queryFn: fetchClientWallet,
    staleTime: 30000,
  });
};

export const useClientTransactions = (filters) => {
  return useQuery({
    queryKey: ['client', 'transactions', filters],
    queryFn: () => fetchClientTransactions(filters),
    staleTime: 60000,
  });
};

// Contracts hooks
export const useClientContract = (contractId) => {
  return useQuery({
    queryKey: ['client', 'contract', contractId],
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contracts/${contractId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch contract');
      return response.json();
    },
    enabled: !!contractId,
  });
};

// Messages hooks  
export const useClientConversations = () => {
  return useQuery({
    queryKey: ['client', 'conversations'],
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/chat`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
    staleTime: 30000,
  });
};