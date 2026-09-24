import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LottieLoaderProvider, useLottieLoader } from '../LottieLoaderProvider';
import { Text, TouchableOpacity } from 'react-native';

const TestComponent = () => {
  const { showLoader, hideLoader, visible } = useLottieLoader();
  return (
    <>
      <Text>{visible ? 'Visible' : 'Hidden'}</Text>
      <TouchableOpacity onPress={() => showLoader('test-type')}>
        <Text>Show</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={hideLoader}>
        <Text>Hide</Text>
      </TouchableOpacity>
    </>
  );
};

describe('LottieLoaderProvider', () => {
  it('toggles visibility and sets type', () => {
    const { getByText } = render(
      <LottieLoaderProvider>
        <TestComponent />
      </LottieLoaderProvider>
    );

    expect(getByText('Hidden')).toBeTruthy();
    
    fireEvent.press(getByText('Show'));
    expect(getByText('Visible')).toBeTruthy();
    
    fireEvent.press(getByText('Hide'));
    expect(getByText('Hidden')).toBeTruthy();
  });
});
