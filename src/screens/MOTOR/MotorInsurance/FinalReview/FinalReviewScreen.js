import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuthStore } from '@store/authStore';
import { verticalScale } from '@constants/metrics';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { useSocket } from '@provider/SocketProvider';
import { useReviewMotor } from '@hooks/motorflow/useMotorFlowTop';
import moment from 'moment';
import CustomButton from '@components/ui/CustomButton';
import { useGetMotorQuotes } from '@hooks/motorflow/useMotorFlow';
import { useLottieLoader } from '@provider/LottieLoaderProvider';
import { Images } from '@assets/index';

const FinalReviewScreen = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const { user } = useAuthStore();
  const { calculateCarValue, manulUesrDetails, updateCarDeatils } =
    useMotorDetalisStore();
  const { socket, connected } = useSocket();
  const { mutate: getMotorQuotes } = useGetMotorQuotes();
  const { data: reviewMotor = [] } = useReviewMotor({
    carId: calculateCarValue?._id,
    userId: user?._id,
  });
  const { showLoader, hideLoader } = useLottieLoader();

  const details = [
    { label: 'Year:', value: reviewMotor?.carData?.year ?? '-' },
    { label: 'Brand:', value: reviewMotor?.carData?.make ?? '-' },
    { label: 'Model:', value: reviewMotor?.carData?.model ?? '-' },
    { label: 'Trim:', value: reviewMotor?.carData?.trim ?? '-' },
    {
      label: 'Regional Spec:',
      value: reviewMotor?.carData?.regionalSpec ?? '-',
    },
    { label: 'Body Type:', value: reviewMotor?.carData?.bodyType ?? '-' },
    { label: 'No. of Doors:', value: reviewMotor?.carData?.noOfDoors ?? '-' },
    {
      label: 'No. of Seats:',
      value: reviewMotor?.carData?.noOfPassengers ?? '-',
    },
    { label: 'Cylinders:', value: reviewMotor?.carData?.cylinders ?? '-' },
    {
      label: 'Value:',
      value: reviewMotor?.carData?.price
        ? `${Number(reviewMotor?.carData.price).toLocaleString()} AED`
        : '-',
    },
    { label: 'Chassis No.:', value: reviewMotor?.carData?.chassisNo ?? '-' },
    {
      label: 'Reg. Card TC No.:',
      value: reviewMotor?.carData?.tcNumber ?? '-',
    },
    {
      label: 'Car Reg. Date:',
      value: reviewMotor?.carData?.registrationDate ?? '-',
    },
    {
      label: 'Reg. Card Expiry:',
      value: reviewMotor?.carData?.registrationExpiry ?? '-',
    },
  ];

  const user_details = [
    { label: 'Name:', value: reviewMotor?.userDetails?.fullName ?? '-' },
    {
      label: 'Mobile:',
      value:
        `+${reviewMotor?.userDetails?.countryCode} ${reviewMotor?.userDetails?.mobileNumber}` ??
        '-',
    },
    { label: 'Email:', value: reviewMotor?.userDetails?.email ?? '-' },
    {
      label: 'Date of Birth:',
      value:
        moment(reviewMotor?.userDetails?.dateOfBirth).format('DD/MM/YYYY') ??
        '-',
    },
    {
      label: 'Age:',
      value: reviewMotor?.userDetails?.age ?? '-',
    },
    {
      label: 'Nationality:',
      value: reviewMotor?.userDetails?.nationality ?? '-',
    },
    {
      label: 'Policy Issue Date:',
      value:
        moment(reviewMotor?.carData?.policyEffectiveDate).format(
          'DD/MM/YYYY',
        ) ?? '-',
    },
    {
      label: 'Car Value:',
      value: 'AED ' + reviewMotor?.carData?.price ?? '-',
    },
    {
      label: 'Year of No Claim:',
      value: reviewMotor?.carData?.yearOfNoClaim ?? '-',
    },
  ];

  const handleGetQuotes = () => {
    updateCarDeatils(reviewMotor);
    const userDetails = reviewMotor?.userDetails || manulUesrDetails;
    const carDetails = reviewMotor?.carData;
    const payload = {
      ...userDetails,
      carId: carDetails?._id,
      motorInfoId: manulUesrDetails?.motorInfoId,
      proposalId: manulUesrDetails?.proposalId,
    };

    console.log('payload', payload);

    showLoader('motor');

    getMotorQuotes(
      { data: payload },
      {
        onError: error => {
          hideLoader();
        },
      },
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View
        style={{
          width: Dimensions.get('screen').width - 70,
          height: 220,
        }}
      >
        <Image
          source={
            reviewMotor?.carData?.carImage
              ? {
                  uri: reviewMotor?.carData?.carImage,
                }
              : Images.CarPlace
          }
          resizeMode="stretch"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Car Details:</Text>
        {details.map(({ label, value }, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value ?? '-'}</Text>
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Your Details:</Text>
        {user_details.map(({ label, value }, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value ?? '-'}</Text>
          </View>
        ))}
      </View>

      <CustomButton
        title="Get Your Quotes"
        onPress={handleGetQuotes}
        buttonStyle={styles.button}
        isShowIcon
      />
    </ScrollView>
  );
};

export default FinalReviewScreen;

const style = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: verticalScale(15),
    },
    inner: {
      margin: '5%',
      gap: verticalScale(15),
    },
    title: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: verticalScale(22),
      fontFamily: 'Inter',
      textAlign: 'center',
    },
    subtitle: {
      fontWeight: '400',
      fontSize: verticalScale(14),
      fontFamily: 'Inter',
      color: theme.colors.description,
      textAlign: 'center',
    },
    section: { gap: verticalScale(8) },
    rangeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rangeText: {
      fontWeight: '400',
      fontSize: verticalScale(14),
      fontFamily: 'Inter',
      color: theme.colors.description,
    },
    input: {
      height: verticalScale(50),
      fontSize: verticalScale(16),
      backgroundColor: theme.colors.backgroundColor,
      borderColor: theme.colors.secondary,
      color: theme.colors.text,
    },
    dropdown: {
      borderColor: theme.colors.border,
    },
    dropdownContainer: {
      borderColor: theme.colors.border,
      maxHeight: 300,
    },
    detailsBox: {
      gap: verticalScale(10),
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
    button: {
      width: '75%',
      alignSelf: 'center',
      height: verticalScale(50),
      marginTop: verticalScale(20),
    },
    errorText: {
      color: theme.colors.red,
      fontSize: verticalScale(12),
      fontFamily: 'Inter',
      marginTop: -verticalScale(15),
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: verticalScale(15),
    },
  });
