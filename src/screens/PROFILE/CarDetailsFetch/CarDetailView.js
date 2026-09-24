import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import moment from 'moment';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';

const CarDetailView = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  console.log('route', route?.params?.data);
  const styles = createStyles(theme);

  // Animated values

  // Car data from route params
  const carData = route?.params?.data;

  const carDetailsRows = [
    { label: 'Year:', value: carData?.year },
    { label: 'No. of Seat:', value: carData?.noOfPassengers },
    { label: 'Brand:', value: carData?.make },
    { label: 'Cylinders:', value: carData?.cylinders },
    { label: 'Model:', value: carData?.model },
    {
      label: 'Value:',
      value: carData?.valuation?.Medium
        ? `${carData?.valuation?.Medium} AED`
        : null,
    },
    { label: 'Trim:', value: carData?.trim },
    {
      label: 'Chassis No:',
      value: carData?.chassisNumber || carData?.chesisNo || '-',
    },
    { label: 'Regional Spec:', value: carData?.regionalSpec },
    { label: 'Reg. Card TC No:', value: carData?.tcNo || '-' },
    { label: 'Body Type:', value: carData?.bodyType },
    {
      label: 'Car Reg. Date:',
      value: carData?.dateOfFirstRegister
        ? moment(carData?.dateOfFirstRegister).format('DD/MM/YYYY')
        : '-',
    },
    { label: 'No. of Doors:', value: carData?.noOfDoors },
    {
      label: 'Reg. Card Expiry:',
      value: carData?.regCardExpiryDate
        ? moment(carData?.regCardExpiryDate).format('DD/MM/YYYY')
        : '-',
    },
  ];

  // Render item for FlatList

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={[styles.container]}
    >
      <Header title="Get Your Car Details" navigation={navigation} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailsBox}>
          <View
            style={{
              width: '100%',
              height: 260,
            }}
          >
            <Image
              source={{
                uri:
                  carData?.carImage ||
                  'https://www.privatecollectionmotors.com/imagetag/610/main/l/Used-2019-Porsche-911-Carrera-GTS-Carrera-GTS-1698209775.jpg',
              }}
              // resizeMode="stretch"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

          <View
            style={{
              gap: verticalScale(10),
              borderWidth: 1,
              flex: 1,
              borderBottomWidth: 0,
              padding: verticalScale(20),
              borderColor: theme.colors.border,
              borderTopRightRadius: verticalScale(30),
              borderTopLeftRadius: verticalScale(30),
              marginTop: verticalScale(-30),
              backgroundColor: theme.colors.backgroundColor,
            }}
          >
            <Text style={styles.detailsTitle}>Car Details:</Text>
            {carDetailsRows.map(({ label, value }, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}> {label} </Text>
                <Text style={styles.detailValue}>{value ?? '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    errorText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.error,
      marginTop: verticalScale(8),
      marginLeft: verticalScale(5),
    },
    hintText: {
      fontSize: verticalScale(11),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      marginTop: verticalScale(8),
      marginLeft: verticalScale(5),
      fontStyle: 'italic',
    },
    detailsBox: {
      flex: 1,
    },
    detailsTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailRow: { flexDirection: 'row' },
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
    mainContent: {
      flex: 1,
    },
    mainCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(20),
      marginBottom: verticalScale(15),
      gap: verticalScale(15),
    },
    mainCardTitle: {
      fontSize: verticalScale(20),
      fontWeight: '600',
      color: theme.colors.text,
    },
    sectionCard: {
      backgroundColor: theme.colors.border + '20',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(3),
    },
    sectionHeader: {
      padding: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: verticalScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    sectionContent: {
      padding: verticalScale(16),
    },
    twoColumnContainer: {
      gap: verticalScale(5),
    },
    column: {
      flex: 1,
      paddingRight: verticalScale(16),
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: verticalScale(12),
    },
    infoLabel: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      flex: 1,
    },
    infoValue: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.text,
      flex: 1,
    },
    valueContainer: {
      marginBottom: verticalScale(12),
    },
    valueLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoIcon: {
      width: verticalScale(18),
      height: verticalScale(18),
      marginLeft: verticalScale(4),
      tintColor: theme.colors.primary,
    },
    kycContainer: {
      gap: verticalScale(20),
    },
    kycField: {
      gap: verticalScale(8),
    },
    kycLabel: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.description,
    },
    kycValue: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    radioGroup: {
      flexDirection: 'row',
      gap: verticalScale(16),
      marginTop: verticalScale(8),
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(8),
    },
    radioCircle: {
      width: verticalScale(20),
      height: verticalScale(20),
      borderRadius: verticalScale(10),
      borderWidth: verticalScale(2),
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureValue: {
      fontSize: verticalScale(13),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'right',
    },
    buttonContainer: {
      marginTop: verticalScale(10),
      marginBottom: verticalScale(10),
    },
    headerText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
  });

export default CarDetailView;
