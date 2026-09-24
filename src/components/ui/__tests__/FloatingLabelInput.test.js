import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FloatingLabelInput from '../FloatingLabelInput';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        red: 'red',
        border: 'grey',
        backgroundColor: 'white',
        text: 'black',
        textTertiary: 'grey',
        placeholder: 'lightgrey',
      },
    },
  }),
}));

describe('FloatingLabelInput Component', () => {
  it('renders label and value correctly', () => {
    const { getByText, getByDisplayValue } = render(
      <FloatingLabelInput label="User Name" value="John Doe" />
    );
    expect(getByText('User Name')).toBeTruthy();
    expect(getByDisplayValue('John Doe')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <FloatingLabelInput label="Test" value="initial" onChangeText={onChangeText} />
    );
    
    const input = getByDisplayValue('initial');
    fireEvent.changeText(input, 'updated');
    
    expect(onChangeText).toHaveBeenCalledWith('updated');
  });

  it('shows error message when showErrorMessage is true', () => {
    const { getByText } = render(
      <FloatingLabelInput label="Test" value="" error="Required field" showErrorMessage={true} />
    );
    expect(getByText('Required field')).toBeTruthy();
  });
});
