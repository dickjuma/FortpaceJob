import { create } from 'zustand';

const useFinancialStore = create((set) => ({
  filters: {
    transactions: { search: '', status: '', dateRange: 'all', type: '' },
    invoices: { search: '', status: '' },
    escrow: { search: '', status: '' },
    withdrawals: { search: '', status: '' },
  },
  
  setFilter: (section, key, value) => set((state) => ({
    filters: {
      ...state.filters,
      [section]: {
        ...state.filters[section],
        [key]: value
      }
    }
  })),

  clearFilters: (section) => set((state) => ({
    filters: {
      ...state.filters,
      [section]: { search: '', status: '', dateRange: 'all', type: '' }
    }
  })),
}));

export default useFinancialStore;
