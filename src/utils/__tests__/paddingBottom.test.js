import { getBottomMargin } from '../paddingBottom';
import { Platform } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

jest.mock('@constants/metrics', () => ({
  verticalScale: val => val,
}));

jest.mock('react-native-safe-area-context', () => ({
  initialWindowMetrics: {
    insets: { bottom: 20 },
  },
}));

describe('paddingBottom util', () => {
  it('returns correctly scaled margin for iOS', () => {
    Platform.OS = 'ios';
    // insets.bottom (20) + 10 = 30
    expect(getBottomMargin()).toBe(30);
  });

  it('returns correctly scaled margin for Android with high insets', () => {
    Platform.OS = 'android';
    initialWindowMetrics.insets.bottom = 30;
    // insets.bottom (30) + 10 = 40
    expect(getBottomMargin()).toBe(40);
  });

  it('returns fallback margin for Android with low insets', () => {
    Platform.OS = 'android';
    initialWindowMetrics.insets.bottom = 10;
    // 24 is the fallback
    expect(getBottomMargin()).toBe(24);
  });
});
