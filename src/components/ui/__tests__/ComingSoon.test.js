import React from 'react';
import { render } from '@testing-library/react-native';
import ComingSoon from '../ComingSoon';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        text: 'black',
      },
    },
  }),
}));

describe('ComingSoon Component', () => {
  it('renders "Coming Soon" text', () => {
    const { getByText } = render(<ComingSoon />);
    expect(getByText(/Coming Soon/)).toBeTruthy();
  });
});
