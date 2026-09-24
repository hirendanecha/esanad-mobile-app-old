import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { pick, types } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';
import dayjs from 'dayjs';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import { useAuthStore } from '@store/authStore';
import EditInput from '@components/ui/EditInput';
import DatePickerModal from '@components/ui/CustomDatePicker';
import Header from '@components/ui/Header';
import {
  useProfile,
  useUpdateProfile,
  useUploadEmiratesId,
  useUploadDrivingLicense,
  useRemoveEmiratesId,
  useRemoveDrivingLicense,
  useVerifyEmiratesId,
  useVerifyDrivingLicense,
  useUploadProfilePic,
} from '@hooks/profile/useProfile';
import LinearGradient from 'react-native-linear-gradient';
import { env } from '@config/index';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ageCalculator } from '@utils/ageCalculator';
import OrDivider from '@components/ui/OrDivider';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SCREEN_NAMES } from '@constants/screenNames';

// ICONS
import Policy from '@assets/icons/Policy';
import Insurance from '@assets/icons/Insurance';
import Active from '@assets/icons/Active';
import Proposals from '@assets/icons/Proposals';
import Crown from '@assets/NEWICONS/Crown';
import ReferScreen from '../../REFER/ReferScreen';
import CustomButton from '@components/ui/CustomButton';
import MyPolicies from '@assets/NEWICONS/MyPolicies';
import MyClaims from '@assets/NEWICONS/MyClaims';
import MyRenewals from '@assets/NEWICONS/MyRenewals';
import MyQuotes from '@assets/NEWICONS/MyQuotes';
import MyPrivilege from '@assets/NEWICONS/MyPrivilege';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const DocumentUploadSection = ({
  docType,
  status,
  isLoading,
  file,
  theme,
  styles,
  onPress,
  onDelete,
}) => {
  const error = status === 'error';
  const fileUri = file;

  return (
    <View style={{ marginBottom: verticalScale(15) }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.documentTitle}>{docType.label}</Text>
        <TouchableOpacity
          style={{
            borderRadius: moderateScale(15),
            padding: moderateScale(5),
          }}
          activeOpacity={0.8}
          onPress={onDelete}
        >
          <Icon name="trash-2" size={moderateScale(18)} color={theme.colors.red} />
        </TouchableOpacity>
      </View>
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
        disabled={fileUri != null ? true : false}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.uploadContent}>
          {fileUri ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              {fileUri.includes('pdf') ||
                fileUri.toLowerCase().endsWith('.pdf') ? (
                <View style={styles.imagePreviewContainer}>
                  <Pdf
                    trustAllCerts={false}
                    source={{ uri: fileUri, cache: true }}
                    style={styles.imagePreview}
                    singlePage={true}
                  />
                </View>
              ) : (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: fileUri }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                </View>
              )}

            </View>
          ) : (
            <>
              <Ionicons
                name="cloud-upload-outline"
                size={25}
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
          <View style={styles.statusIndicator}>
            <Text style={[styles.statusText, { color: theme.colors.primary }]}>
              Uploaded
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const EditProfileForm = ({
  control,
  watch,
  theme,
  styles,
  bottom,
  onSubmit,
  openDatePicker,
  handleEmiratesIdChange,
  emiratesDocument,
  drivingDocument,
  documentStatus,
  validationLoader,
  handleDocumentPick,
  handleDeleteDocument,
  showDatePicker,
  closeDatePicker,
  handleDateConfirm,
}) => {
  console.log('--=-====', bottom);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom }]}
    >
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="mobileNumber"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="Phone Number"
              placeholder="5XXXXXXXX"
              value={value}
              prefix="+971"
              onChangeText={onChange}
              keyboardType="phone-pad"
              maxLength={9}
              canEdit={true}
            />
          )}
        />
      </View>

      <OrDivider simple />
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="Full Name"
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              canEdit={true}
            />
          )}
        />
      </View>

      <OrDivider simple />
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="emiratesId"
          render={({ field: { value } }) => (
            <EditInput
              title="Emirates ID"
              placeholder="784-XXXX-XXXXXXX-X"
              value={value}
              onChangeText={handleEmiratesIdChange}
              canEdit={true}
            />
          )}
        />
      </View>

      <OrDivider simple />
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <EditInput
              title="Email Address"
              value={value}
              disabled={true}
              canEdit={true}
            />
          )}
        />
      </View>

      <OrDivider simple />
      <View
        style={[
          styles.inputGroup,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { value } }) => (
            <View style={styles.dobAgeContainer}>
              <View
                style={{
                  gap:
                    Platform.OS === 'ios'
                      ? verticalScale(3)
                      : verticalScale(12),
                }}
              >
                <Text style={styles.dobAgeLabel}>Date of Birth and Age</Text>
                <View style={styles.dobAgeValueContainer}>
                  <Text style={styles.datePickerText}>
                    {value ? dayjs(value).format('DD/MM/YYYY') : 'Select Date'}{' '}
                    | {ageCalculator(watch('dateOfBirth')) || 'Age'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={openDatePicker}
              >
                <Icon
                  name="edit-3"
                  size={moderateScale(18)}
                  color={theme.colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <OrDivider simple />

      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="Gender"
              placeholder="e.g. Male"
              value={value}
              onChangeText={onChange}
              canEdit={true}
            />
          )}
        />
      </View>
      <OrDivider simple />
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="maritalStatus"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="Marital Status"
              placeholder="e.g. Single"
              value={value}
              onChangeText={onChange}
              canEdit={true}
            />
          )}
        />
      </View>
      <OrDivider simple />

      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="nationality"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="Nationality"
              placeholder="e.g. Indian"
              value={value}
              onChangeText={onChange}
              canEdit={true}
            />
          )}
        />
      </View>
      <OrDivider simple />
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="City"
              placeholder="e.g. Dubai"
              value={value}
              onChangeText={onChange}
              canEdit={true}
            />
          )}
        />
      </View>
      <OrDivider simple />

      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="occupation"
          render={({ field: { onChange, value } }) => (
            <EditInput
              title="Occupation"
              placeholder="e.g. Software Engineer"
              value={value}
              onChangeText={onChange}
              canEdit={true}
            />
          )}
        />
      </View>
      <OrDivider simple />

      <DatePickerModal
        visible={showDatePicker}
        initialDate={new Date()}
        onClose={closeDatePicker}
        onConfirm={handleDateConfirm}
        maxDate={moment().subtract(18, 'years').toDate()}
      />

      <View style={styles.documentsCard}>
        <View style={styles.documentsContent}>
          <Text style={styles.documentsMainTitle}>Documents</Text>
          <DocumentUploadSection
            docType={{
              key: 'emiratesId',
              label: 'Emirates ID',
              type: [types.pdf, types.images],
            }}
            status={documentStatus.emiratesId}
            isLoading={validationLoader.emiratesId}
            file={emiratesDocument}
            theme={theme}
            styles={styles}
            onPress={() =>
              handleDocumentPick('emiratesId', [types.pdf, types.images])
            }
            onDelete={() => handleDeleteDocument('emiratesId')}
          />
          <DocumentUploadSection
            docType={{
              key: 'drivingLicense',
              label: 'Driving License',
              type: [types.pdf, types.images],
            }}
            status={documentStatus.drivingLicense}
            isLoading={validationLoader.drivingLicense}
            file={drivingDocument}
            theme={theme}
            styles={styles}
            onPress={() =>
              handleDocumentPick('drivingLicense', [types.pdf, types.images])
            }
            onDelete={() => handleDeleteDocument('drivingLicense')}
          />
        </View>
      </View>
      <CustomButton
        title="Update Profile"
        onPress={onSubmit}
        buttonStyle={{
          alignSelf: 'center',
          width: '70%',
        }}
      />
    </ScrollView>
  );
};

