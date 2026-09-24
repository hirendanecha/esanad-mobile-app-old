import React from 'react';
import { render } from '@testing-library/react-native';
import StepIndicator from '../StepIndicator';

describe('StepIndicator Component', () => {
  const steps = [
    { key: '1', label: 'Start' },
    { key: '2', label: 'Middle' },
    { key: '3', label: 'End' },
  ];

  it('renders all steps', () => {
    const { getByText } = render(
      <StepIndicator steps={steps} currentStep={1} />
    );

    expect(getByText('Start')).toBeTruthy();
    expect(getByText('Middle')).toBeTruthy();
    expect(getByText('End')).toBeTruthy();
  });
});
