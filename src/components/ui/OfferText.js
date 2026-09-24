import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Images } from '@assets/index';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const OfferText = ({ text }) => {
  const { theme } = useThemeContext();
  return (
    <Text
      style={{
        fontSize: verticalScale(10),
        fontFamily: 'Lato-Bold',
        textAlign: 'center',
        paddingHorizontal: verticalScale(5),
        paddingVertical: verticalScale(3),
        borderRadius: verticalScale(10),
        position: 'absolute',
        top: verticalScale(5),
        right: verticalScale(5),
        zIndex: 1,
        color: theme.colors.text,
        backgroundColor: theme.colors.highlight,
      }}
    >
      {text}
    </Text>
  );
};

export default OfferText;

const styles = StyleSheet.create({});
