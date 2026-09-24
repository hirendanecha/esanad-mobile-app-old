import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '@theme/ThemeProvider';
import Header from '@components/ui/Header';
import CustomSegment from '@components/ui/CustomSegment';
import { CustomStarRating } from '@components/ui/CustomStarRating';
import { formatNumber } from '@utils/formateNumber';
import { env } from '@config/index';
import { verticalScale, moderateScale } from '@constants/metrics';
import { useActiveQuotes, useExpiredQuotes } from '@hooks/profile/useProfile';
import { SCREEN_NAMES } from '@constants/screenNames';
import LinearGradient from 'react-native-linear-gradient';
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';
import { getBottomMargin } from '@utils/paddingBottom';

const QuotationScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    data: activeQuotes = [],
    refetch: refetchActive,
    isRefetching: activeRefetching,
  } = useActiveQuotes();

  const {
    data: expiredQuotes = [],
    refetch: refetchExpired,
    isRefetching: expiredRefetching,
  } = useExpiredQuotes();

  const currentQuotes = selectedTab === 0 ? activeQuotes : expiredQuotes;
  const filteredQuotes =
    currentQuotes?.filter(item => !item?.Errors?.length) || [];

  const handleQuotePress = id =>
    navigation.navigate(SCREEN_NAMES.POLICY_DETAIL_SCREEN, {
      policy_id: id,
    });
  const handleCompanyProfile = (e, id) => {
    e.stopPropagation();
    navigation.navigate('CompanyProfile', { id });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="document-text-outline"
        size={moderateScale(64)}
        color={theme.colors.description}
      />
      <Text style={styles.emptyTitle}>No quotations found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedTab === 0
          ? "You don't have any active quotations"
          : "You don't have any expired quotations"}
      </Text>
    </View>
  );

  const DetailItem = ({ icon, label, value, theme, styles }) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>
        <Icon
          name={icon}
          size={moderateScale(20)}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );

  const QuoteCard = memo(({ item, theme, onQuotePress, onProfilePress }) => {
    const hasOffers = item?.Offers?.length > 0;
    const offer = hasOffers ? item.Offers[0] : null;

    const company = item?.company || {};
    const quoteInfo = item?.quoteInfo || {};

    const repairType =
      item?.quoteId?.basicQuote || !offer?.RepairMethod
        ? '---'
        : offer?.RepairMethod === 'nonagency'
        ? 'Non Agency'
        : 'Agency';

    const insuranceLabel =
      item?.insuranceType === 'thirdparty'
        ? 'Third Party'
        : `${item?.insuranceType
            ?.charAt(0)
            .toUpperCase()}${item?.insuranceType?.slice(1)}`;

    return (
      <Pressable
        style={styles.quoteCard}
        onPress={() => onQuotePress(item._id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.companySection}>
            <Image
              source={{
                uri: company?.logoImg
                  ? `${env.API_URL}/${company.logoImg.path}`
                  : undefined,
              }}
              style={styles.companyLogo}
              resizeMode="contain"
            />

            <View style={styles.companyInfo}>
              <Text style={styles.companyName} numberOfLines={1}>
                {company?.companyName}
              </Text>

              <View style={styles.ratingContainer}>
                <CustomStarRating
                  color={theme.colors.star}
                  rating={company?.googleRating || 0}
                  size={16}
                />
              </View>

              <Pressable
                onPress={e => onProfilePress(e, company?._id)}
                hitSlop={verticalScale(8)}
                style={styles.profileButton}
              >
                {/* <Text style={styles.viewProfile}>View Profile</Text> */}
                <Icon
                  name="open-outline"
                  size={moderateScale(12)}
                  color={theme.colors.primary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>
              AED{' '}
              {formatNumber(
                Math.round(quoteInfo?.totalPrice || quoteInfo?.price || 0),
              )}
            </Text>
            <Text style={styles.insuranceType}>
              {insuranceLabel} Insurance{' '}
              {item?.quoteId?.basicQuote && '(Basic)'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailsGrid}>
            <DetailItem
              icon="construct-outline"
              label="Repair type"
              value={repairType}
              theme={theme}
              styles={styles}
            />

            <DetailItem
              icon="car-outline"
              label="Car Value"
              value={`AED ${formatNumber(quoteInfo?.carValue)}`}
              theme={theme}
              styles={styles}
            />
          </View>
          <DetailItem
            icon="cash-outline"
            label="Excess Charges"
            value={
              item?.insuranceType === 'thirdparty'
                ? '---'
                : `AED ${formatNumber(offer?.ExcessAmount || 0)}`
            }
            theme={theme}
            styles={styles}
          />
        </View>
      </Pressable>
    );
  });

  const renderItem = ({ item }) => (
    <QuoteCard
      item={item}
      theme={theme}
      styles={styles}
      onQuotePress={handleQuotePress}
      onProfilePress={handleCompanyProfile}
    />
  );

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Header title="Quotations" onBack={navigation.goBack} />

      <View style={styles.segmentContainer}>
        <CustomSegment
          options={[
            { label: 'Active Quotations' },
            { label: 'Expired Quotations' },
          ]}
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
          height={verticalScale(56)}
        />
      </View>

      <FlatList
        data={filteredQuotes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredQuotes.length === 0 && styles.emptyListContent,
        ]}
        refreshing={selectedTab === 0 ? activeRefetching : expiredRefetching}
        onRefresh={selectedTab === 0 ? refetchActive : refetchExpired}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    segmentContainer: {
      paddingTop: verticalScale(20),
      paddingHorizontal: verticalScale(20),
      paddingBottom: verticalScale(10),
    },
    listContent: {
      padding: verticalScale(20),
      paddingTop: verticalScale(10),
      paddingBottom: getBottomMargin(),
    },
    emptyListContent: {
      flexGrow: 1,
    },
    separator: {
      height: verticalScale(16),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(40),
      gap: verticalScale(16),
    },
    emptyTitle: {
      fontSize: moderateScale(18),
      fontWeight: '600',
      color: theme.colors.text,
    },
    emptySubtitle: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      paddingHorizontal: verticalScale(32),
    },
    quoteCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: moderateScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    companySection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    companyLogo: {
      width: moderateScale(60),
      height: moderateScale(60),
      marginRight: verticalScale(12),
      borderRadius: moderateScale(8),
    },
    companyInfo: {
      flex: 1,
      gap: verticalScale(4),
      justifyContent: 'center',
    },
    detailsGrid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    companyName: {
      fontSize: moderateScale(16),
      fontWeight: '600',
      color: theme.colors.text,
    },
    ratingContainer: { flexDirection: 'row' },
    profileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(8),
    },
    viewProfile: {
      fontSize: moderateScale(13),
      color: theme.colors.primary,
      marginRight: verticalScale(4),
    },
    priceSection: { alignItems: 'flex-end' },
    price: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: verticalScale(4),
    },
    insuranceType: {
      fontSize: moderateScale(12),
      color: theme.colors.description,
      textAlign: 'right',
    },
    detailsSection: { padding: moderateScale(16), gap: verticalScale(16) },
    detailItem: { flexDirection: 'row', alignItems: 'center' },
    detailIcon: { width: moderateScale(32), alignItems: 'center' },
    detailContent: { marginLeft: verticalScale(12) },
    detailLabel: {
      fontSize: moderateScale(12),
      color: theme.colors.primary,
      fontWeight: '500',
      marginBottom: verticalScale(2),
    },
    detailValue: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
  });

export default QuotationScreen;
