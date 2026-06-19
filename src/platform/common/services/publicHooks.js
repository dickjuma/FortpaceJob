import { useQuery } from '@tanstack/react-query';
import { publicAPI } from './api';

export const useTrendingCategories = () => {
  return useQuery({
    queryKey: ['trending-categories'],
    queryFn: async () => {
      const res = await publicAPI.getTrendingCategories();
      return Array.isArray(res?.categories) ? res.categories : Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useTopFreelancers = (limit = 10) => {
  return useQuery({
    queryKey: ['top-freelancers', limit],
    queryFn: async () => {
      const res = await publicAPI.searchFreelancers({ sort: 'rating', order: 'desc', limit });
      return Array.isArray(res?.talents) ? res.talents : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchFreelancers = (queryParams) => {
  return useQuery({
    queryKey: ['search-freelancers', queryParams],
    queryFn: async () => {
      const res = await publicAPI.searchFreelancers(queryParams);
      return Array.isArray(res?.talents) ? res.talents : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    },
    enabled: !!queryParams && Object.keys(queryParams).length > 0,
    staleTime: 1000 * 60,
  });
};

export const usePlatformReviews = () => {
  return useQuery({
    queryKey: ['platform-reviews'],
    queryFn: async () => {
      try {
        const res = await publicAPI.getPlatformReviews();
        return Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      } catch (err) {
        console.warn('Platform reviews API unavailable, falling back to empty state');
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useTrustedClients = () => {
  return useQuery({
    queryKey: ['trusted-clients'],
    queryFn: async () => {
      try {
        const res = await publicAPI.getTrustedClients();
        return Array.isArray(res) ? res : res?.data || [];
      } catch (err) {
        console.warn('Trusted clients API unavailable');
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useFeaturedGigs = (limit = 8) => {
  return useQuery({
    queryKey: ['featured-gigs', limit],
    queryFn: async () => {
      try {
        const res = await publicAPI.searchGigs({ limit, sortBy: 'rating' });
        return Array.isArray(res?.data) ? res.data : Array.isArray(res?.gigs) ? res.gigs : Array.isArray(res) ? res : [];
      } catch (err) {
        console.warn('Featured gigs API unavailable');
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
