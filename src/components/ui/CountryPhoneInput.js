import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const validateUAEPhone = phone => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const mobile = /^5[0-9]{8}$/;
  const landline = /^[234679][0-9]{6,7}$/;

  return {
    isValid: mobile.test(cleanPhone) || landline.test(cleanPhone),
    isMobile: mobile.test(cleanPhone),
    isLandline: landline.test(cleanPhone),
    cleanPhone,
  };
};

const COUNTRY_INFO = {
  dial_code: '+971',
  code: 'AE',
  name: 'United Arab Emirates',
};

const CountryPhoneInput = ({
  value = '',
  onChange,
  maxLength = 9,
  errors: externalErrors,
}) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const [phone, setPhone] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState('');

  useEffect(() => setPhone(value), [value]);

  const emitChange = numeric => {
    const validation = validateUAEPhone(numeric);
    onChange?.({
      phone: numeric,
      country: COUNTRY_INFO,
      ...validation,
      fullNumber: numeric ? `${COUNTRY_INFO.dial_code}${numeric}` : '',
    });
  };

  const handlePhoneChange = text => {
    const numeric = text.replace(/[^0-9]/g, '');
    setPhone(numeric);
    setInternalError('');
    emitChange(numeric);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (!phone) return;

    const { isValid } = validateUAEPhone(phone);

    if (isValid) return;

    if (phone.length < 7) return setInternalError('Phone number is too short');
    if (phone.length > 9) return setInternalError('Phone number is too long');
    if (phone.length === 9 && !phone.startsWith('5'))
      return setInternalError('Mobile number must start with 5');

    setInternalError('Invalid UAE phone number');
  };

  const displayError = externalErrors || internalError;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Phone Number</Text>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused
              ? theme.colors.primary
              : displayError
              ? theme.colors.red
              : theme.colors.border,
          },
        ]}
      >
        <Image
          source={require('@assets/images/UAE.png')}
          resizeMode="contain"
          style={styles.flag}
        />

        <View style={styles.divider} />

        <Text style={styles.prefix}>+971</Text>

        <TextInput
          style={styles.textInput}
          keyboardType="phone-pad"
          placeholder="5XXXXXXXX"
          placeholderTextColor={theme.colors.description}
          value={phone}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChangeText={handlePhoneChange}
        />
      </View>

      {displayError && (
        <View style={styles.errorRow}>
          <Icon name="info" size={15} color={theme.colors.red} />
          <Text style={[styles.errorText, { color: theme.colors.red }]}>
            {displayError}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    label: {
      marginBottom: -6,
      marginLeft: 12,
      zIndex: 1,
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      backgroundColor: theme.colors.backgroundColor,
      paddingHorizontal: 4,
      color: theme.colors.primary,
      alignSelf: 'flex-start',
      borderRadius: verticalScale(10),
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: verticalScale(50),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      paddingHorizontal: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      gap: verticalScale(10),
    },
    flag: {
      width: verticalScale(27),
      height: verticalScale(20),
    },
    divider: {
      width: verticalScale(1),
      height: verticalScale(20),
      backgroundColor: theme.colors.border,
    },
    prefix: {
      fontSize: verticalScale(16),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
    },
    textInput: {
      flex: 1,
      fontSize: verticalScale(16),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      height: '100%',
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    errorText: {
      marginLeft: 5,
      fontSize: 13,
      fontFamily: 'Lato-Regular',
    },
  });

export default CountryPhoneInput;
