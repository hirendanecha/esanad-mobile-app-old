import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const CustomRadioGroup = ({
  options = [],
  selected,
  onChange,
  flexDirection = 'row',
  disabled = false,
}) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection,
          gap:
            flexDirection === 'column' ? verticalScale(8) : verticalScale(32),
        },
      ]}
    >
      {options.map(option => {
        const isSelected = selected === option.value;
        return (
          <TouchableOpacity
            disabled={disabled}
            key={option.value}
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => onChange(option)}
          >
            <View style={[styles.circle, isSelected && styles.circleSelected]}>
              {isSelected && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomRadioGroup;

const style = theme =>
  StyleSheet.create({
    container: {
      gap: verticalScale(32),
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    circle: {
      height: verticalScale(24),
      width: verticalScale(24),
      borderRadius: verticalScale(24),
      borderWidth: verticalScale(2),
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: verticalScale(8),
      backgroundColor: theme.colors.backgroundColor,
    },
    circleSelected: {
      borderColor: theme.colors.primary,
    },
    innerCircle: {
      height: verticalScale(12),
      width: verticalScale(12),
      borderRadius: verticalScale(12),
      backgroundColor: theme.colors.primary,
    },
    label: {
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(14),
    },
  });
