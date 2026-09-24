import { LanguageSwitcher } from '../LanguageSwitcher';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native', () => ({
  I18nManager: {
    isRTL: false,
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('LanguageSwitcher util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    I18nManager.isRTL = false;
  });

  it('changes language to English (non-RTL)', async () => {
    await LanguageSwitcher('en');
    
    expect(i18next.changeLanguage).toHaveBeenCalledWith('en');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'en');
    expect(I18nManager.forceRTL).not.toHaveBeenCalled(); // isRTL was already false
  });

  it('changes language to Arabic (RTL) and forces RTL', async () => {
    await LanguageSwitcher('ar');
    
    expect(i18next.changeLanguage).toHaveBeenCalledWith('ar');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'ar');
    expect(I18nManager.allowRTL).toHaveBeenCalledWith(true);
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
  });

  it('switches back from RTL to non-RTL', async () => {
    I18nManager.isRTL = true;
    await LanguageSwitcher('en');
    
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(false);
  });
});
