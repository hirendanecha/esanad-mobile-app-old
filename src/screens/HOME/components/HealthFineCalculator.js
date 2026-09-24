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
import LottieView from 'lottie-react-native';
import { Animations } from '@assets/index';
import Calculator from '@assets/icons/Calculator';

const HealthFineCalculator = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        borderRadius: verticalScale(15),
        width: (Dimensions.get('screen').width - 60) / 2,
        alignSelf: 'center',
        height: verticalScale(120),
        marginTop: verticalScale(20),
        backgroundColor: theme.colors.backgroundColor,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(10),
      }}
      onPress={() => navigation.navigate(SCREEN_NAMES.FINE_CAL)}
    >
      <View
        style={{
          height: verticalScale(45),
          width: verticalScale(45),
        }}
      >
        <Calculator />
      </View>

      <Text
        style={{
          fontSize: verticalScale(12),
          fontFamily: 'Lato-Bold',
          color: theme.colors.text,
          textAlign: 'center',
        }}
      >
        Fine Calculator Health{'\n'}Insurance
      </Text>
    </TouchableOpacity>
  );
};

export default HealthFineCalculator;

const styles = StyleSheet.create({});
