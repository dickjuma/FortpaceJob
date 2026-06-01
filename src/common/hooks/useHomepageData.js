import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function fetchHomepage() {
  const res = await fetch(`${API_BASE}/search/homepage`);
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to load homepage');
  }
  return json.data || json;
}

export function useHomepageData() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: fetchHomepage,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 15,
  });
}
