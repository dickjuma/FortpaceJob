import { useQuery } from '@tanstack/react-query';
import { walletAPI } from '../services/api';

export function usePlatformFees() {
  return useQuery({
    queryKey: ['platform', 'fees'],
    queryFn: async () => {
      return walletAPI.getPublicFees();
    },
    staleTime: 60_000,
  });
}

export function useFeeCalculation(amount, context = {}, enabled = true) {
  return useQuery({
    queryKey: ['platform', 'fee-calc', amount, context],
    queryFn: async () => {
      return walletAPI.calculateFees(amount, context);
    },
    enabled: enabled && Number(amount) > 0,
    staleTime: 30_000,
  });
}
