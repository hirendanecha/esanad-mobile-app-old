import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import { env } from '@config/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import CellRendererUtils from '@utils/CellRendererUtils';
import CustomButton from '@components/ui/CustomButton';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const CardItem = ({
  item,
  index,
  compareCompaniesData,
  onBuyNowPress,
  formatNumber,
  carouselRef,
}) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const prepareBenefitsData = quote => {
    if (!quote) return [];

    const allCovers = [
      ...(quote?.includedCovers || []),
      ...(quote?.extraCovers || []),
    ];

    // Collect all individual benefits
    const benefits = [];

    allCovers.forEach(cover => {
      if (cover?.benefit?._id && cover?.isEnabled) {
        benefits.push({
          name: cover.benefit.name,
          value: getCoverValue(cover),
          description: cover.benefit.description,
          priority: cover.benefit?.priority || 999,
        });
      }
    });

    // Sort by priority
    return benefits.sort((a, b) => {
      if (a.priority === undefined && b.priority === undefined) return 0;
      if (a.priority === undefined) return 1;
      if (b.priority === undefined) return -1;
      return a.priority - b.priority;
    });
  };

  const getCoverValue = cover => {
    if (!cover?.isEnabled) return 'Not Covered';

    // Handle object type benefits
    if (cover?.benefit?.valueType === 'object') {
      const dataObj =
        cover?.coverage ||
        cover?.coPay ||
        cover?.deductible ||
        cover?.detail ||
        {};
      return dataObj.description || 'Covered';
    }

    // Handle simple value types
    if (cover?.value) {
      return cover.value;
    }

    if (cover?.limitAmount && cover.limitAmount !== 0) {
      return `AED ${formatNumber(cover.limitAmount)}`;
    }

    return 'Covered';
  };

  const benefitsData = prepareBenefitsData(item);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.cardContent}
    >
      <LinearGradient
        colors={[
          theme.colors.bgLinear2,
          theme.colors.floorBgColor2,
          theme.colors.bgLinear2,
        ]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: verticalScale(15),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={[styles.navButton, index === 0 && styles.navButtonDisabled]}
          onPress={() => {
            if (index > 0) {
              carouselRef.current?.snapToPrev();
            }
          }}
          disabled={index === 0}
        >
          <Icon
            name="chevron-left"
            size={30}
            color={index === 0 ? theme.colors.border : theme.colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.companyHeader}>
          <Image
            source={{
              uri: item.companyData?.logoImg
                ? `${env.API_URL}${item.companyData.logoImg.path}`
                : 'https://via.placeholder.com/100x50/cccccc/666666?text=Logo',
            }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
          <View
            style={{
              justifyContent: 'space-between',
              gap: verticalScale(10),
            }}
          >
            <Text style={styles.companyName}>
              {item.companyData?.companyName || 'Insurance Company'}
            </Text>

            <CustomButton
              title="Buy Now"
              onPress={() => onBuyNowPress && onBuyNowPress(item._id)}
              buttonStyle={{
                height: 20,
                borderRadius: 4,
                width: 120,
              }}
              textStyle={{
                fontSize: verticalScale(10),
                fontFamily: 'Lato-Bold',
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            index === compareCompaniesData.length - 1 &&
              styles.navButtonDisabled,
          ]}
          onPress={() => {
            if (index < compareCompaniesData.length - 1) {
              carouselRef.current?.snapToNext();
            }
          }}
          disabled={index === compareCompaniesData.length - 1}
        >
          <Icon
            name="chevron-right"
            size={30}
            color={
              index === compareCompaniesData.length - 1
                ? theme.colors.border
                : theme.colors.primary
            }
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Premium (Excl. VAT) */}
      <View style={styles.premiumSection}>
        <Text style={styles.premiumLabel}>Premium (Excl. VAT)</Text>
        <View style={styles.premiumValueContainer}>
          {CellRendererUtils.renderHealthComparisonCell(
            item.isReferral
              ? 'Contact us for price'
              : item.isPremiumRequestUpon
              ? 'Price upon request'
              : `AED ${formatNumber(item.price)}`,
            0,
            0,
            { label: 'Premium (Excl. VAT)', type: 'basic' },
          )}
        </View>
      </View>

      {/* Annual Medical Limit */}
      <View style={styles.highlightSection}>
        <Text style={styles.highlightTitle}>Annual Medical Limit</Text>
        <Text style={styles.highlightValue}>
          {item.annualLimit
            ? `${formatNumber(
                item.annualLimit,
              )} in Pharmacy Limit - Upto AED ${formatNumber(
                item.pharmacyLimit || 5000,
              )}`
            : '1,000,000 in Pharmacy Limit - Upto AED 5,000'}
        </Text>
      </View>

      {/* Member Premiums */}
      {(item?.owner?.length > 0 ||
        item?.spouse?.length > 0 ||
        item?.kids?.length > 0) && (
        <CustomAccordion
          title="Member Premiums"
          containerStyle={styles.accordionContainer}
        >
          <View style={styles.sectionContent}>
            {item?.owner?.length > 0 && (
              <View style={styles.memberRow}>
                <Text style={styles.memberLabel}>
                  Self ({item.owner[0]?.person?.fullName})
                </Text>
                <View style={styles.memberValueContainer}>
                  {CellRendererUtils.renderHealthComparisonCell(
                    item.isReferral
                      ? 'Contact us for price'
                      : item.isPremiumRequestUpon
                      ? 'Price upon request'
                      : `AED ${formatNumber(
                          item.owner[0]?.premium +
                            (item.owner[0]?.loadSum || 0),
                        )}`,
                    0,
                    0,
                    { label: 'Self', type: 'basic' },
                  )}
                </View>
              </View>
            )}
            {item?.spouse?.length > 0 && (
              <View style={styles.memberRow}>
                <Text style={styles.memberLabel}>
                  Spouse ({item.spouse[0]?.person?.fullName})
                </Text>
                <View style={styles.memberValueContainer}>
                  {CellRendererUtils.renderHealthComparisonCell(
                    item.isReferral
                      ? 'Contact us for price'
                      : item.isPremiumRequestUpon
                      ? 'Price upon request'
                      : `AED ${formatNumber(
                          item.spouse[0]?.premium +
                            (item.spouse[0]?.loadSum || 0),
                        )}`,
                    0,
                    0,
                    { label: 'Spouse', type: 'basic' },
                  )}
                </View>
              </View>
            )}
            {item?.kids?.map((kid, idx) => (
              <View key={idx} style={styles.memberRow}>
                <Text style={styles.memberLabel}>
                  Kids ({kid?.person?.fullName})
                </Text>
                <View style={styles.memberValueContainer}>
                  {CellRendererUtils.renderHealthComparisonCell(
                    item.isReferral
                      ? 'Contact us for price'
                      : item.isPremiumRequestUpon
                      ? 'Price upon request'
                      : `AED ${formatNumber(
                          kid?.premium + (kid?.loadSum || 0),
                        )}`,
                    0,
                    0,
                    { label: 'Kids', type: 'basic' },
                  )}
                </View>
              </View>
            ))}
          </View>
        </CustomAccordion>
      )}

      {/* Benefits - Each in its own accordion */}
      {benefitsData.map((benefit, benefitIndex) => (
        <CustomAccordion
          key={benefitIndex}
          title={benefit.name}
          containerStyle={styles.accordionContainer}
        >
          <View style={styles.benefitValueContainer}>
            {CellRendererUtils.renderHealthBenefitCell(
              benefit.value,
              benefitIndex,
              0,
              { label: benefit.name, type: 'benefit' },
            )}
          </View>
        </CustomAccordion>
      ))}
    </ScrollView>
  );
};

