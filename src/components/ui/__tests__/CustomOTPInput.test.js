import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomOTPInput from '../CustomOTPInput';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        primary: 'blue',
        border: 'grey',
        backgroundColor: 'white',
        text: 'black',
        description: 'grey',
      },
    },
  }),
}));

describe('CustomOTPInput Component', () => {
  it('renders correct number of input boxes', () => {
    const { getAllByPlaceholderText } = render(<CustomOTPInput length={4} />);
    expect(getAllByPlaceholderText('0')).toHaveLength(4);
  });

  it('calls onChange when a digit is entered', () => {
    const onChange = jest.fn();
    const { getAllByPlaceholderText } = render(<CustomOTPInput length={4} onChange={onChange} />);
    
    const inputs = getAllByPlaceholderText('0');
    fireEvent.changeText(inputs[0], '1');
    
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('calls onComplete when all digits are entered', () => {
    const onComplete = jest.fn();
    const { getAllByPlaceholderText } = render(<CustomOTPInput length={3} onComplete={onComplete} />);
    
    const inputs = getAllByPlaceholderText('0');
    fireEvent.changeText(inputs[0], '1');
    fireEvent.changeText(inputs[1], '2');
    fireEvent.changeText(inputs[2], '3');
    
    expect(onComplete).toHaveBeenCalledWith('123');
  });

  it('handles pasting multiple digits', () => {
    const onChange = jest.fn();
    const { getAllByPlaceholderText } = render(<CustomOTPInput length={4} onChange={onChange} />);
    
    const inputs = getAllByPlaceholderText('0');
    fireEvent.changeText(inputs[0], '1234');
    
    expect(onChange).toHaveBeenCalledWith('1234');
  });
});
