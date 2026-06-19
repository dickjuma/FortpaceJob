import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { milestoneService } from '../services/milestone.service';

export const useMilestonesStore = create(
  devtools((set, get) => ({
    milestones: [],
    isLoading: false,
    error: null,

    fetchMilestones: async (contractId) => {
      set({ isLoading: true, error: null });
      try {
        const data = await milestoneService.getMilestonesByContract(contractId);
        set({ milestones: data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateMilestoneInStore: (updatedMilestone) => {
      set((state) => ({
        milestones: state.milestones.map(m => m.id === updatedMilestone.id ? updatedMilestone : m)
      }));
    }
  }))
);
