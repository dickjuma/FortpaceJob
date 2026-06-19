import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchFinancialStats } from '../api/financial.api';
import useFinancialStore from '../store/financialStore';

export const useTransactions = () => {
  const filters = useFinancialStore((state) => state.filters.transactions);
  
  return useQuery({
    queryKey: ['financial', 'transactions', filters],
    queryFn: () => fetchTransactions(filters),
    keepPreviousData: true,
  });
};

export const useFinancialStats = () => {
  return useQuery({
    queryKey: ['financial', 'stats'],
    queryFn: fetchFinancialStats,
    refetchInterval: 30000, // Refetch every 30s
  });
};
