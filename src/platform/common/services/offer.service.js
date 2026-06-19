import { api } from './api';

export const offerService = {
  getOffers: async (filters = {}) => {
    const response = await api.get('/offers', { params: filters });
    return response.data;
  },

  getOfferById: async (id) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  createOffer: async (offerData) => {
    const response = await api.post('/offers', offerData);
    return response.data;
  },
  
  acceptOffer: async (id) => {
    const response = await api.post(`/offers/${id}/accept`);
    return response.data;
  },
  
  rejectOffer: async (id, reason) => {
    const response = await api.post(`/offers/${id}/reject`, { reason });
    return response.data;
  },
  
  counterOffer: async (id, counterData) => {
    const response = await api.post(`/offers/${id}/counter`, counterData);
    return response.data;
  }
};
