import { create } from 'zustand';

const useFinancialStore = create((set) => ({
  filters: {
    type: undefined,
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
  },
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({ filters: {} }),
}));

export default useFinancialStore;