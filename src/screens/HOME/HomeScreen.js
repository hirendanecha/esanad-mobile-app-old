import React from 'react';
import { View, ScrollView, Platform, PermissionsAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import style from './HomeScreen.styles';
import { useThemeContext } from '@theme/ThemeProvider';
import { useSocket } from '@provider/SocketProvider';
import InsuranceTypeList from './components/InsuranceType';
import HomeHeader from './components/HomeHeader';
import AdsSection from './components/AdsSection';
import RewardOption from './components/RewardOption';
import QuickLinks from './components/QuickLinks';
import UserInfo from './components/UserInfo';
import LocatePolicy from './components/LocatePolicy';

const HomeScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const { socket, connected } = useSocket();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      await Geolocation.requestAuthorization('whenInUse');
    } else if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('connected', connected);
      requestLocationPermission();
      return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, connected]),
  );

  return (
    <View style={styles.gradientContainer}>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.homeContainer}
        showsVerticalScrollIndicator={false}
      >
        <UserInfo />
        <LocatePolicy />
        <AdsSection />
        <InsuranceTypeList navigation={navigation} />
        <RewardOption />
        <QuickLinks />
        {/* <InsuranceBlogs /> */}
        {/* <View style={styles.licenseReviewContainer}>
          <RSABtn />
          <HealthFineCalculator />
        </View> */}
        {/* <BannerSection /> */}
        {/* <GoogleReview /> */}
        {/* <Guides /> */}
        {/* <WhyEsanad /> */}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
