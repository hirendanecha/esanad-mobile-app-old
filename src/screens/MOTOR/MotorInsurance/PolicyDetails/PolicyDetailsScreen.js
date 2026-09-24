import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePickerModal from '@components/ui/CustomDatePicker';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import { useAuthStore } from '@store/authStore';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useCalculateCarValue } from '@hooks/motorflow/useMotorFlow';
import { useThemeContext } from '@theme/ThemeProvider';

import CustomButton from '@components/ui/CustomButton';
import CustomCheckBox from '@components/ui/CustomCheckBox';

const PolicyDetailsScreen = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const {
    createCarManual,
    isComprehensiveInsurance,
    isActiveInsurance,
    updateIsComprehensiveInsurance,
    updateIsActiveInsurance,
    updatePolicyDetails,
  } = useMotorDetalisStore();

  const { user } = useAuthStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date(Date.now() + 86400000));
  const [isToday, setIsToday] = useState(true);
  const [isComprehensive, setIsComprehensive] = useState(
    isComprehensiveInsurance,
  );
  const [isCurrentInsuranceActive, setIsCurrentInsuranceActive] =
    useState(isActiveInsurance);

  const { mutate: calculateCarValue } = useCalculateCarValue();

  const handleNext = async () => {
    const payload = {
      carId: createCarManual?._id,
      make: createCarManual?.make,
      model: createCarManual?.model,
      trim: createCarManual?.trim,
      year: createCarManual?.year,
      nationality: 'Albania',
      dateOfBirth: user?.dateOfBirth,
    };

    calculateCarValue(payload);
  };

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.innerWrapper}>
            <Text style={styles.title}>Policy Details</Text>

            <Text style={styles.subtitle}>
              When do you want your policy to start?
            </Text>

            <TouchableOpacity
              style={[styles.optionBox, isToday && styles.optionSelected]}
              onPress={() => setIsToday(true)}
            >
              <Text style={styles.optionTitle}>Today</Text>
              <Text style={styles.optionText}>
                {new Date().toLocaleDateString('en-GB')}
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <TouchableOpacity
              style={[styles.optionBox, !isToday && styles.optionSelected]}
              underlayColor={theme.colors.floorBgColor}
              onPress={() => {
                setModalOpen(true);
                setIsToday(false);
              }}
            >
              <>
                <Text style={styles.optionTitle}>Future Date</Text>
                <Text style={styles.optionText}>
                  {new Date(date).toLocaleDateString('en-GB')}
                </Text>
              </>
            </TouchableOpacity>

            <View style={{ gap: verticalScale(15) }}>
              <CustomCheckBox
                label="My current insurance is Comprehensive"
                value={isComprehensive}
                onChange={val => {
                  setIsComprehensive(val);
                  updateIsComprehensiveInsurance(val);
                }}
              />
              <CustomCheckBox
                label="My current insurance is still active (not expired)"
                value={isCurrentInsuranceActive}
                onChange={val => {
                  setIsCurrentInsuranceActive(val);
                  updateIsActiveInsurance(val);
                }}
              />
            </View>

            <CustomButton
              title="Next"
              onPress={handleNext}
              disabled={!isCurrentInsuranceActive}
              isShowIcon
              buttonStyle={styles.nextButton}
            />
          </View>
        </View>
      </View>

      <DatePickerModal
        visible={modalOpen}
        initialDate={date}
        onClose={() => setModalOpen(false)}
        minDate={new Date()}
        onConfirm={selectedDate => {
          setDate(selectedDate);
          updatePolicyDetails(selectedDate);
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default PolicyDetailsScreen;

const style = theme =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    container: {
      width: '90%',
      flex: 1,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      marginTop: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor,
    },
    innerWrapper: {
      margin: '5%',
      gap: verticalScale(20),
    },
    title: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: moderateScale(22),
      fontFamily: 'Inter',
      textAlign: 'center',
    },
    subtitle: {
      fontWeight: '400',
      fontSize: moderateScale(14),
      fontFamily: 'Inter',
      color: theme.colors.description,
      textAlign: 'center',
    },
    optionBox: {
      gap: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      padding: verticalScale(14),
      borderColor: theme.colors.border,
      borderRadius: verticalScale(5),
      backgroundColor: theme.colors.backgroundColor,
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
      backgroundColor: theme.colors.floorBgColor,
    },
    optionTitle: {
      fontWeight: '700',
      fontSize: moderateScale(15),
      fontFamily: 'Inter',
      color: theme.colors.primary,
    },
    optionText: {
      fontWeight: '400',
      fontSize: moderateScale(15),
      fontFamily: 'Inter',
      color: theme.colors.text,
    },
    orText: {
      fontWeight: '700',
      fontSize: moderateScale(15),
      fontFamily: 'Inter',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    nextButton: {
      marginTop: verticalScale(40),
      width: '80%',
      alignSelf: 'center',
    },
  });
