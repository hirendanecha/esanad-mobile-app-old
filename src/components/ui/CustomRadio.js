import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CustomRadio = ({ options, onSelect, value }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const [selected, setSelected] = useState(0);

  const handlePress = index => {
    setSelected(index);
    if (onSelect) {
      onSelect(options[index]);
    }
  };

  useEffect(() => {
    if (value) {
      const index = options.findIndex(item => item.value === value);
      if (index >= 0) setSelected(index);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.radioWrapper,
            selected === index ? styles.radioActive : styles.radioInactive,
            { flex: 1 / options.length },
          ]}
          onPress={() => handlePress(index)}
          activeOpacity={0.8}
        >
          <Text
            style={
              selected === index ? styles.labelActive : styles.labelInactive
            }
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomRadio;

const style = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      overflow: 'hidden',
      gap: verticalScale(15),
    },
    radioWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: verticalScale(7),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      height: verticalScale(40),
    },
    radioActive: {
      borderColor: theme.colors.primary,
    },
    radioInactive: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    labelActive: {
      fontSize: verticalScale(16),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
    labelInactive: {
      fontSize: verticalScale(16),
      color: theme.colors.description,
      fontFamily: 'Lato-Bold',
    },
  });
