import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import { useAuthStore } from '@store/authStore';
import { Images } from '@assets/index';
import { useAvailOffers } from '@hooks/profile/useProfile';

import CodeInput from './CodeInput';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const AvilModalOtp = ({ handleClose, isInput, currentOffer }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const { user } = useAuthStore();
  const { mutate: availOffer } = useAvailOffers();

  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleCodeSubmit = useCallback(() => {
    if (!currentOffer?._id || code.length !== 4) return;

    availOffer(
      {
        id: currentOffer._id,
        data: { discountCode: code },
      },
      {
        onSuccess: () => {
          setCode('');
          handleClose();
        },
        onError: err => {
          console.error(err);
          setCode('');
          setIsValid(false);
        },
      },
    );
  }, [code, currentOffer, availOffer, handleClose]);

  useEffect(() => {
    handleCodeSubmit();
  }, [code, handleCodeSubmit]);

  // Reset state when offer changes / modal opens
  useEffect(() => {
    setCode('');
    setIsValid(true);
  }, [currentOffer]);

  const discountLabel =
    currentOffer?.discountType === 'percentage'
      ? `${currentOffer?.discountValue}% OFF`
      : `${currentOffer?.discountValue} AED OFF`;

  return (
    <View style={styles.overlay}>
      <ImageBackground
        source={Images.avail}
        resizeMode="contain"
        style={styles.modalContainer}
      >
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Icon
            name="close"
            size={moderateScale(24)}
            color={theme.colors.backgroundColor}
          />
        </Pressable>

        <View style={styles.content}>
          <View style={styles.mainContent}>
            {isInput && currentOffer && (
              <Text style={styles.companyName}>
                {currentOffer?.partner?.companyName}{' '}
                <Text style={styles.discountText}>({discountLabel})</Text>
              </Text>
            )}

            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>

            {isInput && (
              <View style={styles.codeInputContainer}>
                <CodeInput
                  value={code}
                  onChangeText={setCode}
                  isValid={isValid}
                  setIsValid={setIsValid}
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AvilModalOtp;

const getStyles = theme =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
      position: 'absolute',
      inset: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContainer: {
      height: SCREEN_WIDTH * 0.72,
      width: SCREEN_WIDTH * 0.95,
    },
    content: {
      flex: 1,
      padding: verticalScale(20),
      justifyContent: 'center',
    },
    mainContent: {
      // alignItems: 'center',
      gap: verticalScale(12),
    },
    companyName: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    discountText: {
      color: theme.colors.highlight,
    },
    userName: {
      fontSize: moderateScale(24),
      fontFamily: 'Lato-Bold',
      color: theme.colors.highlight,
      textTransform: 'uppercase',
    },
    codeInputContainer: {
      marginTop: verticalScale(20),
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: verticalScale(10),
      right: verticalScale(10),
      zIndex: 1001,
    },
  });
