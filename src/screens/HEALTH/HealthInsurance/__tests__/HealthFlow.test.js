import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HealthFlowScreen from '../HealthFlowScreen';
import { ThemeProvider } from '@theme/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '@store/authStore';
import { useCreateHealthInsurance, useCreateManualUser } from '@hooks/HEALTH/healthFlow/useHealthFlow';
import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';

// Mock dependencies
jest.mock('@store/authStore');
jest.mock('@hooks/HEALTH/healthFlow/useHealthFlow', () => ({
  useCreateHealthInsurance: jest.fn(),
  useCreateManualUser: jest.fn(),
}));
jest.mock('@hooks/motorflow/useMotorFlowTop', () => ({
  useGetNationalList: jest.fn(),
}));
jest.mock('@provider/SocketProvider', () => ({
  useSocket: () => ({ socket: {}, connected: true }),
}));

// Mock child components to keep it simple or use real ones
// HealthFlowScreen uses HealthQuotesScreen and ExtraDetailScreen

const mockNavigation = { navigate: jest.fn(), reset: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { type: 'Self' } };

describe('HealthFlowScreen', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      user: {
        fullName: 'Test User',
        mobileNumber: '123456789',
        email: 'test@example.com',
        nationality: 'UAE',
        dateOfBirth: '1990-01-01',
        countryCode: '+971',
        city: 'Dubai',
      },
    });
    useCreateHealthInsurance.mockReturnValue({ mutate: jest.fn() });
    useCreateManualUser.mockReturnValue({ mutate: jest.fn() });
    useGetNationalList.mockReturnValue({ data: ['UAE', 'India'] });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <NavigationContainer>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NavigationContainer>
  );

  it('renders Step 0 (HealthQuotesScreen) for Self insurance', () => {
    const { getByText, getByDisplayValue } = render(
      <HealthFlowScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper }
    );

    expect(getByText('Self Health Insurance')).toBeTruthy();
    expect(getByDisplayValue('Test User')).toBeTruthy();
    expect(getByText('Get Quotes')).toBeTruthy();
  });

  it('triggers createHealthInsurance when clicking Get Quotes for Self', async () => {
    const mockMutate = jest.fn();
    useCreateHealthInsurance.mockReturnValue({ mutate: mockMutate });

    const { getByText } = render(
      <HealthFlowScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper }
    );

    fireEvent.press(getByText('Get Quotes'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('transitions to Step 1 for Family insurance', () => {
    const familyRoute = { params: { type: 'Family' } };
    const { getByText } = render(
      <HealthFlowScreen navigation={mockNavigation} route={familyRoute} />,
      { wrapper }
    );

    expect(getByText('Next')).toBeTruthy();
    fireEvent.press(getByText('Next'));
    
    // Should now show Step 1 indicators or title (Review / Extra Details)
    expect(getByText('Review')).toBeTruthy(); 
  });
});
