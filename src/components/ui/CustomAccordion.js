import { verticalScale } from '@constants/metrics';
import React, {
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '@theme/ThemeProvider';

export const CustomAccordion = React.forwardRef((props, ref) => {
  const { title, children, containerStyle } = props;
  const { theme } = useThemeContext();
  const styles = style(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const progress = useSharedValue(0);
  const height = useSharedValue(0);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });

    height.value = withTiming(isOpen ? contentHeight : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isOpen, progress, height, contentHeight]);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        if (!isOpen) {
          toggleOpen();
        }
      },
    }),
    [toggleOpen, isOpen],
  );

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.5, 1]),
    };
  });

  const onLayout = event => {
    const measuredHeight = event.nativeEvent.layout.height;
    if (measuredHeight > 0 && contentHeight !== measuredHeight) {
      setContentHeight(measuredHeight);
      // Update height immediately if accordion is open
      if (isOpen) {
        height.value = measuredHeight;
      }
    }
  };

  return (
    <View
      style={[
        styles.accordionSection,
        { backgroundColor: theme.colors.backgroundColor },
        containerStyle,
      ]}
    >
      <TouchableWithoutFeedback
        onPress={toggleOpen}
        accessibilityRole="button"
        accessibilityLabel="Toggle Accordion"
      >
        <View
          style={[
            styles.accordionTitle,
            { flexDirection: 'row', justifyContent: 'space-between' },
          ]}
        >
          <Text style={[styles.accordionHeader, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Animated.View style={iconAnimatedStyle}>
            <Ionicons name="chevron-down" size={20} color={theme.colors.text} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.accordionContent, contentAnimatedStyle]}>
        <View onLayout={onLayout} style={{ position: 'absolute', opacity: 0 }}>
          {children}
        </View>
        {isOpen && <View>{children}</View>}
      </Animated.View>
    </View>
  );
});

const style = theme =>
  StyleSheet.create({
    accordionSection: {
      // borderRadius: verticalScale(10),
      // borderWidth: 1,
      // borderColor: theme.colors.border,
    },
    accordionTitle: {
      paddingHorizontal: verticalScale(10),
      paddingVertical: verticalScale(15),
    },
    accordionContent: {
      overflow: 'hidden',
    },
    accordionHeader: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      width: '90%',
    },
  });
