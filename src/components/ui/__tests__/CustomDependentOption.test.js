import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomDependentOption from '../CustomDependentOption';

jest.mock('@react-native-community/checkbox', () => 'CheckBox');
jest.mock('react-native-vector-icons/Entypo', () => 'EntypoIcon');
jest.mock('@assets/icons/Calender', () => 'CalenderIcon');
jest.mock('@utils/ageCalculator', () => ({ ageCalculator: () => 25 }));
jest.mock('../CustomDatePicker', () => 'DatePickerModal');
jest.mock('../CustomRadioGroup', () => 'CustomRadioGroup');

describe('CustomDependentOption Component', () => {
  it('renders correctly for Kids type', () => {
    const onDependentsChange = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <CustomDependentOption type="Kids" onDependentsChange={onDependentsChange} />
    );

    expect(getByText('Kids')).toBeTruthy();
    expect(getByPlaceholderText('Full Name')).toBeTruthy();
  });

  it('adds and removes dependents', () => {
    const onDependentsChange = jest.fn();
    const { getByText, getAllByPlaceholderText } = render(
      <CustomDependentOption type="Kids" onDependentsChange={onDependentsChange} />
    );

    // Initial state: 1 dependent
    expect(getAllByPlaceholderText('Full Name')).toHaveLength(1);
  });

  it('renders initial data correctly', () => {
    const onDependentsChange = jest.fn();
    const initialData = [
      {
        fullName: 'Jane Doe',
        dateOfBirth: '1995-05-15T00:00:00.000Z',
        age: 28,
        gender: 'Female',
      },
    ];
    const { getByDisplayValue } = render(
      <CustomDependentOption
        type="Spouse"
        initialData={initialData}
        onDependentsChange={onDependentsChange}
      />
    );

    expect(getByDisplayValue('Jane Doe')).toBeTruthy();
  });
});
