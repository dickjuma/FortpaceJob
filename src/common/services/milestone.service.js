import { api } from './api';

export const milestoneService = {
  getMilestonesByContract: async (contractId) => {
    const response = await api.get(`/contracts/${contractId}/milestones`);
    return response.data;
  },

  createMilestone: async (contractId, milestoneData) => {
    const response = await api.post(`/contracts/${contractId}/milestones`, milestoneData);
    return response.data;
  },
  
  updateMilestone: async (id, updateData) => {
    const response = await api.patch(`/milestones/${id}`, updateData);
    return response.data;
  },
  
  submitMilestone: async (id, submissionData) => {
    const response = await api.post(`/milestones/${id}/submit`, submissionData);
    return response.data;
  },
  
  approveMilestone: async (id) => {
    const response = await api.post(`/milestones/${id}/approve`);
    return response.data;
  },
  
  rejectMilestone: async (id, reason) => {
    const response = await api.post(`/milestones/${id}/reject`, { reason });
    return response.data;
  },

  disputeMilestone: async (id, disputeData) => {
    const response = await api.post(`/milestones/${id}/dispute`, disputeData);
    return response.data;
  }
};
