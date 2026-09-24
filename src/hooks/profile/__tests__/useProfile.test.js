import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile, useUpdateProfile } from '../useProfile';
import { useAuthStore } from '@store/authStore';
import { useToast } from '@components/ui/Toast';
import ProfileServices from '@api/services/profileService';

jest.mock('@store/authStore');
jest.mock('@components/ui/Toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('@api/services/profileService', () => ({
  getMe: jest.fn(),
  updateuserdetails: jest.fn(),
}));

describe('useProfile Hooks', () => {
  let queryClient;
  let mockSetUser;
  let mockShowToast;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    
    mockSetUser = jest.fn();
    useAuthStore.mockImplementation(selector => selector({ setUser: mockSetUser }));
    
    mockShowToast = jest.fn();
    useToast.mockReturnValue({ showToast: mockShowToast });
    
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('useProfile updates user store on success', async () => {
    const mockUserData = { id: 1, name: 'John' };
    ProfileServices.getMe.mockResolvedValueOnce({
      data: { data: mockUserData, success: true },
    });

    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
  });

  it('useUpdateProfile updates user store and logs success', async () => {
    const updatedData = { id: 1, name: 'John Updated' };
    ProfileServices.updateuserdetails.mockResolvedValueOnce({
      data: { data: updatedData, success: true },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    act(() => {
      result.current.mutate({ name: 'John Updated' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSetUser).toHaveBeenCalledWith(updatedData);
  });
});
