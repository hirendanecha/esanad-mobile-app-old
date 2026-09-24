import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';

import CustomOptionList from '@components/ui/CustomOptionList';
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';
import { useHealthStore } from '@store/HEALTH/healthStore';
import CustomButton from '@components/ui/CustomButton';
import { Images } from '@assets/index';

const SKIP_SUBSTEP_5 = ['Self', 'Self (Investor)'];

const GenderMaritalScreen = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const {
    gender,
    maritalStatus,
    updateGender,
    updateMaritalStatus,
    updateStep,
    updateSubStep,
    insuranceFor,
  } = useHealthStore();

  const [value, setValue] = useState(gender);
  const [marital, setMarital] = useState(maritalStatus);

  const handleNextNavigation = useMemo(() => {
    const shouldSkipSubstep5 = SKIP_SUBSTEP_5.includes(insuranceFor);

    return () => {
      if (shouldSkipSubstep5) {
        updateStep(1);
        updateSubStep(1);
      } else {
        updateSubStep(5);
      }
    };
  }, [insuranceFor, updateStep, updateSubStep]);

  const handleGenderSelect = val => {
    if (val) {
      setValue(val);
      updateGender(val);
    }
  };

  const handleMaritalSelect = val => {
    if (val) {
      setMarital(val);
      updateMaritalStatus(val);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.detailsContainer}>
          <Image
            source={Images.YellowHighlight}
            style={styles.highlightImage}
            resizeMode="stretch"
          />
          <Text style={styles.titleText}>Who’s this insurance for?</Text>
        </View>

        <View style={styles.salaryDetailsContainer}>
          <Text style={styles.salaryText}>Gender</Text>
        </View>

        <CustomOptionList
          items={HEALTH_CONSTANTS.GENDER}
          length={6}
          value={value}
          onPress={val => handleGenderSelect(val?.value)}
        />

        <View style={styles.salaryDetailsContainer}>
          <Text style={styles.salaryText}>Marital Status</Text>
        </View>

        <CustomOptionList
          items={HEALTH_CONSTANTS.MARITAL_STATUS}
          value={marital}
          onPress={val => handleMaritalSelect(val?.value)}
        />

        <CustomButton
          title="Next"
          disabled={!value || !marital}
          onPress={handleNextNavigation}
          buttonStyle={styles.buttonStyle}
          isShowIcon
        />
      </View>
    </View>
  );
};

export default GenderMaritalScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      width: '90%',
      alignSelf: 'center',
      flex: 1,
      marginTop: verticalScale(20),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
    },
    innerContainer: {
      margin: verticalScale(20),
      gap: verticalScale(20),
    },
    detailsContainer: {
      gap: verticalScale(14),
      alignItems: 'center',
      textAlign: 'center',
      height: 60,
      justifyContent: 'center',
    },
    highlightImage: {
      width: 120,
      height: 70,
      transform: [{ rotate: '-10deg' }],
      position: 'absolute',
    },
    titleText: {
      color: theme.colors.text,
      fontWeight: '500',
      fontSize: moderateScale(25),
      fontFamily: 'Inter',
    },
    salaryDetailsContainer: {
      alignItems: 'center',
      marginVertical: verticalScale(10),
      textAlign: 'center',
    },
    salaryText: {
      color: theme.colors.text,
      fontWeight: '500',
      fontSize: moderateScale(16),
      fontFamily: 'Inter',
    },
    buttonStyle: {
      width: '75%',
      alignSelf: 'center',
      marginTop: 20,
    },
  });
