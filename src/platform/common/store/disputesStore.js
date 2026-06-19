import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { disputeService } from '../services/dispute.service';

export const useDisputesStore = create(
  devtools((set, get) => ({
    disputes: [],
    currentDispute: null,
    isLoading: false,
    error: null,

    fetchDisputes: async (filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const data = await disputeService.getDisputes(filters);
        set({ disputes: data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateDisputeInStore: (updatedDispute) => {
      set((state) => ({
        disputes: state.disputes.map(d => d.id === updatedDispute.id ? updatedDispute : d),
        currentDispute: state.currentDispute?.id === updatedDispute.id ? updatedDispute : state.currentDispute
      }));
    }
  }))
);
