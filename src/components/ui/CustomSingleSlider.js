import { StyleSheet, View, Text, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { verticalScale } from '@constants/metrics';

// Enable text prop for animated TextInput
Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CustomSingleSlider = ({
  sliderWidth,
  min,
  max,
  step,
  onValueChange,
  initialValue = null,
  theme,
}) => {
  // Calculate initial position based on initialValue
  const getPositionFromValue = value => {
    const range = max - min;
    const normalizedValue = value - min;
    return (normalizedValue / range) * sliderWidth;
  };

  const startValue = initialValue !== null ? initialValue : min;

  const position = useSharedValue(getPositionFromValue(startValue));
  const opacity = useSharedValue(0);
  const context = useSharedValue(0);

  // Update position when initialValue changes
  useEffect(() => {
    position.value = getPositionFromValue(startValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, min, max, sliderWidth]);

  const calculateValue = pos => {
    'worklet';
    return min + Math.floor(pos / (sliderWidth / ((max - min) / step))) * step;
  };

  // Derived value that updates in real-time during sliding
  const currentValue = useDerivedValue(() => {
    return calculateValue(position.value);
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = position.value;
    })
    .onUpdate(e => {
      opacity.value = 1;
      if (context.value + e.translationX < 0) {
        position.value = 0;
      } else if (context.value + e.translationX > sliderWidth) {
        position.value = sliderWidth;
      } else {
        position.value = context.value + e.translationX;
      }
    })
    .onEnd(() => {
      opacity.value = 0;
      runOnJS(onValueChange)(calculateValue(position.value));
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  // Animated props for the label
  const labelProps = useAnimatedProps(() => ({
    text: `${currentValue.value}`,
  }));

  return (
    <View style={styles(theme).container}>
      <View style={[styles(theme).sliderContainer, { width: sliderWidth }]}>
        <View style={[styles(theme).sliderBack, { width: sliderWidth }]} />
        <Animated.View style={[sliderStyle, styles(theme).sliderFront]} />
        <GestureDetector gesture={pan}>
          <Animated.View style={[animatedStyle, styles(theme).thumb]}>
            <Animated.View style={[opacityStyle, styles(theme).label]}>
              <AnimatedTextInput
                style={styles(theme).labelText}
                animatedProps={labelProps}
                editable={false}
                defaultValue={`${startValue}`}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles(theme).rangeRow}>
        <Text style={styles(theme).rangeText}>
          min{`\n`}
          {min}
        </Text>
        <Text style={styles(theme).rangeText}>{initialValue}</Text>
        <Text style={styles(theme).rangeText}>
          max{`\n`}
          {max}
        </Text>
      </View>
    </View>
  );
};

export default CustomSingleSlider;

const styles = theme =>
  StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    sliderContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 10,
    },
    sliderBack: {
      height: 8,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme?.colors?.border,
    },
    sliderFront: {
      height: 8,
      backgroundColor: theme?.colors?.primary,
      borderRadius: 20,
      position: 'absolute',
      left: 0,
    },
    thumb: {
      left: -10,
      width: 20,
      height: 20,
      position: 'absolute',
      backgroundColor: theme?.colors?.primary,
      borderColor: theme?.colors?.primary,
      borderWidth: 5,
      borderRadius: 10,
    },
    label: {
      position: 'absolute',
      top: -40,
      bottom: 20,
      backgroundColor: theme?.colors?.floorBgColor,
      borderRadius: 5,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelText: {
      color: theme?.colors?.primary,
      padding: 5,
      fontFamily: 'Lato-Bold',
      fontSize: verticalScale(12),
      width: '100%',
      marginHorizontal: 2,
      textAlign: 'center',
    },
    rangeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
      alignItems: 'center',
    },
    rangeText: {
      fontSize: verticalScale(12),
      color: theme?.colors?.textTertiary,
      textAlign: 'center',
      fontFamily: 'Lato-Regular',
    },
  });
