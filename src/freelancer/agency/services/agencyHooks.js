import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './agencyApi';

export const useAgencyDashboard = () => useQuery({
  queryKey: ['agency', 'dashboard'],
  queryFn: api.getAgencyDashboard,
});

export const useAgencyTeam = (params) => useQuery({
  queryKey: ['agency', 'team', params],
  queryFn: () => api.getAgencyTeam(params),
  keepPreviousData: true,
});

export const useInviteAgencyMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.inviteAgencyTeamMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'team'] }),
  });
};

export const useRemoveAgencyMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.removeAgencyTeamMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'team'] }),
  });
};

export const useUpdateAgencyMemberRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, payload }) => api.updateAgencyTeamMemberRole(memberId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'team'] }),
  });
};

export const useSuspendAgencyMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, payload }) => api.suspendAgencyTeamMember(memberId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'team'] }),
  });
};

export const useReactivateAgencyMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.reactivateAgencyTeamMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'team'] }),
  });
};

export const useAgencyRoles = () => useQuery({
  queryKey: ['agency', 'roles'],
  queryFn: api.getAgencyRoles,
});

export const useCreateAgencyRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createAgencyRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'roles'] }),
  });
};

export const useUpdateAgencyRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, payload }) => api.updateAgencyRole(roleId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'roles'] }),
  });
};

export const useDeleteAgencyRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAgencyRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agency', 'roles'] }),
  });
};

export const useAgencySharedFiles = (params) => useQuery({
  queryKey: ['agency', 'files', params],
  queryFn: () => api.getAgencySharedFiles(params),
  keepPreviousData: true,
});

export const useAgencyPortfolio = (params) => useQuery({
  queryKey: ['agency', 'portfolio', params],
  queryFn: () => api.getAgencyPortfolio(params),
  keepPreviousData: true,
});

export const useAgencyServices = (params) => useQuery({
  queryKey: ['agency', 'services', params],
  queryFn: () => api.getAgencyServices(params),
  keepPreviousData: true,
});

export const useAgencyBilling = () => useQuery({
  queryKey: ['agency', 'billing'],
  queryFn: api.getAgencyBilling,
});

export const useAgencyInvoices = (params) => useQuery({
  queryKey: ['agency', 'invoices', params],
  queryFn: () => api.getAgencyInvoices(params),
  keepPreviousData: true,
});

export const useAgencyEnterpriseContracts = (params) => useQuery({
  queryKey: ['agency', 'enterprise-contracts', params],
  queryFn: () => api.getAgencyEnterpriseContracts(params),
  keepPreviousData: true,
});

export const useAgencyContractApproval = (contractId) => useQuery({
  queryKey: ['agency', 'contract-approval', contractId],
  queryFn: () => api.getAgencyContractApproval(contractId),
  enabled: Boolean(contractId),
});

export const useTeamAnalytics = () => useQuery({
  queryKey: ['agency', 'team-analytics'],
  queryFn: api.getTeamAnalytics,
});

export const useRecruitmentPipeline = (params) => useQuery({
  queryKey: ['agency', 'recruitment', params],
  queryFn: () => api.getRecruitmentPipeline(params),
  keepPreviousData: true,
});

export const useTalentPool = (params) => useQuery({
  queryKey: ['agency', 'talent-pool', params],
  queryFn: () => api.getTalentPool(params),
  keepPreviousData: true,
});

export const useAgencyProcurement = (params) => useQuery({
  queryKey: ['agency', 'procurement', params],
  queryFn: () => api.getAgencyProcurement(params),
  keepPreviousData: true,
});

export const useAgencySettings = () => useQuery({
  queryKey: ['agency', 'settings'],
  queryFn: api.getAgencySettings,
});

export const useAgencyVerification = () => useQuery({
  queryKey: ['agency', 'verification'],
  queryFn: api.getAgencyVerification,
});

export const useAgencySharedProjects = (params) => useQuery({ queryKey: ['agency', 'shared-projects', params], queryFn: () => api.getAgencySharedProjects(params) });
export const useAgencyWorkspace = (params) => useQuery({ queryKey: ['agency', 'workspace', params], queryFn: () => api.getAgencyWorkspace(params) });
export const useAgencyDepartments = (params) => useQuery({ queryKey: ['agency', 'departments', params], queryFn: () => api.getAgencyDepartments(params) });
export const useAgencyTeamPermissions = (params) => useQuery({ queryKey: ['agency', 'team-permissions', params], queryFn: () => api.getAgencyTeamPermissions(params) });
export const useAgencyFileManager = (params) => useQuery({ queryKey: ['agency', 'file-manager', params], queryFn: () => api.getAgencyFileManager(params) });
export const useAgencyUploadCenter = (params) => useQuery({ queryKey: ['agency', 'upload-center', params], queryFn: () => api.getAgencyUploadCenter(params) });
export const useAgencySharedAssets = (params) => useQuery({ queryKey: ['agency', 'shared-assets', params], queryFn: () => api.getAgencySharedAssets(params) });
export const useAgencyDownloads = (params) => useQuery({ queryKey: ['agency', 'downloads', params], queryFn: () => api.getAgencyDownloads(params) });

export const useAgencyPublicProfile = (agencyId) => useQuery({ queryKey: ['agency', 'public-profile', agencyId], queryFn: () => api.getAgencyPublicProfile(agencyId) });
