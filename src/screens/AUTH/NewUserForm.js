import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';

import { moderateScale, verticalScale } from '@constants/metrics';
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';

import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import DatePickerModal from '@components/ui/CustomDatePicker';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';
import CustomRadioIcon from '@components/ui/CustomRadioIcon';
import CustomButton from '@components/ui/CustomButton';
import MainHeader from '@components/ui/MainHeader';

import { useGetNationalList } from '@hooks/motorflow/useMotorFlowTop';
import { useUpdateProfile } from '@hooks/profile/useProfile';

import { ageCalculator } from '@utils/ageCalculator';
import { useThemeContext } from '@theme/ThemeProvider';

import Calender from '@assets/icons/Calender';
import Male from '@assets/svg/Male';
import Female from '@assets/svg/Female';
import Married from '@assets/svg/Married';
import LinearGradient from 'react-native-linear-gradient';
import { pick, types } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { env } from '@config/index';
import { useAuthStore } from '@store/authStore';
import {
  useProfile,
  useUploadEmiratesId,
  useUploadDrivingLicense,
  useVerifyEmiratesId,
  useVerifyDrivingLicense,
  useUploadProfilePic,
} from '@hooks/profile/useProfile';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useUserStore } from '@store/userStore';
import Header from '@components/ui/Header';

const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Emirates ID is required',
  EMIRATES_ID_INVALID: 'Please enter a valid Emirates ID',
  MUST_START_WITH_784: 'Emirates ID must start with 784',
  EMIRATES_DOC_REQUIRED: 'Emirates ID document is required',
  DRIVING_DOC_REQUIRED: 'Driving License document is required',
  PROFILE_PIC_REQUIRED: 'Profile picture is required',
};

const validateEmiratesId = value => {
  if (!value) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!value.startsWith('784')) {
    return ERROR_MESSAGES.MUST_START_WITH_784;
  }

  const regex = /^\d{3}-\d{4}-\d{7}-\d{1}$|^\d{15}$/;
  if (!regex.test(value)) {
    return ERROR_MESSAGES.EMIRATES_ID_INVALID;
  }

  return true;
};

const maskEmiratesId = value => {
  let digits = value.replace(/\D/g, '');

  if (
    digits.length > 0 &&
    !'784'.startsWith(digits.substring(0, Math.min(digits.length, 3)))
  ) {
    // Optional
  }

  let masked = '';
  if (digits.length > 0) {
    masked += digits.substring(0, 3);
  }
  if (digits.length > 3) {
    masked += '-' + digits.substring(3, 7);
  }
  if (digits.length > 7) {
    masked += '-' + digits.substring(7, 14);
  }
  if (digits.length > 14) {
    masked += '-' + digits.substring(14, 15);
  }

  return masked;
};

