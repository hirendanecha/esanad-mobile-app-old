import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useThemeContext } from '@theme/ThemeProvider';

import Renewals from '@assets/images/policy/Renewals';
import Home from '@assets/images/policy/Home';
import Health from '@assets/images/policy/Health';
import GroupHealth from '@assets/images/policy/GroupHealth';
import RentCar from '@assets/images/policy/RentCar';
import Construction from '@assets/images/policy/Construction';
import Liability from '@assets/images/policy/Liability';
import Professional from '@assets/images/policy/Professional';
import Workers from '@assets/images/policy/Workers';
import Machinery from '@assets/images/policy/Machinery';
import Office from '@assets/images/policy/Office';
import Energy from '@assets/images/policy/Energy';
import MarineCargo from '@assets/images/policy/MarineCargo';
import Musataha from '@assets/images/policy/Musataha';
import MarineHull from '@assets/images/policy/MarineHull';
import Retail from '@assets/images/policy/Retail';
import Restaurant from '@assets/images/policy/Restaurant';
import Education from '@assets/images/policy/Education';
import Beauty from '@assets/images/policy/Beauty';
import Medical from '@assets/images/policy/Medical';
import { createStyles } from './ExploreScreen.styles';
import { SCREEN_NAMES } from '@constants/screenNames';
import OfferCarousel from '@components/ui/OfferCarousel';
import { Images, Insurance } from '@assets/index';

const insuranceProducts = [
  {
    name: 'Small Groups Health Insurance (1 - 25)',
    icon: <Health />,
    soon: true,
  },
  { name: 'Group Health Insurance', icon: <GroupHealth />, soon: true },
  { name: 'Motor Fleet Insurance', icon: <Renewals />, soon: true },
  { name: 'Rent a Car Insurance', icon: <RentCar />, soon: true },
  { name: 'Property Insurance', icon: <Home />, soon: true },
  {
    name: 'Contractor`s All Risk (CAR) Insurance',
    icon: <Construction />,
    soon: true,
  },
  { name: 'Public Liability Insurance', icon: <Liability />, soon: true },
  {
    name: 'Professional Indemnity Insurance',
    icon: <Professional />,
    soon: true,
  },
  { name: 'Workman Compensation Insurance', icon: <Workers />, soon: true },
  { name: 'CPM Insurance', icon: <Machinery />, soon: true },
  { name: 'Office Insurance', icon: <Office />, soon: true },
  { name: 'Energy Insurance', icon: <Energy />, soon: true },
  { name: 'Marine Cargo Insurance', icon: <MarineCargo />, soon: true },
  { name: 'Musataha Insurance', icon: <Musataha />, soon: true },
  { name: 'Marine Hull Insurance', icon: <MarineHull />, soon: true },
  { name: 'Retail Insurance', icon: <Retail />, soon: true },
  { name: 'Restaurant & Café Insurance', icon: <Restaurant />, soon: true },
  { name: 'Education Institute Insurance', icon: <Education />, soon: true },
  {
    name: 'Spa, Saloon & Beauty Parlor Insurance',
    icon: <Beauty />,
    soon: true,
  },
  { name: 'Medical Centers Insurance', icon: <Medical />, soon: true },
];

const ExploreScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const MAIN_INSURANCE = [
    {
      name: 'Motor Insurance',
      image: Insurance.carMain,
      onPress: () => navigation.navigate(SCREEN_NAMES.CAR_INSURANCE_SCREEN),
      offer: 'UPTO 30% OFF',
    },
    {
      name: 'Health Insurance',
      image: Insurance.healthMain,
      offer: 'Instant Quote',
      onPress: () => navigation.navigate(SCREEN_NAMES.INSURACE_FOR),
    },
    {
      name: 'Travel Insurance',
      image: Insurance.travelMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'Home Insurance',
      image: Insurance.homeMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'Pet Insurance',
      image: Insurance.petMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'Yacht Insurance',
      image: Insurance.yatchMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'Cyber Insurance',
      image: Insurance.cyberMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      style={styles.container}
    >
      <View style={styles.scrollContent}>
        <OfferCarousel data={MAIN_INSURANCE} />
      </View>
    </LinearGradient>
  );
};

export default ExploreScreen;
