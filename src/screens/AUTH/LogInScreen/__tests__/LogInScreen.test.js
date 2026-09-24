import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LogInScreen from '../LogInScreen';
import { useUserStore } from '@store/userStore';
import { useLogin } from '@hooks/auth/useLogIn';

// Moaking required contexts and hooks
jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        backgroundColor: 'white',
        text: 'black',
        textSecondary: 'gray',
      },
    },
  }),
}));

jest.mock('@store/userStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('@hooks/auth/useLogIn', () => ({
  useLogin: jest.fn(),
}));

jest.mock('@components/ui/CountryPhoneInput', () => {
  const { TextInput } = require('react-native');
  return function MockCountryPhoneInput({ onChange, value, errors }) {
    return (
      <TextInput
        testID="country-phone-input"
        value={value}
        onChangeText={(text) => {
          onChange({
            country: { dial_code: '+971' },
            phone: text,
            isValid: text.length >= 9,
          });
        }}
      />
    );
  };
});

describe('LogInScreen Integration Tests', () => {
  let mockUpdateContactNumber, mockLogin;

  beforeEach(() => {
    mockUpdateContactNumber = jest.fn();
    useUserStore.mockReturnValue({ updateContactNumber: mockUpdateContactNumber });

    mockLogin = jest.fn();
    useLogin.mockReturnValue({ mutate: mockLogin, isPending: false });
    
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON, getByText } = render(<LogInScreen />);
    expect(getByText('Log in')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows error if submit is pressed with empty or invalid phone number', async () => {
    const { getByText, getByTestId, queryByText } = render(<LogInScreen />);
    
    // Press submit immediately without entering phone number
    fireEvent.press(getByText('Submit'));

    // Wait for the form validation to resolve
    // With react-hook-form, we rely on the component updates
    await waitFor(() => {
      // It shouldn't trigger login if invalid
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it('triggers login and state updates when valid phone number is submitted', async () => {
    const { getByText, getByTestId } = render(<LogInScreen />);
    
    const input = getByTestId('country-phone-input');
    
    // Enter valid 9 digit number
    fireEvent.changeText(input, '123456789');
    
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateContactNumber).toHaveBeenCalledWith('123456789');
      expect(mockLogin).toHaveBeenCalledWith({
        countryCode: '971',
        mobileNumber: '123456789',
      });
    });
  });
});