const ComparisonCarousel = ({
  compareCompaniesData,
  onBuyNowPress,
  formatNumber,
}) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const renderCard = ({ item, index }) => {
    return (
      <CardItem
        item={item}
        index={index}
        compareCompaniesData={compareCompaniesData}
        onBuyNowPress={onBuyNowPress}
        formatNumber={formatNumber}
        carouselRef={carouselRef}
      />
    );
  };

  if (!compareCompaniesData || compareCompaniesData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No comparison data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={compareCompaniesData}
        renderItem={renderCard}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 32}
        onSnapToItem={index => setActiveSlide(index)}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
        enableMomentum={true}
        decelerationRate="fast"
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    cardContent: {
      flexGrow: 1,
      gap: verticalScale(10),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(50),
    },
    companyHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    companyLogo: {
      width: 100,
      height: 50,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: 8,
      padding: 8,
    },
    companyName: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    buyButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 200,
    },
    buyButtonText: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
    },
    premiumSection: {
      padding: 16,
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: verticalScale(15),
    },
    premiumLabel: {
      fontSize: verticalScale(15),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    premiumValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    highlightSection: {
      padding: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      gap: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(15),
    },
    highlightTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    highlightValue: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.lableText,
      lineHeight: 20,
    },
    accordionContainer: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(15),
    },
    sectionContent: {
      paddingHorizontal: verticalScale(15),
      paddingBottom: verticalScale(15),
    },
    benefitDetailContainer: {
      backgroundColor: theme.colors.floorBgColor,
      padding: 16,
    },
    benefitDescription: {
      fontSize: verticalScale(13),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      marginBottom: 12,
      lineHeight: 18,
    },
    benefitValueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    benefitValueLabel: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    memberRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    memberLabel: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      flex: 1,
    },
    memberValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    benefitValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: verticalScale(15),
      paddingBottom: verticalScale(15),
    },
    navigationContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    navButton: {
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    navButtonDisabled: {
      opacity: 0.3,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
  });

export default ComparisonCarousel;
