import { useQuery } from '@tanstack/react-query';
import {
  loadTalentCategories,
  syncTalentWithBackend,
  getTalentCategories,
  getFeaturedTalent,
  getMarketplaceStats,
  getMarketplaceTalent,
} from '../../pages/find-talent/talentMarketplaceData';

export function useTalentCategories(kind = 'all') {
  return useQuery({
    queryKey: ['talent', 'categories', kind],
    queryFn: async () => {
      await loadTalentCategories();
      return getTalentCategories(kind);
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useFeaturedTalent(limit = 6, filters = {}) {
  return useQuery({
    queryKey: ['talent', 'featured', limit, filters],
    queryFn: async () => {
      await loadTalentCategories();
      await syncTalentWithBackend(filters);
      return getFeaturedTalent(limit);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useMarketplaceTalent(filters = {}) {
  return useQuery({
    queryKey: ['talent', 'list', filters],
    queryFn: async () => {
      await loadTalentCategories();
      await syncTalentWithBackend(filters);
      return getMarketplaceTalent(filters);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useTalentStats() {
  return useQuery({
    queryKey: ['talent', 'stats'],
    queryFn: async () => {
      await syncTalentWithBackend({ limit: 50 });
      return getMarketplaceStats();
    },
    staleTime: 1000 * 60 * 2,
  });
}