const NewUserForm = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data: nationalList = [] } = useGetNationalList();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: getProfile } = useProfile();
  const { user, setUserDetailsUpdate } = useAuthStore();
  const { contactNumber, emiratesId: storedEmiratesId } = useUserStore();
  const { mutate: uploadEmiratesId } = useUploadEmiratesId();
  const { mutate: uploadDrivingLicense } = useUploadDrivingLicense();
  const { mutate: verifyEmiratesId } = useVerifyEmiratesId();
  const { mutate: verifyDrivingLicense } = useVerifyDrivingLicense();
  const { mutate: uploadProfilePic } = useUploadProfilePic();

  // Document state
  const [emiratesDocument, setEmiratesDocument] = useState(null);
  const [drivingDocument, setDrivingDocument] = useState(null);
  const [validationLoader, setValidationLoader] = useState({});
  const [documentStatus, setDocumentStatus] = useState({});

  // Standalone field states
  const [emiratesId, setEmiratesId] = useState(storedEmiratesId || '');
  const [emiratesIdPath, setEmiratesIdPath] = useState('');
  const [drivingLicensePath, setDrivingLicensePath] = useState('');
  const [profilePicPath, setProfilePicPath] = useState('');

  // Error states
  const [emiratesIdError, setEmiratesIdError] = useState('');
  const [emiratesDocError, setEmiratesDocError] = useState('');
  const [drivingDocError, setDrivingDocError] = useState('');
  const [profilePicError, setProfilePicError] = useState('');

  const [dobModalOpen, setDobModalOpen] = useState(false);
  const [selectedDob, setSelectedDob] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      mobileNumber: contactNumber || '',
      email: '',
      dateOfBirth: '',
      age: 0,
      gender: 'Male',
      maritalStatus: 'Single',
      occupation: '',
      nationality: '',
      city: '',
    },
    mode: 'onChange',
  });

  const nationalityOptions = useMemo(
    () => nationalList?.map(n => ({ label: n, value: n })) || [],
    [nationalList],
  );

  const genderOptions = useMemo(
    () => [
      { value: 'Male', label: 'Male', icon: <Male /> },
      { value: 'Female', label: 'Female', icon: <Female /> },
    ],
    [],
  );

  const genderValue = watch('gender');
  const fullName = watch('fullName');

  const maritalOptions = useMemo(
    () => [
      {
        value: 'Single',
        label: 'Single',
        icon: genderValue === 'Male' ? <Male /> : <Female />,
      },
      { value: 'Married', label: 'Married', icon: <Married /> },
    ],
    [genderValue],
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

  // Handle Emirates ID change
  const handleEmiratesIdChange = text => {
    const masked = maskEmiratesId(text);
    setEmiratesId(masked);
    if (emiratesIdError) {
      setEmiratesIdError('');
    }
  };

  // Validate Emirates ID
  const validateEmiratesIdField = () => {
    const result = validateEmiratesId(emiratesId);
    if (result !== true) {
      setEmiratesIdError(result);
      return false;
    }
    setEmiratesIdError('');
    return true;
  };

  const handleValidationCheck = async (docKey, files = []) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', {
        uri: file.uri || file.fileCopyUri,
        type: file.type || 'image/jpeg',
        name: file.name || `file_${Date.now()}.jpg`,
      });
    });

    setValidationLoader(prev => ({ ...prev, [docKey]: true }));

    const docConfig = {
      emiratesId: {
        verifyFn: verifyEmiratesId,
        uploadFn: uploadEmiratesId,
        uploadKey: 'emiratesId',
        getId: () => user?._id,
      },
      drivingLicense: {
        verifyFn: verifyDrivingLicense,
        uploadFn: uploadDrivingLicense,
        uploadKey: 'drivingLicense',
        getId: () => user?._id,
      },
    };

    const currentDoc = docConfig[docKey];

    if (!currentDoc) {
      setValidationLoader(prev => ({ ...prev, [docKey]: false }));
      return;
    }

    currentDoc.verifyFn(formData, {
      onSuccess: res => {
        const uploadFormData = new FormData();
        uploadFormData.append('text', JSON.stringify(res?.data?.data?.text));

        files.forEach(file => {
          uploadFormData.append(currentDoc.uploadKey, {
            uri: file.uri || file.fileCopyUri,
            type: file.type || 'image/jpeg',
            name: file.name || `file_${Date.now()}.jpg`,
          });
        });

        const targetId = currentDoc.getId();

        currentDoc.uploadFn(
          {
            id: targetId,
            data: uploadFormData,
          },
          {
            onSuccess: res => {
              setDocumentStatus(prev => ({ ...prev, [docKey]: 'uploaded' }));
              setValidationLoader(prev => ({ ...prev, [docKey]: false }));

              if (docKey === 'emiratesId') {
                const docPath = res?.data?.data?.emiratesIdP?.path;
                const emiratesIdValue = res?.data?.data?.emiratesId;

                setEmiratesDocument(env.API_URL + docPath);
                setEmiratesIdPath(docPath);
                setEmiratesId(emiratesIdValue);
                setEmiratesDocError('');
              } else if (docKey === 'drivingLicense') {
                const docPath = res?.data?.data?.drivingLicenseP?.path;

                setDrivingDocument(env.API_URL + docPath);
                setDrivingLicensePath(docPath);
                setDrivingDocError('');
              }
              getProfile();
            },
            onError: () => {
              setDocumentStatus(prev => ({ ...prev, [docKey]: 'error' }));
              setValidationLoader(prev => ({ ...prev, [docKey]: false }));

              if (docKey === 'emiratesId') {
                setEmiratesDocError('Failed to upload Emirates ID document');
              } else if (docKey === 'drivingLicense') {
                setDrivingDocError('Failed to upload Driving License document');
              }
            },
          },
        );
      },
      onError: () => {
        setDocumentStatus(prev => ({ ...prev, [docKey]: 'error' }));
        setValidationLoader(prev => ({ ...prev, [docKey]: false }));

        if (docKey === 'emiratesId') {
          setEmiratesDocError('Failed to verify Emirates ID document');
        } else if (docKey === 'drivingLicense') {
          setDrivingDocError('Failed to verify Driving License document');
        }
      },
    });
  };

  const handleDocumentPick = async (docKey, docType) => {
    try {
      const result = await pick({
        type: docType,
        allowMultiSelection: false,
      });

      const file = result[0];
      handleValidationCheck(docKey, [file]);
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled') {
        console.log('Error', 'Failed to pick file', err);
      }
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await pick({
        type: types.images,
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        const file = result[0];

        const formData = new FormData();
        formData.append('profilePic', {
          uri: file.uri || file.fileCopyUri,
          type: file.type || 'image/jpeg',
          name: file.name || `profile_${Date.now()}.jpg`,
        });
        formData.append('userId', user?._id);

        uploadProfilePic(formData, {
          onSuccess: res => {
            getProfile();
            if (res?.data?.data?.profilePic?.documentUrl) {
              const picUrl = res?.data?.data?.profilePic?.documentUrl;
              setProfilePicPath(picUrl);
              setProfilePicError('');
            }
          },
          onError: error => {
            console.log('Error in uploadProfilePic', error);
            setProfilePicError('Failed to upload profile picture');
          },
        });
      }
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled') {
        console.log('Picker error:', err);
      }
    }
  };

  const renderDocumentUpload = (docType, index) => {
    const status = documentStatus[docType.key];
    const isLoading = validationLoader[docType.key] || false;
    const error = documentStatus[docType.key] === 'error';
    const file =
      docType.key === 'emiratesId' ? emiratesDocument : drivingDocument;
    const files = file ? [file] : [];

    return (
      <View key={index} style={styles.documentContainer}>
        <Text style={styles.documentTitle}>{docType.label}</Text>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            {
              borderColor: error
                ? theme.colors.red
                : status === 'uploaded'
                ? theme.colors.primary
                : theme.colors.border,
            },
          ]}
          onPress={() => handleDocumentPick(docType.key, docType.type)}
        >
          <View style={styles.uploadContent}>
            {files.length > 0 ? (
              files[0]?.toLowerCase().endsWith('.pdf') ? (
                <View style={styles.imagePreviewContainer}>
                  <Pdf
                    source={{
                      uri: files[0],
                      cache: true,
                    }}
                    trustAllCerts={false}
                    style={styles.imagePreview}
                    singlePage={true}
                  />
                </View>
              ) : (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{
                      uri: files[0],
                    }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                </View>
              )
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color={
                    isLoading ? theme.colors.primary : theme.colors.textTertiary
                  }
                />
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadDescription}>
                    Drag and Drop your files, or{' '}
                    <Text style={styles.browseText}>Browse file</Text>
                  </Text>
                  <Text style={styles.fileFormatInfo}>
                    JPEG, PNG, PDF formats, up to 5MB
                  </Text>
                </View>
              </>
            )}
          </View>

          {status === 'uploaded' && !isLoading && (
            <View style={[styles.statusIndicator]}>
              <Text
                style={[styles.statusText, { color: theme.colors.primary }]}
              >
                Uploaded
              </Text>
            </View>
          )}
          {error && !isLoading && (
            <View style={[styles.statusIndicator]}>
              <Text style={[styles.statusText, { color: theme.colors.red }]}>
                Error
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Validate all standalone fields before submit
  const validateStandaloneFields = () => {
    let isValid = true;

    // Validate Emirates ID
    // if (!validateEmiratesIdField()) {
    //   isValid = false;
    // }

    // Validate Emirates ID Document
    // if (!emiratesIdPath) {
    //   setEmiratesDocError(ERROR_MESSAGES.EMIRATES_DOC_REQUIRED);
    //   isValid = false;
    // }

    // Uncomment if Driving License is required
    // if (!drivingLicensePath) {
    //   setDrivingDocError(ERROR_MESSAGES.DRIVING_DOC_REQUIRED);
    //   isValid = false;
    // }

    // Uncomment if Profile Picture is required
    // if (!profilePicPath) {
    //   setProfilePicError(ERROR_MESSAGES.PROFILE_PIC_REQUIRED);
    //   isValid = false;
    // }

    return isValid;
  };

  const onSubmit = data => {
    // Validate standalone fields
    if (!validateStandaloneFields()) {
      return;
    }

    const payload = {
      ...data,
      mobileNumber: data.mobileNumber,
      emiratesId,
      emiratesIdP: emiratesIdPath,
      drivingLicenseP: drivingLicensePath,
      profilePic: profilePicPath,
    };

    console.log('payload', payload);

    updateProfile(payload, {
      onSuccess: res => {
        console.log('user details update res', res);
        setUserDetailsUpdate(false);
        navigation.replace(SCREEN_NAMES.BOTTOM_TABS);
      },
    });
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.mainContainer}
    >
      <Header
        title="Register"
        onBack={() => navigation.navigate(SCREEN_NAMES.BOTTOM_TABS)}
        transparent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formWrapper}>
          {/* Profile Picture */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={[styles.avatarContainer]}>
              {user?.profilePic?.documentUrl || profilePicPath ? (
                <Image
                  source={{
                    uri: user?.profilePic?.documentUrl || profilePicPath,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarPlaceholderText}>
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleImagePick}
                style={styles.cameraButton}
              >
                <Ionicons
                  name="camera"
                  size={verticalScale(20)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            </View>
            {profilePicError ? (
              <Text style={[styles.errorText, { textAlign: 'center' }]}>
                {profilePicError}
              </Text>
            ) : null}
          </View>

          {/* Mobile */}
          <Controller
            control={control}
            name="mobileNumber"
            rules={{
              required: 'Mobile number is required',
              minLength: { value: 9, message: 'At least 9 digits' },
            }}
            render={({ field }) => (
              <CountryPhoneInput
                value={field.value}
                onChange={({ phone }) => {
                  setValue('mobileNumber', phone, { shouldValidate: true });
                }}
                errors={errors.mobileNumber?.message}
              />
            )}
          />

          {/* Emirates ID - Using useState */}
          <FloatingLabelInput
            label="Emirates ID"
            value={emiratesId}
            onChangeText={handleEmiratesIdChange}
            onBlur={validateEmiratesIdField}
            error={emiratesIdError}
            placeholder="784-XXXX-XXXXXXX-X"
            maxLength={18}
            keyboardType="numeric"
            showErrorMessage
          />

          {/* Full Name */}
          <Controller
            control={control}
            name="fullName"
            rules={{ required: 'Full Name is required' }}
            render={({ field }) => (
              <FloatingLabelInput
                label="Full Name"
                placeholder="Enter your full name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.fullName?.message}
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
                placeholder="example@email.com"
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
            <View style={styles.flexOne}>
              <Controller
                control={control}
                name="dateOfBirth"
                rules={{ required: 'Date of Birth is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <TouchableOpacity
                      activeOpacity={1}
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
                  </>
                )}
              />
            </View>

            <Controller
              control={control}
              name="age"
              render={({ field }) => (
                <View style={styles.ageInputContainer}>
                  <FloatingLabelInput
                    label="Age"
                    value={String(field.value || '')}
                    disabled
                  />
                </View>
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

          {/* Occupation */}
          <Controller
            control={control}
            name="occupation"
            rules={{ required: 'Occupation is required' }}
            render={({ field }) => (
              <FloatingLabelInput
                label="Occupation"
                placeholder="Enter your occupation"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.occupation?.message}
                showErrorMessage
              />
            )}
          />

          {/* Nationality */}
          <Controller
            control={control}
            name="nationality"
            rules={{ required: 'Nationality is required' }}
            render={({ field, fieldState }) => (
              <View style={{ gap: verticalScale(10) }}>
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
                  notAlign
                  onPress={item => field.onChange(item.value)}
                />
              </View>
            )}
          />

          {/* City */}
          <Controller
            control={control}
            name="city"
            rules={{ required: 'City is required' }}
            render={({ field, fieldState }) => (
              <View style={{ gap: verticalScale(10) }}>
                <CustomDropDownList
                  title="Select City"
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
                  notAlign
                  length={4}
                  onPress={item => field.onChange(item.value)}
                />
              </View>
            )}
          />

          {/* Documents Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Documents</Text>

            {/* Emirates ID Document */}
            <View style={{ gap: verticalScale(5) }}>
              {renderDocumentUpload(
                {
                  key: 'emiratesId',
                  label: 'Emirates ID',
                  type: [types.pdf, types.images],
                },
                0,
              )}
              {emiratesDocError ? (
                <Text style={styles.errorText}>{emiratesDocError}</Text>
              ) : null}
            </View>

            {/* Driving License Document */}
            <View style={{ gap: verticalScale(5) }}>
              {renderDocumentUpload(
                {
                  key: 'drivingLicense',
                  label: 'Driving License',
                  type: [types.pdf, types.images],
                },
                1,
              )}
              {drivingDocError ? (
                <Text style={styles.errorText}>{drivingDocError}</Text>
              ) : null}
            </View>
          </View>

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

          <CustomButton
            title="Continue"
            isShowIcon
            onPress={handleSubmit(onSubmit)}
            customStyle={styles.submitButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default NewUserForm;

const createStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: verticalScale(40),
    },
    formWrapper: {
      paddingHorizontal: moderateScale(20),
      gap: verticalScale(20),
      paddingTop: verticalScale(20),
    },
    row: {
      flexDirection: 'row',
      gap: moderateScale(15),
      alignItems: 'flex-start',
    },
    flexOne: {
      flex: 1,
    },
    ageInputContainer: {
      width: moderateScale(100),
    },
    section: {
      gap: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor,
      padding: moderateScale(15),
      borderRadius: verticalScale(15),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
    errorText: {
      marginTop: verticalScale(4),
      fontSize: moderateScale(12),
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
      zIndex: 1,
      borderRadius: verticalScale(10),
    },
    datePickerText: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
    },
    placeholderText: {
      color: theme.colors.description,
    },
    submitButton: {
      marginTop: verticalScale(20),
    },
    // Upload UI Styles
    avatarContainer: {
      width: verticalScale(100),
      height: verticalScale(100),
      borderRadius: verticalScale(50),
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.floorBgColor,
      alignSelf: 'center',
      marginBottom: verticalScale(10),
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: verticalScale(50),
    },
    avatarPlaceholderText: {
      fontSize: verticalScale(34),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.bgSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(20),
      padding: verticalScale(5),
    },
    documentContainer: {},
    documentTitle: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      marginBottom: verticalScale(8),
    },
    uploadButton: {
      borderRadius: verticalScale(10),
      borderWidth: 1.5,
      borderStyle: 'dashed',
      height: verticalScale(120),
      justifyContent: 'center',
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    uploadContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(8),
    },
    imagePreviewContainer: {
      alignItems: 'center',
    },
    imagePreview: {
      width: verticalScale(90),
      height: verticalScale(90),
      borderRadius: verticalScale(8),
    },
    uploadTextContainer: {
      alignItems: 'center',
    },
    uploadDescription: {
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    browseText: {
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    fileFormatInfo: {
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(10),
      color: theme.colors.description,
    },
    statusIndicator: {
      position: 'absolute',
      bottom: verticalScale(5),
      right: verticalScale(10),
    },
    statusText: {
      fontSize: verticalScale(10),
      fontFamily: 'Lato-Bold',
    },
  });
