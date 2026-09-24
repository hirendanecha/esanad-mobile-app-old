import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';
import { formatNumber } from '@utils/formateNumber';
import { env } from '@config/index';
import { CustomStarRating } from '@components/ui/CustomStarRating';
import CustomSegment from '@components/ui/CustomSegment';
import CustomButton from '@components/ui/CustomButton';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { SCREEN_NAMES } from '@constants/screenNames';
import { set } from 'react-hook-form';

const { width } = Dimensions.get('window');

const HealthPlanModel = ({
  plan,
  handleCloseDrawer,
  currentNetworkName,
  ListTitle,
  navigation,
  setListTitle,
  isDrawerOpen,
}) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const insets = useSafeAreaInsets();

  const handleBuyPolicy = () => {
    setTimeout(() => handleCloseDrawer(), 100);
    navigation.navigate(SCREEN_NAMES.HEALTH_POLICY_BUY_SCREEN, {
      policy_id: plan?._id,
    });
  };

  const logoSource = plan?.companyData?.logoImg?.path
    ? { uri: `${env.API_URL}/${plan?.companyData.logoImg.path}` }
    : null;

  const DetailItem = ({ label, value }) => (
    <View style={styles.planDetailItem}>
      <Text style={styles.planDetailLabel}>{label} : </Text>
      <Text style={styles.planDetailValue}>{value || '-'}</Text>
    </View>
  );

  const BenefitItem = ({ item }) => {
    if (!item?.isEnabled) return null;
    const details =
      item?.coverage || item?.coPay || item?.deductible || item?.detail || {};

    const renderDescription = () => {
      if (item?.benefit?.valueType === 'object') {
        return Object.entries(details)
          .filter(([key]) => key === 'description')
          .map(([key, value]) => (
            <RenderHtml
              key={key}
              contentWidth={width - verticalScale(60)}
              source={{ html: value }}
              tagsStyles={{
                body: {
                  fontSize: verticalScale(14),
                  color: theme.colors.description,
                  fontWeight: '500',
                },
              }}
            />
          ));
      }

      const value =
        item?.value ||
        (item?.limitAmount && item?.limitAmount !== 0
          ? `${item?.limitAmount} AED`
          : '');

      return <Text style={styles.benefitValue}>• {value}</Text>;
    };

    return (
      <View style={styles.benefitItem}>
        <View style={styles.benefitHeader}>
          <Icon
            name="local-pharmacy"
            size={verticalScale(22)}
            color={theme.colors.primary}
          />
          <Text style={styles.benefitName}>{item?.benefit?.name}</Text>
        </View>
        <View style={styles.benefitContent}>{renderDescription()}</View>
        <View style={styles.benefitDivider} />
      </View>
    );
  };

  const HospitalRow = ({ item, index, total }) => {
    const isEven = index % 2 === 0;
    const isLast = index === total - 1;

    return (
      <View
        style={[
          styles.tableRow,
          isEven && styles.tableRowEven,
          isLast && styles.lastTableRow,
        ]}
      >
        <View style={styles.tableCell}>
          <Text style={styles.tableCellText}>
            {item?.providerName}
            <Text style={styles.tableCellBold}> ({item?.providerType})</Text>
          </Text>
        </View>
        <View style={[styles.tableCell, styles.addressColumn]}>
          <Text style={styles.tableCellText}>{item?.providerAddresss}</Text>
        </View>
      </View>
    );
  };

  const renderBenefitsList = () => {
    const covers = [
      ...(plan?.includedCovers || []),
      ...(plan?.extraCovers || []),
    ];

    return (
      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>Benefits include:</Text>
        {covers.length > 0 ? (
          <FlatList
            data={covers}
            renderItem={({ item }) => <BenefitItem item={item} />}
            keyExtractor={(_, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        ) : (
          <Text style={styles.noDataText}>No benefits available</Text>
        )}
      </View>
    );
  };

  const renderHospitalsList = () => {
    const hospitals = plan?.healthProviders || [];

    return (
      <View style={styles.hospitalsContainer}>
        <Text style={styles.sectionTitle}>Hospitals list:</Text>
        {hospitals.length > 0 ? (
          <View style={styles.hospitalsTable}>
            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Hospital Name</Text>
              </View>
              <View style={[styles.tableHeaderCell, styles.addressColumn]}>
                <Text style={styles.tableHeaderText}>Address</Text>
              </View>
            </View>

            <FlatList
              data={hospitals}
              renderItem={({ item, index }) => (
                <HospitalRow
                  item={item}
                  index={index}
                  total={hospitals.length}
                />
              )}
              keyExtractor={(_, i) => i.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <Text style={styles.noDataText}>No hospitals available</Text>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={isDrawerOpen}
      animationType="fade"
      transparent
      onRequestClose={handleCloseDrawer}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCloseDrawer}
              style={styles.closeButton}
            >
              <Icon
                name="close"
                size={verticalScale(28)}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <View style={styles.companySection}>
              <View style={styles.companyRow}>
                {logoSource && (
                  <Image
                    source={logoSource}
                    resizeMode="contain"
                    style={styles.logo}
                  />
                )}
                <View style={styles.companyDetails}>
                  <Text style={styles.companyName}>
                    {plan?.companyData?.companyName}
                  </Text>
                  <View style={styles.ratingRow}>
                    <CustomStarRating
                      rating={plan?.companyData?.googleRating}
                      size={verticalScale(18)}
                    />
                  </View>
                  <Text style={styles.planTypeText}>Emerald Plan Details</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                {/* <CustomButton
                  title={'View Profile'}
                  onPress={() => {
                    setTimeout(() => {
                      handleCloseDrawer();
                    }, 100);

                    navigation.navigate(SCREEN_NAMES.COMPANY_PROFILE_SCREEN, {
                      company_Id: plan?.companyData?._id,
                    });
                  }}
                  buttonStyle={styles.viewButton}
                  textStyle={styles.viewButtonText}
                /> */}

                <CustomButton
                  title={
                    plan?.isReferral
                      ? 'Contact us for price'
                      : plan?.isPremiumRequestUpon
                      ? 'Price upon request'
                      : `AED ${formatNumber(plan?.price)} Yearly`
                  }
                  onPress={handleBuyPolicy}
                  buttonStyle={styles.priceButton}
                />
              </View>
            </View>

            <View style={styles.planDetailsSection}>
              <DetailItem label="Plan" value={plan?.plan?.planName} />
              <DetailItem label="Network" value={currentNetworkName} />
              <DetailItem label="Medical Coverage" value="-" />
              <DetailItem label="Co-pay" value={plan?.plan?.coPay} />
              <DetailItem label="Consultation" value="0" />
            </View>

            <CustomSegment
              options={[
                { label: 'List of Main Benefits' },
                { label: 'Hospitals List' },
              ]}
              selectedIndex={ListTitle == 'benefits' ? 0 : 1}
              onChange={e => {
                if (e == 0) setListTitle('benefits');
                else setListTitle('hospitals');
              }}
            />
          </View>

          {ListTitle === 'benefits'
            ? renderBenefitsList()
            : renderHospitalsList()}
        </View>
      </View>
    </Modal>
  );
};

export default HealthPlanModel;

const style = theme =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.modalOverlay },
    modalView: {
      margin: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      borderRadius:
        Platform.OS === 'ios' ? verticalScale(50) : verticalScale(20),
      borderTopLeftRadius: verticalScale(20),
      borderTopRightRadius: verticalScale(20),
      padding: verticalScale(15),
      flexGrow: 1,
    },

    closeButton: {
      padding: verticalScale(5),
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1,
    },

    companySection: { marginBottom: verticalScale(16) },
    companyRow: { flexDirection: 'row', marginBottom: verticalScale(16) },
    logo: {
      width: verticalScale(70),
      height: verticalScale(70),
      borderRadius: verticalScale(5),
    },
    companyDetails: { flex: 1, marginLeft: verticalScale(16) },
    companyName: {
      fontSize: verticalScale(18),
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(8),
      marginBottom: verticalScale(8),
    },
    planTypeText: {
      fontSize: verticalScale(13),
      fontWeight: '300',
      color: theme.colors.description,
      textTransform: 'capitalize',
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: verticalScale(10),
    },
    viewButton: {
      flex: 1 / 3,
      backgroundColor: theme.colors.secondary,
    },
    viewButtonText: { color: theme.colors.textSecondary },
    priceButton: {
      flex: 2 / 3,
      backgroundColor: theme.colors.primary,
    },

    planDetailItem: { flexDirection: 'row' },
    planDetailsSection: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.floorBgColor,
      borderRadius: verticalScale(3),
      padding: verticalScale(15),
      gap: verticalScale(5),
    },
    planDetailLabel: {
      color: theme.colors.primary,
      fontSize: verticalScale(12),
      fontWeight: '600',
      marginBottom: verticalScale(4),
    },
    planDetailValue: {
      color: theme.colors.description,
      fontSize: verticalScale(14),
      fontWeight: '600',
      textTransform: 'capitalize',
    },

    sectionTitle: {
      marginTop: verticalScale(16),
      fontSize: verticalScale(15),
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: verticalScale(16),
    },

    benefitsContainer: { paddingHorizontal: verticalScale(8), flex: 1 },
    benefitItem: { marginTop: verticalScale(12) },
    benefitHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(8),
      marginBottom: verticalScale(8),
    },
    benefitName: {
      fontSize: verticalScale(15),
      fontWeight: '800',
      color: theme.colors.text,
      flex: 1,
    },
    benefitContent: { marginLeft: verticalScale(32) },
    benefitValue: {
      fontSize: verticalScale(15),
      fontWeight: '500',
      color: theme.colors.description,
      lineHeight: verticalScale(22),
    },
    benefitDivider: {
      height: verticalScale(1),
      backgroundColor: theme.colors.border,
      marginVertical: verticalScale(8),
    },

    hospitalsContainer: {
      paddingHorizontal: verticalScale(8),
    },
    hospitalsTable: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: verticalScale(10),
      marginTop: verticalScale(16),
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      padding: verticalScale(8),
    },
    tableHeaderCell: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addressColumn: { flex: 1.4 },
    tableHeaderText: {
      fontSize: verticalScale(15),
      fontWeight: '600',
      color: theme.colors.text,
    },
    tableRow: {
      flexDirection: 'row',
      padding: verticalScale(8),
      backgroundColor: theme.colors.backgroundColor,
      gap: verticalScale(4),
    },
    tableRowEven: { backgroundColor: theme.colors.floorBgColor },
    lastTableRow: {
      borderBottomLeftRadius: verticalScale(10),
      borderBottomRightRadius: verticalScale(10),
    },
    tableCell: { flex: 1 },
    tableCellText: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.text,
    },
    tableCellBold: { fontWeight: '600' },

    noDataText: {
      fontSize: verticalScale(16),
      fontWeight: '500',
      marginTop: verticalScale(8),
      color: theme.colors.text,
    },
  });
