import { api } from './api';

export const disputeService = {
  getDisputes: async (filters = {}) => {
    const response = await api.get('/disputes', { params: filters });
    return response.data;
  },

  getDisputeById: async (id) => {
    const response = await api.get(`/disputes/${id}`);
    return response.data;
  },

  createDispute: async (disputeData) => {
    const response = await api.post('/disputes', disputeData);
    return response.data;
  },
  
  uploadEvidence: async (id, formData) => {
    const response = await api.post(`/disputes/${id}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  resolveDispute: async (id, resolutionData) => {
    const response = await api.post(`/disputes/${id}/resolve`, resolutionData);
    return response.data;
  }
};
