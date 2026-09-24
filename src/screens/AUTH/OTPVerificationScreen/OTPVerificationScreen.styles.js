import { moderateScale, verticalScale } from '@constants/metrics';
import { StyleSheet } from 'react-native';

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: verticalScale(20),
      alignItems: 'center',
      padding: verticalScale(20),
    },
    backButton: {
      alignSelf: 'flex-start',
      height: verticalScale(40),
      width: verticalScale(40),
      justifyContent: 'center',
    },
    logo: {
      width: verticalScale(120),
      height: verticalScale(40),
      alignSelf: 'center',
    },
    title: {
      fontSize: moderateScale(24),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    infoText: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      textAlign: 'center',
      lineHeight: verticalScale(20),
    },
    infoHighlight: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      lineHeight: verticalScale(20),
    },
    submitButton: {
      width: '100%',
      height: verticalScale(50),
    },
    resendContainer: {
      flexDirection: 'row',
      gap: verticalScale(5),
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    resendText: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    resendLink: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
  });

export default style;
