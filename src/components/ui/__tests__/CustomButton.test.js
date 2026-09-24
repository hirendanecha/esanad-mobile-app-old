import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

// Mock the ThemeProvider context directly, or just wrap it if ThemeProvider is available.
// Given that ThemeProvider might depend on context we don't have, we can mock useThemeContext.
jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        backgroundColor: 'white',
        text: 'black',
        textSecondary: 'gray',
      },
    },
  }),
}));

describe('CustomButton Component', () => {
  it('renders correctly with default props', () => {
    const { toJSON, getByText } = render(
      <CustomButton title="Click Me" onPress={() => {}} />
    );
    expect(getByText('Click Me')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders loading state correctly', () => {
    const { getByType, toJSON } = render(
      <CustomButton title="Click Me" isLoading={true} onPress={() => {}} />
    );
    // ActivityIndicator might be mapped differently in test renderer, but type check usually works
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={onPressMock} />
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
