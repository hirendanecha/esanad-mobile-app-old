import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ExploreScreen from './ExploreScreen/ExploreScreen';
import MainHeader from '@components/ui/MainHeader';
import HomeHeader from '@screens/HOME/components/HomeHeader';
import BusinessScreen from './BusinessScreen/BusinessScreen';

const Tab = createMaterialTopTabNavigator();

const CategoryExplore = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      locations={[0.1, 0.2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      style={styles.container}
    >
      <HomeHeader title="Explore" />
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(20),
        }}
      >
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: verticalScale(16),
              fontFamily: 'Lato-Bold',
              textTransform: 'none',
              height: verticalScale(30),
            },
            tabBarItemStyle: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              height: verticalScale(40),
            },
            tabBarActiveTintColor: theme.colors.text,
            tabBarInactiveTintColor: theme.colors.text,
            tabBarStyle: {
              backgroundColor: theme.colors.backgroundColor,
              marginHorizontal: verticalScale(20),
              // borderRadius: verticalScale(5),
              overflow: 'hidden',
              borderColor: theme.colors.border,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarIndicatorContainerStyle: {
              borderRadius: verticalScale(5),
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
            tabBarIndicatorStyle: {
              // borderWidth: 1,
              // borderColor: theme.colors.primary,
              backgroundColor: theme.colors.highlight,
              height: '100%',

              borderRadius: verticalScale(5),
              width:
                (Dimensions.get('screen').width -
                  (Platform.OS === 'ios' ? 42 : 44)) /
                2,
            },
            sceneStyle: { backgroundColor: 'transparent' },
            swipeEnabled: false,
          }}
        >
          <Tab.Screen name="Individual Insurance" component={ExploreScreen} />
          <Tab.Screen name="Business Insurance" component={BusinessScreen} />
        </Tab.Navigator>
      </View>
    </LinearGradient>
  );
};

export default CategoryExplore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
