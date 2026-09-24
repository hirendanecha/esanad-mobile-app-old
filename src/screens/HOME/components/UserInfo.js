import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { verticalScale } from '@constants/metrics';
import { useAuthStore } from '@store/authStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';
import { formatNumber } from '@utils/formateNumber';
import { useLoyaltyPoints } from '@hooks/profile/useProfile';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '@constants/screenNames';

const UserInfo = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const {
    data: loyaltyPointsData = {},
    refetch,
    isRefetching,
  } = useLoyaltyPoints();

  const { totalRemainingPoints = 0, pointsHistory = [] } =
    loyaltyPointsData || {};

  return (
    <View
      style={{
        paddingHorizontal: verticalScale(20),
        flexDirection: 'row',
        gap: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(20),
      }}
    >
      <View
        style={{
          width: '60%',
        }}
      >
        <Text
          style={{
            fontFamily: 'Lato-Regular',
            fontSize: verticalScale(16),
            color: theme.colors.text,
          }}
        >
          Welcome 👋,
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: verticalScale(22),
            color: theme.colors.text,
            textTransform: 'capitalize',
          }}
          numberOfLines={1}
        >
          {user?.fullName}!
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate(SCREEN_NAMES.LOYALTY_POINTS)}
        style={{
          backgroundColor: theme.colors.bgSecondary,
          padding: verticalScale(10),
          borderRadius: verticalScale(10),
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: verticalScale(10),
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Image
          source={Images.Coins}
          resizeMode="contain"
          style={{
            width: verticalScale(30),
            height: verticalScale(30),
          }}
        />
        <View style={{}}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: verticalScale(16),
              color: theme.colors.text,
            }}
          >
            {formatNumber(totalRemainingPoints)}
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: verticalScale(12),
              color: theme.colors.text,
            }}
          >
            points
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({});
