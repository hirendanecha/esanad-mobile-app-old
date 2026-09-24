import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';

import { verticalScale } from '@constants/metrics';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useThemeContext } from '@theme/ThemeProvider';
import { env } from '@config/index';
import { Images } from '@assets/index';
import { formatNumber } from '@utils/formateNumber';

const Badge = ({ label, style, textStyle }) => (
  <View style={style}>
    <Text style={textStyle}>{label}</Text>
  </View>
);

const DetailItem = ({ label, value, isLast, styles }) => (
  <View style={[styles.detailItem, isLast && styles.noBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export const Card = ({
  id,
  companyName,
  insuranceType,
  logoUrl,
  item,
  isCompare,
  onUpdate,
}) => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const { quoteInfo, QuatationType, Offers = [] } = item || {};

  const isRealTimePolicy = !quoteInfo?.isMatrix;

  const coverAmount =
    typeof quoteInfo?.response?.IncludedFeatures?.[0]?.value === 'number'
      ? `AED ${quoteInfo.response.IncludedFeatures[0].value}`
      : quoteInfo?.response?.IncludedFeatures?.[0]?.value || '-';

  const navigateToPolicyDetails = () => {
    navigation.navigate(SCREEN_NAMES.BUY_POLICY_SCREEN, {
      policy_id: id,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() =>
        navigation.navigate(SCREEN_NAMES.POLICY_DETAIL_SCREEN, {
          policy_id: id,
        })
      }
      style={[styles.cardContainer, isCompare && styles.compareBorder]}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: `${env.API_URL}${logoUrl}` }}
          style={styles.logo}
        />

        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.insuranceType}>{insuranceType}</Text>
          </View>

          <View style={styles.badgeRow}>
            {QuatationType === 'comprehensive' && quoteInfo?.isMatrix && (
              <Badge
                label="Indicative Rates"
                style={styles.indicativeBadge}
                textStyle={styles.badgeText}
              />
            )}

            {!quoteInfo?.companyId?.eSanadRecommendation && (
              <View style={styles.recommendBadge}>
                <Image
                  source={Images.companyLogo}
                  style={styles.recommendIcon}
                />
                <Text style={styles.recommendText}>eSanad Recommends</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <DetailItem
          label="Car Value (AED)"
          value={`AED ${formatNumber(quoteInfo?.carValue)}`}
          styles={styles}
        />

        <DetailItem label="Cover Amount" value={coverAmount} styles={styles} />

        <DetailItem
          label="Excess Charge (AED)"
          value={`AED ${formatNumber(Offers?.[0]?.ExcessAmount)}`}
          isLast
          styles={styles}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => onUpdate(item)}
          style={styles.compareRow}
        >
          <Icon
            name={isCompare ? 'check' : 'circle'}
            size={isCompare ? 15 : 15}
            color={isCompare ? theme.colors.primary : theme.colors.border}
          />
          <Text style={styles.compareText}>
            {isCompare ? 'Added Compare' : 'Add to Compare'}
          </Text>
        </TouchableOpacity>

        {isRealTimePolicy && (
          <Badge
            label="Real Time Policy"
            style={styles.realTimeBadge}
            textStyle={styles.realTimeText}
          />
        )}

        <View style={styles.discountRow}>
          <Image source={Images.off} style={styles.discountIcon} />
          <Text style={styles.discountText}>Inc. 5% off</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.priceContainer}
          onPress={navigateToPolicyDetails}
        >
          <Text style={styles.priceText}>AED {quoteInfo?.totalPrice}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(10),
      gap: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: Dimensions.get('screen').width - 30,
      alignSelf: 'center',
    },
    compareBorder: {
      borderColor: theme.colors.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerContent: {
      gap: verticalScale(5),
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    badgeRow: {
      flexDirection: 'row',
      gap: verticalScale(5),
      alignItems: 'center',
    },
    logo: {
      width: verticalScale(60),
      height: verticalScale(48),
      marginRight: verticalScale(10),
      resizeMode: 'contain',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(5),
    },
    companyName: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    insuranceType: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      backgroundColor: `${theme.colors.border}90`,
      padding: verticalScale(3),
      borderRadius: verticalScale(5),
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
    recommendIcon: {
      width: verticalScale(12),
      height: verticalScale(12),
    },
    recommendText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    detailsContainer: {
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    detailItem: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: theme.colors.description,
      gap: verticalScale(5),
    },
    noBorder: {
      borderRightWidth: 0,
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
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: verticalScale(10),
    },
    compareRow: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      gap: verticalScale(5),
      flex: 1,
    },
    compareText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    realTimeBadge: {
      backgroundColor: theme.colors.lableBg,
      paddingVertical: verticalScale(4),
      paddingHorizontal: verticalScale(8),
      borderRadius: verticalScale(4),
    },
    realTimeText: {
      fontSize: 9,
      color: theme.colors.lableText,
    },
    discountRow: {
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
    priceContainer: {
      backgroundColor: theme.colors.primary,
      paddingVertical: verticalScale(8),
      paddingHorizontal: verticalScale(16),
      borderRadius: verticalScale(8),
      width: verticalScale(120),
      alignItems: 'center',
    },
    priceText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textSecondary,
    },
    badgeText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
  });
