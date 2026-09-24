import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomRadioGroup from '../CustomRadioGroup';

describe('CustomRadioGroup Component', () => {
  const options = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  it('renders options and indicates selection', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <CustomRadioGroup options={options} selected="male" onChange={onChange} />
    );

    expect(getByText('Male')).toBeTruthy();
    expect(getByText('Female')).toBeTruthy();

    fireEvent.press(getByText('Female'));
    expect(onChange).toHaveBeenCalledWith(options[1]);
  });
});
