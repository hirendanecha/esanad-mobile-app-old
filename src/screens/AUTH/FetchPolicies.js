import React, { useCallback } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { useThemeContext } from '@theme/ThemeProvider';
import { useFetchPolicies, useLogin } from '@hooks/auth/useLogIn';
import { Images } from '@assets/index';
import { useUserStore } from '@store/userStore';

import CustomButton from '@components/ui/CustomButton';
import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';

import { verticalScale } from '@constants/metrics';
import { SCREEN_NAMES } from '@constants/screenNames';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';

const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Emirates ID is required',
  EMIRATES_ID_INVALID: 'Please enter a valid Emirates ID',
  MUST_START_WITH_784: 'Emirates ID must start with 784',
};

const validateEmiratesId = value => {
  if (!value) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!value.startsWith('784')) {
    return ERROR_MESSAGES.MUST_START_WITH_784;
  }

  const regex = /^\d{3}-\d{4}-\d{7}-\d{1}$|^\d{15}$/;
  if (!regex.test(value)) {
    return ERROR_MESSAGES.EMIRATES_ID_INVALID;
  }

  return true;
};

const maskEmiratesId = value => {
  let digits = value.replace(/\D/g, '');

  // If user is typing and it doesn't start with 7, 78, or 784, we can help them
  // or just let validation handle it. But to be strict:
  if (
    digits.length > 0 &&
    !'784'.startsWith(digits.substring(0, Math.min(digits.length, 3)))
  ) {
    // Optional: could force it to be 784, but better to let user see their mistake
  }

  let masked = '';
  if (digits.length > 0) {
    masked += digits.substring(0, 3);
  }
  if (digits.length > 3) {
    masked += '-' + digits.substring(3, 7);
  }
  if (digits.length > 7) {
    masked += '-' + digits.substring(7, 14);
  }
  if (digits.length > 14) {
    masked += '-' + digits.substring(14, 15);
  }

  return masked;
};

const FetchPolicies = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const { mutate: fetchPolicies } = useFetchPolicies();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      emiratesId: '',
    },
    mode: 'onChange',
  });

  const onSubmit = data => {
    const payload = {
      eid: data.emiratesId,
    };

    fetchPolicies(payload);
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Fetch Policy" onBack={() => navigation.goBack()} />
      <WrapKeyboardAwareScrollView>
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {/* <ImageBackground
          source={Images.circleBg}
          resizeMode="contain"
          style={styles.circleBg}
        /> */}

          <View style={styles.wrapper}>
            <Image
              source={Images.fetch}
              resizeMode="contain"
              style={styles.headerImage}
            />

            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Locate Your Policy Using EID</Text>
              <Text style={styles.subtitle}>
                Enter your Emirates ID to link your existing insurance policy
                and start managing it directly within the app.
              </Text>
            </View>

            <Controller
              control={control}
              name="emiratesId"
              rules={{
                validate: validateEmiratesId,
              }}
              render={({ field: { value, onChange } }) => (
                <FloatingLabelInput
                  label="Emirates ID"
                  value={value}
                  onChangeText={text => onChange(maskEmiratesId(text))}
                  error={errors.emiratesId?.message}
                  placeholder="784-XXXX-XXXXXXX-X"
                  maxLength={18}
                  keyboardType="numeric"
                  showErrorMessage={errors.emiratesId?.message}
                />
              )}
            />

            <CustomButton
              title="Link Policy"
              onPress={handleSubmit(onSubmit)}
              isShowIcon
              disabled={!isValid}
              buttonStyle={styles.submitButton}
            />
          </View>
        </ScrollView>
      </WrapKeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default FetchPolicies;

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    wrapper: {
      flex: 1,
      padding: verticalScale(20),
      justifyContent: 'center',
      gap: verticalScale(20),
    },
    headerTextContainer: {
      gap: verticalScale(10),
      marginBottom: verticalScale(20),
    },
    title: {
      fontSize: verticalScale(20),
      textAlign: 'center',
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: verticalScale(14),
      textAlign: 'center',
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      marginHorizontal: verticalScale(35),
    },
    headerImage: {
      width: '100%',
      height: verticalScale(230),
      alignSelf: 'center',
    },
    circleBg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      marginTop: -verticalScale(320),
    },
    submitButton: {
      height: verticalScale(50),
    },
  });
