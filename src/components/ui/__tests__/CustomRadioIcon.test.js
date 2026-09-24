import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import CustomRadioIcon from '../CustomRadioIcon';

describe('CustomRadioIcon Component', () => {
  const options = [
    { label: 'Car', value: 'car', icon: <View testID="car-icon" /> },
    { label: 'Bike', value: 'bike', icon: <View testID="bike-icon" /> },
  ];

  it('renders labels and icons', () => {
    const onSelect = jest.fn();
    const { getByText, getByTestId } = render(
      <CustomRadioIcon options={options} onSelect={onSelect} />
    );

    expect(getByText('Car')).toBeTruthy();
    expect(getByTestId('car-icon')).toBeTruthy();

    fireEvent.press(getByText('Bike'));
    expect(onSelect).toHaveBeenCalledWith(options[1]);
  });
});
