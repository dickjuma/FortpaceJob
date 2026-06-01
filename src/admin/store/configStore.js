import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../api/apiClient';
import toast from 'react-hot-toast';

const useCompanySettings = () => {
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
    companyDetails: data || {
      name: 'ForteSpace',
      address: '123 Innovation Tower, Nairobi, Kenya',
      website: 'www.fortespace.com',
      email: 'billing@fortespace.com',
      taxId: 'P051234567Z',
      footerMessage: 'Forte Space is the premier freelance marketplace empowering the next generation of digital talent.',
    },
    isLoading,
    error,
    updateCompanyDetails: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

const useConfigStore = create((set, get) => ({
  companyDetails: {
    name: 'ForteSpace',
    address: '123 Innovation Tower, Nairobi, Kenya',
    website: 'www.fortespace.com',
    email: 'billing@fortespace.com',
    taxId: 'P051234567Z',
    footerMessage: 'Forte Space is the premier freelance marketplace empowering the next generation of digital talent.',
  },
  
  updateCompanyDetails: (newDetails) => {
    set((state) => ({
      companyDetails: { ...state.companyDetails, ...newDetails }
    }));
  },
}));

export { useCompanySettings };
export default useConfigStore;