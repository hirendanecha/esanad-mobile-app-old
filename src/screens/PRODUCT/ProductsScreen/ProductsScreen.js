import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import style from './ProductsScreen.styles';
import LinearGradient from 'react-native-linear-gradient';

import { SCREEN_NAMES } from '@constants/screenNames';
import HomeHeader from '@screens/HOME/components/HomeHeader';
import HomePolicy from '@assets/icons/HomePolicy';
import Proposals from '@assets/icons/Proposals';
import Expiring from '@assets/icons/Expiring';
import HomeCliam from '@assets/icons/HomeCliam';
import Cancelled from '@assets/NEWICONS/Cancelled';
import MyClaims from '@assets/NEWICONS/MyClaims';
import MyRenewals from '@assets/NEWICONS/MyRenewals';
import MyPolicies from '@assets/NEWICONS/MyPolicies';
import MyQuotes from '@assets/NEWICONS/MyQuotes';

const ProductsScreen = ({ navigation }) => {
  const DASHBOARD_ITEMS = [
    {
      icon: <MyPolicies />,
      label: 'My Policies',
      description: 'Track status, coverage details, and documents easily.',
      navigate: () => navigation.navigate(SCREEN_NAMES.ACTIVE_POLICY),
      width: 'half',
    },
    {
      icon: <MyQuotes />,
      label: 'My Quotes',
      description: 'Compare plans and proceed to purchase anytime.',
      navigate: () => navigation.navigate(SCREEN_NAMES.QUOTATION_SCREEN),
      width: 'half',
    },
    {
      icon: <MyRenewals />,
      label: 'My Renewals',
      description: 'Manage upcoming and pending policy renewals.',
      navigate: () => navigation.navigate(SCREEN_NAMES.EXPIRED_POLICY),
      width: 'full',
    },
    {
      icon: <MyClaims />,
      label: 'My Claims',
      description: 'Check claim status and upload required documents.',
      navigate: () => navigation.navigate(SCREEN_NAMES.CLAIM_POLICY),
      width: 'half',
    },
    {
      icon: <Cancelled />,
      label: 'My Cancelled',
      description: 'Review past records and cancellation details.',
      navigate: () => navigation.navigate(SCREEN_NAMES.CANCELLED_POLICY),
      width: 'half',
    },
  ];

  const { theme } = useThemeContext();
  const styles = style(theme);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.homeContainer}
      >
        <View style={styles.tabContainer}>
          {DASHBOARD_ITEMS.map((item, index) => {
            const isFullWidth = item.width === 'full';
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={item.navigate}
                style={[
                  styles.tabButton,
                  isFullWidth && styles.fullWidthButton,
                ]}
              >
                <View
                  style={isFullWidth ? styles.rowContent : styles.columnContent}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.tabText}>{item.label}</Text>
                    <Text style={styles.tabDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tabIconContainer,
                      !isFullWidth && styles.columnIconWrapper,
                    ]}
                  >
                    {item.icon}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProductsScreen;
