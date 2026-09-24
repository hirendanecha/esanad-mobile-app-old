import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Modal,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { formatNumber } from '@utils/formateNumber';
import { env } from '@config/index';
import { useThemeContext } from '@theme/ThemeProvider';
import { Images } from '@assets/index';
import { SCREEN_NAMES } from '@constants/screenNames';
import LinearGradient from 'react-native-linear-gradient';
import Header from '@components/ui/Header';
import { verticalScale } from '@constants/metrics';
import Products from '@assets/icons/Products';
import CustomStarRating from '@components/ui/CustomStarRating';
import CustomButton from '@components/ui/CustomButton';
import {
  useDownloadQuote,
  useGetHealthQuote,
  useGetProviderList,
} from '@hooks/HEALTH/healthFlow/useHealthFlow';
import Crown from '@assets/svg/Crown';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pdf from 'react-native-pdf';
import { getBottomMargin } from '@utils/paddingBottom';

const hasHTMLTags = str => {
  return /<[a-z][\s\S]*>/i.test(str);
};

const buildTabsConfig = quoteData => {
  if (!quoteData?.includedCovers?.length) {
    return [];
  }

  const enabledCovers = quoteData.includedCovers.filter(
    cover => cover.isEnabled !== false,
  );

  const policyDetails = [];
  const coPaymentDetails = [];

  enabledCovers.forEach(cover => {
    const title = cover?.benefit?.name;
    if (!title) return;

    let description = '';
    let isHTML = false;

    if (cover.coPay?.description) {
      description = cover.coPay.description;
      isHTML = hasHTMLTags(description);

      if (cover.coPay.coPayValue !== undefined) {
        const amount =
          cover.coPay.coPayType === 'percentage'
            ? `${cover.coPay.coPayValue}%`
            : `AED ${cover.coPay.coPayValue}`;

        const coPayInfo = cover.coPay.coPayLimit
          ? `(Co-pay: ${amount}, Limit: AED ${cover.coPay.coPayLimit})`
          : `(Co-pay: ${amount})`;

        description += ` ${coPayInfo}`;
      }

      coPaymentDetails.push({ title, description, isHTML });
    } else if (cover.detail?.description) {
      description = cover.detail.description;
      isHTML = hasHTMLTags(description);

      if (cover.limitAmount > 0) {
        description += ` (Limit: AED ${formatNumber(cover.limitAmount)})`;
      }

      policyDetails.push({ title, description, isHTML });
    } else if (cover.value) {
      description = cover.value;
      isHTML = hasHTMLTags(description);
      policyDetails.push({ title, description, isHTML });
    } else if (cover.limitAmount > 0) {
      description = `Limit: AED ${formatNumber(cover.limitAmount)}`;
      policyDetails.push({ title, description, isHTML: false });
    }
  });

  const tabs = [];

  if (policyDetails.length > 0) {
    tabs.push({
      label: 'Policy Details',
      chips: policyDetails.map(item => item.title),
      sections: policyDetails,
    });
  }

  if (coPaymentDetails.length > 0) {
    tabs.push({
      label: 'Co-Payment',
      chips: coPaymentDetails.map(item => item.title),
      sections: coPaymentDetails,
    });
  }

  if (quoteData.network?._id) {
    const cityNames = Array.isArray(quoteData.city?.cityName)
      ? quoteData.city.cityName
      : [];

    tabs.push({
      label: 'Network List',
      chips: cityNames,
      sections: [],
    });
  }

  return tabs;
};

