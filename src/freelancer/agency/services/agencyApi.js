const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () =>
  localStorage.getItem('accessToken') ||
  localStorage.getItem('token') ||
  (() => {
    try { return JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token; } catch { return null; }
  })();

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  let body;
  try { body = await res.json(); } catch { body = {}; }

  if (!res.ok) {
    const msg = body?.message || body?.error || `HTTP ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, data: body });
  }

  return body;
}

const list = (value) => Array.isArray(value) ? value : [];
const unwrap = (response) => response?.data ?? response;
const unwrapList = (response) => list(response?.data ?? response?.items ?? response?.results ?? response);
const unwrapPaged = (response) => ({
  items: list(response?.data?.items ?? response?.data ?? response?.items ?? response?.results ?? []),
  total: response?.data?.total ?? response?.total ?? response?.data?.length ?? 0,
  page: response?.data?.page ?? response?.page ?? 1,
  totalPages: response?.data?.totalPages ?? response?.totalPages ?? 1,
  meta: response?.meta ?? null,
});

export async function getAgencyDashboard() {
  const [dashboard, analytics, contracts] = await Promise.all([
    apiFetch('/agency/dashboard'),
    apiFetch('/agency/analytics'),
    apiFetch('/agency/contracts'),
  ]);

  return {
    dashboard: unwrap(dashboard),
    analytics: unwrap(analytics),
    contracts: unwrapList(contracts),
  };
}

export async function getAgencyTeam(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/team${qs ? `?${qs}` : ''}`));
}

export async function inviteAgencyTeamMember(payload) {
  return unwrap(await apiFetch('/agency/team/invite', {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
}

export async function removeAgencyTeamMember(memberId) {
  return unwrap(await apiFetch(`/agency/team/${memberId}`, { method: 'DELETE' }));
}

export async function updateAgencyTeamMemberRole(memberId, payload) {
  return unwrap(await apiFetch(`/agency/team/${memberId}/role`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }));
}

export async function suspendAgencyTeamMember(memberId, payload = {}) {
  return unwrap(await apiFetch(`/agency/team/${memberId}/suspend`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }));
}

export async function reactivateAgencyTeamMember(memberId) {
  return unwrap(await apiFetch(`/agency/team/${memberId}/reactivate`, { method: 'PATCH' }));
}

export async function getAgencyRoles() {
  return unwrapList(await apiFetch('/agency/roles'));
}

export async function createAgencyRole(payload) {
  return unwrap(await apiFetch('/agency/roles', {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
}

export async function updateAgencyRole(roleId, payload) {
  return unwrap(await apiFetch(`/agency/roles/${roleId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }));
}

export async function deleteAgencyRole(roleId) {
  return unwrap(await apiFetch(`/agency/roles/${roleId}`, { method: 'DELETE' }));
}

export async function getAgencySharedFiles(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/files${qs ? `?${qs}` : ''}`));
}

export async function getAgencyPortfolio(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/portfolio${qs ? `?${qs}` : ''}`));
}

export async function getAgencyServices(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/services${qs ? `?${qs}` : ''}`));
}

export async function getAgencyBilling() {
  return unwrap(await apiFetch('/agency/billing'));
}

export async function getAgencyInvoices(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/invoices${qs ? `?${qs}` : ''}`));
}

export async function getAgencyEnterpriseContracts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/enterprise-contracts${qs ? `?${qs}` : ''}`));
}

export async function getAgencyContractApproval(contractId) {
  return unwrap(await apiFetch(`/agency/enterprise-contracts/${contractId}/approval`));
}

export async function getTeamAnalytics() {
  return unwrap(await apiFetch('/agency/team-analytics'));
}

export async function getRecruitmentPipeline(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/recruitment${qs ? `?${qs}` : ''}`));
}

export async function getTalentPool(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/talent-pool${qs ? `?${qs}` : ''}`));
}

export async function getAgencyProcurement(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return unwrapPaged(await apiFetch(`/agency/procurement${qs ? `?${qs}` : ''}`));
}

export async function getAgencySettings() {
  return unwrap(await apiFetch('/agency/settings'));
}

export async function getAgencyVerification() {
  return unwrap(await apiFetch('/agency/verification'));
}

export async function getAgencySharedProjects(params = {}) { return apiFetch('/api/agencies/shared-projects', { params }); }
export async function getAgencyWorkspace(params = {}) { return apiFetch('/api/agencies/workspace', { params }); }
export async function getAgencyDepartments(params = {}) { return apiFetch('/api/agencies/departments', { params }); }
export async function getAgencyTeamPermissions(params = {}) { return apiFetch('/api/agencies/team-permissions', { params }); }
export async function getAgencyFileManager(params = {}) { return apiFetch('/api/agencies/file-manager', { params }); }
export async function getAgencyUploadCenter(params = {}) { return apiFetch('/api/agencies/upload-center', { params }); }
export async function getAgencySharedAssets(params = {}) { return apiFetch('/api/agencies/shared-assets', { params }); }
export async function getAgencyDownloads(params = {}) { return apiFetch('/api/agencies/downloads', { params }); }

export async function getAgencyPublicProfile(agencyId) { return apiFetch('/api/agencies/public-profile', { params: { agencyId } }); }
