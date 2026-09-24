import React from 'react';
import { render } from '@testing-library/react-native';
import OrDivider from '../OrDivider';

describe('OrDivider Component', () => {
  it('renders default text when no props are provided', () => {
    const { getByText } = render(<OrDivider />);
    expect(getByText('Or Log in with')).toBeTruthy();
  });

  it('renders custom text when provided', () => {
    const { getByText } = render(<OrDivider text="Select Option" />);
    expect(getByText('Select Option')).toBeTruthy();
  });

  it('renders nothing when simple prop is true', () => {
    const { queryByText } = render(<OrDivider simple={true} />);
    expect(queryByText('Or Log in with')).toBeNull();
  });
});
