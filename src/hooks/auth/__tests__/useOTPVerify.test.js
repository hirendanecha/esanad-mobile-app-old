import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOTPVerify } from '../useOTPVerify';
import { useAuthStore } from '@store/authStore';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '@components/ui/Toast';
import { useProfile } from '@hooks/profile/useProfile';
import AuthServices from '@api/services/authService';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('@components/ui/Toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('@hooks/profile/useProfile', () => ({
  useProfile: jest.fn(),
}));
jest.mock('@api/services/authService', () => ({
  verifyOtp: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('@constants/screenNames', () => ({
  SCREEN_NAMES: {
    BOTTOM_TABS: 'BOTTOM_TABS',
    NEW_USER_FORM: 'NEW_USER_FORM',
  }
}));

describe('useOTPVerify', () => {
  let queryClient;
  let mockNavigationReset;
  let mockShowToast;
  let mockGetProfile;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    
    mockNavigationReset = jest.fn();
    useNavigation.mockReturnValue({ reset: mockNavigationReset });
    
    mockShowToast = jest.fn();
    useToast.mockReturnValue({ showToast: mockShowToast });
    
    mockGetProfile = jest.fn();
    useProfile.mockReturnValue({ mutate: mockGetProfile });
    
    useAuthStore.setState({
      token: null,
      user: null,
      userDetailsUpdate: false,
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should handle successful OTP verification for an existing user', async () => {
    AuthServices.verifyOtp.mockResolvedValueOnce({
      data: { token: 'new-token', data: { id: 1 }, success: true, isNew: false },
    });

    const { result } = renderHook(() => useOTPVerify(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123', otp: '1111' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(useAuthStore.getState().token).toBe('new-token');
    expect(mockGetProfile).toHaveBeenCalled();
    expect(mockNavigationReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'BOTTOM_TABS' }],
    });
  });

  it('should handle successful OTP verification for a NEW user', async () => {
    AuthServices.verifyOtp.mockResolvedValueOnce({
      data: { token: 'new-token', data: { id: 1 }, success: true, isNew: true },
    });

    const { result } = renderHook(() => useOTPVerify(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123', otp: '1111' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(useAuthStore.getState().userDetailsUpdate).toBe(true);
    expect(mockNavigationReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'NEW_USER_FORM' }],
    });
  });

  it('should handle OTP error', async () => {
    AuthServices.verifyOtp.mockRejectedValueOnce(new Error('Invalid OTP'));

    const { result } = renderHook(() => useOTPVerify(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123', otp: '0000' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockShowToast).toHaveBeenCalledWith('Invalid OTP', 'error');
  });
});
