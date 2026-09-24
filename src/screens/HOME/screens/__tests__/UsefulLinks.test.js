import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UsefulLinks from '../UsefulLinks';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn(),
}));

// Removed static mock for Linking, spying directly on import

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        bgLinear1: 'transparent',
        bgLinear2: 'transparent',
        backgroundColor: 'white',
        border: 'gray',
        textTertiary: 'gray',
      },
    },
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockLinearGradient(props) {
    return <View {...props} testID="linear-gradient" />;
  };
});

describe('UsefulLinks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  });

  const DEFAULT_LAT = 25.2048;
  const DEFAULT_LNG = 55.2708;

  it('renders correctly', () => {
    const { getByText } = render(<UsefulLinks />);
    expect(getByText('Police Stations')).toBeTruthy();
    expect(getByText('Hospitals')).toBeTruthy();
  });

  it('uses actual geolocation coordinates when permission is granted and map is opened', () => {
    Geolocation.getCurrentPosition.mockImplementation((success, error, options) => {
      success({ coords: { latitude: 24.4539, longitude: 54.3773 } }); // Abu Dhabi mock
    });

    const { getByText } = render(<UsefulLinks />);

    fireEvent.press(getByText('Police Stations'));

    const expectedUrl = `https://www.google.com/maps/search/Police%20Stations/@24.4539,54.3773,16z`;
    expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl);
  });

  it('falls back to default UAE coordinates when geolocation fails', () => {
    Geolocation.getCurrentPosition.mockImplementation((success, error, options) => {
      error({ code: 1, message: 'User denied geolocation prompt' });
    });

    const { getByText } = render(<UsefulLinks />);

    fireEvent.press(getByText('Hospitals'));

    const expectedUrl = `https://www.google.com/maps/search/Hospitals/@${DEFAULT_LAT},${DEFAULT_LNG},16z`;
    expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl);
  });

  it('falls back to default UAE coordinates when geolocation throws an exception', () => {
    Geolocation.getCurrentPosition.mockImplementation(() => {
      throw new Error('Unexpected invariant violation');
    });

    const { getByText } = render(<UsefulLinks />);

    fireEvent.press(getByText('Fuel'));

    const expectedUrl = `https://www.google.com/maps/search/Fuel/@${DEFAULT_LAT},${DEFAULT_LNG},16z`;
    expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl);
  });
});
