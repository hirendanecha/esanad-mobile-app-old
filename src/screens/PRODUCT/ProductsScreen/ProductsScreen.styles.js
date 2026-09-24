import { verticalScale } from '@constants/metrics';
import { Dimensions, StyleSheet } from 'react-native';

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    homeContainer: {
      flexGrow: 1,
      paddingBottom: verticalScale(50),
      padding: verticalScale(20),
    },
    tabContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: verticalScale(20),
    },
    tabButton: {
      width: (Dimensions.get('screen').width - 60) / 2,
      minHeight: verticalScale(180),
      borderRadius: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: verticalScale(15),

      justifyContent: 'space-between',
    },
    fullWidthButton: {
      width: '100%',
      minHeight: verticalScale(100),
    },
    tabIconContainer: {
      width: verticalScale(70),
      height: verticalScale(70),
      justifyContent: 'center',
      alignItems: 'center',
    },
    columnContent: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: verticalScale(45),
    },
    columnIconWrapper: {
      gap: verticalScale(45),
      alignSelf: 'flex-end',
    },
    rowContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      marginRight: verticalScale(10),
      gap: verticalScale(10),
    },
    tabText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    tabDescription: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
  });

export default style;
