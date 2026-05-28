import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useMarketplaceStore from '../store/marketplaceStore';
import { 
  fetchJobs, 
  fetchGigs, 
  fetchProposals, 
  fetchContracts, 
  fetchReviews, 
  fetchMarketplaceStats,
  approveJob,
  rejectJob,
  approveGig,
  removeGig,
  resolveFlaggedContent,
} from '../api/marketplace.api';

// Queries
export function useJobs() {
  const { filters, pagination } = useMarketplaceStore();
  const params = { ...filters.jobs, page: pagination.jobs, limit: 20 };

  return useQuery({
    queryKey: ['marketplace', 'jobs', params],
    queryFn: () => fetchJobs(params),
    staleTime: 60_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev,
  });
}

export function useGigs() {
  const { filters, pagination } = useMarketplaceStore();
  const params = { ...filters.gigs, page: pagination.gigs, limit: 20 };

  return useQuery({
    queryKey: ['marketplace', 'gigs', params],
    queryFn: () => fetchGigs(params),
    staleTime: 60_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev,
  });
}

export function useProposals() {
  const { filters, pagination } = useMarketplaceStore();
  const params = { ...filters.proposals, page: pagination.proposals, limit: 20 };

  return useQuery({
    queryKey: ['marketplace', 'proposals', params],
    queryFn: () => fetchProposals(params),
    staleTime: 60_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev,
  });
}

export function useContracts() {
  const { filters, pagination } = useMarketplaceStore();
  const params = { ...filters.contracts, page: pagination.contracts, limit: 20 };

  return useQuery({
    queryKey: ['marketplace', 'contracts', params],
    queryFn: () => fetchContracts(params),
    staleTime: 60_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev,
  });
}

export function useReviews() {
  const { filters, pagination } = useMarketplaceStore();
  const params = { ...filters.reviews, page: pagination.reviews, limit: 20 };

  return useQuery({
    queryKey: ['marketplace', 'reviews', params],
    queryFn: () => fetchReviews(params),
    staleTime: 60_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev,
  });
}

export function useMarketplaceStats() {
  return useQuery({
    queryKey: ['marketplace', 'stats'],
    queryFn: () => fetchMarketplaceStats(),
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

// Actions
export function useMarketplaceActions() {
  const queryClient = useQueryClient();

  const invalidateMarketplace = () => {
    queryClient.invalidateQueries({ queryKey: ['marketplace'] });
  };

  const flagItem = useMutation({
    mutationFn: async ({ id, type, reason, notes }) => {
      if (type === 'review' || type === 'content') {
        return resolveFlaggedContent(id, { action: 'FLAG', reason: notes || reason });
      }
      throw new Error('Flagging this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully flagged for review');
    },
    onError: (error) => toast.error(error.message || 'Failed to flag item'),
  });

  const approveItem = useMutation({
    mutationFn: async ({ id, type, reason }) => {
      if (type === 'job') return approveJob(id, { reason });
      if (type === 'gig') return approveGig(id);
      if (type === 'review' || type === 'content') {
        return resolveFlaggedContent(id, { action: 'ALLOW', reason });
      }
      throw new Error('Approving this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully approved');
    },
    onError: (error) => toast.error(error.message || 'Failed to approve item'),
  });

  const deleteItem = useMutation({
    mutationFn: async ({ id, type, reason }) => {
      if (type === 'job') return rejectJob(id, { reason });
      if (type === 'gig') return removeGig(id, { reason });
      if (type === 'review' || type === 'content') {
        return resolveFlaggedContent(id, { action: 'REMOVE', reason });
      }
      throw new Error('Removing this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully deleted');
    },
    onError: (error) => toast.error(error.message || 'Failed to delete item'),
  });

  return {
    flagItem,
    approveItem,
    deleteItem,
    invalidateMarketplace
  };
}
