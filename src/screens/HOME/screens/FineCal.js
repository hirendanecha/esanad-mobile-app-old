import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';

import Header from '@components/ui/Header';
import DatePickerModal from '@components/ui/CustomDatePicker';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomButton from '@components/ui/CustomButton';

import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';
import { useGetHealthInsuranceFine } from '@hooks/HEALTH/healthFlow/useHealthFlow';

import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useGetFinecalculationtool } from '@hooks/home/useHomeFlow';

const eligibleCountries = [
  'Andorra',
  'Australia',
  'Albania',
  'Argentina',
  'Armenia',
  'Austria',
  'Brunei',
  'Bahamas Islands',
  'Barbados',
  'Belarus',
  'Belgium',
  'Bosnia',
  'Brazil',
  'Bulgaria',
  'Canada',
  'China',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Cyprus',
  'Denmark',
  'El Salvador',
  'Estonia',
  'Fiji',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Greece',
  'Hong Kong',
  'Honduras',
  'Hungary',
  'Iceland',
  'Israel',
  'Italy',
  'Japan',
  'Kiribati',
  'Kosovo',
  'Kazakhstan',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Maldives',
  'Malta',
  'Mexico',
  'Montenegro',
  'Malaysia',
  'Mauritius',
  'Monaco',
  'Mongolia',
  'Nauru',
  'New Zealand',
  'Ireland',
  'Singapore',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Holy See (Vatican City State)',
  'Netherlands',
  'Norway',
  'Paraguay',
  'Peru',
  'Poland',
  'Portugal',
  'Romania',
  'Russian Federation',
  'Saint Vincent and the Grenadines',
  'San Marino',
  'Serbia',
  'Seychelles',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Uruguay',
  'Uzbekistan',
];

const visaStatusOptions = [
  { label: 'Renewal (COC)', value: 'Renewal (COC)' },
  { label: 'New', value: 'New' },
  { label: 'Change status (Visit Visa)', value: 'Change status (Visit Visa)' },
  {
    label: 'Change status (Tourist Visa)',
    value: 'Change status (Tourist Visa)',
  },
  { label: 'Change status (COC)', value: 'Change status (COC)' },
  {
    label: 'Change status (Cancelled Visa)',
    value: 'Change status (Cancelled Visa)',
  },
];

