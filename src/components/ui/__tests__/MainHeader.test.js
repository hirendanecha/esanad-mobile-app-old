import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MainHeader from '../MainHeader';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        backgroundColor: 'white',
        text: 'black',
        textTertiary: 'grey',
        red: 'red',
        bgSecondary: 'lightgrey',
      },
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

const wrap = (children) => (
  <SafeAreaProvider initialMetrics={{ insets: { top: 0, left: 0, right: 0, bottom: 0 }, frame: { x: 0, y: 0, width: 375, height: 812 } }}>
    {children}
  </SafeAreaProvider>
);

describe('MainHeader Component', () => {
  it('renders title and logo by default', () => {
    const { getByText } = render(wrap(<MainHeader title="Home" />));
    expect(getByText('Home')).toBeTruthy();
  });

  it('renders chevron and handles press when IconNew is true', () => {
    const onIconPress = jest.fn();
    const { getByTestId } = render(wrap(<MainHeader title="Details" IconNew={true} onIconPress={onIconPress} />));
    
    const btn = getByTestId('main-header-icon');
    fireEvent.press(btn);
    expect(onIconPress).toHaveBeenCalled();
  });
});
