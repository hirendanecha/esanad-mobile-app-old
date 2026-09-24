import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatNumber } from '@utils/formateNumber';
import dayjs from 'dayjs';
import Header from '@components/ui/Header';
import { env } from '@config/index';
import { useGetTravelPolicyDetails } from '@hooks/profile/usePolicyProfile';

const TravelPolicyDetails = ({ route }) => {
  const navigation = useNavigation();
  const { policyId } = route?.params || {};
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const { data: policy = {} } = useGetTravelPolicyDetails({
    id: policyId,
  });

  const openPdf = async () => {
    try {
      const pdfPath = policy?.policyFile?.path;
      const pdfUrl = `${env.API_URL}${pdfPath}`;
      const canOpen = await Linking.canOpenURL(pdfUrl);
      if (canOpen) return Linking.openURL(pdfUrl);
    } catch (e) {
      console.error('PDF Error:', e);
    }
  };

  const overviewList = [
    {
      id: 'company',
      label: 'Company',
      value: policy?.quote?.companyId?.companyName,
    },
    {
      id: 'refNo',
      label: 'Ref No',
      value: policy?.policyNumber,
    },
    {
      id: 'value',
      label: 'Insured declared value',
      value: `AED ${formatNumber(policy?.totalPrice)}`,
    },
  ];

  const holderDetails = [
    {
      id: 'name',
      label: 'Name',
      value: policy?.userId?.fullName,
    },
    {
      id: 'email',
      label: 'Email',
      value: policy?.userId?.email,
    },
    {
      id: 'mobile',
      label: 'Mobile number',
      value: policy?.userId?.mobileNumber,
    },
  ];

  const DateItem = ({ icon, label, value }) => (
    <View style={styles.dateItem}>
      <View
        style={[
          styles.dateIcon,
          { backgroundColor: theme.colors.floorBgColor },
        ]}
      >
        <Icon
          name={icon}
          size={moderateScale(16)}
          color={theme.colors.primary}
        />
      </View>
      <View>
        <Text style={styles.dateLabel}>{label}</Text>
        <Text style={styles.dateValue}>
          {value ? dayjs(value).format('DD/MM/YYYY') : '-'}
        </Text>
      </View>
    </View>
  );

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.row}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </View>
  );

  if (!policy) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.center}>
          <Icon
            name="error-outline"
            size={moderateScale(60)}
            color={theme.colors.description}
          />
          <Text style={styles.errorTitle}>Policy Not Found</Text>
          <Text style={styles.errorText}>Unable to load policy details.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Header title="Travel Policy" onBack={navigation.goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.company}>
              {policy?.quote?.companyId?.companyName}
            </Text>
          </View>
          <Text style={styles.title}>
            {policy?.travelQuoteId?.insuranceType}
          </Text>
          <View style={styles.dateWrapper}>
            <DateItem
              icon="calendar-today"
              label="Start date"
              value={policy?.policyEffectiveDate}
            />
            <DateItem
              icon="event"
              label="End date"
              value={policy?.policyExpiryDate}
            />
          </View>
          <View style={styles.detailsBox}>
            <DetailRow label="Policy holder" value={policy?.userId?.fullName} />
            <DetailRow
              label="Insured declared value"
              value={`AED ${formatNumber(policy?.totalPrice)}`}
            />
          </View>
          {!!policy?.policyFile && (
            <TouchableOpacity style={styles.pdfBtn} onPress={openPdf}>
              <View style={styles.pdfIconBox}>
                <Icon
                  name="file-download"
                  size={moderateScale(20)}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pdfTitle}>Download Policy</Text>
                <Text style={styles.pdfSubtitle}>PDF Document</Text>
              </View>
              <Icon
                name="chevron-right"
                size={moderateScale(24)}
                color={theme.colors.description}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.tabContent}>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Overview</Text>
          </View>
          <Text style={styles.sectionTitle}>Current policy</Text>
          <FlatList
            data={overviewList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
          <Text style={styles.sectionTitle}>Policy holder details</Text>
          <FlatList
            data={holderDetails}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    container: {
      paddingBottom: verticalScale(40),
      gap: verticalScale(10),
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: verticalScale(20),
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      marginHorizontal: verticalScale(15),
      marginTop: verticalScale(15),
      padding: moderateScale(20),
      borderRadius: moderateScale(16),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(8),
    },
    company: {
      color: theme.colors.primary,
      fontSize: verticalScale(16),
      fontWeight: '700',
    },
    title: {
      fontSize: moderateScale(20),
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: verticalScale(16),
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
      fontWeight: '600',
      color: theme.colors.text,
    },
    detailsBox: {
      backgroundColor: theme.colors.floorBgColor,
      padding: moderateScale(16),
      borderRadius: moderateScale(12),
      marginBottom: verticalScale(12),
      gap: verticalScale(12),
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
    },
    detailValue: {
      fontSize: moderateScale(16),
      fontWeight: '600',
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
      backgroundColor: theme.colors.floorBgColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    pdfTitle: {
      fontSize: moderateScale(16),
      fontWeight: '600',
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
      marginHorizontal: verticalScale(15),
      padding: moderateScale(16),
      borderRadius: moderateScale(12),
      gap: verticalScale(10),
    },
    sectionTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    listItem: {
      paddingVertical: verticalScale(16),
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
    errorTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.text,
    },
    errorText: {
      color: theme.colors.description,
      fontSize: moderateScale(14),
      marginTop: verticalScale(6),
      textAlign: 'center',
    },
  });

export default TravelPolicyDetails;
