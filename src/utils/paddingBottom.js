import { verticalScale } from '@constants/metrics';
import { Platform } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const getBottomMargin = () => {
  const insets = initialWindowMetrics?.insets ?? { bottom: 0 };
  if (Platform.OS === 'ios') {
    return verticalScale(insets.bottom + 10);
  }
  return insets.bottom > 25
    ? verticalScale(insets.bottom + 10)
    : verticalScale(24);
};
