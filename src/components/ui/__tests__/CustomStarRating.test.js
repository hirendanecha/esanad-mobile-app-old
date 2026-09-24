import React from 'react';
import { render } from '@testing-library/react-native';
import CustomStarRating from '../CustomStarRating';

jest.mock('react-native-star-rating-widget', () => 'StarRating');

describe('CustomStarRating Component', () => {
  it('renders rating correctly', () => {
    const { toJSON } = render(<CustomStarRating rating={4.5} />);
    expect(toJSON()).not.toBeNull();
  });
});
