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
import OfferCarousel from '@components/ui/OfferCarousel';
import { Images, Insurance } from '@assets/index';
import { verticalScale } from '@constants/metrics';
import { Dimensions, StyleSheet } from 'react-native';

const ITEM_WIDTH = (Dimensions.get('screen').width - 70) / 4;

const insuranceProducts = [
  {
    name: 'Small Groups Health Insurance (1 - 25)',
    icon: <Health />,
    soon: true,
  },
  { name: 'Motor Fleet Insurance', icon: <Renewals />, soon: true },
  { name: 'Rent a Car Insurance', icon: <RentCar />, soon: true },
  { name: 'Property Insurance', icon: <Home />, soon: true },
  { name: 'Public Liability Insurance', icon: <Liability />, soon: true },
  { name: 'Workman Compensation Insurance', icon: <Workers />, soon: true },
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

const BusinessScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const MAIN_INSURANCE = [
    {
      name: 'Group Health Insurance',
      image: Insurance.groupHealthMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'Professional Indemnity Insurance',
      image: Insurance.professionalIndemnityMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'CPM Insurance',
      image: Insurance.cpmMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: "Contractor's All Risk (CAR) Engineering Insurance",
      image: Insurance.contractorAllRiskMain,
      offer: 'Coming Soon...',
      onPress: () => {},
    },
    {
      name: 'Office Insurance',
      image: Insurance.officeMain,
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

export default BusinessScreen;

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flex: 1,
      paddingBottom: verticalScale(150),
    },
    sectionTitle: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Black',
      color: theme.colors.text,
      marginHorizontal: verticalScale(20),
      marginVertical: verticalScale(20),
    },
    tabsContainer: {
      paddingHorizontal: verticalScale(20),
      gap: verticalScale(10),
      alignItems: 'center',
      marginBottom: verticalScale(20),
    },
    tab: {
      height: verticalScale(40),
      width: verticalScale(150),
      borderRadius: verticalScale(20),
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
    },
    tabActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    tabText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.description,
    },
    tabTextActive: {
      color: theme.colors.textSecondary,
    },
    gridContainer: {
      gap: verticalScale(10),
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: verticalScale(20),
    },
    row: {
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    card: {
      width: ITEM_WIDTH,
      paddingVertical: verticalScale(10),
      borderRadius: verticalScale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    iconWrapper: {
      width: verticalScale(40),
      height: verticalScale(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardText: {
      fontSize: verticalScale(10),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
      paddingHorizontal: verticalScale(10),
    },
  });
