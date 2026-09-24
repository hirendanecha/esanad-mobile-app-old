import { moderateScale, verticalScale } from '@constants/metrics';
import { StyleSheet } from 'react-native';

const style = theme =>
  StyleSheet.create({
    homeContainer: {
      flexGrow: 1,
      paddingBottom: verticalScale(160),
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    search: {
      marginBottom: verticalScale(20),
      marginHorizontal: verticalScale(20),
    },
    gradientContainer: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    image: {
      width: verticalScale(600),
      height: verticalScale(600),
      position: 'absolute',
      top: -verticalScale(320),
      left: -verticalScale(320),
      tintColor: theme.colors.primary,
    },
    licenseReviewContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 20,
      marginHorizontal: 20,
    },
  });

export default style;
