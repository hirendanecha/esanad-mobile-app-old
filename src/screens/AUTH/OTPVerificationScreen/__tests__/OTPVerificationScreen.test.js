import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OTPVerificationScreen from '../OTPVerificationScreen';
import { ThemeProvider } from '@theme/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useOTPVerify } from '@hooks/auth/useOTPVerify';
import { useResendOTP } from '@hooks/auth/useResendOTP';
import { useUserStore } from '@store/userStore';

// Mock hooks
jest.mock('@hooks/auth/useOTPVerify', () => ({
  useOTPVerify: jest.fn(),
}));
jest.mock('@hooks/auth/useResendOTP', () => ({
  useResendOTP: jest.fn(),
}));

// Mock navigation/route
const mockNavigation = { goBack: jest.fn() };
const mockRoute = {
  params: {
    countryCode: '971',
    mobileNumber: '123456789',
    ref: 'test-ref',
  },
};

describe('OTPVerificationScreen', () => {
  const mockVerifyOtp = jest.fn();
  const mockResendOtp = jest.fn();

  beforeEach(() => {
    useOTPVerify.mockReturnValue({ mutate: mockVerifyOtp, isPending: false });
    useResendOTP.mockReturnValue({ mutate: mockResendOtp });
    useUserStore.setState({ contactNumber: '123456789' });
    jest.clearAllMocks();
  });

  const renderScreen = () =>
    render(
      <SafeAreaProvider>
        <ThemeProvider>
          <OTPVerificationScreen navigation={mockNavigation} route={mockRoute} />
        </ThemeProvider>
      </SafeAreaProvider>
    );

  it('renders correctly with phone number', () => {
    const { getAllByText, getByText } = renderScreen();
    // Index 0 is Title, Index 1 is Button
    expect(getAllByText(/Verify OTP/i)[0]).toBeTruthy();
    expect(getByText(/\+971 123456789/)).toBeTruthy();
  });

  it('calls verifyOtp when OTP is entered and submit is pressed', async () => {
    const { getAllByText, getAllByPlaceholderText } = renderScreen();
    
    const inputs = getAllByPlaceholderText('0');
    fireEvent.changeText(inputs[0], '1');
    fireEvent.changeText(inputs[1], '2');
    fireEvent.changeText(inputs[2], '3');
    fireEvent.changeText(inputs[3], '4');
    fireEvent.changeText(inputs[4], '5');
    fireEvent.changeText(inputs[5], '6');

    // Index 1 is the Submit Button
    fireEvent.press(getAllByText('Verify OTP')[1]);

    expect(mockVerifyOtp).toHaveBeenCalledWith(expect.objectContaining({
      otp: '123456',
      mobileNumber: '123456789',
    }));
  });

  it('calls resendOtp when resend link is pressed', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Resend OTP'));
    expect(mockResendOtp).toHaveBeenCalled();
  });
});
