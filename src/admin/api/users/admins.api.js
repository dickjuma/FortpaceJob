import { fetchAllUsers } from './users.api';

export async function fetchAdmins(params = {}) {
  return fetchAllUsers({ ...params, userGroup: 'admin' });
}
