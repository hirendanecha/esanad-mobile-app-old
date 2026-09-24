import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { pick, types } from '@react-native-documents/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatNumber } from '@utils/formateNumber';
import { useThemeContext } from '@theme/ThemeProvider';
import {
  useContactAgent,
  useGetPolicySummary,
  useVerifyemiratesid,
  useUploademiratesid,
  useVerifydrivinglicense,
  useUploaddrivinglicense,
  useVerifycarregistrationcard,
  useUploadvehicledocuments,
} from '@hooks/policy/useMotorPolicy';
import { moderateScale, verticalScale } from '@constants/metrics';
import { CONSTANTS } from '@constants/staticJson';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import CustomCheckBox from '@components/ui/CustomCheckBox';
import CustomButton from '@components/ui/CustomButton';
import {
  policyCartStyle,
  style,
  documentStyles as docStyles,
} from './BuyPolicyScreen.styles';
import { PolicyInfoRow, FeatureItem } from './components/SupportComp';
import LinearGradient from 'react-native-linear-gradient';
import Header from '@components/ui/Header';
import moment from 'moment';
import { SCREEN_NAMES } from '@constants/screenNames';
import { Images } from '@assets/index';
import { ageCalculator } from '@utils/ageCalculator';

const SELECT_OPTIONS = [
  {
    label: 'Registration card',
    value: 'Registration card',
    isNew: false,
    requiredDoc: ['emiratesId', 'drivingLicense', 'registrationCard'],
  },
  {
    label: 'Transfer Certificate',
    value: 'Transfer Certificate',
    requiredDoc: ['emiratesId', 'drivingLicense', 'ownershipProofDocument'],
  },
  {
    label: 'Possession Certificate',
    value: 'Possession Certificate',
    requiredDoc: ['emiratesId', 'drivingLicense', 'ownershipProofDocument'],
  },
  {
    label: 'VCC Certificate',
    value: 'VCC Certificate',
    isNew: false,
    requiredDoc: [
      'emiratesId',
      'drivingLicense',
      'vehicleClearanceCertificate',
    ],
  },
  {
    label: 'VCC Certificate & New Car Document',
    value: 'VCC Certificate & New Car Document',
    isNew: false,
    requiredDoc: [
      'emiratesId',
      'drivingLicense',
      'newCarCard',
      'vehicleClearanceCertificate',
    ],
  },
];

const ALL_DOC_TYPES = {
  emiratesId: {
    label: 'Emirates ID',
    type: [types.pdf, types.images],
  },
  drivingLicense: {
    label: 'Driving License',
    type: [types.pdf, types.images],
  },
  registrationCard: {
    label: 'Registration Card',
    type: [types.pdf, types.images],
  },
  ownershipProofDocument: {
    label: 'Ownership Proof',
    type: [types.pdf, types.images],
  },
  vehicleClearanceCertificate: {
    label: 'VCC Certificate',
    type: [types.pdf, types.images],
  },
  newCarCard: {
    label: 'New Car Document',
    type: [types.pdf, types.images],
  },
};

