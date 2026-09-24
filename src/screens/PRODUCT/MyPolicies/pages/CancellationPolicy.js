import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useThemeContext } from '@theme/ThemeProvider';
import { useToast } from '@components/ui/Toast';
import WraperComponent from '@components/ui/WraperComponent';
import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import MainHeader from '@components/ui/MainHeader';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CustomButton from '@components/ui/CustomButton';
import MotorService from '@api/services/MotorService';
import { moderateScale, verticalScale } from '@constants/metrics';
import { pick, types } from '@react-native-documents/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
import {
  useVerifycarregistrationcard,
  useVerifyIban,
  useExtractIban,
  useVerifyInsuranceCertificate,
  useVerifyReversalInsurance,
  useVerifyOwnershipDocument,
  useCancelPolicyRequest,
  useUploadItVehicleDocuments,
  useScanInsuranceCertificate,
  useScanReversalInsurance,
} from '@hooks/policy/useMotorPolicy';
import LinearGradient from 'react-native-linear-gradient';
import { env } from '@config/index';
import { SCREEN_NAMES } from '@constants/screenNames';
import Header from '@components/ui/Header';

const selectOptions = [
  {
    label: 'New Owner, Existing Mulkiya',
    value: 'New Owner, Existing Mulkiya',
    requiredDoc: ['insuranceCertificate', 'registrationCard'],
  },
  {
    label: 'New Owner, New Mulkiya',
    value: 'New Owner, New Mulkiya',
    requiredDoc: ['registrationCard'],
  },
  {
    label: 'Sold out and cancelled',
    value: 'Sold out and cancelled',
    requiredDoc: ['reversalOfInsuranceCertificate', 'ownershipProofDocument'],
  },
];