const HealthInsuranceDetails = ({ navigation, route }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const { policy_id } = route?.params || {};

  const { data: getQuoteDetails = {} } = useGetHealthQuote({
    reqId: policy_id,
  });

  const { mutate: providerList } = useGetProviderList();

  const { mutate: downloadQuote } = useDownloadQuote();

  console.log(' providerList', providerList);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quoteUrl, setQuoteUrl] = useState(null);
  const [NetworkList, setNetworkList] = useState(null);
  const [tab, setTab] = useState('Policy Details');

  const tabsConfig = useMemo(() => {
    return buildTabsConfig(getQuoteDetails) || [];
  }, [getQuoteDetails]);

  const htmlBaseStyle = {
    color: theme.colors.textTertiary,
    fontSize: verticalScale(14),
    fontFamily: 'Lato-Regular',
    lineHeight: verticalScale(20),
  };

  useEffect(() => {
    if (tabsConfig.length === 0) return;

    const firstTab = tabsConfig[0];
    if (firstTab) {
      setTab(firstTab.label);
    }
  }, [tabsConfig]);

  const handleBuyPolicy = () => {
    navigation.navigate(SCREEN_NAMES.HEALTH_POLICY_BUY_SCREEN, {
      policy_id: getQuoteDetails?._id,
    });
  };

  const activeTabData = tabsConfig.find(t => t.label === tab);
  const sectionsToRender = activeTabData?.sections || [];

  const handleViewQuotation = useCallback(() => {
    if (quoteUrl !== null) {
      setIsModalVisible(true);
      return;
    }

    downloadQuote(
      { reqId: policy_id },
      {
        onSuccess: res => {
          setQuoteUrl(env.API_URL + res?.data?.data?.link);
          setIsModalVisible(true);
        },
        onError: error => {
          console.error('Quote download error:', error);
        },
      },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                uri: `${env.API_URL}/${getQuoteDetails?.company?.logoImg?.path}`,
              }}
              style={styles.companyLogo}
            />

            <View style={styles.companyInfo}>
              <View style={styles.companyNameRow}>
                <Text style={styles.companyName}>
                  {getQuoteDetails?.company?.companyName}
                </Text>
                {getQuoteDetails?.plan?.isBasic ? (
                  <Image
                    source={Images.shield}
                    resizeMode="contain"
                    style={styles.shieldIcon}
                  />
                ) : (
                  <Crown />
                )}
                <Text
                  onPress={() => setTab('Network List')}
                  style={styles.hospitalListText}
                >
                  Hospitals List {'>'}
                </Text>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>
                    {getQuoteDetails?.plan?.planName}
                  </Text>
                </View>

                <View style={styles.maternityBadge}>
                  <Image source={Images.shield} style={styles.maternityIcon} />
                  <Text style={styles.maternityText}>
                    Covers Maternity Benefits
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={[styles.detailColumn, styles.detailBorder]}>
              <Text style={styles.detailLabel}>Cashless Hospitals</Text>
              <Text style={styles.detailValue}>
                {getQuoteDetails?.network?.providers?.length || 0}
              </Text>
            </View>

            <View style={[styles.detailColumn, styles.detailBorder]}>
              <Text style={styles.detailLabel}>Pharmacy Limit</Text>
              <Text style={styles.detailValue}>Upto AED 4,500</Text>
            </View>

            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Cover Amount</Text>
              <Text style={styles.detailValue}>AED 10,00,000</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionButtonsRow}>
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

        {tabsConfig.length > 0 && (
          <View style={styles.tabsContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsList}
              data={tabsConfig}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item.label !== 'Network List') {
                      setTab(item.label);
                    } else {
                      if (NetworkList !== null) {
                        setTab(item.label);
                      } else {
                        providerList(
                          {
                            networkId: getQuoteDetails?.network?._id,
                          },
                          {
                            onSuccess: res => {
                              setNetworkList(res?.data?.data);
                              setTab(item.label);
                            },
                          },
                        );
                      }
                    }
                  }}
                  style={[styles.tab, tab === item.label && styles.activeTab]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      tab === item.label && styles.activeTabText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

        {tab === 'Policy Details' && sectionsToRender.length > 0 && (
          <FlatList
            data={sectionsToRender}
            contentContainerStyle={styles.accordionContainer}
            renderItem={({ item, index }) => {
              return (
                <CustomAccordion
                  title={item?.title}
                  containerStyle={[
                    styles.accordionItem,
                    index === sectionsToRender.length - 1 &&
                      styles.accordionLastItem,
                  ]}
                >
                  <View style={styles.accordionContent}>
                    {item?.isHTML ? (
                      <RenderHTML
                        contentWidth={width - verticalScale(60)}
                        source={{
                          html:
                            item?.description ||
                            '<p>Details will be shared soon.</p>',
                        }}
                        baseStyle={htmlBaseStyle}
                      />
                    ) : (
                      <Text style={styles.accordionText}>
                        {item?.description || 'Details will be shared soon.'}
                      </Text>
                    )}
                  </View>
                </CustomAccordion>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}

        {tab === 'Co-Payment' && sectionsToRender.length > 0 && (
          <FlatList
            data={sectionsToRender}
            contentContainerStyle={styles.accordionContainer}
            renderItem={({ item, index }) => {
              return (
                <CustomAccordion
                  title={item?.title}
                  containerStyle={[
                    styles.accordionItem,
                    index === sectionsToRender.length - 1 &&
                      styles.accordionLastItem,
                  ]}
                >
                  <View style={styles.accordionContent}>
                    {item?.isHTML ? (
                      <RenderHTML
                        contentWidth={width - verticalScale(60)}
                        source={{
                          html:
                            item?.description ||
                            '<p>Details will be shared soon.</p>',
                        }}
                        baseStyle={htmlBaseStyle}
                      />
                    ) : (
                      <Text style={styles.accordionText}>
                        {item?.description || 'Details will be shared soon.'}
                      </Text>
                    )}
                  </View>
                </CustomAccordion>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}

        {tab === 'Network List' && (
          <FlatList
            data={NetworkList?.providers}
            contentContainerStyle={styles.accordionContainer}
            ListEmptyComponent={
              <Text style={styles.emptyStateText}>
                Network information will appear here once available.
              </Text>
            }
            renderItem={({ item, index }) => (
              <CustomAccordion
                title={item?.providerName}
                containerStyle={[
                  styles.accordionItem,
                  index === sectionsToRender.length - 1 &&
                    styles.accordionLastItem,
                ]}
              >
                <View style={styles.accordionContent}>
                  <Text style={styles.accordionText}>
                    {item?.providerAddresss || 'Details will be shared soon.'}
                  </Text>
                </View>
              </CustomAccordion>
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <CustomButton
        title={
          getQuoteDetails?.isReferral
            ? 'Contact us for price'
            : getQuoteDetails?.isPremiumRequestUpon
            ? 'Price upon request'
            : `AED ${formatNumber(getQuoteDetails?.price)} Yearly`
        }
        onPress={handleBuyPolicy}
        buttonStyle={styles.buyButton}
      />
      <Modal
        animationType="slide"
        visible={isModalVisible}
        presentationStyle="formSheet"
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.backgroundColor,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              backgroundColor: theme.colors.backgroundColor,
              padding: verticalScale(10),
            }}
          >
            <TouchableOpacity
              style={{
                padding: verticalScale(10),
              }}
              disabled
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Icon name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: verticalScale(20),
                color: theme.colors.text,
                fontFamily: 'Lato-Bold',
              }}
            >
              Quote
            </Text>
            <TouchableOpacity
              style={{
                padding: verticalScale(10),
              }}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Icon name="close" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <Pdf
            trustAllCerts={false}
            source={{ uri: quoteUrl, cache: true }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onError={error => {
              console.log('error --->', error);
            }}
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
    shieldIcon: {
      width: verticalScale(20),
      height: verticalScale(20),
    },
    hospitalListText: {
      fontSize: verticalScale(12),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
    },
    badgeRow: {
      flexDirection: 'row',
      gap: verticalScale(5),
      alignItems: 'center',
    },
    planBadge: {
      backgroundColor: theme.colors.highlight,
      paddingHorizontal: verticalScale(6),
      paddingVertical: verticalScale(2),
      borderRadius: verticalScale(5),
    },
    planBadgeText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    maternityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(5),
      backgroundColor: theme.colors.floorBgColor,
      paddingHorizontal: verticalScale(6),
      paddingVertical: verticalScale(2),
      borderRadius: verticalScale(5),
    },
    maternityIcon: {
      width: verticalScale(12),
      height: verticalScale(12),
    },
    maternityText: {
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
      borderBottomWidth: verticalScale(3),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: 'transparent',
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
    accordionContainer: {
      backgroundColor: theme.colors.backgroundColor,
      margin: verticalScale(20),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    accordionItem: {
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: 'transparent',
    },
    accordionLastItem: {
      borderBottomWidth: 0,
    },
    accordionContent: {
      marginLeft: verticalScale(20),
      marginBottom: verticalScale(20),
      paddingRight: verticalScale(10),
    },
    accordionText: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
      lineHeight: verticalScale(20),
    },
    contentCard: {
      backgroundColor: theme.colors.bgSecondary,
      margin: verticalScale(20),
      padding: verticalScale(10),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    emptyStateText: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
      paddingVertical: verticalScale(20),
    },
    buyButton: {
      height: verticalScale(50),
      width: Dimensions.get('screen').width - 40,
      alignSelf: 'center',
      marginTop: verticalScale(20),
      marginBottom: getBottomMargin(),
    },
    pdf: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.backgroundColor,
    },
  });

export default HealthInsuranceDetails;
