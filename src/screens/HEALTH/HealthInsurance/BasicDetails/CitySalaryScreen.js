import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';

import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';
import { useHealthStore } from '@store/HEALTH/healthStore';
import CustomButton from '@components/ui/CustomButton';
import { Images } from '@assets/index';

const SKIP_SUBSTEP_4 = ['Dependent only', "Investor's Dependent only"];
const SKIP_SUBSTEP_5 = ['Self', 'Self (Investor)'];

const CitySalaryScreen = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const {
    city,
    updateCity,
    salary,
    updateSalary,
    updateStep,
    updateSubStep,
    insuranceFor,
  } = useHealthStore();

  const [value, setValue] = useState(city);
  const [salaryOption, setSalaryOption] = useState(salary);

  const getNextSubstep = useMemo(() => {
    const shouldSkipSubstep4 = SKIP_SUBSTEP_4.includes(insuranceFor);
    const shouldSkipSubstep5 = SKIP_SUBSTEP_5.includes(insuranceFor);

    if (shouldSkipSubstep4) {
      return 5;
    } else {
      return 4;
    }
  }, [insuranceFor]);

  const handleCitySelect = val => {
    if (val) {
      setValue(val);
      updateCity(val);
    }
  };

  const handleSalarySelect = val => {
    if (val) {
      setSalaryOption(val);
      updateSalary(val);
    }
  };

  const handleNext = () => {
    updateSubStep(getNextSubstep);
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

        <CustomDropDownList
          title="City"
          value={value}
          absolute
          data={HEALTH_CONSTANTS.CITY}
          handleSelect={handleCitySelect}
          theme={theme}
          keyExtractor={item => item.value.toString()}
          showSearch={false}
          searchPlaceholder="Search city..."
        />

        <CustomOptionList
          items={HEALTH_CONSTANTS.CITY}
          length={6}
          value={value}
          onPress={val => handleCitySelect(val?.value)}
        />

        <View style={styles.salaryDetailsContainer}>
          <Text style={styles.salaryText}>Salary</Text>
        </View>

        <CustomOptionList
          items={HEALTH_CONSTANTS.SALARY}
          value={salaryOption}
          onPress={val => handleSalarySelect(val?.value)}
        />

        <CustomButton
          title="Next"
          disabled={!value || !salaryOption}
          onPress={handleNext}
          buttonStyle={styles.buttonStyle}
          isShowIcon
        />
      </View>
    </View>
  );
};

export default CitySalaryScreen;

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
      marginVertical: 20,
    },
  });
