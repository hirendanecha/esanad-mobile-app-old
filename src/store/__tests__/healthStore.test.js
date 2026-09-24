import { useHealthStore } from '../HEALTH/healthStore';
import { act } from '@testing-library/react-native';

describe('useHealthStore', () => {
  beforeEach(() => {
    act(() => {
      // Manual reset since it doesn't have a clearStore method defined
      useHealthStore.setState({
        step: 0,
        subStep: 1,
        insuranceFor: null,
        hasKids: false,
        kidsDetails: [],
        hasSpouse: false,
        spouseDetails: [],
      });
    });
  });

  it('updates steps and basic info', () => {
    act(() => {
      useHealthStore.getState().updateStep(1);
      useHealthStore.getState().updateInsuranceFor('Family');
    });
    expect(useHealthStore.getState().step).toBe(1);
    expect(useHealthStore.getState().insuranceFor).toBe('Family');
  });

  it('updates dependents correctly', () => {
    const mockKids = [{ name: 'Kid 1' }];
    act(() => {
      useHealthStore.getState().updateKidsDetails(mockKids, true);
    });
    expect(useHealthStore.getState().kidsDetails).toEqual(mockKids);
    expect(useHealthStore.getState().hasKids).toBe(true);

    act(() => {
      useHealthStore.getState().updateHasSpouse(true);
    });
    expect(useHealthStore.getState().hasSpouse).toBe(true);
  });
});
