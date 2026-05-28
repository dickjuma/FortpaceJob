import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '../../api/users/clients.api';
import useUserManagementStore from '../../store/userManagementStore';

export function useClients() {
  const { filters, pagination } = useUserManagementStore();
  const params = { ...filters.clients, ...pagination.clients };

  return useQuery({
    queryKey: ['users', 'clients', params],
    queryFn: () => fetchClients(params),
    staleTime: 60000,
    placeholderData: (prev) => prev,
  });
}
