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
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Calender from '@assets/icons/Calender';
import moment from 'moment';

const TakafulForm = ({
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
      companyName: 'Takaful Emarat',
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      country: '',
      mobileNumber: '',
      email: '',
      salaryBand4000: false,
      salaryBand4001: false,
      visaDubai: false,
      visaAbuDhabi: false,
      visaOther: false,
      isPolicyExistInUAE: false,
      isPolicyExistInUAE_no: false,
      policyDetails: '',
      currentInsurer: false,
      currentInsurer_no: false,
      currentInsurerDetails: '',
      currentInsurerExpiryDate: null,
      currentInsurerExpiryDetails: '',
      hazardousSportActivity_1: false,
      hazardousSportActivity_1_no: false,
      hazardousSportActivity_1_details: '',
      hazardousSportActivity_2: false,
      hazardousSportActivity_2_no: false,
      hazardousSportActivity_2_details: '',
      specificMedicalCondition_1: false,
      specificMedicalCondition_1_no: false,
      specificMedicalCondition_1_details: '',
      specificMedicalCondition_2: false,
      specificMedicalCondition_2_no: false,
      specificMedicalCondition_2_details: '',
      specificMedicalCondition_3: false,
      specificMedicalCondition_3_no: false,
      specificMedicalCondition_3_details: '',
      specificMedicalCondition_4: false,
      specificMedicalCondition_4_no: false,
      specificMedicalCondition_4_details: '',
      specificMedicalCondition_5: false,
      specificMedicalCondition_5_no: false,
      specificMedicalCondition_5_details: '',
      specificMedicalCondition_6: false,
      specificMedicalCondition_6_no: false,
      specificMedicalCondition_6_details: '',
      specificMedicalCondition_7: false,
      specificMedicalCondition_7_no: false,
      specificMedicalCondition_7_details: '',
      specificMedicalCondition_8: false,
      specificMedicalCondition_8_no: false,
      specificMedicalCondition_8_details: '',
      specificMedicalCondition_9: false,
      specificMedicalCondition_9_no: false,
      specificMedicalCondition_9_details: '',
      specificMedicalCondition_10: false,
      specificMedicalCondition_10_no: false,
      specificMedicalCondition_10_details: '',
      specificMedicalCondition_11: false,
      specificMedicalCondition_11_no: false,
      specificMedicalCondition_11_details: '',
      specificMedicalCondition_12: false,
      specificMedicalCondition_12_no: false,
      specificMedicalCondition_12_details: '',
      specificMedicalCondition_13: false,
      specificMedicalCondition_13_no: false,
      specificMedicalCondition_13_details: '',
      specificMedicalCondition_14: false,
      specificMedicalCondition_14_no: false,
      specificMedicalCondition_14_details: '',
      pregnancy_1: false,
      pregnancy_1_no: false,
      pregnancy_2: false,
      pregnancy_2_no: false,
      pregnancy_3: false,
      pregnancy_3_no: false,
      pregnancy_4: false,
      pregnancy_4_no: false,
      pregnancy_5: false,
      pregnancy_5_no: false,
      pregnancy_6: false,
      pregnancy_6_no: false,
      pregnancyDate: null,
      spouseDetails_fullName_0: '',
      spouseDetails_relation_0: '',
      spouseDetails_height_0: '',
      spouseDetails_weight_0: '',
      spouseDetails_dateOfBirth_0: null,
      spouseDetails_fullName_1: '',
      spouseDetails_relation_1: '',
      spouseDetails_height_1: '',
      spouseDetails_weight_1: '',
      spouseDetails_dateOfBirth_1: null,
      spouseDetails_fullName_2: '',
      spouseDetails_relation_2: '',
      spouseDetails_height_2: '',
      spouseDetails_weight_2: '',
      spouseDetails_dateOfBirth_2: null,
      spouseDetails_fullName_3: '',
      spouseDetails_relation_3: '',
      spouseDetails_height_3: '',
      spouseDetails_weight_3: '',
      spouseDetails_dateOfBirth_3: null,
      spouseDetails_fullName_4: '',
      spouseDetails_relation_4: '',
      spouseDetails_height_4: '',
      spouseDetails_weight_4: '',
      spouseDetails_dateOfBirth_4: null,
      spouseDetails_fullName_5: '',
      spouseDetails_relation_5: '',
      spouseDetails_height_5: '',
      spouseDetails_weight_5: '',
      spouseDetails_dateOfBirth_5: null,
      spouseDetails_fullName_6: '',
      spouseDetails_relation_6: '',
      spouseDetails_height_6: '',
      spouseDetails_weight_6: '',
      spouseDetails_dateOfBirth_6: null,
      diabetes: '',
      immunomodulator: '',
      declarationConsent: false,
    },
  });

  const declarationConsent = watch('declarationConsent', false);
  const gender = watch('gender');
  const maritalStatus = watch('maritalStatus');

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

  useEffect(() => {
    if (policyData?.healthInfo) {
      const healthInfo = policyData.healthInfo;
      setValue('companyName', 'Takaful Emarat');
      setValue('firstName', healthInfo.firstName || '');
      setValue('middleName', healthInfo.middleName || '');
      setValue('lastName', healthInfo.lastName || '');
      setValue('address', healthInfo.address || '');
      setValue('gender', healthInfo.gender || '');
      setValue('maritalStatus', healthInfo.maritalStatus || '');
      setValue('nationality', healthInfo.nationality || '');
      setValue('country', healthInfo.country || '');
      setValue('mobileNumber', healthInfo.mobileNumber || '');
      setValue('email', healthInfo.email || '');
      setValue('salaryBand4000', healthInfo.salaryBand4000 === '4000' || false);
      setValue('salaryBand4001', healthInfo.salaryBand4001 === '4001' || false);
      setValue('visaDubai', healthInfo.visaDubai === 'Yes' || false);
      setValue('visaAbuDhabi', healthInfo.visaAbuDhabi === 'Yes' || false);
      setValue('visaOther', healthInfo.visaOther === 'Yes' || false);
      setValue('isPolicyExistInUAE', healthInfo.isPolicyExistInUAE || false);
      setValue('isPolicyExistInUAE_no', false);
      setValue('policyDetails', healthInfo.policyDetails || '');
      setValue('currentInsurer', healthInfo.currentInsurer || false);
      setValue('currentInsurer_no', false);
      setValue('currentInsurerDetails', healthInfo.currentInsurerDetails || '');
      setValue(
        'currentInsurerExpiryDate',
        healthInfo.currentInsurerExpiryDate
          ? dayjs(healthInfo.currentInsurerExpiryDate)
          : null,
      );
      setValue('currentInsurerExpiryDetails', '');
      setValue(
        'hazardousSportActivity_1',
        healthInfo.hazardousSportActivity_1 || false,
      );
      setValue('hazardousSportActivity_1_no', false);
      setValue(
        'hazardousSportActivity_1_details',
        healthInfo.hazardousSportActivity_1_details || '',
      );
      setValue(
        'hazardousSportActivity_2',
        healthInfo.hazardousSportActivity_2 || false,
      );
      setValue('hazardousSportActivity_2_no', false);
      setValue(
        'hazardousSportActivity_2_details',
        healthInfo.hazardousSportActivity_2_details || '',
      );
      setValue(
        'specificMedicalCondition_1',
        healthInfo.specificMedicalCondition_1 || false,
      );
      setValue('specificMedicalCondition_1_no', false);
      setValue(
        'specificMedicalCondition_1_details',
        healthInfo.specificMedicalCondition_1_details || '',
      );
      setValue(
        'specificMedicalCondition_2',
        healthInfo.specificMedicalCondition_2 || false,
      );
      setValue('specificMedicalCondition_2_no', false);
      setValue(
        'specificMedicalCondition_2_details',
        healthInfo.specificMedicalCondition_2_details || '',
      );
      setValue(
        'specificMedicalCondition_3',
        healthInfo.specificMedicalCondition_3 || false,
      );
      setValue('specificMedicalCondition_3_no', false);
      setValue(
        'specificMedicalCondition_3_details',
        healthInfo.specificMedicalCondition_3_details || '',
      );
      setValue('specificMedicalCondition_4', false);
      setValue('specificMedicalCondition_4_no', false);
      setValue('specificMedicalCondition_4_details', '');
      setValue('specificMedicalCondition_5', false);
      setValue('specificMedicalCondition_5_no', false);
      setValue('specificMedicalCondition_5_details', '');
      setValue('specificMedicalCondition_6', false);
      setValue('specificMedicalCondition_6_no', false);
      setValue('specificMedicalCondition_6_details', '');
      setValue('specificMedicalCondition_7', false);
      setValue('specificMedicalCondition_7_no', false);
      setValue('specificMedicalCondition_7_details', '');
      setValue('specificMedicalCondition_8', false);
      setValue('specificMedicalCondition_8_no', false);
      setValue('specificMedicalCondition_8_details', '');
      setValue('specificMedicalCondition_9', false);
      setValue('specificMedicalCondition_9_no', false);
      setValue('specificMedicalCondition_9_details', '');
      setValue('specificMedicalCondition_10', false);
      setValue('specificMedicalCondition_10_no', false);
      setValue('specificMedicalCondition_10_details', '');
      setValue('specificMedicalCondition_11', false);
      setValue('specificMedicalCondition_11_no', false);
      setValue('specificMedicalCondition_11_details', '');
      setValue('specificMedicalCondition_12', false);
      setValue('specificMedicalCondition_12_no', false);
      setValue('specificMedicalCondition_12_details', '');
      setValue('specificMedicalCondition_13', false);
      setValue('specificMedicalCondition_13_no', false);
      setValue('specificMedicalCondition_13_details', '');
      setValue('specificMedicalCondition_14', false);
      setValue('specificMedicalCondition_14_no', false);
      setValue('specificMedicalCondition_14_details', '');
      setValue('pregnancy_1', healthInfo.pregnancy_1 || false);
      setValue('pregnancy_1_no', false);
      setValue('pregnancy_2', false);
      setValue('pregnancy_2_no', false);
      setValue('pregnancy_3', false);
      setValue('pregnancy_3_no', false);
      setValue('pregnancy_4', false);
      setValue('pregnancy_4_no', false);
      setValue('pregnancy_5', false);
      setValue('pregnancy_5_no', false);
      setValue('pregnancy_6', false);
      setValue('pregnancy_6_no', false);
      setValue(
        'pregnancyDate',
        healthInfo.pregnancyDate ? dayjs(healthInfo.pregnancyDate) : null,
      );
      setValue('spouseDetails_fullName_0', healthInfo.familyMemberName_0 || '');
      setValue(
        'spouseDetails_relation_0',
        healthInfo.familyMemberRelation_0 || '',
      );
      setValue('spouseDetails_height_0', healthInfo.familyMemberHeight_0 || '');
      setValue('spouseDetails_weight_0', healthInfo.familyMemberWeight_0 || '');
      setValue(
        'spouseDetails_dateOfBirth_0',
        healthInfo.familyMemberDateOfBirth_0
          ? dayjs(healthInfo.familyMemberDateOfBirth_0)
          : null,
      );
      setValue('spouseDetails_fullName_1', healthInfo.familyMemberName_1 || '');
      setValue(
        'spouseDetails_relation_1',
        healthInfo.familyMemberRelation_1 || '',
      );
      setValue('spouseDetails_height_1', healthInfo.familyMemberHeight_1 || '');
      setValue('spouseDetails_weight_1', healthInfo.familyMemberWeight_1 || '');
      setValue(
        'spouseDetails_dateOfBirth_1',
        healthInfo.familyMemberDateOfBirth_1
          ? dayjs(healthInfo.familyMemberDateOfBirth_1)
          : null,
      );
      setValue('spouseDetails_fullName_2', healthInfo.familyMemberName_2 || '');
      setValue(
        'spouseDetails_relation_2',
        healthInfo.familyMemberRelation_2 || '',
      );
      setValue('spouseDetails_height_2', healthInfo.familyMemberHeight_2 || '');
      setValue('spouseDetails_weight_2', healthInfo.familyMemberWeight_2 || '');
      setValue(
        'spouseDetails_dateOfBirth_2',
        healthInfo.familyMemberDateOfBirth_2
          ? dayjs(healthInfo.familyMemberDateOfBirth_2)
          : null,
      );
      setValue('spouseDetails_fullName_3', healthInfo.familyMemberName_3 || '');
      setValue(
        'spouseDetails_relation_3',
        healthInfo.familyMemberRelation_3 || '',
      );
      setValue('spouseDetails_height_3', healthInfo.familyMemberHeight_3 || '');
      setValue('spouseDetails_weight_3', healthInfo.familyMemberWeight_3 || '');
      setValue(
        'spouseDetails_dateOfBirth_3',
        healthInfo.familyMemberDateOfBirth_3
          ? dayjs(healthInfo.familyMemberDateOfBirth_3)
          : null,
      );
      setValue('spouseDetails_fullName_4', healthInfo.familyMemberName_4 || '');
      setValue(
        'spouseDetails_relation_4',
        healthInfo.familyMemberRelation_4 || '',
      );
      setValue('spouseDetails_height_4', healthInfo.familyMemberHeight_4 || '');
      setValue('spouseDetails_weight_4', healthInfo.familyMemberWeight_4 || '');
      setValue(
        'spouseDetails_dateOfBirth_4',
        healthInfo.familyMemberDateOfBirth_4
          ? dayjs(healthInfo.familyMemberDateOfBirth_4)
          : null,
      );
      setValue('spouseDetails_fullName_5', healthInfo.familyMemberName_5 || '');
      setValue(
        'spouseDetails_relation_5',
        healthInfo.familyMemberRelation_5 || '',
      );
      setValue('spouseDetails_height_5', healthInfo.familyMemberHeight_5 || '');
      setValue('spouseDetails_weight_5', healthInfo.familyMemberWeight_5 || '');
      setValue(
        'spouseDetails_dateOfBirth_5',
        healthInfo.familyMemberDateOfBirth_5
          ? dayjs(healthInfo.familyMemberDateOfBirth_5)
          : null,
      );
      setValue('spouseDetails_fullName_6', healthInfo.familyMemberName_6 || '');
      setValue(
        'spouseDetails_relation_6',
        healthInfo.familyMemberRelation_6 || '',
      );
      setValue('spouseDetails_height_6', healthInfo.familyMemberHeight_6 || '');
      setValue('spouseDetails_weight_6', healthInfo.familyMemberWeight_6 || '');
      setValue(
        'spouseDetails_dateOfBirth_6',
        healthInfo.familyMemberDateOfBirth_6
          ? dayjs(healthInfo.familyMemberDateOfBirth_6)
          : null,
      );
      setValue('diabetes', '');
      setValue('immunomodulator', '');
      setValue('declarationConsent', healthInfo.consent || false);
    }
  }, [policyData, setValue]);

  useEffect(() => {
    const subscription = watch(value => {
      const formData = {
        companyName: value.companyName,
        firstName: value.firstName,
        middleName: value.middleName,
        lastName: value.lastName,
        address: value.address,
        gender: value.gender,
        maritalStatus: value.maritalStatus,
        nationality: value.nationality,
        country: value.country,
        mobileNumber: value.mobileNumber,
        email: value.email,
        salaryBand4000: value.salaryBand4000,
        salaryBand4001: value.salaryBand4001,
        visaDubai: value.visaDubai,
        visaAbuDhabi: value.visaAbuDhabi,
        visaOther: value.visaOther,
        isPolicyExistInUAE: value.isPolicyExistInUAE,
        isPolicyExistInUAE_no: value.isPolicyExistInUAE_no,
        policyDetails: value.policyDetails,
        currentInsurer: value.currentInsurer,
        currentInsurer_no: value.currentInsurer_no,
        currentInsurerDetails: value.currentInsurerDetails,
        currentInsurerExpiryDate: value.currentInsurerExpiryDate,
        currentInsurerExpiryDetails: value.currentInsurerExpiryDetails,
        hazardousSportActivity_1: value.hazardousSportActivity_1,
        hazardousSportActivity_1_no: value.hazardousSportActivity_1_no,
        hazardousSportActivity_1_details:
          value.hazardousSportActivity_1_details,
        hazardousSportActivity_2: value.hazardousSportActivity_2,
        hazardousSportActivity_2_no: value.hazardousSportActivity_2_no,
        hazardousSportActivity_2_details:
          value.hazardousSportActivity_2_details,
        specificMedicalCondition_1: value.specificMedicalCondition_1,
        specificMedicalCondition_1_no: value.specificMedicalCondition_1_no,
        specificMedicalCondition_1_details:
          value.specificMedicalCondition_1_details,
        specificMedicalCondition_2: value.specificMedicalCondition_2,
        specificMedicalCondition_2_no: value.specificMedicalCondition_2_no,
        specificMedicalCondition_2_details:
          value.specificMedicalCondition_2_details,
        specificMedicalCondition_3: value.specificMedicalCondition_3,
        specificMedicalCondition_3_no: value.specificMedicalCondition_3_no,
        specificMedicalCondition_3_details:
          value.specificMedicalCondition_3_details,
        specificMedicalCondition_4: value.specificMedicalCondition_4,
        specificMedicalCondition_4_no: value.specificMedicalCondition_4_no,
        specificMedicalCondition_4_details:
          value.specificMedicalCondition_4_details,
        specificMedicalCondition_5: value.specificMedicalCondition_5,
        specificMedicalCondition_5_no: value.specificMedicalCondition_5_no,
        specificMedicalCondition_5_details:
          value.specificMedicalCondition_5_details,
        specificMedicalCondition_6: value.specificMedicalCondition_6,
        specificMedicalCondition_6_no: value.specificMedicalCondition_6_no,
        specificMedicalCondition_6_details:
          value.specificMedicalCondition_6_details,
        specificMedicalCondition_7: value.specificMedicalCondition_7,
        specificMedicalCondition_7_no: value.specificMedicalCondition_7_no,
        specificMedicalCondition_7_details:
          value.specificMedicalCondition_7_details,
        specificMedicalCondition_8: value.specificMedicalCondition_8,
        specificMedicalCondition_8_no: value.specificMedicalCondition_8_no,
        specificMedicalCondition_8_details:
          value.specificMedicalCondition_8_details,
        specificMedicalCondition_9: value.specificMedicalCondition_9,
        specificMedicalCondition_9_no: value.specificMedicalCondition_9_no,
        specificMedicalCondition_9_details:
          value.specificMedicalCondition_9_details,
        specificMedicalCondition_10: value.specificMedicalCondition_10,
        specificMedicalCondition_10_no: value.specificMedicalCondition_10_no,
        specificMedicalCondition_10_details:
          value.specificMedicalCondition_10_details,
        specificMedicalCondition_11: value.specificMedicalCondition_11,
        specificMedicalCondition_11_no: value.specificMedicalCondition_11_no,
        specificMedicalCondition_11_details:
          value.specificMedicalCondition_11_details,
        specificMedicalCondition_12: value.specificMedicalCondition_12,
        specificMedicalCondition_12_no: value.specificMedicalCondition_12_no,
        specificMedicalCondition_12_details:
          value.specificMedicalCondition_12_details,
        specificMedicalCondition_13: value.specificMedicalCondition_13,
        specificMedicalCondition_13_no: value.specificMedicalCondition_13_no,
        specificMedicalCondition_13_details:
          value.specificMedicalCondition_13_details,
        specificMedicalCondition_14: value.specificMedicalCondition_14,
        specificMedicalCondition_14_no: value.specificMedicalCondition_14_no,
        specificMedicalCondition_14_details:
          value.specificMedicalCondition_14_details,
        pregnancy_1: value.pregnancy_1,
        pregnancy_1_no: value.pregnancy_1_no,
        pregnancy_2: value.pregnancy_2,
        pregnancy_2_no: value.pregnancy_2_no,
        pregnancy_3: value.pregnancy_3,
        pregnancy_3_no: value.pregnancy_3_no,
        pregnancy_4: value.pregnancy_4,
        pregnancy_4_no: value.pregnancy_4_no,
        pregnancy_5: value.pregnancy_5,
        pregnancy_5_no: value.pregnancy_5_no,
        pregnancy_6: value.pregnancy_6,
        pregnancy_6_no: value.pregnancy_6_no,
        pregnancyDate: value.pregnancyDate,
        spouseDetails_fullName_0: value.spouseDetails_fullName_0,
        spouseDetails_relation_0: value.spouseDetails_relation_0,
        spouseDetails_height_0: value.spouseDetails_height_0,
        spouseDetails_weight_0: value.spouseDetails_weight_0,
        spouseDetails_dateOfBirth_0: value.spouseDetails_dateOfBirth_0,
        spouseDetails_fullName_1: value.spouseDetails_fullName_1,
        spouseDetails_relation_1: value.spouseDetails_relation_1,
        spouseDetails_height_1: value.spouseDetails_height_1,
        spouseDetails_weight_1: value.spouseDetails_weight_1,
        spouseDetails_dateOfBirth_1: value.spouseDetails_dateOfBirth_1,
        spouseDetails_fullName_2: value.spouseDetails_fullName_2,
        spouseDetails_relation_2: value.spouseDetails_relation_2,
        spouseDetails_height_2: value.spouseDetails_height_2,
        spouseDetails_weight_2: value.spouseDetails_weight_2,
        spouseDetails_dateOfBirth_2: value.spouseDetails_dateOfBirth_2,
        spouseDetails_fullName_3: value.spouseDetails_fullName_3,
        spouseDetails_relation_3: value.spouseDetails_relation_3,
        spouseDetails_height_3: value.spouseDetails_height_3,
        spouseDetails_weight_3: value.spouseDetails_weight_3,
        spouseDetails_dateOfBirth_3: value.spouseDetails_dateOfBirth_3,
        spouseDetails_fullName_4: value.spouseDetails_fullName_4,
        spouseDetails_relation_4: value.spouseDetails_relation_4,
        spouseDetails_height_4: value.spouseDetails_height_4,
        spouseDetails_weight_4: value.spouseDetails_weight_4,
        spouseDetails_dateOfBirth_4: value.spouseDetails_dateOfBirth_4,
        spouseDetails_fullName_5: value.spouseDetails_fullName_5,
        spouseDetails_relation_5: value.spouseDetails_relation_5,
        spouseDetails_height_5: value.spouseDetails_height_5,
        spouseDetails_weight_5: value.spouseDetails_weight_5,
        spouseDetails_dateOfBirth_5: value.spouseDetails_dateOfBirth_5,
        spouseDetails_fullName_6: value.spouseDetails_fullName_6,
        spouseDetails_relation_6: value.spouseDetails_relation_6,
        spouseDetails_height_6: value.spouseDetails_height_6,
        spouseDetails_weight_6: value.spouseDetails_weight_6,
        spouseDetails_dateOfBirth_6: value.spouseDetails_dateOfBirth_6,
        diabetes: value.diabetes,
        immunomodulator: value.immunomodulator,
        declarationConsent: value.declarationConsent,
      };
      setFormData({ companyName: 'Takaful Emarat', formData });
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  // ✅ Fixed: Use data parameter instead of undefined 'value'
  const onSubmit = async data => {
    // Manual validation
    let hasError = false;

    // Validate email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('email', { type: 'manual', message: 'Invalid email' });
      hasError = true;
    } else {
      clearErrors('email');
    }

    // Validate declaration consent
    if (!data.declarationConsent) {
      setError('declarationConsent', {
        type: 'manual',
        message: 'You must agree to the declaration',
      });
      hasError = true;
    } else {
      clearErrors('declarationConsent');
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const formData = {
        companyName: data.companyName,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        nationality: data.nationality,
        country: data.country,
        mobileNumber: data.mobileNumber,
        email: data.email,
        salaryBand4000: data.salaryBand4000,
        salaryBand4001: data.salaryBand4001,
        visaDubai: data.visaDubai,
        visaAbuDhabi: data.visaAbuDhabi,
        visaOther: data.visaOther,
        isPolicyExistInUAE: data.isPolicyExistInUAE,
        isPolicyExistInUAE_no: data.isPolicyExistInUAE_no,
        policyDetails: data.policyDetails,
        currentInsurer: data.currentInsurer,
        currentInsurer_no: data.currentInsurer_no,
        currentInsurerDetails: data.currentInsurerDetails,
        currentInsurerExpiryDate: data.currentInsurerExpiryDate,
        currentInsurerExpiryDetails: data.currentInsurerExpiryDetails,
        hazardousSportActivity_1: data.hazardousSportActivity_1,
        hazardousSportActivity_1_no: data.hazardousSportActivity_1_no,
        hazardousSportActivity_1_details: data.hazardousSportActivity_1_details,
        hazardousSportActivity_2: data.hazardousSportActivity_2,
        hazardousSportActivity_2_no: data.hazardousSportActivity_2_no,
        hazardousSportActivity_2_details: data.hazardousSportActivity_2_details,
        specificMedicalCondition_1: data.specificMedicalCondition_1,
        specificMedicalCondition_1_no: data.specificMedicalCondition_1_no,
        specificMedicalCondition_1_details:
          data.specificMedicalCondition_1_details,
        specificMedicalCondition_2: data.specificMedicalCondition_2,
        specificMedicalCondition_2_no: data.specificMedicalCondition_2_no,
        specificMedicalCondition_2_details:
          data.specificMedicalCondition_2_details,
        specificMedicalCondition_3: data.specificMedicalCondition_3,
        specificMedicalCondition_3_no: data.specificMedicalCondition_3_no,
        specificMedicalCondition_3_details:
          data.specificMedicalCondition_3_details,
        specificMedicalCondition_4: data.specificMedicalCondition_4,
        specificMedicalCondition_4_no: data.specificMedicalCondition_4_no,
        specificMedicalCondition_4_details:
          data.specificMedicalCondition_4_details,
        specificMedicalCondition_5: data.specificMedicalCondition_5,
        specificMedicalCondition_5_no: data.specificMedicalCondition_5_no,
        specificMedicalCondition_5_details:
          data.specificMedicalCondition_5_details,
        specificMedicalCondition_6: data.specificMedicalCondition_6,
        specificMedicalCondition_6_no: data.specificMedicalCondition_6_no,
        specificMedicalCondition_6_details:
          data.specificMedicalCondition_6_details,
        specificMedicalCondition_7: data.specificMedicalCondition_7,
        specificMedicalCondition_7_no: data.specificMedicalCondition_7_no,
        specificMedicalCondition_7_details:
          data.specificMedicalCondition_7_details,
        specificMedicalCondition_8: data.specificMedicalCondition_8,
        specificMedicalCondition_8_no: data.specificMedicalCondition_8_no,
        specificMedicalCondition_8_details:
          data.specificMedicalCondition_8_details,
        specificMedicalCondition_9: data.specificMedicalCondition_9,
        specificMedicalCondition_9_no: data.specificMedicalCondition_9_no,
        specificMedicalCondition_9_details:
          data.specificMedicalCondition_9_details,
        specificMedicalCondition_10: data.specificMedicalCondition_10,
        specificMedicalCondition_10_no: data.specificMedicalCondition_10_no,
        specificMedicalCondition_10_details:
          data.specificMedicalCondition_10_details,
        specificMedicalCondition_11: data.specificMedicalCondition_11,
        specificMedicalCondition_11_no: data.specificMedicalCondition_11_no,
        specificMedicalCondition_11_details:
          data.specificMedicalCondition_11_details,
        specificMedicalCondition_12: data.specificMedicalCondition_12,
        specificMedicalCondition_12_no: data.specificMedicalCondition_12_no,
        specificMedicalCondition_12_details:
          data.specificMedicalCondition_12_details,
        specificMedicalCondition_13: data.specificMedicalCondition_13,
        specificMedicalCondition_13_no: data.specificMedicalCondition_13_no,
        specificMedicalCondition_13_details:
          data.specificMedicalCondition_13_details,
        specificMedicalCondition_14: data.specificMedicalCondition_14,
        specificMedicalCondition_14_no: data.specificMedicalCondition_14_no,
        specificMedicalCondition_14_details:
          data.specificMedicalCondition_14_details,
        pregnancy_1: data.pregnancy_1,
        pregnancy_1_no: data.pregnancy_1_no,
        pregnancy_2: data.pregnancy_2,
        pregnancy_2_no: data.pregnancy_2_no,
        pregnancy_3: data.pregnancy_3,
        pregnancy_3_no: data.pregnancy_3_no,
        pregnancy_4: data.pregnancy_4,
        pregnancy_4_no: data.pregnancy_4_no,
        pregnancy_5: data.pregnancy_5,
        pregnancy_5_no: data.pregnancy_5_no,
        pregnancy_6: data.pregnancy_6,
        pregnancy_6_no: data.pregnancy_6_no,
        pregnancyDate: data.pregnancyDate,
        spouseDetails_fullName_0: data.spouseDetails_fullName_0,
        spouseDetails_relation_0: data.spouseDetails_relation_0,
        spouseDetails_height_0: data.spouseDetails_height_0,
        spouseDetails_weight_0: data.spouseDetails_weight_0,
        spouseDetails_dateOfBirth_0: data.spouseDetails_dateOfBirth_0,
        spouseDetails_fullName_1: data.spouseDetails_fullName_1,
        spouseDetails_relation_1: data.spouseDetails_relation_1,
        spouseDetails_height_1: data.spouseDetails_height_1,
        spouseDetails_weight_1: data.spouseDetails_weight_1,
        spouseDetails_dateOfBirth_1: data.spouseDetails_dateOfBirth_1,
        spouseDetails_fullName_2: data.spouseDetails_fullName_2,
        spouseDetails_relation_2: data.spouseDetails_relation_2,
        spouseDetails_height_2: data.spouseDetails_height_2,
        spouseDetails_weight_2: data.spouseDetails_weight_2,
        spouseDetails_dateOfBirth_2: data.spouseDetails_dateOfBirth_2,
        spouseDetails_fullName_3: data.spouseDetails_fullName_3,
        spouseDetails_relation_3: data.spouseDetails_relation_3,
        spouseDetails_height_3: data.spouseDetails_height_3,
        spouseDetails_weight_3: data.spouseDetails_weight_3,
        spouseDetails_dateOfBirth_3: data.spouseDetails_dateOfBirth_3,
        spouseDetails_fullName_4: data.spouseDetails_fullName_4,
        spouseDetails_relation_4: data.spouseDetails_relation_4,
        spouseDetails_height_4: data.spouseDetails_height_4,
        spouseDetails_weight_4: data.spouseDetails_weight_4,
        spouseDetails_dateOfBirth_4: data.spouseDetails_dateOfBirth_4,
        spouseDetails_fullName_5: data.spouseDetails_fullName_5,
        spouseDetails_relation_5: data.spouseDetails_relation_5,
        spouseDetails_height_5: data.spouseDetails_height_5,
        spouseDetails_weight_5: data.spouseDetails_weight_5,
        spouseDetails_dateOfBirth_5: data.spouseDetails_dateOfBirth_5,
        spouseDetails_fullName_6: data.spouseDetails_fullName_6,
        spouseDetails_relation_6: data.spouseDetails_relation_6,
        spouseDetails_height_6: data.spouseDetails_height_6,
        spouseDetails_weight_6: data.spouseDetails_weight_6,
        spouseDetails_dateOfBirth_6: data.spouseDetails_dateOfBirth_6,
        diabetes: data.diabetes,
        immunomodulator: data.immunomodulator,
        declarationConsent: data.declarationConsent,
      };
      const payload = { companyName: 'Takaful Emarat', formData };
      await onSave(payload);
    } catch (error) {
      console.error(error.message || 'Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFamilyMember = indexToRemove => {
    const values = getValues();
    for (const key in values) {
      if (key.endsWith(`_${indexToRemove}`)) {
        setValue(key, undefined);
      }
    }
    setFamilyCount(prev => prev - 1);
  };

  const addFamilyMember = () => {
    if (familyCount < 7) {
      setFamilyCount(prev => prev + 1);
    }
  };

  const specificConditions = [
    'Have you ever been diagnosed, treated or felt any disorder, pain or had any symptoms related to the a) Musculoskeletal & /or Connective Tissue System? (i.e.: fractures, joint or cartilage problems, back problems, deformities, bone infections, osteoporosis, arthritis, rheumatism, etc.)',
    'Cancer, Neoplasms, Tumors? (specify type, location, treatment, whether malignant or benign)',
    'Blood & Blood Forming Organ Systems? (i.e.: anemia, thalasemia, bleeding disorders, blood cell disease, spleen problems, lymph node problems, etc.)',
    'Digestive System? (i.e. reflux, ulcers, diverticuli, bleeding-infection-obstruction-perforation of the esophagus, stomach, intestines or colon, problems of the teeth/gums/mouth/jaw, problems with the liver, gallbladder or pancreas, anal/rectal polyps?)',
    'Endocrine, Nutritional, Metabolic and/or Immunity System? (i.e. diabetes, thyroid or pituitary gland problems, adrenal gland, ovary or testes problems, hormone problems, gout, multiple sclerosis, cystic fibrosis, metabolic disorders, immune problems, etc.)',
    'Nervous System or Sense Organs? (i.e. ear injury/infection, vertigo, hearing problems, eye injury/disease, retina problems, glaucoma, vision problems, muscular dystrophy, brain/nerve degeneration, meningitis, paralysis, seizures, epilepsy, neuralgia, psychiatry & any psychology disorder etc.)',
    'Genitourinary System? (i.e. kidney/bladder infections, renal failure, kidney stones, endometriosis, menstrual cycle problems, salpingitis, ovarian cysts, prostate problems, impotence, testicle infections, sperm abnormalities, fertility problems, etc.)',
    'Respiratory System? (i.e. sinusitis, allergies, tonsillitis/laryngitis, bronchitis, emphysema, pneumonia, etc.)',
    'Cardiovascular System? (i.e. stroke, cerebral ischemia, rheumatic fever, atherosclerosis, aneurysm, embolism, peripheral vascular disease, hypertension, heart valve disease, irregular heart beat, pulmonary embolism, phlebitis, varicosities, etc.)',
    'Skin-Subcutaneous Tissue? (i.e. dermatitis, acne, seborrhea, puritis, etc.)',
    'Have you been tested or treated for Hepatitis A or C?',
    'Any (chronic) disease(s), symptoms and complaints not mentioned above',
    'Have you ever undergone surgery to remove a body organ or structure or being hospitalised in the past? (specify body organ/Structure, date & place of surgery?)',
    'Are you HIV positive or have any medical condition or symptom indicative of HIV infection or AIDS?',
  ];

  const pregnancyLabels = [
    'Are you currently pregnant?',
    'Is it multiple gestation/pregnancy with more than one baby (twins/triplets etc) at time?',
    'If Yes, have there been any complications to date?',
    'Are you currently trying to get pregnant?',
    'Are you undergoing any form of fertility treatment?',
    'Do you have earlier history of Caesarean Section, Premature Delivery or Premature babies? Or any other complications related to maternity, till date? Please Specify',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{policyData?.company?.companyName}</Text>

      <Text style={styles.sectionTitle}>Principal Details</Text>

      <View
        style={{
          gap: verticalScale(15),
        }}
      >
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="First Name"
              value={value}
              onChangeText={onChange}
              error={errors.firstName?.message}
              showErrorMessage
            />
          )}
        />

        <Controller
          control={control}
          name="middleName"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Middle Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Last Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Address"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
            />
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <CustomDropDownList
              title="Select Gender"
              data={HEALTH_CONSTANTS.GENDER_OPTIONS}
              value={value}
              handleSelect={onChange}
              showSearch={false}
              errors={errors.gender?.message}
              absolute
            />
          )}
        />

        <Controller
          control={control}
          name="maritalStatus"
          render={({ field: { onChange, value } }) => (
            <CustomDropDownList
              title="Select Marital Status"
              data={HEALTH_CONSTANTS.MARITAL_STATUS_OPTIONS}
              value={value}
              showSearch={false}
              handleSelect={onChange}
              errors={errors.maritalStatus?.message}
              absolute
            />
          )}
        />

        <Controller
          control={control}
          name="nationality"
          render={({ field: { onChange, value } }) => (
            <CustomDropDownList
              title="Select Nationality"
              data={nationalities}
              value={value}
              showSearch={false}
              handleSelect={onChange}
              errors={errors.nationality?.message}
              absolute
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <CustomDropDownList
              title="Select Country"
              data={HEALTH_CONSTANTS.COUNTRIES_OPTIONS}
              value={value}
              showSearch={false}
              handleSelect={onChange}
              errors={errors.country?.message}
              absolute
            />
          )}
        />

        <Controller
          control={control}
          name="mobileNumber"
          render={({ field: { onChange, value } }) => (
            <CountryPhoneInput
              onChange={onChange}
              value={value}
              errors={errors.mobileNumber?.message}
            />
          )}
        />

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

        {/* Salary Band */}
        <CustomDropDownList
          title="Select Salary Band"
          data={HEALTH_CONSTANTS.SALARY_BAND_OPTIONS}
          value={
            getValues('salaryBand4000')
              ? '4000'
              : getValues('salaryBand4001')
              ? '4001'
              : ''
          }
          handleSelect={value => {
            setValue('salaryBand4000', value === '4000');
            setValue('salaryBand4001', value === '4001');
          }}
          showSearch={false}
          absolute
        />

        {/* Visa Type */}
        <CustomDropDownList
          title="Select Visa Type"
          data={HEALTH_CONSTANTS.VISA_TYPE_OPTIONS}
          showSearch={false}
          value={
            getValues('visaDubai')
              ? 'Dubai'
              : getValues('visaAbuDhabi')
              ? 'AbuDhabi'
              : getValues('visaOther')
              ? 'Other'
              : ''
          }
          handleSelect={value => {
            setValue('visaDubai', value === 'Dubai');
            setValue('visaAbuDhabi', value === 'AbuDhabi');
            setValue('visaOther', value === 'Other');
          }}
          absolute
        />
      </View>

      <Text style={styles.sectionTitle}>
        Members Schedule - All Family Members
      </Text>

      <View style={{ gap: verticalScale(15) }}>
        {[...Array(familyCount)].map((_, index) => (
          <View key={index} style={styles.familyMemberContainer}>
            <View style={styles.familyMemberHeader}>
              <Text style={styles.familyMemberTitle}>
                Family Member {index + 1}
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
              name={`spouseDetails_fullName_${index}`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`spouseDetails_relation_${index}`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Relation"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`spouseDetails_height_${index}`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Height (cm)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`spouseDetails_weight_${index}`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Weight (kg)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {index < 6 && (
              <Controller
                control={control}
                name={`spouseDetails_dateOfBirth_${index}`}
                render={({ field: { value }, fieldState }) => (
                  <View style={styles.inputSpacing}>
                    <TouchableOpacity
                      style={[
                        styles.datePickerButton,
                        fieldState.error && styles.errorBorder,
                      ]}
                      onPress={() =>
                        setDatePickerVisible(
                          `spouseDetails_dateOfBirth_${index}`,
                        )
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
                    <DatePickerModal
                      visible={
                        datePickerVisible ===
                        `spouseDetails_dateOfBirth_${index}`
                      }
                      onClose={() => setDatePickerVisible(null)}
                      onConfirm={date => {
                        setValue(`spouseDetails_dateOfBirth_${index}`, date);
                        setDatePickerVisible(null);
                      }}
                      initialDate={value || new Date()}
                      maxDate={new Date()}
                    />
                  </View>
                )}
              />
            )}
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

      <Text style={styles.sectionTitle}>Insurance History</Text>

      <View style={{ gap: verticalScale(15) }}>
        <Controller
          control={control}
          name="isPolicyExistInUAE"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Have you ever been accepted for life and/or health insurance on sub-standard terms?"
              value={value}
              onChange={onChange}
            />
          )}
        />

        {watch('isPolicyExistInUAE') == true && (
          <Controller
            control={control}
            name="policyDetails"
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Policy Details"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        )}
      </View>

      <Text style={styles.sectionTitle}>Extra Activities</Text>

      <View style={{ gap: verticalScale(15) }}>
        <Controller
          control={control}
          name="hazardousSportActivity_1"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Do you participate or intend to participate in any hazardous sports or activities?"
              value={value}
              onChange={onChange}
            />
          )}
        />

        {watch('hazardousSportActivity_1') && (
          <Controller
            control={control}
            name="hazardousSportActivity_1_details"
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Hazardous Sports Details"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                style={styles.inputSpacing}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="hazardousSportActivity_2"
          render={({ field: { onChange, value } }) => (
            <CustomCheckBox
              label="Do you ride motorcycles and/or electric scooters?"
              value={value}
              onChange={onChange}
            />
          )}
        />

        {watch('hazardousSportActivity_2') && (
          <Controller
            control={control}
            name="hazardousSportActivity_2_details"
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Motorcycle Riding Details"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                style={styles.inputSpacing}
              />
            )}
          />
        )}
      </View>

      <Text style={styles.sectionTitle}>Specific Medical History</Text>

      <View style={{ gap: verticalScale(15) }}>
        {specificConditions.map((label, index) => (
          <React.Fragment key={index}>
            <Controller
              control={control}
              name={`specificMedicalCondition_${index + 1}`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label={label}
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            {watch(`specificMedicalCondition_${index + 1}`) && (
              <Controller
                control={control}
                name={`specificMedicalCondition_${index + 1}_details`}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Details"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {gender === 'Female' && maritalStatus === 'Married' && (
        <>
          <Text style={styles.sectionTitle}>
            Pregnancy Questionnaire (Applicable for married females)
          </Text>

          <View style={{ gap: verticalScale(15) }}>
            {pregnancyLabels.map((label, index) => (
              <Controller
                key={index}
                control={control}
                name={`pregnancy_${index + 1}`}
                render={({ field: { onChange, value } }) => (
                  <CustomCheckBox
                    label={label}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            ))}

            {watch('pregnancy_1') && (
              <Controller
                control={control}
                name="pregnancyDate"
                render={({ field: { value }, fieldState }) => (
                  <View style={styles.inputSpacing}>
                    <TouchableOpacity
                      style={[
                        styles.datePickerButton,
                        fieldState.error && styles.errorBorder,
                      ]}
                      onPress={() => setDatePickerVisible('pregnancyDate')}
                    >
                      <Text style={styles.datePickerLabel}>
                        Last Menstrual Period Date
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
                    <DatePickerModal
                      visible={datePickerVisible === 'pregnancyDate'}
                      onClose={() => setDatePickerVisible(null)}
                      onConfirm={date => {
                        setValue('pregnancyDate', date);
                        setDatePickerVisible(null);
                      }}
                      initialDate={value || new Date()}
                      maxDate={new Date()}
                    />
                  </View>
                )}
              />
            )}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>
        Details of any other medical condition
      </Text>

      <View style={{ gap: verticalScale(15) }}>
        <Text style={[styles.instructionText]}>
          In case of diabetes please specify whether insulin dependent please
          specify the generic name / brand name as well as the daily / weekly
          quantity below:
        </Text>

        <Controller
          control={control}
          name="diabetes"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="In case of diabetes please specify whether insulin dependent please specify the generic name / brand name as well as the daily / weekly quantity below:"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={{ gap: verticalScale(15) }}>
        <Text style={[styles.instructionText]}>
          In case currently on immunomodulator or immunotherapy kindly specify
          the generic name / brand name as well as how often administration is
          required:
        </Text>

        <Controller
          control={control}
          name="immunomodulator"
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="In case currently on immunomodulator or immunotherapy kindly specify the generic name / brand name as well as how often administration is required:"
              value={value}
              onChangeText={onChange}
              numberOfLines={3}
            />
          )}
        />
      </View>

      <Text style={styles.sectionTitle}>Declaration & Authorization</Text>

      <View style={styles.declarationContainer}>
        {HEALTH_CONSTANTS.CONTENT.map((item, index) => (
          <Text key={index} style={[styles.declarationText]}>
            {item}
          </Text>
        ))}

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
    inputSpacing: {},
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
    medicalConditionContainer: {
      marginBottom: verticalScale(16),
    },
    declarationContainer: {
      gap: verticalScale(15),
    },
    declarationText: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      lineHeight: 20,
      textAlign: 'justify',
      fontFamily: 'Lato-Regular',
    },
    declarationSpacing: {
      marginTop: 12,
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

export default TakafulForm;
