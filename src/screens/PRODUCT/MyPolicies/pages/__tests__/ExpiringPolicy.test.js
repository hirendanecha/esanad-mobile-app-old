import React from 'react';
import { render } from '@testing-library/react-native';
import ExpiringPolicy from '../ExpiringPolicy';
import { useNavigation } from '@react-navigation/native';
import {
  useGetHealthExpiringPolicy,
  useGetMotorExpiringPolicy,
  useGetTravelExpiringPolicy,
} from '@hooks/profile/usePolicyProfile';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@hooks/profile/usePolicyProfile', () => ({
  useGetMotorExpiringPolicy: jest.fn(),
  useGetHealthExpiringPolicy: jest.fn(),
  useGetTravelExpiringPolicy: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockLinearGradient(props) {
    return <View {...props} testID="linear-gradient" />;
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        backgroundColor: 'white',
        border: 'gray',
        bgLinear1: 'transparent',
        bgLinear2: 'transparent',
        motorLinear: ['#fff', '#000'],
        healthLinear: ['#fff', '#000'],
        travelLinear: ['#fff', '#000'],
        musatahaLinear: ['#fff', '#000'],
        lableBg: 'transparent',
        text: 'black',
        textTertiary: 'gray',
        description: 'gray',
        floorBgColor: 'white',
      },
    },
  }),
}));

describe('ExpiringPolicy Component Tests', () => {
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate, goBack: jest.fn() });
    
    useGetTravelExpiringPolicy.mockReturnValue({ data: [] });
  });

  it('renders "No Expiring Policies" empty state when no data exists', () => {
    useGetMotorExpiringPolicy.mockReturnValue({ data: [] });
    useGetHealthExpiringPolicy.mockReturnValue({ data: [] });

    const { getByText } = render(<ExpiringPolicy />);
    expect(getByText('No Expiring Policies')).toBeTruthy();
  });

  it('renders expiring motor policy cards correctly', () => {
    const mockMotorPolicy = [{
      _id: 'expiring_motor_1',
      carId: 'car_2',
      quoteId: {
        totalPrice: 1200,
        carValue: 40000,
        insuranceType: 'thirdparty',
        company: { companyName: 'Expiring Motor Co.' },
        response: { Offers: [] } // Test without offers for coverage logic
      },
      response: { Errors: [] }
    }];

    useGetMotorExpiringPolicy.mockReturnValue({ data: mockMotorPolicy });
    useGetHealthExpiringPolicy.mockReturnValue({ data: [] });

    const { getByText, getAllByText } = render(<ExpiringPolicy />);

    expect(getByText('Motor Insurance')).toBeTruthy();
    expect(getAllByText('Expiring Motor Co.')[0]).toBeTruthy();
    expect(getAllByText('---')[0]).toBeTruthy(); // Repair type and Excess Charges evaluate to ---
    expect(getByText('AED 1,200.00')).toBeTruthy();
  });

  it('renders expiring health policy cards and medical benefits formats', () => {
    const mockHealthPolicy = [{
      _id: 'expiring_health_1',
      quoteId: {
        companyData: { companyName: 'Expiring Health Care', logoImg: '' },
        plan: { planName: 'Silver Plan' },
        network: { networkName: 'Basic Network' },
        coPay: '10%',
        includedCovers: [
          { benefit: { name: 'Aggregate Annual limit' }, limitAmount: '200,000' }
        ],
        totalPrice: 2000
      },
      response: { Errors: [] }
    }];

    useGetMotorExpiringPolicy.mockReturnValue({ data: [] });
    useGetHealthExpiringPolicy.mockReturnValue({ data: mockHealthPolicy });

    const { getByText } = render(<ExpiringPolicy />);

    expect(getByText('Health Insurance')).toBeTruthy();
    expect(getByText('Silver Plan')).toBeTruthy();
    expect(getByText('AED 200,000')).toBeTruthy();
    expect(getByText('AED 2,000.00')).toBeTruthy();
  });
});
