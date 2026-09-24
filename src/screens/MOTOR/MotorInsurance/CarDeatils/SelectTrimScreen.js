import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { CONSTANTS } from '@constants/staticJson';
import {
  useCreateCarManually,
  useGetCarDetails,
  useGetTrimList,
} from '@hooks/motorflow/useMotorFlow';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';

import CustomOptionList from '@components/ui/CustomOptionList';
import CustomButton from '@components/ui/CustomButton';
import CustomRadio from '@components/ui/CustomRadio';
import CustomRadioGroup from '@components/ui/CustomRadioGroup';

const SelectTrimScreen = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const {
    year,
    brand,
    model,
    trim,
    updateTrim,
    registeredYear,
    regionalSpace,
    updateRegisteredYear,
    updateRegionalSpace,
    updateIsRenewing,
    updateIsNewCar,
    updateStep,
    updateSubStep,
    isRenewing,
    isNewCar,
  } = useMotorStore();

  const [value, setValue] = useState(trim || null);
  const [items, setItems] = useState([]);
  const [valueRegisteredYear, setValueRegisteredYear] = useState(
    registeredYear || null,
  );
  const [selectedValueRenew, setSelectedValueRenew] = useState(isRenewing);
  const [selectedValueNewCar, setSelectedValueNewCar] = useState(isNewCar);

  const { data: trimList = [] } = useGetTrimList({
    year,
    make: brand,
    model,
  });

  useEffect(() => {
    if (trimList?.length) {
      const formatted = trimList.map(item => ({
        label: item,
        value: item,
      }));
      setItems(formatted);
    }
  }, [trimList]);

  const { data: carDetails = {}, refetch } = useGetCarDetails({
    year,
    make: brand,
    model,
    trim: trim || value,
  });

  useEffect(() => {
    if (trim != null) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trim]);

  const { mutate: createCarManually, isLoading } = useCreateCarManually();

  const registrationYears = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const y = new Date().getFullYear() - i;
      return { label: y.toString(), value: y.toString() };
    });
  }, []);

  function generateChassisNumber() {
    const length = 17;
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
  }

  const HandleCreateCarManually = () => {
    const payload = {
      bodyType: carDetails?.bodyType,
      chesisNo: generateChassisNumber(),
      cylinders: carDetails?.cylinders,
      isRenewal: selectedValueRenew,
      newCar: selectedValueNewCar,
      regionalSpec: regionalSpace,
      registrationYear: registeredYear || '',
      make: brand,
      model,
      trim,
      year,
      fromDate: new Date().toLocaleDateString('en-US'),
      transmission: carDetails?.transmission,
      noOfPassengers: carDetails?.noOfPassengers,
      engineSize: carDetails?.engineSize,
    };

    createCarManually(payload);
    updateStep(1);
    updateSubStep(1);
  };

  const updateTrimValue = val => {
    if (val) {
      setValue(val);
      updateTrim(val);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerWrapper}>
        <Text style={styles.title}>Your Car Details</Text>

        <Text style={styles.subtitle}>
          Please use the wizard below to tell us which car you want to insure
        </Text>

        <CustomDropDownList
          title="Select Trim"
          value={value}
          data={items}
          handleSelect={updateTrimValue}
          isLoading={isLoading}
          showSearch={items.length > 4}
          theme={theme}
          absolute
          keyExtractor={item => item.value.toString()}
          searchPlaceholder="Search trim..."
        />

        <CustomOptionList
          items={items}
          value={value}
          onPress={value => updateTrimValue(value?.value)}
        />

        {/* Regional Space Radio */}
        <CustomRadio
          options={[
            { value: 'GCC', label: 'GCC' },
            { value: 'Non-GCC', label: 'Non-GCC' },
          ]}
          value={regionalSpace}
          onSelect={option => updateRegionalSpace(option.value)}
        />

        {/* Renewing Radio */}
        <View style={{ gap: verticalScale(12) }}>
          <Text style={styles.radioLabel}>
            Are you renewing your insurance?
          </Text>
          <CustomRadioGroup
            options={CONSTANTS.RENEWING_OPTIONS}
            selected={selectedValueRenew}
            onChange={value => {
              setSelectedValueRenew(value);
              updateIsRenewing(value);
              if (value === true) {
                setSelectedValueNewCar(true);
                setValueRegisteredYear(null);
              }
            }}
            flexDirection={'row'}
          />
        </View>

        {/* New Car Radio */}
        {selectedValueRenew === false && (
          <View style={{ gap: verticalScale(12) }}>
            <Text style={styles.radioLabel}>Is it a brand new car?</Text>
            <CustomRadioGroup
              options={CONSTANTS.NEW_CAR_OPTIONS}
              selected={selectedValueNewCar}
              onChange={value => {
                setSelectedValueNewCar(value);
                updateIsNewCar(value);
                if (value === true) {
                  setValueRegisteredYear(null);
                }
              }}
              flexDirection={'row'}
            />
          </View>
        )}

        {selectedValueNewCar === false && selectedValueRenew === false && (
          <CustomDropDownList
            title="First year of registration"
            value={valueRegisteredYear}
            data={registrationYears}
            handleSelect={e => updateRegisteredYear(e)}
            isLoading={isLoading}
            showSearch
            theme={theme}
            keyExtractor={item => item.value.toString()}
            searchPlaceholder="Search first year of registration..."
          />
        )}

        <CustomButton
          title="Next"
          disabled={
            !value ||
            !regionalSpace ||
            (selectedValueRenew === false &&
              selectedValueNewCar === false &&
              !valueRegisteredYear)
          }
          onPress={() => HandleCreateCarManually()}
          buttonStyle={{ width: '75%', alignSelf: 'center' }}
          isShowIcon
        />
      </View>
    </View>
  );
};

export default SelectTrimScreen;

const style = theme =>
  StyleSheet.create({
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
    radioLabel: {
      fontWeight: '400',
      fontSize: moderateScale(14),
      fontFamily: 'Inter',
      color: theme.colors.description,
    },
  });
