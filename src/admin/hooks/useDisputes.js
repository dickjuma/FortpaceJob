import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  fetchDisputes,
  fetchDispute,
  fetchDisputeEvidence,
  assignDisputeOutcome,
  escalateDispute,
  addDisputeNote,
  fetchDisputeAuditTrail,
} from '../api/disputes.api';
import useDisputeStore from '../store/disputeStore';

export function useDisputes() {
  const { filters } = useDisputeStore();
  const params = { ...filters, page: 1, limit: 20 };

  return useQuery({
    queryKey: ['disputes', params],
    queryFn: () => fetchDisputes(params),
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useDispute(disputeId) {
  return useQuery({
    queryKey: ['dispute', disputeId],
    queryFn: () => fetchDispute(disputeId),
    enabled: !!disputeId,
    staleTime: 60_000,
  });
}

export function useDisputeEvidence(disputeId) {
  return useQuery({
    queryKey: ['dispute', disputeId, 'evidence'],
    queryFn: () => fetchDisputeEvidence(disputeId),
    enabled: !!disputeId,
    staleTime: 60_000,
  });
}

export function useDisputeAuditTrail(disputeId) {
  return useQuery({
    queryKey: ['dispute', disputeId, 'audit-trail'],
    queryFn: () => fetchDisputeAuditTrail(disputeId),
    enabled: !!disputeId,
    staleTime: 60_000,
  });
}

export function useDisputeActions() {
  const queryClient = useQueryClient();

  const invalidateDisputes = () => {
    queryClient.invalidateQueries({ queryKey: ['disputes'] });
  };

  const resolveDispute = useMutation({
    mutationFn: ({ disputeId, outcome, splitPercentage, notes }) =>
      assignDisputeOutcome(disputeId, { outcome, splitPercentage, notes }),
    onSuccess: () => {
      invalidateDisputes();
      toast.success('Dispute resolved');
    },
    onError: (error) => toast.error(error.message || 'Failed to resolve dispute'),
  });

  const escalate = useMutation({
    mutationFn: ({ disputeId, reason, escalateTo }) =>
      escalateDispute(disputeId, { reason, escalateTo }),
    onSuccess: () => {
      invalidateDisputes();
      toast.success('Dispute escalated');
    },
    onError: (error) => toast.error(error.message || 'Failed to escalate dispute'),
  });

  const addNote = useMutation({
    mutationFn: ({ disputeId, note }) => addDisputeNote(disputeId, note),
    onSuccess: () => {
      invalidateDisputes();
      toast.success('Note added');
    },
    onError: (error) => toast.error(error.message || 'Failed to add note'),
  });

  return {
    resolveDispute,
    escalateDispute: escalate,
    addDisputeNote: addNote,
    invalidateDisputes,
  };
}