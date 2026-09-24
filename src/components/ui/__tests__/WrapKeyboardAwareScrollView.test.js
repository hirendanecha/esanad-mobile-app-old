import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import WrapKeyboardAwareScrollView from '../WrapKeyboardAwareScrollView';

describe('WrapKeyboardAwareScrollView Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <WrapKeyboardAwareScrollView>
        <Text>Content inside wrapper</Text>
      </WrapKeyboardAwareScrollView>
    );

    expect(getByText('Content inside wrapper')).toBeTruthy();
  });
});
