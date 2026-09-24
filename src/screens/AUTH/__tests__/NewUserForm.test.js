import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import NewUserForm from '../NewUserForm';
import { ThemeProvider } from '@theme/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';
import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';
import { useUpdateProfile, useProfile } from '@hooks/profile/useProfile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock hooks
jest.mock('@hooks/motorflow/useMotorFlowTop', () => ({
  useGetNationalList: jest.fn(),
}));
jest.mock('@hooks/profile/useProfile', () => ({
  useUpdateProfile: jest.fn(),
  useProfile: jest.fn(),
  useUploadEmiratesId: jest.fn(() => ({ mutate: jest.fn() })),
  useUploadDrivingLicense: jest.fn(() => ({ mutate: jest.fn() })),
  useVerifyEmiratesId: jest.fn(() => ({ mutate: jest.fn() })),
  useVerifyDrivingLicense: jest.fn(() => ({ mutate: jest.fn() })),
  useUploadProfilePic: jest.fn(() => ({ mutate: jest.fn() })),
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  types: { images: 'images', pdf: 'pdf' },
}));

jest.mock('@components/ui/CustomDatePicker', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ visible, onConfirm, onClose }) => visible ? (
    <TouchableOpacity onPress={() => onConfirm(new Date('2000-01-01'))}>
      <Text>Confirm Date</Text>
    </TouchableOpacity>
  ) : null;
});

const mockNavigation = { navigate: jest.fn(), replace: jest.fn() };

describe('NewUserForm', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    useGetNationalList.mockReturnValue({ data: ['United Arab Emirates', 'India'] });
    useUpdateProfile.mockReturnValue({ mutate: jest.fn() });
    useProfile.mockReturnValue({ mutate: jest.fn() });
    
    useAuthStore.setState({ user: { _id: 'user123' }, setUserDetailsUpdate: jest.fn() });
    useUserStore.setState({ contactNumber: '123456789' });
    
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );

  it('validates and submits the form', async () => {
    const mockUpdateProfile = jest.fn();
    useUpdateProfile.mockReturnValue({ mutate: mockUpdateProfile });

    const { getByText, getByPlaceholderText, getAllByText } = render(<NewUserForm navigation={mockNavigation} />, { wrapper });
    
    // Fill required fields
    fireEvent.changeText(getByPlaceholderText('784-XXXX-XXXXXXX-X'), '784-1234-1234567-1');
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('example@email.com'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your occupation'), 'Engineer');

    // Select Date of Birth
    fireEvent.press(getByText('Select date'));
    fireEvent.press(getByText('Confirm Date'));

    // Select Nationality (from quick options or dropdown)
    fireEvent.press(getAllByText('UAE')[0]);
    
    // Select City
    fireEvent.press(getAllByText('Abu Dhabi')[0]);

    // Submit
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
        fullName: 'John Doe',
        email: 'john@example.com',
        emiratesId: '784-1234-1234567-1',
      }), expect.anything());
    }, { timeout: 3000 });
  });
});
