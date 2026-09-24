import React, { useCallback } from 'react';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { useThemeContext } from '@theme/ThemeProvider';
import { useLogin } from '@hooks/auth/useLogIn';
import { Images } from '@assets/index';
import { useUserStore } from '@store/userStore';

import OrDivider from '@components/ui/OrDivider';
import CustomButton from '@components/ui/CustomButton';
import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import SocialButton from '@components/ui/SocialButton';

import { verticalScale } from '@constants/metrics';
import { style } from './LogInScreen.styles';

const LogInScreen = () => {
  const { theme } = useThemeContext();
  const { updateContactNumber } = useUserStore();
  const { mutate: login, isPending } = useLogin();
  const styles = style(theme);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      country: null,
    },
  });

  const onSubmit = useCallback(
    data => {
      const payload = {
        countryCode: data.country?.dial_code.replace('+', ''),
        mobileNumber: data.phone?.phone,
      };
      updateContactNumber(data.phone?.phone);
      login(payload);
    },
    [login, updateContactNumber],
  );

  return (
    <WrapKeyboardAwareScrollView>
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <ImageBackground
          source={Images.circleBg}
          resizeMode="contain"
          style={styles.circleBg}
        />

        <View style={styles.wrapper}>
          <Image
            source={Images.loginBG}
            resizeMode="contain"
            style={styles.headerImage}
          />

          <View style={{ gap: verticalScale(10) }}>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>
              We’ll send you a code to verify your account
            </Text>
          </View>

          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Mobile number is required',
              maxLength: { value: 9, message: 'Max 9 digits allowed' },
              minLength: { value: 9, message: 'At least 9 digits' },
              validate: value =>
                value?.isValid || 'Please enter a valid mobile number',
            }}
            render={({ field: { value } }) => (
              <CountryPhoneInput
                value={value?.phone || ''}
                maxLength={9}
                onChange={({ country, phone, isValid }) => {
                  setValue(
                    'phone',
                    { phone, isValid },
                    { shouldValidate: true },
                  );
                  setValue('country', country);
                }}
                errors={errors.phone?.message}
              />
            )}
          />

          <CustomButton
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            isLoading={isPending}
            isShowIcon
            buttonStyle={{ height: verticalScale(50) }}
          />

          {/* <OrDivider /> */}

          <View style={styles.socialRow}>
            {/* <SocialButton icon={Images.Google} /> */}
            {/* <SocialButton icon={Images.pass} /> */}
            {/* <SocialButton icon={Images.facebook454} /> */}
          </View>
        </View>
      </ScrollView>
    </WrapKeyboardAwareScrollView>
  );
};

export default LogInScreen;
