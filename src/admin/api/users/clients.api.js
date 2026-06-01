import { fetchAllUsers } from './users.api.js';

export async function fetchClients(params = {}) {
  return fetchAllUsers({ ...params, userGroup: 'client' });
}
