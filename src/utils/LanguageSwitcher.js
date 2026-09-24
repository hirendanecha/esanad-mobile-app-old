import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// helper to change language + handle RTL switching
export async function LanguageSwitcher(lng) {
  const RTL_LANGS = ['ar', 'he', 'fa', 'ur'];

  const wantRTL = RTL_LANGS.includes(lng);
  try {
    // update i18next language
    await i18next.changeLanguage(lng);
    // cache
    await AsyncStorage.setItem('user-language', lng);
  } catch (e) {
    console.warn('i18n changeLanguage error', e);
  }

  // If direction changed, force and restart to apply layout direction
  if (I18nManager.isRTL !== wantRTL) {
    try {
      // allow RTL (optional; useful if your app was disallowing)
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(wantRTL);

      // RNRestart && RNRestart.Restart();
    } catch (err) {
      console.warn('Error forcing RTL:', err);
    }
  }
}
