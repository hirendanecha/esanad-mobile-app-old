import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';
import { useGetRating } from '@hooks/home/useHomeFlow';
import CustomStarRating from '@components/ui/CustomStarRating';

const GoogleReview = () => {
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  const { data } = useGetRating();

  const ratingData = data?.data?.ratingResponse?.result ?? {};

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={Images.Google}
          resizeMode="contain"
          style={styles.logo}
        />

        <View style={styles.ratingRow}>
          <Text style={styles.label}>Google Rating</Text>
          <Text style={styles.ratingText}>{ratingData.rating}</Text>
        </View>
      </View>

      <CustomStarRating
        rating={ratingData.rating}
        size={15}
        color={theme.colors.star}
        containerStyle={styles.ratingStarContainer}
      />

      <Text style={styles.reviewCount}>
        More than {ratingData.user_ratings_total} reviews
      </Text>
    </View>
  );
};

export default GoogleReview;

const useStyles = theme =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(10),
      paddingHorizontal: verticalScale(15),
      width: (Dimensions.get('screen').width - 60) / 2,
      justifyContent: 'center',
      borderRadius: verticalScale(15),
      borderWidth: 0.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    logo: {
      width: verticalScale(40),
      height: verticalScale(40),
    },
    content: {
      gap: verticalScale(10),
      flexDirection: 'row',
    },
    label: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    ratingRow: {
      gap: verticalScale(3),
    },
    ratingText: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Black',
      color: theme.colors.text,
    },
    ratingStarContainer: {
      marginTop: verticalScale(2),
    },
    reviewCount: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      marginTop: verticalScale(2),
    },
  });
