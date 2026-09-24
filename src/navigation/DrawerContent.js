import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useThemeContext } from '@theme/ThemeProvider';
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';
import { SCREEN_NAMES } from '@constants/screenNames';
import { moderateScale, verticalScale } from '@constants/metrics';

// ICONS (Same as ProfileScreen)
import Logo from '@assets/icons/Logo';
import Coin from '@assets/icons/Coin';
import Policy from '@assets/icons/Policy';
import Terms from '@assets/icons/Terms';
import Logout from '@assets/icons/Logout';
import Rating from '@assets/icons/Rating';
import Delete from '@assets/icons/Delete';
import Call from '@assets/icons/Call';
import Setting from '@assets/icons/Setting';

import MainHeader from '@components/ui/MainHeader';
import Invite from '@assets/NEWICONS/Invite';

const DrawerContent = props => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { clearData } = useUserStore();
  const insets = useSafeAreaInsets();

  const onLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: SCREEN_NAMES.LOGIN_SCREEN }],
    });
    logout();
    clearData();
  };

  const menuItems = [
    {
      id: 'about',
      title: 'About eSanad',
      icon: <Logo />,
      screen: SCREEN_NAMES.ABOUT_US,
    },
    {
      id: 'invite',
      title: 'Invite Friends',
      icon: <Invite />,
      screen: SCREEN_NAMES.REFER,
    },
    {
      id: 'rateUs',
      title: 'Rate Us',
      icon: <Rating />,
      screen: SCREEN_NAMES.RATE_US,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Policy />,
      screen: SCREEN_NAMES.PRIVACY_POLICY,
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: <Terms />,
      screen: SCREEN_NAMES.TERMS_AND_CONDITIONS,
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <Logout />,
      action: onLogout,
    },
    // {
    //   id: 'delete',
    //   title: 'Delete Account',
    //   icon: <Delete />,
    //   action: true,
    //   danger: true,
    // },
  ];

  const handlePress = item => {
    if (item.action) {
      if (typeof item.action === 'function') {
        item.action();
      }
    } else if (item.screen) {
      if (
        item.screen === SCREEN_NAMES.HOME_SCREEN ||
        item.screen === SCREEN_NAMES.PRODUCTS_SCREEN ||
        item.screen === SCREEN_NAMES.EXPLORE_SCREEN ||
        item.screen === SCREEN_NAMES.REFER_SCREEN
      ) {
        navigation.navigate(SCREEN_NAMES.BOTTOM_TABS, {
          screen: item.screen,
        });
      } else {
        navigation.navigate(item.screen);
      }
      props.navigation.closeDrawer();
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.45 }}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <MainHeader
        title="Account"
        IconNew
        onIconPress={() => props.navigation.closeDrawer()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card (Same as ProfileScreen ListHeader) */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.EDIT_PROFILE);
            props.navigation.closeDrawer();
          }}
          style={styles.userInfoSection}
          activeOpacity={0.8}
        >
          <View style={styles.centeredView}>
            <View style={styles.avatarContainerLarge}>
              {user?.profilePic?.documentUrl ? (
                <Image
                  source={{ uri: user?.profilePic?.documentUrl }}
                  style={styles.avatarLarge}
                />
              ) : (
                <Text style={styles.avatarLetterLarge}>
                  {user?.fullName ? user.fullName.charAt(0) : 'U'}
                </Text>
              )}
            </View>
            <View style={styles.centeredDetails}>
              <Text style={styles.userNameLarge}>
                {user?.fullName || 'User Name'}!
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Menu Items (Same as ProfileScreen) */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index === 0 && { borderTopWidth: 1 }]}
              onPress={() => handlePress(item)}
              activeOpacity={0.8}
            >
              {item.icon}

              <Text
                style={[
                  styles.menuItemTitle,
                  {
                    color:
                      item.id === 'logout' || item.id === 'delete'
                        ? theme.colors.red
                        : theme.colors.textTertiary,
                  },
                ]}
              >
                {item.title}
              </Text>

              {item.id !== 'logout' && item.id !== 'delete' && (
                <Icon
                  name="chevron-forward"
                  size={verticalScale(25)}
                  color={theme.colors.textTertiary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: verticalScale(50),
    },
    userInfoSection: {
      borderRadius: verticalScale(15),
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
    centeredView: {
      padding: verticalScale(20),
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    avatarContainerLarge: {
      backgroundColor: theme.colors.floorBgColor,
      height: verticalScale(100),
      width: verticalScale(100),
      borderRadius: verticalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    avatarLarge: {
      height: '100%',
      width: '100%',
      borderRadius: verticalScale(50),
    },
    avatarLetterLarge: {
      color: theme.colors.primary,
      fontSize: verticalScale(35),
      fontFamily: 'Lato-Bold',
      textTransform: 'uppercase',
    },
    cameraIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundColor,
      width: verticalScale(28),
      height: verticalScale(28),
      borderRadius: verticalScale(14),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    centeredDetails: {
      alignItems: 'center',
      marginTop: verticalScale(10),
    },
    userNameLarge: {
      fontSize: moderateScale(20),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(2),
    },
    userEmailLarge: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textSecondary,
      opacity: 0.9,
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
      overflow: 'hidden',
    },
    avatar: {
      height: '100%',
      width: '100%',
      borderRadius: moderateScale(30),
    },
    avatarLetter: {
      color: theme.colors.primary,
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      textTransform: 'uppercase',
    },
    userDetailsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    userName: {
      fontSize: moderateScale(18),
      color: theme.colors.textSecondary,
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(4),
    },
    userEmail: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textSecondary,
    },
    menuList: {
      marginTop: verticalScale(5),
      borderTopWidth: 1,
      borderColor: theme.colors.border,
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
    versionContainer: {
      padding: verticalScale(20),
      alignItems: 'center',
    },
    versionText: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      opacity: 0.5,
    },
  });

export default DrawerContent;
