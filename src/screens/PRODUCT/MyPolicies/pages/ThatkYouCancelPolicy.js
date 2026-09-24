import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import { Animations } from '@assets/index';
import CustomButton from '@components/ui/CustomButton';
import { SCREEN_NAMES } from '@constants/screenNames';

const { width } = Dimensions.get('window');

const ThatkYouCancelPolicy = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const styles = style(theme);

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.animationContainer}>
        <LottieView
          source={Animations.success}
          autoPlay
          loop={false}
          style={styles.lottie}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Thank you!{`\n`}
        Cancellation Request Submitted
      </Text>
      <Text style={[styles.description, { color: theme.colors.description }]}>
        Thank you. Your policy cancellation request has been successfully
        submitted. Our team will review it and update you shortly.
      </Text>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Close"
          type="secondary"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.halfButton}
        />
        <CustomButton
          title="My Policies"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: SCREEN_NAMES.PRODUCTS_SCREEN }],
            })
          }
          buttonStyle={styles.halfButton}
        />
      </View>
    </LinearGradient>
  );
};

const style = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(20),
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    animationContainer: {
      width: width * 0.6,
      height: width * 0.6,
    },
    lottie: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      alignItems: 'center',
      paddingHorizontal: verticalScale(10),
    },
    title: {
      fontSize: verticalScale(28),
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    description: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
      color: theme.colors.textTertiary,
      paddingHorizontal: verticalScale(20),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: verticalScale(20),
      marginTop: verticalScale(20),
    },
    halfButton: {
      width: (Dimensions.get('screen').width - 60) / 2,
    },
  });

export default ThatkYouCancelPolicy;
