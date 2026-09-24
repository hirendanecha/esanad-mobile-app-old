import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import LinearGradient from 'react-native-linear-gradient';

// Icons
import PoliceIcon from '@assets/NEWICONS/LINKS/Police';
import TruckIcon from '@assets/NEWICONS/LINKS/Truck';
import EmergencyIcon from '@assets/NEWICONS/LINKS/Emergency';
import HospitalIcon from '@assets/NEWICONS/LINKS/Hospital';
import Support from '@assets/NEWICONS/LINKS/Support';
import Email from '@assets/NEWICONS/LINKS/Email';

import { SCREEN_NAMES } from '@constants/screenNames';

const EmergencyScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const EMERGENCY_DATA = [
    {
      id: '1',
      title: 'Police',
      subtitle: '999',
      icon: <PoliceIcon />,
      onPress: () => Linking.openURL('tel:999'),
    },
    {
      id: '2',
      title: 'RSA',
      subtitle: 'Road Side Assistance',
      icon: <TruckIcon />,
      onPress: () => navigation.navigate(SCREEN_NAMES.RSA_SCREEN),
    },
    {
      id: '3',
      title: 'Saaed',
      subtitle: '80072233',
      icon: <EmergencyIcon />,
      onPress: () => Linking.openURL('tel:80072233'),
    },
    {
      id: '4',
      title: 'Ambulance',
      subtitle: '911',
      icon: <HospitalIcon />,
      onPress: () => Linking.openURL('tel:911'),
    },
    {
      id: '5',
      title: 'eSanad Call',
      subtitle: '600 500 888',
      icon: <Support />,
      onPress: () => Linking.openURL('tel:+971600500888'),
    },
    {
      id: '6',
      title: 'eSanad Email',
      subtitle: 'hello@esanad.com',
      icon: <Email />,
      onPress: () => Linking.openURL('mailto:hello@esanad.com'),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={item.onPress}
    >
      <View style={styles.iconWrapper}>{item.icon}</View>
      <View style={styles.textWrapper}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.subtitleText}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>Our Head Office</Text>
      <TouchableOpacity
        style={styles.addressContainer}
        activeOpacity={0.8}
        onPress={() => {


          Linking.openURL(`https://maps.app.goo.gl/r1ouvfgUs6BbsV8D8`);

        }}
      >
        <View style={styles.footerIconWrapper}>
          <Entypo name="location-pin" size={verticalScale(20)} color={theme.colors.primary} />
        </View>
        <View style={styles.addressTextWrapper}>
          <Text style={styles.addressText}>eSanad Insurance</Text>
          <Text style={styles.addressText}>Al Saqer Al Baraka Building</Text>
          <Text style={styles.addressText}>26 شارع بيت الشعر - Al Danah - E11</Text>
          <Text style={styles.addressText}>Abu Dhabi, UAE</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.mainContainer}
    >
      <Header title="Emergency" navigation={navigation} />
      <FlatList
        data={EMERGENCY_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
      />
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: verticalScale(15),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(20),
      gap: verticalScale(10),
    },
    columnWrapper: {
      gap: verticalScale(10),
    },
    cardContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      padding: verticalScale(15),
      gap: verticalScale(10),
    },
    iconWrapper: {
      width: verticalScale(45),
      height: verticalScale(45),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: verticalScale(25),
      padding: verticalScale(5),
    },
    textWrapper: {
      alignItems: 'center',
    },
    titleText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitleText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      marginTop: verticalScale(2),
      textAlign: 'center',
    },
    footerContainer: {
      paddingTop: verticalScale(25),
      paddingBottom: verticalScale(10),
    },
    footerTitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      marginBottom: verticalScale(15),
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: verticalScale(15),
      paddingHorizontal: verticalScale(15),
      gap: verticalScale(12),
    },
    footerIconWrapper: {
      width: verticalScale(35),
      height: verticalScale(35),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: verticalScale(20),
      marginTop: verticalScale(2),
    },
    addressTextWrapper: {
      flex: 1,
      gap: verticalScale(4),
    },
    addressText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Medium',
      color: theme.colors.textPrimary,
      lineHeight: verticalScale(18),
    },
  });

export default EmergencyScreen;
