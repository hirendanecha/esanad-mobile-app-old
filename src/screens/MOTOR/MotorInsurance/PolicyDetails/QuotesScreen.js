import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import {
  useCreateUser,
  useGetNationalList,
} from '@hooks/motorflow/useMotorFlowTop';
import { useAuthStore } from '@store/authStore';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import { ageCalculator } from '@utils/ageCalculator';
import axios from 'axios';
import { env } from '@config/index';

import CustomButton from '@components/ui/CustomButton';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import DatePickerModal from '@components/ui/CustomDatePicker';
import CustomCheckBox from '@components/ui/CustomCheckBox';
import moment from 'moment';
import Calender from '@assets/icons/Calender';
import CustomOptionList from '@components/ui/CustomOptionList';
import { CONSTANTS } from '@constants/staticJson';
import CustomSingleSlider from '@components/ui/CustomSingleSlider';

const claimOptions = Object.entries(CONSTANTS.CLAIM_OPTIONS).map(
  ([, label]) => ({ label, value: label }),
);

const MotorInsuranceWizard = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [policyIssueDateModalOpen, setPolicyIssueDateModalOpen] =
    useState(false);
  const [dob, setDob] = useState(null);
  const [policyIssueDate, setPolicyIssueDate] = useState(null);

  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyStartDate, setPolicyStartDate] = useState(
    new Date(Date.now() + 86400000),
  );
  const [isComprehensive, setIsComprehensive] = useState(true);
  const [isCurrentInsuranceActive, setIsCurrentInsuranceActive] =
    useState(true);
  const [isDrivingLicenseValid, setIsDrivingLicenseValid] = useState(true);

  const { data: nationalList = [] } = useGetNationalList();
  const { token, user } = useAuthStore();
  const { mutate: createUser } = useCreateUser();
  const {
    calculateCarValue,
    updateIsComprehensiveInsurance,
    updateIsActiveInsurance,
    updatePolicyDetails,
    updateClaimDetails,
  } = useMotorDetalisStore();

  const nationalities = useMemo(
    () => nationalList.map(y => ({ label: y, value: y })),
    [nationalList],
  );

  const minCarValue = calculateCarValue?.valuation?.Low
    ? Math.ceil(calculateCarValue?.valuation?.Low / 100) * 100
    : 0;
  const maxCarValue = calculateCarValue?.valuation?.High
    ? Math.ceil(calculateCarValue?.valuation?.High / 100) * 100
    : 0;
  const defaultCarValue = calculateCarValue?.price || 0;

  const {
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    setValue,
    formState: { errors: personalErrors },
  } = useForm({
    defaultValues: {
      name: user?.fullName,
      mobileNumber: user?.mobileNumber
        ? { phone: user?.mobileNumber, isValid: true }
        : { phone: '', isValid: false },
      email: user?.email,
      nationality: user?.nationality,
      dateOfBirth: user?.dateOfBirth,
      age: user?.dateOfBirth ? ageCalculator(user?.dateOfBirth) : '',
      country: user?.countryCode,
      carValue: defaultCarValue || calculateCarValue?.price,
      yearOfNoClaim: claimOptions[claimOptions.length - 1]?.value || '',
      confirmDeclaration: true,
      dateOfIssue: moment().format(),
      drivingLicenseValid: true,
    },
  });

  useEffect(() => {
    if (calculateCarValue) {
      setValue('carValue', calculateCarValue?.price);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateCarValue]);

  const handlePersonalDobConfirm = selectedDate => {
    setDob(selectedDate);
    const dobISO = selectedDate.toISOString();
    setValue('dateOfBirth', dobISO, { shouldValidate: true });
    setValue('age', ageCalculator(dobISO), { shouldValidate: true });
    setPersonalModalOpen(false);
  };

  const handlePolicyIssueDateConfirm = selectedDate => {
    setPolicyIssueDate(selectedDate);
    const dateISO = selectedDate.toISOString();
    setValue('dateOfIssue', dateISO, { shouldValidate: true });
    setPolicyIssueDateModalOpen(false);
  };

  const updateClamDetails = claimValue => {
    // Call the store method if it exists, otherwise handle locally
    if (updateClaimDetails) {
      updateClaimDetails(claimValue);
    }
  };

  const onSubmitPersonalDetails = data => {
    if (!isDrivingLicenseValid) {
      alert(
        'Please confirm that your driving license is above 1 year old and issued in UAE',
      );
      return;
    }

    const phoneString =
      (data.mobileNumber && data.mobileNumber.phone) || data.mobileNumber || '';

    const payload = {
      fullName: data.name,
      email: data.email,
      mobileNumber: phoneString,
      nationality: data.nationality,
      dob: data.dateOfBirth,
      age: parseInt(data.age),
      policyStartDate: data.dateOfIssue,
      yearsOfNoClaim: data.yearOfNoClaim,
      oneYearLicence: isDrivingLicenseValid,
      insureType: isComprehensive,
      isCurrentInsuranceActive: isCurrentInsuranceActive,
      countryCode: data.country,
    };

    const chatbot = {
      customer_name: data.name,
      to: `${data.country}${phoneString}`,
      source: 'web',
      template: {
        name: 'welcome_to_esanad',
        previous_category: 'UTILITY',
        parameter_format: 'POSITIONAL',
        components: [
          {
            type: 'HEADER',
            format: 'TEXT',
            text: 'Hello and welcome to eSanad Insurance!',
          },
          {
            type: 'BODY',
            text: "We're glad to have you here. Whether you're looking for the best insurance options, need support with your existing policy, or just have a quick question we're here to help.",
          },
          {
            type: 'FOOTER',
            text: 'eSanad Team!',
          },
        ],
        language: 'en',
        status: 'APPROVED',
        category: 'MARKETING',
        id: '24306832118900637',
      },
    };

    const userToken = token;

    if (!__DEV__) {
      axios
        .post(
          `https://api.aibot.esanad.com/api/public/chat/add-customer-to-chatbot`,
          chatbot,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
              'x-stack-token':
                'IGAA6YRYASZAeBBZAE9zRUp1YWFmNEdZAN2ctMlhoU1BCWG1fWH',
            },
          },
        )
        .then(res => {
          console.log('Chatbot response:', res);
          createUser({ id: calculateCarValue?._id, data: payload });
        })
        .catch(err => {
          console.error('Chatbot error:', err);
          createUser({ id: calculateCarValue?._id, data: payload });
        });
    } else {
      createUser({ id: calculateCarValue?._id, data: payload });
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Your Details</Text>

      <View style={{ gap: verticalScale(20), marginTop: verticalScale(15) }}>
        <Controller
          control={personalControl}
          name="mobileNumber"
          rules={{
            validate: value => {
              if (!value || !value.phone) return 'Mobile number is required';
              const phoneStr = String(value.phone);
              if (phoneStr.length < 9) return 'At least 9 digits';
              if (phoneStr.length > 9) return 'Max 9 digits allowed';
              if (!value.isValid) return 'Please enter a valid mobile number';
              return true;
            },
          }}
          render={({ field: { value, onChange } }) => (
            <CountryPhoneInput
              value={value?.phone || ''}
              maxLength={9}
              onChange={({ phone, isValid }) => {
                onChange({ phone, isValid });
              }}
              errors={personalErrors?.mobileNumber?.message}
            />
          )}
        />

        <Controller
          control={personalControl}
          name="name"
          rules={{
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: 'Name can only contain letters and spaces',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Your Full Name"
              value={value}
              onChangeText={onChange}
              error={personalErrors.name?.message}
              showErrorMessage
            />
          )}
        />

        <Controller
          control={personalControl}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FloatingLabelInput
              label="Email Address"
              value={value}
              onChangeText={onChange}
              error={personalErrors.email?.message}
              showErrorMessage
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />

        <View style={styles.dateAgeContainer}>
          <Controller
            control={personalControl}
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
            render={({ field: { value }, fieldState: { error } }) => (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={[styles.datePickerButton, error && styles.errorBorder]}
                  onPress={() => setPersonalModalOpen(true)}
                >
                  <Text
                    style={[
                      styles.datePickerLabel,
                      {
                        color: error
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
                    {value ? moment(value).format('DD-MM-YYYY') : 'Select date'}
                  </Text>
                  <Calender />
                </TouchableOpacity>
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={personalControl}
            name="age"
            render={({ field: { value } }) => (
              <FloatingLabelInput
                label="Age"
                value={value?.toString() || ''}
                disabled
                style={{ flex: 1 / 2 }}
              />
            )}
          />
        </View>

        <View style={{ gap: verticalScale(7) }}>
          <Controller
            control={personalControl}
            name="nationality"
            rules={{ required: 'Nationality is required' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <CustomDropDownList
                errors={error?.message}
                title="Select Nationality"
                value={value === '' ? null : value}
                data={nationalities}
                handleSelect={onChange}
                keyExtractor={item => item.value.toString()}
                showSearch={true}
                searchPlaceholder="Search nationality..."
              />
            )}
          />

          <Controller
            control={personalControl}
            name="nationality"
            render={({ field: { value } }) => (
              <CustomOptionList
                items={nationalities}
                value={value}
                onPress={i => {
                  setValue('nationality', i.value, { shouldValidate: true });
                }}
                length={4}
                column={4}
              />
            )}
          />
        </View>

        <Controller
          control={personalControl}
          name="drivingLicenseValid"
          rules={{
            validate: value =>
              isDrivingLicenseValid ||
              'You must confirm your driving license is valid',
          }}
          render={({ field: { value } }) => (
            <View>
              <CustomCheckBox
                label="My Driving licence is above 1 year old and issued in UAE."
                value={isDrivingLicenseValid}
                onChange={checked => {
                  setIsDrivingLicenseValid(checked);
                  setValue('drivingLicenseValid', checked, {
                    shouldValidate: true,
                  });
                }}
              />
              {personalErrors.drivingLicenseValid && (
                <Text style={styles.errorText}>
                  {personalErrors.drivingLicenseValid.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={personalControl}
          name="dateOfIssue"
          rules={{
            required: 'Policy Issue Date is required',
            validate: value => {
              if (!value) return 'Policy Issue Date is required';
              const issueDate = new Date(value);
              const today = new Date();
              if (issueDate > today)
                return 'Policy Issue Date cannot be in the future';
              return true;
            },
          }}
          render={({ field: { value }, fieldState: { error } }) => (
            <View>
              <TouchableOpacity
                style={[styles.datePickerButton, error && styles.errorBorder]}
                onPress={() => setPolicyIssueDateModalOpen(true)}
              >
                <Text style={styles.datePickerLabel}>Policy Issue Date</Text>
                <Text
                  style={[
                    styles.datePickerText,
                    !value && styles.placeholderText,
                  ]}
                >
                  {value ? moment(value).format('DD-MM-YYYY') : 'Select date'}
                </Text>
                <Calender />
              </TouchableOpacity>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={personalControl}
          name="yearOfNoClaim"
          rules={{ required: 'Year of no claim is required' }}
          render={({ field: { value }, fieldState: { error } }) => (
            <View>
              <CustomDropDownList
                title="Year of No Claim"
                value={value}
                data={claimOptions}
                handleSelect={val => {
                  setValue('yearOfNoClaim', val, { shouldValidate: true });
                  updateClamDetails(val);
                }}
                keyExtractor={item => item.value.toString()}
                showSearch={claimOptions.length > 6}
                searchPlaceholder="Search year of no claim..."
                absolute
                errors={error?.message}
              />
            </View>
          )}
        />

        <CustomCheckBox
          label="My current insurance is Comprehensive"
          value={isComprehensive}
          onChange={val => {
            setIsComprehensive(val);
            updateIsComprehensiveInsurance(val);
          }}
        />

        <CustomCheckBox
          label="My current insurance is still active (not expired)"
          value={isCurrentInsuranceActive}
          onChange={val => {
            setIsCurrentInsuranceActive(val);
            updateIsActiveInsurance(val);
          }}
        />

        <Text style={styles.title}>
          Please review the details below so we start looking for the best
          quote.
        </Text>

        <Controller
          control={personalControl}
          name="carValue"
          rules={{
            required: 'Car value is required',
            validate: value => {
              const numValue = Number(value);
              if (isNaN(numValue)) {
                return 'Please enter a valid number';
              }
              if (minCarValue > 0 && numValue < minCarValue) {
                return `Minimum value is ${minCarValue} AED`;
              }
              if (maxCarValue > 0 && numValue > maxCarValue) {
                return `Maximum value is ${maxCarValue} AED`;
              }
              if (numValue <= 0) {
                return 'Car value must be greater than 0';
              }
              return true;
            },
          }}
          render={({ field: { value }, fieldState: { error } }) => (
            <View>
              <CustomSingleSlider
                sliderWidth={300}
                min={minCarValue || 1000}
                max={maxCarValue || 500000}
                step={100}
                initialValue={value || defaultCarValue}
                onValueChange={newValue => {
                  setValue('carValue', newValue, { shouldValidate: true });
                }}
                theme={theme}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={personalControl}
          name="confirmDeclaration"
          rules={{
            validate: value =>
              value === true || 'You must confirm the declaration',
          }}
          render={({ field: { value }, fieldState: { error } }) => (
            <View>
              <CustomCheckBox
                label="I hereby confirm that my declaration of no claim is accurate, and I can provide written proof upon request."
                onChange={checked => {
                  setValue('confirmDeclaration', checked, {
                    shouldValidate: true,
                  });
                }}
                value={value}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />
      </View>

      <DatePickerModal
        visible={personalModalOpen}
        maxDate={new Date()}
        initialDate={
          dob ||
          (personalControl._formValues.dateOfBirth
            ? new Date(personalControl._formValues.dateOfBirth)
            : new Date(new Date().setFullYear(new Date().getFullYear() - 25)))
        }
        onClose={() => setPersonalModalOpen(false)}
        onConfirm={handlePersonalDobConfirm}
      />

      <DatePickerModal
        visible={policyIssueDateModalOpen}
        maxDate={new Date()}
        initialDate={
          policyIssueDate ||
          (personalControl._formValues.dateOfIssue
            ? new Date(personalControl._formValues.dateOfIssue)
            : new Date())
        }
        onClose={() => setPolicyIssueDateModalOpen(false)}
        onConfirm={handlePolicyIssueDateConfirm}
      />

      <CustomButton
        title="Next"
        onPress={handlePersonalSubmit(onSubmitPersonalDetails)}
        isShowIcon
        buttonStyle={styles.nextButton}
      />

      <DatePickerModal
        visible={policyModalOpen}
        initialDate={policyStartDate}
        onClose={() => setPolicyModalOpen(false)}
        minDate={new Date()}
        onConfirm={selectedDate => {
          setPolicyStartDate(selectedDate);
          updatePolicyDetails(selectedDate);
          setPolicyModalOpen(false);
        }}
      />
    </ScrollView>
  );
};

export default MotorInsuranceWizard;

const style = theme =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: verticalScale(15),
    },
    title: {
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
      fontSize: verticalScale(16),
    },
    subtitle: {
      color: theme.colors.description,
      textAlign: 'center',
      fontSize: verticalScale(14),
      marginVertical: verticalScale(10),
    },
    errorText: {
      fontSize: verticalScale(12),
      marginTop: verticalScale(5),
      color: theme.colors.red,
      marginLeft: verticalScale(5),
    },
    errorBorder: {
      borderColor: theme.colors.red,
    },
    optionBox: {
      gap: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      padding: verticalScale(14),
      borderColor: theme.colors.border,
      borderRadius: verticalScale(5),
      backgroundColor: theme.colors.backgroundColor,
      marginVertical: verticalScale(5),
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
      backgroundColor: theme.colors.lightPrimary,
    },
    optionTitle: {
      fontWeight: '700',
      fontSize: verticalScale(15),
      fontFamily: 'Inter',
      color: theme.colors.primary,
      flex: 1,
    },
    optionText: {
      fontWeight: '400',
      fontSize: verticalScale(15),
      fontFamily: 'Inter',
      color: theme.colors.text,
    },
    orText: {
      fontWeight: '700',
      fontSize: verticalScale(15),
      fontFamily: 'Inter',
      color: theme.colors.primary,
      textAlign: 'center',
      marginVertical: verticalScale(10),
    },
    nextButton: {
      marginTop: verticalScale(30),
      width: '50%',
      alignSelf: 'center',
    },
    dateAgeContainer: {
      flexDirection: 'row',
      gap: verticalScale(15),
      alignItems: 'flex-start',
    },
    datePickerButton: {
      height: verticalScale(50),
      flex: 1,
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: verticalScale(15),
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: theme.colors.backgroundColor,
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
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(14),
    },
    placeholderText: {
      color: theme.colors.description,
    },
  });
