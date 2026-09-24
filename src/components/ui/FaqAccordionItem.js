import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const FaqAccordionItem = ({ faq, isExpanded, onToggle }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const progress = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    progress.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, contentHeight]),
    opacity: progress.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.faqQuestionText}>{faq.question}</Text>
        <Animated.View style={iconStyle}>
          <Icon name="chevron-down" size={22} color={theme.colors.text} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[styles.faqAnswerContainer, animatedContainerStyle]}
      >
        <View
          style={styles.faqAnswer}
          onLayout={e => setContentHeight(e.nativeEvent.layout.height)}
        >
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default FaqAccordionItem;

const createStyles = theme =>
  StyleSheet.create({
    faqItem: {
      borderRadius: verticalScale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSecondary,
      overflow: 'hidden',
    },
    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: verticalScale(14),
    },
    faqQuestionText: {
      flex: 1,
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    faqAnswerContainer: {
      overflow: 'hidden',
    },
    faqAnswer: {
      paddingHorizontal: verticalScale(14),
      paddingBottom: verticalScale(16),
    },
    faqAnswerText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
  });
