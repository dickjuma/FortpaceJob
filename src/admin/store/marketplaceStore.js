import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMarketplaceStore = create(
  persist(
    (set, get) => ({
      // Active tab
      activeTab: 'overview', // 'overview' | 'jobs' | 'gigs' | 'proposals' | 'contracts' | 'rankings' | 'reviews' | 'quality'
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Selected items for bulk actions
      selectedIds: [],
      selectItem: (id) => set(s => ({ selectedIds: [...s.selectedIds, id] })),
      deselectItem: (id) => set(s => ({ selectedIds: s.selectedIds.filter(uid => uid !== id) })),
      toggleSelectItem: (id) => {
        const { selectedIds } = get();
        set({ selectedIds: selectedIds.includes(id) ? selectedIds.filter(uid => uid !== id) : [...selectedIds, id] });
      },
      selectAllItems: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),

      // Filters per section
      filters: {
        jobs: { search: '', status: '', category: '', budget_min: '', budget_max: '', experience_level: '', sortBy: 'newest', sortOrder: 'desc' },
        gigs: { search: '', status: '', category: '', price_min: '', price_max: '', rating_min: '', sortBy: 'newest', sortOrder: 'desc' },
        proposals: { search: '', status: '', job_id: '', freelancer_id: '', sortBy: 'newest', sortOrder: 'desc' },
        contracts: { search: '', status: '', freelancer_id: '', client_id: '', sortBy: 'newest', sortOrder: 'desc' },
        reviews: { search: '', status: '', rating: '', flagged: false, sortBy: 'newest', sortOrder: 'desc' },
      },
      setFilter: (section, key, value) => set(s => ({
        filters: { ...s.filters, [section]: { ...s.filters[section], [key]: value } }
      })),
      resetFilters: (section) => set(s => ({
        filters: { ...s.filters, [section]: Object.fromEntries(Object.keys(s.filters[section]).map(k => [k, ''])) }
      })),

      // Pagination per section
      pagination: { jobs: 1, gigs: 1, proposals: 1, contracts: 1, reviews: 1 },
      setPage: (section, page) => set(s => ({ pagination: { ...s.pagination, [section]: page } })),

      // Active modals
      activeModal: null,
      modalData: null,
      openModal: (modalId, data = null) => set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // View preferences
      viewMode: 'table', // 'table' | 'grid' | 'cards'
      setViewMode: (mode) => set({ viewMode: mode }),
      compactMode: false,
      setCompactMode: (compact) => set({ compactMode: compact }),

      // Advanced search
      advancedSearchOpen: false,
      toggleAdvancedSearch: () => set(s => ({ advancedSearchOpen: !s.advancedSearchOpen })),

      // Refresh trigger
      lastRefresh: null,
      triggerRefresh: () => set({ lastRefresh: Date.now() }),
    }),
    { name: 'marketplace-store' }
  )
);

export default useMarketplaceStore;
