import { StyleSheet } from 'react-native';
import { verticalScale, moderateScale } from '@constants/metrics';

const style = theme =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
      alignSelf: 'center',
      marginVertical: verticalScale(5),
    },
    tabContainer: {
      flexDirection: 'row',
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      padding: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor,
    },
    activeTab: {
      borderColor: theme.colors.primary,
      borderBottomWidth: 2,
      backgroundColor: theme.colors.backgroundColor,
    },
    tabText: {
      fontWeight: '500',
      fontSize: moderateScale(14),
      fontFamily: 'Inter',
      color: theme.colors.description,
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    divider: {
      width: 0.5,
      height: '100%',
      backgroundColor: theme.colors.border,
    },
  });

export default style;
