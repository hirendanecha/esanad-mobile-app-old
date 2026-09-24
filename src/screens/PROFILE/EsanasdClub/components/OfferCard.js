import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import CustomButton from '@components/ui/CustomButton';
import { env } from '@config/index';

const OfferCard = React.memo(({ item, onUpdate }) => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleLocationPress = useCallback(url => {
    if (!url) return;
    Linking.openURL(url).catch(err =>
      console.error('Error opening location:', err),
    );
  }, []);

  const imageUri = `${env.API_URL}${item?.partner?.coverImg?.path}`;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item?.discountTitle}</Text>

        <View style={styles.companyRow}>
          {item?.partner?.locations?.map((location, index) => (
            <View key={index} style={styles.locationContainer}>
              <Icon
                name="location-on"
                size={moderateScale(18)}
                color={theme.colors.description}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleLocationPress(location?.googleLocation)}
              >
                <Text style={styles.chipText}>{location?.location}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.companyInfoRow}>
          <Text style={styles.companyName} numberOfLines={1}>
            {item?.partner?.companyName}
          </Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item?.category}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={1} onPress={toggleReadMore}>
          <Text
            style={styles.termsText}
            numberOfLines={expanded ? undefined : 2}
          >
            {item?.termsNConditions}
          </Text>
        </TouchableOpacity>
        <CustomButton
          title="Avail"
          onPress={() => onUpdate(item)}
          buttonStyle={styles.availButton}
          textStyle={styles.availButtonText}
        />
      </View>
    </View>
  );
});

export default OfferCard;

export const getStyles = theme =>
  StyleSheet.create({
    card: {
      marginHorizontal: verticalScale(20),
      borderRadius: moderateScale(16),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    imageContainer: {
      height: verticalScale(180),
      backgroundColor: theme.colors.floorBgColor,
      borderTopLeftRadius: moderateScale(16),
      borderTopRightRadius: moderateScale(16),
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      padding: verticalScale(16),
    },
    title: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      marginBottom: verticalScale(12),
      lineHeight: moderateScale(24),
    },
    companyRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: verticalScale(5),
      gap: verticalScale(8),
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(4),
    },
    chipText: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    companyInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(5),
      gap: verticalScale(8),
    },
    companyName: {
      flex: 1,
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    categoryBadge: {
      backgroundColor: theme.colors.lableBg,
      paddingVertical: verticalScale(4),
      paddingHorizontal: verticalScale(10),
      borderRadius: moderateScale(12),
    },
    categoryText: {
      fontSize: moderateScale(12),
      color: theme.colors.lableText,
      fontFamily: 'Lato-Regular',
    },
    termsText: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      lineHeight: moderateScale(20),
    },
    readMoreText: {
      alignSelf: 'flex-end',
      fontSize: moderateScale(14),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
      textDecorationLine: 'underline',
      marginTop: verticalScale(4),
    },
    availButton: {
      marginTop: verticalScale(12),
      backgroundColor: theme.colors.primary,
      borderRadius: moderateScale(12),
      height: verticalScale(40),
      width: '30%',
    },
    availButtonText: {
      fontSize: verticalScale(16),
    },
  });
