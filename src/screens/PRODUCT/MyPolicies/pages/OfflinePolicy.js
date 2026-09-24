import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { formatNumber } from '@utils/formateNumber';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '@assets/index';
import Header from '@components/ui/Header';
import { useUserStore } from '@store/userStore';
import { SCREEN_NAMES } from '@constants/screenNames';

const OfflinePolicy = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { offlinePolicies } = useUserStore();

  const AllPolicies = offlinePolicies ? [offlinePolicies] : [];

  const getPolicyType = item => {
    if (item?.Products) {
      return 'Motor Insurance';
    }
    return 'Insurance';
  };

  const getPolicyColor = type => {
    switch (type) {
      case 'Motor Insurance':
        return theme.colors.motorLinear;
      case 'Health Insurance':
        return theme.colors.healthLinear;
      case 'Travel Insurance':
        return theme.colors.travelLinear;
      case 'Musataha Insurance':
        return theme.colors.musatahaLinear;
      default:
        return theme.colors.motorLinear;
    }
  };

  const getPolicyBorderColor = type => {
    switch (type) {
      case 'Motor Insurance':
        return theme.colors.motorLinear[1];
      case 'Health Insurance':
        return theme.colors.healthLinear[1];
      case 'Travel Insurance':
        return theme.colors.travelLinear[1];
      case 'Musataha Insurance':
        return theme.colors.musatahaLinear[1];
      default:
        return theme.colors.motorLinear[1];
    }
  };

  const renderMotorPolicyDetails = item => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Repair Type</Text>
          <Text style={styles.detailValue}>{item?.RepairType || '---'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Vehicle Value</Text>
          <Text style={styles.detailValue}>
            {item?.VehicleValue
              ? `AED ${formatNumber(item.VehicleValue)}`
              : '---'}
          </Text>
        </View>
        <View style={[styles.detailItem, { borderRightWidth: 0 }]}>
          <Text style={styles.detailLabel}>Vehicle</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {item?.VehicleMake || '---'}
          </Text>
        </View>
      </View>
    );
  };

  const renderVehicleDetails = item => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Year</Text>
          <Text style={styles.detailValue}>
            {item?.YearofManufacture || '---'}
          </Text>
        </View>

        <View style={[styles.detailItem, { borderRightWidth: 0 }]}>
          <Text style={styles.detailLabel}>Body Type</Text>
          <Text style={styles.detailValue}>{item?.BodyType || '---'}</Text>
        </View>
        <View style={[styles.detailItem]}>
          <Text style={styles.detailLabel}>Product Type</Text>
          <Text style={styles.detailValue}>{item?.Products || '---'}</Text>
        </View>
      </View>
    );
  };

  const renderPolicyDetails = item => {
    const policyType = getPolicyType(item);

    return (
      <>
        {policyType === 'Motor Insurance' && renderMotorPolicyDetails(item)}
        {/* {policyType === 'Motor Insurance' && renderVehicleDetails(item)} */}
      </>
    );
  };

  const handleNavigation = item => {
    const policyType = getPolicyType(item);
    let screenName = '';

    switch (policyType) {
      case 'Motor Insurance':
        screenName = SCREEN_NAMES.MOTOR_INSURANCE_DETAIL;
        break;
      case 'Health Insurance':
        screenName = SCREEN_NAMES.HEALTH_INSURANCE_DETAIL;
        break;
      case 'Travel Insurance':
        screenName = SCREEN_NAMES.TRAVEL_INSURANCE_DETAIL;
        break;
      case 'Musataha Insurance':
        screenName = SCREEN_NAMES.MUSATAHA_POLICY_DETAIL;
        break;
      default:
        screenName = SCREEN_NAMES.MOTOR_INSURANCE_DETAIL;
    }

    navigation.navigate(screenName, { policyId: item?._id, data: item });
  };

  const formatDate = dateString => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderPolicyCard = ({ item }) => {
    const policyType = getPolicyType(item);
    const policyColor = getPolicyColor(policyType);
    const policyBorderColor = getPolicyBorderColor(policyType);

    return (
      <LinearGradient
        colors={policyColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          borderColor: policyBorderColor,
          borderWidth: 1,
          borderRadius: moderateScale(15),
        }}
      >
        <TouchableOpacity
          onPress={() => handleNavigation(item)}
          activeOpacity={0.8}
          style={styles.policyCard}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{policyType}</Text>
          </View>

          <View style={styles.headerSection}>
            <View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: policyBorderColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: moderateScale(10),
                },
              ]}
            >
              <Image
                source={
                  policyType === 'Motor Insurance'
                    ? Images.car
                    : policyType === 'Health Insurance'
                    ? Images.health
                    : Images.travel
                }
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                }}
              />
            </View>

            <View style={styles.headerDetails}>
              <Text style={styles.companyName} numberOfLines={2}>
                {item?.InsuranceCompany || 'Insurance Company'}
              </Text>
              <Text style={styles.policyText} numberOfLines={1}>
                {item?.PolicyNo}
              </Text>
            </View>
          </View>

          {/* Insured Details */}
          {/* <View style={styles.insuredSection}>
            <View style={styles.insuredRow}>
              <Text style={styles.detailLabel}>Insured Name</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {item?.InsuredName || '---'}
              </Text>
            </View>
            <View style={styles.insuredRow}>
              <Text style={styles.detailLabel}>EID</Text>
              <Text style={styles.detailValue}>{item?.EID || '---'}</Text>
            </View>
          </View> */}

          {/* Policy Period */}
          {/* <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <Text style={styles.detailLabel}>Start Date</Text>
              <Text style={styles.detailValue}>
                {formatDate(item?.StartDate)}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>
                {formatDate(item?.ExpiryDate)}
              </Text>
            </View>
          </View> */}

          {renderPolicyDetails(item)}

          {/* Premium Details */}
          {/* <View style={styles.premiumSection}>
            <View style={styles.premiumRow}>
              <Text style={styles.detailLabel}>Base Premium</Text>
              <Text style={styles.detailValue}>
                AED {formatNumber(item?.BasePremium || 0)}
              </Text>
            </View>
            <View style={styles.premiumRow}>
              <Text style={styles.detailLabel}>
                VAT ({item?.VatPrecentage}%)
              </Text>
              <Text style={styles.detailValue}>
                AED{' '}
                {formatNumber(
                  (parseFloat(item?.BasePremium || 0) *
                    parseFloat(item?.VatPrecentage || 0)) /
                    100,
                )}
              </Text>
            </View>
          </View> */}

          <View style={styles.actionsContainer}>
            <Text style={styles.priceLabel}>Total Premium</Text>
            <Text style={styles.priceValue}>
              AED {formatNumber(item?.RVAmount || item?.BasePremium || 0)}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="description"
        size={moderateScale(64)}
        color={theme.colors.description}
      />
      <Text style={styles.emptyTitle}>No Offline Policies</Text>
      <Text style={styles.emptyDescription}>
        You don't have any offline policies at the moment.
      </Text>
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Offline Policies" onBack={navigation.goBack} />
      <FlatList
        data={AllPolicies}
        renderItem={renderPolicyCard}
        keyExtractor={(item, index) => item?._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={ListEmptyComponent}
      />
    </LinearGradient>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContentContainer: {
      paddingVertical: verticalScale(20),
      paddingHorizontal: verticalScale(15),
      flexGrow: 1,
      gap: verticalScale(15),
    },
    policyCard: {
      padding: moderateScale(15),
    },
    badge: {
      position: 'absolute',
      top: moderateScale(5),
      right: moderateScale(5),
      paddingVertical: moderateScale(3),
      paddingHorizontal: moderateScale(10),
      borderRadius: moderateScale(10),
      zIndex: 1,
      backgroundColor: theme.colors.lableBg,
    },
    badgeText: {
      color: theme.colors.text,
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Regular',
    },
    headerSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(12),
    },
    logoContainer: {
      borderRadius: moderateScale(30),
      overflow: 'hidden',
    },
    headerDetails: {
      flex: 1,
      marginLeft: verticalScale(12),
      justifyContent: 'center',
      gap: verticalScale(5),
    },
    companyName: {
      fontSize: moderateScale(18),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      width: '90%',
    },
    policyText: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    insuredSection: {
      marginBottom: verticalScale(12),
      gap: verticalScale(6),
    },
    insuredRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateSection: {
      flexDirection: 'row',
      marginBottom: verticalScale(12),
      gap: verticalScale(12),
    },
    dateItem: {
      flex: 1,
    },
    premiumSection: {
      marginBottom: verticalScale(12),
      gap: verticalScale(6),
    },
    premiumRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailsContainer: {
      marginBottom: verticalScale(12),
      flexDirection: 'row',
      gap: verticalScale(12),
    },
    detailItem: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: theme.colors.description,
    },
    detailLabel: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      marginBottom: verticalScale(2),
      fontFamily: 'Lato-Regular',
    },
    detailValue: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    actionsContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flex: 1,
    },
    priceLabel: {
      fontSize: moderateScale(12),
      fontWeight: '500',
      color: theme.colors.description,
      marginBottom: verticalScale(2),
    },
    priceValue: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(100),
    },
    emptyTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.text,
      marginTop: verticalScale(16),
      marginBottom: verticalScale(8),
    },
    emptyDescription: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      lineHeight: moderateScale(20),
    },
  });

export default OfflinePolicy;
