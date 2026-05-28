import { create } from 'zustand';

const useUserManagementStore = create((set, get) => ({
  // Selected users for bulk actions
  selectedUserIds: [],
  selectUser: (id) => set(s => ({ selectedUserIds: [...s.selectedUserIds, id] })),
  deselectUser: (id) => set(s => ({ selectedUserIds: s.selectedUserIds.filter(uid => uid !== id) })),
  toggleSelectUser: (id) => {
    const { selectedUserIds } = get();
    if (selectedUserIds.includes(id)) {
      set({ selectedUserIds: selectedUserIds.filter(uid => uid !== id) });
    } else {
      set({ selectedUserIds: [...selectedUserIds, id] });
    }
  },
  selectAllUsers: (ids) => set({ selectedUserIds: ids }),
  clearSelection: () => set({ selectedUserIds: [] }),

  // Active filters per page
  filters: {
    all: { search: '', status: '', userGroup: '', kycStatus: '', sortBy: 'joinedAt', sortOrder: 'desc' },
    freelancers: { search: '', status: '', kycStatus: '', freelancerType: '', skills: '', sortBy: 'totalEarnings', sortOrder: 'desc' },
    clients: { search: '', status: '', kycStatus: '', clientType: '', sortBy: 'totalSpend', sortOrder: 'desc' },
    admins: { search: '', status: '', role: '', sortBy: 'joinedAt', sortOrder: 'desc' },
  },
  setFilter: (page, key, value) => set(s => ({
    filters: { ...s.filters, [page]: { ...s.filters[page], [key]: value } }
  })),
  resetFilters: (page) => set(s => ({
    filters: { ...s.filters, [page]: Object.fromEntries(Object.keys(s.filters[page]).map(k => [k, ''])) }
  })),

  // Pagination per page
  pagination: { 
    all: { page: 1, limit: 20 }, 
    freelancers: { page: 1, limit: 20 }, 
    clients: { page: 1, limit: 20 }, 
    admins: { page: 1, limit: 20 } 
  },
  setPage: (section, page) => set(s => ({ 
    pagination: { ...s.pagination, [section]: { ...s.pagination[section], page } } 
  })),
  setLimit: (section, limit) => set(s => ({ 
    pagination: { ...s.pagination, [section]: { ...s.pagination[section], limit, page: 1 } } 
  })),

  // Active modal and target user
  activeModal: null,
  modalTargetUser: null,
  openModal: (modalId, user = null) => set({ activeModal: modalId, modalTargetUser: user }),
  closeModal: () => set({ activeModal: null, modalTargetUser: null }),

  // View mode for tables
  viewMode: 'table', // 'table' | 'grid' | 'compact'
  setViewMode: (mode) => set({ viewMode: mode }),

  // Active profile tab
  activeProfileTab: 'overview',
  setActiveProfileTab: (tab) => set({ activeProfileTab: tab }),
}));

export default useUserManagementStore;
