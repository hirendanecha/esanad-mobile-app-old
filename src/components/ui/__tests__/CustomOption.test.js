import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomOption from '../CustomOption';

describe('CustomOption Component', () => {
  const items = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ];

  it('renders items and handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CustomOption items={items} onPress={onPress} numberOfColumns={2} />
    );

    expect(getByText('Option A')).toBeTruthy();
    expect(getByText('Option B')).toBeTruthy();

    fireEvent.press(getByText('Option A'));
    expect(onPress).toHaveBeenCalledWith(items[0]);
  });
});
