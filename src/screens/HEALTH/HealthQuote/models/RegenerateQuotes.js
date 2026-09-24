import Header from '@components/ui/Header';
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Controller, set, useForm } from 'react-hook-form';
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
import CustomButton from '@components/ui/CustomButton';
import CustomDependentOption from '@components/ui/CustomDependentOption';

import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';
import {
  useGetHealthInsuranceInfo,
  useRegenerateQuotes,
  useUpdateHealthInsurance,
} from '@hooks/HEALTH/healthFlow/useHealthFlow';

import { ageCalculator } from '@utils/ageCalculator';
import { useThemeContext } from '@theme/ThemeProvider';

import Calender from '@assets/icons/Calender';
import Male from '@assets/svg/Male';
import Female from '@assets/svg/Female';
import Married from '@assets/svg/Married';
import { useHealthStore } from '@store/HEALTH/healthStore';

const RegenerateQuotes = ({ open, setOpen, internalRef, handleRegenerate }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { data: nationalList = [] } = useGetNationalList();
  const { data: healthInsuranceInfo = {} } = useGetHealthInsuranceInfo({
    reqId: internalRef,
  });

  const { mutate: updateHealthInsurance } = useUpdateHealthInsurance();
  const isSelfInsurance = healthInsuranceInfo?.insurerType === 'Self';

  const [dobModalOpen, setDobModalOpen] = useState(false);
  const [selectedDob, setSelectedDob] = useState(null);
  const [dependentError, setDependentError] = useState('');
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      mobileNumber: '',
      email: '',
      nationality: '',
      dateOfBirth: '',
      age: '',
      country: '',
      city: '',
      salary: 'Above 4000',
      gender: 'Male',
      maritalStatus: 'Single',
      visaStatus: 'New',
      visaType: null,
      currentInsurer: '',
      expiryDate: '',
      preExistingCondition: 'No',
      pregnantOrMaternity: 'No',
      hasKids: false,
      hasSpouse: false,
      kids: [],
      spouse: [],
    },
  });

  useEffect(() => {
    if (healthInsuranceInfo && Object.keys(healthInsuranceInfo).length > 0) {
      const formData = {
        name: healthInsuranceInfo.fullName || '',
        mobileNumber: healthInsuranceInfo.mobileNumber || '',
        email: healthInsuranceInfo.email || '',
        nationality: healthInsuranceInfo.nationality || '',
        dateOfBirth: healthInsuranceInfo.dateOfBirth || '',
        age: healthInsuranceInfo.dateOfBirth
          ? ageCalculator(healthInsuranceInfo.dateOfBirth)
          : '',
        country: healthInsuranceInfo.countryCode || '',
        city: healthInsuranceInfo.city || '',
        salary: healthInsuranceInfo.salary || 'Above 4000',
        gender: healthInsuranceInfo.gender || 'Male',
        maritalStatus: healthInsuranceInfo.maritalStatus || 'Single',
        visaStatus: healthInsuranceInfo.visaStatus || 'New',
        visaType: healthInsuranceInfo.visaType || null,
        currentInsurer: healthInsuranceInfo.currentInsurer || '',
        expiryDate: healthInsuranceInfo.expiryDate || '',
        preExistingCondition: healthInsuranceInfo.preExistingCondition || 'No',
        pregnantOrMaternity: healthInsuranceInfo.pregnantOrMaternity || 'No',
        hasKids: healthInsuranceInfo.hasKids || false,
        hasSpouse: healthInsuranceInfo.hasSpouse || false,
        kids: healthInsuranceInfo.kids || [],
        spouse: healthInsuranceInfo.spouse || [],
      };

      reset(formData);

      if (healthInsuranceInfo.dateOfBirth) {
        setSelectedDob(new Date(healthInsuranceInfo.dateOfBirth));
      }
    }
  }, [healthInsuranceInfo, reset]);

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
  const maritalStatus = watch('maritalStatus');
  const dateOfBirth = watch('dateOfBirth');

  const maritalOptions = useMemo(
    () => [
      {
        value: 'Single',
        label: 'Single',
        icon: gender === 'Male' ? <Male /> : <Female />,
      },
      { value: 'Married', label: 'Married', icon: <Married /> },
    ],
    [gender],
  );

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

  const isMarried = maritalStatus === 'Married';
  const showDependentsSection = !isSelfInsurance;

  const DATA = useMemo(() => {
    return isMarried
      ? [
          { label: 'Spouse', value: 'spouse' },
          { label: 'Kids', value: 'kids' },
        ]
      : [{ label: 'Kids', value: 'kids' }];
  }, [isMarried]);

  const [selectedIndex, setSelectedIndex] = useState(DATA[0].value);

  useEffect(() => {
    if (!isMarried && selectedIndex === 'spouse') {
      setSelectedIndex('kids');
    }
  }, [isMarried, selectedIndex]);

  useEffect(() => {
    if (!isMarried) {
      setValue('spouse', []);
      setValue('hasSpouse', false);
    }
  }, [isMarried, setValue]);

  useEffect(() => {
    if (isSelfInsurance) {
      setValue('spouse', []);
      setValue('kids', []);
      setValue('hasSpouse', false);
      setValue('hasKids', false);
      setDependentError('');
    }
  }, [isSelfInsurance, setValue]);

  const onDetailsChange = useCallback(
    (type, list) => {
      setDependentError('');

      if (type === 'spouse') {
        setValue('spouse', list, { shouldValidate: true });
        setValue('hasSpouse', list.length > 0);
      } else if (type === 'kids') {
        setValue('kids', list, { shouldValidate: true });
        setValue('hasKids', list.length > 0);
      }
    },
    [setValue],
  );

  const isValidDependent = dependent => {
    return (
      dependent.name &&
      dependent.name.trim() !== '' &&
      dependent.dateOfBirth &&
      dependent.gender
    );
  };

  const onSubmit = data => {
    setLoading(true);
    setDependentError('');

    if (!isSelfInsurance) {
      if (isMarried) {
        if (data.spouse.length === 0) {
          setDependentError('Please add spouse details');
          return;
        }
        if (!data.spouse.every(isValidDependent)) {
          setDependentError('Please complete all spouse details');
          return;
        }
      }

      if (data.kids.length === 0) {
        setDependentError('Please add at least one child');
        return;
      }
      if (!data.kids.every(isValidDependent)) {
        setDependentError('Please complete all child details');
        return;
      }
    }

    const submitData = {
      city: data.city,
      countryCode: '971',
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      fullName: data.name,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      mobile: `971${data.mobileNumber}`,
      mobileNumber: data.mobileNumber,
      nationality: data.nationality,
      salary: data.salary,
      spouse: !isSelfInsurance && isMarried ? data.spouse : [],
      kids: !isSelfInsurance ? data.kids : [],
    };

    updateHealthInsurance(
      {
        reqId: internalRef,
        data: submitData,
      },
      {
        onSuccess: () => {
          setChange(true);
          setLoading(false);
        },
      },
    );
  };

  const handleSegmentChange = useCallback(
    value => {
      if (DATA.length === 2) {
        setSelectedIndex(value === 0 ? 'spouse' : 'kids');
      } else if (DATA.length === 1) {
        setSelectedIndex('kids');
      }
    },
    [DATA.length],
  );

  const getSelectedSegmentIndex = useMemo(() => {
    if (DATA.length === 2) {
      return selectedIndex === 'spouse' ? 0 : 1;
    }
    return 0;
  }, [DATA.length, selectedIndex]);

  return (
    <Modal
      visible={open}
      animationType="slide"
      onRequestClose={() => {
        setOpen(false);
        setChange(false);
      }}
      presentationStyle={'fullScreen'}
    >
      <View style={styles.backdrop}>
        <Header
          title="Edit Details"
          onBack={() => {
            setOpen(false);
            setChange(false);
          }}
        />

        {change == true ? (
          <View
            style={{
              flex: 1,
              padding: verticalScale(20),
            }}
          >
            <Text
              style={{
                fontSize: verticalScale(18),
                color: theme.colors.text,
                fontFamily: 'Lato-Regular',
              }}
            >
              Your updated details require a fresh set of health quotes.
              Regenerate them now?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: verticalScale(20),
              }}
            >
              <CustomButton
                title="Cancel"
                onPress={() => {
                  setChange(false);
                }}
                type={'secondary'}
                buttonStyle={{
                  width: (Dimensions.get('screen').width - 60) / 2,
                }}
              />
              <CustomButton
                title="Regenerate"
                onPress={() => {
                  setOpen(false);
                  setChange(false);
                  handleRegenerate();
                }}
                buttonStyle={{
                  width: (Dimensions.get('screen').width - 60) / 2,
                }}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.container}>
              {/* Mobile Number */}
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
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
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
                      if (age > 100)
                        return 'Please enter a valid date of birth';
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
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
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
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
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
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
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
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Dependents Section - Show if NOT self insurance */}
              {showDependentsSection && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Add Dependents
                    {!isSelfInsurance && (
                      <Text style={styles.requiredText}> *</Text>
                    )}
                  </Text>

                  {/* Segment Control - Only show if married */}
                  {isMarried && (
                    <View style={styles.segmentContainer}>
                      {DATA.map((item, index) => (
                        <TouchableOpacity
                          key={item.value}
                          style={[
                            styles.segmentButton,
                            getSelectedSegmentIndex === index &&
                              styles.segmentButtonActive,
                          ]}
                          onPress={() => handleSegmentChange(index)}
                        >
                          <Text
                            style={[
                              styles.segmentText,
                              getSelectedSegmentIndex === index &&
                                styles.segmentTextActive,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={{ marginTop: verticalScale(15) }}>
                    {isMarried && selectedIndex === 'spouse' && (
                      <CustomDependentOption
                        type="Spouse"
                        onDependentsChange={list =>
                          onDetailsChange('spouse', list)
                        }
                        error={!!dependentError}
                        showErrorMessage={false}
                      />
                    )}

                    {(selectedIndex === 'kids' || !isMarried) && (
                      <CustomDependentOption
                        type="Kids"
                        onDependentsChange={list =>
                          onDetailsChange('kids', list)
                        }
                        error={!!dependentError}
                        showErrorMessage={false}
                      />
                    )}
                  </View>

                  {/* Display dependent error */}
                  {dependentError && (
                    <Text style={styles.errorText}>{dependentError}</Text>
                  )}
                </View>
              )}

              {/* Submit Button */}
              <CustomButton
                title={'Next'}
                onPress={handleSubmit(onSubmit)}
                isShowIcon
                isLoading={loading}
              />
            </View>

            {/* Date Picker Modal */}
            <DatePickerModal
              visible={dobModalOpen}
              maxDate={new Date()}
              initialDate={
                selectedDob ||
                (dateOfBirth
                  ? new Date(dateOfBirth)
                  : new Date(
                      new Date().setFullYear(new Date().getFullYear() - 25),
                    ))
              }
              onClose={() => setDobModalOpen(false)}
              onConfirm={handleDobConfirm}
            />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default RegenerateQuotes;

const style = theme =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: theme.colors.backgroundColor },
    scrollContent: {
      paddingBottom: verticalScale(30),
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: verticalScale(20),
      padding: moderateScale(15),
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
    requiredText: {
      color: theme.colors.red,
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
    segmentContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.border,
      borderRadius: verticalScale(8),
      padding: verticalScale(4),
    },
    segmentButton: {
      flex: 1,
      paddingVertical: verticalScale(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: verticalScale(6),
    },
    segmentButtonActive: {
      backgroundColor: theme.colors.backgroundColor,
    },
    segmentText: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    segmentTextActive: {
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
  });
