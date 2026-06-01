export const CLIENT_ACCOUNT_TYPES = [
  { id: 'INDIVIDUAL', label: 'Individual', description: 'Hire for personal or one-off projects.' },
  { id: 'SME', label: 'SME', description: 'Small business hiring with team collaboration.' },
  { id: 'CORPORATE', label: 'Corporate', description: 'Enterprise procurement, approvals, and scale.' },
];

export const FREELANCER_ACCOUNT_TYPES = [
  { id: 'INDIVIDUAL', label: 'Individual', description: 'Solo professional offering services.' },
  { id: 'SME', label: 'SME / Agency', description: 'Small team or agency delivery.' },
  { id: 'CORPORATE', label: 'Corporate Studio', description: 'Large delivery organization.' },
];

export const FREELANCER_WORK_MODES = [
  { id: 'ONLINE', label: 'Online', description: 'Remote digital services worldwide.' },
  { id: 'OFFLINE', label: 'On-site', description: 'Local physical services and field work.' },
  { id: 'HYBRID', label: 'Hybrid', description: 'Both remote and on-site engagements.' },
];

export function normalizeClientType(value) {
  const upper = String(value || 'INDIVIDUAL').toUpperCase();
  if (upper === 'SME' || upper === 'CORPORATE' || upper === 'INDIVIDUAL') return upper;
  return 'INDIVIDUAL';
}

export function normalizeWorkMode(value) {
  const upper = String(value || 'ONLINE').toUpperCase();
  if (['ONLINE', 'OFFLINE', 'ONSITE', 'HYBRID'].includes(upper)) {
    return upper === 'ONSITE' ? 'OFFLINE' : upper;
  }
  return 'ONLINE';
}

export function workModeToFlags(mode) {
  const normalized = normalizeWorkMode(mode);
  return {
    isOnline: normalized === 'ONLINE' || normalized === 'HYBRID',
    isOffline: normalized === 'OFFLINE' || normalized === 'HYBRID',
    workMode: normalized,
  };
}
