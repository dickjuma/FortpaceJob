import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRegistrationStore = create(
  persist(
    (set) => ({
      step: 1,
      role: null, // 'freelancer' | 'client'
      clientType: null, // 'individual' | 'sme' | 'corporate'
      freelancerMode: null, // 'online' | 'onsite' | 'hybrid'
      freelancerType: null, // 'individual' | 'sme' | 'corporate'
      formData: {},

      setStep: (step) => set({ step }),
      setRole: (role) => set({ role }),
      setClientType: (type) => set({ clientType: type }),
      setFreelancerMode: (mode) => set({ freelancerMode: mode }),
      setFreelancerType: (type) => set({ freelancerType: type }),
      updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      
      resetRegistration: () => set({
        step: 1,
        role: null,
        clientType: null,
        freelancerMode: null,
        freelancerType: null,
        formData: {}
      }),
    }),
    {
      name: 'forte-registration-storage',
      getStorage: () => sessionStorage, // Persist across refreshes but clear on tab close
    }
  )
);

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
