import { fetchAllUsers } from './users.api.js';

export async function fetchFreelancers(params = {}) {
  return fetchAllUsers({ ...params, userGroup: 'freelancer' });
}
