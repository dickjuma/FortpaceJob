import apiClient, { unwrapAdminResponse } from './apiClient';

const listTotal = async (path) => {
  const response = await apiClient.get(`${path}?limit=1`);
  const { data, meta } = unwrapAdminResponse(response);
  return meta?.total ?? (Array.isArray(data) ? data.length : 0);
};

export const fetchDashboardMetrics = async () => {
  const [
    totalUsers,
    activeJobs,
    fraudAlerts,
    activeDisputes,
    pendingWithdrawals,
    revenueReport,
    escrowReport,
  ] = await Promise.all([
    listTotal('/users'),
    listTotal('/marketplace/jobs'),
    listTotal('/fraud/reports'),
    listTotal('/disputes'),
    listTotal('/financial/withdrawals/pending'),
    apiClient.get('/financial/reports/revenue').then((response) => unwrapAdminResponse(response).data || {}),
    apiClient.get('/financial/reports/escrow-summary').then((response) => unwrapAdminResponse(response).data || {}),
  ]);

  return {
    totalUsers,
    activeJobs,
    totalRevenue: revenueReport.totalFees || 0,
    escrowBalance: escrowReport.activeEscrow || 0,
    fraudAlerts,
    activeDisputes,
    openTickets: 0,
    pendingWithdrawals,
    failedTransactions: 0,
    flaggedJobs: 0,
    reportedUsers: fraudAlerts,
    pendingReviews: 0,
    riskyUsers: fraudAlerts,
    suspiciousTransactions: 0,
    activeConversations: 0,
    reportedMessages: 0,
    pendingResponses: 0,
    systemHealth: null,
    onlineFreelancers: null,
    onlineClients: null,
  };
};

export const fetchActivityFeed = async (limit = 10) => {
  const response = await apiClient.get(`/fraud/anomalies?limit=${limit}`);
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
};

export const fetchAlerts = async () => {
  const response = await apiClient.get('/fraud/reports');
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
};

export const fetchRevenueChart = async () => {
  const response = await apiClient.get('/financial/reports/revenue');
  const { data } = unwrapAdminResponse(response);
  return [
    {
      label: 'Current',
      value: data?.totalFees || 0,
      secondaryValue: data?.totalVolume || 0,
    },
  ];
};

export const fetchFraudChart = async () => {
  const response = await apiClient.get('/fraud/reports');
  const { data } = unwrapAdminResponse(response);
  const total = Array.isArray(data) ? data.length : 0;
  return [{ label: 'Open', value: total }];
};
