import apiClient, { unwrapAdminResponse } from './apiClient.js';

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
  const anomalies = Array.isArray(data) ? data : [];
  
  // Transform anomalies into activity feed format
  return anomalies.map(item => ({
    id: item.id || item._id,
    type: item.type || 'fraud_flag',
    actor: {
      id: item.adminId || item.userId,
      name: item.admin?.email || item.user?.email || 'System',
      avatar: item.admin?.avatar || item.user?.avatar,
    },
    title: item.title || item.action || 'Security Event Detected',
    description: item.description || item.message || 'Automated system detected potential fraud.',
    timestamp: item.createdAt || item.timestamp || Date.now(),
  }));
};

export const fetchAlerts = async () => {
  const response = await apiClient.get('/fraud/reports');
  const { data } = unwrapAdminResponse(response);
  return Array.isArray(data) ? data : [];
};

export const fetchRevenueChart = async (period = '30d') => {
  const response = await apiClient.get(`/financial/reports/revenue?period=${period}`);
  const { data } = unwrapAdminResponse(response);
  
  // Generate time-series data if API returns daily data, otherwise create fallback
  const dailyData = Array.isArray(data?.daily) ? data.daily : [];
  
  if (dailyData.length > 1) {
    return dailyData.map((d, i) => ({
      label: d.date || `Day ${i + 1}`,
      value: d.revenue || d.totalFees || 0,
      secondaryValue: d.fees || d.platformFees || 0,
    }));
  }
  
  // Fallback single data point with proper format
  return [
    {
      label: 'Total',
      value: data?.totalFees || data?.revenue || 0,
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