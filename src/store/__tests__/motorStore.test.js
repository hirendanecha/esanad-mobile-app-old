import { useMotorStore, useMotorDetalisStore } from '../MOTOR/motorStore';
import { act } from '@testing-library/react-native';

describe('Motor Stores', () => {
  beforeEach(() => {
    act(() => {
      useMotorStore.getState().clearMotorStore();
      useMotorDetalisStore.getState().clearMotorDetalisStore();
    });
  });

  describe('useMotorStore', () => {
    it('updates year and resets correctly', () => {
      act(() => {
        useMotorStore.getState().updateYear(2024);
      });
      expect(useMotorStore.getState().year).toBe(2024);

      act(() => {
        useMotorStore.getState().clearMotorStore();
      });
      expect(useMotorStore.getState().year).toBeNull();
    });

    it('updates steps and substeps', () => {
      act(() => {
        useMotorStore.getState().updateStep(2);
        useMotorStore.getState().updateSubStep(3);
      });
      expect(useMotorStore.getState().step).toBe(2);
      expect(useMotorStore.getState().subStep).toBe(3);
    });
  });

  describe('useMotorDetalisStore', () => {
    it('updates quotes list and car details', () => {
      const mockQuotes = [{ id: 1, premium: 500 }];
      act(() => {
        useMotorDetalisStore.getState().updateQuotesList(mockQuotes);
      });
      expect(useMotorDetalisStore.getState().quotesList).toEqual(mockQuotes);

      act(() => {
        useMotorDetalisStore.getState().updateCarDeatils({ brand: 'Toyota' });
      });
      expect(useMotorDetalisStore.getState().carDeatils).toEqual({ brand: 'Toyota' });
    });
  });
});
