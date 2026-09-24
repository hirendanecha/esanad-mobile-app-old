import React from 'react';
import { render } from '@testing-library/react-native';
import AppLoaderLocal from '../AppLoaderLocal';

jest.mock('lottie-react-native', () => 'LottieView');

jest.mock('@assets/index', () => ({
  Animations: {
    quote: 'quote_animation',
  },
}));

jest.mock('@constants/metrics', () => ({
  verticalScale: val => val,
}));

describe('AppLoaderLocal Component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<AppLoaderLocal />);
    expect(toJSON()).not.toBeNull();
  });
});
