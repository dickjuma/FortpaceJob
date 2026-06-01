import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  loadFindWorkCategories,
  syncJobsWithBackend,
  getFindWorkJobs,
  getFindWorkJobById,
  getFeaturedFindWorkJobs,
  getFindWorkStats,
  getFindWorkCategories,
} from '../../pages/find-work/findWorkData';

export function useFindWorkCategories() {
  return useQuery({
    queryKey: ['find-work', 'categories'],
    queryFn: async () => {
      await loadFindWorkCategories();
      return getFindWorkCategories();
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useFindWorkJobs(filters = {}, options = {}) {
  return useQuery({
    queryKey: ['find-work', 'jobs', filters],
    queryFn: async () => {
      await loadFindWorkCategories();
      await syncJobsWithBackend(filters);
      return getFindWorkJobs(filters);
    },
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useFindWorkJob(jobId, options = {}) {
  return useQuery({
    queryKey: ['find-work', 'job', jobId],
    queryFn: async () => {
      await loadFindWorkCategories();
      await syncJobsWithBackend({ limit: 100 });
      return getFindWorkJobById(jobId);
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
      await loadFindWorkCategories();
      await syncJobsWithBackend({ limit: 50 });
      return getFeaturedFindWorkJobs(limit);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useFindWorkStats() {
  return useQuery({
    queryKey: ['find-work', 'stats'],
    queryFn: async () => {
      await syncJobsWithBackend({ limit: 100 });
      return getFindWorkStats();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useInvalidateFindWork() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['find-work'] });
}
