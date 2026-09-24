import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CountryPhoneInput from '../CountryPhoneInput';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        red: 'red',
        border: 'grey',
        backgroundColor: 'white',
        text: 'black',
        description: 'grey',
      },
    },
  }),
}));

describe('CountryPhoneInput Component', () => {
  it('updates value and calls onChange for valid input', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <CountryPhoneInput onChange={onChange} />
    );

    const input = getByPlaceholderText('5XXXXXXXX');
    fireEvent.changeText(input, '501234567');

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      phone: '501234567',
      isValid: true,
      isMobile: true,
      fullNumber: '+971501234567',
    }));
  });

  it('shows error on blur for invalid short number', () => {
    const { getByPlaceholderText, getByText } = render(
      <CountryPhoneInput value="123" />
    );

    const input = getByPlaceholderText('5XXXXXXXX');
    fireEvent(input, 'blur');

    expect(getByText('Phone number is too short')).toBeTruthy();
  });

  it('shows error on blur for invalid mobile prefix', () => {
    const { getByPlaceholderText, getByText } = render(
      <CountryPhoneInput value="401234567" />
    );

    const input = getByPlaceholderText('5XXXXXXXX');
    fireEvent(input, 'blur');

    expect(getByText('Mobile number must start with 5')).toBeTruthy();
  });
});
