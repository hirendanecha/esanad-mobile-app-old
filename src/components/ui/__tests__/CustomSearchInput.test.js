import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomSearchInput from '../CustomSearchInput';

jest.mock('@assets/icons/Search', () => 'SearchIcon');

describe('CustomSearchInput Component', () => {
  it('renders correctly and handles text change', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomSearchInput title="Search products" value="" onChange={onChange} />
    );

    const input = getByPlaceholderText('Search products');
    expect(input).toBeTruthy();

    fireEvent.changeText(input, 'test query');
    expect(onChange).toHaveBeenCalledWith('test query');
  });
});
