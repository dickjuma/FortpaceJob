import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  theme: localStorage.getItem('admin-theme') || 'light',
  activeModal: null,
  commandPaletteOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  
  collapseSidebar: (collapsed) => 
    set((state) => ({ sidebarCollapsed: collapsed ?? !state.sidebarCollapsed })),
    
  setTheme: (theme) => {
    localStorage.setItem('admin-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('admin-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    });
  },

  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
}));

// Initialize theme on load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('admin-theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}
