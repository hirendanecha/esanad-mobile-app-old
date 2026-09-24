import React from 'react';
import { render } from '@testing-library/react-native';
import NoData from '../NoData';

jest.mock('lottie-react-native', () => 'LottieView');
jest.mock('@assets/index', () => ({
  Animations: { no_data: 'no_data_anim' }
}));

describe('NoData Component', () => {
  it('renders "No Data Found" text', () => {
    const { getByText } = render(<NoData />);
    expect(getByText('No Data Found')).toBeTruthy();
  });
});
