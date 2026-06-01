import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  fetchTransactions,
  fetchTransaction,
  fetchPendingWithdrawals,
  fetchRevenueReport,
  fetchEscrowSummary,
  approveWithdrawal,
  rejectWithdrawal,
  freezeWallet,
  unfreezeWallet,
  fetchFeeRules,
  createFeeRule,
  toggleFeeRule,
  runReconciliation,
} from '../api/financial.api';
import useFinancialStore from '../store/financialStore';

export function useTransactions() {
  const { filters } = useFinancialStore();
  const params = { ...filters, page: 1, limit: 20 };

  return useQuery({
    queryKey: ['financial', 'transactions', params],
    queryFn: () => fetchTransactions(params),
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useTransaction(txId) {
  return useQuery({
    queryKey: ['financial', 'transaction', txId],
    queryFn: () => fetchTransaction(txId),
    enabled: !!txId,
    staleTime: 60_000,
  });
}

export function usePendingWithdrawals() {
  return useQuery({
    queryKey: ['financial', 'withdrawals', 'pending'],
    queryFn: () => fetchPendingWithdrawals(),
    staleTime: 60_000,
  });
}

export function useRevenueReport(fromDate, toDate) {
  return useQuery({
    queryKey: ['financial', 'revenue', fromDate, toDate],
    queryFn: () => fetchRevenueReport(fromDate, toDate),
    staleTime: 5 * 60_000,
  });
}

export function useEscrowSummary() {
  return useQuery({
    queryKey: ['financial', 'escrow', 'summary'],
    queryFn: () => fetchEscrowSummary(),
    staleTime: 60_000,
  });
}

export function useFeeRules() {
  return useQuery({
    queryKey: ['financial', 'fees'],
    queryFn: () => fetchFeeRules(),
    staleTime: 60_000,
  });
}

export function useFinancialActions() {
  const queryClient = useQueryClient();

  const invalidateFinancial = () => {
    queryClient.invalidateQueries({ queryKey: ['financial'] });
  };

  const approveWd = useMutation({
    mutationFn: ({ wdId, reason }) => approveWithdrawal(wdId, { reason }),
    onSuccess: () => {
      invalidateFinancial();
      toast.success('Withdrawal approved');
    },
    onError: (error) => toast.error(error.message || 'Failed to approve withdrawal'),
  });

  const rejectWd = useMutation({
    mutationFn: ({ wdId, reason }) => rejectWithdrawal(wdId, { reason }),
    onSuccess: () => {
      invalidateFinancial();
      toast.success('Withdrawal rejected');
    },
    onError: (error) => toast.error(error.message || 'Failed to reject withdrawal'),
  });

  const freezeWl = useMutation({
    mutationFn: ({ walletId, mfaToken }) => freezeWallet(walletId, mfaToken),
    onSuccess: () => {
      invalidateFinancial();
      toast.success('Wallet frozen');
    },
    onError: (error) => toast.error(error.message || 'Failed to freeze wallet'),
  });

  const unfreezeWl = useMutation({
    mutationFn: ({ walletId, mfaToken }) => unfreezeWallet(walletId, mfaToken),
    onSuccess: () => {
      invalidateFinancial();
      toast.success('Wallet unfrozen');
    },
    onError: (error) => toast.error(error.message || 'Failed to unfreeze wallet'),
  });

  const toggleFee = useMutation({
    mutationFn: ({ ruleId, mfaToken }) => toggleFeeRule(ruleId, mfaToken),
    onSuccess: () => {
      invalidateFinancial();
      toast.success('Fee rule updated');
    },
    onError: (error) => toast.error(error.message || 'Failed to update fee rule'),
  });

  const reconcile = useMutation({
    mutationFn: ({ mfaToken }) => runReconciliation(mfaToken),
    onSuccess: (data) => {
      invalidateFinancial();
      if (data?.status === 'PASS') {
        toast.success('Global Reconciliation Passed! No mismatches found.');
      } else {
        toast.error(`Reconciliation Failed! Found ${data?.discrepancies?.length} mismatches.`);
      }
    },
    onError: (error) => toast.error(error.message || 'Failed to run reconciliation'),
  });

  return {
    approveWithdrawal: approveWd,
    rejectWithdrawal: rejectWd,
    freezeWallet: freezeWl,
    unfreezeWallet: unfreezeWl,
    toggleFeeRule: toggleFee,
    runReconciliation: reconcile,
    invalidateFinancial,
  };
}