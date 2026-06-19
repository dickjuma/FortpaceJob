import { API_BASE_URL, getToken } from './api';

async function savedClient(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data.data !== undefined ? data.data : data;
}

export const savedAPI = {
  saveGig: (gigId) =>
    savedClient(`/gigs/${gigId}/save`, { method: 'POST' }),
  unsaveGig: (gigId) =>
    savedClient(`/gigs/${gigId}/save`, { method: 'DELETE' }),
  getSavedGigs: () => savedClient('/search/saved/gigs'),
  saveJob: (jobId) =>
    savedClient(`/search/find-work/job/${jobId}/save`, { method: 'POST' }),
  unsaveJob: (jobId) =>
    savedClient(`/search/find-work/job/${jobId}/save`, { method: 'DELETE' }),
  getSavedJobs: () => savedClient('/search/find-work/saved'),
};
