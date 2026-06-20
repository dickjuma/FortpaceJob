import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useMarketplaceStore from '../store/marketplaceStore';
import { 
  fetchJobs, 
  fetchGigs,
  fetchOrders, 
  fetchProposals, 
  fetchContracts, 
  fetchReviews, 
  fetchMarketplaceStats,
  approveJob,
  rejectJob,
  forceJobStatus,
  approveGig,
  removeGig,
  featureGig,
  unfeatureGig,
  flagGig,
  refundOrder,
  resolveFlaggedContent,
  hideGig,
  suspendGig,
  activateGig,
  duplicateGig,
  fetchFlaggedContent,
  resolveFlaggedContentItem,
  request,
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

export function useOrders() {
  const { filters, pagination } = useMarketplaceStore();
  const params = { ...filters.orders, page: pagination.orders, limit: 20 };

  return useQuery({
    queryKey: ['marketplace', 'orders', params],
    queryFn: () => fetchOrders(params),
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

export function useFlaggedContent() {
  return useQuery({
    queryKey: ['marketplace', 'flagged-content'],
    queryFn: () => fetchFlaggedContent(),
    staleTime: 30_000,
  });
}

// Actions
export function useMarketplaceActions() {
  const queryClient = useQueryClient();

  const invalidateMarketplace = () => {
    queryClient.invalidateQueries({ queryKey: ['marketplace'] });
  };

  const flagItem = useMutation({
    mutationFn: async ({ id, type, reason }) => {
      if (type === 'review' || type === 'content') {
        return resolveFlaggedContent(id, { type, action: 'FLAG', reason });
      }
      if (type === 'gig') return flagGig(id, reason);
      if (type === 'job') {
        return request(`/jobs/admin/${id}/intervene`, {
          method: 'POST',
          body: JSON.stringify({ action: 'FLAG', notes: reason }),
        });
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
      if (type === 'job') return approveJob(id);
      if (type === 'gig') return approveGig(id);
      if (type === 'review' || type === 'content') {
        return resolveFlaggedContent(id, { type, action: 'ALLOW', reason });
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
      if (type === 'order') return refundOrder(id, reason);
      if (type === 'review' || type === 'content') {
        return resolveFlaggedContent(id, { type, action: 'REMOVE', reason });
      }
      throw new Error('Removing this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully deleted');
    },
    onError: (error) => toast.error(error.message || 'Failed to delete item'),
  });

  const removeItem = useMutation({
    mutationFn: async ({ id, type, reason }) => {
      if (type === 'gig') return removeGig(id, { reason });
      if (type === 'job') return rejectJob(id, { reason });
      throw new Error('Removing this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully removed');
    },
    onError: (error) => toast.error(error.message || 'Failed to remove item'),
  });

  const featureItem = useMutation({
    mutationFn: async ({ id, type }) => {
      if (type === 'job') return approveJob(id);
      if (type === 'gig') return featureGig(id);
      throw new Error('Featuring this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully featured');
    },
    onError: (error) => toast.error(error.message || 'Failed to feature item'),
  });

  const unfeatureItem = useMutation({
    mutationFn: async ({ id, type }) => {
      if (type === 'gig') return unfeatureGig(id);
      throw new Error('Unfeaturing this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item successfully unfeatured');
    },
    onError: (error) => toast.error(error.message || 'Failed to unfeature item'),
  });

  const forceStatus = useMutation({
    mutationFn: async ({ id, type, status, reason }) => {
      if (type === 'job') return forceJobStatus(id, status, reason);
      throw new Error('Forcing status on this item type is not exposed by the current backend API.');
    },
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Item status updated');
    },
    onError: (error) => toast.error(error.message || 'Failed to update item status'),
  });

  const pauseGigMutation = useMutation({
    mutationFn: suspendGig,
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Gig paused successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to pause gig'),
  });

  const activateGigMutation = useMutation({
    mutationFn: activateGig,
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Gig activated successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to activate gig'),
  });

  const hideGigMutation = useMutation({
    mutationFn: hideGig,
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Gig hidden from search');
    },
    onError: (error) => toast.error(error.message || 'Failed to hide gig'),
  });

  const duplicateGigMutation = useMutation({
    mutationFn: duplicateGig,
    onSuccess: () => {
      invalidateMarketplace();
      toast.success('Gig duplicated successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to duplicate gig'),
  });

  return {
    flagItem,
    approveItem,
    deleteItem,
    removeItem,
    featureItem,
    unfeatureItem,
    forceStatus,
    pauseGig: pauseGigMutation,
    activateGig: activateGigMutation,
    hideGig: hideGigMutation,
    duplicateGig: duplicateGigMutation,
    invalidateMarketplace
  };
}