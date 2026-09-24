import React from 'react';
import {
  FlatList,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useAuthStore } from '@store/authStore';
import { useSettingStore } from '@store/settingStore';

import Header from '@components/ui/Header';

import Logo from '@assets/icons/Logo';
import Language from '@assets/icons/Language';
import Delete from '@assets/icons/Delete';
import Notification from '@assets/icons/Notification';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useThemeContext();
  const styles = getStyles(theme);

  const { logout } = useAuthStore();
  const isNotificationEnabled = useSettingStore(
    state => state.isNotificationEnabled,
  );
  const toggleNotification = useSettingStore(state => state.toggleNotification);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: SCREEN_NAMES.LOGIN_SCREEN }],
    });
    logout();
  };

  const menuItems = [
    // {
    //   id: 'notification',
    //   title: 'Notification',
    //   icon: <Notification />,
    //   disabled: true,
    // },
    // {
    //   id: 'language',
    //   title: 'Language',
    //   icon: <Language />,
    //   screen: SCREEN_NAMES.LOYALTY_POINTS,
    // },
    // {
    //   id: 'theme',
    //   title: 'Theme',
    //   icon: <Logo />,
    //   disabled: true,
    // },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: <Delete />,
      action: handleLogout,
      danger: true,
    },
  ];

  const handlePress = item => {
    if (item.action) {
      item.action();
      return;
    }

    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const renderItem = ({ item, index }) => {
    const isNotification = item.id === 'notification';
    const isDelete = item.danger;
    const isTheme = item.id === 'theme';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={item.disabled}
        onPress={() => handlePress(item)}
        style={[styles.menuItem, index === 0 && styles.topBorder]}
      >
        {item.icon}

        <Text
          style={[
            styles.menuItemTitle,
            {
              color: isDelete ? theme.colors.red : theme.colors.textTertiary,
            },
          ]}
        >
          {item.title}
        </Text>

        {!isDelete && !isNotification && !isTheme && (
          <Icon
            name="chevron-forward"
            size={verticalScale(25)}
            color={theme.colors.textTertiary}
          />
        )}

        {isNotification && (
          <View>
            <Switch
              value={isNotificationEnabled}
              onValueChange={toggleNotification}
            />
          </View>
        )}

        {isTheme && (
          <View>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.45 }}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Settings" onBack={navigation.goBack} />

      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </LinearGradient>
  );
};

export default SettingsScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContentContainer: {
      paddingBottom: verticalScale(80),
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
    topBorder: {
      borderTopWidth: 1,
    },
    menuItemTitle: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
  });
