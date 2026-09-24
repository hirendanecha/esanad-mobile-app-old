import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyVoucher from '../MyVoucher';
import Clipboard from '@react-native-clipboard/clipboard';
import { useGetUserVouchers } from '@hooks/profile/useProfile';

// Mock dependencies
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@hooks/profile/useProfile', () => ({
  useGetUserVouchers: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockIcon({ name }) {
    return <Text testID={`icon-${name}`}>{name}</Text>;
  };
});

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        backgroundColor: 'white',
        border: 'gray',
        floorBgColor: 'lightgray',
        text: 'black',
        textTertiary: 'gray',
        description: 'gray',
      },
    },
  }),
}));

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockLinearGradient(props) {
    return <View {...props} testID="linear-gradient" />;
  };
});

describe('MyVoucher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    useGetUserVouchers.mockReturnValue({
      data: [],
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(<MyVoucher />);
    expect(getByText('No Vouchers Yet')).toBeTruthy();
  });

  it('renders list and triggers clipboard copy on code press', async () => {
    const mockVouchers = [
      {
        _id: '1',
        voucherCode: 'SALE2026',
        voucherId: { voucherName: 'Summer Sale', description: 'Test' },
        price: 50,
        expiryDate: '2026-12-31',
      },
    ];

    useGetUserVouchers.mockReturnValue({
      data: mockVouchers,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(<MyVoucher />);
    
    expect(getByText('Summer Sale')).toBeTruthy();
    expect(getByText('SALE2026')).toBeTruthy();

    fireEvent.press(getByText('SALE2026'));

    await waitFor(() => {
      expect(Clipboard.setString).toHaveBeenCalledWith('SALE2026');
    });
  });
});
