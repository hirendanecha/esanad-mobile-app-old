import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SocialButton from '../SocialButton';

describe('SocialButton Component', () => {
  it('renders correctly and handles press', () => {
    const onPress = jest.fn();
    const { getByText, getByRole, getByTestId } = render(
      <SocialButton icon={{ uri: 'test_icon' }} onPress={onPress} />
    );

    expect(getByText('UAE Pass')).toBeTruthy();
    
    // The TouchableOpacity is a child of the View. In our mock it should be findable.
    const btn = getByTestId('social-button');
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalled();
  });
});
