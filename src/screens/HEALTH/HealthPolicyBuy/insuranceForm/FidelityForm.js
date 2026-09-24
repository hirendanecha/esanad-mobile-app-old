import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CustomButton from '@components/ui/CustomButton';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import DatePickerModal from '@components/ui/CustomDatePicker';
import CustomCheckBox from '@components/ui/CustomCheckBox';
import dayjs from 'dayjs';

const FidelityForm = ({
  onSave,
  onCancel,
  companyId,
  policyData,
  setFormData,
}) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [familyCount, setFamilyCount] = useState(1);
  const [medicalConditionsCount, setMedicalConditionsCount] = useState(0);
  const [datePickerVisible, setDatePickerVisible] = useState(null);
  const [activeDateField, setActiveDateField] = useState('');

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
    watch,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      members: [
        {
          fullName: '',
          nationality: '',
          dateOfBirth: null,
          gender: '',
          maritalStatus: '',
          weight: '',
          height: '',
          principalName: '',
          relation: '',
          email: '',
          mobileNumber: '',
          medicalQuestions: {
            medications: {
              isTaking: false,
              bloodPressure: '',
              cholesterol: '',
              insulin: '',
              otherMedications: '',
              onsetDate: '',
            },
            treatments: {
              underObservation: false,
              conditions: '',
              onsetDate: '',
            },
            chronicIllness: {
              hasChronic: false,
              conditions: '',
              onsetDate: '',
            },
            cancer: {
              hasCancer: false,
              conditions: '',
              onsetDate: '',
            },
            otherConditions: {
              hasOther: false,
              conditions: '',
              onsetDate: '',
            },
            substanceUse: {
              usesSubstance: false,
              details: '',
              onsetDate: '',
            },
            mentalDisorders: {
              hasMental: false,
              details: '',
              onsetDate: '',
            },
            pregnancy: {
              isPregnant: false,
              lastMenstrualDate: null,
              trimester: '',
              fertilityTreatment: '',
              complications: '',
              multiplePregnancy: '',
            },
          },
          conditions: [],
        },
      ],
      privacyConsent: false,
    },
  });

  const privacyConsent = watch('privacyConsent', false);
  const { data: nationalList = [], isLoading: loading } = useGetNationalList();

  // ✅ Fixed: useMemo at top level
  const nationalities = useMemo(
    () => nationalList.map(y => ({ label: y, value: y })),
    [nationalList],
  );

  // ✅ Fixed: useCallback for formatDate
  const formatDate = useCallback(dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }, []);

  const handleDateSelect = (field, date) => {
    setValue(field, date);
    setDatePickerVisible(null);
    setActiveDateField('');
  };

  const openDatePicker = field => {
    setActiveDateField(field);
    setDatePickerVisible(true);
  };

  useEffect(() => {
    if (policyData?.healthInfo) {
      const healthInfo = policyData.healthInfo;
      setValue('members[0].fullName', healthInfo.fullName || '');
      setValue('members[0].nationality', healthInfo.nationality || '');
      setValue(
        'members[0].dateOfBirth',
        healthInfo.dateOfBirth ? dayjs(healthInfo.dateOfBirth) : null,
      );
      setValue('members[0].gender', healthInfo.gender || '');
      setValue('members[0].maritalStatus', healthInfo.maritalStatus || '');
      setValue('members[0].weight', healthInfo.weight || '');
      setValue('members[0].height', healthInfo.height || '');
      setValue('members[0].principalName', healthInfo.principalName || '');
      setValue('members[0].relation', healthInfo.relation || '');
      setValue('members[0].email', healthInfo.email || '');
      setValue('members[0].mobileNumber', healthInfo.mobileNumber || '');
    }
  }, [policyData, setValue]);

  useEffect(() => {
    const subscription = watch(value => {
      const formData = {
        // Members data
        ...value.members
          ?.map((member, index) => ({
            [`member_fullName_${index + 1}`]: member.fullName || '',
            [`member_nationality_${index + 1}`]: member.nationality || '',
            [`member_dateOfBirth_${index + 1}`]: formatDate(member.dateOfBirth),
            [`member_gender_${index + 1}`]: member.gender || '',
            [`member_maritalStatus_${index + 1}`]: member.maritalStatus || '',
            [`member_weight_${index + 1}`]: member.weight || '',
            [`member_height_${index + 1}`]: member.height || '',
            [`member_principalName_${index + 1}`]: member.principalName || '',
            [`member_relation_${index + 1}`]: member.relation || '',
            [`member_email_${index + 1}`]: member.email || '',
            [`member_mobileNumber_${index + 1}`]: member.mobileNumber || '',

            // Medical Questions
            [`medications_isTaking_${index + 1}`]:
              member.medicalQuestions?.medications?.isTaking || false,
            [`medications_bloodPressure_${index + 1}`]:
              member.medicalQuestions?.medications?.bloodPressure || '',
            [`medications_cholesterol_${index + 1}`]:
              member.medicalQuestions?.medications?.cholesterol || '',
            [`medications_insulin_${index + 1}`]:
              member.medicalQuestions?.medications?.insulin || '',
            [`medications_otherMedications_${index + 1}`]:
              member.medicalQuestions?.medications?.otherMedications || '',
            [`medications_onsetDate_${index + 1}`]:
              member.medicalQuestions?.medications?.onsetDate || '',

            [`treatments_underObservation_${index + 1}`]:
              member.medicalQuestions?.treatments?.underObservation || false,
            [`treatments_conditions_${index + 1}`]:
              member.medicalQuestions?.treatments?.conditions || '',
            [`treatments_onsetDate_${index + 1}`]:
              member.medicalQuestions?.treatments?.onsetDate || '',

            [`chronicIllness_hasChronic_${index + 1}`]:
              member.medicalQuestions?.chronicIllness?.hasChronic || false,
            [`chronicIllness_conditions_${index + 1}`]:
              member.medicalQuestions?.chronicIllness?.conditions || '',
            [`chronicIllness_onsetDate_${index + 1}`]:
              member.medicalQuestions?.chronicIllness?.onsetDate || '',

            [`cancer_hasCancer_${index + 1}`]:
              member.medicalQuestions?.cancer?.hasCancer || false,
            [`cancer_conditions_${index + 1}`]:
              member.medicalQuestions?.cancer?.conditions || '',
            [`cancer_onsetDate_${index + 1}`]:
              member.medicalQuestions?.cancer?.onsetDate || '',

            [`otherConditions_hasOther_${index + 1}`]:
              member.medicalQuestions?.otherConditions?.hasOther || false,
            [`otherConditions_conditions_${index + 1}`]:
              member.medicalQuestions?.otherConditions?.conditions || '',
            [`otherConditions_onsetDate_${index + 1}`]:
              member.medicalQuestions?.otherConditions?.onsetDate || '',

            [`substanceUse_usesSubstance_${index + 1}`]:
              member.medicalQuestions?.substanceUse?.usesSubstance || false,
            [`substanceUse_details_${index + 1}`]:
              member.medicalQuestions?.substanceUse?.details || '',
            [`substanceUse_onsetDate_${index + 1}`]:
              member.medicalQuestions?.substanceUse?.onsetDate || '',

            [`mentalDisorders_hasMental_${index + 1}`]:
              member.medicalQuestions?.mentalDisorders?.hasMental || false,
            [`mentalDisorders_details_${index + 1}`]:
              member.medicalQuestions?.mentalDisorders?.details || '',
            [`mentalDisorders_onsetDate_${index + 1}`]:
              member.medicalQuestions?.mentalDisorders?.onsetDate || '',

            [`pregnancy_isPregnant_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.isPregnant || false,
            [`pregnancy_lastMenstrualDate_${index + 1}`]: formatDate(
              member.medicalQuestions?.pregnancy?.lastMenstrualDate,
            ),
            [`pregnancy_trimester_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.trimester || '',
            [`pregnancy_fertilityTreatment_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.fertilityTreatment || '',
            [`pregnancy_complications_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.complications || '',
            [`pregnancy_multiplePregnancy_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.multiplePregnancy || '',

            // Medical Conditions
            ...member.conditions
              ?.map((condition, condIndex) => ({
                [`condition_diagnosis_${index + 1}_${condIndex + 1}`]:
                  condition.diagnosis || '',
                [`condition_lastTreatmentDate_${index + 1}_${condIndex + 1}`]:
                  formatDate(condition.lastTreatmentDate),
                [`condition_diagnosisStatus_${index + 1}_${condIndex + 1}`]:
                  condition.diagnosisStatus || '',
                [`condition_treatmentType_${index + 1}_${condIndex + 1}`]:
                  condition.treatmentType || '',
                [`condition_illnessType_${index + 1}_${condIndex + 1}`]:
                  condition.illnessType || '',
                [`condition_boneFractures_${index + 1}_${condIndex + 1}`]:
                  condition.boneFractures || '',
                [`condition_materialRemoved_${index + 1}_${condIndex + 1}`]:
                  condition.materialRemoved || '',
                [`condition_insulinDependent_${index + 1}_${condIndex + 1}`]:
                  condition.insulinDependent || '',
                [`condition_systolicReading_${index + 1}_${condIndex + 1}`]:
                  condition.systolicReading || '',
                [`condition_medicationDetails_${index + 1}_${condIndex + 1}`]:
                  condition.medicationDetails || '',
              }))
              .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          }))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {}),

        // Privacy Consent
        privacyConsent: value.privacyConsent || false,
      };

      setFormData({ companyName: 'fidelity', formData });
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData, formatDate]);

  const validateForm = data => {
    const errors = {};

    // Email validation
    if (
      data.members?.[0]?.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.members[0].email)
    ) {
      if (!errors.members) errors.members = [];
      errors.members[0] = { email: { message: 'Invalid email format' } };
    }

    // Mobile number validation
    if (data.members?.[0]?.mobileNumber) {
      const mobile = data.members[0].mobileNumber;
      if (mobile.length !== 9) {
        if (!errors.members) errors.members = [];
        errors.members[0] = {
          mobileNumber: { message: 'Mobile number must be 9 digits' },
        };
      } else if (!mobile.startsWith('5')) {
        if (!errors.members) errors.members = [];
        errors.members[0] = {
          mobileNumber: { message: 'Mobile number should start with 5' },
        };
      }
    }

    // Privacy consent validation
    if (!data.privacyConsent) {
      errors.privacyConsent = {
        message: 'You must agree to the privacy policy',
      };
    }

    // Required fields validation
    if (!data.members?.[0]?.fullName) {
      if (!errors.members) errors.members = [];
      errors.members[0] = { fullName: { message: 'Full name is required' } };
    }

    return errors;
  };

  const onSubmit = async data => {
    const formErrors = validateForm(data);

    if (Object.keys(formErrors).length > 0) {
      // Set errors in form state
      Object.keys(formErrors).forEach(field => {
        setError(field, formErrors[field]);
      });
      return;
    }

    // Clear any existing errors
    clearErrors();

    setIsLoading(true);
    try {
      const formData = {
        // Members data
        ...data.members
          ?.map((member, index) => ({
            [`member_fullName_${index + 1}`]: member.fullName || '',
            [`member_nationality_${index + 1}`]: member.nationality || '',
            [`member_dateOfBirth_${index + 1}`]: formatDate(member.dateOfBirth),
            [`member_gender_${index + 1}`]: member.gender || '',
            [`member_maritalStatus_${index + 1}`]: member.maritalStatus || '',
            [`member_weight_${index + 1}`]: member.weight || '',
            [`member_height_${index + 1}`]: member.height || '',
            [`member_principalName_${index + 1}`]: member.principalName || '',
            [`member_relation_${index + 1}`]: member.relation || '',
            [`member_email_${index + 1}`]: member.email || '',
            [`member_mobileNumber_${index + 1}`]: member.mobileNumber || '',

            // Medical Questions
            [`medications_isTaking_${index + 1}`]:
              member.medicalQuestions?.medications?.isTaking || false,
            [`medications_bloodPressure_${index + 1}`]:
              member.medicalQuestions?.medications?.bloodPressure || '',
            [`medications_cholesterol_${index + 1}`]:
              member.medicalQuestions?.medications?.cholesterol || '',
            [`medications_insulin_${index + 1}`]:
              member.medicalQuestions?.medications?.insulin || '',
            [`medications_otherMedications_${index + 1}`]:
              member.medicalQuestions?.medications?.otherMedications || '',
            [`medications_onsetDate_${index + 1}`]:
              member.medicalQuestions?.medications?.onsetDate || '',

            [`treatments_underObservation_${index + 1}`]:
              member.medicalQuestions?.treatments?.underObservation || false,
            [`treatments_conditions_${index + 1}`]:
              member.medicalQuestions?.treatments?.conditions || '',
            [`treatments_onsetDate_${index + 1}`]:
              member.medicalQuestions?.treatments?.onsetDate || '',

            [`chronicIllness_hasChronic_${index + 1}`]:
              member.medicalQuestions?.chronicIllness?.hasChronic || false,
            [`chronicIllness_conditions_${index + 1}`]:
              member.medicalQuestions?.chronicIllness?.conditions || '',
            [`chronicIllness_onsetDate_${index + 1}`]:
              member.medicalQuestions?.chronicIllness?.onsetDate || '',

            [`cancer_hasCancer_${index + 1}`]:
              member.medicalQuestions?.cancer?.hasCancer || false,
            [`cancer_conditions_${index + 1}`]:
              member.medicalQuestions?.cancer?.conditions || '',
            [`cancer_onsetDate_${index + 1}`]:
              member.medicalQuestions?.cancer?.onsetDate || '',

            [`otherConditions_hasOther_${index + 1}`]:
              member.medicalQuestions?.otherConditions?.hasOther || false,
            [`otherConditions_conditions_${index + 1}`]:
              member.medicalQuestions?.otherConditions?.conditions || '',
            [`otherConditions_onsetDate_${index + 1}`]:
              member.medicalQuestions?.otherConditions?.onsetDate || '',

            [`substanceUse_usesSubstance_${index + 1}`]:
              member.medicalQuestions?.substanceUse?.usesSubstance || false,
            [`substanceUse_details_${index + 1}`]:
              member.medicalQuestions?.substanceUse?.details || '',
            [`substanceUse_onsetDate_${index + 1}`]:
              member.medicalQuestions?.substanceUse?.onsetDate || '',

            [`mentalDisorders_hasMental_${index + 1}`]:
              member.medicalQuestions?.mentalDisorders?.hasMental || false,
            [`mentalDisorders_details_${index + 1}`]:
              member.medicalQuestions?.mentalDisorders?.details || '',
            [`mentalDisorders_onsetDate_${index + 1}`]:
              member.medicalQuestions?.mentalDisorders?.onsetDate || '',

            [`pregnancy_isPregnant_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.isPregnant || false,
            [`pregnancy_lastMenstrualDate_${index + 1}`]: formatDate(
              member.medicalQuestions?.pregnancy?.lastMenstrualDate,
            ),
            [`pregnancy_trimester_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.trimester || '',
            [`pregnancy_fertilityTreatment_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.fertilityTreatment || '',
            [`pregnancy_complications_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.complications || '',
            [`pregnancy_multiplePregnancy_${index + 1}`]:
              member.medicalQuestions?.pregnancy?.multiplePregnancy || '',

            // Medical Conditions
            ...member.conditions
              ?.map((condition, condIndex) => ({
                [`condition_diagnosis_${index + 1}_${condIndex + 1}`]:
                  condition.diagnosis || '',
                [`condition_lastTreatmentDate_${index + 1}_${condIndex + 1}`]:
                  formatDate(condition.lastTreatmentDate),
                [`condition_diagnosisStatus_${index + 1}_${condIndex + 1}`]:
                  condition.diagnosisStatus || '',
                [`condition_treatmentType_${index + 1}_${condIndex + 1}`]:
                  condition.treatmentType || '',
                [`condition_illnessType_${index + 1}_${condIndex + 1}`]:
                  condition.illnessType || '',
                [`condition_boneFractures_${index + 1}_${condIndex + 1}`]:
                  condition.boneFractures || '',
                [`condition_materialRemoved_${index + 1}_${condIndex + 1}`]:
                  condition.materialRemoved || '',
                [`condition_insulinDependent_${index + 1}_${condIndex + 1}`]:
                  condition.insulinDependent || '',
                [`condition_systolicReading_${index + 1}_${condIndex + 1}`]:
                  condition.systolicReading || '',
                [`condition_medicationDetails_${index + 1}_${condIndex + 1}`]:
                  condition.medicationDetails || '',
              }))
              .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          }))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {}),

        // Privacy Consent
        privacyConsent: data.privacyConsent || false,
      };

      const payload = { companyName: 'fidelity', formData };
      await onSave(payload);
    } catch (error) {
      console.error(error.message || 'Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFamilyMember = indexToRemove => {
    const values = getValues();
    const updatedMembers = values.members.filter(
      (_, index) => index !== indexToRemove,
    );
    setValue('members', updatedMembers);
    setFamilyCount(prev => prev - 1);
  };

  const addFamilyMember = () => {
    if (familyCount < 6) {
      setValue('members', [
        ...getValues().members,
        {
          fullName: '',
          nationality: '',
          dateOfBirth: null,
          gender: '',
          maritalStatus: '',
          weight: '',
          height: '',
          principalName: '',
          relation: '',
          email: '',
          mobileNumber: '',
          medicalQuestions: {
            medications: {
              isTaking: false,
              bloodPressure: '',
              cholesterol: '',
              insulin: '',
              otherMedications: '',
              onsetDate: '',
            },
            treatments: {
              underObservation: false,
              conditions: '',
              onsetDate: '',
            },
            chronicIllness: {
              hasChronic: false,
              conditions: '',
              onsetDate: '',
            },
            cancer: { hasCancer: false, conditions: '', onsetDate: '' },
            otherConditions: { hasOther: false, conditions: '', onsetDate: '' },
            substanceUse: { usesSubstance: false, details: '', onsetDate: '' },
            mentalDisorders: { hasMental: false, details: '', onsetDate: '' },
            pregnancy: {
              isPregnant: false,
              lastMenstrualDate: null,
              trimester: '',
              fertilityTreatment: '',
              complications: '',
              multiplePregnancy: '',
            },
          },
          conditions: [],
        },
      ]);
      setFamilyCount(prev => prev + 1);
    }
  };

  const removeMedicalCondition = (memberIndex, conditionIndex) => {
    const values = getValues();
    const updatedConditions = values.members[memberIndex].conditions.filter(
      (_, index) => index !== conditionIndex,
    );
    const updatedMembers = [...values.members];
    updatedMembers[memberIndex].conditions = updatedConditions;
    setValue('members', updatedMembers);
    setMedicalConditionsCount(prev => prev - 1);
  };

  const addMedicalCondition = memberIndex => {
    const values = getValues();
    const updatedMembers = [...values.members];
    updatedMembers[memberIndex].conditions = [
      ...updatedMembers[memberIndex].conditions,
      {
        diagnosis: '',
        lastTreatmentDate: null,
        diagnosisStatus: '',
        treatmentType: '',
        illnessType: '',
        boneFractures: '',
        materialRemoved: '',
        insulinDependent: '',
        systolicReading: '',
        medicationDetails: '',
      },
    ];
    setValue('members', updatedMembers);
    setMedicalConditionsCount(prev => prev + 1);
  };

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
  ];

  const relationOptions = [
    { label: 'Self', value: 'Self' },
    { label: 'Spouse', value: 'Spouse' },
    { label: 'Child', value: 'Child' },
    { label: 'Parent', value: 'Parent' },
  ];

  const trimesterOptions = [
    { label: 'First', value: 'First' },
    { label: 'Second', value: 'Second' },
    { label: 'Third', value: 'Third' },
  ];

  const diagnosisStatusOptions = [
    { label: 'Cured', value: 'Cured' },
    { label: 'Ongoing Symptoms', value: 'Ongoing Symptoms' },
    { label: 'Ongoing Hospitalization', value: 'Ongoing Hospitalization' },
    { label: 'Pending Hospitalization', value: 'Pending Hospitalization' },
    { label: 'Ongoing Treatment', value: 'Ongoing Treatment' },
    { label: 'Pending Treatment', value: 'Pending Treatment' },
  ];

  const treatmentTypeOptions = [
    { label: 'Outpatient', value: 'Outpatient' },
    { label: 'Hospitalized', value: 'Hospitalized' },
    { label: 'Both', value: 'Both' },
  ];

  const illnessTypeOptions = [
    { label: 'Acute', value: 'Acute' },
    { label: 'Chronic', value: 'Chronic' },
    { label: 'Recurrent', value: 'Recurrent' },
  ];

  if (isLoading || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{policyData?.company?.companyName}</Text>

      {/* Family Members Section */}
      {getValues().members.map((member, memberIndex) => (
        <View key={memberIndex} style={styles.familyMemberContainer}>
          {memberIndex > 0 && (
            <View style={styles.familyMemberHeader}>
              <Text style={styles.familyMemberTitle}>
                Member {memberIndex + 1} Details
              </Text>
              <CustomButton
                title="Delete"
                onPress={() => removeFamilyMember(memberIndex)}
                buttonStyle={styles.deleteButton}
                textStyle={styles.deleteButtonText}
              />
            </View>
          )}

          <Text style={styles.sectionTitle}>
            Member {memberIndex + 1} Personal Details
          </Text>

          <Controller
            control={control}
            name={`members[${memberIndex}].fullName`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                error={errors.members?.[memberIndex]?.fullName?.message}
                showErrorMessage
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].nationality`}
            render={({ field: { onChange, value } }) => (
              <CustomDropDownList
                title="Select Nationality"
                data={nationalities}
                value={value}
                handleSelect={onChange}
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].dateOfBirth`}
            render={({ field: { value } }) => (
              <View style={styles.inputSpacing}>
                <Text style={styles.label}>Date of Birth</Text>
                <CustomButton
                  title={value ? formatDate(value) : 'Select Date'}
                  onPress={() =>
                    openDatePicker(`members[${memberIndex}].dateOfBirth`)
                  }
                  buttonStyle={styles.dateButton}
                  textStyle={styles.dateButtonText}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].gender`}
            render={({ field: { onChange, value } }) => (
              <CustomDropDownList
                title="Select Gender"
                data={genderOptions}
                value={value}
                handleSelect={onChange}
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].maritalStatus`}
            render={({ field: { onChange, value } }) => (
              <CustomDropDownList
                title="Select Marital Status"
                data={maritalStatusOptions}
                value={value}
                handleSelect={onChange}
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].weight`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Weight (kg)"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].height`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Height (cm)"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].principalName`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Principal Name"
                value={value}
                onChangeText={onChange}
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].relation`}
            render={({ field: { onChange, value } }) => (
              <CustomDropDownList
                title="Select Relation"
                data={relationOptions}
                value={value}
                handleSelect={onChange}
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].email`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Email Address"
                value={value}
                onChangeText={onChange}
                error={errors.members?.[memberIndex]?.email?.message}
                showErrorMessage
                autoCapitalize="none"
                style={styles.inputSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name={`members[${memberIndex}].mobileNumber`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Mobile Number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                style={styles.inputSpacing}
              />
            )}
          />

          {/* Medical Questions Section */}
          <Text style={styles.sectionTitle}>
            Member {memberIndex + 1} Medical Questions
          </Text>

          {/* Medications */}
          <Controller
            control={control}
            name={`members[${memberIndex}].medicalQuestions.medications.isTaking`}
            render={({ field: { onChange, value } }) => (
              <CustomCheckBox
                label="Are you taking any prescribed medicine on a regular basis?"
                value={value}
                onChange={onChange}
              />
            )}
          />

          {watch(
            `members[${memberIndex}].medicalQuestions.medications.isTaking`,
          ) && (
            <>
              <Controller
                control={control}
                name={`members[${memberIndex}].medicalQuestions.medications.bloodPressure`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Blood Pressure Medication Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].medicalQuestions.medications.cholesterol`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Cholesterol Medication Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].medicalQuestions.medications.insulin`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Insulin Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].medicalQuestions.medications.otherMedications`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Other Medications Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].medicalQuestions.medications.onsetDate`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Date of Onset"
                    value={value}
                    onChangeText={onChange}
                    style={styles.inputSpacing}
                  />
                )}
              />
            </>
          )}

          {/* Pregnancy Section (for married females only) */}
          {watch(`members[${memberIndex}].gender`) === 'Female' &&
            watch(`members[${memberIndex}].maritalStatus`) === 'Married' && (
              <>
                <Controller
                  control={control}
                  name={`members[${memberIndex}].medicalQuestions.pregnancy.isPregnant`}
                  render={({ field: { onChange, value } }) => (
                    <CustomCheckBox
                      label="Are you currently pregnant or trying to get pregnant?"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />

                {watch(
                  `members[${memberIndex}].medicalQuestions.pregnancy.isPregnant`,
                ) && (
                  <>
                    <Controller
                      control={control}
                      name={`members[${memberIndex}].medicalQuestions.pregnancy.lastMenstrualDate`}
                      render={({ field: { value } }) => (
                        <View style={styles.inputSpacing}>
                          <Text style={styles.label}>Last Menstrual Date</Text>
                          <CustomButton
                            title={value ? formatDate(value) : 'Select Date'}
                            onPress={() =>
                              openDatePicker(
                                `members[${memberIndex}].medicalQuestions.pregnancy.lastMenstrualDate`,
                              )
                            }
                            buttonStyle={styles.dateButton}
                            textStyle={styles.dateButtonText}
                          />
                        </View>
                      )}
                    />

                    <Controller
                      control={control}
                      name={`members[${memberIndex}].medicalQuestions.pregnancy.trimester`}
                      render={({ field: { onChange, value } }) => (
                        <CustomDropDownList
                          title="Select Trimester"
                          data={trimesterOptions}
                          value={value}
                          handleSelect={onChange}
                          style={styles.inputSpacing}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`members[${memberIndex}].medicalQuestions.pregnancy.fertilityTreatment`}
                      render={({ field: { onChange, value } }) => (
                        <FloatingLabelInput
                          label="Fertility Treatment Details"
                          value={value}
                          onChangeText={onChange}
                          multiline
                          numberOfLines={2}
                          style={styles.inputSpacing}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`members[${memberIndex}].medicalQuestions.pregnancy.complications`}
                      render={({ field: { onChange, value } }) => (
                        <FloatingLabelInput
                          label="Pregnancy Complications"
                          value={value}
                          onChangeText={onChange}
                          multiline
                          numberOfLines={2}
                          style={styles.inputSpacing}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`members[${memberIndex}].medicalQuestions.pregnancy.multiplePregnancy`}
                      render={({ field: { onChange, value } }) => (
                        <FloatingLabelInput
                          label="Multiple Pregnancy Details"
                          value={value}
                          onChangeText={onChange}
                          multiline
                          numberOfLines={2}
                          style={styles.inputSpacing}
                        />
                      )}
                    />
                  </>
                )}
              </>
            )}

          {/* Medical Conditions */}
          <Text style={styles.sectionTitle}>
            Member {memberIndex + 1} Medical Conditions
          </Text>

          {member.conditions.map((condition, conditionIndex) => (
            <View key={conditionIndex} style={styles.medicalConditionContainer}>
              <View style={styles.medicalConditionHeader}>
                <Text style={styles.medicalConditionTitle}>
                  Condition {conditionIndex + 1}
                </Text>
                <CustomButton
                  title="Delete"
                  onPress={() =>
                    removeMedicalCondition(memberIndex, conditionIndex)
                  }
                  buttonStyle={styles.deleteButton}
                  textStyle={styles.deleteButtonText}
                />
              </View>

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].diagnosis`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Diagnosis"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].lastTreatmentDate`}
                render={({ field: { value } }) => (
                  <View style={styles.inputSpacing}>
                    <Text style={styles.label}>Last Treatment Date</Text>
                    <CustomButton
                      title={value ? formatDate(value) : 'Select Date'}
                      onPress={() =>
                        openDatePicker(
                          `members[${memberIndex}].conditions[${conditionIndex}].lastTreatmentDate`,
                        )
                      }
                      buttonStyle={styles.dateButton}
                      textStyle={styles.dateButtonText}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].diagnosisStatus`}
                render={({ field: { onChange, value } }) => (
                  <CustomDropDownList
                    title="Select Diagnosis Status"
                    data={diagnosisStatusOptions}
                    value={value}
                    handleSelect={onChange}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].treatmentType`}
                render={({ field: { onChange, value } }) => (
                  <CustomDropDownList
                    title="Select Treatment Type"
                    data={treatmentTypeOptions}
                    value={value}
                    handleSelect={onChange}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].illnessType`}
                render={({ field: { onChange, value } }) => (
                  <CustomDropDownList
                    title="Select Illness Type"
                    data={illnessTypeOptions}
                    value={value}
                    handleSelect={onChange}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].boneFractures`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Bone Fractures Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].materialRemoved`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Material Removed Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].insulinDependent`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Insulin Dependent Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].systolicReading`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Systolic Reading"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    style={styles.inputSpacing}
                  />
                )}
              />

              <Controller
                control={control}
                name={`members[${memberIndex}].conditions[${conditionIndex}].medicationDetails`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Medication Details"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={3}
                    style={styles.inputSpacing}
                  />
                )}
              />
            </View>
          ))}

          <CustomButton
            title="Add Medical Condition"
            onPress={() => addMedicalCondition(memberIndex)}
            buttonStyle={styles.addButton}
          />
        </View>
      ))}

      <CustomButton
        title="Add Member"
        onPress={addFamilyMember}
        disabled={familyCount >= 6}
        buttonStyle={styles.addButton}
      />

      {/* Privacy Policy */}
      <Text style={styles.sectionTitle}>Privacy Policy & Declaration</Text>

      <View style={styles.declarationContainer}>
        <Text style={styles.declarationText}>
          I hereby undertake that all above information is correct and complete.
          I consent to United Fidelity Insurance Company contacting any
          physician, medical facility, or other institution for health records.
          I confirm that non-disclosure of pre-existing conditions may lead to
          rejection of coverage/claims. I agree to the use, disclosure, and
          processing of my personal and medical information for policy purposes,
          including transfer to third parties within or outside the UAE.
        </Text>

        <Controller
          control={control}
          name="privacyConsent"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="I agree to the privacy policy and declaration terms."
              value={value}
              onChange={onChange}
            />
          )}
        />

        {errors.privacyConsent && (
          <Text style={styles.errorText}>{errors.privacyConsent.message}</Text>
        )}
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(null)}
        onConfirm={date => handleDateSelect(activeDateField, date)}
        initialDate={getValues()[activeDateField] || new Date()}
        maxDate={new Date()}
      />

      {/* Submit Button */}
      <CustomButton
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        disabled={!privacyConsent}
        isLoading={isLoading}
        buttonStyle={styles.submitButton}
      />
    </ScrollView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      zIndex: 100,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(10),
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.primary,
      marginTop: 24,
      marginBottom: 16,
    },
    inputSpacing: {
      marginBottom: verticalScale(16),
    },
    label: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    errorText: {
      color: theme.colors.red,
      fontSize: 12,
      marginTop: 4,
    },
    familyMemberContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.floorBgColor,
    },
    familyMemberHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    familyMemberTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    medicalConditionContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.floorBgColor,
    },
    medicalConditionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    medicalConditionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    deleteButton: {
      backgroundColor: theme.colors.red,
      paddingHorizontal: 12,
      paddingVertical: 6,
      width: 'auto',
    },
    deleteButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    addButton: {
      marginVertical: 16,
    },
    dateButton: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dateButtonText: {
      color: theme.colors.text,
      fontWeight: '400',
    },
    declarationContainer: {
      backgroundColor: theme.colors.floorBgColor,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    declarationText: {
      fontSize: 13,
      color: theme.colors.text,
      lineHeight: 20,
      textAlign: 'justify',
      marginBottom: 16,
    },
    submitButton: {
      marginTop: 8,
      marginBottom: 24,
    },
  });

export default FidelityForm;
