import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useNavigation } from '@react-navigation/native';
import Calculator from '@assets/svg/Calculator';
import LottieView from 'lottie-react-native';
import { Animations } from '@assets/index';
import BreakDown from '@assets/icons/BreakDown';

const RSABtn = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        borderRadius: verticalScale(15),
        width: (Dimensions.get('screen').width - 60) / 2,
        height: verticalScale(120),
        marginTop: verticalScale(20),
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => navigation.navigate(SCREEN_NAMES.RSA_SCREEN)}
    >
      <Text
        style={{
          fontSize: verticalScale(50),
          fontFamily: 'Lato-Black',
          color: theme.colors.text,
          textTransform: 'uppercase',
          position: 'absolute',
          opacity: 0.05,
          lineHeight: verticalScale(55),
          letterSpacing: verticalScale(0),
        }}
      >
        Break{'\n'}down
      </Text>
      <View
        style={{
          height: verticalScale(90),
          width: verticalScale(90),
        }}
      >
        <BreakDown />
      </View>
    </TouchableOpacity>
  );
};

export default RSABtn;

const styles = StyleSheet.create({});
