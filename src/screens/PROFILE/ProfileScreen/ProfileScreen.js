import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '@store/authStore';
import MainHeader from '@components/ui/MainHeader';
import { SCREEN_NAMES } from '@constants/screenNames';
import { Images } from '@assets/index';
import { getStyles } from './ProfileScreen.styles';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '@assets/icons/Logo';
import Coin from '@assets/icons/Coin';
import Payment from '@assets/icons/Payment';
import Rating from '@assets/icons/Rating';
import Setting from '@assets/icons/Setting';
import Call from '@assets/icons/Call';
import Policy from '@assets/icons/Policy';
import Terms from '@assets/icons/Terms';
import Logout from '@assets/icons/Logout';
import Car from '@assets/images/policy/Car';
import CarIcon from '@assets/icons/Motor/Car';
import { useUserStore } from '@store/userStore';
import Delete from '@assets/icons/Delete';

const ProfileScreen = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { clearData } = useUserStore();

  const onLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: SCREEN_NAMES.LOGIN_SCREEN }],
    });
    logout();
    // also clear the userStore clean
    clearData();
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: SCREEN_NAMES.LOGIN_SCREEN }],
    });
    logout();
    // also clear the userStore clean
    clearData();
  };

  const menuItems = [
    // {
    //   id: 'about',
    //   title: 'About eSanad',
    //   icon: <Logo />,
    //   screen: SCREEN_NAMES.ABOUT_US,
    // },
    // {
    //   id: 'loyalty',
    //   title: 'Loyalty Points',
    //   icon: <Coin />,
    //   screen: SCREEN_NAMES.LOYALTY_POINTS,
    // },
    // {
    //   id: 'club',
    //   title: 'eSanad Club',
    //   icon: <Logo />,
    //   screen: SCREEN_NAMES.ESANASD_CLUB,
    // },
    // {
    //   id: 'carDetails',
    //   title: 'Get Your Car Details',
    //   icon: <CarIcon />,
    //   screen: SCREEN_NAMES.GET_CAR_DETAILS,
    // },
    {
      id: 'rateUs',
      title: 'Rate Us',
      icon: <Rating />,
      screen: SCREEN_NAMES.RATE_US,
    },
    // {
    //   id: 'setting',
    //   title: 'Settings',
    //   icon: <Setting />,
    //   screen: SCREEN_NAMES.SETTINGS,
    // },
    // {
    //   id: 'help',
    //   title: 'Help and Support',
    //   icon: <Call />,
    //   screen: SCREEN_NAMES.HELP_AND_SUPPORT,
    // },
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
    { id: 'logout', title: 'Logout', icon: <Logout />, action: onLogout },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: <Delete />,
      action: true,
      danger: true,
    },
  ];

  const handleMenuItemPress = item => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const renderMenuItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.menuItem, index === 0 && { borderTopWidth: 1 }]}
      onPress={() => {
        if (item?.action) {
          handleLogout();
        } else {
          handleMenuItemPress(item);
        }
      }}
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
  );

  const ListHeader = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate(SCREEN_NAMES.EDIT_PROFILE)}
      style={styles.userInfoSection}
      activeOpacity={0.8}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[theme.colors.linear1, theme.colors.linear2]}
        style={styles.linearContainer}
      >
        <View style={styles.simpleView}>
          <View style={styles.avatarContainer}>
            {user?.profilePic?.documentUrl ? (
              <Image
                source={{ uri: user?.profilePic?.documentUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: verticalScale(20),
                  fontFamily: 'Lato-Bold',
                  textTransform: 'uppercase',
                }}
              >
                {user?.fullName ? user.fullName.charAt(0) : 'U'}
              </Text>
            )}
          </View>
          <View style={styles.userDetailsContainer}>
            <Text style={styles.userName}>
              Hello 👋, {user?.fullName || 'User Name'}!
            </Text>
            <Text style={styles.userEmail}>
              +{user?.countryCode} {user?.mobileNumber}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.45 }}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <MainHeader title="Account" />

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </LinearGradient>
  );
};

export default ProfileScreen;
