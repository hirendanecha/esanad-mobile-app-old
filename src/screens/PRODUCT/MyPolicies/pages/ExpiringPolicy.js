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
import CustomStarRating from '@components/ui/CustomStarRating';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '@components/ui/Header';
import { SCREEN_NAMES } from '@constants/screenNames';
import { SafeAreaView } from 'react-native-safe-area-context';
// import CancelPolicyModal from './cancel-policy-modal';
import {
  useGetHealthExpiringPolicy,
  useGetMotorExpiringPolicy,
  useGetTravelExpiringPolicy,
} from '@hooks/profile/usePolicyProfile';
import { env } from '@config/index';
import LinearGradient from 'react-native-linear-gradient';

const ExpiringPolicy = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { data: expiringPolicyData } = useGetMotorExpiringPolicy();
  const { data: expiringHealthPolicyData } = useGetHealthExpiringPolicy();
  const { data: expiringTravelPolicyData } = useGetTravelExpiringPolicy();

  const allPolicies = [
    ...(expiringPolicyData?.filter(
      itm => itm?.response?.Errors?.length === 0,
    ) || []),
    ...(expiringHealthPolicyData || []),
    // ...(expiringTravelPolicyData || []),
  ];

  const getPolicyType = item => {
    if (item?.carId) return 'Motor Insurance';
    if (item?.quoteId?.companyData) return 'Health Insurance';
    if (item?.travelQuoteId) return 'Travel Insurance';
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
        return theme.colors.musatahaLinear;
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
        return theme.colors.musatahaLinear[1];
    }
  };

  const getCompanyInfo = item => {
    if (item?.carId) {
      return {
        logo: item?.quoteId?.company?.logoImg,
        companyName: item?.quoteId?.company?.companyName,
        rating: item?.quoteId?.company?.googleRating,
        companyId: item?.quoteId?.company?._id,
      };
    }
    if (item?.quoteId?.companyData) {
      return {
        logo: item?.quoteId?.companyData?.logoImg,
        companyName: item?.quoteId?.companyData?.companyName,
        rating: item?.quoteId?.companyData?.googleRating,
        companyId: item?.quoteId?.companyData?._id,
      };
    }
    if (item?.travelQuoteId) {
      return {
        logo: item?.quote?.company?.logoImg,
        companyName: item?.travelQuoteId?.planName,
        rating: item?.quote?.companyId?.googleRating,
        companyId: item?.quote?.companyId?._id,
      };
    }
    return null;
  };

  const getPrice = item => {
    if (item?.carId) {
      const offer = item?.quoteId?.response?.Offers?.[0] || {};
      return item?.quoteId?.totalPrice || offer?.PolicyPremium;
    }
    if (item?.quoteId?.companyData) return item?.quoteId?.totalPrice;
    if (item?.travelQuoteId) return item?.totalPrice;
    return 0;
  };

  const getInsuranceTypeText = item => {
    if (item?.carId) {
      const insuranceType =
        item?.quoteId?.insuranceType === 'thirdparty'
          ? 'Third Party'
          : item?.quoteId?.insuranceType;
      const basicText = item?.quoteId?.basicQuote ? '(Basic)' : '';
      return `${insuranceType} Insurance ${basicText}`;
    }
    return getPolicyType(item);
  };

  const renderMotorPolicyDetails = item => {
    const offer = item?.quoteId?.response?.Offers?.[0] || {};
    const hasOffers = item?.quoteId?.response?.Offers?.length > 0;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Repair type</Text>
          <Text style={styles.detailValue}>
            {item?.quoteInfo?.basicQuote
              ? '---'
              : hasOffers
              ? offer?.RepairMethod === 'nonagency'
                ? 'Non Agency'
                : 'Agency'
              : '---'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Car Value</Text>
          <Text style={styles.detailValue}>
            AED{' '}
            {formatNumber(item?.quoteId?.carValue || offer?.MaximumCarValue)}
          </Text>
        </View>

        <View style={[styles.detailItem, { borderRightWidth: 0 }]}>
          <Text style={styles.detailLabel}>Excess Charges</Text>
          <Text style={styles.detailValue}>
            {item?.quoteId?.insuranceType === 'thirdparty'
              ? '---'
              : hasOffers
              ? `AED ${formatNumber(offer?.ExcessAmount)}`
              : 'AED 0'}
          </Text>
        </View>
      </View>
    );
  };

  const renderHealthPolicyDetails = item => {
    let medicalCover = '';
    let consultationFee = '';

    const coversList = [
      ...(item?.quoteId?.extraCovers || []),
      ...(item?.quoteId?.includedCovers || []),
    ];

    const medicalMatch = coversList.find(
      i => i?.benefit?.name === 'Aggregate Annual limit',
    );
    if (medicalMatch?.limitAmount) {
      medicalCover = medicalMatch.limitAmount;
    }

    const consultMatch = coversList.find(
      i => i?.benefit?.name === 'Physician Consultation',
    );
    if (
      consultMatch?.deductible?.deductibleValue &&
      consultMatch?.deductible?.deductibleType
    ) {
      consultationFee =
        consultMatch.deductible.deductibleType === 'percentage'
          ? `${consultMatch.deductible.deductibleValue}%`
          : `AED ${consultMatch.deductible.deductibleValue}`;
    }

    return (
      <View style={styles.detailsContainer}>
        <View style={[styles.detailItem, { flex: 1 / 1.5 }]}>
          <Text style={styles.detailLabel}>Plan</Text>
          <Text style={styles.detailValue}>
            {item?.quoteId?.plan?.planName || '-'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Network</Text>
          <Text style={styles.detailValue}>
            {item?.quoteId?.network?.networkName || '-'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Medical Coverage</Text>
          <Text style={styles.detailValue}>AED {medicalCover || '-'}</Text>
        </View>

        <View style={[styles.detailItem, { borderRightWidth: 0, flex: 1 / 2 }]}>
          <Text style={styles.detailLabel}>Co-pay</Text>
          <Text style={styles.detailValue}>{item?.quoteId?.coPay || '-'}</Text>
        </View>

        {consultationFee && (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Consultation</Text>
              <Text style={styles.detailValue}>{consultationFee}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderTravelPolicyDetails = item => {
    const medicalExpenses =
      item?.quote?.issueInfo?.medicalBenefits?.[0]?.value || '-';
    const lossOfPassport =
      item?.quote?.issueInfo?.passportBenefits?.[0]?.value || '-';
    const luggageLoss =
      item?.quote?.issueInfo?.luggageBenefits?.[0]?.value || '-';

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon
              name="local-hospital"
              size={moderateScale(20)}
              color={theme.colors.primary}
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Medical Expenses</Text>
              <Text style={styles.detailValue}>{medicalExpenses}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon
              name="card-travel"
              size={moderateScale(20)}
              color={theme.colors.primary}
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Loss of Passport</Text>
              <Text style={styles.detailValue}>{lossOfPassport}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon
              name="luggage"
              size={moderateScale(20)}
              color={theme.colors.primary}
            />
            <Text style={styles.detailLabel}>Luggage Loss</Text>
            <Text style={styles.detailValue}>{luggageLoss}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderLandPolicyDetails = item => {
    const luggageLoss = '-';

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon
              name="business"
              size={moderateScale(18)}
              color={theme.colors.primary}
            />
            <Text style={styles.detailLabel}>Luggage Loss</Text>
            <Text style={styles.detailValue}>{luggageLoss}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPolicyDetails = item => {
    const policyType = getPolicyType(item);

    switch (policyType) {
      case 'Motor Insurance':
        return renderMotorPolicyDetails(item);
      case 'Health Insurance':
        return renderHealthPolicyDetails(item);
      case 'Travel Insurance':
        return renderTravelPolicyDetails(item);
      default:
        return null;
    }
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

      default:
        screenName = SCREEN_NAMES.MOTOR_INSURANCE_DETAIL;
    }

    navigation.navigate(screenName, { policyId: item?._id });
  };

  const renderPolicyCard = ({ item }) => {
    const policyType = getPolicyType(item);
    const policyColor = getPolicyColor(policyType);
    const policyBorderColor = getPolicyBorderColor(policyType);
    const companyInfo = getCompanyInfo(item);
    const price = getPrice(item);

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
          // onPress={() => handleNavigation(item)}
          activeOpacity={0.8}
          style={styles.policyCard}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{policyType}</Text>
          </View>

          <View style={styles.headerSection}>
            {companyInfo?.logo?.path && (
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: policyBorderColor },
                ]}
              >
                <Image
                  source={{
                    uri: `${env.API_URL}${companyInfo.logo.path}`,
                  }}
                  style={styles.companyLogo}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.headerDetails}>
              <Text style={styles.companyName} numberOfLines={1}>
                {companyInfo?.companyName || 'Insurance Company'}
              </Text>
              <Text style={styles.policyText} numberOfLines={1}>
                {companyInfo?.companyName || 'Insurance Company'}
              </Text>
            </View>
          </View>

          {renderPolicyDetails(item)}

          <View style={styles.actionsContainer}>
            <Text style={styles.priceLabel}>Total Premium</Text>
            <Text style={styles.priceValue}>AED {formatNumber(price)}</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="policy"
        size={moderateScale(64)}
        color={theme.colors.description}
      />
      <Text style={styles.emptyTitle}>No Expiring Policies</Text>
      <Text style={styles.emptyDescription}>
        You don't have any policies expiring soon.
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
      <Header title="Expiring Policies" onBack={navigation.goBack} />
      <FlatList
        data={allPolicies}
        renderItem={renderPolicyCard}
        keyExtractor={(item, index) =>
          `${item?._id || index}-${getPolicyType(item)}`
        }
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContentContainer: {
      paddingVertical: verticalScale(20),
      paddingHorizontal: verticalScale(15),
      flexGrow: 1,
      gap: verticalScale(10),
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
      marginBottom: verticalScale(16),
    },
    logoContainer: {
      backgroundColor: theme.colors.floorBgColor,
      borderRadius: moderateScale(30),
      overflow: 'hidden',
    },
    companyLogo: {
      width: moderateScale(60),
      height: moderateScale(60),
    },
    headerDetails: {
      flex: 1,
      marginLeft: verticalScale(12),
      justifyContent: 'center',
      gap: verticalScale(5),
    },
    companyName: {
      fontSize: moderateScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      width: '90%',
    },
    policyText: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    ratingContainer: {
      marginVertical: verticalScale(4),
    },
    viewProfileLink: {
      fontSize: moderateScale(12),
      color: theme.colors.primary,
      textDecorationLine: 'underline',
      fontWeight: '500',
    },
    insuranceTypeText: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      fontWeight: '400',
    },
    detailsContainer: {
      marginBottom: verticalScale(16),
      flexDirection: 'row',
      gap: verticalScale(12),
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
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
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.redLight,
      paddingVertical: verticalScale(10),
      paddingHorizontal: moderateScale(16),
      borderRadius: moderateScale(12),
      borderWidth: 1,
      borderColor: theme.colors.redLight,
    },
    cancelButtonText: {
      fontSize: moderateScale(14),
      fontWeight: '600',
      color: theme.colors.red,
      marginLeft: verticalScale(6),
    },
    separator: {
      height: verticalScale(16),
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

export default ExpiringPolicy;
