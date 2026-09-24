import React from 'react';
import { render } from '@testing-library/react-native';
import CustomRangeSlider from '../CustomRangeSlider';

describe('CustomRangeSlider Component', () => {
  const theme = {
    colors: {
      primary: '#007AFF',
      floorBgColor: '#E5E5EA',
      placeholder: '#8E8E93',
    }
  };

  it('renders correctly', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <CustomRangeSlider
        sliderWidth={300}
        min={0}
        max={100}
        step={1}
        onValueChange={onValueChange}
        theme={theme}
      />
    );

    expect(getByText('0')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
  });
});
