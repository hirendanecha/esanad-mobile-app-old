import React from 'react';
import { render } from '@testing-library/react-native';
import CustomSingleSlider from '../CustomSingleSlider';

describe('CustomSingleSlider Component', () => {
  const theme = {
    colors: {
      primary: '#007AFF',
      backgroundColor: '#FFFFFF',
      border: '#C7C7CC',
      floorBgColor: '#E5E5EA',
      textTertiary: '#AEAEB2',
    }
  };

  it('renders correctly', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <CustomSingleSlider
        sliderWidth={300}
        min={0}
        max={100}
        step={1}
        onValueChange={onValueChange}
        theme={theme}
      />
    );

    expect(getByText(/min[\s\S]*0/)).toBeTruthy();
    expect(getByText(/max[\s\S]*100/)).toBeTruthy();
  });
});
