import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import PurchaseVoucher from '../../PROFILE/LoyaltyPoints/components/PurchaseVoucher';
import MyVoucher from '../../PROFILE/LoyaltyPoints/components/MyVoucher';

const Tab = createMaterialTopTabNavigator();

const VoucherScreen = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      locations={[0.1, 0.2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      style={styles.container}
    >
      <Header title="Vouchers" onBack={navigation.goBack} />
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(20),
        }}
      >
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: verticalScale(16),
              fontFamily: 'Lato-Bold',
              textTransform: 'none',
              height: verticalScale(30),
            },
            tabBarItemStyle: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              height: verticalScale(40),
            },
            tabBarActiveTintColor: theme.colors.textSecondary,
            tabBarInactiveTintColor: theme.colors.text,
            tabBarStyle: {
              backgroundColor: theme.colors.backgroundColor,
              marginHorizontal: verticalScale(20),
              borderRadius: verticalScale(5),
              overflow: 'hidden',
              borderColor: theme.colors.border,
            },
            tabBarIndicatorContainerStyle: {
              borderRadius: verticalScale(5),
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
            tabBarIndicatorStyle: {
              borderWidth: 1,
              backgroundColor: theme.colors.primary,
              height: '100%',
              borderColor: theme.colors.primary,
              borderRadius: verticalScale(5),
              width: (Dimensions.get('screen').width - 42) / 2,
            },
            sceneStyle: { backgroundColor: 'transparent' },
            swipeEnabled: false,
          }}
        >
          <Tab.Screen name="My Voucher" component={MyVoucher} />
          <Tab.Screen name="Purchase Voucher" component={PurchaseVoucher} />
        </Tab.Navigator>
      </View>
    </LinearGradient>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
