import React from 'react';
import { render } from '@testing-library/react-native';
import LottieLoader from '../LottieLoader';

jest.mock('lottie-react-native', () => 'LottieView');
jest.mock('@assets/index', () => ({
  Animations: { car: 'car_anim', health: 'health_anim' }
}));

describe('LottieLoader Component', () => {
  it('renders nothing when manualVisible is false', () => {
    const { toJSON } = render(<LottieLoader manualVisible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders loader text when manualVisible is true', () => {
    const { getByText } = render(<LottieLoader manualVisible={true} />);
    expect(getByText(/Sit back and relax/)).toBeTruthy();
  });

  it('renders correctly for motor type', () => {
    const { getByText } = render(<LottieLoader manualVisible={true} type="motor" />);
    // Check for presence of something
    expect(getByText(/Sit back and relax/)).toBeTruthy();
  });
});
