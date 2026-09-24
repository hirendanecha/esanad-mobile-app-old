import React from 'react';
import { Animations } from '@assets/index';
import { View, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import LottieView from 'lottie-react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { Text } from 'react-native';

export default function NoData() {
  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <View style={styles.backdrop}>
      <LottieView
        source={Animations.no_data}
        style={styles.loaderContainer}
        autoPlay
        loop
        resizeMode="contain"
      />
      <Text style={styles.noDataText}>No Data Found</Text>
    </View>
  );
}

const style = theme =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loaderContainer: {
      width: verticalScale(250),
      height: verticalScale(160),
    },
    noDataText: {
      color: theme.colors.description,
      fontWeight: 'bold',
      fontSize: moderateScale(14),
      fontFamily: 'Inter',
    },
  });