const FineCal = ({ open, setOpen }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const navigation = useNavigation();

  const formDataRef = useRef(null);
  const { data: nationalList = [] } = useGetNationalList();

  const [resModal, setResModal] = useState(false);
  const [apiRes, setApiRes] = useState(null);
  const [isEligibleCountry, setIsEligibleCountry] = useState(false);

  const [insExpStartDateModalOpen, setInsExpStartDateModalOpen] =
    useState(false);
  const [entryStampDateModalOpen, setEntryStampDateModalOpen] = useState(false);
  const [changeStatusDateModalOpen, setChangeStatusDateModalOpen] =
    useState(false);
  const [currentInsExpiryDateModalOpen, setCurrentInsExpiryDateModalOpen] =
    useState(false);
  const { mutate: getFinecalculationtool } = useGetFinecalculationtool();

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      insExpStartDate: '',
      nationality: '',
      currentInsExpiryDate: '',
      isEligible: false,
      entryStampDate: '',
      changeStatusDate: '',
      visaStatus: '',
    },
  });

  const nationality = watch('nationality');
  const visaStatus = watch('visaStatus');
  const insExpStartDate = watch('insExpStartDate');
  const currentInsExpiryDate = watch('currentInsExpiryDate');
  const entryStampDate = watch('entryStampDate');
  const changeStatusDate = watch('changeStatusDate');

  const nationalityOptions = nationalList.map(n => ({ label: n, value: n }));

  const validateForm = data => {
    let isValid = true;

    if (!data.visaStatus) {
      setError('visaStatus', {
        type: 'manual',
        message: 'Visa status is required',
      });
      isValid = false;
    }

    if (!data.nationality) {
      setError('nationality', {
        type: 'manual',
        message: 'Nationality is required',
      });
      isValid = false;
    }

    if (!data.insExpStartDate) {
      setError('insExpStartDate', {
        type: 'manual',
        message: 'Insurance start date is required',
      });
      isValid = false;
    }

    if (
      data.visaStatus === 'Renewal (COC)' ||
      data.visaStatus === 'Change status (COC)'
    ) {
      if (!data.currentInsExpiryDate) {
        setError('currentInsExpiryDate', {
          type: 'manual',
          message: 'Current insurance expiry date is required',
        });
        isValid = false;
      }
    }

    if (data.visaStatus === 'New' && !isEligibleCountry) {
      if (!data.entryStampDate) {
        setError('entryStampDate', {
          type: 'manual',
          message: 'Entry stamp date is required',
        });
        isValid = false;
      }
    }

    if (
      (data.visaStatus === 'New' && isEligibleCountry) ||
      data.visaStatus === 'Change status (Tourist Visa)' ||
      data.visaStatus === 'Change status (Cancelled Visa)' ||
      data.visaStatus === 'Change status (Visit Visa)'
    ) {
      if (!data.changeStatusDate) {
        setError('changeStatusDate', {
          type: 'manual',
          message: 'Change status date is required',
        });
        isValid = false;
      }
    }

    return isValid;
  };

  useEffect(() => {
    if (eligibleCountries.includes(nationality)) {
      setIsEligibleCountry(true);
      setValue('isEligible', true);
    } else {
      setIsEligibleCountry(false);
      setValue('isEligible', false);
    }

    if (nationality) {
      setValue('currentInsExpiryDate', '');
      setValue('insExpStartDate', '');
      setValue('entryStampDate', '');
      setValue('changeStatusDate', '');
    }
  }, [nationality, setValue]);

  useEffect(() => {
    if (visaStatus) {
      setValue('currentInsExpiryDate', '');
      setValue('insExpStartDate', '');
      setValue('entryStampDate', '');
      setValue('changeStatusDate', '');

      clearErrors([
        'currentInsExpiryDate',
        'entryStampDate',
        'changeStatusDate',
      ]);
    }
  }, [visaStatus, setValue, clearErrors]);

  const onSubmit = data => {
    clearErrors();

    if (!validateForm(data)) {
      return;
    }

    const payload = {
      nationality: data.nationality,
      visaStatus: data.visaStatus,
      currentInsExpiryDate: data.currentInsExpiryDate
        ? new Date(data.currentInsExpiryDate).toISOString()
        : '',
      insExpStartDate: data.insExpStartDate
        ? new Date(data.insExpStartDate).toISOString()
        : '',
      entryStampDate: data.entryStampDate
        ? new Date(data.entryStampDate).toISOString()
        : '',
      changeStatusDate: data.changeStatusDate
        ? new Date(data.changeStatusDate).toISOString()
        : '',
    };

    console.log('payload', payload);

    // these is importanat don't remove this
    getFinecalculationtool(payload, {
      onSuccess: res => {
        console.log('res --- >>>', res);

        setApiRes(res?.data?.data);
      },
      onError: err => {
        console.error('Error getting fine:', err);
      },
    });
  };

  const handlePayFine = () => {
    Linking.openURL('https://www.tamm.abudhabi/');
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const showCurrentInsExpiryDate =
    visaStatus === 'Renewal (COC)' || visaStatus === 'Change status (COC)';

  const showEntryStampDate = visaStatus === 'New' && !isEligibleCountry;

  const showChangeStatusDate =
    (visaStatus === 'New' && isEligibleCountry) ||
    visaStatus === 'Change status (Tourist Visa)' ||
    visaStatus === 'Change status (Cancelled Visa)' ||
    visaStatus === 'Change status (Visit Visa)';

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Health Fine Calculator" onBack={handleClose} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>
              Health Insurance Fine Calculator UAE
            </Text>
            <Text style={styles.subtitle}>
              Enter your visa and insurance details below to calculate any
              fines.
            </Text>
            <Text style={styles.description}>
              Health insurance is mandatory in the UAE, and failure to maintain
              valid coverage can result in daily fines. This health insurance
              fine calculator helps UAE residents quickly estimate DHA and
              federal insurance penalties.
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.section}>
              <Controller
                control={control}
                name="nationality"
                rules={{
                  required: 'Nationality is required',
                }}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropDownList
                      title="Nationality"
                      value={field.value}
                      data={nationalityOptions}
                      handleSelect={v => {
                        field.onChange(v);
                        clearErrors('nationality');
                      }}
                      errors={fieldState.error?.message}
                      absolute
                    />
                    {field.value && isEligibleCountry && (
                      <View style={styles.eligibilityBadge}>
                        <Text style={styles.eligibilityText}>
                          {field.value} is eligible for Visit visa
                        </Text>
                      </View>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.section}>
              <Controller
                control={control}
                name="visaStatus"
                rules={{
                  required: 'Visa status is required',
                }}
                render={({ field, fieldState }) => (
                  <CustomDropDownList
                    title="Current visa status in the UAE"
                    value={field.value}
                    data={visaStatusOptions}
                    handleSelect={v => {
                      field.onChange(v);
                      clearErrors('visaStatus');
                    }}
                    errors={fieldState.error?.message}
                    showSearch={false}
                    absolute
                  />
                )}
              />
            </View>

            {visaStatus && (
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="insExpStartDate"
                  rules={{
                    required: 'Insurance start date is required',
                    validate: value => {
                      if (!value) return 'Insurance start date is required';
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <View>
                      <TouchableOpacity
                        style={[
                          styles.datePickerButton,
                          fieldState.error && styles.errorBorder,
                        ]}
                        onPress={() => setInsExpStartDateModalOpen(true)}
                      >
                        <Text style={styles.datePickerLabel}>
                          New Insurance Start Date
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
                      </TouchableOpacity>
                      {fieldState.error && (
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            )}

            {showEntryStampDate && (
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="entryStampDate"
                  rules={{
                    required: 'Entry stamp date is required',
                    validate: value => {
                      if (!value) return 'Entry stamp date is required';
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <View>
                      <TouchableOpacity
                        style={[
                          styles.datePickerButton,
                          fieldState.error && styles.errorBorder,
                        ]}
                        onPress={() => setEntryStampDateModalOpen(true)}
                      >
                        <Text style={styles.datePickerLabel}>
                          Entry Stamp Date
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
                      </TouchableOpacity>
                      {fieldState.error && (
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            )}

            {showChangeStatusDate && (
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="changeStatusDate"
                  rules={{
                    required: 'Change status date is required',
                    validate: value => {
                      if (!value) return 'Change status date is required';
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <View>
                      <TouchableOpacity
                        style={[
                          styles.datePickerButton,
                          fieldState.error && styles.errorBorder,
                        ]}
                        onPress={() => setChangeStatusDateModalOpen(true)}
                      >
                        <Text style={styles.datePickerLabel}>
                          Change Status Date
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
                      </TouchableOpacity>
                      {fieldState.error && (
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            )}

            {showCurrentInsExpiryDate && (
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="currentInsExpiryDate"
                  rules={{
                    required: 'Current insurance expiry date is required',
                    validate: value => {
                      if (!value)
                        return 'Current insurance expiry date is required';
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <View>
                      <TouchableOpacity
                        style={[
                          styles.datePickerButton,
                          fieldState.error && styles.errorBorder,
                        ]}
                        onPress={() => setCurrentInsExpiryDateModalOpen(true)}
                      >
                        <Text style={styles.datePickerLabel}>
                          Current/Last Insurance Expiry
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
                      </TouchableOpacity>
                      {fieldState.error && (
                        <Text style={styles.errorText}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            )}

            <CustomButton
              title={'Get Fine Amount'}
              onPress={handleSubmit(onSubmit)}
              isShowIcon
            />

            {apiRes !== null && (
              <View style={styles.modalContent}>
                {insExpStartDate && (
                  <Text style={styles.modalText}>
                    New insurance start:{' '}
                    {moment(insExpStartDate).format('DD-MM-YYYY')}
                  </Text>
                )}

                {currentInsExpiryDate && (
                  <Text style={styles.modalText}>
                    Current insurance expiry:{' '}
                    {moment(currentInsExpiryDate).format('DD-MM-YYYY')}
                  </Text>
                )}

                <Text style={styles.fineAmount}>Fine Amount: AED {apiRes}</Text>

                <CustomButton title="Pay Fine" onPress={handlePayFine} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={insExpStartDateModalOpen}
        minDate={new Date()}
        initialDate={insExpStartDate ? new Date(insExpStartDate) : new Date()}
        onClose={() => setInsExpStartDateModalOpen(false)}
        onConfirm={date => {
          setValue('insExpStartDate', date.toISOString(), {
            shouldValidate: true,
          });
          setInsExpStartDateModalOpen(false);
        }}
      />

      <DatePickerModal
        visible={entryStampDateModalOpen}
        maxDate={new Date()}
        initialDate={entryStampDate ? new Date(entryStampDate) : new Date()}
        onClose={() => setEntryStampDateModalOpen(false)}
        onConfirm={date => {
          setValue('entryStampDate', date.toISOString(), {
            shouldValidate: true,
          });
          setEntryStampDateModalOpen(false);
        }}
      />

      <DatePickerModal
        visible={changeStatusDateModalOpen}
        maxDate={new Date()}
        initialDate={changeStatusDate ? new Date(changeStatusDate) : new Date()}
        onClose={() => setChangeStatusDateModalOpen(false)}
        onConfirm={date => {
          setValue('changeStatusDate', date.toISOString(), {
            shouldValidate: true,
          });
          setChangeStatusDateModalOpen(false);
        }}
      />

      <DatePickerModal
        visible={currentInsExpiryDateModalOpen}
        initialDate={
          currentInsExpiryDate ? new Date(currentInsExpiryDate) : new Date()
        }
        onClose={() => setCurrentInsExpiryDateModalOpen(false)}
        onConfirm={date => {
          setValue('currentInsExpiryDate', date.toISOString(), {
            shouldValidate: true,
          });
          setCurrentInsExpiryDateModalOpen(false);
        }}
      />
    </LinearGradient>
  );
};

export default FineCal;

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: verticalScale(30),
      flexGrow: 1,
    },
    content: {
      padding: moderateScale(15),
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: verticalScale(30),
    },
    title: {
      fontSize: verticalScale(24),
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: verticalScale(10),
      marginBottom: verticalScale(10),
      fontFamily: 'Lato-Bold',
    },
    subtitle: {
      fontSize: verticalScale(14),
      color: theme.colors.discription,
      textAlign: 'center',
      marginBottom: verticalScale(10),
      fontFamily: 'Lato-Regular',
    },
    description: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      textAlign: 'center',
      lineHeight: verticalScale(22),
      fontFamily: 'Lato-Regular',
    },
    formSection: {
      gap: verticalScale(20),
    },
    section: {
      gap: verticalScale(10),
    },
    eligibilityBadge: {
      backgroundColor: 'rgba(96, 23, 111, 0.1)',
      padding: verticalScale(10),
      borderRadius: verticalScale(6),
      marginTop: verticalScale(8),
    },
    eligibilityText: {
      color: theme.colors.primary,
      fontSize: verticalScale(13),
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
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
      left: verticalScale(10),
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
    errorBorder: {
      borderColor: theme.colors.red,
    },
    errorText: {
      marginTop: verticalScale(4),
      fontSize: moderateScale(13),
      color: theme.colors.red,
      fontFamily: 'Lato-Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(20),
    },
    modalContent: {
      alignItems: 'center',
    },
    modalText: {
      fontSize: verticalScale(16),
      color: theme.colors.text,
      marginTop: verticalScale(12),
      textAlign: 'center',
      fontFamily: 'Lato-Regular',
    },
    fineAmount: {
      fontSize: verticalScale(22),
      fontWeight: '700',
      color: theme.colors.primary,
      marginVertical: verticalScale(20),
      fontFamily: 'Lato-Bold',
    },
    payButton: {
      width: '100%',
      marginTop: verticalScale(10),
    },
    closeButton: {
      marginTop: verticalScale(12),
      padding: verticalScale(8),
    },
    closeButtonText: {
      fontSize: verticalScale(14),
      color: theme.colors.textSecondary,
      fontFamily: 'Lato-Regular',
    },
  });
