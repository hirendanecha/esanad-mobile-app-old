import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '../useLogIn';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '@components/ui/Toast';
import AuthServices from '@api/services/authService';

import { SCREEN_NAMES } from '@constants/screenNames';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@components/ui/Toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@api/services/authService', () => ({
  login: jest.fn(),
}));

describe('useLogin', () => {
  let queryClient;
  let mockNavigate;
  let mockShowToast;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    
    mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });
    
    mockShowToast = jest.fn();
    useToast.mockReturnValue({ showToast: mockShowToast });
    
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('handles successful login', async () => {
    AuthServices.login.mockResolvedValueOnce({
      data: { success: true, data: { phone: '123' } },
    });

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).toHaveBeenCalledWith(SCREEN_NAMES.OTP_VERIFICATION_SCREEN, { phone: '123' });
  });

  it('handles login error', async () => {
    AuthServices.login.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate({ phone: '123' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockShowToast).toHaveBeenCalledWith('Network Error', 'error');
  });
});
