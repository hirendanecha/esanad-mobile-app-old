import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { ToastProvider, useToast } from '../Toast';
import { Text, TouchableOpacity } from 'react-native';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        lableText: 'green',
        red: 'red',
        lableSecondaryText: 'blue',
        lableThirdText: 'orange',
        simple: 'grey',
        textSecondary: 'white',
      },
    },
  }),
}));

const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <TouchableOpacity onPress={() => showToast('Hello Test', 'success')}>
      <Text>Show Toast</Text>
    </TouchableOpacity>
  );
};

describe('Toast Component & Provider', () => {
  it('shows toast message when showToast is called', () => {
    const { getByText, queryByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(queryByText('Hello Test')).toBeNull();

    const btn = getByText('Show Toast');
    act(() => {
      fireEvent.press(btn);
    });

    expect(getByText('Hello Test')).toBeTruthy();
  });
});
