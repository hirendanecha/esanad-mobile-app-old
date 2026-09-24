import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { SCREEN_NAMES } from '@constants/screenNames';

const LocatePolicy = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(SCREEN_NAMES.FETCH_POLICIES)}
      activeOpacity={0.8}
      style={{
        marginHorizontal: verticalScale(20),
        marginTop: verticalScale(20),
        flexDirection: 'row',
        backgroundColor: theme.colors.highlight,
        paddingHorizontal: verticalScale(15),
        paddingVertical: verticalScale(5),
        borderRadius: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          fontSize: verticalScale(16),
          fontFamily: 'Lato-Bold',
          color: theme.colors.text,
        }}
      >
        Locate Your Policy EID
      </Text>
      <Icon name="arrow-right-long" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default LocatePolicy;

const styles = StyleSheet.create({});
