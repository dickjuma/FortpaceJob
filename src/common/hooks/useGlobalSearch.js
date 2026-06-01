import { useQuery } from '@tanstack/react-query';
import { publicAPI } from '../services/api';

function normalizeList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.talents)) return res.talents;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.items)) return res.items;
  return [];
}

export function useGlobalSearch(query, activeTab, enabled = true) {
  const q = String(query || '').trim();

  const freelancersQuery = useQuery({
    queryKey: ['globalSearch', 'freelancers', q],
    queryFn: async () => {
      const res = await publicAPI.searchFreelancers({ q, limit: 24 });
      return normalizeList(res);
    },
    enabled: enabled && activeTab === 'freelancers' && q.length > 0,
    staleTime: 60_000,
  });

  const gigsQuery = useQuery({
    queryKey: ['globalSearch', 'gigs', q],
    queryFn: async () => {
      const res = await publicAPI.searchGigs({ q, limit: 24 });
      return normalizeList(res);
    },
    enabled: enabled && activeTab === 'services' && q.length > 0,
    staleTime: 60_000,
  });

  const jobsQuery = useQuery({
    queryKey: ['globalSearch', 'jobs', q],
    queryFn: async () => {
      const res = await publicAPI.searchJobs({ q, limit: 24 });
      return normalizeList(res);
    },
    enabled: enabled && activeTab === 'agencies' && q.length > 0,
    staleTime: 60_000,
  });

  const active =
    activeTab === 'freelancers'
      ? freelancersQuery
      : activeTab === 'services'
        ? gigsQuery
        : jobsQuery;

  return {
    freelancers: freelancersQuery.data || [],
    gigs: gigsQuery.data || [],
    jobs: jobsQuery.data || [],
    isLoading: active.isLoading,
    isError: active.isError,
    refetch: active.refetch,
  };
}
