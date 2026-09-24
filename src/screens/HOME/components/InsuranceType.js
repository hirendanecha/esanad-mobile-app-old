import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useThemeContext } from '@theme/ThemeProvider';
import ComingSoon from '@components/ui/ComingSoon';
import OfferText from '@components/ui/OfferText';
import Car from '@assets/NEWICONS/Car';
import Health from '@assets/NEWICONS/Health';
import Travel from '@assets/NEWICONS/Travel';
import Icon from 'react-native-vector-icons/Ionicons';

const IMAGE_SIZE = 60;

const SCREEN_WIDTH = Dimensions.get('screen').width;
const LARGE_CARD_WIDTH = (SCREEN_WIDTH - 80.1) / 3;
const SMALL_CARD_WIDTH = (SCREEN_WIDTH - 60) / 2;

const InsuranceTypeList = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  const INSURANCE_TYPES = [
    {
      id: 'motor',
      title: 'Motor',
      icon: <Car />,
      size: IMAGE_SIZE,
      bg: theme.colors.motorLinear,
      offer: 'Upto 30% Off',
      onPress: () => navigation.navigate(SCREEN_NAMES.CAR_INSURANCE_SCREEN),
    },
    {
      id: 'health',
      title: 'Health',
      icon: <Health />,
      size: IMAGE_SIZE,
      bg: theme.colors.healthLinear,
      onPress: () => navigation.navigate(SCREEN_NAMES.INSURACE_FOR),
    },
    {
      id: 'travel',
      title: 'Travel',
      icon: <Travel />,
      size: IMAGE_SIZE,
      bg: theme.colors.travelLinear,
      onPress: () => {},
      soon: true,
    },
  ];

  const renderLargeCard = item => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.centered}
      onPress={item.onPress}
      disabled={item.soon}
    >
      {item?.soon && <OfferText text={'Coming Soon'} />}
      {item?.offer && <OfferText text={item.offer} />}

      <View style={styles.iconWrapper}>{item.icon}</View>
      <Text style={styles.label}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Buy Insurance</Text>
      </View>
      <View style={styles.largeGrid}>
        {INSURANCE_TYPES.map(renderLargeCard)}
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.viewMore}
        onPress={() => navigation.navigate(SCREEN_NAMES.EXPLORE_SCREEN)}
      >
        <Icon
          name="add-outline"
          size={verticalScale(35)}
          color={theme.colors.primary}
        />
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.primary,
            },
          ]}
        >
          View More
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InsuranceTypeList;

const useStyles = theme =>
  StyleSheet.create({
    container: {
      marginHorizontal: verticalScale(20),
      marginTop: verticalScale(5),
    },
    headerContainer: {
      marginBottom: verticalScale(15),
    },
    header: {
      fontSize: verticalScale(16),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    subheader: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
    },
    largeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: verticalScale(20),
    },
    viewMore: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(20),
      gap: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: verticalScale(15),
      paddingVertical: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
    },
    iconWrapper: {
      height: verticalScale(60),
      width: verticalScale(60),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: verticalScale(5),
    },
    smallGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: verticalScale(20),
    },
    largeCard: {
      flex: 1,
      borderRadius: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallCard: {
      borderRadius: verticalScale(10),
      borderWidth: 1,
      flex: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    centered: {
      height: verticalScale(130),
      width: LARGE_CARD_WIDTH,
      backgroundColor: theme.colors.bgSecondary,
      flex: 1,
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowCenter: {
      height: verticalScale(70),
      width: SMALL_CARD_WIDTH,
    },
    image: {
      resizeMode: 'contain',
    },
    label: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
    },
  });
