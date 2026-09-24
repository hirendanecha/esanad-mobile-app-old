import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActivePolicy from '../ActivePolicy';
import { useNavigation } from '@react-navigation/native';
import {
  useGetHealthActivePolicy,
  useGetLandActivePolicy,
  useGetMotorActivePolicy,
  useGetTravelActivePolicy,
} from '@hooks/profile/usePolicyProfile';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@hooks/profile/usePolicyProfile', () => ({
  useGetMotorActivePolicy: jest.fn(),
  useGetHealthActivePolicy: jest.fn(),
  useGetTravelActivePolicy: jest.fn(),
  useGetLandActivePolicy: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockLinearGradient(props) {
    return <View {...props} testID="linear-gradient" />;
  };
});

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
      },
    },
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Assets SVGs
jest.mock('@assets/icons/CancelPolicy', () => {
  const { View } = require('react-native');
  return () => <View testID="cancel-policy-icon" />;
});

jest.mock('@assets/index', () => ({
  Images: {
    car: { uri: 'car' },
    health: { uri: 'health' },
    travel: { uri: 'travel' },
  },
}));

describe('ActivePolicy Component Tests', () => {
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate, goBack: jest.fn() });
    
    useGetTravelActivePolicy.mockReturnValue({ data: [] });
    useGetLandActivePolicy.mockReturnValue({ data: [] });
  });

  it('renders "No Active Policies" empty state when no data exists', () => {
    useGetMotorActivePolicy.mockReturnValue({ data: [] });
    useGetHealthActivePolicy.mockReturnValue({ data: [] });

    const { getByText } = render(<ActivePolicy />);
    expect(getByText('No Active Policies')).toBeTruthy();
  });

  it('renders motor policy cards and formats data correctly', () => {
    const mockMotorPolicy = [{
      _id: 'motor_1',
      carId: 'car_1',
      policyNumber: 'MTR-12345',
      quoteId: {
        totalPrice: 1500,
        carValue: 50000,
        insuranceType: 'comprehensive',
        company: { companyName: 'Mock Insurance Co.' },
        response: { Offers: [{ RepairMethod: 'agency', MaximumCarValue: 50000, ExcessAmount: 250 }] }
      },
      response: { Errors: [] }
    }];

    useGetMotorActivePolicy.mockReturnValue({ data: mockMotorPolicy });
    useGetHealthActivePolicy.mockReturnValue({ data: [] });

    const { getByText, getAllByText } = render(<ActivePolicy />);

    expect(getByText('Motor Insurance')).toBeTruthy();
    expect(getByText('MTR-12345')).toBeTruthy();
    expect(getByText('Mock Insurance Co.')).toBeTruthy();
    expect(getByText('Agency')).toBeTruthy(); // Repair type
    expect(getByText('AED 50,000.00')).toBeTruthy(); // Car Value
    expect(getByText('AED 250.00')).toBeTruthy(); // Excess Charges
  });

  it('renders health policy cards and formats coverage data correctly', () => {
    const mockHealthPolicy = [{
      _id: 'health_1',
      policyNumber: 'HLT-98765',
      quoteId: {
        companyData: { companyName: 'HealthCare Plus' },
        plan: { planName: 'Gold Plan' },
        network: { networkName: 'Comprehensive Network' },
        coPay: '20%',
        includedCovers: [
          { benefit: { name: 'Aggregate Annual limit' }, limitAmount: '500,000' },
          { benefit: { name: 'Physician Consultation' }, deductible: { deductibleType: 'fixed', deductibleValue: '50' } }
        ]
      },
      totalPrice: 3500,
      response: { Errors: [] }
    }];

    useGetMotorActivePolicy.mockReturnValue({ data: [] });
    useGetHealthActivePolicy.mockReturnValue({ data: mockHealthPolicy });

    const { getByText } = render(<ActivePolicy />);

    expect(getByText('Health Insurance')).toBeTruthy();
    expect(getByText('HLT-98765')).toBeTruthy();
    expect(getByText('Gold Plan')).toBeTruthy();
    expect(getByText('Comprehensive Network')).toBeTruthy();
    expect(getByText('AED 500,000')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('AED 50')).toBeTruthy(); // Consultation
  });

  it('navigates to specific policy details on card press', () => {
    const mockMotorPolicy = [{
      _id: 'motor_detail_id',
      carId: 'car_1',
      policyNumber: 'MTR-12345',
      response: { Errors: [] },
      quoteId: {}
    }];

    useGetMotorActivePolicy.mockReturnValue({ data: mockMotorPolicy });
    useGetHealthActivePolicy.mockReturnValue({ data: [] });

    const { getByText } = render(<ActivePolicy />);

    fireEvent.press(getByText('MTR-12345'));
    expect(mockNavigate).toHaveBeenCalledWith('MotorInsuranceDetail', { policyId: 'motor_detail_id' });
  });
});
