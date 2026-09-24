// src/store/loaderStore.js
import { create } from 'zustand';

export const useLoaderStore = create(set => ({
  manualLoading: false,
  showLoader: () => set({ manualLoading: true }),
  hideLoader: () => set({ manualLoading: false }),
}));
