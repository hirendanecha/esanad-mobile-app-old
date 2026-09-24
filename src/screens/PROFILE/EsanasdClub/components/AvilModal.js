import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
  Platform,
} from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import { useAuthStore } from '@store/authStore';
import { Images } from '@assets/index';
import CodeInput from './CodeInput';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAvailOffers } from '@hooks/profile/useProfile';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const AvilModal = ({ handleClose, isInput, currentOffer }) => {
  const { theme } = useThemeContext();
  const { user } = useAuthStore();
  const styles = getStyles(theme);
  const [valueCode, setValueCode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { mutate: availOffer } = useAvailOffers();

  const handleCodeSubmit = async () => {
    if (!currentOffer?._id) return;

    const payload = {
      discountCode: valueCode,
    };

    availOffer(
      { id: currentOffer._id, data: payload },
      {
        onSuccess: res => {
          setValueCode('');
          handleClose();
        },
        onError: err => {
          console.error(err);
          setValueCode('');
          setIsValid(false);
        },
      },
    );
  };

  useEffect(() => {
    if (valueCode?.length === 4) {
      handleCodeSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueCode]);

  // Reset state when modal opens
  useEffect(() => {
    setValueCode('');
    setIsValid(true);
  }, [currentOffer]);

  const renderOfferInfo = () => {
    if (!isInput || !currentOffer) return null;

    const discountText =
      currentOffer?.discountType === 'percentage'
        ? `${currentOffer?.discountValue}% OFF`
        : `${currentOffer?.discountValue} AED OFF`;

    return (
      <View>
        <Text style={styles.companyName}>
          {currentOffer?.partner?.companyName}{' '}
          <Text style={styles.discountText}>({discountText})</Text>
        </Text>
      </View>
    );
  };

  const renderCodeInput = () => {
    if (!isInput) return null;

    return (
      <View style={styles.codeInputContainer}>
        <CodeInput
          value={valueCode}
          onChangeText={setValueCode}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <ImageBackground
        source={Images.card}
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
            {renderOfferInfo()}
            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
            {renderCodeInput()}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AvilModal;

const getStyles = theme =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContainer: {
      height: '100%',
      width: SCREEN_WIDTH - 40,
    },
    content: {
      flex: 1,
      padding: verticalScale(20),
      justifyContent: 'space-between',
    },
    logo: {
      width: '40%',
      height: verticalScale(50),
    },
    mainContent: {
      flex: 1,
      justifyContent: 'space-around',
    },
    companyName: {
      fontSize: moderateScale(18),
      fontWeight: '600',
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
      alignItems: 'center',
    },
    footerContainer: {
      alignItems: 'center',
    },
    footerTitle: {
      fontSize: moderateScale(18),
      color: theme.colors.textSecondary,
      marginBottom: verticalScale(8),
    },
    footerSubtitle: {
      fontSize: moderateScale(16),
      color: theme.colors.textSecondary,
    },
    closeButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
      right: verticalScale(10),
      zIndex: 1001,
    },
  });
