import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../common/services/api';

export const useBusinessVerification = () => {
  return useQuery({
    queryKey: ['business-verification'],
    queryFn: async () => {
      const res = await api.get('/api/business-verification');
      return res.data.data;
    },
  });
};

export const useSubmitBusinessVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/api/business-verification', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['business-verification']);
    },
  });
};
