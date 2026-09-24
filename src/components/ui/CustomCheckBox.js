import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { fontScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const CustomCheckBox = ({ label, value = false, onChange }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onChange?.(!value)}
      style={styles.container}
    >
      <CheckBox
        value={value}
        onValueChange={e => onChange?.(e)}
        onChange={e => onChange?.(e)}
        boxType="square"
        onFillColor={theme.colors.primary}
        onCheckColor="#fff"
        uncheckedColor="#aaa"
        tintColors={{
          true: theme.colors.primary,
        }}
        tintColor={theme.colors.primary}
        onTintColor={theme.colors.primary}
        disabled={true}
        style={{
          width: 20,
          height: 20,
          borderColor: theme.colors.border,
        }}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;

const style = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 10,
    },
    label: {
      fontSize: fontScale(14),
      color: theme.colors.text,
      flexWrap: 'wrap',
      width: '90%',
    },
  });
