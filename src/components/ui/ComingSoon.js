import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Images } from '@assets/index';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const ComingSoon = () => {
  const { theme } = useThemeContext();
  return (
    <Text
      style={{
        fontSize: verticalScale(10),
        fontFamily: 'Lato-Bold',
        textAlign: 'center',
        paddingHorizontal: verticalScale(5),
        paddingBottom: verticalScale(2),
        borderRadius: verticalScale(10),
        position: 'absolute',
        top: verticalScale(5),
        right: verticalScale(5),
        zIndex: 1,
        color: theme.colors.text,
        backgroundColor: theme.colors.highlight,
      }}
    >
      Coming Soon...
    </Text>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({});