const MyeSanadTab = ({ theme, styles_tab }) => {
  const navigation = useNavigation();
  const menuItems = [
    {
      title: 'My Policies',
      subtitle: 'Managed your policies, download policy schedules & Invoices',
      icon: <MyPolicies />,
      screen: SCREEN_NAMES.ACTIVE_POLICY,
    },
    {
      title: 'My Claims',
      subtitle: 'Fastest & easiest way to register motor insurance claims',
      icon: <MyClaims />,
      screen: SCREEN_NAMES.CLAIM_POLICY,
    },
    {
      title: 'My Renewal',
      subtitle: 'Renew your motor insurance with special discount',
      icon: <MyRenewals />,
      screen: SCREEN_NAMES.EXPIRED_POLICY,
    },
    {
      title: 'My Quotations',
      subtitle: 'Find out all incomplete quotations, edit, & complete process',
      icon: <MyQuotes />,
      screen: SCREEN_NAMES.QUOTATION_SCREEN,
    },
    {
      title: 'My Privilege Card & Loyalty Program',
      subtitle:
        'Get your privilege card and explore our loyalty reward program',
      icon: <MyPrivilege />,
      screen: SCREEN_NAMES.LOYALTY_POINTS,
    },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: verticalScale(20),
          paddingBottom: verticalScale(60),
          gap: verticalScale(15),
          flexGrow: 1,
        }}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles_tab.card,
              {
                height: verticalScale(90),
              },
            ]}
            activeOpacity={0.8}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <View
              style={[
                styles_tab.iconContainer,
                index == 3 && {
                  height: verticalScale(52),
                  width: verticalScale(52),
                  padding: verticalScale(6),
                },
              ]}
            >
              {item.icon}
            </View>
            <View style={styles_tab.textContainer}>
              <Text style={styles_tab.cardTitle}>{item.title}</Text>
              <Text style={styles_tab.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const EditProfile = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const styles_tab = getTabStyles(theme);
  const navigation = useNavigation();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: getProfile } = useProfile();
  const { user, setUserDetailsUpdate } = useAuthStore();
  const insets = useSafeAreaInsets();

  const { mutate: uploadEmiratesId } = useUploadEmiratesId();
  const { mutate: uploadDrivingLicense } = useUploadDrivingLicense();
  const { mutate: verifyEmiratesId } = useVerifyEmiratesId();
  const { mutate: verifyDrivingLicense } = useVerifyDrivingLicense();
  const { mutate: uploadProfilePic } = useUploadProfilePic();
  const { mutate: removeEmiratesId } = useRemoveEmiratesId();
  const { mutate: removeDrivingLicense } = useRemoveDrivingLicense();

  const [emiratesDocument, setEmiratesDocument] = useState(null);
  const [drivingDocument, setDrivingDocument] = useState(null);
  const [emiratesRefPath, setEmiratesRefPath] = useState(null);
  const [drivingRefPath, setDrivingRefPath] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validationLoader, setValidationLoader] = useState({});
  const [documentStatus, setDocumentStatus] = useState({});
  const [countryCode, setCountryCode] = useState('971');

  const { control, handleSubmit, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: user?.fullName || '',
      mobileNumber: user?.mobileNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      email: user?.email || '',
      emiratesId: user?.emiratesId || '',
      gender: user?.gender || '',
      maritalStatus: user?.maritalStatus || '',
      nationality: user?.nationality || '',
      city: user?.city || '',
      occupation: user?.occupation || '',
    },
  });

  useEffect(() => {
    if (user) {
      Object.keys(user).forEach(key => {
        if (typeof user[key] === 'string' || typeof user[key] === 'number') {
          setValue(key, user[key] || '');
        }
      });
      if (user.countryCode) setCountryCode(user.countryCode);
      if (user.emiratesIdP?.path)
        setEmiratesDocument(env.API_URL + user.emiratesIdP.path);
      if (user.drivingLicenseP?.path)
        setDrivingDocument(env.API_URL + user.drivingLicenseP.path);
    }
  }, [user, setValue]);

  const handleEmiratesIdChange = text => {
    let digits = text.replace(/\D/g, '');
    let masked = '';
    if (digits.length > 0) masked += digits.substring(0, 3);
    if (digits.length > 3) masked += '-' + digits.substring(3, 7);
    if (digits.length > 7) masked += '-' + digits.substring(7, 14);
    if (digits.length > 14) masked += '-' + digits.substring(14, 15);
    setValue('emiratesId', masked);
  };

  const handleDocumentPick = async (docKey, docType) => {
    try {
      const result = await pick({ type: docType, allowMultiSelection: false });
      const file = result[0];
      handleValidationCheck(docKey, [file]);
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled')
        Alert.alert('Error', 'Failed to pick file');
    }
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
      },
      drivingLicense: {
        verifyFn: verifyDrivingLicense,
        uploadFn: uploadDrivingLicense,
        uploadKey: 'drivingLicense',
      },
    };
    const currentDoc = docConfig[docKey];
    if (!currentDoc) return;

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
        currentDoc.uploadFn(
          { id: user?._id, data: uploadFormData },
          {
            onSuccess: res => {
              setDocumentStatus(prev => ({ ...prev, [docKey]: 'uploaded' }));
              setValidationLoader(prev => ({ ...prev, [docKey]: false }));
              const path = res?.data?.data?.[docKey + 'P']?.path;
              if (docKey === 'emiratesId') {
                setEmiratesDocument(env.API_URL + path);
                setEmiratesRefPath(path);
              } else {
                setDrivingDocument(env.API_URL + path);
                setDrivingRefPath(path);
              }
              getProfile();
            },
            onError: () => {
              setDocumentStatus(prev => ({ ...prev, [docKey]: 'error' }));
              setValidationLoader(prev => ({ ...prev, [docKey]: false }));
            },
          },
        );
      },
      onError: () => {
        Alert.alert('Error', 'Verification failed');
        setDocumentStatus(prev => ({ ...prev, [docKey]: 'error' }));
        setValidationLoader(prev => ({ ...prev, [docKey]: false }));
      },
    });
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
        uploadProfilePic(formData, { onSuccess: () => getProfile() });
      }
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled')
        console.log('Picker error:', err);
    }
  };

  const handleDeleteDocument = docKey => {

    if (docKey === 'emiratesId') {
      removeEmiratesId(
        { id: user?._id },
        {
          onSuccess: () => {
            setEmiratesDocument(null);
            setEmiratesRefPath(null);
            setDocumentStatus(prev => ({ ...prev, [docKey]: null }));
            getProfile();
          },
        }
      );
    } else if (docKey === 'drivingLicense') {
      removeDrivingLicense(
        { id: user?._id },
        {
          onSuccess: () => {
            setDrivingDocument(null);
            setDrivingRefPath(null);
            setDocumentStatus(prev => ({ ...prev, [docKey]: null }));
            getProfile();
          },
        }
      );
    }
  };

  const onSubmit = data => {
    try {
      const updatedData = {
        ...data,
        countryCode,
        mobile: `${countryCode}${data.mobileNumber}`,
        emiratesIdP: emiratesRefPath || user?.emiratesIdP?.path,
        drivingLicenseP: drivingRefPath || user?.drivingLicenseP?.path || '',
        profilePic: user?.profilePic?.documentUrl,
      };
      updateProfile(updatedData, {
        onSuccess: () => {
          getProfile();
          setUserDetailsUpdate(false);
        },
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const getBottomMargin = () => {
    if (Platform.OS === 'ios') {
      return verticalScale(insets.bottom + 10);
    }
    return insets.bottom > 25
      ? verticalScale(insets.bottom + 10)
      : verticalScale(24);
  };

  console.log('=-=-=-=-=-=-=', getBottomMargin(), insets.bottom);

  return (
    <View style={styles.container}>
      <Header title="Profile" onBack={() => navigation.goBack()} />

      <View style={styles.userSummary}>
        <TouchableOpacity
          style={styles.avatarSection}
          onPress={handleImagePick}
          activeOpacity={0.8}
        >
          {user?.profilePic?.documentUrl ? (
            <>
              {console.log(user?.profilePic?.documentUrl)}
              <Image
                source={{ uri: user?.profilePic?.documentUrl }}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </>
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={14} color={theme.colors.white} />
          </View>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userNameText}>{user?.fullName || 'User'}!</Text>
          <Text style={styles.userEmailText}>
            {user?.email || 'email@example.com'}
          </Text>
          <View style={styles.referralRow}>
            <Text style={styles.referralLabel}>Share your referral code</Text>
            <View style={styles.referralBadge}>
              <Text style={styles.referralCode}>
                {(user?.referralCode || 'ESANAD2360').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: verticalScale(14),
            fontFamily: 'Lato-Bold',
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarStyle: {
            shadowColor: theme.colors.text,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 2,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          },
          sceneStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
        }}
      >
        <Tab.Screen name="My eSanad">
          {() => <MyeSanadTab theme={theme} styles_tab={styles_tab} />}
        </Tab.Screen>
        <Tab.Screen name="Refer">
          {() => <ReferScreen hideHeader={true} />}
        </Tab.Screen>
        <Tab.Screen name="My Profile">
          {() => (
            <EditProfileForm
              control={control}
              watch={watch}
              theme={theme}
              insets={insets}
              bottom={getBottomMargin()}
              styles={styles}
              onSubmit={handleSubmit(onSubmit)}
              openDatePicker={() => setShowDatePicker(true)}
              handleEmiratesIdChange={handleEmiratesIdChange}
              emiratesDocument={emiratesDocument}
              drivingDocument={drivingDocument}
              documentStatus={documentStatus}
              validationLoader={validationLoader}
              handleDocumentPick={handleDocumentPick}
              handleDeleteDocument={handleDeleteDocument}
              showDatePicker={showDatePicker}
              closeDatePicker={() => setShowDatePicker(false)}
              handleDateConfirm={date => {
                setShowDatePicker(false);
                setValue('dateOfBirth', dayjs(date).format('YYYY-MM-DD'));
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const getTabStyles = theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: verticalScale(15),
    },
    iconContainer: {
      width: verticalScale(50),
      height: verticalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: { flex: 1, gap: verticalScale(5) },
    cardTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    cardSubtitle: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      lineHeight: verticalScale(16),
    },
  });

const getStyles = theme =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundColor },
    scrollContent: {
      paddingTop: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
    },
    userSummary: {
      flexDirection: 'row',
      paddingHorizontal: verticalScale(20),
      paddingVertical: verticalScale(20),
      alignItems: 'center',
    },
    avatarSection: { marginRight: verticalScale(15) },
    profileImage: {
      width: verticalScale(90),
      height: verticalScale(90),
      borderRadius: verticalScale(50),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    profilePlaceholder: {
      width: verticalScale(90),
      height: verticalScale(90),
      borderRadius: verticalScale(50),
      backgroundColor: theme.colors.floorBgColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    profilePlaceholderText: {
      fontSize: verticalScale(30),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
    cameraIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.bgSecondary,
      padding: 5,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    userInfo: { flex: 1, gap: verticalScale(3) },
    userNameText: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textTransform: 'capitalize',
      marginBottom: verticalScale(3),
    },
    userEmailText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    referralRow: { flexDirection: 'row', alignItems: 'center' },
    referralLabel: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
      marginRight: 5,
    },
    referralBadge: {
      backgroundColor: theme.colors.highlight,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    referralCode: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
      color: '#000',
    },
    inputGroup: { paddingHorizontal: 20, marginBottom: verticalScale(5) },
    dobAgeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: Platform.OS === 'ios' ? 'flex-start' : 'center',
      paddingVertical: verticalScale(10),
      paddingHorizontal: verticalScale(20),
      paddingBottom: Platform.OS === 'ios' ? 0 : verticalScale(13),
    },
    dobAgeLabel: {
      fontSize: verticalScale(13),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    dobAgeValueContainer: { marginTop: verticalScale(5) },
    datePickerText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    datePickerButton: {
      padding: verticalScale(5),
      marginTop: verticalScale(20),
    },
    documentsCard: {
      margin: verticalScale(20),
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: verticalScale(15),
      borderRadius: verticalScale(15),
    },
    documentsContent: {},
    documentsMainTitle: {
      fontSize: verticalScale(18),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginBottom: verticalScale(15),
    },
    documentTitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      marginBottom: verticalScale(8),
    },
    uploadButton: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 10,
      padding: verticalScale(20),
      backgroundColor: 'rgba(0,0,0,0.02)',
      borderColor: theme.colors.border,
    },
    uploadContent: { alignItems: 'center' },
    uploadTextContainer: { alignItems: 'center', marginTop: 10 },
    uploadDescription: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    browseText: { color: theme.colors.primary, fontFamily: 'Lato-Bold' },
    fileFormatInfo: {
      fontSize: verticalScale(10),
      color: theme.colors.textTertiary,
      marginTop: 4,
    },
    imagePreviewContainer: {
      width: '100%',
      height: verticalScale(150),
      borderRadius: 8,
      overflow: 'hidden',
    },
    imagePreview: { width: '100%', height: '100%' },
    statusIndicator: { marginTop: 10, alignItems: 'center' },
    statusText: { fontSize: verticalScale(12), fontFamily: 'Lato-Bold' },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: verticalScale(15),
      borderRadius: 10,
      alignItems: 'center',
      marginTop: verticalScale(30),
    },
    saveButtonText: {
      color: theme.colors.white,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
  });

export default EditProfile;
