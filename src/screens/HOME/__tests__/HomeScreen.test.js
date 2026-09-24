import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { ThemeProvider } from '@theme/ThemeProvider';
import { useSocket } from '@provider/SocketProvider';
import { NavigationContainer } from '@react-navigation/native';

// Mock SocketProvider
jest.mock('@provider/SocketProvider', () => ({
  useSocket: jest.fn(),
}));

// Mock Geolocation
jest.mock('react-native-geolocation-service', () => ({
  requestAuthorization: jest.fn(),
  getCurrentPosition: jest.fn(),
}));

// Mock child components that might have complex hooks
jest.mock('../components/UserInfo', () => {
  const { Text } = require('react-native');
  return () => <Text>User Info Section</Text>;
});
jest.mock('../components/HomeHeader', () => {
  const { Text } = require('react-native');
  return () => <Text>Home Header</Text>;
});
jest.mock('../components/InsuranceType', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MotorFlow')}>
      <Text>Motor Insurance</Text>
    </TouchableOpacity>
  );
});

describe('HomeScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    useSocket.mockReturnValue({ socket: {}, connected: true });
    jest.clearAllMocks();
  });

  const renderScreen = () =>
    render(
      <NavigationContainer>
        <ThemeProvider>
          <HomeScreen navigation={mockNavigation} />
        </ThemeProvider>
      </NavigationContainer>
    );

  it('renders fundamental sections', () => {
    const { getByText } = renderScreen();
    expect(getByText('Home Header')).toBeTruthy();
    expect(getByText('User Info Section')).toBeTruthy();
    expect(getByText('Motor Insurance')).toBeTruthy();
  });

  it('navigates to MotorFlow when clicking insurance type', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Motor Insurance'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MotorFlow');
  });
});
