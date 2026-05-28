import { useQuery } from '@tanstack/react-query';
import { fetchFreelancers } from '../../api/users/freelancers.api';
import useUserManagementStore from '../../store/userManagementStore';

export function useFreelancers() {
  const { filters, pagination } = useUserManagementStore();
  const params = { ...filters.freelancers, ...pagination.freelancers };

  return useQuery({
    queryKey: ['users', 'freelancers', params],
    queryFn: () => fetchFreelancers(params),
    staleTime: 60000,
    placeholderData: (prev) => prev,
  });
}
