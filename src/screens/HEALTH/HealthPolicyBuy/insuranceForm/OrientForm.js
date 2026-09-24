import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
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
import Icon from 'react-native-vector-icons/MaterialIcons';

import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import Calender from '@assets/icons/Calender';
import moment from 'moment';

const OrientForm = ({
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
          name: '',
          relation: '',
          dateOfBirth: null,
          gender: '',
          maritalStatus: '',
          height: '',
          weight: '',
          visa: '',
        },
      ],
      email: '',
      mobileNo: '',
      medicalDetails: {
        p1: { yes: false, comment: '' },
        p2: { yes: false, comment: '' },
        p3: { yes: false, comment: '' },
        p4: { yes: false, comment: '' },
        p5: { yes: false, comment: '' },
        p6: { yes: false, comment: '' },
        p7: { yes: false, comment: '' },
        p8: { yes: false, comment: '' },
        p9: { yes: false, comment: '' },
        p10: { yes: false, comment: '' },
        p11: { yes: false, comment: '' },
        p12: { yes: false, comment: '' },
      },
      medicalDetails_T2: {
        p1: { yes: false, comment: '' },
        p2: { yes: false, comment: '' },
        p3: { yes: false, comment: '' },
        p4: { yes: false, comment: '' },
        p5: { yes: false, comment: '' },
        p6: { yes: false, comment: '' },
        p7: { yes: false, comment: '' },
      },
      pregnancy: {
        femaleName: '',
        menstrualPeriod: null,
        isPregnant: false,
      },
      brandName: {
        yes: false,
        details: '',
      },
      bloodPressure: {
        systolic: '',
        diastolic: '',
      },
      declarationConsent: false,
    },
  });

  const declarationConsent = watch('declarationConsent', false);
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
      setValue('members[0].name', healthInfo.fullName || '');
      setValue('members[0].relation', healthInfo.relation || '');
      setValue(
        'members[0].dateOfBirth',
        healthInfo.dateOfBirth ? dayjs(healthInfo.dateOfBirth) : null,
      );
      setValue('members[0].gender', healthInfo.gender || '');
      setValue('members[0].maritalStatus', healthInfo.maritalStatus || '');
      setValue('members[0].height', healthInfo.height || '');
      setValue('members[0].weight', healthInfo.weight || '');
      setValue('members[0].visa', healthInfo.emirates || '');
      setValue('email', healthInfo.email || '');
      setValue('mobileNo', healthInfo.mobileNumber || '');
    }
  }, [policyData, setValue]);

  useEffect(() => {
    const subscription = watch(value => {
      const formData = {
        // Contact Information
        email: value.email || '',
        mobileNo: value.mobileNo || '',

        // Family Member Details
        ...Array.from({ length: 6 }, (_, index) => ({
          [`detailsFamilyName_R${index + 1}`]:
            value.members?.[index]?.name || '',
          [`detailsFamilyRelation_R${index + 1}`]:
            value.members?.[index]?.relation || '',
          [`detailsFamilyDOB_R${index + 1}`]: value.members?.[index]
            ?.dateOfBirth
            ? formatDate(value.members[index].dateOfBirth)
            : '',
          [`detailsFamilySex_R${index + 1}`]:
            value.members?.[index]?.gender || '',
          [`detailsFamilyMarital_R${index + 1}`]:
            value.members?.[index]?.maritalStatus || '',
          [`detailsFamilyHeight_R${index + 1}`]:
            value.members?.[index]?.height || '',
          [`detailsFamilyWeight_R${index + 1}`]:
            value.members?.[index]?.weight || '',
          [`detailsFamilyVissa_R${index + 1}`]:
            value.members?.[index]?.visa || '',
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),

        // Medical Details (Table 1)
        ...Object.keys(value.medicalDetails || {}).reduce(
          (acc, key) => ({
            ...acc,
            [`medicalDetails_yes_${key}`]:
              value.medicalDetails[key].yes || false,
            [`medicalDetails_no_${key}`]:
              !value.medicalDetails[key].yes || false,
            [`medicalDetails_${key}`]: value.medicalDetails[key].comment || '',
          }),
          {},
        ),

        // Medical Details (Table 2)
        ...Object.keys(value.medicalDetails_T2 || {}).reduce(
          (acc, key) => ({
            ...acc,
            [`medicalDetails_yes_T2_${key}`]:
              value.medicalDetails_T2[key].yes || false,
            [`medicalDetails_no_T2_${key}`]:
              !value.medicalDetails_T2[key].yes || false,
            [`medicalDetails_T2_${key}`]:
              value.medicalDetails_T2[key].comment || '',
          }),
          {},
        ),

        // Pregnancy Details
        femaleName: value.pregnancy?.femaleName || '',
        menstrualPeriod: formatDate(value.pregnancy?.menstrualPeriod),

        // Brand Name
        brandName_yes: value.brandName?.yes || false,
        brandName_no: !value.brandName?.yes || false,
        brandNameDetails: value.brandName?.details || '',

        // Blood Pressure
        systolic: value.bloodPressure?.systolic || '',
        diastolic: value.bloodPressure?.diastolic || '',

        // Declaration
        declarationConsent: value.declarationConsent || false,
      };

      setFormData({ companyName: 'orient', formData });
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData, formatDate]);

  const validateForm = data => {
    const errors = {};

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = { message: 'Invalid email format' };
    }

    // Declaration consent validation
    if (!data.declarationConsent) {
      errors.declarationConsent = {
        message: 'You must agree to the declaration',
      };
    }

    // Required fields validation
    if (!data.members?.[0]?.name) {
      if (!errors.members) errors.members = [];
      errors.members[0] = { name: { message: 'Principal name is required' } };
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
        // Contact Information
        email: data.email || '',
        mobileNo: data.mobileNo || '',

        // Family Member Details
        ...Array.from({ length: 6 }, (_, index) => ({
          [`detailsFamilyName_R${index + 1}`]:
            data.members?.[index]?.name || '',
          [`detailsFamilyRelation_R${index + 1}`]:
            data.members?.[index]?.relation || '',
          [`detailsFamilyDOB_R${index + 1}`]: formatDate(
            data.members?.[index]?.dateOfBirth,
          ),
          [`detailsFamilySex_R${index + 1}`]:
            data.members?.[index]?.gender || '',
          [`detailsFamilyMarital_R${index + 1}`]:
            data.members?.[index]?.maritalStatus || '',
          [`detailsFamilyHeight_R${index + 1}`]:
            data.members?.[index]?.height || '',
          [`detailsFamilyWeight_R${index + 1}`]:
            data.members?.[index]?.weight || '',
          [`detailsFamilyVissa_R${index + 1}`]:
            data.members?.[index]?.visa || '',
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),

        // Medical Details (Table 1)
        ...Object.keys(data.medicalDetails || {}).reduce(
          (acc, key) => ({
            ...acc,
            [`medicalDetails_yes_${key}`]:
              data.medicalDetails[key].yes || false,
            [`medicalDetails_no_${key}`]:
              !data.medicalDetails[key].yes || false,
            [`medicalDetails_${key}`]: data.medicalDetails[key].comment || '',
          }),
          {},
        ),

        // Medical Details (Table 2)
        ...Object.keys(data.medicalDetails_T2 || {}).reduce(
          (acc, key) => ({
            ...acc,
            [`medicalDetails_yes_T2_${key}`]:
              data.medicalDetails_T2[key].yes || false,
            [`medicalDetails_no_T2_${key}`]:
              !data.medicalDetails_T2[key].yes || false,
            [`medicalDetails_T2_${key}`]:
              data.medicalDetails_T2[key].comment || '',
          }),
          {},
        ),

        // Pregnancy Details
        femaleName: data.pregnancy?.femaleName || '',
        menstrualPeriod: formatDate(data.pregnancy?.menstrualPeriod),

        // Brand Name
        brandName_yes: data.brandName?.yes || false,
        brandName_no: !data.brandName?.yes || false,
        brandNameDetails: data.brandName?.details || '',

        // Blood Pressure
        systolic: data.bloodPressure?.systolic || '',
        diastolic: data.bloodPressure?.diastolic || '',

        // Declaration
        declarationConsent: data.declarationConsent || false,
      };

      const payload = { companyName: 'orient', formData };
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
          name: '',
          relation: '',
          dateOfBirth: null,
          gender: '',
          maritalStatus: '',
          height: '',
          weight: '',
          visa: '',
        },
      ]);
      setFamilyCount(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{policyData?.company?.companyName}</Text>

      {/* Contact Information */}
      <Text style={styles.sectionTitle}>Contact Information</Text>

      <View
        style={{
          gap: verticalScale(15),
        }}
      >
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              showErrorMessage
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="mobileNo"
          render={({ field: { onChange, value } }) => (
            <CountryPhoneInput
              onChange={onChange}
              value={value}
              errors={errors.mobileNumber?.message}
            />
          )}
        />
      </View>

      {/* Family Members Section */}
      <Text style={styles.sectionTitle}>Family Members</Text>

      <View style={{ gap: verticalScale(15) }}>
        {getValues().members.map((member, index) => (
          <View key={index} style={styles.familyMemberContainer}>
            <View style={styles.familyMemberHeader}>
              <Text style={styles.familyMemberTitle}>
                Member {index + 1} Details
              </Text>
              <Icon
                name="delete"
                size={20}
                color={theme.colors.red}
                onPress={() => removeFamilyMember(index)}
              />
            </View>

            <Controller
              control={control}
              name={`members[${index}].name`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.members?.[index]?.name?.message}
                  showErrorMessage
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].relation`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  title="Select Relation"
                  data={HEALTH_CONSTANTS.RELATIONS_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                  showSearch={false}
                  absolute
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].dateOfBirth`}
              render={({ field: { value }, fieldState }) => (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      fieldState.error && styles.errorBorder,
                    ]}
                    onPress={() =>
                      openDatePicker(`members[${index}].dateOfBirth`)
                    }
                  >
                    <Text
                      style={[
                        styles.datePickerLabel,
                        {
                          color: fieldState.error
                            ? theme.colors.red
                            : value
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
                        !value && styles.placeholderText,
                      ]}
                    >
                      {value
                        ? moment(value).format('DD-MM-YYYY')
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
              name={`members[${index}].gender`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  title="Select Gender"
                  data={HEALTH_CONSTANTS.GENDER_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                  showSearch={false}
                  absolute
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].maritalStatus`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  title="Select Marital Status"
                  data={HEALTH_CONSTANTS.MARITAL_STATUS_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                  showSearch={false}
                  absolute
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].height`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Height (cm)"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].weight`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Weight (kg)"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].visa`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  title="Select Emirates/Visa"
                  data={HEALTH_CONSTANTS.EMIRATES_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                  showSearch={false}
                  absolute
                />
              )}
            />
          </View>
        ))}

        <CustomButton
          title="Add Member"
          onPress={addFamilyMember}
          disabled={familyCount >= 7}
          buttonStyle={{
            height: verticalScale(40),
            width: '40%',
          }}
          textStyle={{
            fontSize: verticalScale(14),
            color: theme.colors.backgroundColor,
            fontFamily: 'Lato-Bold',
          }}
          icon={
            <Icon name="add" size={20} color={theme.colors.backgroundColor} />
          }
        />
      </View>

      {/* Medical Details Table 1 */}
      <Text style={styles.sectionTitle}>Medical Details (Table 1)</Text>

      {HEALTH_CONSTANTS.MEDICAL_QUESTIONS_TABLE_1.map((question, index) => (
        <View key={index} style={{ gap: verticalScale(15) }}>
          <Controller
            control={control}
            name={`medicalDetails.p${index + 1}.yes`}
            render={({ field: { onChange, value } }) => (
              <CustomCheckBox
                label={question}
                value={value}
                onChange={onChange}
              />
            )}
          />

          {watch(`medicalDetails.p${index + 1}.yes`) && (
            <Controller
              control={control}
              name={`medicalDetails.p${index + 1}.comment`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label={`${question} Details`}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          )}
        </View>
      ))}

      {/* Medical Details Table 2 */}
      <Text style={styles.sectionTitle}>Medical Details (Table 2)</Text>

      {HEALTH_CONSTANTS.MEDICAL_QUESTIONS_TABLE_2.map((question, index) => (
        <View
          key={index}
          style={{
            gap: verticalScale(15),
          }}
        >
          <Controller
            control={control}
            name={`medicalDetails_T2.p${index + 1}.yes`}
            render={({ field: { onChange, value } }) => (
              <CustomCheckBox
                label={question}
                value={value}
                onChange={onChange}
              />
            )}
          />

          {watch(`medicalDetails_T2.p${index + 1}.yes`) && (
            <Controller
              control={control}
              name={`medicalDetails_T2.p${index + 1}.comment`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label={`${question} Details`}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          )}
        </View>
      ))}

      {/* Pregnancy Details */}
      <Text style={styles.sectionTitle}>
        Supplementary Pregnancy Questionnaire
      </Text>

      <View style={{ gap: verticalScale(15) }}>
        <Controller
          control={control}
          name="pregnancy.isPregnant"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Is any female member pregnant?"
              value={value}
              onChange={onChange}
            />
          )}
        />

        {watch('pregnancy.isPregnant') && (
          <>
            <Controller
              control={control}
              name="pregnancy.femaleName"
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Female Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="pregnancy.menstrualPeriod"
              render={({ field: { value }, fieldState }) => (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      fieldState.error && styles.errorBorder,
                    ]}
                    onPress={() => openDatePicker('pregnancy.menstrualPeriod')}
                  >
                    <Text style={styles.datePickerLabel}>
                      Last Menstrual Period
                    </Text>
                    <Text
                      style={[
                        styles.datePickerText,
                        !value && styles.placeholderText,
                      ]}
                    >
                      {value
                        ? moment(value).format('DD-MM-YYYY')
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
          </>
        )}
      </View>

      {/* Brand Name */}
      <Text style={styles.sectionTitle}>Brand Name Drugs</Text>

      <View style={{ gap: verticalScale(15) }}>
        <Controller
          control={control}
          name="brandName.yes"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Please specify the medication genuine names, the brand name as well as the daily/weekly"
              value={value}
              onChange={onChange}
            />
          )}
        />

        {watch('brandName.yes') && (
          <Controller
            control={control}
            name="brandName.details"
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="HbA1c"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        )}
      </View>

      {/* Blood Pressure */}
      <Text style={styles.sectionTitle}>
        In case you are suffering from hypertension, please specify your recent
        Systolic and Diastolic readings below
      </Text>

      <View style={{ gap: verticalScale(15) }}>
        <Controller
          control={control}
          name="bloodPressure.systolic"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Systolic"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="bloodPressure.diastolic"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Diastolic"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
      </View>

      {/* Declaration */}
      <Text style={styles.sectionTitle}>Declaration & Authorization</Text>

      <View
        style={{
          gap: verticalScale(15),
        }}
      >
        <Text style={styles.declarationText}>
          I declare that all information provided is true and complete. I
          understand that non-disclosure of pre-existing conditions may void the
          policy. I authorize Orient Insurance PJSC to review my medical
          records.
        </Text>

        <Controller
          control={control}
          name="declarationConsent"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="I agree to the declaration and authorization terms."
              value={value}
              onChange={onChange}
            />
          )}
        />

        {errors.declarationConsent && (
          <Text style={styles.errorText}>
            {errors.declarationConsent.message}
          </Text>
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
        disabled={!declarationConsent}
        isLoading={isLoading}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      gap: verticalScale(20),
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      fontSize: verticalScale(18),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
    sectionTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
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
    familyMemberContainer: {
      gap: verticalScale(15),
    },
    familyMemberHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    familyMemberTitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.primary,
    },
    medicalConditionContainer: {
      marginBottom: verticalScale(16),
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
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      lineHeight: 20,
      textAlign: 'justify',
      fontFamily: 'Lato-Regular',
    },
    submitButton: {
      marginTop: 8,
      marginBottom: 24,
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
    instructionText: {
      fontSize: verticalScale(14),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
    },
  });

export default OrientForm;
