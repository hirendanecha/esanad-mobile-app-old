import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const OrDivider = ({ simple, text }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <View style={styles.container}>
      <View style={styles.lineHeight} />
      {!simple && (
        <Text style={[styles.text, { marginHorizontal: verticalScale(10) }]}>
          {text ? text : 'Or Log in with'}
        </Text>
      )}
      <View style={styles.lineHeight} />
    </View>
  );
};

export default OrDivider;

const style = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    lineHeight: {
      height: 1,
      backgroundColor: theme.colors.border,
      flex: 1,
    },
    text: {
      color: theme.colors.description,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
    },
  });
