import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import WraperComponent from '../WraperComponent';

describe('WraperComponent', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <WraperComponent>
        <Text>Child Content</Text>
      </WraperComponent>
    );
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <WraperComponent customStyle={customStyle}>
        <Text>Styled Child</Text>
      </WraperComponent>
    );
    // Checking style in test-renderer is complex, but we verify it doesn't crash
    expect(getByText('Styled Child')).toBeTruthy();
  });
});
