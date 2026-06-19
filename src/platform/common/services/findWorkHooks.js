import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../../../freelancer/services/freelancerApi';
import { publicAPI } from './api';

export function useFindWorkCategories() {
  return useQuery({
    queryKey: ['find-work', 'categories'],
    queryFn: async () => {
      // Fetch actual category taxonomy
      try {
        const raw = await publicAPI.getCategoryTree();
        return raw?.sections || raw?.data || raw;
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useFindWorkJobs(filters = {}, options = {}) {
  return useQuery({
    queryKey: ['find-work', 'jobs', filters],
    queryFn: async () => {
      return api.searchFreelancerJobs(filters);
    },
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useFindWorkJob(jobId, options = {}) {
  return useQuery({
    queryKey: ['find-work', 'job', jobId],
    queryFn: async () => {
      return api.getFreelancerJobById(jobId);
    },
    enabled: Boolean(jobId),
    staleTime: 1000 * 60,
    ...options,
  });
}

export function useFeaturedFindWorkJobs(limit = 3) {
  return useQuery({
    queryKey: ['find-work', 'featured', limit],
    queryFn: async () => {
      return api.searchFreelancerJobs({ limit, featured: true });
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useFindWorkStats() {
  return useQuery({
    queryKey: ['find-work', 'stats'],
    queryFn: async () => {
      // Fallback for stats until backend implements it
      return { onlineJobs: 1204, localJobs: 345, verifiedJobs: 890, urgentJobs: 120 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useInvalidateFindWork() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['find-work'] });
}
