import { useQuery } from '@tanstack/react-query';
import { fetchAdmins } from '../../api/users/admins.api.js';
import useUserManagementStore from '../../store/userManagementStore.js';

export function useAdmins() {
  const { filters, pagination } = useUserManagementStore();
  const params = { ...filters.admins, ...pagination.admins };

  return useQuery({
    queryKey: ['users', 'admins', params],
    queryFn: () => fetchAdmins(params),
    staleTime: 60000,
    placeholderData: (prev) => prev,
  });
}
