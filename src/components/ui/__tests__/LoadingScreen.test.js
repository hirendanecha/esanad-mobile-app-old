import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingScreen from '../LoadingScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: jest.fn() }),
}));

jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const MockFastImage = (props) => React.createElement('FastImage', props, props.children);
  MockFastImage.resizeMode = { contain: 'contain', cover: 'cover' };
  return MockFastImage;
});

describe('LoadingScreen Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly and matches snapshot', () => {
    const { toJSON, getByText } = render(<LoadingScreen />);
    
    expect(getByText('Sit back and relax.')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
    
    // Fast-forward timers to clear any open handles
    jest.runAllTimers();
  });
});
