import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const { width } = Dimensions.get('window');

const CustomOTPInput = ({ length = 6, onChange, onComplete }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const [values, setValues] = useState(Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
  const boxSize = useMemo(() => verticalScale(width / length - 16), [length]);

  useEffect(() => {
    refs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const code = useMemo(() => values.join(''), [values]);

  const setAndNotify = nextValues => {
    setValues(nextValues);
    const nextCode = nextValues.join('');
    onChange?.(nextCode);
    if (nextValues.every(v => v !== '')) onComplete?.(nextCode);
  };

  const handleChange = (text, index) => {
    const digits = (text || '').replace(/\D/g, '');

    if (digits.length > 1) {
      const next = [...values];
      let i = index;
      for (const ch of digits) {
        if (i >= length) break;
        next[i] = ch;
        i += 1;
      }
      setAndNotify(next);
      setActiveIndex(clamp(index + digits.length, 0, length - 1));
      return;
    }

    const ch = digits;
    const next = [...values];
    next[index] = ch;
    setAndNotify(next);

    if (ch && index < length - 1) setActiveIndex(index + 1);
  };

  const handleKeyPress = (e, index) => {
    const key = e?.nativeEvent?.key;

    if (key === 'Backspace') {
      if (values[index] !== '') {
        const next = [...values];
        next[index] = '';
        setAndNotify(next);
        return;
      }
      if (index > 0) {
        const prev = index - 1;
        const next = [...values];
        next[prev] = '';
        setAndNotify(next);
        setActiveIndex(prev);
      }
    }
  };

  const guardFocus = index => {
    if (index !== activeIndex) {
      refs.current[activeIndex]?.focus();
    }
  };

  return (
    <View style={[styles.row, { gap: verticalScale(10) }]}>
      {values.map((val, i) => {
        const isActive = i === activeIndex;
        return (
          <TextInput
            key={i}
            ref={r => (refs.current[i] = r)}
            value={val}
            autoFocus
            onChangeText={t => handleChange(t, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            onFocus={() => guardFocus(i)}
            keyboardType={Platform.select({
              ios: 'number-pad',
              android: 'number-pad',
            })}
            inputMode="numeric"
            maxLength={1}
            returnKeyType="done"
            style={[
              styles.box,
              {
                width: boxSize,
                height: boxSize,
                borderColor: isActive
                  ? theme.colors.primary
                  : theme.colors.border,
                backgroundColor: theme.colors.backgroundColor,
                color: theme.colors.text,
                fontSize: verticalScale(20),
                fontFamily: 'Lato-Bold',
                borderWidth: 1,
              },
            ]}
            placeholder=""
            placeholderTextColor={theme.colors.description}
            selectionColor={theme.colors.primary}
          />
        );
      })}
    </View>
  );
};

const style = theme =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center',
    },
    box: {
      borderWidth: 1,
      borderRadius: verticalScale(8),
      fontSize: verticalScale(18),
      padding: 0,
      includeFontPadding: false,
      textAlignVertical: 'center',
      textAlign: 'center',
    },
  });

export default CustomOTPInput;
