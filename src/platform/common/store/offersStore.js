import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { offerService } from '../services/offer.service';

export const useOffersStore = create(
  devtools((set, get) => ({
    offers: [],
    currentOffer: null,
    isLoading: false,
    error: null,

    fetchOffers: async (filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const data = await offerService.getOffers(filters);
        set({ offers: data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    acceptOffer: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const data = await offerService.acceptOffer(id);
        set((state) => ({
          offers: state.offers.map(o => o.id === id ? data : o),
          currentOffer: state.currentOffer?.id === id ? data : state.currentOffer,
          isLoading: false
        }));
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateOfferInStore: (updatedOffer) => {
      set((state) => ({
        offers: state.offers.map(o => o.id === updatedOffer.id ? updatedOffer : o),
        currentOffer: state.currentOffer?.id === updatedOffer.id ? updatedOffer : state.currentOffer
      }));
    }
  }))
);
