import { api } from './api';

export const contractService = {
  getContracts: async (filters = {}) => {
    const response = await api.get('/contracts', { params: filters });
    return response.data;
  },
  
  getContractById: async (id) => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },
  
  createContract: async (contractData) => {
    const response = await api.post('/contracts', contractData);
    return response.data;
  },
  
  updateContract: async (id, updateData) => {
    const response = await api.patch(`/contracts/${id}`, updateData);
    return response.data;
  },
  
  signContract: async (id, signatureData) => {
    const response = await api.post(`/contracts/${id}/sign`, signatureData);
    return response.data;
  },
  
  terminateContract: async (id, reason) => {
    const response = await api.post(`/contracts/${id}/terminate`, { reason });
    return response.data;
  }
};
