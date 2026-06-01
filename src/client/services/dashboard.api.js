import { getToken } from '../../common/services/api.js';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'API request failed');
  }

  return response.json();
};

const normalizeList = (data) => Array.isArray(data) ? data : [];

// Dashboard stats - aggregated from contracts and jobs
export async function fetchClientDashboardStats() {
  try {
    const [contracts, jobs, wallet] = await Promise.all([
      apiFetch('/profilesystem/client/contracts?limit=100'),
      apiFetch('/profilesystem/client/jobs?limit=100'),
      apiFetch('/escorow_wallet/wallet'),
    ]);

    const contractsData = normalizeList(contracts.data || contracts);
    const jobsData = normalizeList(jobs.data || jobs);
    const walletData = wallet.data || wallet;

    return {
      overview: {
        totalSpent: contractsData.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
        totalJobs: jobsData.length,
        openJobs: jobsData.filter(j => j.status === 'OPEN').length,
      },
      contracts: {
        active: contractsData.filter(c => c.status === 'ACTIVE').length,
        completed: contractsData.filter(c => c.status === 'COMPLETED').length,
      },
      wallet: walletData,
    };
  } catch {
    return { totalSpent: 0, totalJobs: 0, openJobs: 0, contracts: { active: 0, completed: 0 }, wallet: {} };
  }
}

// Contracts from client routes
export async function fetchClientActiveContracts() {
  const response = await apiFetch('/profilesystem/client/contracts?status=ACTIVE');
  return normalizeList(response.data || response);
}

// Jobs from client routes
export async function fetchClientJobs() {
  const response = await apiFetch('/profilesystem/client/jobs?limit=20');
  return normalizeList(response.data || response);
}

// Proposals from client routes
export async function fetchClientProposals(jobId) {
  if (jobId) {
    const response = await apiFetch(`/proposals/job/${jobId}`);
    return normalizeList(response.proposals || response.data || response);
  }
  const response = await apiFetch('/profilesystem/client/proposals?limit=20');
  return normalizeList(response.data || response);
}

// Wallet from escrow_wallet module
export async function fetchClientWallet() {
  const response = await apiFetch('/escorow_wallet/wallet');
  return response.data || response || {};
}

// Transactions from escrow_wallet module
export async function fetchClientTransactions() {
  const response = await apiFetch('/escorow_wallet/wallet/transactions?limit=20');
  return normalizeList(response.data || response);
}