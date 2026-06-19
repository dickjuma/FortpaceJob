import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { contractService } from '../services/contract.service';

export const useContractsStore = create(
  devtools((set, get) => ({
    contracts: [],
    currentContract: null,
    isLoading: false,
    error: null,

    fetchContracts: async (filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const data = await contractService.getContracts(filters);
        set({ contracts: data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    fetchContractById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const data = await contractService.getContractById(id);
        set({ currentContract: data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    // Real-time optimistic update
    updateContractInStore: (updatedContract) => {
      set((state) => ({
        contracts: state.contracts.map(c => c.id === updatedContract.id ? updatedContract : c),
        currentContract: state.currentContract?.id === updatedContract.id ? updatedContract : state.currentContract
      }));
    }
  }))
);
