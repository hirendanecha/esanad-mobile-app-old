import { useThemeContext } from '@theme/ThemeProvider';
import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale } from '@constants/metrics';

/**
 * Star Component
 * Handles full / half / empty stars, animated or static, read-only if onPress is null
 */
const Star = ({ type, size, color, emptyColor, onPress, animated }) => {
  const name =
    type === 'full' ? 'star' : type === 'half' ? 'star-half' : 'star-outline';

  if (!onPress) {
    return <Icon name={name} size={size} color={color} />;
  }

  if (animated) {
    const scale = new Animated.Value(1);
    const handlePressIn = () =>
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true }).start();
    const handlePressOut = () =>
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();

    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon
            name={name}
            size={size}
            color={type === 'empty' ? emptyColor : color}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessible
      accessibilityRole="button"
    >
      <Icon
        name={name}
        size={size}
        color={type === 'empty' ? emptyColor : color}
      />
    </TouchableOpacity>
  );
};

export const CustomStarRating = ({
  rating = 0,
  onChange = null,
  maxStars = 5,
  size = 28,
  color,
  emptyColor,
  step = 1,
  animated = true,
  containerStyle,
}) => {
  const { theme } = useThemeContext();

  // New logic: allow half stars based on step value
  const allowHalf = step >= 0.01;

  // New star rendering logic - simple and reliable
  const renderStars = useCallback(() => {
    const stars = [];

    // Calculate full stars and check for half star
    const fullStars = Math.floor(rating);
    const remainder = rating - fullStars;

    // Show half star if remainder is 0.5 or if we're in half-star mode and there's any remainder
    const showHalfStar = allowHalf && remainder >= 0.3 && remainder <= 0.9;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <View key={`full-${i}`} style={styles.single}>
          <Star
            type="full"
            size={size}
            color={color || theme.colors.star}
            emptyColor={emptyColor || theme.colors.border}
            animated={animated}
            onPress={onChange ? () => handleStarPress(i + 1) : null}
          />
        </View>,
      );
    }

    // Add half star if needed
    if (showHalfStar) {
      stars.push(
        <View key="half" style={styles.single}>
          <Star
            type="half"
            size={size}
            color={color || theme.colors.star}
            emptyColor={emptyColor || theme.colors.border}
            animated={animated}
            onPress={onChange ? () => handleStarPress(fullStars + 0.5) : null}
          />
        </View>,
      );
    }

    // Calculate how many empty stars we need
    const starsDisplayed = fullStars + (showHalfStar ? 1 : 0);
    const emptyStarsCount = maxStars - starsDisplayed;

    // Add empty stars
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(
        <View key={`empty-${i}`} style={styles.single}>
          <Star
            type="empty"
            size={size}
            color={color || theme.colors.star}
            emptyColor={emptyColor || theme.colors.border}
            animated={animated}
            onPress={
              onChange ? () => handleStarPress(starsDisplayed + i + 1) : null
            }
          />
        </View>,
      );
    }

    return stars;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rating,
    maxStars,
    allowHalf,
    size,
    color,
    emptyColor,
    theme,
    animated,
    onChange,
  ]);

  const handleStarPress = useCallback(
    newRating => {
      if (!onChange) return;
      onChange(newRating);
    },
    [onChange],
  );

  const starComponents = useMemo(() => {
    return renderStars();
  }, [renderStars]);

  return <View style={[styles.row, containerStyle]}>{starComponents}</View>;
};

// New simple star rating with reliable half-star logic
export const SimpleStarRating = ({
  rating = 0,
  maxStars = 5,
  size = 28,
  color,
  emptyColor,
  containerStyle,
}) => {
  const { theme } = useThemeContext();

  const stars = useMemo(() => {
    const starArray = [];
    const fullStars = Math.floor(rating);
    const remainder = rating - fullStars;

    // Show half star for any decimal value between 0.3 and 0.7
    // This provides better UX than only showing for exact 0.5
    const showHalfStar = remainder >= 0.3 && remainder <= 0.7;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starArray.push(
        <Icon
          key={`full-${i}`}
          name="star"
          size={moderateScale(size)}
          color={color || theme.colors.star}
        />,
      );
    }

    // Add half star
    if (showHalfStar) {
      starArray.push(
        <Icon
          key="half"
          name="star-half"
          size={moderateScale(size)}
          color={color || theme.colors.star}
        />,
      );
    }

    // Add empty stars
    const totalStars = starArray.length;
    for (let i = totalStars; i < maxStars; i++) {
      starArray.push(
        <Icon
          key={`empty-${i}`}
          name="star-outline"
          size={moderateScale(size)}
          color={emptyColor || theme.colors.border}
        />,
      );
    }

    return starArray;
  }, [rating, maxStars, size, color, emptyColor, theme]);

  return <View style={[styles.row, containerStyle]}>{stars}</View>;
};

// Ultra simple version - exactly matches reference behavior
export const ReferenceStarRating = ({
  rating = 0,
  maxStars = 5,
  size = 28,
  color,
  emptyColor,
  containerStyle,
}) => {
  const { theme } = useThemeContext();

  const stars = useMemo(() => {
    const starArray = [];

    // Simple logic: floor for full stars, show half for any decimal
    const fullStars = Math.floor(rating);
    const hasDecimal = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starArray.push(
        <Icon
          key={`star-${i}`}
          name="star"
          size={moderateScale(size)}
          color={color || theme.colors.star}
        />,
      );
    }

    // Half star (show for any decimal value)
    if (hasDecimal && fullStars < maxStars) {
      starArray.push(
        <Icon
          key="star-half"
          name="star-half"
          size={moderateScale(size)}
          color={color || theme.colors.star}
        />,
      );
    }

    // Empty stars
    const currentCount = starArray.length;
    for (let i = currentCount; i < maxStars; i++) {
      starArray.push(
        <Icon
          key={`empty-${i}`}
          name="star-outline"
          size={moderateScale(size)}
          color={emptyColor || theme.colors.border}
        />,
      );
    }

    return starArray;
  }, [rating, maxStars, size, color, emptyColor, theme]);

  return <View style={[styles.row, containerStyle]}>{stars}</View>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(2),
  },
  single: {
    marginHorizontal: moderateScale(0.5),
  },
});

export default CustomStarRating;
