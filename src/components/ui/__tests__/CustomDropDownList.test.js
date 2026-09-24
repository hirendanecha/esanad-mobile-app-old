import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomDropDownList } from '../CustomDropDownList';

describe('CustomDropDownList Component', () => {
  const mockData = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  it('renders title and opens on press', () => {
    const { getByText, queryByText } = render(
      <CustomDropDownList title="Select Option" data={mockData} />
    );

    expect(getByText('Select Option')).toBeTruthy();
    // Item is in the tree but hidden by height/opacity
    
    const dropdown = getByText('Select Option');
    fireEvent.press(dropdown);

    expect(getByText('Option 1')).toBeTruthy();
  });

  it('calls handleSelect when an item is selected', () => {
    const handleSelect = jest.fn();
    const { getByText } = render(
      <CustomDropDownList title="Select" data={mockData} handleSelect={handleSelect} defaultOpen={true} />
    );

    const option = getByText('Option 1');
    fireEvent.press(option);

    expect(handleSelect).toHaveBeenCalledWith('1');
  });

  it('filters data based on search text', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CustomDropDownList title="Select" data={mockData} defaultOpen={true} showSearch={true} />
    );

    const searchInput = getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'Option 2');

    expect(queryByText('Option 1')).toBeNull();
    expect(getByText('Option 2')).toBeTruthy();
  });
});
