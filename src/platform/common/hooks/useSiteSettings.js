import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function fetchPublicSettings() {
  const res = await fetch(`${API_BASE}/settings/public`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load site settings');
  return json.data || json;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site', 'public-settings'],
    queryFn: fetchPublicSettings,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
