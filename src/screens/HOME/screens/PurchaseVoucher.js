import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import CustomButton from '@components/ui/CustomButton';

import {
  useGetAllVouchers,
  useLoyaltyPoints,
  useVoucherPurchase,
} from '@hooks/profile/useProfile';
import { useAuthStore } from '@store/authStore';

const POINT_TO_AED_RATE = 0.025;

const VoucherDetails = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const { user } = useAuthStore();

  const {
    data: voucherCodes = [],
    refetch,
    isRefetching,
  } = useGetAllVouchers();

  const { data: loyaltyPointsData = {} } = useLoyaltyPoints();

  const { mutate: voucherPurchase } = useVoucherPurchase();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const totalRemainingPoints = loyaltyPointsData?.totalRemainingPoints || 0;

  const loyalityPoints = totalRemainingPoints * POINT_TO_AED_RATE;

  const handleRedeemVoucher = voucher => {
    setSelectedVoucher(voucher);
    setShowConfirmation(true);
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setShowConfirmation(false);
  };

  const handleCreateVoucherRequest = () => {
    if (!selectedVoucher || !user?._id) return;

    setIsLoading(true);

    voucherPurchase(
      {
        userId: user._id,
        voucherCodeId: selectedVoucher?._id,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          setShowConfirmation(false);
          setSelectedVoucher(null);
          refetch();
        },
        onError: () => {
          setIsLoading(false);
        },
      },
    );
  };

  const renderVoucherItem = ({ item }) => {
    const isDisabled = item?.price > loyalityPoints;

    const expiryDate = item?.expiryDate
      ? new Date(item.expiryDate).toLocaleDateString()
      : 'N/A';

    return (
      <View style={styles.voucherCard}>
        <View style={styles.voucherTitleContainer}>
          <Text style={styles.voucherName} numberOfLines={2}>
            {item?.voucherId?.voucherName || 'Voucher'}
          </Text>

          <Text style={styles.voucherDescription} numberOfLines={3}>
            {item?.voucherId?.description || 'No description available'}
          </Text>

          <Text style={styles.detailLabel}>Price: {item?.price || 0} AED</Text>

          <Text style={styles.expiryText}>Expires: {expiryDate}</Text>
        </View>

        <CustomButton
          title={isDisabled ? 'Insufficient Points' : 'Redeem Voucher'}
          onPress={() => handleRedeemVoucher(item)}
          disabled={isDisabled}
          buttonStyle={[
            styles.redeemButton,
            isDisabled && styles.redeemButtonDisabled,
          ]}
          textStyle={[
            styles.redeemButtonText,
            isDisabled && styles.redeemButtonTextDisabled,
          ]}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        name="local-activity"
        size={verticalScale(64)}
        color={theme.colors.border}
      />
      <Text style={styles.emptyStateTitle}>No Vouchers Available</Text>
      <Text style={styles.emptyStateText}>
        Check back later for new voucher offers
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {totalRemainingPoints > 0 && (
        <View style={styles.pointsInfo}>
          <Icon
            name="info"
            size={verticalScale(20)}
            color={theme.colors.text}
          />
          <Text style={styles.pointsInfoText}>
            1 Point = {POINT_TO_AED_RATE} AED •{' '}
            {parseFloat(totalRemainingPoints).toFixed(2)} points ={' '}
            {loyalityPoints.toFixed(2)} AED
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={voucherCodes}
        renderItem={renderVoucherItem}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: verticalScale(20) }}
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      <Modal
        animationType="fade"
        transparent
        visible={showConfirmation}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Redemption</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Icon
                  name="close"
                  size={verticalScale(24)}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              Are you sure you want to redeem this voucher?
            </Text>

            {selectedVoucher && (
              <View style={styles.selectedVoucherInfo}>
                <Text style={styles.selectedVoucherName}>
                  {selectedVoucher?.voucherId?.voucherName}
                </Text>
                <Text style={styles.voucherDetailText}>
                  Cost: {selectedVoucher?.price} AED
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                onPress={handleCloseModal}
                buttonStyle={styles.cancelButton}
                textStyle={styles.cancelButtonText}
                variant="outlined"
              />

              <CustomButton
                title={isLoading ? 'Processing...' : 'Confirm Redemption'}
                onPress={handleCreateVoucherRequest}
                disabled={isLoading}
                isLoading={isLoading}
                buttonStyle={styles.confirmButton}
                textStyle={styles.confirmButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: { flex: 1 },
    listContentContainer: {
      flexGrow: 1,
      paddingHorizontal: verticalScale(20),
      paddingTop: verticalScale(15),
      paddingBottom: verticalScale(30),
      gap: verticalScale(20),
    },
    header: {},
    pointsInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.highlight,
      paddingHorizontal: verticalScale(10),
      paddingVertical: verticalScale(4),
      borderRadius: verticalScale(3),
      gap: verticalScale(10),
    },
    pointsInfoText: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      flex: 1,
    },
    voucherCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(12),
      padding: verticalScale(16),
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: (Dimensions.get('screen').width - 60) / 2,
    },
    voucherTitleContainer: {
      gap: verticalScale(7),
      flex: 1,
      marginBottom: verticalScale(7),
    },
    voucherName: {
      fontSize: verticalScale(16),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
    voucherDescription: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    detailLabel: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    expiryText: {
      fontSize: verticalScale(12),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
    },
    redeemButton: {
      marginTop: verticalScale(4),
      borderRadius: verticalScale(3),
      height: verticalScale(30),
      padding: verticalScale(0),
      alignItems: 'center',
      justifyContent: 'center',
    },
    redeemButtonDisabled: { backgroundColor: theme.colors.border },
    redeemButtonText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
    redeemButtonTextDisabled: { color: theme.colors.description },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(60),
      paddingHorizontal: verticalScale(40),
    },
    emptyStateTitle: {
      fontSize: verticalScale(18),
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: verticalScale(16),
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    emptyStateText: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      marginBottom: verticalScale(20),
      lineHeight: verticalScale(20),
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: verticalScale(20),
    },
    modalContent: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(12),
      padding: verticalScale(20),
      width: '100%',
      maxWidth: verticalScale(400),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(16),
    },
    modalTitle: {
      fontSize: verticalScale(18),
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: { padding: verticalScale(4) },
    modalMessage: {
      fontSize: verticalScale(16),
      color: theme.colors.text,
      lineHeight: verticalScale(22),
      marginBottom: verticalScale(16),
    },
    selectedVoucherInfo: {
      backgroundColor: theme.colors.floorBgColor,
      padding: verticalScale(12),
      borderRadius: verticalScale(8),
      marginBottom: verticalScale(20),
    },
    selectedVoucherName: {
      fontSize: verticalScale(16),
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: verticalScale(8),
    },
    voucherDetailText: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
    },
    modalActions: {
      flexDirection: 'row',
      gap: verticalScale(12),
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(12),
    },
    confirmButton: {
      flex: 2,
      borderRadius: verticalScale(12),
    },
    cancelButtonText: { color: theme.colors.text },
    confirmButtonText: {
      fontSize: verticalScale(14),
      fontWeight: '600',
    },
  });

export default VoucherDetails;
