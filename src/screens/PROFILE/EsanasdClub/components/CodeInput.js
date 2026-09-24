import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';

const CodeInput = ({ onChangeText, isValid, setIsValid, autoFocus = true }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (!isValid) {
      setDigits(['', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      setIsValid(true);
    }
  }, [isValid, setIsValid]);

  useEffect(() => {
    const code = digits.join('');
    if (code.length === 4) {
      onChangeText(code);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const focusNext = (index, value) => {
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrevious = (index, key) => {
    if (key === 'Backspace' && index > 0 && !digits[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChangeText = (text, index) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = numericValue;
      setDigits(newDigits);

      if (numericValue && index < 3) {
        focusNext(index, numericValue);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newDigits = [...digits];

      if (!digits[index] && index > 0) {
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };

  return (
    <View style={styles.inputsContainer}>
      {[0, 1, 2, 3].map(index => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          style={[styles.input]}
          value={digits[index]}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={index === 0 && autoFocus}
        />
      ))}
    </View>
  );
};

export default CodeInput;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    inputsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: moderateScale(15),
      width: '100%',
      maxWidth: moderateScale(360),
      marginBottom: verticalScale(16),
    },
    input: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: moderateScale(5),
      textAlign: 'center',
      fontSize: moderateScale(24),
      fontWeight: '700',
      color: theme.colors.primary,
      backgroundColor: theme.colors.textSecondary,
      fontFamily: 'Lato-Bold',
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.backgroundColor,
      transform: [{ scale: 1.05 }],
    },
    inputDisabled: {
      backgroundColor: theme.colors.backgroundColor + '10',
      borderColor: theme.colors.primary + '10',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: moderateScale(20),
      marginTop: verticalScale(10),
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: verticalScale(12),
      paddingVertical: verticalScale(6),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: moderateScale(16),
    },
    actionText: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
      marginLeft: verticalScale(4),
      fontFamily: 'Lato',
    },
  });
