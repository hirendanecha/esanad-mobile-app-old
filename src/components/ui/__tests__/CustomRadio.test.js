import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomRadio from '../CustomRadio';

describe('CustomRadio Component', () => {
  const options = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  it('renders options and handles selection', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<CustomRadio options={options} onSelect={onSelect} />);

    expect(getByText('Yes')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();

    fireEvent.press(getByText('No'));
    expect(onSelect).toHaveBeenCalledWith(options[1]);
  });
});
