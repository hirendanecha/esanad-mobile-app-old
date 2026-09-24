import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatNumber } from '@utils/formateNumber';
import Header from '@components/ui/Header';
import { env } from '@config/index';
import { useGetHealthPolicyDetails } from '@hooks/profile/usePolicyProfile';
import LinearGradient from 'react-native-linear-gradient';
import OrDivider from '@components/ui/OrDivider';
import moment from 'moment';
import CustomButton from '@components/ui/CustomButton';
import { ageCalculator } from '@utils/ageCalculator';
import { CustomAccordion } from '@components/ui/CustomAccordion';

const CoverageItem = ({ item, styles, theme }) => (
  <CustomAccordion
    title={item?.benefit?.name || '-'}
    containerStyle={{ backgroundColor: theme.colors.bgSecondary }}
  >
    <View
      style={{
        paddingBottom: verticalScale(10),
        paddingHorizontal: moderateScale(10),
      }}
    >
      <Text style={styles.coverageDescription}>
        {item?.detail?.description
          ? item?.detail?.description.replace(/<[^>]+>/g, '')
          : '-'}
      </Text>
    </View>
  </CustomAccordion>
);

const BenefitItem = ({ item, styles, theme }) => (
  <CustomAccordion
    title={item?.Title || '-'}
    containerStyle={{ backgroundColor: theme.colors.bgSecondary }}
  >
    <Text style={styles.coveragePrice}>
      (AED {formatNumber(item?.Amount || 0)})
    </Text>
    <Text style={styles.coverageDescription}>
      {item?.benifitDetail?.description || '-'}
    </Text>
  </CustomAccordion>
);

