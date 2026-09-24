import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import CustomButton from '@components/ui/CustomButton';
import { pick, types } from '@react-native-documents/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useVerifyCarRegistration,
  useVerifyDrivingLicense,
  useVerifyEmiratesId,
  useVerifyPoliceReport,
  useExtractEmiratesId,
  useExtractDrivingLicense,
  useExtractPoliceReport,
} from '@hooks/policy/useMotorClaim';
import {
  useUploademiratesid,
  useUploaddrivinglicense,
  useUploadvehicledocuments,
  useUploadItVehicleDocuments,
} from '@hooks/policy/useMotorPolicy';

import { SCREEN_NAMES } from '@constants/screenNames';
import { env } from '@config/index';

const MotorDocumentUpload = () => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();
  const route = useRoute();
  const { claimData } = route.params || {};

  const [documents, setDocuments] = useState({
    registrationCard: null,
    drivingLicense: null,
    emiratesId: null,
    policeReport: null,
  });

  const [statuses, setStatuses] = useState({
    registrationCard: 'idle', // idle, loading, uploaded, error
    drivingLicense: 'idle',
    emiratesId: 'idle',
    policeReport: 'idle',
  });

  const { mutate: verifyReg } = useVerifyCarRegistration();
  const { mutate: verifyLicense } = useVerifyDrivingLicense();
  const { mutate: verifyId } = useVerifyEmiratesId();
  const { mutate: verifyPolice } = useVerifyPoliceReport();

  const { mutate: uploadEmirates } = useExtractEmiratesId();
  const { mutate: uploadLicense } = useExtractDrivingLicense();
  const { mutate: uploadReg } = useUploadItVehicleDocuments();
  const { mutate: uploadPolice } = useExtractPoliceReport();

  const handleDocumentPick = async key => {
    try {
      const result = await pick({
        type: [types.images, types.pdf],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        const file = result[0];
        uploadAndVerify(key, file);
      }
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled') {
        console.log('Picker error:', err);
      }
    }
  };

  const uploadAndVerify = (key, file) => {
    setStatuses(prev => ({ ...prev, [key]: 'loading' }));

    const formData = new FormData();
    formData.append('files', {
      uri: file.uri || file.fileCopyUri,
      type: file.type || 'image/jpeg',
      name: file.name || `${key}_${Date.now()}.jpg`,
    });

    const verifyFns = {
      registrationCard: verifyReg,
      drivingLicense: verifyLicense,
      emiratesId: verifyId,
      policeReport: verifyPolice,
    };

    // Note: some upload endpoints require { carId, data } while others just require data directly.
    const uploadFns = {
      registrationCard: {
        fn: uploadReg,
        key: 'registrationCard',
        needsCarId: false,
        extraData: { documentType: 'registrationCard', isCarCreate: 'false' },
      },
      drivingLicense: {
        fn: uploadLicense,
        key: 'drivingLicense',
        needsCarId: false,
      },
      emiratesId: { fn: uploadEmirates, key: 'emiratesId', needsCarId: false },
      policeReport: {
        fn: uploadPolice,
        key: 'policeReport',
        needsCarId: false,
      },
    };

    const verifyFn = verifyFns[key];
    const uploadConfig = uploadFns[key];

    if (!verifyFn) {
      setStatuses(prev => ({ ...prev, [key]: 'error' }));
      return;
    }

    verifyFn(formData, {
      onSuccess: res => {
        console.log(`${key} verify response:`, res);
        if (res?.data?.data?.text) {
          if (uploadConfig) {
            const uploadFormData = new FormData();
            const textObj = res?.data?.data?.text;

            if (uploadConfig.key === 'registrationCard') {
              if (textObj) {
                Object.keys(textObj).forEach(k => {
                  uploadFormData.append(
                    `text[${k}]`,
                    JSON.stringify(textObj[k]),
                  );
                });
              }
            } else {
              uploadFormData.append('text', JSON.stringify(textObj));
            }

            if (uploadConfig.extraData) {
              Object.keys(uploadConfig.extraData).forEach(k => {
                uploadFormData.append(k, uploadConfig.extraData[k]);
              });
            }

            uploadFormData.append(uploadConfig.key, {
              uri: file.uri || file.fileCopyUri,
              type: file.type || 'image/jpeg',
              name: file.name || `${key}_${Date.now()}.jpg`,
            });

            const payload = uploadConfig.needsCarId
              ? {
                  carId: claimData?.carId?._id || claimData?.carId || '',
                  data: uploadFormData,
                }
              : uploadFormData;

            uploadConfig.fn(payload, {
              onSuccess: uploadRes => {
                console.log(`${key} upload response:`, uploadRes);

                setStatuses(prev => ({ ...prev, [key]: 'uploaded' }));
                const path =
                  env.API_URL + uploadRes?.data?.fileUrl?.path ||
                  env.API_URL + uploadRes?.data?.fileUrl?.documentUrl;

                setDocuments(prev => ({
                  ...prev,
                  [key]: path ? { ...file, serverPath: path } : file,
                }));
              },
              onError: () => setStatuses(prev => ({ ...prev, [key]: 'error' })),
            });
          } else {
            // For documents where there's no unique upload step before final submission
            setStatuses(prev => ({ ...prev, [key]: 'uploaded' }));
            const serverDocPath =
              res?.data?.fileUrl?.path ||
              res?.data?.fileUrl?.documentUrl ||
              res?.data?.data?.[`${key}P`]?.path ||
              res?.data?.data?.documentUrl?.path ||
              res?.data?.data?.path;
            setDocuments(prev => ({
              ...prev,
              [key]: serverDocPath
                ? { ...file, serverPath: serverDocPath }
                : file,
            }));
          }
        } else {
          setStatuses(prev => ({ ...prev, [key]: 'error' }));
        }
      },
      onError: () => {
        setStatuses(prev => ({ ...prev, [key]: 'error' }));
      },
    });
  };

  const isAllUploaded =
    statuses.registrationCard === 'uploaded' &&
    statuses.drivingLicense === 'uploaded' &&
    statuses.emiratesId === 'uploaded' &&
    statuses.policeReport === 'uploaded';

  const handleNext = () => {
    navigation.navigate(SCREEN_NAMES.CLAIM_PREVIEW, {
      claimData: { ...claimData, documents },
    });
  };

  const renderUploader = (label, key) => {
    const status = statuses[key];
    const file = documents[key];

    return (
      <View style={styles.uploaderContainer}>
        <Text style={styles.uploaderLabel}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.uploadBox,
            status === 'uploaded' && styles.successBox,
            status === 'error' && styles.errorBox,
          ]}
          onPress={() => handleDocumentPick(key)}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={30} color={theme.colors.primary} />
              <Text style={styles.uploadText}>Verifying...</Text>
            </View>
          ) : file ? (
            <View style={styles.filePreview}>
              <Ionicons
                name="document-text"
                size={30}
                color={theme.colors.primary}
              />
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.colors.primary}
              />
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons
                name="cloud-upload-outline"
                size={30}
                color={theme.colors.textTertiary}
              />
              <Text style={styles.uploadText}>
                Tap to upload (PDF, PNG, JPG)
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Document Upload" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Document Upload</Text>
          <Text style={styles.subtitle}>
            Please upload the required documents to process your claim.
          </Text>
        </View>

        <View style={styles.grid}>
          {renderUploader('Registration Card', 'registrationCard')}
          {renderUploader('Driving License', 'drivingLicense')}
          {renderUploader('Emirates ID', 'emiratesId')}
          {renderUploader('Police Report', 'policeReport')}
        </View>

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={!isAllUploaded}
          buttonStyle={styles.nextButton}
          isShowIcon
        />
      </ScrollView>
    </LinearGradient>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: moderateScale(20),
      paddingBottom: verticalScale(40),
    },
    headerSection: {
      marginBottom: verticalScale(24),
    },
    title: {
      fontSize: verticalScale(24),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      marginBottom: verticalScale(8),
    },
    subtitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      lineHeight: verticalScale(20),
    },
    grid: {
      gap: verticalScale(16),
    },
    uploaderContainer: {
      gap: verticalScale(8),
    },
    uploaderLabel: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    uploadBox: {
      height: verticalScale(100),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: 12,
      backgroundColor: theme.colors.floorBgColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    successBox: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
      borderStyle: 'solid',
    },
    errorBox: {
      borderColor: theme.colors.red,
      backgroundColor: theme.colors.red + '10',
      borderStyle: 'solid',
    },
    uploadPlaceholder: {
      alignItems: 'center',
      gap: verticalScale(4),
    },
    uploadText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    loadingContainer: {
      alignItems: 'center',
      gap: verticalScale(4),
    },
    filePreview: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: moderateScale(16),
      gap: moderateScale(12),
      width: '100%',
    },
    fileName: {
      flex: 1,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    nextButton: {
      marginTop: verticalScale(32),
    },
  });

export default MotorDocumentUpload;
