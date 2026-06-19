import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

const initialDetails = {
  fullName: '',
  businessName: '',
  email: '',
  phoneNumber: '',
  country: 'KE',
  password: '',
  confirmPassword: '',
  companySize: '',
  industry: '',
  teamSize: '',
  primarySkillCategory: '',
  experienceLevel: '',
  hiringNeeds: '',
  antiSpamWebsite: '',
};

export const useOnboardingStore = create(
  devtools(
    persist(
      (set, get) => ({
        currentStep: 1,
        selectedRole: null, // 'CLIENT' | 'FREELANCER'
        accountType: null, // 'INDIVIDUAL' | 'SME' | 'CORPORATE'
        details: initialDetails,
        profileData: {},
        verificationStatus: { email: false, phone: false },
        isSubmitting: false,
        error: null,
        lastSavedAt: null,

        setStep: (step) => set({ currentStep: step }),
        nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
        prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

        setSelectedRole: (role) => set({ selectedRole: role, accountType: null }),
        setAccountType: (type) => set({ accountType: type }),
        
        updateBasicInfo: (data) => set((state) => ({ 
          details: { ...state.details, ...data },
          lastSavedAt: Date.now(),
        })),

        updateDetails: (data) => set((state) => ({
          details: { ...state.details, ...data },
          lastSavedAt: Date.now(),
        })),

        replaceDetails: (data) => set(() => ({
          details: { ...initialDetails, ...data },
          lastSavedAt: Date.now(),
        })),

        updateProfileData: (data) => set((state) => ({
          profileData: { ...state.profileData, ...data }
        })),

        setVerificationStatus: (method, status) => set((state) => ({
          verificationStatus: { ...state.verificationStatus, [method]: status }
        })),

        setSubmitting: (isSubmitting) => set({ isSubmitting }),
        setError: (error) => set({ error }),

        reset: () => set({
          currentStep: 1,
          selectedRole: null,
          accountType: null,
          details: initialDetails,
          profileData: {},
          verificationStatus: { email: false, phone: false },
          isSubmitting: false,
          error: null,
          lastSavedAt: null,
        })
      }),
      {
        name: 'onboarding-storage', // Persist form data during onboarding
        storage: createJSONStorage(() => sessionStorage), // Use sessionStorage so it clears on browser close
      }
    )
  )
);
