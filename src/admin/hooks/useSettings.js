import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../api/apiClient';
import toast from 'react-hot-toast';

export function useCompanySettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['settings', 'company'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/company');
      return unwrapAdminResponse(response).data;
    },
    staleTime: 60_000,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const response = await apiClient.put('/settings/company', updates);
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'company'] });
      toast.success('Company settings updated');
    },
    onError: (error) => toast.error(error?.message || 'Failed to update settings'),
  });

  return {
    companyDetails: data,
    isLoading,
    error,
    updateCompanyDetails: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}

export function useSecuritySettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['settings', 'security'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/security');
      return unwrapAdminResponse(response).data;
    },
    staleTime: 60_000,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const response = await apiClient.put('/settings/security', updates);
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'security'] });
      toast.success('Security settings updated');
    },
    onError: (error) => toast.error(error?.message || 'Failed to update security settings'),
  });

  return {
    securitySettings: data,
    isLoading,
    error,
    updateSecuritySettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}