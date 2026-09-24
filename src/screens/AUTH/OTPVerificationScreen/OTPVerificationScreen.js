// OTPVerificationScreen.jsx
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import style from './OTPVerificationScreen.styles';
import FastImage from 'react-native-fast-image';

import { useUserStore } from '@store/userStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';
import { useResendOTP } from '@hooks/auth/useResendOTP';
import { useOTPVerify } from '@hooks/auth/useOTPVerify';

import WraperComponent from '@components/ui/WraperComponent';
import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import CustomButton from '@components/ui/CustomButton';
import CustomOTPInput from '@components/ui/CustomOTPInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { verticalScale } from '@constants/metrics';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { mutate: verifyOtp, isPending } = useOTPVerify();
  const { mutate: resendOtp } = useResendOTP();
  const { contactNumber } = useUserStore();
  const { theme } = useThemeContext();
  const styles = style(theme);
  const [otp, setOtp] = React.useState('');

  const insets = useSafeAreaInsets();

  const onSubmit = async () => {
    const payload = {
      ref: route.params?.ref,
      countryCode: route.params?.countryCode,
      mobileNumber: contactNumber,
      otp: otp,
      product: 'Motor',
    };
    verifyOtp(payload);
  };

  const handleResendOtp = async () => {
    const payload = {
      mobileNumber: contactNumber,
      countryCode: route.params?.countryCode,
    };
    resendOtp(payload);
  };

  return (
    <WrapKeyboardAwareScrollView>
      <LinearGradient
        colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 2 }}
        locations={[0.1, 0.2]}
        style={{
          flex: 1,
        }}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <FastImage
            source={Images.Logo}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.logo}
          />

          <Text style={styles.title}>Verify OTP</Text>

          <Text style={styles.infoText}>
            Enter the 6-digit that we have sent via the{'\n'}
            mobile number {''}
            <Text style={styles.infoHighlight}>
              +{route.params?.countryCode} {route.params?.mobileNumber}
            </Text>
            .
          </Text>

          <CustomOTPInput length={6} value={otp} onChange={setOtp} />

          <CustomButton
            title="Verify OTP"
            onPress={onSubmit}
            isLoading={isPending}
            disabled={otp.length < 6 || isPending}
            isShowIcon
            buttonStyle={[
              styles.submitButton,
              {
                backgroundColor:
                  otp.length < 6
                    ? theme.colors.secondary
                    : theme.colors.primary,
                marginVertical: verticalScale(20),
              },
            ]}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>If you didn't receive code!</Text>

            <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.8}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </WrapKeyboardAwareScrollView>
  );
};

export default OTPVerificationScreen;
