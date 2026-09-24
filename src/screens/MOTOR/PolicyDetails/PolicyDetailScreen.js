import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { formatNumber } from '@utils/formateNumber';
import {
  useDownloadQuote,
  useGetExtraFeatures,
  useGetPolicyDetails,
  useGetProduct,
} from '@hooks/policy/useMotorPolicy';
import { env } from '@config/index';
import { usePolicyStore } from '@store/MOTOR/policyStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';
import { SCREEN_NAMES } from '@constants/screenNames';
import { verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import Products from '@assets/icons/Products';
import CustomStarRating from '@components/ui/CustomStarRating';
import CustomButton from '@components/ui/CustomButton';
import { getBottomMargin } from '@utils/paddingBottom';

const TAX_RATE = 0.05;

const safeNumber = value => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const safeFormatNumber = value => {
  if (isNaN(value) || value == null) return '0';
  return formatNumber(value);
};

const calculateFinalAmount = amount => {
  const safeAmount = safeNumber(amount);
  if (safeAmount <= 0) return 0;
  const tax = safeAmount * TAX_RATE;
  return safeAmount + tax;
};

const PolicyDetailScreen = ({ navigation, route }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const { policy_id } = route?.params || {};

  const { data: getQuoteDetails = {} } = useGetPolicyDetails({ id: policy_id });
  const { data: productsData = [] } = useGetProduct();
  const { mutate: getExtraFeature } = useGetExtraFeatures();
  const { mutate: downloadQuote } = useDownloadQuote();
  const { extraFeatureInfo, updateExtraFeature } = usePolicyStore();

  const [totalAEDAmount, setTotalAEDAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tab, setTab] = useState('Coverage');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quoteUrl, setQuoteUrl] = useState(null);

  const featureArray = useMemo(() => {
    const extraFeatures = getQuoteDetails?.ExtraFeatures || [];
    const free = extraFeatures.filter(f => safeNumber(f.Amount) === 0);
    const paid = extraFeatures.filter(f => safeNumber(f.Amount) !== 0);
    return [...free, ...paid];
  }, [getQuoteDetails?.ExtraFeatures]);

  useEffect(() => {
    const quoteTotalPrice = safeNumber(getQuoteDetails?.quoteInfo?.totalPrice);
    const quoteDiscountPrice = safeNumber(
      getQuoteDetails?.quoteInfo?.discountPrice,
    );

    setDiscountAmount(quoteDiscountPrice);

    if (!totalAEDAmount || totalAEDAmount === 0) {
      setTotalAEDAmount(quoteTotalPrice);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getQuoteDetails]);

  useEffect(() => {
    let amount = safeNumber(extraFeatureInfo?.price);

    if (!extraFeatureInfo?.price && getQuoteDetails?.quoteInfo?.totalPrice) {
      amount = safeNumber(getQuoteDetails.quoteInfo.totalPrice);
    }

    extraFeatureInfo?.addOns?.forEach(item => {
      amount += safeNumber(item.price);
    });

    extraFeatureInfo?.extraFeatures?.forEach(item => {
      amount += safeNumber(item.Amount);
    });

    setTotalAEDAmount(amount);
    setDiscountAmount(
      safeNumber(
        extraFeatureInfo?.discountPrice ||
          getQuoteDetails?.quoteInfo?.discountPrice,
      ),
    );
  }, [extraFeatureInfo, getQuoteDetails]);

  useEffect(() => {
    return () => updateExtraFeature(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callPolicyInfoAPI = useCallback(
    (id, addOns, extraFeatures) => {
      getExtraFeature({ summaryId: id, data: { addOns, extraFeatures } });
    },
    [getExtraFeature],
  );

  const handleFeatureToggle = useCallback(
    (feature, isChecked) => {
      const currentFeatures =
        extraFeatureInfo?.extraFeatures ||
        getQuoteDetails?.quoteInfo?.extraFeatures ||
        [];

      const updatedFeatures = isChecked
        ? [...currentFeatures, feature]
        : currentFeatures.filter(
            f => f?.benifitDetail?._id !== feature.benifitDetail?._id,
          );

      callPolicyInfoAPI(
        getQuoteDetails._id,
        extraFeatureInfo?.addOns || getQuoteDetails?.quoteInfo?.addOns || [],
        updatedFeatures,
      );
    },
    [extraFeatureInfo, getQuoteDetails, callPolicyInfoAPI],
  );

  const handleAddOnToggle = useCallback(
    (addOn, isChecked) => {
      const currentAddOns =
        extraFeatureInfo?.addOns || getQuoteDetails?.quoteInfo?.addOns || [];

      const updatedAddOns = isChecked
        ? [...currentAddOns, addOn]
        : currentAddOns.filter(a => a._id !== addOn._id);

      callPolicyInfoAPI(
        getQuoteDetails._id,
        updatedAddOns,
        extraFeatureInfo?.extraFeatures ||
          getQuoteDetails?.quoteInfo?.extraFeatures ||
          [],
      );
    },
    [extraFeatureInfo, getQuoteDetails, callPolicyInfoAPI],
  );

  const isFeatureSelected = useCallback(
    feature => {
      if (safeNumber(feature?.Amount) === 0 || feature?.isMandatory) {
        return true;
      }

      const selectedFeatures =
        extraFeatureInfo?.extraFeatures ||
        getQuoteDetails?.quoteInfo?.extraFeatures ||
        [];

      return selectedFeatures.some(
        f => f.benifitDetail?._id === feature.benifitDetail?._id,
      );
    },
    [extraFeatureInfo, getQuoteDetails],
  );

  const isAddOnSelected = useCallback(
    addOn => {
      if (safeNumber(addOn?.price) === 0) return true;

      const selectedAddOns =
        extraFeatureInfo?.addOns || getQuoteDetails?.quoteInfo?.addOns || [];

      return selectedAddOns.some(a => a._id === addOn._id);
    },
    [extraFeatureInfo, getQuoteDetails],
  );

  const handleViewQuotation = useCallback(() => {
    if (quoteUrl) {
      setIsModalVisible(true);
      return;
    }

    downloadQuote(
      { refId: policy_id },
      {
        onSuccess: res => {
          setQuoteUrl(env.API_BASE_URL + res?.data?.data?.link);
          setIsModalVisible(true);
        },
        onError: error => {
          console.error('Quote download error:', error);
        },
      },
    );
  }, [quoteUrl, policy_id, downloadQuote]);

  const handleBuyPolicy = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.BUY_POLICY_SCREEN, { policy_id });
  }, [navigation, policy_id]);

  const finalAmount = calculateFinalAmount(totalAEDAmount);
  const finalDiscountAmount = calculateFinalAmount(discountAmount);

  const insuranceType =
    getQuoteDetails?.insuranceType === 'thirdparty'
      ? 'Third Party'
      : getQuoteDetails?.insuranceType || 'Insurance';

  const getButtonTitle = () => {
    if (getQuoteDetails?.quoteInfo?.isWithoutMatrixOrApi) {
      return 'Ask for Price';
    }
    if (discountAmount !== 0) {
      return `AED ${safeFormatNumber(finalDiscountAmount)}`;
    }
    return `AED ${safeFormatNumber(Math.ceil(finalAmount))} Yearly`;
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Insurance Detail" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.policyCard}>
          <View style={styles.companyHeader}>
            <Image
              source={{
                uri: `${env.API_URL}${getQuoteDetails?.company?.logoImg?.path}`,
              }}
              style={styles.companyLogo}
            />

            <View style={styles.companyInfo}>
              <View style={styles.companyNameRow}>
                <Text style={styles.companyName}>
                  {getQuoteDetails?.QuatationCompanyName}
                </Text>
                <Text style={styles.insuranceTypeBadge}>{insuranceType}</Text>
              </View>

              <View style={styles.badgeRow}>
                {getQuoteDetails?.QuatationType === 'comprehensive' &&
                  getQuoteDetails?.quoteInfo?.isMatrix && (
                    <View style={styles.indicativeBadge}>
                      <Text style={styles.badgeText}>Indicative Rates</Text>
                    </View>
                  )}

                {!getQuoteDetails?.quoteInfo?.companyId
                  ?.eSanadRecommendation && (
                  <View style={styles.recommendBadge}>
                    <Image
                      source={Images.companyLogo}
                      style={styles.badgeIcon}
                    />
                    <Text style={styles.badgeText}>eSanad Recommends</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={[styles.detailColumn, styles.detailBorder]}>
              <Text style={styles.detailLabel}>Car Value (AED)</Text>
              <Text style={styles.detailValue}>
                AED {formatNumber(getQuoteDetails?.quoteInfo?.carValue || 0)}
              </Text>
            </View>

            <View style={[styles.detailColumn, styles.detailBorder]}>
              <Text style={styles.detailLabel}>Cover Amount</Text>
              <Text style={styles.detailValue}>
                {typeof getQuoteDetails?.quoteInfo?.response
                  ?.IncludedFeatures[0]?.value === 'number'
                  ? `AED ${getQuoteDetails.quoteInfo.response.IncludedFeatures[0].value}`
                  : getQuoteDetails?.quoteInfo?.response?.IncludedFeatures[0]
                      ?.value || '-'}
              </Text>
            </View>

            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Excess Charge (AED)</Text>
              <Text style={styles.detailValue}>
                {getQuoteDetails?.quoteInfo?.excessPrice}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionButtonsRow}>
            {/* <TouchableOpacity
              disabled
              activeOpacity={0.8}
              style={styles.actionButton}
            >
              <Products size={verticalScale(18)} />
              <Text style={styles.actionButtonText}>Policy Wording</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={handleViewQuotation}
              activeOpacity={0.8}
              style={styles.actionButton}
            >
              <Products size={verticalScale(18)} />
              <Text style={styles.actionButtonText}>View Quotation</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Client Rating:</Text>
              <CustomStarRating
                rating={getQuoteDetails?.company?.googleRating}
                size={verticalScale(16)}
                color={theme.colors.star}
              />
              <Text style={styles.ratingValue}>
                ({getQuoteDetails?.company?.googleRating})
              </Text>
            </View>

            <View style={styles.discountContainer}>
              <Image source={Images.off} style={styles.discountIcon} />
              <Text style={styles.discountText}>Inc. 5% off</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
            data={['Coverage', 'Benefits', 'Add-Ons']}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTab(item)}
                style={[styles.tab, tab === item && styles.activeTab]}
              >
                <Text
                  style={[styles.tabText, tab === item && styles.activeTabText]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {tab === 'Coverage' && (
          <View style={styles.contentCard}>
            {getQuoteDetails?.IncludedFeatures?.length > 0 ? (
              getQuoteDetails.IncludedFeatures.map((val, idx) =>
                val.Title ? (
                  <View key={idx} style={styles.coverageItem}>
                    <Text numberOfLines={1} style={styles.coverageTitle}>
                      {val?.Title || ''}
                    </Text>
                    <Text style={styles.coverageAmount}>AED {val.Amount}</Text>
                  </View>
                ) : null,
              )
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No coverage information available.
                </Text>
              </View>
            )}
          </View>
        )}

        {tab === 'Benefits' && (
          <View style={styles.contentCard}>
            {featureArray?.length > 0 ? (
              featureArray.map((val, idx) => {
                const amount = safeNumber(val?.Amount);
                const isFree = amount === 0;
                const isDisabled = isFree || val?.isMandatory;

                return (
                  <View key={idx} style={styles.benefitItem}>
                    <View style={styles.benefitInfo}>
                      <Text style={styles.benefitTitle}>
                        {val?.Title || val?.Name || '-'}
                      </Text>
                      <Text style={styles.benefitPrice}>
                        {isFree ? '' : `AED ${safeFormatNumber(amount)}`}
                      </Text>
                    </View>

                    {!isFree && (
                      <Switch
                        value={isFeatureSelected(val)}
                        onValueChange={value => handleFeatureToggle(val, value)}
                        disabled={isDisabled}
                        trackColor={{
                          false: theme.colors.backgroundColor,
                          true: theme.colors.primary,
                        }}
                        thumbColor={theme.colors.backgroundColor}
                        style={
                          isDisabled
                            ? styles.switchDisabled
                            : styles.switchEnabled
                        }
                      />
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No benefits information available.
                </Text>
              </View>
            )}
          </View>
        )}

        {tab === 'Add-Ons' && (
          <View style={styles.contentCard}>
            {productsData?.length > 0 ? (
              productsData.map((item, idx) => {
                const isDisabled =
                  safeNumber(item?.price) === 0 || item?.isMandatory;

                return (
                  <React.Fragment key={idx}>
                    <View style={styles.addonItem}>
                      <View style={styles.addonInfo}>
                        <Text style={styles.addonTitle}>
                          {item?.productName || ''}
                        </Text>
                        <Text style={styles.addonDescription}>
                          {item?.description || ''}
                        </Text>
                        <Text style={styles.addonPrice}>
                          {`${item?.currency || 'AED'} ${safeFormatNumber(
                            item?.price,
                          )}`}
                        </Text>
                      </View>

                      <Switch
                        value={isAddOnSelected(item)}
                        onValueChange={value => handleAddOnToggle(item, value)}
                        disabled={isDisabled}
                        trackColor={{
                          false: theme.colors.border,
                          true: theme.colors.primary,
                        }}
                        thumbColor={theme.colors.bgColor}
                        style={
                          isDisabled
                            ? styles.switchDisabled
                            : styles.switchEnabled
                        }
                      />
                    </View>

                    {idx !== productsData.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No add-ons available.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <CustomButton
        title={getButtonTitle()}
        onPress={handleBuyPolicy}
        buttonStyle={styles.buyButton}
      />

      <Modal
        animationType="slide"
        visible={isModalVisible}
        presentationStyle="formSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderSpacer} />
            <Text style={styles.modalTitle}>Quote</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Icon name="close" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {console.log('quoteUrl', quoteUrl)}
          <Pdf
            source={{ uri: quoteUrl, cache: true }}
            trustAllCerts={false}
            style={styles.pdf}
          />
        </View>
      </Modal>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    policyCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(10),
      gap: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
      margin: verticalScale(20),
    },
    companyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    companyLogo: {
      width: verticalScale(60),
      height: verticalScale(48),
      marginRight: verticalScale(10),
      resizeMode: 'contain',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(5),
    },
    companyInfo: {
      gap: verticalScale(5),
      flex: 1,
    },
    companyNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    companyName: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    insuranceTypeBadge: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      backgroundColor: `${theme.colors.border}90`,
      padding: verticalScale(3),
      borderRadius: verticalScale(5),
    },
    badgeRow: {
      flexDirection: 'row',
      gap: verticalScale(5),
      alignItems: 'center',
    },
    indicativeBadge: {
      backgroundColor: theme.colors.highlight,
      paddingHorizontal: verticalScale(6),
      paddingVertical: verticalScale(2),
      borderRadius: verticalScale(5),
    },
    recommendBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(5),
      backgroundColor: theme.colors.floorBgColor,
      paddingHorizontal: verticalScale(6),
      paddingVertical: verticalScale(2),
      borderRadius: verticalScale(5),
    },
    badgeIcon: {
      width: verticalScale(12),
      height: verticalScale(12),
    },
    badgeText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    detailColumn: {
      flex: 1,
      gap: verticalScale(5),
    },
    detailBorder: {
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    detailLabel: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    detailValue: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    divider: {
      height: verticalScale(1),
      backgroundColor: theme.colors.border,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      gap: verticalScale(10),
      alignItems: 'center',
      backgroundColor: theme.colors.bgSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: verticalScale(35),
      justifyContent: 'center',
      borderRadius: verticalScale(5),
    },
    actionButtonText: {
      color: theme.colors.textTertiary,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
    },
    ratingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ratingContainer: {
      flexDirection: 'row',
      gap: verticalScale(5),
      alignItems: 'center',
    },
    ratingLabel: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
    },
    ratingValue: {
      fontFamily: 'Lato-Black',
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
    },
    discountContainer: {
      flexDirection: 'row',
      gap: verticalScale(5),
      alignItems: 'center',
    },
    discountIcon: {
      width: verticalScale(15),
      height: verticalScale(15),
    },
    discountText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    tabsContainer: {
      height: verticalScale(45),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    tabsList: {
      flexGrow: 1,
    },
    tab: {
      flex: 1,
      paddingHorizontal: verticalScale(30),
      borderBottomWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: theme.colors.border,
    },
    activeTab: {
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: verticalScale(16),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Bold',
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    contentCard: {
      backgroundColor: theme.colors.bgSecondary,
      margin: verticalScale(20),
      padding: verticalScale(10),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: verticalScale(10),
    },
    coverageItem: {
      justifyContent: 'space-between',
      marginBottom: verticalScale(10),
      gap: verticalScale(5),
    },
    coverageTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Bold',
    },
    coverageAmount: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
    },
    benefitItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(10),
      gap: verticalScale(5),
    },
    benefitInfo: {
      gap: verticalScale(5),
    },
    benefitTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    benefitPrice: {
      fontSize: verticalScale(14),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
    },
    addonItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    addonInfo: {
      gap: verticalScale(5),
      flex: 1,
    },
    addonTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    addonDescription: {
      fontSize: verticalScale(12),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
    },
    addonPrice: {
      fontSize: verticalScale(14),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      width: '100%',
    },
    emptyStateText: {
      fontSize: verticalScale(12),
      color: theme.colors.description,
      fontFamily: 'Lato-Bold',
    },
    switchDisabled: {
      opacity: 0.5,
    },
    switchEnabled: {
      opacity: 1,
    },
    buyButton: {
      height: verticalScale(50),
      width: Dimensions.get('screen').width - 40,
      alignSelf: 'center',
      marginTop: verticalScale(20),
      marginBottom: getBottomMargin(),
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      padding: verticalScale(10),
    },
    modalHeaderSpacer: {
      padding: verticalScale(10),
      width: 40,
    },
    modalTitle: {
      fontSize: verticalScale(20),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    modalCloseButton: {
      padding: verticalScale(10),
    },
    pdf: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.backgroundColor,
    },
  });

export default PolicyDetailScreen;
