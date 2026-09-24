import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeContext } from '@theme/ThemeProvider';
import { SCREEN_NAMES } from '@constants/screenNames';
import { verticalScale } from '@constants/metrics';

import { BOTTOMTABICONS } from '@assets/NEWICONS/BOTTOMICONS';
import Filter from '@assets/icons/Filter';

import { Images } from '@assets/index';
import HomeScreen from '@screens/HOME/HomeScreen';
import ProductsScreen from '@screens/PRODUCT/ProductsScreen/ProductsScreen';
import ProfileScreen from '@screens/PROFILE/ProfileScreen/ProfileScreen';
import ExploreScreen from '@screens/EXPLORE/ExploreScreen/ExploreScreen';
import ReferScreen from '@screens/REFER/ReferScreen';
import LinearGradient from 'react-native-linear-gradient';
import CategoryExplore from '@screens/EXPLORE/CategoryExplore';

const Tab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('screen').width;

const TAB_CONFIG = [
  {
    key: 'HOME',
    label: 'Home',
    routeIndex: 0,
  },
  {
    key: 'MYPOLICIES',
    label: 'My Policies',
    routeIndex: 1,
  },
  {
    key: 'EXPLORE',
    label: 'Buy Insurance',
    routeIndex: 2,
  },
  {
    key: 'REFER',
    label: 'Refer',
    routeIndex: 3,
  },
  {
    key: 'MORE',
    label: 'More',
    routeIndex: 4,
  },
];

const TabButton = ({ label, Icon, isFocused, onPress, styles, theme }) => (
  <TouchableOpacity
    style={styles.tabItem}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Icon
      isFocused={isFocused}
      color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
    />
    <Text
      style={[
        styles.labelText,
        !isFocused && {
          color: theme.colors.textTertiary,
          fontFamily: 'Lato-Regular',
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const CustomBottomTabBar = ({ state, navigation, theme, styles }) => {
  const activeRoute = state.routes[state.index];
  useEffect(() => {
    console.log('Active Tab:', activeRoute.name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  const insets = useSafeAreaInsets();

  const getBottomMargin = () => {
    if (Platform.OS === 'ios') {
      return -verticalScale(insets.bottom + 10);
    }
    return insets.bottom > 25 ? -verticalScale(0) : -verticalScale(24);
  };

  const handleTabPress = index => {
    const route = state.routes[index];
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View
      style={{
        marginBottom: getBottomMargin(),
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <ImageBackground
        source={Images.Union}
        resizeMode="stretch"
        style={styles.background}
      >
        <TabButton
          {...TAB_CONFIG[0]}
          Icon={
            state.index === 0 ? BOTTOMTABICONS.HomeActive : BOTTOMTABICONS.Home
          }
          isFocused={state.index === 0}
          onPress={() => handleTabPress(0)}
          styles={styles}
          theme={theme}
        />
        <TabButton
          {...TAB_CONFIG[1]}
          Icon={
            state.index === 1
              ? BOTTOMTABICONS.PolicyActive
              : BOTTOMTABICONS.Policy
          }
          isFocused={state.index === 1}
          onPress={() => handleTabPress(1)}
          styles={styles}
          theme={theme}
        />

        <View style={styles.tabItem}>
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.8}
            onPress={() => {
              handleTabPress(2);
            }}
          >
            <LinearGradient
              colors={[theme.colors.linear2, theme.colors.linear2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: verticalScale(30),
              }}
            >
              <Filter />
            </LinearGradient>
          </TouchableOpacity>
          <Text
            style={[
              styles.labelText,
              {
                marginStart: verticalScale(2),
              },
              state.index !== 2 && {
                color: theme.colors.textTertiary,
                fontFamily: 'Lato-Regular',
              },
            ]}
          >
            {TAB_CONFIG[2].label}
          </Text>
        </View>
        <TabButton
          {...TAB_CONFIG[3]}
          Icon={
            state.index === 3
              ? BOTTOMTABICONS.ReferActive
              : BOTTOMTABICONS.Refer
          }
          isFocused={state.index === 3}
          onPress={() => handleTabPress(3)}
          styles={styles}
          theme={theme}
        />
        <TabButton
          {...TAB_CONFIG[4]}
          Icon={
            state.index === 4 ? BOTTOMTABICONS.MoreActive : BOTTOMTABICONS.More
          }
          isFocused={state.index === 4}
          onPress={() => navigation.openDrawer()}
          styles={styles}
          theme={theme}
        />
      </ImageBackground>
    </View>
  );
};

const BottomTabs = () => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={props => (
        <CustomBottomTabBar {...props} theme={theme} styles={styles} />
      )}
    >
      <Tab.Screen name={SCREEN_NAMES.HOME_SCREEN} component={HomeScreen} />
      <Tab.Screen
        name={SCREEN_NAMES.PRODUCTS_SCREEN}
        component={ProductsScreen}
      />
      <Tab.Screen
        name={SCREEN_NAMES.EXPLORE_SCREEN}
        component={CategoryExplore}
      />
      <Tab.Screen name={SCREEN_NAMES.REFER_SCREEN} component={ReferScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const createStyles = theme =>
  StyleSheet.create({
    background: {
      width: SCREEN_WIDTH,
      height: verticalScale(160),
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      flexDirection: 'row',
      paddingTop: verticalScale(45),
    },
    tabItem: {
      flex: 1,
      height: verticalScale(50),
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelText: {
      color: theme.colors.primary,
      textAlign: 'center',
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      marginTop: verticalScale(5),
    },
    filterButton: {
      height: verticalScale(55),
      width: verticalScale(55),
      borderRadius: verticalScale(30),
      marginTop: -verticalScale(30),
    },
  });
