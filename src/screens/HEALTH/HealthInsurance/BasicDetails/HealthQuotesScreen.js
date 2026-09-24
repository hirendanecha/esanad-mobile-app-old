import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import moment from 'moment';

import { moderateScale, verticalScale } from '@constants/metrics';
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';

import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import DatePickerModal from '@components/ui/CustomDatePicker';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';
import CustomRadioGroup from '@components/ui/CustomRadioGroup';
import CustomRadioIcon from '@components/ui/CustomRadioIcon';

import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';
import { useCreateManualUser } from '@hooks/HEALTH/healthFlow/useHealthFlow';

import { useAuthStore } from '@store/authStore';
import { useHealthStore } from '@store/HEALTH/healthStore';

import { ageCalculator } from '@utils/ageCalculator';
import { useThemeContext } from '@theme/ThemeProvider';

import Calender from '@assets/icons/Calender';
import Male from '@assets/svg/Male';
import Female from '@assets/svg/Female';
import Married from '@assets/svg/Married';

// Accept renderSubmitButton prop from parent
const HealthQuotesScreen = ({
  control,
  errors,
  setValue,
  watch,
  renderSubmitButton, // Add this prop
}) => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data: nationalList = [] } = useGetNationalList();
  const { user } = useAuthStore();
  const { insuranceFor } = useHealthStore();
  const { mutate: createManualUser } = useCreateManualUser();

  const [dobModalOpen, setDobModalOpen] = useState(false);
  const [selectedDob, setSelectedDob] = useState(null);

  const nationalityOptions = useMemo(
    () => nationalList.map(n => ({ label: n, value: n })),
    [nationalList],
  );

  const genderOptions = useMemo(
    () => [
      { value: 'Male', label: 'Male', icon: <Male /> },
      { value: 'Female', label: 'Female', icon: <Female /> },
    ],
    [],
  );

  const gender = watch('gender');
  const maritalOptions = useMemo(
    () => [
      {
        value: 'Single',
        label: 'Single',
        icon: gender == 'Male' ? <Male /> : <Female />,
      },
      { value: 'Married', label: 'Married', icon: <Married /> },
    ],
    [gender],
  );

  const dateOfBirth = watch('dateOfBirth');

  const handleDobConfirm = useCallback(
    date => {
      const isoDate = date.toISOString();
      setSelectedDob(date);
      setValue('dateOfBirth', isoDate, { shouldValidate: true });
      setValue('age', ageCalculator(isoDate));
      setDobModalOpen(false);
    },
    [setValue],
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Mobile */}
      <Controller
        control={control}
        name="mobileNumber"
        rules={{
          required: 'Mobile number is required',
          minLength: { value: 9, message: 'At least 9 digits' },
          maxLength: { value: 9, message: 'Max 9 digits allowed' },
        }}
        render={({ field }) => (
          <CountryPhoneInput
            value={field.value}
            maxLength={9}
            onChange={({ country, phone }) => {
              setValue('mobileNumber', phone, { shouldValidate: true });
              setValue('country', country);
            }}
            errors={errors.mobileNumber?.message}
          />
        )}
      />

      {/* Name */}
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <FloatingLabelInput
            label="Your Full Name"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.name?.message}
            showErrorMessage
          />
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
        }}
        render={({ field }) => (
          <FloatingLabelInput
            label="Email Address"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
            showErrorMessage
            autoCapitalize="none"
          />
        )}
      />

      {/* DOB + Age */}
      <View style={styles.row}>
        <Controller
          control={control}
          name="dateOfBirth"
          rules={{
            required: 'Date of Birth is required',
            validate: value => {
              if (!value) return 'Date of Birth is required';
              const age = ageCalculator(value);
              if (age < 18) return 'You must be at least 18 years old';
              if (age > 100) return 'Please enter a valid date of birth';
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <View style={styles.flexOne}>
              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  fieldState.error && styles.errorBorder,
                ]}
                onPress={() => setDobModalOpen(true)}
              >
                <Text
                  style={[
                    styles.datePickerLabel,
                    {
                      color: fieldState.error
                        ? theme.colors.red
                        : field.value
                        ? theme.colors.primary
                        : theme.colors.text,
                    },
                  ]}
                >
                  Date of Birth
                </Text>
                <Text
                  style={[
                    styles.datePickerText,
                    !field.value && styles.placeholderText,
                  ]}
                >
                  {field.value
                    ? moment(field.value).format('DD-MM-YYYY')
                    : 'Select date'}
                </Text>
                <Calender />
              </TouchableOpacity>
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="age"
          render={({ field }) => (
            <FloatingLabelInput
              label="Age"
              value={String(field.value || '')}
              disabled
              style={styles.ageInput}
            />
          )}
        />
      </View>

      {/* Nationality */}
      <View style={styles.section}>
        <Controller
          control={control}
          name="nationality"
          rules={{ required: 'Nationality is required' }}
          render={({ field, fieldState }) => (
            <>
              <CustomDropDownList
                title="Select Nationality"
                value={field.value}
                data={nationalityOptions}
                handleSelect={v => field.onChange(v)}
                errors={fieldState.error?.message}
                absolute
              />
              <CustomOptionList
                items={HEALTH_CONSTANTS.COUNTRIES}
                value={field.value}
                column={4}
                length={4}
                onPress={item => field.onChange(item.value)}
              />
            </>
          )}
        />
      </View>

      {/* City */}
      <View style={styles.section}>
        <Controller
          control={control}
          name="city"
          rules={{ required: 'City is required' }}
          render={({ field, fieldState }) => (
            <>
              <CustomDropDownList
                title="What is your visa issuance city?"
                value={field.value}
                data={HEALTH_CONSTANTS.CITY}
                handleSelect={v => field.onChange(v)}
                errors={fieldState.error?.message}
                showSearch={false}
                absolute
              />
              <CustomOptionList
                items={HEALTH_CONSTANTS.CITY}
                value={field.value}
                column={4}
                length={4}
                onPress={item => field.onChange(item.value)}
              />
            </>
          )}
        />
      </View>

      {/* Salary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salary (AED per month)</Text>
        <Controller
          control={control}
          name="salary"
          rules={{ required: 'Salary is required' }}
          render={({ field, fieldState }) => (
            <>
              <CustomRadioGroup
                options={[
                  { label: 'Above 4000', value: 'Above 4000' },
                  { label: 'Below 4000', value: 'Below 4000' },
                ]}
                onChange={item => field.onChange(item.value)}
                selected={field.value}
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Gender */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <Controller
          control={control}
          name="gender"
          rules={{ required: 'Gender is required' }}
          render={({ field, fieldState }) => (
            <>
              <CustomRadioIcon
                options={genderOptions}
                value={field.value}
                onSelect={item => field.onChange(item.value)}
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Marital Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marital Status</Text>
        <Controller
          control={control}
          name="maritalStatus"
          rules={{ required: 'Marital status is required' }}
          render={({ field, fieldState }) => (
            <>
              <CustomRadioIcon
                options={maritalOptions}
                value={field.value}
                onSelect={item => field.onChange(item.value)}
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Render the submit button from parent */}
      {renderSubmitButton && renderSubmitButton()}

      <DatePickerModal
        visible={dobModalOpen}
        maxDate={new Date()}
        initialDate={
          selectedDob ||
          (dateOfBirth
            ? new Date(dateOfBirth)
            : new Date(new Date().setFullYear(new Date().getFullYear() - 25)))
        }
        onClose={() => setDobModalOpen(false)}
        onConfirm={handleDobConfirm}
      />
    </ScrollView>
  );
};

export default HealthQuotesScreen;

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: moderateScale(15),
      paddingTop: verticalScale(15),
      paddingBottom: verticalScale(10),
      gap: verticalScale(20),
    },
    row: {
      flexDirection: 'row',
      gap: verticalScale(15),
    },
    flexOne: {
      flex: 1,
    },
    section: {
      gap: verticalScale(10),
    },
    sectionTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    ageInput: {
      flex: 0.5,
    },
    errorText: {
      marginTop: verticalScale(4),
      fontSize: moderateScale(13),
      color: theme.colors.red,
    },
    errorBorder: {
      borderColor: theme.colors.red,
    },
    datePickerButton: {
      height: verticalScale(50),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    datePickerLabel: {
      position: 'absolute',
      top: -verticalScale(7),
      left: verticalScale(13),
      backgroundColor: theme.colors.backgroundColor,
      paddingHorizontal: verticalScale(5),
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    datePickerText: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
    },
    placeholderText: {
      color: theme.colors.description,
    },
  });
