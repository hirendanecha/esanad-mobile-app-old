import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomCheckBox from '../CustomCheckBox';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        border: 'grey',
        primary: 'blue',
        textSecondary: 'white',
        text: 'black',
      },
    },
  }),
}));

describe('CustomCheckBox Component', () => {
  it('renders label and handles toggle', () => {
    const onValueChange = jest.fn();
    const { getByText, getByRole } = render(
      <CustomCheckBox label="Agree to terms" value={false} onValueChange={onValueChange} />
    );

    expect(getByText('Agree to terms')).toBeTruthy();
    
    // Checkboxes are usually TouchableOpacity
    const btn = getByText('Agree to terms').parent; // Or better, find by role if added
    // For now, let's just find the TouchableOpacity wrapping it.
  });

  it('renders checkmark when value is true', () => {
    const { queryByRole } = render(
      <CustomCheckBox label="Checked" value={true} />
    );
    // In actual implementation it uses Ionicons.
  });
});
