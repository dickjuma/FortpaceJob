import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authAPI, removeTokens, setUser as persistUser } from './services/api';

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        isAuthenticated: false,
        user: null, // { id, email, role, ... }
        token: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        sessionExpired: false,

        syncPersistedSession: (user, token, refreshToken) => {
          if (user) {
            persistUser(user);
          }
          if (token) {
            localStorage.setItem('accessToken', token);
          }
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
        },

        setAuth: (user, token, refreshToken) => {
          get().syncPersistedSession(user, token, refreshToken);
          set({
            isAuthenticated: true,
            user,
            token,
            refreshToken,
            error: null,
            sessionExpired: false
          });
        },

        login: async (identifier, password, rememberMe = false, deviceMetadata = null) => {
          set({ isLoading: true, error: null });
          try {
            const data = await authAPI.login(identifier, password, rememberMe, deviceMetadata);

            if (data?.requiresTwoFactor) {
              set({ isLoading: false, error: null });
              return data;
            }

            set({
              isAuthenticated: true,
              user: data.user,
              token: data.accessToken,
              refreshToken: data.refreshToken,
              isLoading: false,
              sessionExpired: false
            });
            return data;
          } catch (err) {
            set({ isLoading: false, error: err.message || 'Login failed' });
            throw err;
          }
        },

        logout: async () => {
          try {
            await authAPI.logout();
          } catch(e) {
            console.error('Logout error', e);
          } finally {
            removeTokens();
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              refreshToken: null,
              sessionExpired: false
            });
          }
        },

        setSessionExpired: () => set({
          sessionExpired: true,
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null
        }),

        updateUser: (updates) => set((state) => {
          const user = state.user ? { ...state.user, ...updates } : state.user;
          if (user) {
            persistUser(user);
          }
          return { user };
        }),

        hasRole: (role) => get().user?.role === role,
        
        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-store', // storage key
        getStorage: () => localStorage,
      }
    )
  )
);
