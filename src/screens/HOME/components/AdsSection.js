import React, { useState } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { Banner } from '@assets/index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH - 40;

const AdsSection = () => {
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [Banner.adbanner1, Banner.adbanner2, Banner.adbanner3];

  if (!banners.length) return null;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item} resizeMode="contain" style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={banners}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        loop
        autoplay
        autoplayDelay={500}
        autoplayInterval={3000}
        activeSlideAlignment="center"
        containerCustomStyle={styles.carouselContainer}
        onSnapToItem={index => setActiveIndex(index)} // ✅ important
      />

      <Pagination
        dotsLength={banners.length}
        activeDotIndex={activeIndex} // ✅ dynamic index
        containerStyle={styles.pagination}
        dotStyle={styles.dot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
        inactiveDotStyle={styles.inactiveDot}
      />
    </View>
  );
};

export default AdsSection;

const useStyles = theme =>
  StyleSheet.create({
    container: {
      gap: verticalScale(5),
      marginTop: verticalScale(20),
    },
    carouselContainer: {
      overflow: 'visible',
    },
    card: {
      height: moderateScale(200),
      marginHorizontal: verticalScale(5),
    },
    image: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    pagination: {
      paddingVertical: verticalScale(8),
    },
    dot: {
      width: moderateScale(16),
      height: moderateScale(8),
      borderRadius: moderateScale(4),
      backgroundColor: theme.colors.primary,
      marginHorizontal: moderateScale(-3),
    },
    inactiveDot: {
      width: moderateScale(8),
      height: moderateScale(8),
    },
  });
