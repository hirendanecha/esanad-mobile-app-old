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

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CustomRangeSlider = ({
  sliderWidth,
  min,
  max,
  step,
  onValueChange,
  initialMin = null,
  initialMax = null,
  theme,
}) => {
  const getPositionFromValue = value => {
    const range = max - min;
    const normalizedValue = value - min;
    return (normalizedValue / range) * sliderWidth;
  };

  const startMin = initialMin !== null ? initialMin : min;
  const startMax = initialMax !== null ? initialMax : max;

  const position = useSharedValue(getPositionFromValue(startMin));
  const position2 = useSharedValue(getPositionFromValue(startMax));
  const opacity = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const zIndex2 = useSharedValue(0);
  const context = useSharedValue(0);
  const context2 = useSharedValue(0);

  useEffect(() => {
    position.value = getPositionFromValue(startMin);
    position2.value = getPositionFromValue(startMax);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMin, initialMax, min, max, sliderWidth]);

  const calculateValue = pos => {
    'worklet';
    return min + Math.floor(pos / (sliderWidth / ((max - min) / step))) * step;
  };

  const minValue = useDerivedValue(() => {
    return calculateValue(position.value);
  });

  const maxValue = useDerivedValue(() => {
    return calculateValue(position2.value);
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = position.value;
    })
    .onUpdate(e => {
      opacity.value = 1;
      if (context.value + e.translationX < 0) {
        position.value = 0;
      } else if (context.value + e.translationX > position2.value) {
        position.value = position2.value;
        zIndex.value = 1;
        zIndex2.value = 0;
      } else {
        position.value = context.value + e.translationX;
      }
    })
    .onEnd(() => {
      opacity.value = 0;
      runOnJS(onValueChange)({
        min: calculateValue(position.value),
        max: calculateValue(position2.value),
      });
    });

  const pan2 = Gesture.Pan()
    .onBegin(() => {
      context2.value = position2.value;
    })
    .onUpdate(e => {
      opacity2.value = 1;
      if (context2.value + e.translationX > sliderWidth) {
        position2.value = sliderWidth;
      } else if (context2.value + e.translationX < position.value) {
        position2.value = position.value;
        zIndex.value = 0;
        zIndex2.value = 1;
      } else {
        position2.value = context2.value + e.translationX;
      }
    })
    .onEnd(() => {
      opacity2.value = 0;
      runOnJS(onValueChange)({
        min: calculateValue(position.value),
        max: calculateValue(position2.value),
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    zIndex: zIndex.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: position2.value }],
    zIndex: zIndex2.value,
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const opacityStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    width: position2.value - position.value,
  }));

  const minLabelProps = useAnimatedProps(() => ({
    text: `${minValue.value}`,
  }));

  const maxLabelProps = useAnimatedProps(() => ({
    text: `${maxValue.value}`,
  }));

  const centerTextProps = useAnimatedProps(() => ({
    text: `${minValue.value} - ${maxValue.value}`,
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
                animatedProps={minLabelProps}
                editable={false}
                defaultValue={`${startMin}`}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <GestureDetector gesture={pan2}>
          <Animated.View style={[animatedStyle2, styles(theme).thumb]}>
            <Animated.View style={[opacityStyle2, styles(theme).label]}>
              <AnimatedTextInput
                style={styles(theme).labelText}
                animatedProps={maxLabelProps}
                editable={false}
                defaultValue={`${startMax}`}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles(theme).rangeRow}>
        <Text style={styles(theme).rangeText}>{min}</Text>
        <AnimatedTextInput
          style={styles(theme).rangeText}
          animatedProps={centerTextProps}
          editable={false}
          defaultValue={`${startMin} - ${startMax}`}
        />
        <Text style={styles(theme).rangeText}>{max}</Text>
      </View>
    </View>
  );
};

export default CustomRangeSlider;

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
      backgroundColor: theme?.colors?.primary
        ? `${theme.colors.primary}50`
        : theme.colors.floorBgColor,
      borderRadius: 20,
    },
    sliderFront: {
      height: 8,
      backgroundColor: theme?.colors?.primary,
      borderRadius: 20,
      position: 'absolute',
    },
    thumb: {
      left: -10,
      width: 20,
      height: 20,
      position: 'absolute',
      backgroundColor: 'white',
      borderColor: theme?.colors?.primary,
      borderWidth: 5,
      borderRadius: 10,
    },
    label: {
      position: 'absolute',
      top: -40,
      bottom: 20,
      backgroundColor: 'black',
      borderRadius: 5,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelText: {
      color: 'white',
      padding: 5,
      fontWeight: 'bold',
      fontSize: 16,
      width: '100%',
      marginHorizontal: 2,
      textAlign: 'center',
    },
    rangeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
    },
    rangeText: {
      fontWeight: '400',
      fontSize: 14,
      color: theme?.colors?.placeholder,
    },
  });
