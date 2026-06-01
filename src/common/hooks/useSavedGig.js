import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedAPI } from '../services/savedApi';
import notify from '../utils/notify';

export function useSavedGigIds() {
  return useQuery({
    queryKey: ['saved', 'gigs'],
    queryFn: async () => {
      const res = await savedAPI.getSavedGigs();
      const ids = res?.gigIds || (res?.items || res?.data || []).map((g) => g.id);
      return new Set(ids.filter(Boolean));
    },
    staleTime: 30_000,
  });
}

export function useToggleSaveGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ gigId, saved }) => {
      if (saved) return savedAPI.unsaveGig(gigId);
      return savedAPI.saveGig(gigId);
    },
    onSuccess: (_data, { saved }) => {
      qc.invalidateQueries({ queryKey: ['saved', 'gigs'] });
      notify.success(saved ? 'Removed from saved' : 'Saved to favorites');
    },
    onError: (e) => notify.error(e.message || 'Could not update saved list'),
  });
}