const HealthPolicyDetails = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { policyId } = route?.params || {};

  const { data } = useGetHealthPolicyDetails({ id: policyId });

  const [medicalCover, setMedicalCover] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const quote = data?.quoteId;
  const healthInfo = data?.healthInfoId;

  console.log('Health Policy Details:', data);

  useEffect(() => {
    if (!quote) return;
    const covers = [
      ...(quote.extraCovers || []),
      ...(quote.includedCovers || []),
    ];
    const match = covers.find(
      i => i?.benefit?.name === 'Aggregate Annual limit',
    );
    if (match?.limitAmount) setMedicalCover(match.limitAmount);
  }, [quote]);

  const DetailRow = ({ label, value, styles }) => (
    <View style={styles.detailRow}>
      <Text
        style={{
          flex: 1,
          fontSize: verticalScale(12),
          fontFamily: 'Lato-Regular',
          color: theme.colors.textTertiary,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: verticalScale(14),
          fontFamily: 'Lato-Bold',
          color: theme.colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );

  const DetailRow2 = ({ label, value, styles }) => (
    <View style={styles.detailRow}>
      <Text
        style={{
          flex: 1,
          fontSize: verticalScale(16),
          fontFamily: 'Lato-Regular',
          color: theme.colors.textTertiary,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: verticalScale(16),
          fontFamily: 'Lato-Regular',
          color: theme.colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );

  const openPdf = async () => {
    try {
      const file = data?.policyFile?.path;
      const url = `${env.API_URL}${file}`;
      Linking.openURL(url);
    } catch (err) {
      console.warn('Linking error:', err);
    }
  };

  const POLICY_DETAILS = [
    {
      label: 'Insurer:',
      value: quote?.companyData?.companyName || '-',
    },
    {
      label: 'Type:',
      value: healthInfo?.insurerType || '-',
    },
    {
      label: 'TPA:',
      value: quote?.TPA?.TPAName || '-',
    },
    {
      label: 'Network:',
      value: quote?.network?.networkName || '-',
    },
    {
      label: 'Plan:',
      value: quote?.plan?.planName || '-',
    },
    {
      label: 'City:',
      value: quote?.city?.cityName || '-',
    },
    {
      label: 'Ref No:',
      value: data?.policyNumber || '-',
    },
    {
      label: 'Medical Coverage:',
      value: medicalCover ? `AED ${medicalCover}` : 'AED 0',
    },
  ];

  const USER_DATA = [
    {
      label: 'Name:',
      value: healthInfo?.fullName,
    },
    {
      label: 'Mobile:',
      value: `+${healthInfo?.countryCode || '971'} ${healthInfo?.mobileNumber}`,
    },
    {
      label: 'Email:',
      value: healthInfo?.email,
    },
    {
      label: 'Date of Birth:',
      value: moment(healthInfo?.dateOfBirth).format('DD/MM/YYYY'),
    },
    {
      label: 'Age:',
      value: healthInfo?.age || ageCalculator(healthInfo?.dateOfBirth) || '-',
    },
    {
      label: 'Nationality:',
      value: healthInfo?.nationality,
    },
    {
      label: 'gender:',
      value: healthInfo?.gender || '-',
    },
  ];

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Personal</Text>
        {USER_DATA.map(({ label, value }) => (
          <View style={styles.detailRow}>
            <Text
              style={{
                flex: 1,
                fontSize: verticalScale(16),
                fontFamily: 'Lato-Regular',
                color: theme.colors.textTertiary,
              }}
            >
              {label}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: verticalScale(16),
                fontFamily: 'Lato-Regular',
                color: theme.colors.text,
              }}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>

      {healthInfo?.spouseDetails?.length > 0 && (
        <>
          <OrDivider simple />
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Spouse Details</Text>
            {healthInfo?.spouseDetails?.map((item, index) => {
              const SPOUSE_DATA = [
                {
                  label: 'Name:',
                  value: item?.fullName,
                },
                {
                  label: 'Date of Birth:',
                  value: moment(item?.dateOfBirth).format('DD/MM/YYYY'),
                },
                {
                  label: 'Age:',
                  value: item?.age,
                },
                {
                  label: 'gender:',
                  value: item?.gender,
                },
              ];

              return (
                <React.Fragment key={index}>
                  {index > 0 && <OrDivider simple />}
                  {SPOUSE_DATA.map(({ label, value }) => (
                    <View style={styles.detailRow}>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: verticalScale(16),
                          fontFamily: 'Lato-Regular',
                          color: theme.colors.textTertiary,
                        }}
                      >
                        {label}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: verticalScale(16),
                          fontFamily: 'Lato-Regular',
                          color: theme.colors.text,
                        }}
                      >
                        {value}
                      </Text>
                    </View>
                  ))}
                </React.Fragment>
              );
            })}
          </View>
        </>
      )}

      {healthInfo?.kidsDetails?.length > 0 && (
        <>
          <OrDivider simple />
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Kids Details</Text>
            {healthInfo?.kidsDetails?.map((item, index) => {
              const KIDS_DATA = [
                {
                  label: 'Name:',
                  value: item?.fullName,
                },
                {
                  label: 'Date of Birth:',
                  value: moment(item?.dateOfBirth).format('DD/MM/YYYY'),
                },
                {
                  label: 'Age:',
                  value: item?.age,
                },
                {
                  label: 'gender:',
                  value: item?.gender,
                },
              ];

              return (
                <React.Fragment key={index}>
                  {index > 0 && <OrDivider simple />}
                  {KIDS_DATA.map(({ label, value }) => (
                    <View style={styles.detailRow}>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: verticalScale(16),
                          fontFamily: 'Lato-Regular',
                          color: theme.colors.textTertiary,
                        }}
                      >
                        {label}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: verticalScale(16),
                          fontFamily: 'Lato-Regular',
                          color: theme.colors.text,
                        }}
                      >
                        {value}
                      </Text>
                    </View>
                  ))}
                </React.Fragment>
              );
            })}
          </View>
        </>
      )}

      {[
        ['Parents Details', healthInfo?.parentDetails],
        ['Other Dependents Details', healthInfo?.otherFamilyDependentsDetails],
        ['Domestic Workers Details', healthInfo?.domesticWorkerDetails],
      ].some(([_, arr]) => arr?.length > 0) && <OrDivider simple />}

      {[
        ['Parents Details', healthInfo?.parentDetails],
        ['Other Dependents Details', healthInfo?.otherFamilyDependentsDetails],
        ['Domestic Workers Details', healthInfo?.domesticWorkerDetails],
      ].map(([title, arr]) =>
        arr?.map((m, i) => (
          <View key={`${title}-${i}`} style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>{title}</Text>
            <DetailRow2
              label="Name:"
              value={m?.fullName || '-'}
              styles={styles}
            />
            <DetailRow2
              label="Date of Birth:"
              value={moment(m?.dateOfBirth).format('DD/MM/YYYY')}
              styles={styles}
            />
            <DetailRow2 label="Age:" value={m?.age || '-'} styles={styles} />
            <DetailRow2
              label="gender:"
              value={m?.gender || '-'}
              styles={styles}
            />
          </View>
        )),
      )}

      <OrDivider simple />

      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Policy details</Text>
        {POLICY_DETAILS.map(({ label, value }, index) => (
          <DetailRow2
            key={index}
            label={label}
            value={value ?? '-'}
            styles={styles}
          />
        ))}
      </View>
    </View>
  );

  const renderCoveragesTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={quote?.includedCovers || []}
        renderItem={({ item }) => (
          <CoverageItem item={item} styles={styles} theme={theme} />
        )}
        ItemSeparatorComponent={<OrDivider simple />}
        keyExtractor={(_, i) => `coverage-${i}`}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No coverages available</Text>
        }
      />

      {quote?.extraFeatures?.length > 0 && (
        <FlatList
          data={quote?.extraFeatures || []}
          renderItem={({ item }) => (
            <BenefitItem item={item} styles={styles} theme={theme} />
          )}
          keyExtractor={(_, i) => `benefit-${i}`}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  const renderDocumentsTab = () => {
    const docs = [
      { title: 'Policy Schedule', file: data?.policyFile?.path },
      { title: 'Medical Card', file: data?.medicalCard?.path },
      { title: 'Tax Invoice', file: data?.taxInvoiceFile?.path },
      { title: 'Credit Note', file: data?.creditNoteFile?.path },
      { title: 'Payment Receipt', file: data?.paymentReceipt?.path },
      { title: 'Proof of Payment', file: data?.proofOfPayment?.path },
      { title: 'Health Certificate', file: data?.healthCertificate?.path },
      { title: 'Emirates ID', file: data?.healthInfoId?.emiratesId?.path },
      { title: 'Passport', file: data?.healthInfoId?.passport?.path },
      { title: 'Visa Document', file: data?.healthInfoId?.visaDoc?.path },
      { title: 'Trade License', file: data?.healthInfoId?.tradeLicense?.path },
      {
        title: 'Continuity Certificate',
        file: data?.healthInfoId?.continuityCertificate?.path,
      },
    ];

    const availableDocs = docs.filter(doc => doc.file);

    return (
      <View style={styles.tabContent}>
        {availableDocs.length > 0 ? (
          availableDocs.map((doc, index) => (
            <React.Fragment key={index}>
              {index > 0 && <OrDivider simple />}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  try {
                    const url = `${env.API_URL}${doc.file}`;
                    if (!url) return;
                    Linking.openURL(url);
                  } catch (e) {
                    console.log('Document Error:', e);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: verticalScale(5),
                }}
              >
                <View style={styles.pdfIconBox}>
                  <Icon
                    name={
                      doc.title.includes('Receipt') ||
                      doc.title.includes('Invoice')
                        ? 'receipt-long'
                        : 'description'
                    }
                    size={moderateScale(24)}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pdfTitle}>{doc.title}</Text>
                  <Text style={styles.pdfSubtitle}>PDF Document</Text>
                </View>
                <Icon
                  name="file-download"
                  size={moderateScale(24)}
                  color={theme.colors.description}
                />
              </TouchableOpacity>
            </React.Fragment>
          ))
        ) : (
          <Text style={styles.noDataText}>No documents available</Text>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.safeArea}
    >
      <Header title="Health Policy" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Image
              source={{
                uri: env.API_URL + quote?.companyData?.logoImg?.path,
              }}
              resizeMode="contain"
              style={{
                width: moderateScale(60),
                height: moderateScale(40),
                borderRadius: moderateScale(5),
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            />

            <View style={{ gap: verticalScale(5) }}>
              <Text style={styles.company}>
                {quote?.companyData?.companyName || 'Company'}
              </Text>

              <View
                style={{
                  gap: verticalScale(5),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.title}>
                  {healthInfo?.insurerType || 'Insurance Type'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={[styles.detailColumn, styles.detailBorder]}>
              <Text
                style={{
                  fontSize: verticalScale(12),
                  fontFamily: 'Lato-Regular',
                  color: theme.colors.textTertiary,
                }}
              >
                Start date
              </Text>
              <Text
                style={{
                  fontSize: verticalScale(14),
                  fontFamily: 'Lato-Bold',
                  color: theme.colors.lableText,
                }}
              >
                {moment(data?.policyEffectiveDate).format('DD/MM/YYYY') || '-'}
              </Text>
            </View>

            <View style={[styles.detailColumn]}>
              <Text
                style={{
                  fontSize: verticalScale(12),
                  fontFamily: 'Lato-Regular',
                  color: theme.colors.textTertiary,
                }}
              >
                End date
              </Text>
              <Text
                style={{
                  fontSize: verticalScale(14),
                  fontFamily: 'Lato-Bold',
                  color: theme.colors.red,
                }}
              >
                {moment(data?.policyExpiryDate).format('DD/MM/YYYY') || '-'}
              </Text>
            </View>
          </View>

          <View
            style={[
              {
                backgroundColor: theme.colors.bgSecondary,
                padding: verticalScale(10),
                gap: verticalScale(5),
              },
            ]}
          >
            <DetailRow
              label="Policy holder:"
              value={data?.userId?.fullName || '-'}
              styles={styles}
            />
            <DetailRow
              label="Medical Coverage:"
              value={medicalCover ? `AED ${medicalCover}` : 'AED 0'}
              styles={styles}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {data?.policyFile && (
              <CustomButton
                title="Download Policy"
                onPress={openPdf}
                icon={
                  <Icon
                    name="file-download"
                    size={moderateScale(20)}
                    color={theme.colors.backgroundColor}
                  />
                }
                textStyle={{
                  fontFamily: 'Lato-Bold',
                  fontSize: verticalScale(14),
                }}
                buttonStyle={{
                  height: verticalScale(40),
                  width: (Dimensions.get('screen').width - 60) / 2,
                }}
              />
            )}
            {data?.proofOfPayment && (
              <CustomButton
                title="Proof of Payment"
                onPress={async () => {
                  try {
                    const pdfPath = env.API_URL + data?.proofOfPayment?.path;
                    if (!pdfPath) return;

                    const canOpen = await Linking.canOpenURL(pdfPath);
                    if (canOpen) {
                      await Linking.openURL(pdfPath);
                    }
                  } catch (e) {
                    console.log('PDF Error:', e);
                  }
                }}
                type={'secondary'}
                icon={
                  <Icon
                    name="file-download"
                    size={moderateScale(20)}
                    color={theme.colors.primary}
                  />
                }
                textStyle={{
                  fontFamily: 'Lato-Bold',
                  fontSize: verticalScale(14),
                }}
                buttonStyle={{
                  height: verticalScale(40),
                  width: (Dimensions.get('screen').width - 80) / 2,
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.tabSelector}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
            data={['Overview', 'Coverages', 'Documents']}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab(index)}
                style={[
                  styles.tabSelectorButton,
                  activeTab === index && styles.tabSelectorButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabSelectorText,
                    activeTab === index && styles.tabSelectorTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {activeTab === 0
          ? renderOverviewTab()
          : activeTab === 1
          ? renderCoveragesTab()
          : renderDocumentsTab()}
      </ScrollView>
    </LinearGradient>
  );
};

export default HealthPolicyDetails;

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      paddingBottom: verticalScale(40),
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: verticalScale(20),
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      padding: verticalScale(15),
      gap: verticalScale(15),
      margin: verticalScale(15),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowBetween: {
      gap: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    company: {
      color: theme.colors.text,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
    },
    title: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      textTransform: 'uppercase',
      color: theme.colors.text,
    },
    dateWrapper: {
      marginBottom: verticalScale(16),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(12),
    },
    dateIcon: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(22),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    dateLabel: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
    },
    dateValue: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailsBox: {
      borderRadius: moderateScale(12),
      gap: verticalScale(5),
    },
    detailsTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailRow: {
      flexDirection: 'row',
    },
    detailLabel: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    detailValue: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    pdfBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: moderateScale(16),
      borderRadius: moderateScale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pdfIconBox: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(12),
      backgroundColor: theme.colors.bgSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    pdfTitle: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    pdfSubtitle: {
      fontSize: moderateScale(13),
      color: theme.colors.description,
    },
    tab: {
      alignItems: 'center',
      backgroundColor: theme.colors.floorBgColor,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(14),
      marginBottom: verticalScale(10),
    },
    tabText: {
      fontSize: verticalScale(16),
      fontWeight: '600',
      color: theme.colors.primary,
    },
    tabContent: {
      backgroundColor: theme.colors.backgroundColor,
      margin: verticalScale(20),
      padding: verticalScale(10),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: verticalScale(10),
    },
    tabSelector: {
      height: verticalScale(45),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    tabsList: {
      paddingHorizontal: verticalScale(15),
    },
    tabSelectorButton: {
      justifyContent: 'center',
      paddingHorizontal: verticalScale(20),
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    tabSelectorButtonActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabSelectorText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
    },
    tabSelectorTextActive: {
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    detailColumn: {
      flex: 1,
      paddingVertical: verticalScale(5),
    },
    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    detailBorder: {
      borderRightWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
      marginTop: verticalScale(8),
    },
    listItem: {
      paddingVertical: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    label: {
      flex: 1,
      color: theme.colors.description,
      fontSize: moderateScale(14),
    },
    value: {
      flex: 1,
      textAlign: 'right',
      color: theme.colors.text,
      fontSize: moderateScale(16),
      fontWeight: '600',
    },
    familyMemberSection: {
      marginTop: verticalScale(16),
    },
    coverageItem: {
      flexDirection: 'row',
    },
    coverageIconContainer: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(22),
      backgroundColor: theme.colors.floorBgColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    coverageTitle: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginBottom: verticalScale(2),
    },
    coveragePrice: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      marginBottom: verticalScale(4),
    },
    coverageDescription: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      lineHeight: moderateScale(20),
    },
    noDataText: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      marginTop: verticalScale(20),
    },
  });
