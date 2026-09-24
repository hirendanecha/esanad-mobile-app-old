import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_NAMES } from '@constants/screenNames';
import Temperature from '@assets/NEWICONS/LINKS/Temperature';
import Link from '@assets/NEWICONS/LINKS/Link';
import Currency from '@assets/NEWICONS/LINKS/Currency';
import Holiday from '@assets/NEWICONS/LINKS/Holiday';
import FAQS from '@assets/NEWICONS/LINKS/FAQS';

const Tools = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const TOOLS_DATA = [
    {
      id: '1',
      title: 'Temperature in UAE',
      description: 'We have wide range of branch across all emirates',
      icon: <Temperature />,
      onPress: () => Linking.openURL('https://www.google.com/search?q=weather+in+uae'),
    },
    {
      id: '2',
      title: 'Exchange Rates',
      description: 'We have wide range of branch across all emirates',
      icon: <Currency />,
      onPress: () => Linking.openURL('https://www.xe.com/currencyconverter/convert/?Amount=1&From=INR&To=USD'),
    },
    {
      id: '3',
      title: 'Public Holidays',
      description: 'We have wide range of branch across all emirates',
      icon: <Holiday />,
      onPress: () => Linking.openURL('https://publicholidays.ae'),
    },
    {
      id: '4',
      title: "FAQ's",
      description: 'We have wide range of branch across all emirates',
      icon: <FAQS />,
      onPress: () => navigation.navigate(SCREEN_NAMES.FAQ_SCREEN),
    },
    {
      id: '5',
      title: 'Useful Links',
      description: 'We have wide range of branch across all emirates',
      icon: <Link />,
      onPress: () => navigation.navigate(SCREEN_NAMES.USEFUL_LINKS),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={item.onPress}
    >
      <View style={styles.iconWrapper}>{item.icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
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
      <Header title="Tools" navigation={navigation} />
      <FlatList
        data={TOOLS_DATA}
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
      gap: verticalScale(15),
    },
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(12),
      padding: verticalScale(15),
      gap: verticalScale(15),
    },
    iconWrapper: {
      width: verticalScale(60),
      height: verticalScale(60),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      gap: verticalScale(5),
    },
    titleText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    descriptionText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
  });

export default Tools;
