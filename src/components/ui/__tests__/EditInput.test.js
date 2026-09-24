import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditInput from '../EditInput';

describe('EditInput Component', () => {
  it('renders title and prefix', () => {
    const { getByText } = render(
      <EditInput title="Full Name" prefix="Mr." value="John" />
    );
    expect(getByText('Full Name')).toBeTruthy();
    expect(getByText('Mr.')).toBeTruthy();
  });

  it('toggles edit mode and enables input', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue, getByTestId } = render(
      <EditInput title="Name" value="John" onChangeText={onChangeText} canEdit={true} />
    );

    const input = getByDisplayValue('John');
    expect(input.props.editable).toBe(false);

    const editBtn = getByTestId('edit-button');
    fireEvent.press(editBtn);

    expect(input.props.editable).toBe(true);
  });
});
