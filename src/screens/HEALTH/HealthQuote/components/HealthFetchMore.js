import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HealthFetchMore = ({ applyFilters }) => {
  const { theme } = useThemeContext();

  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={applyFilters}
      style={{
        position: 'absolute',
        backgroundColor: theme.colors.primary,
        bottom: insets.bottom + 50,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        right: verticalScale(20),
        padding: verticalScale(5),
        borderRadius: verticalScale(50),
        borderWidth: 2,
        borderColor: theme.colors.backgroundColor,
      }}
    >
      <Icon name="downloading" size={24} color={theme.colors.textSecondary} />
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: 'Lato-Bold',
          fontSize: verticalScale(14),
          marginHorizontal: verticalScale(10),
        }}
      >
        More Plans
      </Text>
    </TouchableOpacity>
  );
};

export default HealthFetchMore;
