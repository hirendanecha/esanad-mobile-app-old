import React, { createContext, useContext, useMemo } from 'react';
import { darkTheme } from './dark';
import { lightTheme } from './light';
import { useSettingStore } from '@store/settingStore';
/**
 * @typedef {typeof lightTheme} ThemeType
 */

/**
 * @typedef {Object} ThemeContextType
 * @property {ThemeType} theme
 * @property {boolean} isDarkMode
 * @property {() => void} toggleTheme
 */

/** @type {React.Context<ThemeContextType>} */
const ThemeContext = createContext();

/**
 * @param {{ children: React.ReactNode }} props
 */
export const ThemeProvider = ({ children }) => {
  const isDarkMode = useSettingStore(state => state.isDarkMode);
  const toggleTheme = useSettingStore(state => state.toggleTheme);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
