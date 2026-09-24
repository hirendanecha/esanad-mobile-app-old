import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Pressable,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { env } from '@config/index';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '@constants/screenNames';

const PartnerCard = React.memo(({ item, onUpdate }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const handleLocationPress = url => {
    if (url)
      Linking.openURL(url).catch(err => console.error('Error opening:', err));
  };

  const coverImg = `${env.API_URL}${item?.partner?.coverImg?.path}`;
  const logoImg = `${env.API_URL}${item?.partner?.logoImg?.path}`;

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate(SCREEN_NAMES.OFFERS_DETAILS, {
          partnerId: item?.partner?._id,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: coverImg }}
          style={styles.image}
          resizeMode="cover"
        />

        {logoImg && (
          <Image
            source={{ uri: logoImg }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item?.partner?.companyName}
        </Text>

        <View style={styles.locationContainer}>
          {item?.partner?.locations?.map((location, idx) => (
            <>
              <Icon
                name="location-on"
                size={verticalScale(14)}
                color={theme.colors.description}
              />
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => handleLocationPress(location?.googleLocation)}
                activeOpacity={0.8}
              >
                <Text numberOfLines={1} style={styles.chipText}>
                  {location?.location}
                </Text>
              </TouchableOpacity>
            </>
          ))}
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {item?.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

export const getStyles = theme =>
  StyleSheet.create({
    card: {
      borderRadius: verticalScale(16),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: (Dimensions.get('window').width - 55) / 2,
      padding: verticalScale(10),
    },
    imageContainer: {
      height: verticalScale(100),
      backgroundColor: theme.colors.floorBgColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: verticalScale(5),
    },
    logoImage: {
      position: 'absolute',
      width: verticalScale(60),
      height: verticalScale(600),
      borderRadius: verticalScale(5),
    },
    contentContainer: {
      marginTop: verticalScale(10),
      gap: verticalScale(10),
    },
    title: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    locationContainer: {
      flexDirection: 'row',
      gap: verticalScale(5),
      flex: 1,
    },
    chipText: {
      fontSize: verticalScale(12),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
      width: (Dimensions.get('screen').width - 175) / 2,
    },
    companyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    companyName: {
      fontSize: verticalScale(14),

      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    categoryBadge: {
      backgroundColor: theme.colors.lableBg,
      paddingVertical: verticalScale(4),
      paddingHorizontal: verticalScale(10),
      borderRadius: verticalScale(12),
      alignSelf: 'flex-start',
    },
    categoryText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.lableText,
    },
    termsText: {
      fontSize: verticalScale(13),

      color: theme.colors.description,
      lineHeight: verticalScale(20),
    },
    readMoreText: {
      fontSize: verticalScale(13),
      fontWeight: '600',
      color: theme.colors.primary,

      alignSelf: 'flex-end',
      marginBottom: verticalScale(16),
    },
    availButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: verticalScale(12),
      paddingVertical: verticalScale(12),
    },
    availButtonText: {
      color: theme.colors.backgroundColor,
      fontSize: verticalScale(16),
      fontWeight: '600',
    },
  });

export default PartnerCard;
