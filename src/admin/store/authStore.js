import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthAPI } from '../api/adminAuth.api';

const ADMIN_ROLES = new Set([
  'ADMIN',
  'SUPER_ADMIN',
  'SUPPORT_ADMIN',
  'OPERATIONS_ADMIN',
  'FINANCIAL_ADMIN',
  'MODERATION_ADMIN',
  'FRAUD_SECURITY_ADMIN',
  'CHAT_SUPPORT_ADMIN',
  'admin',
  'super_admin',
  'support_admin',
  'operations_admin',
  'financial_admin',
  'moderation_admin',
  'fraud_security_admin',
  'chat_support_admin',
]);

const isAdminUser = (user) => ADMIN_ROLES.has(user?.role);

const persistAdminToken = (token) => {
  if (token) {
    localStorage.setItem('admin-token', token);
  } else {
    localStorage.removeItem('admin-token');
  }
};

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.login({ email, password });
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      setupStart: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.setupStart({ email, password });
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      setupConfirm: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.setupConfirm(payload);
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyTotp: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.verifyTotp(payload);
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyEmailOtp: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.verifyEmailOtp(payload);
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyRecoveryCode: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.verifyRecoveryCode(payload);
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const data = await adminAuthAPI.createAdmin(userData);
          return data.data;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await adminAuthAPI.logout();
        } catch (e) {
          // Ignore logout errors
        }
        persistAdminToken(null);
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user) => set({ user }),
      setToken: (token) => {
        persistAdminToken(token);
        set({ token });
      },
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      
      checkAuth: async () => {
        try {
          const existingToken =
            localStorage.getItem('admin-token') ||
            localStorage.getItem('accessToken');
          if (existingToken) {
            persistAdminToken(existingToken);
          }

          const me = await adminAuthAPI.me();
          const user = me?.data || me;
          if (!isAdminUser(user)) {
            persistAdminToken(null);
            set({ user: null, token: null, isAuthenticated: false });
            return false;
          }

          set({
            user,
            token: existingToken || localStorage.getItem('accessToken'),
            isAuthenticated: true,
          });
          return true;
        } catch (e) {
          persistAdminToken(null);
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false 
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
