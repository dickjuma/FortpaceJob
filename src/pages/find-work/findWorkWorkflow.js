import {
  contractAPI,
  disputeAPI,
  orderAPI,
  proposalAPI,
  publicAPI,
  userAPI,
  workAPI,
} from '../../common/services/api';
import { cancelJob } from '../../client/services/clientApi';
import { getFindWorkJobById, syncJobsWithBackend } from './findWorkData';

export function extractList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

export function unwrapRecord(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

export function formatMoney(amount, currency = 'KES') {
  const value = Number(amount) || 0;
  return `${currency} ${value.toLocaleString()}`;
}

export function contractStatusLabel(status) {
  const value = String(status || 'ACTIVE').toUpperCase();
  if (value === 'COMPLETED') return 'Completed';
  if (value === 'CANCELLED' || value === 'TERMINATED') return 'Cancelled';
  if (value === 'PENDING') return 'Pending signature';
  return 'In Progress';
}

export async function loadJobContext(workId) {
  await syncJobsWithBackend({ limit: 100 });
  const cached = getFindWorkJobById(workId);
  if (cached) return cached;
  try {
    return unwrapRecord(await publicAPI.getJobById(workId));
  } catch {
    return null;
  }
}

export async function loadContractOrOrder(id) {
  try {
    const contract = unwrapRecord(await contractAPI.getContract(id));
    if (contract?.id) return { kind: 'contract', record: contract };
  } catch {
    /* try order */
  }
  try {
    const order = unwrapRecord(await orderAPI.getOrder(id));
    if (order?.id) return { kind: 'order', record: order };
  } catch {
    /* not found */
  }
  return { kind: null, record: null };
}

export async function loadProposal(proposalId) {
  if (!proposalId) return null;
  try {
    return unwrapRecord(await proposalAPI.getProposal(proposalId));
  } catch {
    return null;
  }
}

export async function loadFreelancerProfile(freelancerId) {
  if (!freelancerId) return null;
  try {
    const profile = await userAPI.getProfile(freelancerId);
    return profile?.profile || profile;
  } catch {
    return null;
  }
}

export async function hireFromProposal(workId, proposalId) {
  const result = await proposalAPI.updateProposalStatus(proposalId, 'accepted');
  const contract = result?.contract || result?.data?.contract;
  if (contract?.id) return contract;
  const created = await contractAPI.createContract({
    jobId: workId,
    proposalId,
    status: 'ACTIVE',
  });
  return unwrapRecord(created);
}

export async function cancelJobOrContract(id, reason) {
  const { kind, record } = await loadContractOrOrder(id);
  if (kind === 'contract' && record?.id) {
    return contractAPI.cancelContract(record.id, reason);
  }
  return cancelJob(id);
}

export { contractAPI, disputeAPI, orderAPI, proposalAPI, publicAPI, syncJobsWithBackend, userAPI, workAPI };
