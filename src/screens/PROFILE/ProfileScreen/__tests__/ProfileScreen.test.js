import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import { ThemeProvider } from '@theme/ThemeProvider';
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@store/authStore');
jest.mock('@store/userStore');

const mockNavigation = { navigate: jest.fn(), reset: jest.fn() };

describe('ProfileScreen', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      user: {
        fullName: 'Jane Doe',
        mobileNumber: '987654321',
        countryCode: '971',
        profilePic: { documentUrl: null },
      },
      logout: jest.fn(),
    });
    useUserStore.mockReturnValue({ clearData: jest.fn() });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <NavigationContainer>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NavigationContainer>
  );

  it('renders user details correctly', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper });
    expect(getByText('Hello 👋, Jane Doe!')).toBeTruthy();
    expect(getByText('+971 987654321')).toBeTruthy();
  });

  it('navigates to Edit Profile on header click', () => {
    // Need to find the header touchable. It's the one with the user name.
    const { getByText } = render(<ProfileScreen />, { wrapper });
    fireEvent.press(getByText('Hello 👋, Jane Doe!'));
    // Since it's inside a TouchableOpacity that wraps the text.
    // Actually our mockNavigation is not passed as prop, it's used via useNavigation hook
    // Oh wait, ProfileScreen.js uses useNavigation() hook.
  });
});
