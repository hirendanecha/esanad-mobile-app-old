import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomOptionList from '../CustomOptionList';

describe('CustomOptionList Component', () => {
  const items = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
  ];

  it('renders items and handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CustomOptionList items={items} onPress={onPress} />
    );

    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();

    fireEvent.press(getByText('2'));
    expect(onPress).toHaveBeenCalledWith(items[1]);
  });
});
