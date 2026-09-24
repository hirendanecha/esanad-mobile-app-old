import React from 'react';
import { render } from '@testing-library/react-native';
import OfferText from '../OfferText';

describe('OfferText Component', () => {
  it('renders transparency text correctly', () => {
    const { getByText } = render(<OfferText text="50% OFF" />);
    expect(getByText('50% OFF')).toBeTruthy();
  });
});
