import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const SocialButton = ({ icon, onPress }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <View style={{ gap: verticalScale(5), alignItems: 'center' }}>
      <TouchableOpacity style={styles.button} onPress={onPress} testID="social-button">
        <Image
          source={icon}
          style={{
            width: verticalScale(20),
            height: verticalScale(20),
            borderRadius: 10,
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: 'Lato-Regular',
          fontSize: verticalScale(12),
          color: theme.colors.text,
        }}
      >
        UAE Pass
      </Text>
    </View>
  );
};

export default SocialButton;

const style = theme =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: verticalScale(25),
      width: verticalScale(48),
      height: verticalScale(48),
      borderColor: theme.colors.border,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
