import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SelectYearScreen from '../SelectYearScreen';
import { ThemeProvider } from '@theme/ThemeProvider';
import { useYearList } from '@hooks/motorflow/useMotorFlow';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { NavigationContainer } from '@react-navigation/native';

// Mock hooks
jest.mock('@hooks/motorflow/useMotorFlow', () => ({
  useYearList: jest.fn(),
}));

const mockNavigation = { navigate: jest.fn() };

describe('SelectYearScreen', () => {
  beforeEach(() => {
    useYearList.mockReturnValue({ data: ['2024', '2023', '2022'], isLoading: false });
    useMotorStore.setState({ carDetails: {} });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <NavigationContainer>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NavigationContainer>
  );

  it('renders years list', () => {
    const { getAllByText } = render(<SelectYearScreen navigation={mockNavigation} />, { wrapper });
    expect(getAllByText('2024')[0]).toBeTruthy();
    expect(getAllByText('2023')[0]).toBeTruthy();
  });

  it('updates store and navigates when year is selected', () => {
    const { getAllByText } = render(<SelectYearScreen navigation={mockNavigation} />, { wrapper });
    fireEvent.press(getAllByText('2024')[1]); // Use index 1 (OptionList button)
    
    // Check motorStore updates (SelectYearScreen updates year, step=0, subStep=2)
    const state = useMotorStore.getState();
    expect(state.year).toBe('2024');
    expect(state.step).toBe(0);
    expect(state.subStep).toBe(2);
  });
});
