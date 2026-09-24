import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomSegment from '../CustomSegment';

describe('CustomSegment Component', () => {
  const options = ['First', 'Second'];

  it('renders segments and handles press', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <CustomSegment options={options} onChange={onChange} />
    );

    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();

    fireEvent.press(getByText('Second'));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
