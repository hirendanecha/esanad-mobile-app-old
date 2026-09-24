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
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MedgulfForm = ({
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
  const [medicalConditionsCount, setMedicalConditionsCount] = useState(1);
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
          relation: 'Principal',
          dateOfBirth: null,
          gender: '',
          maritalStatus: '',
          height: '',
          weight: '',
          nationality: '',
          emiratesVisa: '',
        },
      ],
      email: '',
      mobileNo: '',
      todayDate: null,
      lastsectionDate: null,
      signature: '',
      signature2: '',
      declarationConsent: false,
      covid: '',
      covid_date: null,
      covidComplitions: '',
      insuranceRequest: '',
      healthInsuranceTerms: '',
      medicalDetails: [
        {
          p1: '',
          p2: '',
          p3: '',
          p4: '',
          p5: '',
          p6: '',
          p7: '',
          p8: '',
          p9: '',
        },
      ],
      medicalDetails_T2: [
        {
          p1: '',
          p2: '',
          p3: '',
          p4: '',
          p5: '',
          p6: '',
          p7: '',
        },
      ],
      medicalConditions: [
        {
          nameOfThePatient: '',
          patientMedicalCondition: '',
          treatmentOperatedDate: null,
          illnessAcute: false,
          illnessChronic: false,
          illnessRecurrent: false,
          hypertensionSystolicDetails: '',
          hypertensionDiastilicDetails: '',
          diabetes: false,
          diabetesYes_details: '',
          diagnosisStatusCured: false,
          diagnosisStatusOngoing: false,
          diagnosisStatusOngoingH: false,
          diagnosisStatusPendingH: false,
          diagnosisStatusOngoingT: false,
          diagnosisStatusPendingT: false,
          treatmentTakenOutPatient: false,
          treatmentTakenHospitalization: false,
          treatmentTakenTreated: false,
          treatmentTakenOperatedDate: null,
        },
      ],
      pregnancyDetails: {
        nameOfPregnantFemale: '',
        PregnantMenstrualPeriodDate: null,
        PregnantDetails1: '',
        PregnantDetails2: '',
        PregnantDetails3: '',
      },
      policyCardNo: '',
      text_141ehwy: '',
      name: '',
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
      setValue('members[0].relation', healthInfo.relation || 'Principal');
      setValue(
        'members[0].dateOfBirth',
        healthInfo.dateOfBirth ? dayjs(healthInfo.dateOfBirth) : null,
      );
      setValue('members[0].gender', healthInfo.gender || '');
      setValue('members[0].maritalStatus', healthInfo.maritalStatus || '');
      setValue('members[0].height', healthInfo.height || '');
      setValue('members[0].weight', healthInfo.weight || '');
      setValue('members[0].nationality', healthInfo.nationality || '');
      setValue('members[0].emiratesVisa', healthInfo.emiratesVisa || '');
      setValue('email', healthInfo.email || '');
      setValue('mobileNo', healthInfo.mobileNumber || '');
    }
  }, [policyData, setValue]);

  useEffect(() => {
    const subscription = watch(value => {
      const formData = {
        // Family Member Details
        ...Array.from({ length: 6 }, (_, index) => ({
          [`Famaliy_Member_NameR_${index + 1}`]:
            value.members?.[index]?.name || '',
          [`Famaliy_Member_DOBR_${index + 1}`]: value.members?.[index]
            ?.dateOfBirth
            ? formatDate(value.members[index].dateOfBirth)
            : '',
          [`Famaliy_Member_RelationR_${index + 1}`]:
            value.members?.[index]?.relation || '',
          [`Famaliy_Member_SexR_${index + 1}`]:
            value.members?.[index]?.gender || '',
          [`Famaliy_Member_MaritalR_${index + 1}`]:
            value.members?.[index]?.maritalStatus || '',
          [`Famaliy_Member_HeightR_${index + 1}`]:
            value.members?.[index]?.height || '',
          [`Famaliy_Member_Weight_${index + 1}`]:
            value.members?.[index]?.weight || '',
          [`Famaliy_Member_Nationality_${index + 1}`]:
            value.members?.[index]?.nationality || '',
          [`Famaliy_Member_Vissa_${index + 1}`]:
            value.members?.[index]?.emiratesVisa || '',
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),

        // Contact Information
        email: value.email || '',
        mobileNo: value.mobileNo || '',

        // COVID-19 Questions
        covid_yes: value.covid === 'Yes' || false,
        covid_no: value.covid === 'No' || false,
        covid_date: formatDate(value.covid_date),
        covidComplitions_yes: value.covidComplitions === 'Yes' || false,
        covidComplitions_no: value.covidComplitions === 'No' || false,

        // Insurance History
        insuranceRequest_yes: value.insuranceRequest === 'Yes' || false,
        insuranceRequest_no: value.insuranceRequest === 'No' || false,
        healthInsuranceTerms_yes: value.healthInsuranceTerms === 'Yes' || false,
        healthInsuranceTerms_no: value.healthInsuranceTerms === 'No' || false,

        // Medical Details (Table 1)
        medicalDetails_p1_yes: value.medicalDetails?.[0]?.p1 === 'Yes' || false,
        medicalDetails_p1_no: value.medicalDetails?.[0]?.p1 === 'No' || false,
        medicalDetails_p2_yes: value.medicalDetails?.[0]?.p2 === 'Yes' || false,
        medicalDetails_p2_no: value.medicalDetails?.[0]?.p2 === 'No' || false,
        medicalDetails_p3_yes: value.medicalDetails?.[0]?.p3 === 'Yes' || false,
        medicalDetails_p3_no: value.medicalDetails?.[0]?.p3 === 'No' || false,
        medicalDetails_p4_yes: value.medicalDetails?.[0]?.p4 === 'Yes' || false,
        medicalDetails_p4_no: value.medicalDetails?.[0]?.p4 === 'No' || false,
        medicalDetails_p5_yes: value.medicalDetails?.[0]?.p5 === 'Yes' || false,
        medicalDetails_p5_no: value.medicalDetails?.[0]?.p5 === 'No' || false,
        medicalDetails_p6_yes: value.medicalDetails?.[0]?.p6 === 'Yes' || false,
        medicalDetails_p6_no: value.medicalDetails?.[0]?.p6 === 'No' || false,
        medicalDetails_p7_yes: value.medicalDetails?.[0]?.p7 === 'Yes' || false,
        medicalDetails_p7_no: value.medicalDetails?.[0]?.p7 === 'No' || false,
        medicalDetails_p8_yes: value.medicalDetails?.[0]?.p8 === 'Yes' || false,
        medicalDetails_p8_no: value.medicalDetails?.[0]?.p8 === 'No' || false,
        medicalDetails_p9_yes: value.medicalDetails?.[0]?.p9 === 'Yes' || false,
        medicalDetails_p9_no: value.medicalDetails?.[0]?.p9 === 'No' || false,

        // Medical Details (Table 2)
        medicalDetails_T2_p1_yes:
          value.medicalDetails_T2?.[0]?.p1 === 'Yes' || false,
        medicalDetails_T2_p1_no:
          value.medicalDetails_T2?.[0]?.p1 === 'No' || false,
        medicalDetails_T2_p2_yes:
          value.medicalDetails_T2?.[0]?.p2 === 'Yes' || false,
        medicalDetails_T2_p2_no:
          value.medicalDetails_T2?.[0]?.p2 === 'No' || false,
        medicalDetails_T2_p3_yes:
          value.medicalDetails_T2?.[0]?.p3 === 'Yes' || false,
        medicalDetails_T2_p3_no:
          value.medicalDetails_T2?.[0]?.p3 === 'No' || false,
        medicalDetails_T2_p4_yes:
          value.medicalDetails_T2?.[0]?.p4 === 'Yes' || false,
        medicalDetails_T2_p4_no:
          value.medicalDetails_T2?.[0]?.p4 === 'No' || false,
        medicalDetails_T2_p5_yes:
          value.medicalDetails_T2?.[0]?.p5 === 'Yes' || false,
        medicalDetails_T2_p5_no:
          value.medicalDetails_T2?.[0]?.p5 === 'No' || false,
        medicalDetails_T2_p6_yes:
          value.medicalDetails_T2?.[0]?.p6 === 'Yes' || false,
        medicalDetails_T2_p6_no:
          value.medicalDetails_T2?.[0]?.p6 === 'No' || false,
        medicalDetails_T2_p7_yes:
          value.medicalDetails_T2?.[0]?.p7 === 'Yes' || false,
        medicalDetails_T2_p7_no:
          value.medicalDetails_T2?.[0]?.p7 === 'No' || false,

        // Medical Conditions (first one only for simplicity)
        nameOfThePatient: value.medicalConditions?.[0]?.nameOfThePatient || '',
        patientMedicalCondition:
          value.medicalConditions?.[0]?.patientMedicalCondition || '',
        treatmentOperatedDate: formatDate(
          value.medicalConditions?.[0]?.treatmentOperatedDate,
        ),
        illnessAcute: value.medicalConditions?.[0]?.illnessAcute || false,
        illnessChronic: value.medicalConditions?.[0]?.illnessChronic || false,
        illnessRecurrent:
          value.medicalConditions?.[0]?.illnessRecurrent || false,
        hypertensionSystolicDetails:
          value.medicalConditions?.[0]?.hypertensionSystolicDetails || '',
        hypertensionDiastilicDetails:
          value.medicalConditions?.[0]?.hypertensionDiastilicDetails || '',
        diabetes_yes: value.medicalConditions?.[0]?.diabetes || false,
        diabetes_no: !value.medicalConditions?.[0]?.diabetes || false,
        diabetesYes_details:
          value.medicalConditions?.[0]?.diabetesYes_details || '',
        diagnosisStatusCured:
          value.medicalConditions?.[0]?.diagnosisStatusCured || false,
        diagnosisStatusOngoing:
          value.medicalConditions?.[0]?.diagnosisStatusOngoing || false,
        diagnosisStatusOngoingH:
          value.medicalConditions?.[0]?.diagnosisStatusOngoingH || false,
        diagnosisStatusPendingH:
          value.medicalConditions?.[0]?.diagnosisStatusPendingH || false,
        diagnosisStatusOngoingT:
          value.medicalConditions?.[0]?.diagnosisStatusOngoingT || false,
        diagnosisStatusPendingT:
          value.medicalConditions?.[0]?.diagnosisStatusPendingT || false,
        treatmentTakenOutPatient:
          value.medicalConditions?.[0]?.treatmentTakenOutPatient || false,
        treatmentTakenHospitalization:
          value.medicalConditions?.[0]?.treatmentTakenHospitalization || false,
        treatmentTakenTreated:
          value.medicalConditions?.[0]?.treatmentTakenTreated || false,
        treatmentTakenOperatedDate: formatDate(
          value.medicalConditions?.[0]?.treatmentTakenOperatedDate,
        ),

        // Pregnancy Details
        nameOfPregnantFemale:
          value.pregnancyDetails?.nameOfPregnantFemale || '',
        PregnantMenstrualPeriodDate: formatDate(
          value.pregnancyDetails?.PregnantMenstrualPeriodDate,
        ),
        PregnantDetails1: value.pregnancyDetails?.PregnantDetails1 || '',
        PregnantDetails2: value.pregnancyDetails?.PregnantDetails2 || '',
        PregnantDetails3: value.pregnancyDetails?.PregnantDetails3 || '',

        // Miscellaneous
        policyCardNo: value.policyCardNo || '',
        text_141ehwy: value.text_141ehwy || '',
        name: value.name || '',
        todayDate: formatDate(value.todayDate),
        lastsectionDate: formatDate(value.lastsectionDate),
        signature: value.signature || '',
        signature2: value.signature2 || '',
      };
      setFormData({ companyName: 'medgulf', formData });
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
        // Family Member Details
        ...Array.from({ length: 6 }, (_, index) => ({
          [`Famaliy_Member_NameR_${index + 1}`]:
            data.members?.[index]?.name || '',
          [`Famaliy_Member_DOBR_${index + 1}`]: formatDate(
            data.members?.[index]?.dateOfBirth,
          ),
          [`Famaliy_Member_RelationR_${index + 1}`]:
            data.members?.[index]?.relation || '',
          [`Famaliy_Member_SexR_${index + 1}`]:
            data.members?.[index]?.gender || '',
          [`Famaliy_Member_MaritalR_${index + 1}`]:
            data.members?.[index]?.maritalStatus || '',
          [`Famaliy_Member_HeightR_${index + 1}`]:
            data.members?.[index]?.height || '',
          [`Famaliy_Member_Weight_${index + 1}`]:
            data.members?.[index]?.weight || '',
          [`Famaliy_Member_Nationality_${index + 1}`]:
            data.members?.[index]?.nationality || '',
          [`Famaliy_Member_Vissa_${index + 1}`]:
            data.members?.[index]?.emiratesVisa || '',
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),

        // Contact Information
        email: data.email || '',
        mobileNo: data.mobileNo || '',

        // COVID-19 Questions
        covid_yes: data.covid === 'Yes' || false,
        covid_no: data.covid === 'No' || false,
        covid_date: formatDate(data.covid_date),
        covidComplitions_yes: data.covidComplitions === 'Yes' || false,
        covidComplitions_no: data.covidComplitions === 'No' || false,

        // Insurance History
        insuranceRequest_yes: data.insuranceRequest === 'Yes' || false,
        insuranceRequest_no: data.insuranceRequest === 'No' || false,
        healthInsuranceTerms_yes: data.healthInsuranceTerms === 'Yes' || false,
        healthInsuranceTerms_no: data.healthInsuranceTerms === 'No' || false,

        // Medical Details (Table 1)
        medicalDetails_p1_yes: data.medicalDetails?.[0]?.p1 === 'Yes' || false,
        medicalDetails_p1_no: data.medicalDetails?.[0]?.p1 === 'No' || false,
        medicalDetails_p2_yes: data.medicalDetails?.[0]?.p2 === 'Yes' || false,
        medicalDetails_p2_no: data.medicalDetails?.[0]?.p2 === 'No' || false,
        medicalDetails_p3_yes: data.medicalDetails?.[0]?.p3 === 'Yes' || false,
        medicalDetails_p3_no: data.medicalDetails?.[0]?.p3 === 'No' || false,
        medicalDetails_p4_yes: data.medicalDetails?.[0]?.p4 === 'Yes' || false,
        medicalDetails_p4_no: data.medicalDetails?.[0]?.p4 === 'No' || false,
        medicalDetails_p5_yes: data.medicalDetails?.[0]?.p5 === 'Yes' || false,
        medicalDetails_p5_no: data.medicalDetails?.[0]?.p5 === 'No' || false,
        medicalDetails_p6_yes: data.medicalDetails?.[0]?.p6 === 'Yes' || false,
        medicalDetails_p6_no: data.medicalDetails?.[0]?.p6 === 'No' || false,
        medicalDetails_p7_yes: data.medicalDetails?.[0]?.p7 === 'Yes' || false,
        medicalDetails_p7_no: data.medicalDetails?.[0]?.p7 === 'No' || false,
        medicalDetails_p8_yes: data.medicalDetails?.[0]?.p8 === 'Yes' || false,
        medicalDetails_p8_no: data.medicalDetails?.[0]?.p8 === 'No' || false,
        medicalDetails_p9_yes: data.medicalDetails?.[0]?.p9 === 'Yes' || false,
        medicalDetails_p9_no: data.medicalDetails?.[0]?.p9 === 'No' || false,

        // Medical Details (Table 2)
        medicalDetails_T2_p1_yes:
          data.medicalDetails_T2?.[0]?.p1 === 'Yes' || false,
        medicalDetails_T2_p1_no:
          data.medicalDetails_T2?.[0]?.p1 === 'No' || false,
        medicalDetails_T2_p2_yes:
          data.medicalDetails_T2?.[0]?.p2 === 'Yes' || false,
        medicalDetails_T2_p2_no:
          data.medicalDetails_T2?.[0]?.p2 === 'No' || false,
        medicalDetails_T2_p3_yes:
          data.medicalDetails_T2?.[0]?.p3 === 'Yes' || false,
        medicalDetails_T2_p3_no:
          data.medicalDetails_T2?.[0]?.p3 === 'No' || false,
        medicalDetails_T2_p4_yes:
          data.medicalDetails_T2?.[0]?.p4 === 'Yes' || false,
        medicalDetails_T2_p4_no:
          data.medicalDetails_T2?.[0]?.p4 === 'No' || false,
        medicalDetails_T2_p5_yes:
          data.medicalDetails_T2?.[0]?.p5 === 'Yes' || false,
        medicalDetails_T2_p5_no:
          data.medicalDetails_T2?.[0]?.p5 === 'No' || false,
        medicalDetails_T2_p6_yes:
          data.medicalDetails_T2?.[0]?.p6 === 'Yes' || false,
        medicalDetails_T2_p6_no:
          data.medicalDetails_T2?.[0]?.p6 === 'No' || false,
        medicalDetails_T2_p7_yes:
          data.medicalDetails_T2?.[0]?.p7 === 'Yes' || false,
        medicalDetails_T2_p7_no:
          data.medicalDetails_T2?.[0]?.p7 === 'No' || false,

        // Medical Conditions (first one only)
        nameOfThePatient: data.medicalConditions?.[0]?.nameOfThePatient || '',
        patientMedicalCondition:
          data.medicalConditions?.[0]?.patientMedicalCondition || '',
        treatmentOperatedDate: formatDate(
          data.medicalConditions?.[0]?.treatmentOperatedDate,
        ),
        illnessAcute: data.medicalConditions?.[0]?.illnessAcute || false,
        illnessChronic: data.medicalConditions?.[0]?.illnessChronic || false,
        illnessRecurrent:
          data.medicalConditions?.[0]?.illnessRecurrent || false,
        hypertensionSystolicDetails:
          data.medicalConditions?.[0]?.hypertensionSystolicDetails || '',
        hypertensionDiastilicDetails:
          data.medicalConditions?.[0]?.hypertensionDiastilicDetails || '',
        diabetes_yes: data.medicalConditions?.[0]?.diabetes || false,
        diabetes_no: !data.medicalConditions?.[0]?.diabetes || false,
        diabetesYes_details:
          data.medicalConditions?.[0]?.diabetesYes_details || '',
        diagnosisStatusCured:
          data.medicalConditions?.[0]?.diagnosisStatusCured || false,
        diagnosisStatusOngoing:
          data.medicalConditions?.[0]?.diagnosisStatusOngoing || false,
        diagnosisStatusOngoingH:
          data.medicalConditions?.[0]?.diagnosisStatusOngoingH || false,
        diagnosisStatusPendingH:
          data.medicalConditions?.[0]?.diagnosisStatusPendingH || false,
        diagnosisStatusOngoingT:
          data.medicalConditions?.[0]?.diagnosisStatusOngoingT || false,
        diagnosisStatusPendingT:
          data.medicalConditions?.[0]?.diagnosisStatusPendingT || false,
        treatmentTakenOutPatient:
          data.medicalConditions?.[0]?.treatmentTakenOutPatient || false,
        treatmentTakenHospitalization:
          data.medicalConditions?.[0]?.treatmentTakenHospitalization || false,
        treatmentTakenTreated:
          data.medicalConditions?.[0]?.treatmentTakenTreated || false,
        treatmentTakenOperatedDate: formatDate(
          data.medicalConditions?.[0]?.treatmentTakenOperatedDate,
        ),

        // Pregnancy Details
        nameOfPregnantFemale: data.pregnancyDetails?.nameOfPregnantFemale || '',
        PregnantMenstrualPeriodDate: formatDate(
          data.pregnancyDetails?.PregnantMenstrualPeriodDate,
        ),
        PregnantDetails1: data.pregnancyDetails?.PregnantDetails1 || '',
        PregnantDetails2: data.pregnancyDetails?.PregnantDetails2 || '',
        PregnantDetails3: data.pregnancyDetails?.PregnantDetails3 || '',

        // Miscellaneous
        policyCardNo: data.policyCardNo || '',
        text_141ehwy: data.text_141ehwy || '',
        name: data.name || '',
        todayDate: formatDate(data.todayDate),
        lastsectionDate: formatDate(data.lastsectionDate),
        signature: data.signature || '',
        signature2: data.signature2 || '',
      };
      const payload = { companyName: 'medgulf', formData };
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
          nationality: '',
          emiratesVisa: '',
        },
      ]);
      setFamilyCount(prev => prev + 1);
    }
  };

  const removeMedicalCondition = indexToRemove => {
    const values = getValues();
    const updatedConditions = values.medicalConditions.filter(
      (_, index) => index !== indexToRemove,
    );
    setValue('medicalConditions', updatedConditions);
    setMedicalConditionsCount(prev => prev - 1);
  };

  const addMedicalCondition = () => {
    if (medicalConditionsCount < 5) {
      setValue('medicalConditions', [
        ...getValues().medicalConditions,
        {
          nameOfThePatient: '',
          patientMedicalCondition: '',
          treatmentOperatedDate: null,
          illnessAcute: false,
          illnessChronic: false,
          illnessRecurrent: false,
          hypertensionSystolicDetails: '',
          hypertensionDiastilicDetails: '',
          diabetes: false,
          diabetesYes_details: '',
          diagnosisStatusCured: false,
          diagnosisStatusOngoing: false,
          diagnosisStatusOngoingH: false,
          diagnosisStatusPendingH: false,
          diagnosisStatusOngoingT: false,
          diagnosisStatusPendingT: false,
          treatmentTakenOutPatient: false,
          treatmentTakenHospitalization: false,
          treatmentTakenTreated: false,
          treatmentTakenOperatedDate: null,
        },
      ]);
      setMedicalConditionsCount(prev => prev + 1);
    }
  };

  if (isLoading || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{policyData?.company?.companyName}</Text>

      {/* Family Members Section */}
      <Text style={styles.sectionTitle}>Family Members</Text>
      <View style={{ gap: verticalScale(15) }}>
        {getValues().members.map((member, index) => (
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
                  showSearch={false}
                  title="Select Relation"
                  data={HEALTH_CONSTANTS.RELATION_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].dateOfBirth`}
              render={({ field: { value } }) => (
                <View>
                  <Text style={styles.label}>Date of Birth</Text>
                  <CustomButton
                    title={value ? formatDate(value) : 'Select Date'}
                    onPress={() =>
                      openDatePicker(`members[${index}].dateOfBirth`)
                    }
                    buttonStyle={styles.dateButton}
                    textStyle={styles.dateButtonText}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].gender`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  showSearch={false}
                  title="Select Gender"
                  data={HEALTH_CONSTANTS.GENDER_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].maritalStatus`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  showSearch={false}
                  title="Select Marital Status"
                  data={HEALTH_CONSTANTS.MARITAL_STATUS_OPTIONS}
                  value={value}
                  handleSelect={onChange}
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
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].nationality`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  showSearch={false}
                  title="Select Nationality"
                  data={nationalities}
                  value={value}
                  handleSelect={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`members[${index}].emiratesVisa`}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  showSearch={false}
                  title="Select Emirates (Visa)"
                  data={HEALTH_CONSTANTS.EMIRATES_OPTIONS}
                  value={value}
                  handleSelect={onChange}
                />
              )}
            />
          </View>
        ))}
      </View>

      <CustomButton
        title="Add Family Member"
        onPress={addFamilyMember}
        disabled={familyCount >= 6}
        buttonStyle={styles.addButton}
      />

      {/* Contact Information */}
      <Text style={styles.sectionTitle}>Contact Information</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="Email Address"
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
          <FloatingLabelInput
            label="Mobile Number"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.infoText}>
        Have you availed insurance services under NEXTCARE, MEDNET, NAS earlier?
        If yes, please provide earlier
      </Text>

      <Controller
        control={control}
        name="policyCardNo"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="Policy/Card Numbers with Last Year of Service"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      {/* COVID-19 Questions */}
      <Text style={styles.sectionTitle}>COVID-19 Questions</Text>

      <Text style={styles.infoText}>
        Have you ever tested positive for COVID-19?
      </Text>

      <Controller
        control={control}
        name="covid"
        render={({ field: { onChange, value } }) => (
          <CustomDropDownList
            showSearch={false}
            title="Select Option"
            data={HEALTH_CONSTANTS.YES_NO_OPTIONS}
            value={value}
            handleSelect={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="covid_date"
        render={({ field: { value } }) => (
          <View>
            <Text style={styles.label}>
              When is the last date you have tested negative for COVID?
            </Text>
            <CustomButton
              title={value ? formatDate(value) : 'Select Date'}
              onPress={() => openDatePicker('covid_date')}
              buttonStyle={styles.dateButton}
              textStyle={styles.dateButtonText}
            />
          </View>
        )}
      />

      <Text style={styles.infoText}>
        Is there any Post COVID complications under medical monitoring?
      </Text>

      <Controller
        control={control}
        name="covidComplitions"
        render={({ field: { onChange, value } }) => (
          <CustomDropDownList
            showSearch={false}
            title="Select Option"
            data={HEALTH_CONSTANTS.YES_NO_OPTIONS}
            value={value}
            handleSelect={onChange}
          />
        )}
      />

      {/* Insurance History */}
      <Text style={styles.sectionTitle}>Insurance History</Text>

      <Text style={styles.infoText}>
        Has your health insurance request was ever declined or accepted on
        substandard terms?
      </Text>

      <Controller
        control={control}
        name="insuranceRequest"
        render={({ field: { onChange, value } }) => (
          <CustomDropDownList
            showSearch={false}
            title="Select Option"
            data={HEALTH_CONSTANTS.YES_NO_OPTIONS}
            value={value}
            handleSelect={onChange}
          />
        )}
      />

      <Text style={styles.infoText}>
        Is there any eligible family member kept away from this insurance
        request?
      </Text>

      <Controller
        control={control}
        name="healthInsuranceTerms"
        render={({ field: { onChange, value } }) => (
          <CustomDropDownList
            showSearch={false}
            title="Select Option"
            data={HEALTH_CONSTANTS.YES_NO_OPTIONS}
            value={value}
            handleSelect={onChange}
          />
        )}
      />

      {/* Medical Conditions Details */}
      <Text style={styles.sectionTitle}>Medical Conditions Details</Text>

      {getValues().medicalConditions.map((condition, index) => (
        <View key={index} style={styles.medicalDetailsContainer}>
          {index > 0 && (
            <View style={styles.medicalConditionHeader}>
              <Text style={styles.medicalConditionTitle}>
                Medical Condition {index + 1}
              </Text>
              <CustomButton
                title="Delete"
                onPress={() => removeMedicalCondition(index)}
                buttonStyle={styles.deleteButton}
                textStyle={styles.deleteButtonText}
              />
            </View>
          )}

          <Controller
            control={control}
            name={`medicalConditions[${index}].nameOfThePatient`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Name of the Patient"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name={`medicalConditions[${index}].patientMedicalCondition`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Medical Condition / Diagnosis"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
              />
            )}
          />

          <Text style={styles.sectionTitle}>
            Can the illness be described as follows?
          </Text>

          <View style={{ gap: 10 }}>
            <Controller
              control={control}
              name={`medicalConditions[${index}].illnessAcute`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Acute"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].illnessChronic`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Chronic"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].illnessRecurrent`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Recurrent"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <Text style={styles.subSectionTitle}>
            In case you are suffering from hypertension, please specify your
            recent Systolic and Diastolic reading below:
          </Text>

          <Controller
            control={control}
            name={`medicalConditions[${index}].hypertensionDiastilicDetails`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Hypertension Diastolic Details"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name={`medicalConditions[${index}].hypertensionSystolicDetails`}
            render={({ field: { onChange, value } }) => (
              <FloatingLabelInput
                label="Hypertension Systolic Details"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Text style={styles.subSectionTitle}>
            In case of diabetes, please specify whether insulin dependent, also
            specify/attach latest HbA1c result.
          </Text>

          <Controller
            control={control}
            name={`medicalConditions[${index}].diabetes`}
            render={({ field: { onChange, value } }) => (
              <CustomCheckBox
                label="Diabetes"
                value={value}
                onChange={onChange}
              />
            )}
          />

          {watch(`medicalConditions[${index}].diabetes`) && (
            <Controller
              control={control}
              name={`medicalConditions[${index}].diabetesYes_details`}
              render={({ field: { onChange, value } }) => (
                <FloatingLabelInput
                  label="Diabetes Details"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  style={[styles.inputSpacing, { marginTop: 10 }]}
                />
              )}
            />
          )}

          <Text style={styles.sectionTitle}>Diagnosis status:</Text>

          <View style={{ gap: 10 }}>
            <Controller
              control={control}
              name={`medicalConditions[${index}].diagnosisStatusCured`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Cured / No Symptoms"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].diagnosisStatusOngoing`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Ongoing Symptoms"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].diagnosisStatusOngoingH`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Ongoing Hospitalization"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].diagnosisStatusPendingH`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Pending Hospitalization"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].diagnosisStatusOngoingT`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Ongoing treatment"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].diagnosisStatusPendingT`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Pending treatment"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <Text style={styles.sectionTitle}>Treatment taken as:</Text>

          <View style={{ gap: 10, marginBottom: 15 }}>
            <Controller
              control={control}
              name={`medicalConditions[${index}].treatmentTakenOutPatient`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Out patient"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].treatmentTakenHospitalization`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Hospitalization"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name={`medicalConditions[${index}].treatmentTakenTreated`}
              render={({ field: { onChange, value } }) => (
                <CustomCheckBox
                  label="Treated both ways"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <Controller
            control={control}
            name={`medicalConditions[${index}].treatmentOperatedDate`}
            render={({ field: { value } }) => (
              <View>
                <Text style={styles.label}>Treatment Operated Date</Text>
                <CustomButton
                  title={value ? formatDate(value) : 'Select Date'}
                  onPress={() =>
                    openDatePicker(
                      `medicalConditions[${index}].treatmentOperatedDate`,
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
            name="todayDate"
            render={({ field: { value } }) => (
              <View>
                <Text style={styles.label}>Date</Text>
                <CustomButton
                  title={value ? formatDate(value) : 'Select Date'}
                  onPress={() => openDatePicker('todayDate')}
                  buttonStyle={styles.dateButton}
                  textStyle={styles.dateButtonText}
                />
              </View>
            )}
          />
        </View>
      ))}

      {/* Pregnancy Questionnaire */}
      <Text style={styles.sectionTitle}>
        Supplementary Pregnancy Questionnaire
      </Text>

      <Controller
        control={control}
        name="pregnancyDetails.nameOfPregnantFemale"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="Name of Pregnant Female"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="pregnancyDetails.PregnantMenstrualPeriodDate"
        render={({ field: { value } }) => (
          <View>
            <Text style={styles.label}>Last Menstrual Period Date</Text>
            <CustomButton
              title={value ? formatDate(value) : 'Select Date'}
              onPress={() =>
                openDatePicker('pregnancyDetails.PregnantMenstrualPeriodDate')
              }
              buttonStyle={styles.dateButton}
              textStyle={styles.dateButtonText}
            />
          </View>
        )}
      />

      <Text style={styles.infoText}>
        Do you have earlier history of Caesarean Section, Premature Delivery or
        Premature babies? Or any other complications related to maternity, till
        date?
      </Text>

      <Controller
        control={control}
        name="pregnancyDetails.PregnantDetails1"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="History of Caesarean, Premature Delivery, or Complications"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      <Text style={styles.infoText}>
        Have you undergone any treatment or taken any medications for
        infertility to achieve this pregnancy?
      </Text>

      <Controller
        control={control}
        name="pregnancyDetails.PregnantDetails2"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="Infertility Treatment or Medications"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      <Text style={styles.infoText}>
        Please send a copy of the latest ultrasound report and specify if there
        are any abnormal findings or more than one foetus seen.
      </Text>

      <Controller
        control={control}
        name="pregnancyDetails.PregnantDetails3"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="Ultrasound Report Details"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      {/* Medical Conditions Table 1 */}
      <Text style={styles.sectionTitle}>Medical Conditions (Table 1)</Text>

      {HEALTH_CONSTANTS.MEDICAL_CONDITIONS_TABLE_1.map((label, index) => (
        <View key={index} style={styles.medicalConditionContainer}>
          <Text style={styles.medicalQuestion}>{label}</Text>
          <Controller
            control={control}
            name={`medicalDetails[0].p${index + 1}`}
            render={({ field: { onChange, value } }) => (
              <CustomDropDownList
                showSearch={false}
                title="Select Option"
                data={HEALTH_CONSTANTS.YES_NO_OPTIONS}
                value={value}
                handleSelect={onChange}
              />
            )}
          />
        </View>
      ))}

      <Text style={styles.infoText}>
        For Married Females – When was your last Menstrual period date:
      </Text>

      <Controller
        control={control}
        name="text_141ehwy"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="date"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Medical Conditions Table 2 */}
      <Text style={styles.sectionTitle}>Medical Conditions (Table 2)</Text>

      {HEALTH_CONSTANTS.MEDICAL_CONDITIONS_TABLE_2.map((label, index) => (
        <View key={index} style={styles.medicalConditionContainer}>
          <Text style={styles.medicalQuestion}>{label}</Text>
          <Controller
            control={control}
            name={`medicalDetails_T2[0].p${index + 1}`}
            render={({ field: { onChange, value } }) => (
              <CustomDropDownList
                showSearch={false}
                title="Select Option"
                data={HEALTH_CONSTANTS.YES_NO_OPTIONS}
                value={value}
                handleSelect={onChange}
              />
            )}
          />
        </View>
      ))}

      {/* Declaration */}
      <Text style={styles.sectionTitle}>Declaration & Authorization</Text>

      <View style={styles.declarationContainer}>
        <Text style={styles.declarationText}>
          Disclaimer: I understand and acknowledge any pregnancy not declared at
          the time of this application's coverage will be at the sole discretion
          of the insurer. The insurer has the right to not cover any maternity
          claims to any undeclared pregnancy. I also acknowledge and understand
          any pregnancy, which arises within forty calendar days from the date
          of this application; coverage will also be at the discretion of the
          insurer.
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

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <FloatingLabelInput
            label="Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="lastsectionDate"
        render={({ field: { value } }) => (
          <View>
            <Text style={styles.label}>Date</Text>
            <CustomButton
              title={value ? formatDate(value) : 'Select Date'}
              onPress={() => openDatePicker('lastsectionDate')}
              buttonStyle={styles.dateButton}
              textStyle={styles.dateButtonText}
            />
          </View>
        )}
      />

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
        buttonStyle={styles.submitButton}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    infoText: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: verticalScale(8),
    },
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
    subSectionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 12,
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
      gap: verticalScale(15),
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
    medicalDetailsContainer: {},
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
    medicalConditionContainer: {
      marginBottom: verticalScale(16),
    },
    medicalQuestion: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 8,
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

export default MedgulfForm;
