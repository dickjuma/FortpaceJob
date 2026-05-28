import { fetchAllUsers } from './users.api';

export async function fetchClients(params = {}) {
  return fetchAllUsers({ ...params, userGroup: 'client' });
}
