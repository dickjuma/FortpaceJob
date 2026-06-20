import { create } from 'zustand';

const useClientWizardStore = create((set, get) => ({
  step: 0,
  data: {
    profilePhoto: '',
    coverPhoto: '',
    introVideo: '',
    headline: '',
    bio: '',
    country: '',
    state: '',
    city: '',
    timezone: '',
    language: '',
    website: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
    profileVisibility: 'PUBLIC',
    allowMessages: true,
    allowInvitations: true,
    allowSearchListing: true,
    hiringPreferences: {
      hiringFrequency: '',
      projectSize: '',
      preferredTalentType: '',
      preferredWorkType: '',
      minimumBudget: null,
      maximumBudget: null,
      currency: 'USD',
      projectDuration: '',
    },
    industries: {
      primaryIndustryId: '',
      secondaryIndustryId: '',
    },
    servicesHired: [], // { categoryId, serviceId }
    verifications: {
      phoneVerified: false,
      emailVerified: false,
      identityVerified: false,
      addressVerified: false,
      paymentVerified: false,
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAlerts: true,
      recoveryEmail: '',
      recoveryPhone: '',
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      messages: true,
      contracts: true,
      payments: true,
      recommendations: true,
      marketing: false,
    }
  },
  
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 12) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  
  updateData: (fields) => set((state) => ({ 
    data: { ...state.data, ...fields } 
  })),

  updateNestedData: (section, fields) => set((state) => ({
    data: {
      ...state.data,
      [section]: { ...state.data[section], ...fields }
    }
  })),

  reset: () => set({ step: 0 })
}));

export default useClientWizardStore;
