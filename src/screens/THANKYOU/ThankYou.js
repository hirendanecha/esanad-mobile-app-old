import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Thanks from '@assets/svg/Thanks';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import CustomButton from '@components/ui/CustomButton';
import { SCREEN_NAMES } from '@constants/screenNames';

const ThankYou = ({ navigation }) => {
  const { theme } = useThemeContext();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundColor,
        gap: verticalScale(20),
        padding: verticalScale(20),
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: verticalScale(400),
          width: '100%',
        }}
      >
        <Thanks />
      </View>
      <Text
        style={{
          fontSize: verticalScale(20),
          fontFamily: 'Lato-Bold',
          textAlign: 'center',
          color: theme.colors.text,
        }}
      >
        Thank you!{'\n'}
        We’ve received your request.
      </Text>
      <Text
        style={{
          fontSize: verticalScale(14),
          fontFamily: 'Lato-Regular',
          color: theme.colors.description,
          textAlign: 'center',
          marginHorizontal: verticalScale(20),
        }}
      >
        Thank you for choosing us. Our agent will contact you shortly to assist
        you with the next steps and provide further details regarding your
        policy.
      </Text>
      <CustomButton
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: SCREEN_NAMES.BOTTOM_TABS }],
          })
        }
        title="Go to Home"
        isShowIcon
      />
    </View>
  );
};

export default ThankYou;

const styles = StyleSheet.create({});