const CancellationPolicy = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { showToast } = useToast();
  const route = useRoute();
  const policyData = route?.params?.policyData || {};

  const [selectedReason, setSelectedReason] = useState(null);
  const { mutateAsync: verifyRegCard } = useVerifycarregistrationcard();
  const { mutateAsync: verifyIban } = useVerifyIban();
  const { mutateAsync: extractIban } = useExtractIban();
  const { mutateAsync: verifyInsuranceCert } = useVerifyInsuranceCertificate();
  const { mutateAsync: verifyReversal } = useVerifyReversalInsurance();
  const { mutateAsync: verifyOwnership } = useVerifyOwnershipDocument();
  const { mutateAsync: cancelPolicy } = useCancelPolicyRequest();
  const { mutateAsync: uploadVehicleDoc } = useUploadItVehicleDocuments();
  const { mutateAsync: scanInsuranceCert } = useScanInsuranceCertificate();
  const { mutateAsync: scanReversal } = useScanReversalInsurance();

  const [documents, setDocuments] = useState({
    registrationCard: [],
    insuranceCertificate: [],
    ownershipProofDocument: [],
    reversalOfInsuranceCertificate: [],
    ibanCard: [],
  });
  const [docStatus, setDocStatus] = useState({
    registrationCard: null,
    insuranceCertificate: null,
    ownershipProofDocument: null,
    reversalOfInsuranceCertificate: null,
    ibanCard: null,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ibanNumber: '',
      accountHolderName: '',
      bankName: '',
      swiftCode: '',
      accountNumber: '',
      cancellationReason: '',
    },
  });

  const handlePickDocument = async (key, multiple = false) => {
    try {
      const result = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: multiple,
        copyTo: 'cachesDirectory',
      });

      if (result && result.length > 0) {
        const pickedFiles = result.map(res => ({
          uri: res.fileCopyUri || res.uri,
          type: res.type,
          name: res.name,
          size: res.size,
        }));

        // setDocuments(prev => ({
        //   ...prev,
        //   [key]: multiple ? [...prev[key], ...pickedFiles].slice(0, 2) : pickedFiles,
        // }));

        // Trigger validation/upload logic similar to web
        handleValidationCheck(key, pickedFiles);
      }
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled') {
        console.log('Document Picker Error:', err);
      }
    }
  };

  const deleteFile = (key, index) => {
    setDocuments(prev => {
      const updated = [...prev[key]];
      updated.splice(index, 1);
      return { ...prev, [key]: updated };
    });
    if (documents[key].length === 1) {
      setDocStatus(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleValidationCheck = async (key, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `file_${Date.now()}.jpg`,
      });
    });

    try {
      let response;
      if (key === 'registrationCard') {
        response = await verifyRegCard(formData);
        console.log('Verify Reg Card Response:', response?.data);
        const text =
          response?.data?.text ||
          response?.data?.data?.text ||
          response?.data?.data;
        if (text) await uploadFile(key, files, text);
      } else if (key === 'ibanCard') {
        response = await verifyIban(formData);
        console.log('Verify Iban Response:', response?.data);
        const resBody = response?.data;
        const text = resBody?.text || resBody?.data?.text || resBody?.data;
        const data = resBody?.data || resBody;

        if (data && typeof data === 'object') {
          if (data.ibanNumber)
            setValue('ibanNumber', data.ibanNumber, { shouldValidate: true });
          if (data.accountHolderName)
            setValue('accountHolderName', data.accountHolderName, {
              shouldValidate: true,
            });
          if (data.bankName)
            setValue('bankName', data.bankName, { shouldValidate: true });
          if (data.swiftCode !== undefined)
            setValue('swiftCode', data.swiftCode, { shouldValidate: true });
          if (data.accountNumber)
            setValue('accountNumber', data.accountNumber, {
              shouldValidate: true,
            });
        }

        if (text) await uploadFile(key, files, text);
      } else if (key === 'insuranceCertificate') {
        response = await verifyInsuranceCert(formData);
        console.log('Verify Insurance Cert Response:', response?.data);
        const text =
          response?.data?.text ||
          response?.data?.data?.text ||
          response?.data?.data;
        if (text) await uploadFile(key, files, text);
      } else if (key === 'ownershipProofDocument') {
        response = await verifyOwnership(formData);
        console.log('Verify Ownership Response:', response?.data);
        const text =
          response?.data?.text ||
          response?.data?.data?.text ||
          response?.data?.data;
        if (text) await uploadFile(key, files, text);
      } else if (key === 'reversalOfInsuranceCertificate') {
        response = await verifyReversal(formData);
        console.log('Verify Reversal Response:', response?.data);
        const text =
          response?.data?.text ||
          response?.data?.data?.text ||
          response?.data?.data;
        if (text) await uploadFile(key, files, text);
      }

      setDocStatus(prev => ({ ...prev, [key]: 'success' }));
    } catch (error) {
      console.log('Validation Error:', error);
      setDocStatus(prev => ({ ...prev, [key]: 'error' }));
    }
  };

  const uploadFile = async (key, files, text, responseData = null) => {
    const formData = new FormData();
    const fileName = files[0]?.name || 'file.pdf';
    formData.append(
      `text[${fileName}]`,
      typeof text === 'string' ? text : JSON.stringify(text),
    );

    // Handle specific document types based on web implementation
    if (key === 'registrationCard') {
      formData.append('documentType', 'registrationCard');
      formData.append('isCarCreate', 'false');
    } else if (key === 'reversalOfInsuranceCertificate') {
      formData.append('documentType', 'reversalOfInsuranceCertificate');
    } else if (key === 'ownershipProofDocument') {
      formData.append('documentType', 'ownershipProofDocument');
    }

    files.forEach(file => {
      // Key mapping for files based on web implementation
      let fileKey = key;
      if (key === 'ibanCard') fileKey = 'iban';
      else if (key === 'insuranceCertificate') fileKey = 'files';
      else if (key === 'reversalOfInsuranceCertificate') fileKey = 'files';

      formData.append(fileKey, {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || `file_${Date.now()}.pdf`,
      });
    });

    try {
      if (key === 'registrationCard' || key === 'ownershipProofDocument') {
        await uploadVehicleDoc(formData, {
          onSuccess: data => {
            const dataPath = data?.data?.fileUrl?.path;
            if (dataPath) {
              setDocuments(prev => ({
                ...prev,
                [key]: [
                  {
                    name: dataPath.split('/').pop(),
                    type: 'application/pdf',
                    uri: env.API_URL + dataPath,
                  },
                ],
              }));
            }
          },
        });
      } else if (key === 'ibanCard') {
        await extractIban(formData, {
          onSuccess: data => {
            const ibanData = data?.data?.data;
            setValue('ibanNumber', ibanData?.ibanNumber);
            setValue('accountHolderName', ibanData?.accountHolderName);
            setValue('bankName', ibanData?.bankName);
            setValue('swiftCode', ibanData?.swiftCode);
            setValue('accountNumber', ibanData?.accountNumber);
            const ibanDataFile = data?.data?.fileUrl?.path;

            setDocuments(prev => ({
              ...prev,
              ibanCard: [
                {
                  name: ibanDataFile?.split('/').pop(),
                  type: 'application/pdf',
                  uri: env.API_URL + ibanDataFile,
                },
              ],
            }));
          },
        });
      } else if (key === 'insuranceCertificate') {
        await scanInsuranceCert(formData, {
          onSuccess: data => {
            const insuranceDataFile = data?.data?.fileUrl?.path;
            console.log('------> insuranceDataFile', insuranceDataFile);

            setDocuments(prev => ({
              ...prev,
              insuranceCertificate: [
                {
                  name: insuranceDataFile?.split('/').pop(),
                  type: 'application/pdf',
                  uri: insuranceDataFile,
                },
              ],
            }));
          },
        });
      } else if (key === 'reversalOfInsuranceCertificate') {
        await scanReversal(formData, {
          onSuccess: data => {
            const reversalDataFile = data?.data?.fileUrl?.path;

            setDocuments(prev => ({
              ...prev,
              reversalOfInsuranceCertificate: [
                {
                  name: reversalDataFile?.split('/').pop(),
                  type: 'application/pdf',
                  uri: reversalDataFile,
                },
              ],
            }));
          },
        });
      }
    } catch (error) {
      console.log('Upload Error:', error);
    }
  };

  const onSubmit = async data => {
    const missingDocs = [];
    const reason = selectOptions.find(o => o.value === data.cancellationReason);

    if (reason) {
      reason.requiredDoc.forEach(docKey => {
        if (documents[docKey].length === 0) {
          missingDocs.push(docKey.replace(/([A-Z])/g, ' $1').toLowerCase());
        }
      });
    }
    if (documents.ibanCard.length === 0) missingDocs.push('iban card');

    if (missingDocs.length > 0) {
      showToast(`Please upload: ${missingDocs.join(', ')}`, 'error');
      return;
    }

    try {
      const formData = new FormData();
      const user = policyData?.userId || {};
      const car = policyData?.carId || {};

      formData.append('policyId', policyData?._id || '');
      formData.append('adminId', policyData?.adminId?._id || '');
      formData.append('ibanNumber', data.ibanNumber);
      formData.append('ibanAccountHolder', data.accountHolderName);
      formData.append('ibanBankName', data.bankName);
      formData.append('swiftCode', data.swiftCode);
      formData.append('accountNumber', data.accountNumber);

      formData.append(
        'emirate',
        car?.registrationEmirate || car?.emirate || '',
      );
      formData.append(
        'chassisNumber',
        car?.chassisNo || car?.chassisNumber || '',
      );
      formData.append('tcNumber', car?.tcNo || '');
      formData.append(
        'insuredName',
        user?.fullName || policyData?.InsuredName || '',
      );
      formData.append('mobile', user?.mobileNumber || user?.mobile || '');
      formData.append('email', user?.email || '');
      formData.append('gender', user?.gender || '');
      formData.append(
        'quoteId',
        policyData?.quoteId?._id || policyData?.quoteId || '',
      );
      formData.append(
        'policyIssueDate',
        policyData?.policyIssueDate || policyData?.DateOfIssue || '',
      );
      formData.append(
        'policyExpiryDate',
        policyData?.policyExpiryDate || policyData?.ExpiryDate || '',
      );
      formData.append('dateOfBirth', user?.dateOfBirth || '');
      formData.append('nationality', user?.nationality || '');
      formData.append('cancellationReason', data.cancellationReason);
      formData.append('age', user?.age || '');
      formData.append('paymentType', 'Credit Card');
      formData.append(
        'premium',
        policyData?.premium ||
          policyData?.quote?.response?.Offers[0]?.PolicyPremiumIncVAT ||
          policyData?.premiumWithVat ||
          '',
      );

      //  policyData?.premium ||
      //   policyData?.quote?.response?.Offers[0]
      //     ?.PolicyPremiumIncVAT ||
      //   policyData?.premiumWithVat || ""

      // Append files with specific field names for final request
      Object.keys(documents).forEach(key => {
        documents[key].forEach(file => {
          let fieldName = key;
          if (key === 'ibanCard') fieldName = 'iban';
          else if (key === 'ownershipProofDocument')
            fieldName = 'possessionCertificate';
          else if (key === 'reversalOfInsuranceCertificate')
            fieldName = 'reversalInsuranceCertificate';

          formData.append(fieldName, {
            uri: file.uri,
            type: file.type || 'application/pdf',
            name: file.name || `file_${Date.now()}.pdf`,
          });
        });
      });

      console.log('Final Form Data:', formData);
      await cancelPolicy(formData, {
        onSuccess: () => {
          navigation.replace(SCREEN_NAMES.THANKYOU_CANCEL_POLICY);
        },
      });
    } catch (error) {
      console.log('Submit Error:', error);
    }
  };

  const renderDocUploader = (key, label) => {
    const status = docStatus[key];
    const files = documents[key];
    const error = status === 'error';

    return (
      <View style={{ marginBottom: verticalScale(20) }}>
        <Text style={styles.documentTitle}>{label}</Text>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            {
              borderColor: error
                ? theme.colors.red
                : status === 'success'
                ? theme.colors.lableText
                : theme.colors.border,
            },
          ]}
          onPress={() => handlePickDocument(key)}
        >
          <View style={styles.uploadContent}>
            {files.length > 0 ? (
              <View style={styles.previewScroll}>
                {files.map((file, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    {file.type?.includes('pdf') ||
                    file.name?.toLowerCase().endsWith('.pdf') ? (
                      <Pdf
                        source={{ uri: file.uri, cache: true }}
                        style={styles.imagePreview}
                        trustAllCerts={false}
                        singlePage={true}
                      />
                    ) : (
                      <Image
                        source={{ uri: file.uri }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                    )}
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={e => {
                        e.stopPropagation();
                        deleteFile(key, index);
                      }}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={theme.colors.red}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                {files.length < 2 && (
                  <View style={[styles.imagePreview, styles.addMorePreview]}>
                    <Ionicons
                      name="add"
                      size={30}
                      color={theme.colors.primary}
                    />
                  </View>
                )}
              </View>
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color={theme.colors.primary}
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

          {status === 'success' && (
            <View style={styles.statusIndicator}>
              <Text
                style={[styles.statusText, { color: theme.colors.lableText }]}
              >
                Uploaded
              </Text>
            </View>
          )}
          {error && (
            <View style={styles.statusIndicator}>
              <Text style={[styles.statusText, { color: theme.colors.red }]}>
                Error
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
      style={{ flex: 1 }}
    >
      <Header
        title={'Cancellation Policy Request'}
        onBack={() => navigation.goBack()}
      />
      <WrapKeyboardAwareScrollView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.card}
          >
            <Controller
              control={control}
              name="cancellationReason"
              rules={{ required: 'Required' }}
              render={({ field: { onChange, value } }) => (
                <CustomDropDownList
                  title="Select Reason"
                  showSearch={false}
                  data={selectOptions}
                  value={value}
                  handleSelect={val => {
                    onChange(val);
                    setSelectedReason(selectOptions.find(o => o.value === val));
                    setDocuments(prev => ({
                      ...prev,
                      registrationCard: [],
                      insuranceCertificate: [],
                      ownershipProofDocument: [],
                      reversalOfInsuranceCertificate: [],
                    }));
                  }}
                  errors={errors.cancellationReason?.message}
                />
              )}
            />

            {selectedReason && (
              <View style={styles.docsSection}>
                <Text style={styles.sectionTitle}>{'Required Documents'}</Text>
                {selectedReason.requiredDoc.includes('registrationCard') &&
                  renderDocUploader(
                    'registrationCard',
                    'Car Registration Card',
                  )}
                {selectedReason.requiredDoc.includes('insuranceCertificate') &&
                  renderDocUploader(
                    'insuranceCertificate',
                    'Insurance Certificate',
                  )}
                {selectedReason.requiredDoc.includes(
                  'ownershipProofDocument',
                ) &&
                  renderDocUploader(
                    'ownershipProofDocument',
                    'Possession / Transfer Certificate',
                  )}
                {selectedReason.requiredDoc.includes(
                  'reversalOfInsuranceCertificate',
                ) &&
                  renderDocUploader(
                    'reversalOfInsuranceCertificate',
                    'Reversal Insurance Certificate',
                  )}
              </View>
            )}

            <Text style={styles.sectionTitle}>{'Account Details'}</Text>
            {renderDocUploader('ibanCard', 'IBAN Document')}

            <View style={styles.bankSection}>
              <Controller
                control={control}
                name="accountHolderName"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Account Holder Name"
                    value={value}
                    onChangeText={onChange}
                    error={errors.accountHolderName?.message}
                    showErrorMessage
                  />
                )}
              />
              <Controller
                control={control}
                name="bankName"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Bank Name"
                    value={value}
                    onChangeText={onChange}
                    error={errors.bankName?.message}
                    showErrorMessage
                  />
                )}
              />
              <Controller
                control={control}
                name="ibanNumber"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="IBAN Number"
                    value={value}
                    onChangeText={onChange}
                    error={errors.ibanNumber?.message}
                    showErrorMessage
                  />
                )}
              />
              <Controller
                control={control}
                name="accountNumber"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="Account Number"
                    value={value}
                    onChangeText={onChange}
                    error={errors.accountNumber?.message}
                    showErrorMessage
                  />
                )}
              />
              <Controller
                control={control}
                name="swiftCode"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, value } }) => (
                  <FloatingLabelInput
                    label="SWIFT Code"
                    value={value}
                    onChangeText={onChange}
                    error={errors.swiftCode?.message}
                    showErrorMessage
                  />
                )}
              />
            </View>

            <CustomButton
              title="Submit Request"
              onPress={handleSubmit(onSubmit)}
              buttonStyle={{ marginTop: verticalScale(30) }}
              isShowIcon
            />
          </ScrollView>
        </View>
      </WrapKeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default CancellationPolicy;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      margin: verticalScale(15),
      marginBottom: verticalScale(30),
    },
    card: {
      flexGrow: 1,
      padding: moderateScale(15),
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginBottom: verticalScale(15),
      marginTop: verticalScale(10),
    },
    docsSection: {
      marginTop: verticalScale(20),
    },
    documentTitle: {
      fontSize: moderateScale(12),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
      marginBottom: verticalScale(10),
    },
    uploadButton: {
      borderRadius: verticalScale(10),
      borderWidth: 2,
      borderStyle: 'dashed',
      minHeight: verticalScale(120),
      justifyContent: 'center',
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      padding: moderateScale(15),
    },
    uploadContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    uploadTextContainer: {
      alignItems: 'center',
      gap: verticalScale(5),
    },
    uploadDescription: {
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    browseText: {
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    fileFormatInfo: {
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(12),
      color: theme.colors.description,
    },
    statusIndicator: {
      position: 'absolute',
      bottom: verticalScale(5),
      right: verticalScale(10),
    },
    statusText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
    previewScroll: {
      flexDirection: 'row',
      gap: moderateScale(10),
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    imagePreviewContainer: {
      position: 'relative',
    },
    imagePreview: {
      width: verticalScale(80),
      height: verticalScale(80),
      borderRadius: verticalScale(8),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    removeIcon: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: 10,
    },
    addMorePreview: {
      justifyContent: 'center',
      alignItems: 'center',
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    bankSection: {
      gap: verticalScale(15),
    },
  });
