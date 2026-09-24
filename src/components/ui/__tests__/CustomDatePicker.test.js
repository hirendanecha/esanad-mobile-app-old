import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DatePickerModal from '../CustomDatePicker';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('react-native-ui-datepicker', () => 'DateTimePicker');

const wrap = (children) => (
  <SafeAreaProvider initialMetrics={{ insets: { top: 0, left: 0, right: 0, bottom: 0 }, frame: { x: 0, y: 0, width: 375, height: 812 } }}>
    {children}
  </SafeAreaProvider>
);

describe('DatePickerModal Component', () => {
  it('renders correctly when visible', () => {
    const { getByText } = render(
      wrap(<DatePickerModal visible={true} onClose={jest.fn()} onConfirm={jest.fn()} />)
    );

    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onClose when Cancel is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      wrap(<DatePickerModal visible={true} onClose={onClose} onConfirm={jest.fn()} />)
    );

    fireEvent.press(getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onConfirm with selected date when Confirm is pressed', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      wrap(<DatePickerModal visible={true} onClose={jest.fn()} onConfirm={onConfirm} />)
    );

    fireEvent.press(getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });
});
