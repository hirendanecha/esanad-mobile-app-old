import * as React from 'react';
import {
  Dimensions,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';

const { width: PAGE_WIDTH, height: windowHeight } = Dimensions.get('window');

function OfferCarousel({ data }) {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const progress = useSharedValue(0);

  const headerHeight = verticalScale(100);
  const PAGE_HEIGHT = windowHeight - headerHeight;

  const animationStyle = React.useCallback(value => {
    'worklet';

    const translateX = interpolate(
      value,
      [-1, 0, 1, 2],
      [-PAGE_WIDTH, 0, 0, 0], // Shifting background cards closer to center
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      value,
      [-1, 0, 1, 2],
      [1, 1, 1, 1], // Progressively scale down
      Extrapolation.CLAMP,
    );

    const rotateZ = interpolate(
      value,
      [-1, 0, 1, 2],
      [-10, 0, 10, -10], // Stronger rotation for fanning effect
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      value,
      [-1, 0, 1, 2, 3],
      [0, 1, 1, 1, 0], // Keep all 3 primary cards fully opaque in the stack
      Extrapolation.CLAMP,
    );

    const zIndex = interpolate(
      value,
      [-1, 0, 1, 2],
      [400, 300, 200, 100],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX }, { scale }, { rotateZ: `${rotateZ}deg` }],
      opacity,
      zIndex: Math.floor(zIndex),
    };
  }, []);

  return (
    <View style={styles.container}>
      <Carousel
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT / 1.6}
        loop={true}
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT / 1.6,
        }}
        defaultIndex={0}
        vertical={false}
        data={data}
        renderItem={({ index, item, animationValue }) => (
          <Item
            key={index}
            index={index}
            item={item}
            theme={theme}
            animationValue={animationValue}
          />
        )}
        customAnimation={animationStyle}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
      />
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <PaginationItem
            key={index}
            index={index}
            length={data.length}
            progress={progress}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
}

const PaginationItem = ({ index, length, progress, theme }) => {
  const styles = createStyles(theme);

  const animStyle = useAnimatedStyle(() => {
    const val = progress.value;
    const displacement = val - index;
    // Calculate shortest distance in a wrapping (cyclic) manner
    const shortestDist =
      displacement - Math.round(displacement / length) * length;
    const absDist = Math.abs(shortestDist);

    // Interpolate width: Active=24, Neighbor=8, Far=0
    const width = interpolate(
      absDist,
      [0, 1, 2],
      [24, 8, 0],
      Extrapolation.CLAMP,
    );

    // Interpolate opacity/margin to hide far items smoothly
    const opacity = interpolate(
      absDist,
      [0, 1, 2],
      [1, 1, 0],
      Extrapolation.CLAMP,
    );

    const marginHorizontal = interpolate(
      absDist,
      [0, 1, 2],
      [4, 4, 0],
      Extrapolation.CLAMP,
    );

    const backgroundColor = interpolateColor(
      absDist,
      [0, 1],
      [theme.colors.primary, theme.colors.border],
    );

    return {
      width,
      opacity,
      marginHorizontal,
      backgroundColor,
    };
  }, [length]);

  return <Animated.View style={[styles.dotBase, animStyle]} />;
};

const Item = ({ index, item, theme, animationValue }) => {
  const styles = createStyles(theme);
  const width = PAGE_WIDTH * 0.7;
  const height = PAGE_WIDTH * 1;

  const animatedCardStyle = useAnimatedStyle(() => {
    const elevation = interpolate(
      animationValue.value,
      [-1, 0, 1, 2],
      [0, 5, 2.5, 0],
      Extrapolation.CLAMP,
    );

    return {
      elevation,
    };
  }, [animationValue]);

  const CardContent = () => (
    <Animated.View style={[styles.card, { width, height }, animatedCardStyle]}>
      <View style={styles.textOverlay}>
        {item.name ? <Text style={styles.offerText}>{item.name}</Text> : null}
        {item.offer == 'Coming Soon...' || item.offer == 'Instant Quote' ? (
          <Text style={styles.descriptionTextComing}>
            {item.offer || item.name}
          </Text>
        ) : item.offer ? (
          <Text style={styles.descriptionText}>{item.offer || item.name}</Text>
        ) : null}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.colors.primary,
          borderRadius: verticalScale(50),
          padding: verticalScale(15),
        }}
      >
        <Icon
          name="arrow-right-long"
          size={moderateScale(24)}
          color={theme.colors.primary}
        />
      </View>
      {item.image ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <Image
            source={item.image}
            style={{
              width,
              height: '100%',
            }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.iconContainer}>{item.icon}</View>
      )}
    </Animated.View>
  );

  if (item.onPress) {
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={styles.itemContainer}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={item.onPress}
          disabled={item.soon}
        >
          <CardContent />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={styles.itemContainer}
    >
      <CardContent />
    </Animated.View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      borderRadius: moderateScale(20),
      alignItems: 'center',
      gap: moderateScale(20),
      backgroundColor: theme.colors.backgroundColor,
      shadowColor:
        Platform.OS === 'ios' ? theme.colors.text : theme.colors.text + '50',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      borderWidth: Platform.OS === 'ios' ? 0 : 1,
      borderColor: Platform.OS === 'ios' ? theme.colors.border : theme.colors.border,
    },
    textOverlay: {
      paddingTop: moderateScale(30),
      gap: moderateScale(10),
      borderRadius: moderateScale(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    offerText: {
      color: theme.colors.text,
      fontSize: moderateScale(18),
      fontFamily: 'Lato-Black',
      textAlign: 'center',
      marginHorizontal: verticalScale(20),
    },
    descriptionText: {
      fontFamily: 'Lato-Bold',
      fontSize: moderateScale(10),
      padding: moderateScale(5),
      borderRadius: moderateScale(10),
      alignSelf: 'center',
      color: theme.colors.text,
      backgroundColor: theme.colors.highlight,
    },
    descriptionTextComing: {
      fontFamily: 'Lato-Bold',
      fontSize: verticalScale(10),
      padding: verticalScale(5),
      borderRadius: verticalScale(10),
      alignSelf: 'center',
      color: theme.colors.text,
      backgroundColor: theme.colors.highlight,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(10), // Adjust as needed
    },
    dotBase: {
      height: moderateScale(8),
      borderRadius: moderateScale(4),
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: '50%',
      width: '50%',
      borderRadius: moderateScale(20),
    },
  });

export default OfferCarousel;
