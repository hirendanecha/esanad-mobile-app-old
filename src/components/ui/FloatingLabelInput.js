import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Text,
  Platform,
  Easing,
} from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  multiline = false,
  style,
  error,
  placeholder,
  disabled,
  showErrorMessage = false,
  maxLength,
  autoCapitalize = 'none',
  numberOfLines = 3,
  customStyle,
  secureTextEntry = false,
  keyboardType = 'default',
}) => {
  const { theme } = useThemeContext();
  const styles = styless(theme);
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, value, error]);

  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? verticalScale(40) : verticalScale(15),
    maxWidth: '90%',
    transform: leftIcon && [
      {
        translateX: animatedLabel.interpolate({
          inputRange: [0, 1],
          outputRange: [verticalScale(0), verticalScale(-20)],
        }),
      },
    ],

    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [
        theme.colors.textTertiary,
        error ? theme.colors.red : theme.colors.primary,
      ],
    }),

    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [verticalScale(15), verticalScale(-8)],
    }),

    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [verticalScale(14), verticalScale(12)],
    }),

    // color: error
    //   ? theme.colors.red
    //   : isFocused || value
    //   ? theme.colors.primary
    //   : theme.colors.textTertiary,

    backgroundColor: disabled
      ? theme.colors.bgSecondary
      : theme.colors.backgroundColor,
    paddingHorizontal: verticalScale(4),
    borderRadius: verticalScale(10),
    fontFamily: 'Lato-Regular',
  };

  return (
    <View style={[style]}>
      <View
        style={[
          styles.container,
          {
            borderColor: error
              ? theme.colors.red
              : isFocused
              ? theme.colors.primary
              : theme.colors.border,
            backgroundColor: disabled
              ? theme.colors.bgSecondary
              : theme.colors.backgroundColor,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <Animated.Text
          style={labelStyle}
          numberOfLines={1}
          pointerEvents={'box-none'}
        >
          {label}
        </Animated.Text>

        <TextInput
          style={[
            styles.input,
            {
              paddingLeft: leftIcon ? verticalScale(40) : verticalScale(15),
              paddingRight: rightIcon ? verticalScale(35) : verticalScale(15),
              minHeight: multiline ? verticalScale(70) : verticalScale(50),
            },
            customStyle,
          ]}
          value={value}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={theme.colors.placeholder}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          editable={!disabled}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {showErrorMessage && error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styless = theme =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      height: verticalScale(50),
      backgroundColor: theme.colors.backgroundColor,
    },
    input: {
      flex: 1,
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      height: '100%',
    },
    iconLeft: {
      position: 'absolute',
      top: verticalScale(16),
      left: verticalScale(15),
    },
    iconRight: {
      position: 'absolute',
      top: verticalScale(14),
      right: verticalScale(16),
    },
    errorText: {
      color: theme.colors.red,
      fontSize: verticalScale(12),
      marginTop: verticalScale(4),
      marginLeft: verticalScale(4),
    },
  });

export default FloatingLabelInput;
