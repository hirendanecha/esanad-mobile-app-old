import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create(
  persist(
    set => ({
      offlinePolicies: null,
      contactNumber: null,
      emiratesId: null,


      updateOfflinePolicies: policies =>
        set({
          offlinePolicies: policies,
        }),
      updateContactNumber: contactNumber => {
        set({ contactNumber });
      },
      updateEmiratesId: emiratesId => {
        set({ emiratesId });
      },

      clearData: () =>
        set({
          offlinePolicies: null,
          contactNumber: null,
          emiratesId: null,
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        offlinePolicies: state.offlinePolicies,
        contactNumber: state.contactNumber,
        // Exclude emiratesId and other sensitive PII from AsyncStorage
      }),
    },
  ),
);
