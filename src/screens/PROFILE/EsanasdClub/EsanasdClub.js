import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import AvilModal from './components/AvilModal';
import TermsAndConditionsClub from './pages/TermsAndConditions';
import ByOffers from './pages/ByOffers';
import ByPartners from './pages/ByPartners';
import { Images } from '@assets/index';
import CustomSearchInput from '@components/ui/CustomSearchInput';

const Tab = createMaterialTopTabNavigator();

const TabButton = ({ label, active, onPress, style, theme }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[
      styles.tabButton,
      style,
      {
        backgroundColor: active
          ? theme.colors.primary
          : theme.colors.backgroundColor,
      },
    ]}
  >
    <Text
      style={[
        styles.tabText,
        {
          color: active ? theme.colors.backgroundColor : theme.colors.text,
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const EsanadClub = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  // const [tabIndex, setTabIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);

  // const handleTabChange = useCallback(index => {
  //   setTabIndex(index);
  // }, []);

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      locations={[0.1, 0.2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      style={styles.container}
    >
      <Header
        title="eSanad Privilege Club"
        onBack={navigation.goBack}
      />
      <ByPartners />
      {/* <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          <TabButton
            label="Discount & Offer"
            active={tabIndex === 0}
            onPress={() => handleTabChange(0)}
            style={styles.leftTab}
            theme={theme}
          />

          <TabButton
            label="My Vouchers"
            active={tabIndex === 1}
            onPress={() => { }}
            theme={theme}
          />

          <TabButton
            label="Terms & Conditions"
            active={tabIndex === 2}
            onPress={() => handleTabChange(2)}
            style={styles.rightTab}
            theme={theme}
          />
        </ScrollView>
      </View> */}

      {/* {tabIndex === 0 && ( */}
      {/* <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: verticalScale(12),
            fontFamily: 'Lato-Bold',
          },
          tabBarItemStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          tabBarStyle: {
            backgroundColor: theme.colors.backgroundColor,
            marginHorizontal: verticalScale(20),
            borderRadius: verticalScale(10),
            overflow: 'hidden',
            borderColor: theme.colors.border,
          },
          tabBarIndicatorContainerStyle: {
            height: '100%',
            borderRadius: verticalScale(10),
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          tabBarIndicatorStyle: {
            borderWidth: 1,
            backgroundColor: theme.colors.floorBgColor,
            height: '100%',
            borderColor: theme.colors.primary,
            borderRadius: verticalScale(10),
            width: (Dimensions.get('screen').width - 42) / 2,
          },
          sceneStyle: { backgroundColor: theme.colors.bgSecondary },
          swipeEnabled: false,
        }}
      >
        <Tab.Screen name="By Offers" component={ByOffers} />
        <Tab.Screen name="By Partners" component={ByPartners} />
      </Tab.Navigator> */}
      {/* )} */}

      {/* {tabIndex === 2 && <TermsAndConditionsClub />} */}

      {showCard && (
        <AvilModal handleClose={() => setShowCard(false)} visible={showCard} />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsWrapper: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  tabsContainer: {
    height: verticalScale(45),
    paddingHorizontal: moderateScale(20),
  },
  tabButton: {
    width: verticalScale(180),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTab: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightTab: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tabText: {
    fontSize: verticalScale(16),
    fontFamily: 'Lato-Bold',
  },
});

export default EsanadClub;
