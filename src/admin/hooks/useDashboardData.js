import { useQuery } from '@tanstack/react-query';
import { fetchDashboardMetrics } from '../api/dashboard.api.js';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard_data'],
    queryFn: fetchDashboardMetrics,
    staleTime: 60 * 1000,
  });
};
