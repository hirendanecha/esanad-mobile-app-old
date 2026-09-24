import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditSelectionModal from '../EditSelectionModel';
import { useMotorStore } from '@store/MOTOR/motorStore';

jest.mock('@store/MOTOR/motorStore', () => ({
  useMotorStore: jest.fn(),
}));

jest.mock('@assets/icons/Motor/Car', () => 'CarIcon');

describe('EditSelectionModal Component', () => {
  const mockUpdateStep = jest.fn();
  const mockUpdateSubStep = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    useMotorStore.mockReturnValue({
      year: 2024,
      brand: 'Toyota',
      model: 'Camry',
      updateStep: mockUpdateStep,
      updateSubStep: mockUpdateSubStep,
      updateYear: jest.fn(),
      updateBrand: jest.fn(),
      updateModel: jest.fn(),
      updateTrim: jest.fn(),
    });
  });

  it('renders and handles selection', () => {
    const { getByText } = render(
      <EditSelectionModal visible={true} onClose={mockOnClose} />
    );

    expect(getByText('Edit Your Selection')).toBeTruthy();
    expect(getByText('Year - 2024')).toBeTruthy();
    expect(getByText('Brand - Toyota')).toBeTruthy();

    fireEvent.press(getByText('Year - 2024'));
    expect(mockUpdateStep).toHaveBeenCalledWith(0);
    expect(mockUpdateSubStep).toHaveBeenCalledWith(1);
  });
});
