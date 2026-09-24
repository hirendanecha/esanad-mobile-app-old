import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STORAGE_KEY from '@constants/storageKey';

// simple resources (you can load JSON files or use backend)
const resources = {
  en: { translation: require('./locales/en.json') },
  ar: { translation: require('./locales/ar.json') },
};

// custom async language detector (works with AsyncStorage + device locale)
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    await AsyncStorage.getItem(STORAGE_KEY.LANG_KEY)
      .then(storedLang => {
        if (storedLang) return callback(storedLang);
        const locales = RNLocalize.getLocales();
        if (Array.isArray(locales) && locales.length > 0) {
          // locales[0].languageTag or languageCode
          return callback(locales[0].languageCode);
        }
        return callback('en');
      })
      .catch(() => callback('en'));
  },
  init: () => {},
  cacheUserLanguage: async lng => {
    await AsyncStorage.setItem(STORAGE_KEY.LANG_KEY, lng).catch(() => {
      console.warn('Failed to cache user language');
    });
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // RN: disable suspense
  });

export default i18n;
