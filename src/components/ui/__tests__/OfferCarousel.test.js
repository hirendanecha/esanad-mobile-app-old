import React from 'react';
import { render } from '@testing-library/react-native';
import OfferCarousel from '../OfferCarousel';

jest.mock('react-native-reanimated-carousel', () => 'Carousel');

describe('OfferCarousel Component', () => {
  const offers = [
    { id: '1', image: 'test_img_1', title: 'Offer 1' },
  ];

  it('renders correctly', () => {
    const { toJSON } = render(<OfferCarousel data={offers} />);
    expect(toJSON()).not.toBeNull();
  });
});
