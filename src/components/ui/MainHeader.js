import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Images } from '@assets/index';
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const MainHeader = ({ title, IconNew, onIconPress }) => {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top);
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.sideContainer}>
        {IconNew ? (
          <TouchableOpacity onPress={onIconPress} testID="main-header-icon">
            <Icon name="chevron-right" size={24} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        ) : (
          <Image
            source={Images.companyLogo}
            style={styles.logoIcon}
            resizeMode="contain"
          />
        )}
      </View>

      <Text style={styles.headerText}>{title}</Text>

      <View style={styles.sideContainer} />
    </View>
  );
};

const createStyles = (theme, safeTop) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: theme.colors.backgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: verticalScale(safeTop),
      paddingHorizontal: verticalScale(20),
      elevation: 5,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 99,
    },
    logoIcon: {
      width: verticalScale(34),
      height: verticalScale(38),
    },
    headerText: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginVertical: verticalScale(20),
    },
    sideContainer: {
      width: 55,
      alignItems: 'flex-start',
    },
    notificationBtn: {
      backgroundColor: theme.colors.bgSecondary,
      paddingVertical: verticalScale(8),
      paddingHorizontal: verticalScale(10),
      borderRadius: verticalScale(50),

      alignSelf: 'flex-end',
    },
    badge: {
      position: 'absolute',
      top: verticalScale(5),
      right: verticalScale(8),
      width: verticalScale(10),
      height: verticalScale(10),
      borderRadius: verticalScale(5),
      backgroundColor: theme.colors.red,
    },
  });

export default MainHeader;
