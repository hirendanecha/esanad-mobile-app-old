import { moderateScale, verticalScale } from '@constants/metrics';
import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContentContainer: {
      paddingBottom: verticalScale(80),
      borderTopWidth: 1,
      borderColor: theme.colors.border,
    },
    userInfoSection: {
      margin: verticalScale(15),
      borderRadius: verticalScale(15),
      overflow: 'hidden',
    },
    linearContainer: {
      flex: 1,
    },
    simpleView: {
      padding: verticalScale(10),
      gap: moderateScale(15),
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    avatarContainer: {
      backgroundColor: theme.colors.floorBgColor,
      height: moderateScale(60),
      width: moderateScale(60),
      borderRadius: moderateScale(30),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.backgroundColor,
    },
    avatar: {
      height: '100%',
      width: '100%',
      borderRadius: moderateScale(30),
    },
    userDetailsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    userName: {
      fontSize: moderateScale(20),
      color: theme.colors.textSecondary,
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(4),
    },
    userEmail: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textSecondary,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      height: verticalScale(55),
      paddingHorizontal: verticalScale(20),
      gap: verticalScale(15),
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    menuItemTitle: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
  });
