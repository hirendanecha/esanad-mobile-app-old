import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
const { width: screenWidth } = Dimensions.get('screen');

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    bgImage: {
      position: 'absolute',
      top: -50,
      width: '100%',
      height: '81%',
    },
    skipButtonContainer: {
      paddingHorizontal: verticalScale(20),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    backButton: {
      padding: verticalScale(10),
      marginHorizontal: verticalScale(10),
      alignSelf: 'flex-start',
      position: 'absolute',
      zIndex: 1,
    },
    skipButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(2),
    },
    skipButtonText: {
      fontSize: verticalScale(16),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    slide: {
      flex: 1,
      paddingBottom: verticalScale(20),
      justifyContent: 'center',
      alignItems: 'center',
      gap: verticalScale(20),
    },
    textContainer: {
      height: verticalScale(130),
      padding: verticalScale(10),
      gap: verticalScale(10),
    },
    imageWrapper: {
      height: verticalScale(320),
      width: verticalScale(350),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(20),
    },
    image: {
      width: '100%',
      height: '100%',
    },
    bottomButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: moderateScale(24),
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: moderateScale(34),
      fontFamily: 'Lato-Black',
    },
    description: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      fontFamily: 'Lato-Regular',
      lineHeight: moderateScale(20),
      paddingHorizontal: verticalScale(30),
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: verticalScale(10),
    },
    dot: {
      width: verticalScale(20),
      height: verticalScale(10),
      marginHorizontal: moderateScale(4),
      backgroundColor: theme.colors.activePage,
      borderRadius: verticalScale(5),
    },
    inactiveDot: {
      width: verticalScale(10),
      backgroundColor: theme.colors.inactivePage,
    },
    dotContainer: {
      marginHorizontal: 0,
    },
    ctaButton: {
      width: screenWidth - 40,
      alignSelf: 'center',
      marginTop: verticalScale(20),
    },
    logo: {
      width: moderateScale(120),
      height: moderateScale(45),
      alignSelf: 'center',
      marginTop: verticalScale(40),
    },
  });
