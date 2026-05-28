import { create } from 'zustand';

const useOnboardingStore = create((set) => ({
  currentStep: 1,
  accountType: null, // 'client' or 'freelancer'
  businessStructure: null, // 'individual', 'sme', or 'corporate'
  formData: {},

  setAccountType: (type) => set({ accountType: type }),
  setBusinessStructure: (structure) => set({ businessStructure: structure }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  goToStep: (step) => set({ currentStep: step }),

  reset: () => set({ currentStep: 1, accountType: null, businessStructure: null, formData: {} })
}));

export default useOnboardingStore;
