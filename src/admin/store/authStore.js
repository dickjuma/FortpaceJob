import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../../common/services/api';

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

      login: async (identifier, password) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.login(identifier, password);
          if (data?.requiresTwoFactor) {
            set({ isLoading: false });
            return data;
          }

          if (data.accessToken) {
            if (!isAdminUser(data.user)) {
              await authAPI.logout().catch(() => {});
              throw new Error('This account does not have admin access.');
            }

            persistAdminToken(data.accessToken);
            if (data.accessToken) {
              localStorage.setItem('accessToken', data.accessToken);
            }
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }
            set({ 
              user: data.user, 
              token: data.accessToken,
              isAuthenticated: true,
              isLoading: false 
            });
          }
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.register(userData);
          if (data.accessToken) {
            set({ 
              user: data.user, 
              token: data.accessToken,
              isAuthenticated: true 
            });
          }
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
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

          const me = await authAPI.getMe();
          const user = me?.user || me;
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
