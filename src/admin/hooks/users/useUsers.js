import { useQuery } from '@tanstack/react-query';
import { fetchAllUsers } from '../../api/users/users.api';
import useUserManagementStore from '../../store/userManagementStore';

export function useUsers() {
  const { filters, pagination } = useUserManagementStore();
  const params = { ...filters.all, ...pagination.all };

  return useQuery({
    queryKey: ['users', 'all', params],
    queryFn: () => fetchAllUsers(params),
    staleTime: 60000,
    gcTime: 300000,
    placeholderData: (prev) => prev,
  });
}
