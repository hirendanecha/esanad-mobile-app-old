import { moderateScale, verticalScale } from '@constants/metrics';
import { StyleSheet } from 'react-native';

export const style = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    wrapper: {
      flex: 1,
      padding: verticalScale(20),
      justifyContent: 'center',
      gap: verticalScale(20),
    },
    title: {
      fontSize: verticalScale(20),
      textAlign: 'center',
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: verticalScale(14),
      textAlign: 'center',
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    headerImage: {
      width: '100%',
      height: verticalScale(250),
      alignSelf: 'center',
    },
    circleBg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      marginTop: -verticalScale(320),
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: verticalScale(20),
    },
  });
