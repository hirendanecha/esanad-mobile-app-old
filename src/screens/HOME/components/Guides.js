import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';

const Guides = () => {
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  return (
    <LinearGradient
      colors={theme.colors.contactBanner}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      useAngle
      angle={140}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Looking for the help Step-by-Step Guides
        </Text>
        <View style={styles.descriptionBlock}>
          <Text style={styles.subtitle}>Health Insurance Claims</Text>
          <Text style={styles.description}>
            Got questions regarding For Motor, Health, Travel & Term Insurance
            claim related queries
          </Text>
        </View>
        <View style={styles.contactCard}>
          <View style={styles.iconWrapper}>
            <Image
              source={Images.support}
              resizeMode="contain"
              style={styles.icon}
            />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.phone}>600 500 888</Text>
            <Text style={styles.timing}>
              Working hours: 8 AM - 11 PM GST (Mon-Sun)
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Guides;

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
      gap: verticalScale(15),
    },
    title: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    descriptionBlock: {
      gap: verticalScale(6),
    },
    subtitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
    },
    description: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    contactCard: {
      flexDirection: 'row',
      gap: verticalScale(10),
      padding: verticalScale(10),
      borderRadius: verticalScale(7),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.highlight,
      alignItems: 'center',
    },
    iconWrapper: {
      padding: verticalScale(10),
      borderRadius: verticalScale(7),
      backgroundColor: theme.colors.highlight,
    },
    icon: {
      width: verticalScale(40),
      height: verticalScale(40),
    },
    contactInfo: {
      gap: verticalScale(5),
      flex: 1,
    },
    phone: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    timing: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      width: '80%',
    },
  });
