import { fetchAllUsers } from './users.api';

export async function fetchFreelancers(params = {}) {
  return fetchAllUsers({ ...params, userGroup: 'freelancer' });
}
