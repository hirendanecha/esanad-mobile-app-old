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
import Geolocation from 'react-native-geolocation-service';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Food from '@assets/NEWICONS/LINKS/Food';
import Police from '@assets/NEWICONS/LINKS/Police';
import Gas from '@assets/NEWICONS/LINKS/Gas';
import Hospital from '@assets/NEWICONS/LINKS/Hospital';
import Truck from '@assets/NEWICONS/LINKS/Truck';
import Mose from '@assets/NEWICONS/LINKS/Mose';
import Shopping from '@assets/NEWICONS/LINKS/Shopping';
import Bank from '@assets/NEWICONS/LINKS/Bank';
import Saloon from '@assets/NEWICONS/LINKS/Saloon';
import Typing from '@assets/NEWICONS/LINKS/Typing';
import LinearGradient from 'react-native-linear-gradient';

const UsefulLinks = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const LINKS_DATA = [
    { id: '1', title: 'Police Stations', icon: <Police /> },
    { id: '2', title: 'Food', icon: <Food /> },
    { id: '3', title: 'Fuel', icon: <Gas /> },
    { id: '4', title: 'Hospitals', icon: <Hospital /> },
    { id: '5', title: 'Towing', icon: <Truck /> },
    { id: '6', title: 'Mosques', icon: <Mose /> },
    { id: '7', title: 'Shopping Mall', icon: <Shopping /> },
    { id: '8', title: 'Government Office', icon: <Bank /> },
    { id: '9', title: 'Saloon Spa', icon: <Saloon /> },
    { id: '10', title: 'Typing Services', icon: <Typing /> },
  ];

  const openMaps = (title, lat, lng) => {
    const encodedTitle = encodeURIComponent(title);
    let
      url = `https://www.google.com/maps/search/${encodedTitle}/@${lat},${lng},16z`;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const handlePress = async (title) => {
    // Default UAE (Dubai) Coordinates
    const DEFAULT_LAT = 25.2048;
    const DEFAULT_LNG = 55.2708;

    try {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          openMaps(title, latitude, longitude);
        },
        error => {
          console.error('Location Error:', error);
          openMaps(title, DEFAULT_LAT, DEFAULT_LNG);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.warn(err);
      openMaps(title, DEFAULT_LAT, DEFAULT_LNG);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => handlePress(item.title)}
    >
      <View style={styles.iconWrapper}>{item.icon}</View>
      <Text style={styles.titleText}>{item.title}</Text>
      <Entypo
        name="chevron-small-right"
        size={verticalScale(30)}
        color={theme.colors.textTertiary}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.mainContainer}
    >
      <Header title="Useful Links" navigation={navigation} />
      <FlatList
        data={LINKS_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      padding: verticalScale(10),
      paddingHorizontal: verticalScale(15),
      gap: verticalScale(15),
    },
    iconWrapper: {
      width: verticalScale(40),
      height: verticalScale(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      flex: 1,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
    },
  });

export default UsefulLinks;
