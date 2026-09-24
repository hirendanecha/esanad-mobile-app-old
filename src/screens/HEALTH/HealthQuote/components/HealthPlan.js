import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { formatNumber } from '@utils/formateNumber';
import { env } from '@config/index';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import CustomButton from '@components/ui/CustomButton';
import { SCREEN_NAMES } from '@constants/screenNames';
import RenderHTML, { TRenderEngineProvider } from 'react-native-render-html';
import { Images } from '@assets/index';
import Crown from '@assets/svg/Crown';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const HealthPlans = ({
  setMorePlansHandler,
  openMemberHintMatch,
  idx,
  match,
  company,
  plan,
  navigation,
  onUpdate,
  isCompare,
}) => {
  const [medicalCover, setMedicalCover] = useState(0);
  const [currentNetworkName, setNetworkName] = useState('');
  const [consultation, setConsultation] = useState(0);

  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  // useEffect(() => {
  //   if (plan) {
  //     const match = [...plan?.extraCovers, ...plan?.includedCovers]?.find(
  //       i => i?.benefit?.name === 'Aggregate Annual limit',
  //     );
  //     if (match?.limitAmount) setMedicalCover(match?.limitAmount);

  //     const match2 = [...plan?.extraCovers, ...plan?.includedCovers]?.find(
  //       i => i?.benefit?.name === 'Physician Consultation',
  //     );
  //     if (
  //       match2?.deductible?.deductibleValue &&
  //       match2?.deductible?.deductibleType
  //     ) {
  //       if (match2?.deductible?.deductibleType === 'percentage') {
  //         setConsultation(`${match2?.deductible?.deductibleValue} %`);
  //       } else if (match2?.deductible?.deductibleType === 'fixedPrice') {
  //         setConsultation(`AED ${match2?.deductible?.deductibleValue}`);
  //       }
  //     }

  //     const match3 = [...plan?.extraCovers, ...plan?.includedCovers]?.find(
  //       i => i?.benefit?.name === 'Medical Network',
  //     );
  //     if (match3) {
  //       if (match3?.detail?.description) {
  //         setNetworkName(
  //           match3?.detail?.description
  //             ?.split('<p>')
  //             .join(' ')
  //             .split('</p>')
  //             .join(' '),
  //         );
  //       } else if (match3?.detail?.value) {
  //         setNetworkName(match3?.detail?.value);
  //       } else {
  //         setNetworkName(match3?.value);
  //       }
  //     }
  //   }
  // }, [plan]);

  const handleBuyPolicy = async () => {
    console.log('healthSummuryID', plan?._id);

    navigation.navigate(SCREEN_NAMES.HEALTH_POLICY_BUY_SCREEN, {
      policy_id: plan?._id,
    });
  };

  const handleInfoPolicy = async () => {
    navigation.navigate(SCREEN_NAMES.HEALTH_INSURANCE_DETAILS, {
      policy_id: plan?._id,
    });
  };

  const logoSource = company?.company?.logoImg && {
    uri: `${env.API_URL}/${company?.company?.logoImg?.path}`,
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleInfoPolicy}
        style={[
          {
            backgroundColor: theme.colors.backgroundColor,
            borderRadius: verticalScale(10),
            padding: verticalScale(10),
            gap: verticalScale(15),
            borderWidth: 1,
            borderColor: theme.colors.border,
            width: Dimensions.get('screen').width - 30,
            alignSelf: 'center',
          },
          isCompare && { borderColor: theme.colors.primary },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoSource}
            style={{
              width: verticalScale(60),
              height: verticalScale(48),
              marginRight: verticalScale(10),
              resizeMode: 'contain',
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: verticalScale(5),
            }}
          />

          <View style={{ gap: verticalScale(5) }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: verticalScale(10),
              }}
            >
              <Text
                style={{
                  fontSize: verticalScale(14),
                  fontFamily: 'Lato-Bold',
                  color: theme.colors.text,
                }}
              >
                {company?.company?.companyName}
              </Text>
              {plan?.plan?.isBasic ? (
                <Image
                  source={Images.shield}
                  resizeMode="contain"
                  style={{
                    width: verticalScale(20),
                    height: verticalScale(20),
                  }}
                />
              ) : (
                <Crown />
              )}

              <Text
                style={{
                  fontSize: verticalScale(12),
                  color: theme.colors.primary,
                  fontFamily: 'Lato-Regular',
                }}
              >
                Hospitals List {'>'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: verticalScale(5),
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.highlight,
                  paddingHorizontal: verticalScale(6),
                  paddingVertical: verticalScale(2),
                  borderRadius: verticalScale(5),
                }}
              >
                <Text
                  style={{
                    fontSize: verticalScale(12),
                    fontFamily: 'Lato-Regular',
                    color: theme.colors.text,
                  }}
                >
                  {plan?.plan?.planName}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: verticalScale(5),
                  backgroundColor: theme.colors.floorBgColor,
                  paddingHorizontal: verticalScale(6),
                  paddingVertical: verticalScale(2),
                  borderRadius: verticalScale(5),
                }}
              >
                <Image
                  source={Images.shield}
                  style={{
                    width: verticalScale(12),
                    height: verticalScale(12),
                  }}
                />
                <Text
                  style={{
                    fontSize: verticalScale(12),
                    fontFamily: 'Lato-Regular',
                    color: theme.colors.text,
                  }}
                >
                  Covers Maternity benefits
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: verticalScale(10) }}>
          <View
            style={[
              {
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: theme.colors.description,
                gap: verticalScale(5),
              },
            ]}
          >
            <Text
              style={{
                fontSize: verticalScale(12),
                color: theme.colors.textTertiary,
                fontFamily: 'Lato-Regular',
              }}
            >
              Pharmacy Limit
            </Text>
            <Text
              style={{
                fontSize: verticalScale(14),
                color: theme.colors.text,
                fontFamily: 'Lato-Bold',
              }}
            >
              Upto AED 4,500
            </Text>
          </View>

          <View
            style={[
              {
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: theme.colors.description,
                gap: verticalScale(5),
              },
            ]}
          >
            <Text
              style={{
                fontSize: verticalScale(12),
                color: theme.colors.textTertiary,
                fontFamily: 'Lato-Regular',
              }}
            >
              Cover Amount
            </Text>
            <Text
              style={{
                fontSize: verticalScale(14),
                color: theme.colors.text,
                fontFamily: 'Lato-Bold',
              }}
            >
              AED 10,00,000
            </Text>
          </View>

          <View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                borderRightWidth: 0,
                borderRightColor: theme.colors.description,
                gap: verticalScale(5),
              },
            ]}
          >
            <Icon
              name="info-with-circle"
              size={14}
              color={theme.colors.primary}
            />

            <Text
              style={{
                fontSize: verticalScale(14),
                color: theme.colors.text,
                fontFamily: 'Lato-Bold',
              }}
            >
              Plan Info
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: verticalScale(10),
          }}
        >
          <TouchableOpacity
            onPress={() => onUpdate(plan)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
              gap: verticalScale(5),
              flex: 1,
            }}
          >
            <Icon
              name={isCompare ? 'check' : 'circle'}
              size={isCompare ? 15 : 15}
              color={isCompare ? theme.colors.primary : theme.colors.border}
            />
            <Text
              style={{
                fontSize: verticalScale(12),
                fontFamily: 'Lato-Regular',
                color: theme.colors.textTertiary,
              }}
            >
              {isCompare ? 'Added Compare' : 'Add to Compare'}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              gap: verticalScale(5),
              alignItems: 'center',
            }}
          >
            <Image
              source={Images.off}
              style={{ width: verticalScale(15), height: verticalScale(15) }}
            />
            <Text
              style={{
                fontSize: verticalScale(12),
                fontFamily: 'Lato-Regular',
                color: theme.colors.textTertiary,
              }}
            >
              Inc. 5% off
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: verticalScale(8),
              paddingHorizontal: verticalScale(16),
              borderRadius: verticalScale(8),
            }}
            onPress={handleBuyPolicy}
          >
            <Text
              style={{
                fontSize: verticalScale(12),
                fontFamily: 'Lato-Bold',
                color: theme.colors.textSecondary,
              }}
            >
              {plan?.isReferral
                ? 'Contact us for price'
                : plan?.isPremiumRequestUpon
                ? 'Price upon request'
                : `AED ${formatNumber(plan?.price)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.container}>
        {idx === 0 && !match && company?.plans?.length > 1 && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setMorePlansHandler(company?.company?._id)}
          >
            <Text style={styles.showMoreText}>
              View {company?.plans?.length - 1} More Plans {'>'}
            </Text>
          </TouchableOpacity>
        )}
        {company?.plans?.length - 1 === idx && company?.plans?.length > 1 && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setMorePlansHandler(company?.company?._id)}
          >
            <Text style={styles.showMoreText}>Hide Plans {'>'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundColor,
      marginBottom: verticalScale(8),
    },
    header: {
      padding: verticalScale(8),
    },
    headerContent: {
      flexDirection: 'row',
      padding: verticalScale(8),
      gap: verticalScale(8),
    },
    logo: {
      width: verticalScale(75),
      height: verticalScale(75),
      borderRadius: verticalScale(5),
    },
    headerRight: {
      flex: 1,
      justifyContent: 'center',
      gap: verticalScale(4),
    },
    companyName: {
      color: theme.colors.text,
      fontSize: verticalScale(15),
      fontWeight: '600',
    },
    insuranceTypeText: {
      color: theme.colors.description,
      fontSize: verticalScale(11),
      marginTop: verticalScale(2),
    },
    viewProfileText: {
      color: theme.colors.text,
      fontSize: verticalScale(12),
      textDecorationLine: 'underline',
    },
    infoSection: {
      borderTopWidth: verticalScale(1),
      borderBottomWidth: verticalScale(1),
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.floorBgColor,
      padding: verticalScale(10),
    },
    infoRow: {
      gap: verticalScale(2),
    },
    infoItem: {
      flexDirection: isTablet ? 'column' : 'row',
      justifyContent: 'space-between',
    },
    infoLabel: {
      color: theme.colors.primary,
      fontSize: verticalScale(13),
      fontWeight: '600',
    },
    infoValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(4),
    },
    infoValue: {
      color: theme.colors.description,
      fontSize: verticalScale(14),
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    actionSection: {
      flexDirection: 'column',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: isTablet ? 'center' : 'flex-end',
      paddingVertical: verticalScale(16),
      paddingHorizontal: verticalScale(16),
      borderWidth: 0.5,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      textDecorationLine: isTablet ? 'underline' : 'none',
    },
    priceSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(16),
      paddingHorizontal: verticalScale(8),
      position: 'relative',
    },
    buyButton: {
      backgroundColor: theme.colors.highlight,
      borderRadius: verticalScale(7),
      borderWidth: 1,
      borderColor: theme.colors.highlight,
      minWidth: verticalScale(120),
      height: verticalScale(30),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: verticalScale(16),
    },
    buyButtonText: {
      color: theme.colors.text,
      fontSize: verticalScale(13),
      fontWeight: '700',
    },
    premiumDetailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(8),
      marginTop: verticalScale(8),
    },
    premiumDetailsText: {
      fontSize: verticalScale(13),
      fontWeight: '500',
      color: theme.colors.description,
    },
    tooltipContainer: {
      position: 'absolute',
      top: verticalScale(100),
      left: '10%',
      right: '10%',
      backgroundColor: theme.colors.primary,
      borderRadius: verticalScale(10),
      padding: verticalScale(8),
      maxHeight: verticalScale(300),
      zIndex: 1000,
    },
    tooltipScroll: {
      maxHeight: verticalScale(280),
    },
    tooltipText: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(15),
      fontWeight: '500',
      textAlign: 'center',
    },
    premiumRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(4),
      minWidth: verticalScale(200),
    },
    premiumLabel: {
      fontSize: verticalScale(13),
      color: theme.colors.textSecondary,
      fontWeight: '400',
    },

    tooltipDivider: {
      height: verticalScale(1),
      backgroundColor: theme.colors.textSecondary,
      marginVertical: verticalScale(8),
    },
    tooltipDashedDivider: {
      height: verticalScale(1),
      backgroundColor: theme.colors.textSecondary,
      marginVertical: verticalScale(8),
      borderStyle: 'dashed',
    },
    showMoreButton: {
      width: '35%',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderTopWidth: 0,
      backgroundColor: theme.colors.floorBgColor,
      borderBottomLeftRadius: verticalScale(5),
      borderBottomRightRadius: verticalScale(5),
      paddingVertical: verticalScale(5),
    },
    showMoreText: {
      fontSize: verticalScale(12),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
    },
  });

export default HealthPlans;
