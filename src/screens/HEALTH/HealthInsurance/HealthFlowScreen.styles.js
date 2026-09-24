import { StyleSheet } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { getBottomMargin } from '@utils/paddingBottom';

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: verticalScale(18),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
      textAlign: 'center',
      marginTop: verticalScale(20),
      paddingHorizontal: verticalScale(20),
    },
    inner: {
      flexGrow: 1,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(7),
      marginHorizontal: verticalScale(20),
      marginBottom: getBottomMargin(),
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    stepIndicatorWrapper: {
      alignItems: 'center',
      marginBottom: verticalScale(10),
      paddingHorizontal: verticalScale(30),
      marginHorizontal: verticalScale(100),
    },
    button: {
      width: '75%',
      alignSelf: 'center',
      marginVertical: verticalScale(10),
    },
  });

export default style;
