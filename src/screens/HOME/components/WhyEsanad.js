import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';

const FEATURES = [
  {
    id: 'claims',
    icon: Images.dirham,
    title: '25K Claims Assisted',
  },
  {
    id: 'support',
    icon: Images.phone,
    title: '24*7 Claim Assistance',
    description: '(10am to 7pm) excluding national holidays',
  },
  {
    id: 'paperless',
    icon: Images.doc,
    title: 'Paperless process',
  },
  {
    id: 'instant',
    icon: Images.shield,
    title: 'Instant Policy Issuance',
  },
];

const WhyEsanad = () => {
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  return (
    <LinearGradient
      colors={theme.colors.infoBanner}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      useAngle
      angle={140}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Why esanad Insurance?</Text>
        {FEATURES.map(item => (
          <FeatureItem
            key={item.id}
            item={item}
            styles={styles}
            theme={theme}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

export default WhyEsanad;

const FeatureItem = ({ item, styles, theme }) => (
  <View style={styles.featureRow}>
    <View style={styles.iconWrapper}>
      <Image source={item.icon} resizeMode="contain" style={styles.icon} />
    </View>
    <View style={styles.textBlock}>
      <Text style={styles.subtitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.timing}>{item.description}</Text>
      )}
    </View>
  </View>
);

const useStyles = theme =>
  StyleSheet.create({
    gradientContainer: {
      marginTop: verticalScale(20),
      marginHorizontal: verticalScale(20),
      borderRadius: verticalScale(7),
      borderWidth: 0.5,
      borderColor: theme.colors.border,
    },
    container: {
      padding: verticalScale(15),
      gap: verticalScale(10),
    },
    title: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    iconWrapper: {
      padding: verticalScale(8),
      borderRadius: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor,
    },
    icon: {
      width: verticalScale(14),
      height: verticalScale(14),
    },
    textBlock: {
      gap: verticalScale(5),
      flexShrink: 1,
    },
    subtitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
    },
    timing: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
  });
