import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResendOTP } from '../useResendOTP';
import { useToast } from '@components/ui/Toast';
import AuthServices from '@api/services/authService';

jest.mock('@components/ui/Toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@api/services/authService', () => ({
  resendOtp: jest.fn(),
}));

describe('useResendOTP', () => {
  let queryClient;
  let mockShowToast;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    
    mockShowToast = jest.fn();
    useToast.mockReturnValue({ showToast: mockShowToast });
    
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('handles successful OTP resend', async () => {
    AuthServices.resendOtp.mockResolvedValueOnce({
      data: { success: true, message: 'OTP Sent' },
    });

    const { result } = renderHook(() => useResendOTP(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockShowToast).toHaveBeenCalledWith('OTP Sent', 'success');
  });

  it('handles error on OTP resend', async () => {
    AuthServices.resendOtp.mockRejectedValueOnce(new Error('Failed to send'));

    const { result } = renderHook(() => useResendOTP(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockShowToast).toHaveBeenCalledWith('Failed to send', 'error');
  });
});
