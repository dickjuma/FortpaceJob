import apiClient, { unwrapAdminResponse } from '../../api/apiClient';

export const fetchTransactions = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await apiClient.get(`/financial/transactions${query ? `?${query}` : ''}`);
  const { data, meta } = unwrapAdminResponse(response);
  const list = Array.isArray(data) ? data : [];

  return {
    data: list,
    total: meta?.total ?? list.length,
    page: meta?.page ?? 1,
    totalPages: meta?.totalPages ?? 1,
  };
};

export const fetchFinancialStats = async () => {
  const [revenueResponse, escrowResponse, withdrawalsResponse] = await Promise.all([
    apiClient.get('/financial/reports/revenue'),
    apiClient.get('/financial/reports/escrow-summary'),
    apiClient.get('/financial/withdrawals/pending'),
  ]);

  const revenue = unwrapAdminResponse(revenueResponse).data || {};
  const escrow = unwrapAdminResponse(escrowResponse).data || {};
  const withdrawals = unwrapAdminResponse(withdrawalsResponse).data || [];

  return {
    revenue: { total: revenue.totalVolume || 0, trend: null },
    escrow: { total: escrow.activeEscrow || 0, active: null, pendingRelease: null },
    pendingWithdrawals: {
      amount: withdrawals.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      count: withdrawals.length,
    },
    platformFees: { total: revenue.totalFees || 0, trend: null },
    deposits: { total: 0, count: null },
    subscriptions: { mrr: 0, active: null },
    refunds: { total: 0, count: null },
    tax: { liability: 0, status: 'Not configured' },
  };
};
