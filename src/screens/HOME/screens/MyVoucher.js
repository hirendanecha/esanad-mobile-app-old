import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';

import Header from '@components/ui/Header';
import { useGetUserVouchers } from '@hooks/profile/useProfile';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const MyVoucher = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const {
    data: userVouchers = [],
    refetch,
    isRefetching,
  } = useGetUserVouchers();

  const styles = getStyles(theme);

  const handleVoucherPress = voucher => {
    console.log('Voucher pressed:', voucher);
  };

  const handleCopyCode = code => {
    if (code) {
      Clipboard.setString(code);
    }
  };

  const renderVoucherCard = ({ item }) => {
    const { voucherId, voucherCode, price = 0, expiryDate } = item || {};

    return (
      <TouchableOpacity
        style={styles.voucherCard}
        activeOpacity={0.8}
        onPress={() => handleVoucherPress(item)}
      >
        <Text style={styles.voucherName} numberOfLines={2}>
          {voucherId?.voucherName || 'Unnamed Voucher'}
        </Text>

        <View style={styles.codeLabel}>
          <Icon
            name="confirmation-number"
            size={verticalScale(18)}
            color={theme.colors.primary}
          />
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopyCode(voucherCode)}
          >
            <Text style={styles.voucherCodeText}>{voucherCode}</Text>
            <Icon
              name="content-copy"
              size={verticalScale(14)}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.detailValue}>Price: {price} AED</Text>

        <Text style={styles.description} numberOfLines={3}>
          {voucherId?.description || 'No description available'}
        </Text>

        <Text style={styles.expiryText}>
          {expiryDate
            ? `Expire On: ${dayjs(expiryDate).format('DD/MM/YYYY')}`
            : 'No expiry'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Icon
          name="confirmation-number"
          size={verticalScale(80)}
          color={theme.colors.border}
        />
      </View>
      <Text style={styles.emptyStateTitle}>No Vouchers Yet</Text>
      <Text style={styles.emptyStateText}>
        You haven't purchased any vouchers yet. Start exploring our voucher
        collection to enjoy exclusive discounts and offers!
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!userVouchers.length) return null;

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {userVouchers.length} voucher
          {userVouchers.length !== 1 ? 's' : ''} in your collection
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userVouchers}
        renderItem={renderVoucherCard}
        keyExtractor={(item, index) => item?._id || `voucher-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        numColumns={2}
        columnWrapperStyle={{ gap: verticalScale(20) }}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: verticalScale(20),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(40),
      gap: verticalScale(20),
      flexGrow: 1,
    },
    voucherCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(12),
      padding: verticalScale(10),
      width: (SCREEN_WIDTH - 60) / 2,
      gap: verticalScale(7),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    voucherName: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    codeLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    copyButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.floorBgColor,
      padding: verticalScale(5),
      gap: verticalScale(5),
      marginStart: verticalScale(10),
    },
    voucherCodeText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    detailValue: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    description: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    expiryText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.description,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(60),
      paddingHorizontal: verticalScale(40),
    },
    emptyIconContainer: {
      marginBottom: verticalScale(16),
    },
    emptyStateTitle: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-SemiBold',
      color: theme.colors.text,
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    emptyStateText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      textAlign: 'center',
      lineHeight: verticalScale(20),
      marginBottom: verticalScale(24),
    },
    footer: {
      padding: verticalScale(16),
      alignItems: 'center',
      marginTop: verticalScale(8),
    },
    footerText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

export default MyVoucher;
