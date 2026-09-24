import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Images } from '@assets/index';
import { useThemeContext } from '@theme/ThemeProvider';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useAuthStore, useHydratedAuth } from '@store/authStore';
import style from './SplashScreen.styles';

const SplashScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const token = useAuthStore(state => state.token);
  const onBoarded = useAuthStore(state => state.onBoarded);
  const { userDetailsUpdate } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        if (onBoarded) {
          if (token != null && token != undefined && token != '') {
            if (userDetailsUpdate) {
              navigation.replace(SCREEN_NAMES.NEW_USER_FORM);
            } else {
              navigation.replace(SCREEN_NAMES.BOTTOM_TABS);
            }
          } else {
            navigation.replace(SCREEN_NAMES.LOGIN_SCREEN);
          }
        } else {
          navigation.replace(SCREEN_NAMES.ONBOARDING_SCREEN);
        }
      }, 1000);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Images.SplashIcon}
        style={{
          opacity: fadeAnim,
          height: 80,
          transform: [{ scale: scaleAnim }],
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
