import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Icon from 'react-native-vector-icons/Feather';

const CustomButton = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  isLoading,
  disabled,
  type,
  isShowIcon = false,
  icon,
  UniqueCode,
}) => {
  const { theme } = useThemeContext();

  const styles = createStyles(theme);

  const isSecondary = type === 'secondary';
  const buttonDisabled = disabled || isLoading;

  const textColor = UniqueCode
    ? theme.colors.text
    : isSecondary
    ? theme.colors.primary
    : theme.colors.textSecondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={buttonDisabled}
      style={[
        isSecondary ? styles.buttonSecondary : styles.button,
        buttonStyle,
        buttonDisabled && { opacity: 0.5 },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.textSecondary} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View>{icon}</View>}
          <Text
            style={[
              isSecondary ? styles.buttonTextSecondary : styles.buttonText,
              textStyle,
            ]}
          >
            {title}
          </Text>

          {isShowIcon && (
            <Icon
              name={'arrow-up-right'}
              size={moderateScale(25)}
              color={textColor}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const createStyles = theme =>
  StyleSheet.create({
    button: {
      borderRadius: verticalScale(8),
      backgroundColor: theme.colors.primary,
      width: '100%',
      height: verticalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonSecondary: {
      borderRadius: verticalScale(8),
      backgroundColor: theme.colors.backgroundColor,
      width: '100%',
      height: verticalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    buttonText: {
      color: theme.colors.textSecondary,
      fontSize: moderateScale(20),
      fontFamily: 'Lato-Bold',
      textAlign: 'center',
    },
    buttonTextSecondary: {
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
      fontSize: moderateScale(20),
      textAlign: 'center',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
      alignSelf: 'center',
    },
  });