const BuyPolicyScreen = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const policyStyle = policyCartStyle(theme);
  const documentStyles = docStyles(theme);

  const { policy_id } = route?.params || {};

  const { data: policySummaryData = {}, refetch } = useGetPolicySummary({
    id: policy_id,
  });

  console.log('policySummaryData', policySummaryData);

  const { mutate: contactAgent } = useContactAgent();
  const { mutate: verifyemiratesid } = useVerifyemiratesid();
  const { mutate: uploademiratesid } = useUploademiratesid();
  const { mutate: uploaddrivinglicense } = useUploaddrivinglicense();
  const { mutate: uploadvehicledocuments } = useUploadvehicledocuments();
  const { mutate: verifydrivinglicense } = useVerifydrivinglicense();
  const { mutate: verifycarregistrationcard } = useVerifycarregistrationcard();

  const [carSelectedOption, setCarSelectedOption] = useState('Renewal');
  const [docsArray, setDocsArray] = useState(CONSTANTS.RENEWAL_LIST);

  const [carSelectorValue, setCarSelectorValue] = useState('Renewal');
  const [carSelectorItems, setCarSelectorItems] = useState(
    CONSTANTS.NEW_OR_RENEWAL,
  );

  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState(false);
  const [discountAmount, setDiscountAmount] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [vatValue, setVatValue] = useState();

  const [selectedFiles, setSelectedFiles] = useState({});
  const [validationLoader, setValidationLoader] = useState({});
  const [documentStatus, setDocumentStatus] = useState({});
  const [registrationType, setRegistrationType] = useState('Registration card');

  const handleCarOptionChange = value => {
    setCarSelectedOption(value);
    if (value === 'Pre-Owned') {
      setDocsArray(CONSTANTS.PRE_OWNED_LIST);
    } else if (value === 'Renewal') {
      setDocsArray(CONSTANTS.RENEWAL_LIST);
    } else if (value === 'Brand New') {
      setDocsArray(CONSTANTS.BRAND_NEW_LIST);
    }
  };

  const getRequiredDocuments = () => {
    const option = SELECT_OPTIONS.find(opt => opt.value === registrationType);
    const requiredKeys = option
      ? option.requiredDoc
      : SELECT_OPTIONS[0].requiredDoc;

    return requiredKeys.map(key => ({
      key,
      label: ALL_DOC_TYPES[key]?.label || key,
      type: ALL_DOC_TYPES[key]?.type || [types.pdf, types.images],
    }));
  };

  const requiredDocuments = getRequiredDocuments();

  const isScanAllEnabled = () => {
    // Enable if no documents are uploaded yet
    return Object.keys(documentStatus).length === 0;
  };

  const scanAllDocuments = () => {
    // Placeholder for "Scan all" functionality
    Alert.alert('Scan All', 'Feature coming soon!');
  };

  const handleDocumentPick = async (docKey, type) => {
    try {
      const result = await pick({
        type: type,
        allowMultiSelection: true,
      });

      const file = result[0];
      // Update local state to show chosen file
      console.log('Final file object:', file);

      // setSelectedFiles(prev => ({ ...prev, [docKey]: file }));
      handleValidationCheck(docKey, [file]);
    } catch (err) {
      if (err.code !== 'RNDocumentPickerCanceled') {
        console.error('Picker error:', err);
      }
    }
  };

  const renderDocumentUpload = (docType, index) => {
    const status = documentStatus[docType.key];
    const isLoading = validationLoader[docType.key] || false;
    const error = documentStatus[docType.key] === 'error'; // Simplified error check or from sideValidation if used
    const file = selectedFiles[docType.key];
    const files = file ? [file] : [];

    return (
      <View key={index}>
        <Text style={documentStyles.documentTitle}>{docType.label}</Text>

        <TouchableOpacity
          style={[
            documentStyles.uploadButton,
            {
              borderColor: error
                ? theme.colors.red
                : status === 'uploaded'
                ? theme.colors.lableText
                : theme.colors.border,
            },
          ]}
          onPress={() => handleDocumentPick(docType.key, docType.type)}
          disabled={isLoading || status === 'uploaded'}
        >
          <View style={documentStyles.uploadContent}>
            {files.length > 0 ? (
              files[0]?.type?.includes('pdf') ||
              files[0]?.name?.toLowerCase().endsWith('.pdf') ? (
                <View style={documentStyles.imagePreviewContainer}>
                  <Pdf
                    source={{
                      uri: files[0]?.uri,
                      cache: true,
                    }}
                    trustAllCerts={false}
                    style={documentStyles.imagePreview}
                    singlePage={true}
                  />
                </View>
              ) : (
                <View style={documentStyles.imagePreviewContainer}>
                  <Image
                    source={{
                      uri: files[0]?.uri,
                    }}
                    style={documentStyles.imagePreview}
                    resizeMode="cover"
                  />
                </View>
              )
            ) : (
              <>
                <Icon
                  name="cloud-upload"
                  size={25}
                  color={
                    isLoading ? theme.colors.primary : theme.colors.textTertiary
                  }
                />
                <View style={documentStyles.uploadTextContainer}>
                  <Text style={documentStyles.uploadDescription}>
                    Drag and Drop your files, or{' '}
                    <Text style={documentStyles.browseText}>Browse file</Text>
                  </Text>
                  <Text style={documentStyles.fileFormatInfo}>
                    JPEG, PNG, PDF formats, up to 5MB
                  </Text>
                </View>
              </>
            )}
          </View>

          {status === 'uploaded' && !isLoading && (
            <View style={[documentStyles.statusIndicator]}>
              <Text
                style={[
                  documentStyles.statusText,
                  { color: theme.colors.lableText },
                ]}
              >
                Uploaded
              </Text>
            </View>
          )}
          {error && !isLoading && (
            <View style={[documentStyles.statusIndicator]}>
              <Text
                style={[documentStyles.statusText, { color: theme.colors.red }]}
              >
                Error
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const getQuoteData = {
    addOn: policySummaryData?.quote?.addOns,
    features: policySummaryData?.quote?.extraFeatures,
  };

  useEffect(() => {
    let result;
    let taxValue;
    if (policySummaryData?.quote?.voucher) {
      taxValue = (policySummaryData?.quote?.discountPrice * 5) / 100;
      result =
        policySummaryData?.quote?.discountPrice +
        parseInt(taxValue * 100) / 100 +
        policySummaryData?.quote?.adminFees;
    } else {
      taxValue = (policySummaryData?.quote?.totalPrice * 5) / 100;
      result =
        policySummaryData?.quote?.totalPrice +
        parseInt(taxValue * 100) / 100 +
        policySummaryData?.quote?.adminFees;
    }

    setVatValue(taxValue);
    setTotalAmount(result);
  }, [policySummaryData?.quote]);

  useEffect(() => {
    if (
      policySummaryData?.quote?.voucher &&
      policySummaryData?.quote?.discountPrice &&
      policySummaryData?.quote?.totalPrice
    ) {
      setDiscountAmount(
        +policySummaryData?.quote?.totalPrice -
          +policySummaryData?.quote?.discountPrice,
      );
    }
  }, [
    policySummaryData?.quote?.voucher,
    policySummaryData?.quote?.totalPrice,
    policySummaryData?.quote?.discountPrice,
  ]);

  useEffect(() => {
    let benefitsAmount = 0;
    let addonsAmount = 0;
    if (policySummaryData?.quote?.extraFeatures?.length > 0) {
      policySummaryData?.quote?.extraFeatures.map(item => {
        benefitsAmount += +item.Amount;
      });
    }
    if (policySummaryData?.quote?.addOns?.length > 0) {
      policySummaryData?.quote?.addOns.map(item => {
        addonsAmount += +item.price;
      });
    }
  }, [
    policySummaryData?.quote?.price,
    policySummaryData?.quote?.addOns,
    policySummaryData?.quote?.extraFeatures,
  ]);

  const USER_DATA = [
    {
      label: 'Name:',
      value: policySummaryData?.quote?.userId?.fullName,
    },
    {
      label: 'Mobile:',
      value: `+${policySummaryData?.quote?.userId?.countryCode} ${policySummaryData?.quote?.userId?.mobileNumber}`,
    },
    {
      label: 'Email:',
      value: policySummaryData?.quote?.userId?.email,
    },
    {
      label: 'Date of Birth:',
      value: moment(policySummaryData?.quote?.userId?.dateOfBirth).format(
        'DD/MM/YYYY',
      ),
    },
    {
      label: 'Age:',
      value:
        policySummaryData?.quote?.userId?.age ||
        ageCalculator(
          moment(policySummaryData?.quote?.userId?.dateOfBirth).format(),
        ) ||
        20,
    },
    {
      label: 'Nationality:',
      value: policySummaryData?.quote?.userId?.nationality,
    },
    {
      label: 'Policy Issue Date:',
      value: moment(
        policySummaryData?.quote?.carId?.policyEffectiveDate,
      ).format('DD/MM/YYYY'),
    },
    {
      label: 'Car Value:',
      value: policySummaryData?.quote?.carValue,
    },
    {
      label: 'Year of No. Claim:',
      value: policySummaryData?.quote?.carId?.yearOfNoClaim,
    },
  ];

  const CAR_DATA = [
    {
      label: 'Year:',
      value: policySummaryData?.quote?.carId?.year,
    },
    {
      label: 'No. of Seat:',
      value: policySummaryData?.quote?.carId?.noOfPassengers,
    },
    {
      label: 'Brand:',
      value: policySummaryData?.quote?.carId?.make,
    },
    {
      label: 'Cylinders:',
      value: policySummaryData?.quote?.carId?.cylinders,
    },
    {
      label: 'Model:',
      value: policySummaryData?.quote?.carId?.model,
    },
    {
      label: 'Value:',
      value:
        policySummaryData?.quote?.carId?.originalPrice &&
        `${policySummaryData?.quote?.carId?.originalPrice} AED`,
    },
    {
      label: 'Trim:',
      value: policySummaryData?.quote?.carId?.trim,
    },
    {
      label: 'Chassis No:',
      value:
        policySummaryData?.quote?.carId?.chassisNumber ||
        policySummaryData?.quote?.carId?.chesisNo ||
        '-',
    },
    {
      label: 'Regional Spec:',
      value: policySummaryData?.quote?.carId?.regionalSpec,
    },
    {
      label: 'Reg. Card TC No:',
      value: policySummaryData?.quote?.carId?.tcNo || '-',
    },
    {
      label: 'Body Type:',
      value: policySummaryData?.quote?.carId?.bodyType,
    },
    {
      label: 'Car Reg. Date:',
      value: moment(
        policySummaryData?.quote?.carId?.dateOfFirstRegister,
      ).format('DD/MM/YYYY'),
    },
    {
      label: 'No. of Doors:',
      value: policySummaryData?.quote?.carId?.noOfDoors,
    },
    {
      label: 'Reg. Card Expiry:',
      value: moment(policySummaryData?.quote?.carId?.regCardExpiryDate).format(
        'DD/MM/YYYY',
      ),
    },
  ];

  const POLICY_USER = [
    {
      label: 'Effective Date:',
      value: moment(
        policySummaryData?.quote?.carId?.policyEffectiveDate,
      ).format('DD/MM/YYYY'),
    },
    {
      label: 'Insurance Company:',
      value: policySummaryData?.quote?.company?.companyName,
    },
    {
      label: 'Current Insurance Type:',
      value:
        policySummaryData?.quote?.insuranceType == 'comprehensive'
          ? 'Comprehensive'
          : 'Third Party',
    },
    {
      label: 'Emirates:',
      value:
        policySummaryData?.quote?.carId?.emirate ||
        policySummaryData?.quote?.carId?.registrationEmirate ||
        '-',
    },
    {
      label: 'Nationality:',
      value: policySummaryData?.quote?.userId?.nationality,
    },
    {
      label: 'Excess:',
      value: policySummaryData?.quote?.isWithoutMatrixOrApi
        ? '---'
        : `AED ${policySummaryData?.quote?.excessPrice}`,
    },
  ];

  const handleContactAgent = () => {
    if (!isCheckBoxSelected) {
      Alert.alert(
        'Agreement Required',
        'Please agree to submit a Self-Declaration of Never Claim.',
      );
      return;
    }

    const payload = {
      isContact: true,
    };

    contactAgent(
      {
        id: policySummaryData?.quote?._id,
        data: payload,
      },
      {
        onSuccess: () => {
          navigation.navigate(SCREEN_NAMES.THANKYOU_SCREEN);
        },
        onError: error => {
          console.error('Contact agent error:', error);
          Alert.alert(
            'Error',
            'Failed to contact agent. Please try again later.',
          );
        },
      },
    );
  };

  const handleValidationCheck = async (imageKey, files = []) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', {
        uri: file.uri || file.fileCopyUri,
        type: file.type || 'image/jpeg',
        name: file.name || `file_${Date.now()}.jpg`,
      });
    });

    setValidationLoader(prev => ({ ...prev, [imageKey]: true }));

    const docConfig = {
      emiratesId: {
        verifyFn: verifyemiratesid,
        uploadFn: uploademiratesid,
        uploadKey: 'emiratesId',
        getCarId: () => policySummaryData?.quote?.motorInfoId?._id,
        extraFormData: null,
      },
      drivingLicense: {
        verifyFn: verifydrivinglicense,
        uploadFn: uploaddrivinglicense,
        uploadKey: 'drivingLicense',
        getCarId: () =>
          policySummaryData?.quote?.motorInfoId?._id ||
          policySummaryData?.quote?.carId?._id,
        extraFormData: null,
      },
      registrationCard: {
        verifyFn: verifycarregistrationcard,
        uploadFn: uploadvehicledocuments,
        uploadKey: 'registrationCard',
        getCarId: () => policySummaryData?.quote?.carId?._id,
        extraFormData: { documentType: 'registrationCard' },
      },
    };

    const currentDoc = docConfig[imageKey];

    if (!currentDoc) {
      setValidationLoader(prev => ({ ...prev, [imageKey]: false }));
      return;
    }

    currentDoc.verifyFn(formData, {
      onSuccess: res => {
        console.log(`data ${imageKey}`, res?.data?.data?.text);

        const uploadFormData = new FormData();
        uploadFormData.append('text', JSON.stringify(res?.data?.data?.text));

        if (currentDoc.extraFormData) {
          Object.entries(currentDoc.extraFormData).forEach(([k, v]) =>
            uploadFormData.append(k, v),
          );
        }

        files.forEach(file => {
          uploadFormData.append(currentDoc.uploadKey, {
            uri: file.uri || file.fileCopyUri,
            type: file.type || 'image/jpeg',
            name: file.name || `file_${Date.now()}.jpg`,
          });
        });

        const targetCarId = currentDoc.getCarId();

        currentDoc.uploadFn(
          {
            carId: targetCarId,
            data: uploadFormData,
          },
          {
            onSuccess: res => {
              console.log('Upload success', res);
              setDocumentStatus(prev => ({ ...prev, [imageKey]: 'uploaded' }));
              if (imageKey === 'registrationCard') {
                const url = res?.data?.data?.registrationCardP?.path;
                const file = {
                  uri: url,
                  name: 'registrationCard',
                  type: 'application/pdf',
                };
                setSelectedFiles(prev => ({ ...prev, [imageKey]: file }));
              }
              if (imageKey === 'emiratesId') {
                const url = res?.data?.data?.emiratesIdP?.path;
                const file = {
                  uri: url,
                  name: 'emiratesId',
                  type: 'application/pdf',
                };
                setSelectedFiles(prev => ({ ...prev, [imageKey]: file }));
              }
              if (imageKey === 'drivingLicense') {
                const url = res?.data?.data?.drivingLicenseP?.path;
                const file = {
                  uri: url,
                  name: 'drivingLicense',
                  type: 'application/pdf',
                };
                setSelectedFiles(prev => ({ ...prev, [imageKey]: file }));
              }
              // setSelectedFiles(prev => ({ ...prev, [imageKey]: files[0] }));
              setValidationLoader(prev => ({ ...prev, [imageKey]: false }));
            },
            onError: err => {
              console.log('Upload error', err);
              Alert.alert('Error', `Failed to upload ${imageKey}`);
              // setDocumentStatus(prev => ({ ...prev, [imageKey]: 'error' }));
              setValidationLoader(prev => ({ ...prev, [imageKey]: false }));
            },
          },
        );
      },
      onError: error => {
        console.log(error);
        Alert.alert('Error', 'Verification failed');
        setDocumentStatus(prev => ({ ...prev, [imageKey]: 'error' }));
        setValidationLoader(prev => ({ ...prev, [imageKey]: false }));
      },
    });
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Plan Review Detail" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View
          style={{
            backgroundColor: theme.colors.backgroundColor,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: verticalScale(10),
            padding: verticalScale(15),
            gap: verticalScale(20),
          }}
        >
          <Text style={styles.mainCardTitle}>Review Details</Text>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Personal</Text>
            {USER_DATA.map(({ label, value }, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}> {label} </Text>
                <Text style={styles.detailValue}>{value ?? '-'}</Text>
              </View>
            ))}
          </View>

          <View style={documentStyles.uploadSection}>
            {/* <CustomDropDownList
              title="Select Registration Type"
              value={registrationType}
              data={SELECT_OPTIONS}
              handleSelect={val => setRegistrationType(val)}
              showSearch={false}
              keyExtractor={item => item.value}
              searchPlaceholder="Select type..."
            /> */}
            {requiredDocuments.map((docType, index) =>
              renderDocumentUpload(docType, index),
            )}
          </View>

          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Vehicle</Text>
            <View
              style={{
                width: Dimensions.get('screen').width - 70,
                height: 220,
              }}
            >
              <Image
                source={
                  policySummaryData?.quote?.carId?.carImage
                    ? { uri: policySummaryData?.quote?.carId?.carImage }
                    : Images.CarPlace
                }
                resizeMode="stretch"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            <Text style={styles.detailsTitle}>Car Details:</Text>
            {CAR_DATA.map(({ label, value }, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}> {label} </Text>
                <Text style={styles.detailValue}>{value ?? '-'}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Policy</Text>
            {POLICY_USER.map(({ label, value }, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}> {label} </Text>
                <Text style={styles.detailValue}>{value ?? '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        {!policySummaryData?.quote?.isUaePass && (
          <View
            style={{
              borderRadius: verticalScale(10),
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.backgroundColor,
              padding: verticalScale(15),
              gap: verticalScale(15),
            }}
          >
            <Text
              style={{
                fontSize: verticalScale(16),
                fontFamily: 'Lato-Bold',
                color: theme.colors.text,
              }}
            >
              Additional Details
            </Text>

            <Text
              style={{
                fontSize: verticalScale(14),
                fontFamily: 'Lato-Regular',
                color: theme.colors.description,
              }}
            >
              All insurance companies will require few documents that are easy
              to obtain to finalize the policy, please select your car status to
              have an idea of what documents are needed.{'\n\n'}You have nothing
              to worry about, we will contact you to tell you the exact
              documents and provide various easy ways for you to share them with
              us so we finalize this in no time!
            </Text>

            <CustomDropDownList
              title="Select Car Status"
              value={carSelectorValue}
              data={carSelectorItems}
              handleSelect={val => {
                setCarSelectorValue(val);
                handleCarOptionChange(val);
              }}
              showSearch={false}
              keyExtractor={item => item.value.toString()}
              searchPlaceholder="Search select car status..."
              absolute
            />

            {/* Documents List */}
            <View style={styles.documentsListContainer}>
              <Text
                style={{
                  fontSize: verticalScale(14),
                  fontFamily: 'Lato-Bold',
                  color: theme.colors.primary,
                }}
              >
                Documents may needed in the case of {carSelectedOption} Cars:
              </Text>
              <View style={styles.documentsList}>
                {docsArray?.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Text
                      style={{
                        fontSize: verticalScale(14),
                        fontFamily: 'Lato-Regular',
                        color: theme.colors.description,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontSize: verticalScale(14),
                        fontFamily: 'Lato-Regular',
                        color: theme.colors.description,
                      }}
                    >
                      {doc}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {(policySummaryData?.quote?.response?.IncludedFeatures?.length > 0 ||
          getQuoteData?.features?.length > 0 ||
          policySummaryData?.quote?.addOns?.length > 0) && (
          <View
            style={{
              backgroundColor: theme.colors.backgroundColor,
              borderRadius: moderateScale(10),
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <CustomAccordion title="View Benefits">
              {policySummaryData?.quote?.response?.IncludedFeatures?.map(
                (feature, idx) => (
                  <FeatureItem
                    key={idx}
                    title={feature.Title}
                    isIncluded={true}
                    styles={policyStyle}
                  />
                ),
              )}
              {getQuoteData?.features?.map((feature, idx) => (
                <FeatureItem
                  key={idx}
                  title={feature.Title}
                  amount={feature.Amount}
                  isIncluded={feature.Amount === 0}
                  styles={policyStyle}
                />
              ))}
              {policySummaryData?.quote?.addOns?.map((feature, idx) => (
                <FeatureItem
                  key={idx}
                  title={feature?.productName}
                  amount={+feature.price}
                  styles={policyStyle}
                />
              ))}
            </CustomAccordion>
          </View>
        )}

        <View
          style={{
            borderRadius: verticalScale(10),
            borderWidth: 1,
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.backgroundColor,
            padding: verticalScale(15),
            gap: verticalScale(15),
          }}
        >
          <Text
            style={{
              fontSize: verticalScale(16),
              fontFamily: 'Lato-Bold',
              color: theme.colors.text,
            }}
          >
            Policy Details
          </Text>

          {!policySummaryData?.quote?.isWithoutMatrixOrApi && (
            <View
              style={{
                gap: verticalScale(10),
              }}
            >
              <PolicyInfoRow
                label="Premium"
                value={`AED ${formatNumber(
                  parseInt(policySummaryData?.quote?.totalPrice * 100) / 100,
                )}`}
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={policyStyle}
              />

              {policySummaryData?.quote?.voucher && (
                <PolicyInfoRow
                  label={`Discount ${
                    policySummaryData?.quote?.voucher?.discountType ===
                    'percentage'
                      ? `${policySummaryData?.quote?.voucher?.discountValue} %`
                      : ''
                  }`}
                  value={`- AED ${formatNumber(
                    Math.floor(parseInt(discountAmount * 100) / 100),
                  )}`}
                  labelColor={theme.colors.description}
                  valueColor={theme.colors.red}
                  styles={policyStyle}
                />
              )}

              <PolicyInfoRow
                label="Vat 5%"
                value={`AED ${formatNumber(
                  Math.floor(parseInt(vatValue * 100) / 100),
                )}`}
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={policyStyle}
              />
              <PolicyInfoRow
                label="Processing"
                value={`AED ${formatNumber(
                  policySummaryData?.quote?.adminFees,
                )}`}
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={policyStyle}
              />

              <PolicyInfoRow
                label="eSanad Club"
                value="AED 0"
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={policyStyle}
              />
            </View>
          )}

          <View style={policyStyle.totalSection}>
            <View style={policyStyle.infoRow}>
              <Text
                style={[
                  policyStyle.infoLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: 'Lato-Bold',
                  },
                ]}
              >
                Total Payable
              </Text>
              <Text
                style={[
                  policyStyle.infoValue,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: 'Lato-Bold',
                  },
                ]}
              >
                {policySummaryData?.quote?.isWithoutMatrixOrApi
                  ? 'Ask for price'
                  : `AED ${formatNumber(
                      Math.floor(parseInt(totalAmount * 100) / 100),
                    )}`}
              </Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={theme.colors.infoBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          useAngle
          angle={140}
          style={{
            borderRadius: verticalScale(10),
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <View
            style={{
              gap: verticalScale(20),
              padding: verticalScale(15),
            }}
          >
            <Text
              style={{
                color: theme.colors.textTertiary,
                fontSize: verticalScale(14),
                fontFamily: 'Lato-Regular',
              }}
            >
              By proceeding, you agree to our
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: 'Lato-Bold',
                }}
                onPress={() => console.log('terms')}
              >
                {' '}
                Terms & Conditions{' '}
              </Text>
              and provide your consent to process your personal data as per the
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: 'Lato-Bold',
                }}
                onPress={() => console.log('privacy')}
              >
                {' '}
                Privacy Policy
              </Text>
            </Text>

            <CustomCheckBox
              label={'I agree to submit a Self-Declaration of Never Claim.'}
              onChange={checked => setIsCheckBoxSelected(checked)}
              value={isCheckBoxSelected}
              checkedColor={theme.colors.primary}
              disabledColor={theme.colors.border}
            />

            {policySummaryData?.quote?.source !== 'Web UAE PASS' && (
              <CustomButton
                type={'secondary'}
                onPress={handleContactAgent}
                disabled={!isCheckBoxSelected}
                title={
                  !policySummaryData?.quote?.isWithoutMatrixOrApi
                    ? totalAmount?.toFixed(2) > 0
                      ? 'Contact To Agent'
                      : 'Ask for'
                    : 'Pay with cards'
                }
                buttonColor={theme.colors.primary}
                textColor={theme.colors.textSecondary}
              />
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

export default BuyPolicyScreen;
