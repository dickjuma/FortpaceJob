import { create } from 'zustand';

const useConfigStore = create((set) => ({
  companyDetails: {
    name: 'ForteSpace',
    address: '123 Innovation Tower, Nairobi, Kenya',
    website: 'www.fortespace.com',
    email: 'billing@fortespace.com',
    taxId: 'P051234567Z',
    footerMessage: 'Forte Space is the premier freelance marketplace empowering the next generation of digital talent.'
  },
  
  updateCompanyDetails: (newDetails) => set((state) => ({
    companyDetails: { ...state.companyDetails, ...newDetails }
  })),
}));

export default useConfigStore;
