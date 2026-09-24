import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import { formatNumber } from '@utils/formateNumber';
import { useAuthStore } from '@store/authStore';
import { useLoyaltyPoints } from '@hooks/profile/useProfile';
import { SCREEN_NAMES } from '@constants/screenNames';

import Header from '@components/ui/Header';
import NoData from '@components/ui/NoData';
import CoinIcon from '@assets/icons/CoinIcon';
import { Images } from '@assets/index';
import Dhiram from '@assets/NEWICONS/Dhiram';

const LoyaltyPoints = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    data: loyaltyPointsData = {},
    refetch,
    isRefetching,
  } = useLoyaltyPoints();

  const { totalRemainingPoints = 0, pointsHistory = [] } =
    loyaltyPointsData || {};

  // Calculate total earned and redeemed if not provided
  const totalEarned = pointsHistory?.reduce((acc, curr) => acc + (curr?.pointsGained || 0), 0) || 0;
  const totalRedeemed = pointsHistory?.reduce((acc, curr) => acc + (curr?.pointsUsed || 0), 0) || 0;

  const renderHistoryItem = ({ item }) => {
    const isGained = Boolean(item?.pointsGained);
    const points = isGained ? item?.pointsGained : item?.pointsUsed;

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyLeft}>
          <Text numberOfLines={2} style={styles.activityText}>
            {item?.activity || '-'}
          </Text>

          <Text style={styles.detailValue}>
            {item?.createdAt
              ? `• ${dayjs(item.createdAt).format('DD/MM/YYYY • HH:mm')}`
              : '-'}
          </Text>
        </View>

        <View style={styles.pointsRight}>
          <CoinIcon width={verticalScale(40)} height={verticalScale(40)} />
          <Text
            style={[
              styles.pointsBadgeText,
              { color: isGained ? theme.colors.lableText : theme.colors.red },
            ]}
          >
            {isGained ? '+' : '-'}
            {formatNumber(points)}
          </Text>
        </View>
      </View>
    );
  };

  const BalanceCard = ({ title, subTitle, value, isEarned }) => (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>{title}</Text>
      {subTitle && <Text style={styles.balanceSubLabel}>{subTitle}</Text>}
      <View style={styles.balanceValueContainer}>
        <View style={{ width: verticalScale(20), height: verticalScale(20), marginBottom: verticalScale(5) }}>
          <Dhiram />
        </View>
        <Text style={styles.balanceValue}>{formatNumber(value)}</Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <BalanceCard title="Available Balance" value={totalRemainingPoints} />
      <BalanceCard title="Redeemed" subTitle="Total Amount" value={totalRedeemed} />
      <BalanceCard title="Earned" subTitle="Total Cashback" value={totalEarned} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Points History</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="eSanad Credit Points" onBack={navigation.goBack} />

      <FlatList
        data={[...pointsHistory]?.reverse()}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<NoData />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={isRefetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bgLinear1,
    },
    listContentContainer: {
      flexGrow: 1,
      padding: verticalScale(20),
      paddingBottom: verticalScale(40),
    },
    headerContainer: {
      gap: verticalScale(15),
      marginBottom: verticalScale(10),
    },
    balanceCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    balanceLabel: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    balanceSubLabel: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      marginTop: verticalScale(2),
    },
    balanceValueContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: verticalScale(10),
      gap: verticalScale(5),
    },
    currencySymbol: {
      fontSize: moderateScale(24),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginRight: moderateScale(8),
    },
    balanceValue: {
      fontSize: moderateScale(36),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    sectionHeader: {
      marginTop: verticalScale(10),
      marginBottom: verticalScale(5),
    },
    sectionTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    historyItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border + '80',
      alignItems: 'center',
    },
    historyLeft: {
      flex: 1,
      gap: verticalScale(10),
    },
    activityText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      lineHeight: verticalScale(18),
    },
    detailValue: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    pointsRight: {
      alignItems: 'flex-end',
      gap: verticalScale(2),
      width: verticalScale(80),
    },
    pointsBadgeText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
    separator: {
      height: verticalScale(12),
    },
  });

export default LoyaltyPoints;
