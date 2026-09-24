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
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { formatNumber } from '@utils/formateNumber';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREEN_NAMES } from '@constants/screenNames';
import {
  useGetHealthActivePolicy,
  useGetLandActivePolicy,
  useGetMotorActivePolicy,
  useGetTravelActivePolicy,
} from '@hooks/profile/usePolicyProfile';
import { env } from '@config/index';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '@assets/index';
import Header from '@components/ui/Header';
import CustomButton from '@components/ui/CustomButton';
import CancelPolicy from '@assets/icons/CancelPolicy';

const ActivePolicy = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const { data: activePolicyData } = useGetMotorActivePolicy();
  const { data: activeHelathPolicyData } = useGetHealthActivePolicy();
  const { data: activeTravelPolicyData } = useGetTravelActivePolicy();
  const { data: activeLandPolicyData } = useGetLandActivePolicy();

  const allPolicies = [
    ...(activePolicyData?.filter(itm => itm?.response?.Errors?.length === 0) ||
      []),
    ...(activeHelathPolicyData || []),
    // ...(activeTravelPolicyData || []),
    // ...(activeLandPolicyData || []),
  ];

  const getPolicyType = item => {
    if (item?.carId) return 'Motor Insurance';
    if (item?.quoteId?.companyData) return 'Health Insurance';
    if (item?.travelQuoteId) return 'Travel Insurance';
    if (item?.proposal) return 'Musataha Insurance';
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
        logo: item?.quoteId?.companyData?.bannerImg,
        companyName: item?.quoteId?.companyData?.companyName,
        rating: item?.quoteId?.companyData?.googleRating,
        companyId: item?.quoteId?.companyData?._id,
      };
    }
    if (item?.travelQuoteId) {
      return {
        logo: item?.currentCompany?.logoImg,
        companyName: item?.travelQuoteId?.planName,
        rating: item?.quote?.companyId?.googleRating,
        companyId: item?.quote?.companyId?._id,
      };
    }
    if (item?.proposal) {
      return {
        logo: item?.proposal?.company?.logoImg,
        companyName: item?.proposal?.company?.companyName,
        rating: item?.proposal?.company?.googleRating,
        companyId: item?.proposal?.company?._id,
      };
    }
    return null;
  };

  const getPrice = item => {
    if (item?.carId) return item?.quoteId?.totalPrice;
    if (item?.quoteId?.companyData) return item?.totalPrice;
    if (item?.travelQuoteId) return item?.totalPrice;
    if (item?.proposal) return item?.totalPrice;
    return 0;
  };

  const renderMotorPolicyDetails = item => {
    const hasOffers = item?.quoteId?.response?.Offers?.length > 0;
    const offer = hasOffers ? item?.quoteId?.response?.Offers?.[0] : null;

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
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Medical Expenses</Text>
          <Text style={styles.detailValue}>{medicalExpenses}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Loss of Passport</Text>
          <Text style={styles.detailValue}>{lossOfPassport}</Text>
        </View>

        <View style={[styles.detailItem, { borderRightWidth: 0 }]}>
          <Text style={styles.detailLabel}>Luggage Loss</Text>
          <Text style={styles.detailValue}>{luggageLoss}</Text>
        </View>
      </View>
    );
  };

  const renderLandPolicyDetails = item => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Musataha Insurance</Text>
            <Text style={styles.detailValue}>Property Coverage</Text>
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
      case 'Musataha Insurance':
        return renderLandPolicyDetails(item);
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
      case 'Musataha Insurance':
        screenName = SCREEN_NAMES.MUSATAHA_POLICY_DETAIL;
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
          borderRadius: verticalScale(15),
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
            {/* {companyInfo?.logo?.path ? (
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: policyBorderColor },
                ]}
              >
                <Image
                  source={{
                    uri: `${env.API_URL}${companyInfo?.logo?.path}`,
                  }}
                  style={styles.companyLogo}
                  resizeMode="cover"
                />
              </View>
            ) : ( */}
            <View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: policyBorderColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: verticalScale(10),
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
                  width: verticalScale(40),
                  height: verticalScale(40),
                }}
              />
            </View>
            {/* )} */}

            <View style={styles.headerDetails}>
              <Text style={styles.companyName} numberOfLines={1}>
                {companyInfo?.companyName || 'Insurance Company'}
              </Text>
              <Text style={styles.policyText} numberOfLines={1}>
                {item?.policyNumber}
              </Text>
            </View>
          </View>

          {renderPolicyDetails(item)}

          <View style={styles.actionsContainer}>
            <View style={styles.premiumRow}>
              {policyType === 'Motor Insurance' ? (
                <CustomButton
                  title="Cancel Policy Request"
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.CANCELLATION_POLICY, {
                      policyData: item,
                    })
                  }
                  type={'secondary'}
                  buttonStyle={{
                    height: verticalScale(40),
                    width: verticalScale(200),
                    borderColor: theme.colors.border,
                  }}
                  textStyle={{
                    fontSize: verticalScale(14),
                    color: theme.colors.textTertiary,
                  }}
                  icon={
                    <View
                      style={{
                        width: verticalScale(20),
                        height: verticalScale(20),
                      }}
                    >
                      <CancelPolicy />
                    </View>
                  }
                />
              ) : (
                <View style={{ alignItems: 'flex-end' }} />
              )}
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.priceLabel}>Total Premium</Text>
                <Text style={styles.priceValue}>AED {formatNumber(price)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="policy"
        size={verticalScale(64)}
        color={theme.colors.description}
      />
      <Text style={styles.emptyTitle}>No Active Policies</Text>
      <Text style={styles.emptyDescription}>
        You don't have any active policies at the moment.
      </Text>

      <CustomButton
        title="Fetch Policies"
        onPress={() => navigation.navigate(SCREEN_NAMES.FETCH_POLICIES)}
        buttonStyle={{
          width: '60%',
          height: verticalScale(40),
          borderRadius: verticalScale(10),
          backgroundColor: theme.colors.primary,
          marginTop: verticalScale(15),
        }}
        textStyle={{
          fontSize: verticalScale(16),
          fontFamily: 'Lato-Bold',
        }}
        isShowIcon
      />
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
      <Header title="Active Policies" onBack={navigation.goBack} />
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
      gap: verticalScale(15),
    },
    policyCard: {
      padding: verticalScale(15),
    },
    badge: {
      position: 'absolute',
      top: verticalScale(5),
      right: verticalScale(5),
      paddingVertical: verticalScale(3),
      paddingHorizontal: verticalScale(10),
      borderRadius: verticalScale(10),
      zIndex: 1,
      backgroundColor: theme.colors.lableBg,
    },
    badgeText: {
      color: theme.colors.text,
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
    },
    headerSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(16),
    },
    logoContainer: {
      borderRadius: verticalScale(30),
      overflow: 'hidden',
    },
    companyLogo: {
      width: verticalScale(60),
      height: verticalScale(60),
    },
    headerDetails: {
      flex: 1,
      marginLeft: verticalScale(12),
      justifyContent: 'center',
      gap: verticalScale(5),
    },
    companyName: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      width: '90%',
    },
    policyText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    ratingContainer: {
      marginVertical: verticalScale(4),
    },
    viewProfileLink: {
      fontSize: verticalScale(12),
      color: theme.colors.primary,
      textDecorationLine: 'underline',
      fontWeight: '500',
    },
    insuranceTypeText: {
      fontSize: verticalScale(14),
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
      fontSize: verticalScale(12),
      fontWeight: '500',
      color: theme.colors.description,
      marginBottom: verticalScale(2),
    },
    priceValue: {
      fontSize: verticalScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    premiumRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.redLight,
      paddingVertical: verticalScale(10),
      paddingHorizontal: verticalScale(16),
      borderRadius: verticalScale(12),
      borderWidth: 1,
      borderColor: theme.colors.redLight,
    },
    cancelButtonText: {
      fontSize: verticalScale(14),
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
      fontSize: verticalScale(18),
      fontWeight: '700',
      color: theme.colors.text,
      marginTop: verticalScale(16),
      marginBottom: verticalScale(8),
    },
    emptyDescription: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      lineHeight: verticalScale(20),
    },
  });

export default ActivePolicy;
