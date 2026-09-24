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

  // Get the index of this item in the data array
  const itemIndex =
    compareCompaniesData?.data?.findIndex(d => d._id === item._id) ?? 0;

  // Prepare basic information
  const basicInfo = [
    {
      label: 'Premium (Excl. VAT)',
      value: item.quoteInfo?.isWithoutMatrixOrApi
        ? 'Ask for price'
        : item.quoteInfo?.discountPrice !== 0
        ? `AED ${formatNumber(
            parseInt(item.quoteInfo.discountPrice * 100) / 100,
          )}`
        : `AED ${formatNumber(
            parseInt(item.quoteInfo.totalPrice * 100) / 100,
          )}`,
    },
    {
      label: 'Sum Insured (Vehicle Value)',
      value:
        item.insuranceType === 'comprehensive' && item.quoteInfo?.sumInsured
          ? `AED ${formatNumber(item.quoteInfo.sumInsured)}`
          : '-',
    },
    {
      label: 'Type',
      value:
        item.insuranceType === 'thirdparty'
          ? 'Third Party'
          : item.insuranceType,
    },
    {
      label: 'Excess',
      value: (() => {
        if (
          item.quoteInfo?.isWithoutMatrixOrApi ||
          item.insuranceType === 'thirdparty'
        ) {
          return '-';
        }
        const excessAmount = item.Offers?.[0]?.ExcessAmount;
        if (excessAmount === 0) return '✕';
        if (!excessAmount) return '-';
        return `AED ${formatNumber(excessAmount)}`;
      })(),
    },
    {
      label: 'Takaful Insurance',
      value: item.company?.isTakaful === true ? 'Yes' : 'No',
    },
  ];

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
              uri: item.company?.logoImg
                ? `${env.API_URL}${item.company.logoImg.path}`
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
              {item.QuatationCompanyName || 'Insurance Company'}
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
            index === compareCompaniesData.data.length - 1 &&
              styles.navButtonDisabled,
          ]}
          onPress={() => {
            if (index < compareCompaniesData.data.length - 1) {
              carouselRef.current?.snapToNext();
            }
          }}
          disabled={index === compareCompaniesData.data.length - 1}
        >
          <Icon
            name="chevron-right"
            size={30}
            color={
              index === compareCompaniesData.data.length - 1
                ? theme.colors.border
                : theme.colors.primary
            }
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Basic Information */}
      {basicInfo.map((info, idx) => (
        <View key={idx} style={styles.infoSection}>
          <Text style={styles.infoLabel}>{info.label}</Text>
          <View style={styles.infoValueContainer}>
            {CellRendererUtils.renderComparisonCell(info.value, idx, 0, {
              label: info.label,
              type: 'basic',
            })}
          </View>
        </View>
      ))}

      {/* Coverages - Each in its own accordion */}
      {compareCompaniesData?.coverages?.map((coverage, coverageIndex) => {
        const coverageValue = coverage.values?.[itemIndex];

        return (
          <CustomAccordion
            key={coverageIndex}
            title={coverage.Title}
            containerStyle={styles.accordionContainer}
          >
            <View style={styles.benefitValueContainer}>
              {CellRendererUtils.renderCoverageCell(
                coverageValue,
                coverageIndex,
                itemIndex,
                coverage,
              )}
            </View>
          </CustomAccordion>
        );
      })}

      {/* Benefits - Each in its own accordion */}
      {compareCompaniesData?.benefits?.map((benefit, benefitIndex) => {
        const benefitValue = benefit.values?.[itemIndex];

        return (
          <CustomAccordion
            key={benefitIndex}
            title={benefit.Title}
            containerStyle={styles.accordionContainer}
          >
            <View style={styles.benefitValueContainer}>
              {CellRendererUtils.renderBenefitCell(
                benefitValue,
                benefitIndex,
                itemIndex,
                benefit,
              )}
            </View>
          </CustomAccordion>
        );
      })}
    </ScrollView>
  );
};

const MotorComparisonCarousel = ({
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

  if (!compareCompaniesData?.data || compareCompaniesData.data.length === 0) {
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
        data={compareCompaniesData.data}
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
    infoSection: {
      padding: 16,
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: verticalScale(15),
    },
    infoLabel: {
      fontSize: verticalScale(15),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    infoValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    accordionContainer: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(15),
    },
    benefitValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: verticalScale(15),
      paddingBottom: verticalScale(15),
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

export default MotorComparisonCarousel;
