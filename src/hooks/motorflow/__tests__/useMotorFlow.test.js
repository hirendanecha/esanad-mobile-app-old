import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetMotorQuotes } from '../useMotorFlow';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import { useNavigation } from '@react-navigation/native';
import { useLottieLoader } from '@provider/LottieLoaderProvider';
import MotorService from '@api/services/MotorService';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@components/ui/Toast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@provider/LottieLoaderProvider', () => ({
  useLottieLoader: jest.fn(),
}));

jest.mock('@api/services/MotorService', () => ({
  getMotorQuotes: jest.fn(),
  getYearList: jest.fn(),
}));

jest.mock('@store/MOTOR/motorStore', () => ({
  useMotorDetalisStore: jest.fn(),
}));

jest.mock('@constants/screenNames', () => ({
  SCREEN_NAMES: {
    INSURANCE_LIST_SCREEN: 'INSURANCE_LIST_SCREEN',
  }
}));

describe('useMotorFlow Hooks - useGetMotorQuotes', () => {
  let queryClient;
  let mockNavigate;
  let mockHideLoader;
  let mockUpdateQuotesList;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    
    mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });
    
    mockHideLoader = jest.fn();
    useLottieLoader.mockReturnValue({ hideLoader: mockHideLoader });
    
    mockUpdateQuotesList = jest.fn();
    useMotorDetalisStore.mockReturnValue({ updateQuotesList: mockUpdateQuotesList });
    
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch quotes, update store, hide loader, and navigate on success', async () => {
    const mockData = { quotes: [{ id: 1, premium: 1000 }] };
    MotorService.getMotorQuotes.mockResolvedValueOnce({
      data: { success: true, data: mockData },
    });

    const { result } = renderHook(() => useGetMotorQuotes(), { wrapper });

    act(() => {
      result.current.mutate({ carId: '123' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUpdateQuotesList).toHaveBeenCalledWith(mockData.quotes);
    expect(mockNavigate).toHaveBeenCalledWith('INSURANCE_LIST_SCREEN', {
      data: mockData,
    });
    expect(mockHideLoader).toHaveBeenCalled();
  });

  it('useYearList fetches and returns year data', async () => {
    const { useYearList } = require('../useMotorFlow');
    const mockYears = [2024, 2023];
    MotorService.getYearList.mockResolvedValueOnce({
      data: { success: true, data: mockYears },
    });

    const { result } = renderHook(() => useYearList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockYears);
  });
});
