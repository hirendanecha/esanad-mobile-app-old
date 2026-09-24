import React from 'react';
import { Animations } from '@assets/index';
import { Modal, View, StyleSheet, Text } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import LottieView from 'lottie-react-native';
import { useThemeContext } from '@theme/ThemeProvider';

export default function LottieLoader({ manualVisible, type }) {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  if (!manualVisible) return null;

  return (
    manualVisible && (
      <View style={styles.backdrop}>
        {type == 'motor' && (
          <LottieView
            source={Animations.car}
            style={{ width: verticalScale(200), height: verticalScale(160) }}
            autoPlay
            resizeMode="cover"
            loop
          />
        )}
        {type === 'health' && (
          <LottieView
            source={Animations.health}
            style={{ width: verticalScale(200), height: verticalScale(160) }}
            autoPlay
            resizeMode="cover"
            loop
          />
        )}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>
            Sit back and relax.{'\n'}We're finding your data...
          </Text>
          <Text style={styles.subTitle}>This will only take a minute</Text>
        </View>
      </View>
    )
  );
}

const getStyles = theme =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    textWrapper: {
      marginLeft: 12,
      alignItems: 'center',
      gap: verticalScale(10),
    },
    title: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: moderateScale(20),
      fontFamily: 'Inter',
      textAlign: 'center',
    },
    subTitle: {
      color: theme.colors.description,
      fontWeight: '600',
      fontSize: moderateScale(14),
      fontFamily: 'Inter',
    },
  });
