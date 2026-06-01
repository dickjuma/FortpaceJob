import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../api/apiClient';
import toast from 'react-hot-toast';

export function useSocialSettings() {
  const queryClient = useQueryClient();

  const { data: socialLinks = [], isLoading } = useQuery({
    queryKey: ['settings', 'social'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/social');
      return unwrapAdminResponse(response).data || [];
    },
    staleTime: 60_000,
  });

  const updateMutation = useMutation({
    mutationFn: async (links) => {
      const response = await apiClient.put('/settings/social', links);
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'social'] });
      toast.success('Social links updated');
    },
    onError: (e) => toast.error(e?.message || 'Failed to save social links'),
  });

  return {
    socialLinks,
    isLoading,
    saveSocialLinks: updateMutation.mutate,
    isSaving: updateMutation.isPending,
  };
}
