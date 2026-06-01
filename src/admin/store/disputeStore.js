import { create } from 'zustand';

const useDisputeStore = create((set, get) => ({
  filters: {
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
  },
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({ filters: {} }),
}));

export default useDisputeStore;