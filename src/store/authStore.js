import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      _hasHydrated: false,
      onBoarded: false,
      userDetailsUpdate: false,

      setAuth: ({ token, user }) => set({ token, user }),
      setToken: token => set({ token }),
      setUser: user => set({ user }),
      setOnBoarded: onBoarded => set({ onBoarded }),
      setUserDetailsUpdate: userDetailsUpdate => set({ userDetailsUpdate }),
      logout: () =>
        set({
          token: null,
          user: null,
          userDetailsUpdate: false,
        }),

      setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      isHydrated: () => get()._hasHydrated,
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: state => ({
        token: state.token,
        user: state.user,
        onBoarded: state.onBoarded,
        userDetailsUpdate: state.userDetailsUpdate,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Auth store hydration error:', error);
        } else {
          console.log('Auth store hydrated successfully');
        }
        useAuthStore.getState().setHasHydrated(true);
      },
    },
  ),
);

export const authStore = {
  get token() {
    const state = useAuthStore.getState();
    return state._hasHydrated ? state.token : null;
  },

  get user() {
    const state = useAuthStore.getState();
    return state._hasHydrated ? state.user : null;
  },

  get isHydrated() {
    return useAuthStore.getState()._hasHydrated;
  },

  setAuth: ({ token, user }) =>
    useAuthStore.getState().setAuth({ token, user }),
  setToken: token => useAuthStore.getState().setToken(token),
  setOnBoarded: onBoarded => useAuthStore.getState().setOnBoarded(onBoarded),
  setUser: user => useAuthStore.getState().setUser(user),
  logout: () => useAuthStore.getState().logout(),
  setUserDetailsUpdate: (userDetailsUpdate) =>
    useAuthStore.getState().setUserDetailsUpdate(userDetailsUpdate),

  waitForHydration: () => {
    return new Promise(resolve => {
      if (useAuthStore.getState()._hasHydrated) {
        resolve(useAuthStore.getState());
        return;
      }

      const unsubscribe = useAuthStore.subscribe(
        state => state._hasHydrated,
        hasHydrated => {
          if (hasHydrated) {
            unsubscribe();
            resolve(useAuthStore.getState());
          }
        },
      );
    });
  },
};

export const useHydratedAuth = () => {
  const auth = useAuthStore();

  if (!auth._hasHydrated) {
    return {
      ...auth,
      token: null,
      user: null,
      isLoading: true,
      onBoarded: false,
      userDetailsUpdate: false,
      isHydrated: false,
    };
  }

  return {
    ...auth,
    isLoading: false,
    isHydrated: true,
  };
};
