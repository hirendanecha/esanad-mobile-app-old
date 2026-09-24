import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useHealthStore } from '@store/HEALTH/healthStore';

import CustomDependentOption from '@components/ui/CustomDependentOption';
import CustomButton from '@components/ui/CustomButton';
import { Images } from '@assets/index';

const InsuranceForWhom = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const {
    insuranceFor,
    updateStep,
    updateSubStep,
    maritalStatus,
    updateKidsDetails,
    updateSpouseDetails,
  } = useHealthStore();

  const [dependents, setDependents] = useState({
    kids: false,
    spouse: false,
  });

  const [details, setDetails] = useState({
    kids: [],
    spouse: [],
  });

  console.log('insuranceFor', insuranceFor, maritalStatus);

  const [error, setError] = useState('');

  const isMarried = maritalStatus === 'Married';

  // Show spouse option when:
  // - User is married AND (it's dependent only OR self is included)
  const showSpouseOption = isMarried;

  const handleDependentToggle = (type, checked) => {
    setDependents(prev => ({ ...prev, [type]: checked }));
    if (!checked) {
      setDetails(prev => ({ ...prev, [type]: [] }));
    }
    setError('');
  };

  const isValidDependent = dep => dep.fullName && dep.dateOfBirth && dep.gender;

  const validateAndProceed = () => {
    const { kids, spouse } = dependents;

    setError('');

    // Check if at least one dependent type is selected
    if (!kids && !spouse) {
      setError('Please select at least one option (Kids or Spouse)');
      return;
    }

    // Validate kids details if kids are selected
    if (kids) {
      if (details.kids.length === 0) {
        setError('Please add at least one child');
        return;
      }
      if (!details.kids.every(isValidDependent)) {
        setError('Please complete all child details');
        return;
      }
    }

    // Validate spouse details if spouse is selected
    if (spouse) {
      if (details.spouse.length === 0) {
        setError('Please add spouse details');
        return;
      }
      if (!details.spouse.every(isValidDependent)) {
        setError('Please complete all spouse details');
        return;
      }
    }

    const insuranceData = {};
    if (kids) insuranceData.kidsDetails = details.kids;
    if (spouse) insuranceData.spouseDetails = details.spouse;

    console.log('✅ Insurance Data:', JSON.stringify(insuranceData, null, 2));

    // Save to store
    if (kids) {
      updateKidsDetails(details.kids);
    }
    if (spouse) {
      updateSpouseDetails(details.spouse);
    }

    updateSubStep(1);
    updateStep(1);
  };

  return (
    <View style={styles.scrollContent}>
      <View style={styles.innerContainer}>
        <View style={styles.detailsContainer}>
          <Image
            source={Images.YellowHighlight}
            style={styles.highlightImage}
            resizeMode="stretch"
          />
          <Text style={styles.titleText}>Who's this insurance for?</Text>
        </View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {showSpouseOption && (
          <CustomDependentOption
            type="Spouse"
            value={dependents.spouse}
            onChange={checked => handleDependentToggle('spouse', checked)}
            onDependentsChange={list =>
              setDetails(prev => ({ ...prev, spouse: list }))
            }
            error={!!error}
            showErrorMessage={!!error}
          />
        )}

        <CustomDependentOption
          type="Kids"
          value={dependents.kids}
          onChange={checked => handleDependentToggle('kids', checked)}
          onDependentsChange={list =>
            setDetails(prev => ({ ...prev, kids: list }))
          }
          error={!!error}
          showErrorMessage={!!error}
        />

        <CustomButton
          title="Next"
          onPress={validateAndProceed}
          isLoading={false}
          disabled={false}
          isShowIcon
          buttonStyle={styles.buttonStyle}
        />
      </View>
    </View>
  );
};

export default InsuranceForWhom;

const getStyles = theme =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: verticalScale(20),
      width: '90%',
      alignSelf: 'center',
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
    errorText: {
      color: theme.colors.red,
      fontSize: moderateScale(14),
      textAlign: 'center',
      marginTop: verticalScale(5),
    },
    buttonStyle: {
      width: '75%',
      alignSelf: 'center',
      marginVertical: verticalScale(20),
    },
  });
