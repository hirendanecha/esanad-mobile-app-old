import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18n from '@i18n/i18n';

const systemColorScheme = Appearance.getColorScheme();

export const useSettingStore = create(
  persist(
    (set, get) => ({
      isDarkMode: systemColorScheme === 'dark',
      language: 'en',
      isNotificationEnabled: true,

      toggleTheme: () =>
        set(state => ({
          isDarkMode: !state.isDarkMode,
        })),

      setLanguage: async lang => {
        await i18n.changeLanguage(lang);
        set(state => ({
          language: lang,
        }));
      },

      toggleNotification: () =>
        set(state => ({
          isNotificationEnabled: !state.isNotificationEnabled,
        })),
    }),
    {
      name: 'setting-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => async state => {
        try {
          if (state?.language) {
            await i18n.changeLanguage(state.language);
          } else {
            const deviceLang = RNLocalize.getLocales()[0]?.languageCode || 'en';
            await i18n.changeLanguage(deviceLang);
          }
        } catch (e) {
          console.error('Error rehydrating i18n language:', e);
        }
      },
    },
  ),
);
